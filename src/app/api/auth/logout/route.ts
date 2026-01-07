import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create a response to clear the session cookie
    const response = new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Set the cookie with an immediate expiration date
    response.cookies.set('session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Expire the cookie immediately
    });

    return response;

  } catch (error) {
    console.error('[API/AUTH/LOGOUT] Error:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
