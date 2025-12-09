import { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Box, Image, 
  FileText, ArrowLeft, Eye, Upload, X, Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Environment {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  has3D: boolean;
  has2D: boolean;
  resources: number;
}

const initialEnvironments: Environment[] = [
  { id: "1", name: "Geral", code: "GRL", description: "Visão geral das instalações", icon: "🏢", has3D: true, has2D: true, resources: 5 },
  { id: "2", name: "Recepção", code: "RCP", description: "Área de recepção e atendimento", icon: "🚪", has3D: true, has2D: false, resources: 3 },
  { id: "3", name: "Armazém", code: "ARM", description: "Área de armazenamento principal", icon: "📦", has3D: true, has2D: true, resources: 8 },
  { id: "4", name: "Escritórios", code: "ESC", description: "Área administrativa", icon: "💼", has3D: false, has2D: true, resources: 4 },
  { id: "5", name: "Pátio", code: "PAT", description: "Área externa e estacionamento", icon: "🅿️", has3D: true, has2D: true, resources: 6 },
  { id: "6", name: "Sala de Reuniões", code: "REU", description: "Salas de conferência", icon: "🎯", has3D: false, has2D: true, resources: 2 },
];

export default function AdminEnvironments() {
  const [environments, setEnvironments] = useState(initialEnvironments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    icon: "🏢",
  });

  const filteredEnvironments = environments.filter(
    (env) =>
      env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (env?: Environment) => {
    if (env) {
      setEditingEnv(env);
      setFormData({
        name: env.name,
        code: env.code,
        description: env.description,
        icon: env.icon,
      });
    } else {
      setEditingEnv(null);
      setFormData({ name: "", code: "", description: "", icon: "🏢" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingEnv) {
      setEnvironments(
        environments.map((env) =>
          env.id === editingEnv.id
            ? { ...env, ...formData }
            : env
        )
      );
      toast({ title: "Ambiente atualizado com sucesso!" });
    } else {
      const newEnv: Environment = {
        id: Date.now().toString(),
        ...formData,
        has3D: false,
        has2D: false,
        resources: 0,
      };
      setEnvironments([...environments, newEnv]);
      toast({ title: "Ambiente criado com sucesso!" });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setEnvironments(environments.filter((env) => env.id !== id));
    toast({ title: "Ambiente removido" });
  };

  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground md:text-2xl">
              🏗️ Gerenciar Ambientes 3D
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure os ambientes do Centro de Distribuição
            </p>
          </div>
        </div>
        <Button variant="hero" onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Novo Ambiente
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ambientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Environments Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEnvironments.map((env, index) => (
          <Card 
            key={env.id} 
            variant="interactive"
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                    {env.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{env.name}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {env.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {env.description}
              </p>

              {/* Resources */}
              <div className="mb-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    env.has3D
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Box className="h-3 w-3" />
                  3D
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    env.has2D
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Image className="h-3 w-3" />
                  2D
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  <FileText className="h-3 w-3" />
                  {env.resources} recursos
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleOpenModal(env)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(env.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEnvironments.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum ambiente encontrado</p>
        </Card>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEnv ? "Editar Ambiente" : "Novo Ambiente"}
            </DialogTitle>
            <DialogDescription>
              {editingEnv
                ? "Atualize as informações do ambiente"
                : "Adicione um novo ambiente ao sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label>Ícone</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="text-center text-xl"
                  maxLength={2}
                />
              </div>
              <div className="col-span-3">
                <Label>Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Armazém Principal"
                />
              </div>
            </div>

            <div>
              <Label>Código *</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="Ex: ARM"
                maxLength={5}
                className="font-mono uppercase"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o ambiente..."
              />
            </div>

            <div className="rounded-lg border-2 border-dashed border-muted p-6 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arraste arquivos 3D ou 2D aqui
              </p>
              <p className="text-xs text-muted-foreground">
                GLB, FBX, OBJ, PNG, JPG
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="hero" onClick={handleSave}>
              <Check className="h-4 w-4" />
              {editingEnv ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
