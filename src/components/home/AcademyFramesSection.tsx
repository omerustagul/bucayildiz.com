import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

/** Ana sayfa "Akademiden Kareler" — medya kütüphanesinden fotoğraf şeridi.
 *  Ayarlardaki homeGalleryCategoryId doluysa yalnız o kategorinin medyası,
 *  boşsa kütüphanedeki son fotoğraflar gösterilir. */
export async function AcademyFramesSection() {
  const settings = await getSettings();
  const photos = await prisma.mediaAsset.findMany({
    where: {
      kind: "photo",
      ...(settings.homeGalleryCategoryId ? { categoryId: settings.homeGalleryCategoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, url: true, title: true },
  });
  if (photos.length === 0) return null;

  return (
    <section style={{ background: "var(--surface-page)" }}>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "38px clamp(16px, 5vw, 32px)" }}>
        <SectionHeading kicker="Galeri" title="Akademiden Kareler" action={<Button as="a" href="/medya/fotograflar" variant="secondary" size="sm">Tüm Galeri</Button>} />
        <div className="by-frames-strip" style={{ marginTop: 26 }}>
          {photos.map((p) => (
            <Link
              key={p.id}
              href="/medya/fotograflar"
              className="by-frame-card"
              aria-label={p.title || "Akademi fotoğrafı"}
              style={{
                position: "relative",
                display: "block",
                aspectRatio: "1 / 1",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                background: "var(--navy-50)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.title || "Akademi fotoğrafı"}
                loading="lazy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
