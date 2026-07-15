"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { LoginAccount } from "@/services/auth";
import { useAuth } from "@/store/useAuth";
import { LoginFormData } from "@/types/LoginFormData";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser } = useAuth.getState();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log("hello!", data);

    try {
      const response = await LoginAccount(data);

      console.log("RESPONSE: ", response);

      await fetchUser();

      router.push("/");
      reset();
      return;
    } catch (error: any) {
      setError("root", { message: error.message });
      return;
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card
        variant="surface1"
        bordered
        radius="2xl"
        padding="none"
        className="max-w-md w-full mx-auto shadow-glow-main1"
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="mx-auto w-fit rounded-full p-3 bg-gradient-to-br from-main1/20 to-main2/20 border border-border1">
            <Lock className="w-5 h-5 text-main1" />
          </div>

          <h2 className="text-3xl text-text1 text-center">Login</h2>

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              error={!!errors.email}
              {...register("email", {
                required: "Please enter your email",
                validate: (value) => {
                  if (!value.includes("@")) {
                    return "Email must contain @";
                  }
                },
              })}
            />
            <FormError>{errors.email?.message}</FormError>

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              error={!!errors.password}
              {...register("password", {
                required: "Please enter a password",
                minLength: {
                  value: 8,
                  message: "Password has to be minimum 8 characters",
                },
              })}
            />
            <FormError>{errors.password?.message}</FormError>

            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Loading..." : "Login"}
              </Button>
            </div>

            <FormError className="justify-center">{errors.root?.message}</FormError>

            <div className="flex justify-center items-center gap-2 mt-4">
              <p className="text-sm">Don't have an account?</p>
              <Link
                className="text-sm text-main1 hover:text-main1-hover"
                href={"/register"}
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
