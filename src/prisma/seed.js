import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin padrão
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vcitransportes.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@vcitransportes.com.br',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Usuário admin criado:', admin.email);

  // Criar usuário operacional padrão
  const operPassword = await bcrypt.hash('oper123', 10);
  
  const operacional = await prisma.user.upsert({
    where: { email: 'operacional@vcitransportes.com.br' },
    update: {},
    create: {
      name: 'Usuário Operacional',
      email: 'operacional@vcitransportes.com.br',
      passwordHash: operPassword,
      role: 'OPERACIONAL'
    }
  });

  console.log('✅ Usuário operacional criado:', operacional.email);

  // Criar cliente de exemplo
  const cliente = await prisma.client.upsert({
    where: { cnpj: '12345678000190' },
    update: {},
    create: {
      cnpj: '12345678000190',
      razaoSocial: 'CLIENTE EXEMPLO LTDA',
      nomeFantasia: 'Cliente Exemplo',
      emailFaturamento: 'faturamento@exemplo.com.br',
      telefone: '11999999999',
      endereco: 'Rua Exemplo, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000'
    }
  });

  console.log('✅ Cliente exemplo criado:', cliente.razaoSocial);

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   Admin: admin@vcitransportes.com.br / admin123');
  console.log('   Operacional: operacional@vcitransportes.com.br / oper123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
