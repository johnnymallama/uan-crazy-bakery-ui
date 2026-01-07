import { type NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid } = body;

    if (!uid) {
      return new NextResponse(JSON.stringify({ message: 'UID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await getUserById(uid);
    const userRole = user.tipo.toLowerCase();

    const sessionData = {
        uid: user.id,
        role: userRole,
    };

    const response = new NextResponse(JSON.stringify({
      status: 'success',
      role: userRole,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.cookies.set('session', JSON.stringify(sessionData), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;

  } catch (error) {
    console.error('[API/AUTH/LOGIN] Error:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error or User not found' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
