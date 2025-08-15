import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DebugAuth = () => {
  const { user, profile, loading, session } = useAuth();

  const clearAuth = async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <Card className="glass-card border-red-500/20">
      <CardHeader>
        <CardTitle className="text-red-400">Debug - Status da Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Loading:</strong> {loading ? "Sim" : "Não"}
          </div>
          <div>
            <strong>Session:</strong> {session ? "Sim" : "Não"}
          </div>
          <div>
            <strong>User:</strong> {user ? "Sim" : "Não"}
          </div>
          <div>
            <strong>Profile:</strong> {profile ? "Sim" : "Não"}
          </div>
        </div>
        
        {user && (
          <div className="text-xs space-y-1">
            <div><strong>User ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Provider:</strong> {user.user_metadata?.provider || "N/A"}</div>
          </div>
        )}
        
        {profile && (
          <div className="text-xs space-y-1">
            <div><strong>Profile ID:</strong> {profile.id}</div>
            <div><strong>Username:</strong> {profile.username}</div>
            <div><strong>Avatar:</strong> {profile.avatar_url ? "Sim" : "Não"}</div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={clearAuth}
          >
            Limpar Auth
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            Recarregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugAuth;
