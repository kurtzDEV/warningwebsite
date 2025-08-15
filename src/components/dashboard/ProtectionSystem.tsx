
import { useState, useEffect } from 'react';

const ProtectionSystem = () => {
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCode(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <pre className="text-xs text-warning-purple font-mono">
          {showCode ? (
            `01001101 01100001 01110100 01110010 01101001 01111000
            0x4857F10A 0xDE34A291 0xCF5621E0
            function bypassSecurity() {
              return detectScan ? false : true;
            }
            KERNEL_MODE = TRUE;
            00110100 01010111 01000110 00110001`
          ) : (
            `10110100 10011010 10001011 10001001
            0xAB217FF0 0x123DEF33 0x021DE4A1
            while(true) {
              if(detection) { avoid(); }
              hideProcess(self.id);
            }
            TRACE_BLOCKED = TRUE;
            11001001 10101100 10001110 11101001`
          )}
        </pre>
      </div>
      
      <h3 className="text-warning-purple font-bold text-lg mb-3 relative">Sistema de Proteção</h3>
      <p className="text-white/70 text-sm relative mb-4">Seu sistema está protegido e funcionando corretamente.</p>
      <div className="flex justify-between items-center relative">
        <span className="text-white/50 text-xs">Status:</span>
        <span className="text-warning-purple font-bold flex items-center">
          <span className="w-2 h-2 bg-warning-purple rounded-full mr-2 animate-pulse"></span>
          Ativo
        </span>
      </div>
    </div>
  );
};

export default ProtectionSystem;
