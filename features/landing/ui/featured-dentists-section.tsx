"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getFeaturedDentists } from "@/features/dentist/data/mock-dentists";
import { useTranslation } from "@/providers/locale-provider";
import { DentistCard } from "@/widgets/dentist-card/dentist-card";

export function FeaturedDentistsSection() {
  const { t } = useTranslation();
  const featuredDentists = getFeaturedDentists();

  return (
    <section className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("featured.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("featured.subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDentists.map((dentist, index) => (
            <DentistCard key={dentist.id} dentist={dentist} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/discover"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("common.viewAll")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
