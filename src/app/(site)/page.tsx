import { TrialHero } from "@/components/home/TrialHero";
import { NewsSection } from "@/components/home/NewsSection";
import { FixtureSection } from "@/components/home/FixtureSection";
import { MediaSection } from "@/components/home/MediaSection";
import { AgeGroupsSection } from "@/components/home/AgeGroupsSection";
import { JerseySection } from "@/components/home/JerseySection";

export default function HomePage() {
  return (
    <>
      <TrialHero href="/ucretsiz-deneme" />
      <NewsSection />
      <FixtureSection />
      <MediaSection />
      <AgeGroupsSection />
      <JerseySection />
    </>
  );
}
