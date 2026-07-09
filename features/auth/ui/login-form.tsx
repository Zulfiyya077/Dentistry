"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DEMO_CREDENTIALS } from "@/features/auth/data/mock-users";
import { AuthLayout } from "@/features/auth/ui/auth-layout";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { showToast } from "@/lib/toast";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { t } = useTranslation();
  const { login, loginAsDemo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
    } catch {
      showToast(t("auth.invalidCredentials"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      footer={
        <p className="text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            {t("auth.registerLink")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.email")}</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className={cn("auth-input", errors.email && "border-destructive")}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t("auth.password")}</label>
          <input
            {...register("password")}
            type="password"
            autoComplete="current-password"
            className={cn("auth-input", errors.password && "border-destructive")}
            placeholder="••••••"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "..." : t("auth.loginButton")}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-medium">{t("auth.demoAccounts")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("auth.demoHint")}</p>
        <div className="mt-4 space-y-2">
          {DEMO_CREDENTIALS.map((demo) => (
            <button
              key={demo.email}
              type="button"
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  await loginAsDemo(demo.email);
                } catch {
                  showToast(t("auth.invalidCredentials"), "error");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="font-medium">{demo.label}</span>
              <span className="text-xs text-muted-foreground">{demo.email}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Şifrə: <code className="rounded bg-muted px-1">123456</code>
        </p>
      </div>
    </AuthLayout>
  );
}
