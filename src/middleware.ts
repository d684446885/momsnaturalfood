import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import NextAuth from 'next-auth';
import {authConfig} from './auth.config';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/', 
    '/(nl|en|tr|ar)/:path*', 
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)$).*)'
  ]
};
