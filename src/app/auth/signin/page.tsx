// src/app/(auth)/signin/page.tsx
// Esta es la página de inicio de sesión de tu aplicación.

'use client'; // Este componente se ejecuta en el navegador

import { useState } from 'react'; // Hook para manejar el estado local
import { signIn } from 'next-auth/react'; // Función para iniciar sesión con NextAuth.js
import { useRouter } from 'next/navigation'; // Hook para manejar la navegación

export default function SignInPage() {
  const [email, setEmail] = useState(''); // Estado para el email del usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña del usuario
  const [error, setError] = useState(''); // Estado para mostrar mensajes de error
  const router = useRouter(); // Instancia del router para redirecciones

  // Maneja el envío del formulario de inicio de sesión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(''); // Limpia cualquier error anterior

    // Intenta iniciar sesión con las credenciales proporcionadas
    const result = await signIn('credentials', {
      redirect: false, // Evita la redirección automática por parte de NextAuth.js
      email,
      password,
    });

    // Manejo de errores o éxito del inicio de sesión
    if (result?.error) {
      setError(result.error); // Establece el mensaje de error
      console.error("Error de inicio de sesión:", result.error); // Muestra el error en consola
    } else if (result?.ok) {
      router.push('/'); // Si el inicio de sesión fue exitoso, redirige a la página principal
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta? <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}