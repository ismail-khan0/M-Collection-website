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
        await connectMongoDB();

        if (!credentials.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        if (credentials.admin && !user.isAdmin) {
          throw new Error('Admin privileges required');
        }

        return {
          id: user._id.toString(),
          name: user.fullname,
          email: user.email,
          isAdmin: user.isAdmin
        };
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
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/signin',
    error: '/admin/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };