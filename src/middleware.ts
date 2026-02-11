import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import NextAuth from 'next-auth';
import {authConfig} from './auth.config';
import {NextRequest} from 'next/server';

const intlMiddleware = createMiddleware(routing);

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.split('/')[2] === 'dashboard' || req.nextUrl.pathname.split('/')[1] === 'dashboard';
  
  // If user is not logged in and trying to access dashboard, next-auth handles redirect in authConfig.authorized?
  // Actually, next-auth's `auth` wrapper will call `authorized`.
  
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/', 
    '/(nl|en|tr|ar)/:path*', 
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)$).*)'
  ]
};
