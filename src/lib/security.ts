// Utilitários de segurança para WarningWeb

// Rate limiting para tentativas de login
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

// Validação de força da senha
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting para login
export const checkRateLimit = (email: string): { allowed: boolean; remainingTime?: number } => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS && (now - attempts.lastAttempt) < LOCKOUT_DURATION) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 60000);
    return { allowed: false, remainingTime };
  }

  if ((now - attempts.lastAttempt) >= LOCKOUT_DURATION) {
    loginAttempts.delete(email);
  }

  return { allowed: true };
};

// Incrementar tentativas de login
export const incrementLoginAttempts = (email: string): void => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  
  attempts.count += 1;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
};

// Resetar tentativas de login
export const resetLoginAttempts = (email: string): void => {
  loginAttempts.delete(email);
};

// Sanitização de entrada
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .substring(0, 1000); // Limita o tamanho
};

// Validação de token JWT (básica)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Geração de token CSRF
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Validação de URL segura
export const isSecureURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.hostname === 'localhost';
  } catch {
    return false;
  }
};

// Detecção de atividade suspeita
export const detectSuspiciousActivity = (userAgent: string, ipAddress: string): boolean => {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
    /ruby/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
};

// Configurações de segurança
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  PASSWORD_MIN_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minuto
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;


