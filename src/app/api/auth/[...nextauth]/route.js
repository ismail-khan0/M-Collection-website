// authOptions.ts
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../model/user";
import bcrypt from "bcryptjs";
import connectMongoDB from "../../../../../lib/connectMongoDB "; 

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        admin: { type: 'boolean', optional: true }
      },
      async authorize(credentials) {
        try {
          await connectMongoDB();

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const user = await User.findOne({ email: credentials.email });
          if (!user) throw new Error('Invalid credentials');

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) throw new Error('Invalid credentials');

          if (credentials.admin && !user.isAdmin) {
            throw new Error('Admin privileges required');
          }

          return {
            id: user._id.toString(),
            name: user.fullname,
            email: user.email,
            isAdmin: user.isAdmin
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/signin',
    error: '/admin/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };