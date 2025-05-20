// src/app/(auth)/signup/page.tsx
// Página de registro de usuarios para la aplicación.
// Permite a los nuevos usuarios crear una cuenta.

'use client'; // Este componente se ejecuta en el navegador del usuario

import { useState } from 'react'; // Hook para manejar el estado local (email, password, error, etc.)
import { useRouter } from 'next/navigation'; // Hook para la navegación programática (redirigir)
import { signIn } from 'next-auth/react'; // Función de NextAuth.js para iniciar sesión automáticamente después del registro

// Componente principal de la página de registro
export default function SignUpPage() {
  // Estados locales para el formulario y mensajes de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Para confirmar la contraseña
  const [error, setError] = useState(''); // Estado para mostrar mensajes de error

  const router = useRouter(); // Instancia del router para redirigir al usuario

  // Manejador del evento de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(''); // Limpia cualquier mensaje de error previo

    // 1. Validar que las contraseñas coincidan en el frontend
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return; // Detiene la ejecución si no coinciden
    }

    // 2. Llamar a una API Route para registrar al usuario en el backend
    // Crearemos esta API Route en la próxima tarea (Tarea 1.4)
    try {
      const response = await fetch('/api/register', { // Ruta de la API Route de registro
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Envía email y password al backend
      });

      const data = await response.json(); // Espera la respuesta en formato JSON

      // 3. Verificar si el registro fue exitoso (basado en la respuesta de la API)
      if (!response.ok) {
        // Si la respuesta no es OK (ej. status 400, 500), muestra el mensaje de error del backend
        setError(data.message || 'Error al registrar el usuario.');
        console.error("Error de registro:", data.message); // Log en consola
        return;
      }

      // 4. Si el registro fue exitoso (response.ok es true)
      // Opcional: Intentar iniciar sesión automáticamente después del registro
      const signInResult = await signIn('credentials', {
        redirect: false, // Evita la redirección automática por parte de NextAuth.js
        email, // Usa el email ingresado para el registro
        password, // Usa la contraseña ingresada para el registro
      });

      // 5. Verificar el resultado del inicio de sesión automático
      if (signInResult?.error) {
        // Si hay un error al iniciar sesión automáticamente
        setError('Registro exitoso, pero no se pudo iniciar sesión automáticamente. Por favor, inicia sesión manualmente.');
        console.error("Error al iniciar sesión después del registro:", signInResult.error);
        // Podrías redirigir a la página de login si no quieres mostrar este error aquí: router.push('/auth/signin');
      } else if (signInResult?.ok) {
        // Si el inicio de sesión automático fue exitoso
        router.push('/'); // Redirige al usuario a la página principal (o al dashboard)
      }

    } catch (err) {
      // Captura cualquier error inesperado durante la llamada a la API
      setError('Ocurrió un error inesperado al registrar.');
      console.error("Error inesperado:", err);
    }
  };

  return (
    // Estructura básica de la página con estilos de Tailwind CSS
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Título del formulario */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h1>

        {/* Formulario de registro */}
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
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado 'email'
              required // Campo obligatorio
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
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado 'password'
              required // Campo obligatorio
            />
          </div>

          {/* Campo de Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
              value={confirmPassword} // Enlaza el valor del input con el estado
              onChange={(e) => setConfirmPassword(e.target.value)} // Actualiza el estado
              required // Campo obligatorio
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
            Registrarse
          </button>
        </form>

        {/* Enlace a la página de inicio de sesión */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta? <a href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}
