"use client";

import PageHero from "@/components/layout/PageHero";
import { useT } from "@/lib/i18n/context";

export default function MediaHero() {
  const { t } = useT();
  return (
    <PageHero
      overline={t("section.media_ksn")}
      title={t("section.media_title")}
      description={t("mediapage.hero_desc")}
    />
  );
}
