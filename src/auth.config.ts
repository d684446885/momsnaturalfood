import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;
      
      const pathname = nextUrl.pathname;
      const locales = ['/en', '/nl', '/tr', '/ar'];
      
      const checkPath = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`) || 
               locales.some(loc => pathname === `${loc}${path}` || pathname.startsWith(`${loc}${path}/`));
      };

      const isOnDashboard = checkPath('/dashboard');
      const isOnAccount = checkPath('/account');
      const isOnLogin = checkPath('/login');
      const isOnRegister = checkPath('/register');

      if (isOnDashboard) {
        if (isLoggedIn) {
          if (role === 'ADMIN') return true;
          return Response.redirect(new URL('/', nextUrl));
        }
        return false; // Redirect to login
      }
      
      if (isOnAccount) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        const target = role === 'ADMIN' ? '/dashboard' : '/account';
        return Response.redirect(new URL(target, nextUrl));
      }

      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
