
interface LicenseInfoProps {
  userData: {
    subscriptionType: string;
    subscriptionStatus: string;
    nextBilling: string;
    licenseKey: string;
  };
}

const LicenseInfo = ({ userData }: LicenseInfoProps) => {
  return (
    <div className="glass-card p-6 rounded-xl mb-6">
      <h3 className="text-xl font-bold mb-4 text-gradient">Sua Licença</h3>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <p className="text-white/60 mb-1">Tipo de Assinatura</p>
          <p className="text-white font-bold">{userData.subscriptionType}</p>
        </div>
        <div>
          <p className="text-white/60 mb-1">Status</p>
          <p className="text-green-500 font-medium">{userData.subscriptionStatus}</p>
        </div>
        <div>
          <p className="text-white/60 mb-1">Próxima Cobrança</p>
          <p className="text-white">{userData.nextBilling}</p>
        </div>
      </div>
      
      <div className="glass p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-white/80">Sua chave de licença:</p>
          <div className="font-mono font-medium text-warning-purple">{userData.licenseKey}</div>
        </div>
      </div>
    </div>
  );
};

export default LicenseInfo;
