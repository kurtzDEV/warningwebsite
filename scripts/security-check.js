#!/usr/bin/env node

/**
 * Script de Verificação de Segurança - WarningWeb
 * Executa verificações automáticas de segurança no projeto
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Verificação de Segurança - WarningWeb\n');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Verificações
const checks = {
  // Verificar se arquivos de segurança existem
  securityFiles: () => {
    log.header('Verificando arquivos de segurança...');
    
    const requiredFiles = [
      'src/lib/security.ts',
      'src/components/SecurityMonitor.tsx',
      'public/security-headers.json',
      'SECURITY.md'
    ];
    
    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        log.success(`${file} encontrado`);
      } else {
        log.error(`${file} não encontrado`);
      }
    });
  },

  // Verificar dependências de segurança
  securityDependencies: () => {
    log.header('Verificando dependências de segurança...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const securityPackages = [
        'helmet',
        'express-rate-limit',
        'cors',
        'helmet-csp',
        'express-validator'
      ];
      
      securityPackages.forEach(pkg => {
        if (dependencies[pkg]) {
          log.success(`${pkg} instalado`);
        } else {
          log.warning(`${pkg} não encontrado - considere instalar`);
        }
      });
    } catch (error) {
      log.error('Erro ao ler package.json');
    }
  },

  // Verificar configurações do Supabase
  supabaseConfig: () => {
    log.header('Verificando configuração do Supabase...');
    
    try {
      const clientFile = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');
      
      if (clientFile.includes('SUPABASE_URL') && clientFile.includes('SUPABASE_PUBLISHABLE_KEY')) {
        log.success('Configuração do Supabase encontrada');
      } else {
        log.error('Configuração do Supabase incompleta');
      }
      
      if (clientFile.includes('flowType: \'pkce\'')) {
        log.success('PKCE habilitado para autenticação');
      } else {
        log.warning('PKCE não encontrado - considere habilitar');
      }
    } catch (error) {
      log.error('Erro ao verificar configuração do Supabase');
    }
  },

  // Verificar headers de segurança
  securityHeaders: () => {
    log.header('Verificando headers de segurança...');
    
    try {
      const headersConfig = JSON.parse(fs.readFileSync('public/security-headers.json', 'utf8'));
      const requiredHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security'
      ];
      
      requiredHeaders.forEach(header => {
        if (headersConfig.securityHeaders[header]) {
          log.success(`${header} configurado`);
        } else {
          log.error(`${header} não configurado`);
        }
      });
    } catch (error) {
      log.error('Erro ao verificar headers de segurança');
    }
  },

  // Verificar validações de entrada
  inputValidation: () => {
    log.header('Verificando validações de entrada...');
    
    try {
      const securityFile = fs.readFileSync('src/lib/security.ts', 'utf8');
      
      const validations = [
        'validatePassword',
        'validateEmail',
        'sanitizeInput',
        'checkRateLimit'
      ];
      
      validations.forEach(validation => {
        if (securityFile.includes(validation)) {
          log.success(`${validation} implementado`);
        } else {
          log.error(`${validation} não implementado`);
        }
      });
    } catch (error) {
      log.error('Erro ao verificar validações de entrada');
    }
  },

  // Verificar monitoramento de segurança
  securityMonitoring: () => {
    log.header('Verificando monitoramento de segurança...');
    
    try {
      const monitorFile = fs.readFileSync('src/components/SecurityMonitor.tsx', 'utf8');
      
      const monitoringFeatures = [
        'detectSuspiciousActivity',
        'checkSession',
        'checkInactivity',
        'logSuspiciousActivity'
      ];
      
      monitoringFeatures.forEach(feature => {
        if (monitorFile.includes(feature)) {
          log.success(`${feature} implementado`);
        } else {
          log.warning(`${feature} não encontrado`);
        }
      });
    } catch (error) {
      log.error('Erro ao verificar monitoramento de segurança');
    }
  },

  // Verificar proteção de rotas
  routeProtection: () => {
    log.header('Verificando proteção de rotas...');
    
    try {
      const protectedRouteFile = fs.readFileSync('src/components/ProtectedRoute.tsx', 'utf8');
      
      if (protectedRouteFile.includes('ProtectedRoute')) {
        log.success('ProtectedRoute implementado');
      } else {
        log.error('ProtectedRoute não encontrado');
      }
      
      const appFile = fs.readFileSync('src/App.tsx', 'utf8');
      if (appFile.includes('ProtectedRoute')) {
        log.success('Rotas protegidas configuradas');
      } else {
        log.warning('Rotas protegidas não configuradas');
      }
    } catch (error) {
      log.error('Erro ao verificar proteção de rotas');
    }
  },

  // Verificar configurações de ambiente
  environmentConfig: () => {
    log.header('Verificando configurações de ambiente...');
    
    const envFiles = ['.env', '.env.local', '.env.production'];
    
    envFiles.forEach(file => {
      if (fs.existsSync(file)) {
        log.info(`${file} encontrado`);
      } else {
        log.warning(`${file} não encontrado`);
      }
    });
  },

  // Verificar SSL/HTTPS
  sslCheck: () => {
    log.header('Verificando configurações SSL...');
    
    try {
      const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
      
      if (viteConfig.includes('https: true')) {
        log.success('HTTPS habilitado no desenvolvimento');
      } else {
        log.info('HTTPS não configurado no desenvolvimento (normal para dev)');
      }
    } catch (error) {
      log.warning('Não foi possível verificar configuração SSL');
    }
  }
};

// Executar todas as verificações
async function runSecurityChecks() {
  try {
    Object.values(checks).forEach(check => {
      try {
        check();
      } catch (error) {
        log.error(`Erro na verificação: ${error.message}`);
      }
    });
    
    log.header('Verificação de segurança concluída!');
    log.info('Para mais informações, consulte o arquivo SECURITY.md');
    
  } catch (error) {
    log.error(`Erro geral na verificação: ${error.message}`);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runSecurityChecks();
}

module.exports = { checks, runSecurityChecks };


