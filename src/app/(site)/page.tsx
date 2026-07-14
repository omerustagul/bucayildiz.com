import { TrialHero } from "@/components/home/TrialHero";
import { heroImageSrcs } from "@/components/home/heroImage";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { NewsSection } from "@/components/home/NewsSection";
import { FixtureSection } from "@/components/home/FixtureSection";
import { MediaSection } from "@/components/home/MediaSection";
import { AgeGroupsSection } from "@/components/home/AgeGroupsSection";
import { JerseySection } from "@/components/home/JerseySection";
import { AcademyFramesSection } from "@/components/home/AcademyFramesSection";
import { getSettings } from "@/lib/settings";
import { getPageMetadata } from "@/lib/seo";

export const generateMetadata = () => getPageMetadata("/");

export default async function HomePage() {
  const settings = await getSettings();
  // LCP: hero bir CSS background — <Image priority> uygulanamaz. Bunun yerine
  // viewport'a göre DOĞRU hero görselini erken indir. `media` değerleri CSS
  // breakpoint'i (760px) ile birebir → her cihazda TEK görsel preload edilir.
  // Next 16/React 19 <link>'i otomatik <head>'e taşır.
  const hero = heroImageSrcs(settings.heroImageUrl, settings.heroMobileImageUrl);
  return (
    <>
      <link rel="preload" as="image" href={hero.desktop} media="(min-width: 761px)" fetchPriority="high" />
      <link rel="preload" as="image" href={hero.mobile} media="(max-width: 760px)" fetchPriority="high" />
      <TrialHero href="/ucretsiz-deneme" heroImageUrl={settings.heroImageUrl} heroMobileImageUrl={settings.heroMobileImageUrl} />
      <HowItWorksSection />
      <AcademyFramesSection />
      <NewsSection />
      <FixtureSection />
      <MediaSection />
      <AgeGroupsSection />
      <JerseySection />
    </>
  );
}
