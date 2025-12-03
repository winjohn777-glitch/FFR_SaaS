import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function getOrganizationId() {
  try {
    const organization = await prisma.organization.findFirst();
    if (organization) {
      console.log(`Organization ID: ${organization.id}`);
      console.log(`Organization Name: ${organization.legalName}`);
      return organization.id;
    } else {
      console.log('No organization found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  getOrganizationId();
}

export default getOrganizationId;