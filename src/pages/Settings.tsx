import { User, Bell, Shield, Palette, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground md:text-2xl">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas preferências</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Section */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Perfil
              </CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-xl font-semibold text-primary-foreground">
                  AA
                </div>
                <div>
                  <h3 className="font-medium">Abraão Anaissi</h3>
                  <p className="text-sm text-muted-foreground">abraao@portoex.com.br</p>
                  <p className="text-xs text-muted-foreground">Administrador • TI</p>
                </div>
              </div>
              <Separator />
              <Button variant="outline" className="w-full sm:w-auto">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </CardTitle>
              <CardDescription>Configure como receber alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push">Notificações Push</Label>
                  <p className="text-xs text-muted-foreground">Receba alertas em tempo real</p>
                </div>
                <Switch id="push" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email">Notificações por Email</Label>
                  <p className="text-xs text-muted-foreground">Resumo diário de atividades</p>
                </div>
                <Switch id="email" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task">Alertas de Tarefas</Label>
                  <p className="text-xs text-muted-foreground">Lembretes de prazos</p>
                </div>
                <Switch id="task" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Aparência
              </CardTitle>
              <CardDescription>Personalize a interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact">Modo Compacto</Label>
                  <p className="text-xs text-muted-foreground">Reduz espaçamentos na interface</p>
                </div>
                <Switch id="compact" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations">Animações</Label>
                  <p className="text-xs text-muted-foreground">Efeitos visuais na interface</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Alterar Senha
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Autenticação em 2 Fatores
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Dispositivos Conectados
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-in border-destructive/50" style={{ animationDelay: "400ms" }}>
            <CardContent className="p-4">
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
