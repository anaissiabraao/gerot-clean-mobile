import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { OccurrenceProvider } from '../hooks/useOccurrences.jsx'
import BaseDeDados from '../components/BaseDeDados'
import Categorizacao from '../components/Categorizacao'
import DashboardTab from '../components/DashboardTab'
import MatrizImpacto from '../components/MatrizImpacto'
import { Database, Tags, BarChart3, Grid3X3, Truck } from 'lucide-react'

export default function Insights() {
  return (
    <OccurrenceProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container max-w-[1400px] mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  PortoEx
                  <span className="text-accent ml-1.5 font-extrabold">|</span>
                  <span className="text-sm font-medium text-muted-foreground ml-1.5">Controle de Ocorrências</span>
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container max-w-[1400px] mx-auto px-4 py-5">
          <Tabs defaultValue="base" className="space-y-4">
            <TabsList className="bg-muted/60 p-1 h-auto flex-wrap">
              <TabsTrigger value="base" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Database className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Base de Dados</span>
                <span className="sm:hidden">Dados</span>
              </TabsTrigger>
              <TabsTrigger value="categorias" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Tags className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Categorização</span>
                <span className="sm:hidden">Categ.</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <BarChart3 className="h-3.5 w-3.5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="matriz" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Grid3X3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Matriz de Impacto</span>
                <span className="sm:hidden">Matriz</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="base">
              <BaseDeDados />
            </TabsContent>
            <TabsContent value="categorias">
              <Categorizacao />
            </TabsContent>
            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="matriz">
              <MatrizImpacto />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </OccurrenceProvider>
  )
}
