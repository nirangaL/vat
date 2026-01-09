import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Tenant A
  const tenantA = await prisma.organization.create({
    data: {
      name: 'ABC VAT Consultants',
      slug: 'abc-vat',
      tin: '1234567890',
      email: 'admin@abc-vat.com',
      subscription_status: 'active',
      subscription_plan: 'professional',
    },
  });

  // Create User for Tenant A
  const userA = await prisma.user.create({
    data: {
      organization_id: tenantA.id,
      email: 'team@abc-vat.com',
      password_hash: await bcrypt.hash('password', 10),
      full_name: 'Team Member',
      role: 'VAT_TEAM_LEAD',
    },
  });

  // Create Client for Tenant A
  const clientA = await prisma.client.create({
    data: {
      organization_id: tenantA.id,
      company_name: 'Client A Company',
      tin: '0987654321',
      taxable_period: 'quarterly',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
