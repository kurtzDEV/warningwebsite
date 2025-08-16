# 🚀 WarningWeb - Sistema de Bypass para FiveM

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/warningstory/deploys)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC.svg)](https://tailwindcss.com/)

> **WarningWeb** é uma plataforma moderna e segura para gerenciamento de bypasses para FiveM, oferecendo uma experiência premium para jogadores que buscam acessar servidores com proteções avançadas.

## ✨ Características Principais

### 🔐 **Autenticação Segura**
- **Login com Discord OAuth2** - Autenticação rápida e segura
- **Sistema de sessões** - Gerenciamento automático de tokens
- **Proteção de rotas** - Acesso restrito a usuários autenticados
- **Logout automático** - Por inatividade e segurança

### 🛡️ **Sistema de Segurança**
- **Row Level Security (RLS)** - Proteção de dados no Supabase
- **Validação robusta** - Sanitização de entradas e validação de formulários
- **Rate limiting** - Proteção contra ataques de força bruta
- **Headers de segurança** - CSP, XSS Protection, e outros headers

### 🎨 **Interface Moderna**
- **Design responsivo** - Funciona perfeitamente em desktop e mobile
- **Tema escuro** - Interface elegante e moderna
- **Animações suaves** - Transições e efeitos visuais
- **Componentes reutilizáveis** - Baseado em shadcn/ui

### 📊 **Dashboard Completo**
- **Perfil do usuário** - Gerenciamento de informações pessoais
- **Histórico de pedidos** - Acompanhamento de compras
- **Sistema de proteção** - Status de licenças e bypasses
- **Estatísticas do sistema** - Métricas e monitoramento

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **React 18** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface elegantes

### **Backend & Banco de Dados**
- **Supabase** - Backend-as-a-Service completo
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança em nível de linha
- **Real-time subscriptions** - Atualizações em tempo real

### **Autenticação & Segurança**
- **Discord OAuth2** - Autenticação social
- **JWT Tokens** - Gerenciamento de sessões
- **React Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Formulários performáticos

## 📦 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- App Discord configurado

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/warningweb.git
cd warningweb
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### **4. Configure o banco de dados**
Execute o arquivo `database_schema_fixed.sql` no SQL Editor do Supabase para criar as tabelas necessárias.

### **5. Configure o Discord OAuth**
1. Crie um app no [Discord Developer Portal](https://discord.com/developers/applications)
2. Configure as URLs de redirecionamento no Supabase
3. Habilite o provider Discord no Supabase Auth

## 🏗️ Estrutura do Projeto

```
warningweb/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── dashboard/      # Componentes do dashboard
│   │   └── navbar/         # Componentes de navegação
│   ├── contexts/           # Contextos React (Auth, Cart)
│   ├── hooks/              # Custom hooks
│   ├── integrations/       # Integrações externas (Supabase)
│   ├── lib/                # Utilitários e configurações
│   ├── pages/              # Páginas da aplicação
│   └── main.tsx           # Ponto de entrada
├── public/                 # Arquivos estáticos
├── database_schema_fixed.sql  # Schema do banco de dados
└── netlify.toml           # Configuração do Netlify
```
## 🔒 Segurança

### **Medidas Implementadas**
- ✅ Autenticação OAuth2 com Discord
- ✅ Row Level Security no Supabase
- ✅ Validação e sanitização de dados
- ✅ Rate limiting e proteção contra brute force
- ✅ Headers de segurança (CSP, XSS Protection)
- ✅ Logout automático por inatividade
- ✅ Monitoramento de atividades suspeitas

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Discord:** [Warning Bypass](https://discord.gg/warningbypass)
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/warningweb/issues)

## 🙏 Agradecimentos

- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de interface
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://reactjs.org/) - Biblioteca JavaScript

---

<div align="center">
  <p>Feito com ❤️ pela equipe WarningWeb</p>
  <p>
    <a href="https://warningstory.netlify.app">🌐 Site Oficial</a> •
    <a href="https://discord.gg/warningbypass">💬 Discord</a> •
    <a href="https://github.com/kurtzDEV/warningwebsite">📦 GitHub</a>
  </p>
</div>
