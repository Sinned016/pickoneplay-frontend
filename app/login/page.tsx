import LoginPage from "@/components/auth/loginPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt");

  if (token) {
    redirect("/");
  }

  return <LoginPage />;
}
