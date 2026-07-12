import { TrialHero } from "@/components/home/TrialHero";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { NewsSection } from "@/components/home/NewsSection";
import { FixtureSection } from "@/components/home/FixtureSection";
import { MediaSection } from "@/components/home/MediaSection";
import { AgeGroupsSection } from "@/components/home/AgeGroupsSection";
import { JerseySection } from "@/components/home/JerseySection";
import { AcademyFramesSection } from "@/components/home/AcademyFramesSection";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <>
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
