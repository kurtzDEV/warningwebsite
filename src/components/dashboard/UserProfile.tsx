
import { useState, useEffect } from "react";
import { User, LogOut, Home, Package, History, CreditCard, ShieldAlert, Settings, Pencil, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NavItem from "@/components/dashboard/NavItem";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UserProfile = ({ activeTab, setActiveTab }: UserProfileProps) => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(profile?.avatar_url || "");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Atualizar campos quando o perfil mudar
  useEffect(() => {
    if (profile) {
      setName(profile.username || "");
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
      setLocation(profile.location || "");
      setAvatar(profile.avatar_url || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: name,
          bio: bio,
          website: website,
          location: location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores originais
    if (profile) {
      setName(profile.username || "");
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
      setLocation(profile.location || "");
      setAvatar(profile.avatar_url || "");
    }
    setIsEditing(false);
  };

  // Function to handle file selection for avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsLoading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setAvatar(publicUrl);
      
      toast({
        title: "Avatar atualizado!",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Abril 2025";
    try {
      if (user?.created_at) {
        const date = new Date(user.created_at);
        return format(date, "MMMM yyyy", { locale: ptBR });
      }
      return "Abril 2025";
    } catch (e) {
      return "Abril 2025";
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-warning-purple/20">
            <AvatarImage 
              src={profile?.avatar_url || user?.user_metadata?.avatar_url || avatar} 
              alt={name} 
            />
            <AvatarFallback className="bg-warning-purple/20 text-warning-purple">
              {(profile?.full_name || profile?.username || user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <label 
                htmlFor="avatar-upload" 
                className="w-full h-full rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
              >
                <Upload className="h-6 w-6 text-white" />
                <Input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome de usuário"
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio (opcional)"
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website (opcional)"
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Localização (opcional)"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-white">
                {profile?.full_name || profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}
              </h2>
              {profile?.bio && (
                <p className="text-white/70 text-sm mt-1">{profile.bio}</p>
              )}
              <p className="text-white/60 text-sm">{user?.email}</p>
              {profile?.website && (
                <p className="text-white/50 text-xs">
                  🌐 <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-warning-purple">
                    {profile.website}
                  </a>
                </p>
              )}
              {profile?.location && (
                <p className="text-white/50 text-xs">📍 {profile.location}</p>
              )}
              <p className="text-white/40 text-xs">Membro desde {formatDate(user?.created_at)}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          {isEditing ? (
            <>
              <Button 
                variant="default" 
                className="gradient-button hover-glow rounded-full"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:bg-warning-purple/20 hover:text-white"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:bg-warning-purple/20 hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-1" /> Editar
            </Button>
          )}
        </div>
      </div>
      
      <Separator className="bg-white/5 my-4" />
      
      <nav>
        <ul className="space-y-1">
          <NavItem 
            icon={<Home className="mr-2 h-4 w-4" />} 
            label="Visão Geral" 
            isActive={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
          />
          <NavItem 
            icon={<Package className="mr-2 h-4 w-4" />} 
            label="Meus Produtos" 
            isActive={activeTab === "products"} 
            onClick={() => setActiveTab("products")}
          />
          <NavItem 
            icon={<History className="mr-2 h-4 w-4" />} 
            label="Histórico de Compras" 
            isActive={activeTab === "history"} 
            onClick={() => setActiveTab("history")}
          />
          <NavItem 
            icon={<CreditCard className="mr-2 h-4 w-4" />} 
            label="Assinatura" 
            isActive={activeTab === "subscription"} 
            onClick={() => setActiveTab("subscription")}
          />
          <NavItem 
            icon={<ShieldAlert className="mr-2 h-4 w-4" />} 
            label="Segurança" 
            isActive={activeTab === "security"} 
            onClick={() => setActiveTab("security")}
          />
          <NavItem 
            icon={<Settings className="mr-2 h-4 w-4" />} 
            label="Configurações" 
            isActive={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")}
          />
        </ul>
      </nav>
      
      <Separator className="bg-white/5 my-4" />
      
      <Button 
        variant="ghost" 
        className="w-full justify-start text-white/60 hover:bg-warning-purple/10 hover:text-white"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" /> Sair
      </Button>
    </div>
  );
};

export default UserProfile;
