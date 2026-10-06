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
    <div className="relative isolate">
      <div className="absolute -top-24 left-[10%] w-80 h-80 rounded-full bg-main1/10 blur-3xl -z-10 animate-drift" aria-hidden />
      <div className="absolute -top-24 right-[10%] w-80 h-80 rounded-full bg-main2/10 blur-3xl -z-10 animate-drift [animation-delay:-7s]" aria-hidden />

      <div className="max-w-5xl mx-auto mt-10 mb-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Create a{" "}
            <span className="bg-gradient-to-r from-main1 to-main2 bg-clip-text text-transparent animate-gradient-pan">
              game
            </span>
          </h1>
          <p className="text-muted">
            Come up with tough choices and see which side your friends pick.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
