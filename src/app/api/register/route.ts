// src/app/api/register/route.ts
// Esta API Route maneja las solicitudes de registro de nuevos usuarios.

import { NextResponse } from 'next/server'; // Para enviar respuestas HTTP
import prisma from '@/lib/prisma'; // Importamos la instancia de Prisma Client
import bcrypt from 'bcryptjs'; // Para encriptar contraseñas

// Función asíncrona que maneja las solicitudes POST a /api/register
export async function POST(request: Request) {
  try {
    // 1. Obtener los datos del cuerpo de la solicitud (email y password)
    const { email, password } = await request.json();

    // 2. Validar que se recibieron email y password
    if (!email || !password) {
      // Si faltan datos, enviar una respuesta de error
      return NextResponse.json({ message: 'Faltan email o contraseña.' }, { status: 400 });
    }

    // 3. Verificar si ya existe un usuario con este email
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // Si el email ya está registrado, enviar un error
      return NextResponse.json({ message: 'El email ya está registrado.' }, { status: 409 }); // 409 Conflict
    }

    // 4. Encriptar la contraseña de forma segura
    // Generamos un "salt" (valor aleatorio) y luego hasheamos la contraseña con el salt
    const salt = await bcrypt.genSalt(10); // 10 es el número de rondas de hashing, un buen valor por defecto
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Crear el nuevo usuario en la base de datos usando Prisma
    const newUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        // Otros campos del modelo User pueden tener valores por defecto o ser opcionales
        // role: "MIPYME_USER" (ya tiene un valor por defecto en schema.prisma)
      },
    });

    // 6. Si el usuario se creó correctamente, enviar una respuesta de éxito
    // No incluyas el passwordHash en la respuesta por seguridad.
    return NextResponse.json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      }
    }, { status: 201 }); // 201 Created

  } catch (error) {
    // 7. Manejar cualquier error inesperado durante el proceso
    console.error('Error en el registro de usuario:', error);
    return NextResponse.json({ message: 'Ocurrió un error interno en el servidor.' }, { status: 500 });
  }
}

// También puedes definir handlers para otros métodos HTTP si los necesitas (GET, PUT, DELETE)
// export async function GET(request: Request) { ... }
