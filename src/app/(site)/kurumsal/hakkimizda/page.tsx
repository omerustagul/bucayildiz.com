import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose, StatStrip, FeatureGrid, NavyPanel } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function HakkimizdaPage() {
  const [athleteCount, ageGroupCount, coachCount, settings] = await Promise.all([
    prisma.athlete.count(),
    prisma.team.count({ where: { isMain: false } }),
    prisma.staffMember.count({ where: { group: "antrenor" } }),
    getSettings(),
  ]);
  const foundedYear = settings.foundedYear ?? 2014;

  return (
    <>
      <PageHero
        kicker="Hakkımızda"
        title="Disiplin, Saygı ve Takım Ruhu"
        lead="İzmir Buca'da kurulan akademimiz, genç sporcuları yalnızca sahada değil hayatta da başarıya hazırlar."
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Hakkımızda" }]}
      />

      <Section>
        <Prose>
          <p>
            Buca Yıldız Futbol Akademisi; futbolu bir disiplin, gelişim ve karakter okulu olarak gören bir altyapı kulübüdür.
            Amacımız, her yaş grubundan sporcumuzun teknik, fiziksel ve zihinsel gelişimini bütünsel bir programla desteklemektir.
          </p>
          <p>
            UEFA lisanslı antrenörlerimiz eşliğinde, bilimsel veri takibi ve bireysel gelişim planlarıyla çalışan akademimiz;
            sporcularımızı bölgesel ve gelişim liglerinde rekabetin içinde tutarken, aileleriyle şeffaf bir iletişim kurar.
          </p>
        </Prose>
      </Section>

      <Section background="subtle">
        <StatStrip
          stats={[
            { value: String(athleteCount), label: "Lisanslı Sporcu" },
            { value: String(ageGroupCount), label: "Yaş Grubu" },
            { value: String(coachCount), label: "Antrenör" },
            { value: String(foundedYear), label: "Kuruluş" },
          ]}
        />
      </Section>

      <Section>
        <FeatureGrid
          items={[
            { icon: "shield-check", title: "Lisanslı Kadro", text: "UEFA lisanslı antrenörler ve uzman gelişim ekibi eşliğinde profesyonel bir öğrenme ortamı." },
            { icon: "users", title: "Bireysel Takip", text: "Her sporcunun fiziksel ve teknik verileri düzenli ölçülür, kişiye özel gelişim planı hazırlanır." },
            { icon: "trophy", title: "Rekabetçi Ligler", text: "Bölgesel ve gelişim liglerinde aktif rekabetle sahada gerçek tecrübe." },
          ]}
        />
      </Section>

      <Section background="subtle">
        <NavyPanel
          title="Neden Buca Yıldız?"
          items={[
            { icon: "calendar-check", text: "Ücretsiz tanışma antrenmanı ve objektif seviye tespiti." },
            { icon: "shield-check", text: "Karakter gelişimini önceleyen, disiplinli ve saygı temelli kulüp kültürü." },
            { icon: "users", text: "Aileyle şeffaf iletişim ve düzenli gelişim raporları." },
            { icon: "trophy", text: "Üst yapıya ve profesyonelliğe açık net bir gelişim yolu." },
          ]}
        />
      </Section>
    </>
  );
}
