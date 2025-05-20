// src/app/(auth)/signin/page.tsx
// Página de inicio de sesión para la aplicación.
// Utiliza NextAuth.js para manejar el proceso de autenticación.

'use client'; // Este componente se ejecuta en el navegador del usuario

import { useState } from 'react'; // Hook para manejar el estado local (email, password, error)
import { signIn } from 'next-auth/react'; // Función de NextAuth.js para iniciar sesión
import { useRouter } from 'next/navigation'; // Hook para la navegación programática (redirigir)

// Componente principal de la página de inicio de sesión
export default function SignInPage() {
  // Estados locales para el formulario y mensajes de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para mostrar mensajes de error

  const router = useRouter(); // Instancia del router para redirigir al usuario

  // Manejador del evento de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    setError(''); // Limpia cualquier mensaje de error previo

    // Llama a la función signIn de NextAuth.js
    // 'credentials' es el ID del proveedor que configuramos en src/app/api/auth/[...nextauth]/route.ts
    const result = await signIn('credentials', {
      redirect: false, // Importante: No redirigir automáticamente, manejaremos la redirección manualmente
      email, // Pasa el email ingresado por el usuario
      password, // Pasa la contraseña ingresada por el usuario
    });

    // Verifica el resultado del intento de inicio de sesión
    if (result?.error) {
      // Si hay un error (ej. credenciales inválidas), muestra el mensaje de error
      setError(result.error);
      console.error("Error de inicio de sesión:", result.error); // Log en consola para depuración
    } else if (result?.ok) {
      // Si el inicio de sesión fue exitoso (result.ok es true)
      router.push('/'); // Redirige al usuario a la página principal (o a donde desees después del login)
    }
  };

  return (
    // Estructura básica de la página con estilos de Tailwind CSS para centrar el formulario
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Título del formulario */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h1>

        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="tuemail@ejemplo.com"
              value={email} // Enlaza el valor del input con el estado 'email'
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado 'email' al escribir
              required // Hace que el campo sea obligatorio
            />
          </div>

          {/* Campo de Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
              value={password} // Enlaza el valor del input con el estado 'password'
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado 'password' al escribir
              required // Hace que el campo sea obligatorio
            />
          </div>

          {/* Mostrar mensaje de error si existe */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Botón de envío del formulario */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace a la página de registro */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta? <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}
