"use client";
import AuthShell, { AuthField, ShakeError } from "@/components/auth/authShell";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { LoginAccount } from "@/services/auth";
import { useAuth } from "@/store/useAuth";
import { LoginFormData } from "@/types/LoginFormData";
import { ArrowRight, Loader2, LogIn, Mail } from "lucide-react";
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
    <AuthShell
      title="Welcome back"
      subtitle="Log in to create games and track your picks."
      icon={LogIn}
      accent="main1"
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <AuthField index={0}>
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
        </AuthField>

        <AuthField index={1}>
          <PasswordInput
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
        </AuthField>

        <AuthField index={2}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </AuthField>

        <ShakeError message={errors.root?.message}>
          <FormError className="justify-center">{errors.root?.message}</FormError>
        </ShakeError>

        <div className="flex justify-center items-center gap-2 mt-2">
          <p className="text-sm text-muted">Don&apos;t have an account?</p>
          <Link
            className="text-sm font-semibold text-main1 hover:text-main1-hover"
            href={"/register"}
          >
            Register
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
