// src/app/(auth)/signup/page.tsx
// Esta es la página de registro de usuarios de tu aplicación.

'use client'; // Este componente se ejecuta en el navegador

import { useState } from 'react'; // Hook para manejar el estado local
import { useRouter } from 'next/navigation'; // Hook para manejar la navegación
import { signIn } from 'next-auth/react'; // Función para iniciar sesión automáticamente después del registro

export default function SignUpPage() {
  const [email, setEmail] = useState(''); // Estado para el email del usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar contraseña
  const [error, setError] = useState(''); // Estado para mostrar mensajes de error
  const router = useRouter(); // Instancia del router para redirecciones

  // Maneja el envío del formulario de registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(''); // Limpia cualquier error anterior

    // Valida que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Envía los datos de registro a tu API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parsea la respuesta del servidor

      // Manejo de errores de la API
      if (!response.ok) {
        setError(data.message || 'Error al registrar el usuario.');
        return;
      }

      // Si el registro fue exitoso, intenta iniciar sesión automáticamente
      const signInResult = await signIn('credentials', {
        redirect: false, // Evita la redirección automática
        email,
        password,
      });

      // Manejo del resultado del inicio de sesión automático
      if (signInResult?.error) {
        setError('Registro exitoso, pero no se pudo iniciar sesión automáticamente. Por favor, inicia sesión manualmente.');
      } else if (signInResult?.ok) {
        router.push('/'); // Si el inicio de sesión fue exitoso, redirige a la página principal
      }

    } catch (err) {
      // Captura errores inesperados de la red o del proceso
      setError('Ocurrió un error inesperado al registrar.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h1>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta? <a href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}