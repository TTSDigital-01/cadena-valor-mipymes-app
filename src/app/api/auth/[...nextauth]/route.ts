// src/app/api/auth/[...nextauth]/route.ts
// Este archivo configura las rutas de API de NextAuth.js para la autenticación.
// Ahora importa las authOptions de un archivo de configuración separado.

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // <--- Importamos authOptions desde src/lib/auth.ts

// Definimos un solo handler de NextAuth con las opciones importadas
const handler = NextAuth(authOptions);

// Exportamos el handler para los métodos HTTP GET y POST.
// Next.js espera que este archivo solo exporte funciones de método HTTP.
export { handler as GET, handler as POST };