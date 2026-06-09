"use client";

import PageHero from "@/components/layout/PageHero";
import { useT } from "@/lib/i18n/context";

export default function DahiraHero() {
  const { t } = useT();
  return (
    <PageHero
      overline={t("dahirapage.hero_overline")}
      title={t("dahirapage.hero_title")}
      arabic="كيبانغوغ صلاة على النبي"
      description={t("dahirapage.hero_desc")}
    />
  );
}
