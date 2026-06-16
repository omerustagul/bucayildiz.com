import { TrialBanner } from "@/components/home/TrialBanner";
import { NewsSection } from "@/components/home/NewsSection";
import { FixtureSection } from "@/components/home/FixtureSection";
import { MediaSection } from "@/components/home/MediaSection";
import { AgeGroupsSection } from "@/components/home/AgeGroupsSection";
import { JerseySection } from "@/components/home/JerseySection";

export default function HomePage() {
  return (
    <>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 0" }}>
        <TrialBanner href="/ucretsiz-deneme" />
      </div>
      <NewsSection />
      <FixtureSection />
      <MediaSection />
      <AgeGroupsSection />
      <JerseySection />
    </>
  );
}
