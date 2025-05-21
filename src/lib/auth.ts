// src/lib/auth.ts
// Este archivo contiene la configuración de autenticación para NextAuth.js.

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma'; // Importa la instancia de Prisma
import bcrypt from 'bcryptjs'; // Importa bcryptjs para la comparación de contraseñas

export const authOptions: NextAuthOptions = {
  // Configura los proveedores de autenticación
  providers: [
    CredentialsProvider({
      name: 'Credentials', // Nombre que se mostrará en la interfaz de inicio de sesión
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // Lógica para autorizar al usuario
      async authorize(credentials) {
        if (!credentials) {
          return null; // Si no hay credenciales, no se autoriza
        }

        // Busca el usuario por email en la base de datos
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Si el usuario no existe, no tiene passwordHash, o la contraseña no coincide, devuelve null
        if (!user || !user.passwordHash || !await bcrypt.compare(credentials.password, user.passwordHash)) {
          return null; // Autenticación fallida
        }

        // Si el usuario y la contraseña son correctos, devuelve el objeto de usuario
        return {
          id: user.id,
          email: user.email,
          // Asegúrate de que este objeto User tenga las propiedades que esperas en el JWT y la sesión
        };
      },
    }),
  ],
  // Configuración de callbacks para personalizar el comportamiento de la sesión y JWT
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario existe (después de authorize), añade sus propiedades al token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Si el token existe, y si session.user existe, añade las propiedades del token a la sesión
      if (token) {
        if (session.user) { // Verificación para asegurar que session.user no es undefined
          session.user.id = token.id;    // Ya no necesitas 'as string' debido a la extensión de tipos
          session.user.email = token.email; // Ya no necesitas 'as string' debido a la extensión de tipos
        }
      }
      return session;
    },
  },
  // Configuración de las páginas personalizadas de autenticación
  pages: {
    signIn: '/signin', // Ruta a tu página personalizada de inicio de sesión
  },
  // Estrategia de sesión: 'jwt' es la recomendada para App Router
  session: {
    strategy: 'jwt',
  },
  // Añade un secreto para firmar los tokens de sesión
  secret: process.env.NEXTAUTH_SECRET,
};