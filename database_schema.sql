-- Schema do banco de dados para WarningWeb
-- Execute este SQL no painel do Supabase (SQL Editor)

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  full_name TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estatísticas do usuário
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_logins INTEGER DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE,
  total_sessions INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de login
CREATE TABLE IF NOT EXISTS login_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  location TEXT
);

-- Tabela de atividades do usuário
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos/licenças
CREATE TABLE IF NOT EXISTS user_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  license_key TEXT,
  metadata JSONB
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  privacy_level TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para registrar login
CREATE OR REPLACE FUNCTION register_login(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Atualizar estatísticas do usuário
  INSERT INTO user_stats (id, total_logins, last_login, total_sessions)
  VALUES (user_uuid, 1, NOW(), 1)
  ON CONFLICT (id) DO UPDATE SET
    total_logins = user_stats.total_logins + 1,
    last_login = NOW(),
    total_sessions = user_stats.total_sessions + 1,
    updated_at = NOW();
  
  -- Registrar sessão de login
  INSERT INTO login_sessions (user_id, login_time, ip_address, user_agent)
  VALUES (user_uuid, NOW(), inet_client_addr(), current_setting('request.headers')::json->>'user-agent');
  
  -- Registrar atividade
  INSERT INTO user_activities (user_id, activity_type, activity_data)
  VALUES (user_uuid, 'login', jsonb_build_object('ip', inet_client_addr(), 'user_agent', current_setting('request.headers')::json->>'user-agent'));
END;
$$ LANGUAGE plpgsql;

-- Função para registrar logout
CREATE OR REPLACE FUNCTION register_logout(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  session_id UUID;
BEGIN
  -- Encontrar a sessão mais recente do usuário
  SELECT id INTO session_id
  FROM login_sessions
  WHERE user_id = user_uuid AND logout_time IS NULL
  ORDER BY login_time DESC
  LIMIT 1;
  
  IF session_id IS NOT NULL THEN
    -- Atualizar sessão com logout
    UPDATE login_sessions
    SET logout_time = NOW(),
        duration_minutes = EXTRACT(EPOCH FROM (NOW() - login_time)) / 60
    WHERE id = session_id;
    
    -- Atualizar duração total nas estatísticas
    UPDATE user_stats
    SET total_duration_minutes = total_duration_minutes + 
        (SELECT duration_minutes FROM login_sessions WHERE id = session_id),
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Registrar atividade
    INSERT INTO user_activities (user_id, activity_type, activity_data)
    VALUES (user_uuid, 'logout', jsonb_build_object('session_duration_minutes', 
      (SELECT duration_minutes FROM login_sessions WHERE id = session_id)));
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Políticas RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para user_stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para login_sessions
CREATE POLICY "Users can view own sessions" ON login_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON login_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_activities
CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_products
CREATE POLICY "Users can view own products" ON user_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON user_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_login_sessions_user_id ON login_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_sessions_login_time ON login_sessions(login_time);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
