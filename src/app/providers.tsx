// src/app/providers.tsx
// Este componente envuelve la aplicación para proporcionar el contexto de sesión de NextAuth.js.

'use client'; // Indica que este es un componente de cliente que se ejecuta en el navegador.

import { SessionProvider } from 'next-auth/react'; // Importa el SessionProvider de NextAuth.js
import React from 'react'; // Importa React

// Define la interfaz para las props del componente (los hijos que va a envolver)
interface Props {
  children: React.ReactNode; // 'children' es el contenido que se renderizará dentro del proveedor
}

// Componente AuthProvider que envuelve a los hijos con SessionProvider
export default function AuthProvider({ children }: Props) {
  return (
    // SessionProvider proporciona el contexto de sesión a todos los componentes anidados.
    // Los hooks de NextAuth.js (como useSession, signIn, signOut) se usarán dentro de los 'children'.
    <SessionProvider>
      {children} {/* Renderiza los componentes hijos */}
    </SessionProvider>
  );
}
