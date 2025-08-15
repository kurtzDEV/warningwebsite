
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

interface SettingsSectionProps {
  userData: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const SettingsSection = ({ userData }: SettingsSectionProps) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6 text-gradient">Configurações da Conta</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Perfil</h4>
          <p className="text-white/60 text-sm mb-4">Gerencie suas informações pessoais</p>
          <div className="flex items-center mb-4">
            <Avatar className="w-16 h-16 border-2 border-warning-purple/20 mr-4">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-warning-purple/20 text-warning-purple">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">{userData.name}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:bg-warning-purple/20 hover:text-white pl-0"
              >
                <Pencil className="h-3 w-3 mr-1" /> Alterar foto de perfil
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-4 rounded-lg">
              <p className="text-white/50 text-xs mb-1">Nome</p>
              <p className="text-white">{userData.name}</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-white/50 text-xs mb-1">E-mail</p>
              <p className="text-white">{userData.email}</p>
            </div>
          </div>
        </div>
        
        <Separator className="bg-white/5" />
        
        <div>
          <h4 className="font-medium mb-2">Notificações</h4>
          <p className="text-white/60 text-sm mb-4">Gerencie suas preferências de notificação</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-white">E-mail de atualização</Label>
                <p className="text-white/50 text-xs">Receba e-mails sobre atualizações de produtos</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="discord-notifications" className="text-white">Notificações Discord</Label>
                <p className="text-white/50 text-xs">Receba notificações em nosso Discord</p>
              </div>
              <Switch id="discord-notifications" />
            </div>
          </div>
        </div>
        
        <Separator className="bg-white/5" />
        
        <div>
          <h4 className="font-medium mb-2">Preferências de Moeda</h4>
          <p className="text-white/60 text-sm mb-4">Escolha sua moeda preferida para visualizar preços</p>
          <div className="flex space-x-4">
            <Button className="flex items-center">
              <span className="mr-2">🇧🇷</span> BRL (R$)
            </Button>
            <Button variant="outline" className="border-white/20 text-white/70">
              <span className="mr-2">🇺🇸</span> USD ($)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
