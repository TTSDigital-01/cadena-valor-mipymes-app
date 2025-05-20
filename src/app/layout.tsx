// src/app/layout.tsx
// Este es el layout principal de tu aplicación Next.js.
// Define la estructura HTML básica y envuelve la aplicación con proveedores globales.
// Formateado para evitar errores de hidratación por espacios en blanco.

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importa la fuente Inter (si la usas)
import "./globals.css"; // Importa los estilos globales de Tailwind CSS
import AuthProvider from "./providers"; // Importa el componente AuthProvider que creamos

// Configura la fuente Inter (si la usas)
const inter = Inter({ subsets: ["latin"] });

// Define los metadatos de la página (título, descripción, etc.)
export const metadata: Metadata = {
  title: "MiPyme BSC DB", // Título de tu aplicación
  description: "Aplicación web para automatizar la elaboración de procesos con cadena de valor y Balanced Scorecard para Mipymes.", // Descripción de tu aplicación
};

// Componente RootLayout: el layout principal que envuelve toda la aplicación
export default function RootLayout({
  children, // 'children' representa el contenido de las páginas anidadas o layouts
}: Readonly<{
  children: React.ReactNode; // Define el tipo de 'children' como un nodo de React
}>) {
  return (
    // Estructura HTML básica con la etiqueta <html> y <body>
    // ¡Importante! Asegúrate de que no haya espacios en blanco o nuevas líneas
    // directamente entre las etiquetas <html> y <body>, y </body> y </html>
    <html lang="es"> {/* Define el idioma de la página */}
      {/* Aplica la clase de la fuente Inter al body */}
      <body className={inter.className}>
        {/*
          Envuelve toda la aplicación (children) con el AuthProvider.
          Esto permite que cualquier componente dentro de la aplicación
          tenga acceso a la sesión del usuario a través de los hooks de NextAuth.js.
        */}
        <AuthProvider>
          {children} {/* Renderiza el contenido de las páginas/layouts */}
        </AuthProvider>
      </body>
    </html>
  );
}
