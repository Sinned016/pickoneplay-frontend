import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation/navbar";
import AuthInitializer from "@/components/authInitializer";
import { cookies } from "next/headers";


const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PickOnePlay",
  description: "PickOnePlay is a 'would you rather' game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  // Fetch user and pass it to AuthInitializer
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
    method: "GET",
    headers: {
      // IMPORTANT: forward cookies to backend
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const data = await res.json();
  // console.log("Logged in user data: ", data);

  const user = data.user;

  return (
    <html lang="en">
      <body
        className={`${roboto.className} background2 text-text1 flex flex-col min-h-screen antialiased`}
      >
        <AuthInitializer user={user} />

        <Navbar />

        <div className="flex-1">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
