import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL((req as any).url);
  if (url.pathname === '/') {
    url.pathname = '/cards';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/',], // редиректим только корень
};
