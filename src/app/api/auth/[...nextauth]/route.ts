// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Importamos la instancia de Prisma que acabamos de crear
import bcrypt from "bcryptjs"; // Para comparar contraseñas

export const authOptions = {
  // Configuración del adaptador de Prisma para NextAuth.js
  adapter: PrismaAdapter(prisma),

  // Proveedores de autenticación
  providers: [
    CredentialsProvider({
      name: "Credentials", // Nombre del proveedor (para la interfaz de usuario, si la hay)
      credentials: {
        email: { label: "Email", type: "text", placeholder: "tuemail@ejemplo.com" },
        password: { label: "Password", type: "password" }
      },
      // Función que se ejecuta cuando un usuario intenta iniciar sesión con credenciales
      async authorize(credentials, req) {
        // 1. Validar que se proporcionaron email y contraseña
        if (!credentials?.email || !credentials?.password) {
          return null; // Credenciales incompletas, no se puede autorizar
        }

        // 2. Buscar el usuario en la base de datos usando Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 3. Verificar si el usuario existe y tiene un hash de contraseña
        if (!user || !user.passwordHash) {
          // Si el usuario no se encuentra, o si usó un proveedor OAuth y no tiene passwordHash,
          // no se puede autenticar con credenciales.
          return null;
        }

        // 4. Comparar la contraseña proporcionada con el hash guardado (seguridad)
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        // 5. Si la contraseña no es válida
        if (!isPasswordValid) {
          return null;
        }

        // 6. Si las credenciales son válidas, retornar el objeto del usuario
        // Esta información se guardará en la sesión.
        // Importante: ¡Nunca retornes el passwordHash aquí!
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Incluimos el rol para control de acceso posterior
        };
      },
    }),
    // Opcional: Puedes añadir otros proveedores como GoogleProvider, GitHubProvider, etc. aquí
    // Ejemplo (descomenta y configura si lo necesitas):
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID, // Debes añadir GOOGLE_CLIENT_ID a tu .env
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Debes añadir GOOGLE_CLIENT_SECRET a tu .env
    // }),
  ],

  // Estrategia de sesión
  session: {
    strategy: "jwt", // Usamos JSON Web Tokens para sesiones escalables
    maxAge: 30 * 24 * 60 * 60, // Duración de la sesión: 30 días
  },

  // Páginas personalizadas para NextAuth.js
  pages: {
    signIn: "/auth/signin", // Redirige a esta ruta para el inicio de sesión
    // signOut: "/auth/signout", // Opcional: si tienes una página de cierre de sesión personalizada
    // error: "/auth/error",     // Opcional: para manejar errores de autenticación
  },

  // Callbacks para personalizar el token JWT y la sesión
  callbacks: {
    // Se ejecuta al crear un token JWT (después de iniciar sesión)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Añade el rol del usuario al token
      }
      return token;
    },
    // Se ejecuta cada vez que se accede a la sesión
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string; // Asegura que el ID esté en la sesión
        session.user.role = token.role as string; // Asegura que el rol esté en la sesión
      }
      return session;
    },
  },

  // Secreto para firmar y verificar tokens de sesión.
  // Debe ser una cadena de texto larga y aleatoria.
  // Añade NEXTAUTH_SECRET a tu archivo .env
  secret: process.env.NEXTAUTH_SECRET,
};

// Exportamos los handlers para las rutas API de Next.js
// Next.js automáticamente mapeará las solicitudes GET y POST a esta configuración.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };