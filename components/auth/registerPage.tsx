"use client";
import AuthShell, { AuthField, ShakeError } from "@/components/auth/authShell";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { RegisterAccount } from "@/services/auth";
import { RegisterFormData } from "@/types/RegisterFormData";
import { ArrowRight, Loader2, Mail, UserCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: "onSubmit",
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    console.log("hello!", data);

    if (data.password !== data.confirmPassword) {
      setError("root", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await RegisterAccount(data);

      console.log("RESPONSE: ", response);

      router.push("/login");
      reset();
      return;
    } catch (error: any) {
      setError("root", { message: error.message });
      return;
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join in, make your own games and pick a side."
      icon={UserPlus}
      accent="main2"
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
          <Input
            icon={UserCircle}
            type="text"
            placeholder="Username"
            error={!!errors.username}
            {...register("username", {
              required: "Please enter your username",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
              maxLength: {
                value: 12,
                message: "Maximum 12 characters",
              },
            })}
          />
          <FormError>{errors.username?.message}</FormError>
        </AuthField>

        <AuthField index={2}>
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

        <AuthField index={3}>
          <PasswordInput
            placeholder="Password Confirmation"
            error={!!errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
          />
          <FormError>{errors.confirmPassword?.message}</FormError>
        </AuthField>

        <AuthField index={4}>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Register
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </AuthField>

        <ShakeError message={errors.root?.message}>
          <FormError className="justify-center">{errors.root?.message}</FormError>
        </ShakeError>

        <div className="flex justify-center items-center gap-2 mt-2">
          <p className="text-sm text-muted">Already have an account?</p>
          <Link
            className="text-sm font-semibold text-main2 hover:text-main2-hover"
            href={"/login"}
          >
            Login
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
