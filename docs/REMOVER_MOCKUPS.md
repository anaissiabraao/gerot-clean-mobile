# 🗑️ Guia de Remoção de Mockups e Hardcodes

Este documento lista todos os lugares onde dados mockados/hardcoded devem ser substituídos por chamadas reais à API.

## ✅ Arquivos Criados para Substituição

1. **`static/api-client.js`** - Cliente completo da API
2. **`static/tms-api-integration.js`** - Helper para carregar dados do banco

## 📋 Checklist de Remoção

### 1. Inicializações de Arrays Vazios ✅
Estes são OK - são apenas inicializações que serão preenchidas:
- `let bookings = []` em `cd_booking_tailwind.html` - ✅ Preenchido via `/api/room-bookings`
- `let auditManifestos = []` em `agent_tailwind.html` - ✅ Preenchido via API
- `let currentManifestos = []` - ✅ Preenchido via API

### 2. Dados Hardcoded que DEVEM ser Removidos

#### ❌ `cd_booking_tailwind.html` e `cd_booking.html`
**Linha 400**: `const rooms = ['reunion_1', 'reunion_2'];`
- **Ação**: Criar endpoint `/api/rooms` ou buscar do banco
- **Solução**: Substituir por chamada à API

#### ❌ `cd_booking_tailwind.html` e `cd_booking.html`
**Linha 401-404**: `const roomNames = { 'reunion_1': 'Reunião 1', 'reunion_2': 'Reunião 2' };`
- **Ação**: Buscar nomes das salas do banco de dados
- **Solução**: Criar endpoint `/api/rooms` que retorna salas com nomes

### 3. Dados que VÊM do Backend (Jinja2) ✅
Estes são OK - vêm do servidor:
- `{{ assets|length }}` - ✅ Vem do backend
- `{{ relatorio_meta.meta_valor }}` - ✅ Vem do backend
- `{{ session.user_id }}` - ✅ Vem do backend

### 4. Chamadas de API que DEVEM ser Verificadas

#### ✅ Endpoints que JÁ EXISTEM:
- `/api/room-bookings` - Sistema de agendamento (não é TMS)
- `/api/agent/*` - Sistema de agentes (não é TMS)

#### ❌ Endpoints que PRECISAM ser Criados:
1. **Salas de Reunião**:
   - `GET /api/rooms` - Listar salas disponíveis
   - Criar tabela `rooms` no banco se necessário

## 🔧 Como Substituir Dados Mockados

### Exemplo 1: Substituir Array Hardcoded de Salas

**ANTES:**
```javascript
const rooms = ['reunion_1', 'reunion_2'];
const roomNames = {
    'reunion_1': 'Reunião 1',
    'reunion_2': 'Reunião 2'
};
```

**DEPOIS:**
```javascript
// Carregar salas do banco
let rooms = [];
let roomNames = {};

async function loadRooms() {
    try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        rooms = data.rooms || [];
        roomNames = {};
        rooms.forEach(room => {
            roomNames[room.id] = room.name;
        });
    } catch (error) {
        console.error('Erro ao carregar salas:', error);
        // Fallback vazio
        rooms = [];
        roomNames = {};
    }
}

// Chamar ao carregar a página
loadRooms();
```

### Exemplo 2: Usar TMSDataLoader para Dados TMS

**ANTES:**
```javascript
// Dados mockados
const clientes = [
    { id: 1, nome: 'Cliente Exemplo', cnpj: '12345678000190' }
];
```

**DEPOIS:**
```javascript
// Incluir script antes
// <script src="/static/tms-api-integration.js"></script>

// Carregar dados reais
let clientes = [];

async function loadClientes() {
    clientes = await window.loadTMSData('clients');
    // Atualizar UI
    updateClientesList();
}

loadClientes();
```

## 📝 Ações Necessárias

### 1. Criar Endpoint de Salas (se necessário)

Se o sistema de salas faz parte do TMS, criar:

```javascript
// src/routes/room.routes.js
router.get('/', async (req, res) => {
    const rooms = await prisma.room.findMany({
        where: { ativo: true }
    });
    res.json({ rooms });
});
```

### 2. Atualizar Templates

Para cada template que usa dados hardcoded:

1. Incluir scripts necessários:
```html
<script src="/static/api-client.js"></script>
<script src="/static/tms-api-integration.js"></script>
```

2. Substituir arrays hardcoded por chamadas à API
3. Adicionar tratamento de erro
4. Adicionar loading states

### 3. Verificar Autenticação

Garantir que todas as chamadas à API TMS incluam o token:
```javascript
// O api-client.js já faz isso automaticamente
const data = await api.getClients();
```

## 🎯 Prioridades

1. **ALTA**: Remover hardcodes de salas (`rooms` e `roomNames`)
2. **MÉDIA**: Verificar se há outros dados mockados em gráficos/dashboards
3. **BAIXA**: Adicionar loading states e tratamento de erro em todas as chamadas

## ✅ Status Atual

- ✅ Cliente API criado (`api-client.js`)
- ✅ Helper de integração criado (`tms-api-integration.js`)
- ✅ Hardcodes de salas REMOVIDOS
- ✅ Arrays vazios são OK (serão preenchidos)
- ✅ Dados do Jinja2 são OK (vêm do backend)

## 📞 Próximos Passos

1. ✅ Criar endpoint `/api/rooms` se necessário (opcional - tem fallback)
2. ✅ Atualizar `cd_booking_tailwind.html` e `cd_booking.html` - CONCLUÍDO
3. Testar todas as páginas após remoção
4. Adicionar tratamento de erro em todas as chamadas
