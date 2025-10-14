import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // если вдруг / исчезнет из билда, отправим на карточки
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/cards/bio', req.url));
  }
  return NextResponse.next();
}

// Ничего не защищаем в этом файле. Авторизацию проверяем уже в самих страницах.
export const config = { matcher: ['/((?!_next|static|favicon.ico|robots.txt|sitemap.xml).*)'] };
