import { Search, Filter, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  sector: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  avatar: string;
}

const mockTeam: TeamMember[] = [
  {
    id: "1",
    name: "Abraão Anaissi",
    role: "Administrador",
    sector: "TI",
    email: "abraao@portoex.com.br",
    phone: "(11) 99999-0001",
    status: "active",
    avatar: "AA",
  },
  {
    id: "2",
    name: "Maria Silva",
    role: "Analista",
    sector: "Comércio Exterior",
    email: "maria@portoex.com.br",
    phone: "(11) 99999-0002",
    status: "active",
    avatar: "MS",
  },
  {
    id: "3",
    name: "João Santos",
    role: "Coordenador",
    sector: "Financeiro",
    email: "joao@portoex.com.br",
    phone: "(11) 99999-0003",
    status: "active",
    avatar: "JS",
  },
  {
    id: "4",
    name: "Ana Costa",
    role: "Gerente",
    sector: "Comercial",
    email: "ana@portoex.com.br",
    phone: "(11) 99999-0004",
    status: "active",
    avatar: "AC",
  },
  {
    id: "5",
    name: "Carlos Oliveira",
    role: "Supervisor",
    sector: "Operacional",
    email: "carlos@portoex.com.br",
    phone: "(11) 99999-0005",
    status: "inactive",
    avatar: "CO",
  },
  {
    id: "6",
    name: "Pedro Alves",
    role: "Desenvolvedor",
    sector: "TI",
    email: "pedro@portoex.com.br",
    phone: "(11) 99999-0006",
    status: "active",
    avatar: "PA",
  },
];

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeam = mockTeam.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground md:text-2xl">Equipe</h1>
        <p className="text-sm text-muted-foreground">
          {mockTeam.filter((m) => m.status === "active").length} colaboradores ativos
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar colaboradores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeam.map((member) => (
          <Card key={member.id} variant="interactive" className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {member.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                      member.status === "active" ? "bg-green-500" : "bg-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <span className="mt-1 inline-block rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                    {member.sector}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="h-4 w-4" />
                  Ligar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum colaborador encontrado</p>
        </Card>
      )}
    </div>
  );
}
