import { getCurrentUserOnServer } from "@/lib/auth/getCurrentUserOnServer";
import { redirect } from "next/navigation";

// Make sure to send the jwt cookie to the backend, if current user does not have a jwt cookie we should instantly go to "/" again.
export default async function CreateLayout({
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
    <div className=" max-w-3xl mx-auto mt-10 mb-24 px-4 lg:px-0">
      <div className="flex flex-col gap-2 px-4 rounded-xl text-text1 mb-6">
        <h2 className="text-4xl text-center font-bold text-main1">
          Create Game
        </h2>
        <p className="text-center text-sm text-muted">
          Create a game for you and your friends to enjoy
        </p>
      </div>

      {children}
    </div>
  );
}
