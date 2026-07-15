"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { RegisterAccount } from "@/services/auth";
import { RegisterFormData } from "@/types/RegisterFormData";
import { Lock, Mail, UserCircle } from "lucide-react";
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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card
        variant="surface1"
        bordered
        radius="2xl"
        padding="none"
        className="max-w-md w-full mx-auto shadow-glow-main2"
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="mx-auto w-fit rounded-full p-3 bg-gradient-to-br from-main1/20 to-main2/20 border border-border1">
            <UserCircle className="w-5 h-5 text-main2" />
          </div>

          <h2 className="text-3xl text-text1 text-center">Register</h2>

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

            <Input
              icon={Lock}
              type="password"
              placeholder="Password Confirmation"
              error={!!errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            <FormError>{errors.confirmPassword?.message}</FormError>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-6"
            >
              {isSubmitting ? "Loading..." : "Register"}
            </Button>

            <FormError className="justify-center">{errors.root?.message}</FormError>

            <div className="flex justify-center items-center gap-2 mt-4">
              <p className="text-sm">Already have an account?</p>
              <Link
                className="text-sm text-main1 hover:text-main1-hover"
                href={"/login"}
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
