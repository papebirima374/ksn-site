"use client";

import PageHero from "@/components/layout/PageHero";
import { useT } from "@/lib/i18n/context";

export default function ContactHero() {
  const { t } = useT();
  return (
    <PageHero
      overline={t("section.contact_officiel")}
      title={t("section.contact_title")}
      description={t("contactpage.hero_desc")}
    />
  );
}
