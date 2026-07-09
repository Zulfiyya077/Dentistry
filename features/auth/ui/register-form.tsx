"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/features/auth/ui/auth-layout";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { showToast } from "@/lib/toast";
import { Button } from "@/shared/ui/button";
import { UserRole } from "@/types/enums";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    displayName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    role: z.enum([UserRole.PATIENT, UserRole.DOCTOR]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PASSWORD_MISMATCH",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.PATIENT,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "EMAIL_EXISTS") {
        showToast(t("auth.emailExists"), "error");
      } else if (code === "WEAK_PASSWORD") {
        showToast(t("auth.weakPassword"), "error");
      } else {
        showToast(t("auth.emailExists"), "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
      footer={
        <p className="text-muted-foreground">
          {t("auth.hasAccount")}{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            {t("auth.loginLink")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.roleLabel")}</label>
          <div className="grid grid-cols-2 gap-2">
            {([UserRole.PATIENT, UserRole.DOCTOR] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue("role", role)}
                className={cn(
                  "rounded-xl border py-3 text-sm font-medium transition-colors",
                  selectedRole === role
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {role === UserRole.PATIENT
                  ? t("auth.rolePatient")
                  : t("auth.roleDoctor")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.displayName")}</label>
          <input
            {...register("displayName")}
            className={cn("auth-input", errors.displayName && "border-destructive")}
            placeholder="Ad Soyad"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.email")}</label>
          <input
            {...register("email")}
            type="email"
            className={cn("auth-input", errors.email && "border-destructive")}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.password")}</label>
          <input
            {...register("password")}
            type="password"
            className={cn("auth-input", errors.password && "border-destructive")}
            placeholder="••••••"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.confirmPassword")}</label>
          <input
            {...register("confirmPassword")}
            type="password"
            className={cn(
              "auth-input",
              errors.confirmPassword && "border-destructive"
            )}
          />
          {errors.confirmPassword?.message === "PASSWORD_MISMATCH" && (
            <p className="mt-1 text-xs text-destructive">{t("auth.passwordMismatch")}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "..." : t("auth.registerButton")}
        </Button>
      </form>
    </AuthLayout>
  );
}
