import { getPageMetadata } from "@/lib/seo";
import { TrialJourney } from "@/components/home/TrialJourney";

export const generateMetadata = () => getPageMetadata("/ucretsiz-deneme");

export default function UcretsizDenemePage() {
  return <TrialJourney />;
}
