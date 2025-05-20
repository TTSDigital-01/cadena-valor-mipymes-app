// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Variable global para almacenar la instancia de PrismaClient
// Esto es necesario para que hot-reloading no cree nuevas instancias de PrismaClient
// en desarrollo, lo que podría agotar las conexiones a la base de datos.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Crea o reutiliza la instancia de PrismaClient
export const prisma = global.prisma || new PrismaClient();

// En producción, asigna la instancia a la variable global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;