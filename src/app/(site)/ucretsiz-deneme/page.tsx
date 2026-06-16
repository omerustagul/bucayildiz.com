import type { Metadata } from "next";
import { TrialJourney } from "@/components/home/TrialJourney";

export const metadata: Metadata = {
  title: "Ücretsiz Deneme Programı",
  description: "Önce iyi bir insan, sonra iyi bir sporcu. 5 adımlık ücretsiz değerlendirme ile çocuğunuzun yeteneğini keşfediyoruz.",
};

export default function UcretsizDenemePage() {
  return <TrialJourney />;
}
