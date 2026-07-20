import ProfileNav from "@/components/profile/profileNav";
import { getCurrentUserOnServer } from "@/lib/auth/getCurrentUserOnServer";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserOnServer();

  // if user === null we send them back to home
  if (!user) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 mb-10">
        <ProfileNav />
      </div>

      {children}
    </div>
  );
}
