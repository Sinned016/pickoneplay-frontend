import LoginPage from "@/components/auth/loginPage";
import RegisterPage from "@/components/auth/registerPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Register() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt");

  if (token) {
    redirect("/");
  }

  return <RegisterPage />;
}
