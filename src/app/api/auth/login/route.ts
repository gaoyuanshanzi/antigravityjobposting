import { NextResponse } from 'next/server';
import { login } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_ID || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || '123jesus';

    if (username === validUsername && password === validPassword) {
      await login();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
