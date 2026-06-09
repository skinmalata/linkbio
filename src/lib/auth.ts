import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getItem, putItem, updateItem } from "@/lib/dynamodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await getItem(`GOOGLE#${user.id}`, "PROFILE");
        if (!existing) {
          const userId = crypto.randomUUID();
          await putItem(`GOOGLE#${user.id}`, "PROFILE", { userId });
          await putItem(`USER#${userId}`, "PROFILE", {
            name: user.name,
            email: user.email,
            image: user.image,
            isPro: false,
          });
          const username = (user.name || "user").toLowerCase().replace(/\s+/g, "") + userId.slice(0, 4);
          await putItem(`USERNAME#${username}`, "PROFILE", { userId });
          await updateItem(`USER#${userId}`, "PROFILE", { username });
          user.id = userId;
        } else {
          const profile = await getItem(`USER#${existing.userId}`, "PROFILE");
          user.id = existing.userId as string;
          if (profile) {
            user.name = (profile as any).name || user.name;
            user.image = (profile as any).image || user.image;
          }
        }
        return true;
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        const profile = (await getItem(`USER#${token.sub}`, "PROFILE")) as any;
        if (profile) {
          session.user.isPro = profile.isPro || false;
          session.user.username = profile.username;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});
