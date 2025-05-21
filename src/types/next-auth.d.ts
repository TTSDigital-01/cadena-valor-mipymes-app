// src/types/next-auth.d.ts
// Este archivo extiende los tipos predeterminados de NextAuth.js
// para incluir propiedades personalizadas que estamos añadiendo a la sesión y al token.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

// Declaramos un módulo para "next-auth" para extender sus interfaces
declare module "next-auth" {
  // Extendemos la interfaz Session para incluir las propiedades de usuario personalizadas
  interface Session {
    user: {
      id: string; // Añadimos la propiedad 'id' al usuario en la sesión
      email: string; // Añadimos la propiedad 'email' al usuario en la sesión
      // Nota: 'name' e 'image' ya están incluidos por DefaultSession["user"]
    } & DefaultSession["user"]; // Combina con las propiedades de usuario por defecto
  }

  // Opcional: Extender la interfaz 'User' si tu objeto 'user'
  // retornado en el callback 'authorize' tiene propiedades adicionales
  // que quieres que TypeScript reconozca globalmente para todos los usuarios.
  interface User {
    id: string; // El ID del usuario
    email: string; // El correo electrónico del usuario
    // passwordHash?: string; // Podrías añadir esto si tu User de Prisma lo tiene y lo necesitas tipado aquí
  }
}

// Declaramos un módulo para "next-auth/jwt" para extender su interfaz JWT
declare module "next-auth/jwt" {
  // Extendemos la interfaz JWT para incluir las propiedades personalizadas
  interface JWT {
    id: string; // El ID del usuario en el token
    email: string; // El correo electrónico del usuario en el token
    // ... otras propiedades que añades al token JWT
  }
}