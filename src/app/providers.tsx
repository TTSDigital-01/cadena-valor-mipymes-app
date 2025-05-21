// src/app/providers.tsx
// Este componente envuelve la aplicación para proporcionar el contexto de sesión de NextAuth.js.

'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { Session } from 'next-auth'; // Importa el tipo Session

// Define la interfaz para las props del componente, ahora incluyendo 'session'
interface Props {
  children: React.ReactNode;
  session: Session | null; // La sesión puede ser Session o null
}

// Componente AuthProvider que envuelve a los hijos con SessionProvider
export default function AuthProvider({ children, session }: Props) {
  return (
    // Pasamos la prop 'session' al SessionProvider
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}