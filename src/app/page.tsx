// src/app/page.tsx
// Esta es la página principal de la aplicación.
// Verifica si el usuario está autenticado y lo redirige si no lo está.

'use client'; // Este componente se ejecuta en el navegador

import { useSession, signOut } from 'next-auth/react'; // Hooks para obtener la sesión y cerrar sesión
import { useRouter } from 'next/navigation'; // Hook para redirigir
import { useEffect } from 'react'; // Hook para efectos secundarios

export default function HomePage() {
  // Obtiene el estado de la sesión del usuario
  const { data: session, status } = useSession();
  const router = useRouter(); // Instancia del router

  // Efecto secundario que se ejecuta cuando cambia el estado de la sesión
  useEffect(() => {
    // Si el estado es 'unauthenticated' (no logueado) y no está cargando
    if (status === 'unauthenticated') {
      // Redirige al usuario a la página de inicio de sesión
      router.push('/auth/signin');
    }
  }, [status, router]); // Dependencias del efecto: se ejecuta si status o router cambian

  // Si el estado de la sesión es 'loading', muestra un mensaje de carga
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Cargando sesión...</p>
      </div>
    );
  }

  // Si el estado es 'authenticated' (logueado)
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {/* Mensaje de bienvenida al usuario autenticado */}
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Bienvenido, {session?.user?.email}!
          </h1>
          <p className="text-gray-600 mb-6">
            Has iniciado sesión correctamente.
          </p>

          {/* Botón para cerrar sesión */}
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })} // Llama a signOut y redirige al login
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Si llegamos aquí, significa que el usuario no está autenticado y ya fue redirigido por el useEffect
  // No necesitamos renderizar nada más en este caso, ya que el useEffect se encargará de la redirección.
  return null;
}
