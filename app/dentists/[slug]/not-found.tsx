"use client";

import Link from "next/link";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Button } from "@/shared/ui/button";

export default function DentistNotFound() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="text-4xl font-bold">{t("common.dentistNotFound")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t("common.dentistNotFoundDesc")}
        </p>
        <Link href="/discover" className="mt-8">
          <Button>{t("common.browseDentists")}</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
