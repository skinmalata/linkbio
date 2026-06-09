import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getItem, putItem } from "./dynamodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existing = await getItem(`USER#${user.email}`, "PROFILE");
      if (!existing) {
        const base = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
        const username = base + Math.random().toString(36).slice(2, 6);

        await putItem({
          PK: `USER#${user.email}`,
          SK: "PROFILE",
          userId: user.email,
          email: user.email,
          name: user.name || "Anonymous",
          image: user.image || "",
          username,
          bio: "",
          theme: JSON.stringify({
            background: "bg-gradient-to-br from-purple-500 to-pink-500",
            cardStyle: "rounded-2xl shadow-lg",
            textColor: "text-white",
            buttonStyle: "rounded-full",
            font: "font-sans",
          }),
          isPro: false,
          createdAt: new Date().toISOString(),
        });

        await putItem({
          PK: `USERNAME#${username}`,
          SK: "PROFILE",
          userId: user.email,
        });
      }

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.id = session.user.email;
        const profile = await getItem(`USER#${session.user.email}`, "PROFILE");
        if (profile) {
          session.user.username = profile.username;
          session.user.name = profile.name;
          session.user.image = profile.image;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
