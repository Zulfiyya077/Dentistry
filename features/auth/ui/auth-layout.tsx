import Link from "next/link";
import { APP_CONFIG } from "@/config/app.config";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/10 via-background to-secondary/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <span className="font-bold text-white">D</span>
          </div>
          <span className="text-xl font-bold">{APP_CONFIG.name}</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Stomatoloqların peşəkar portfoliyo platforması
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Peşəkar reputasiya qurun, pasiyentlərin etibarını qazanın və
            portfolionuzu nümayiş etdirin.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_CONFIG.name}
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="text-lg font-bold">{APP_CONFIG.name}</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
