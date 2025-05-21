// src/app/auth/singup/layout.tsx
// Este es el layout para el grupo de rutas de autenticación (ej. /auth/signin, /auth/signup).
// Simplemente renderiza sus hijos, que serán las páginas de autenticación.

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* El contenido de las páginas signin/signup se renderizará aquí */}
      {children}
    </div>
  );
}