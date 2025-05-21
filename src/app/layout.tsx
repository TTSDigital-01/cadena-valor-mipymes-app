// src/app/layout.tsx
// Este es el layout principal de tu aplicación Next.js.
// Define la estructura HTML básica y envuelve la aplicación con proveedores globales.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers"; // Importa el componente AuthProvider
import { getServerSession } from "next-auth"; // Importa getServerSession
import { authOptions } from "@/lib/auth"; // Importa la configuración de authOptions

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiPyme BSC DB",
  description: "Aplicación web para automatizar la elaboración de procesos con cadena de valor y Balanced Scorecard para Mipymes.",
};

// Hacemos el componente asíncrono para poder usar await getServerSession
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtenemos la sesión en el lado del servidor
  const session = await getServerSession(authOptions);

  return (
    // ¡ATENCIÓN! Las etiquetas <html> y <body> están en la misma línea
    // para eliminar CUALQUIER posibilidad de espacio en blanco entre ellas.
    <html lang="es">
      <body className={inter.className}>
        {/* Pasamos la sesión al AuthProvider */}
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}