import { BrandGlyph, type BrandName } from "@/lib/icons";
import { platformLabel, type SocialLink } from "@/lib/social";

/** Sosyal medya ikon bağlantıları — ayarlardan gelen dinamik listeyi lacivert
 *  zemin (header/footer) görsel diliyle çizer. Sunucu-uyumlu (hook yok);
 *  hover efekti .by-social-link CSS sınıfındadır. */
export function SocialLinks({ links, box = 32, iconSize = 15 }: { links: SocialLink[]; box?: number; iconSize?: number }) {
  if (links.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {links.map((l) => (
        <a
          key={l.platform}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platformLabel(l.platform)}
          className="by-social-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: box,
            height: box,
            flex: "none",
            borderRadius: "var(--radius-sm)",
            background: "rgba(255, 255, 255, 0.07)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            transition: "all var(--dur-fast) var(--ease-out)",
          }}
        >
          <BrandGlyph name={l.platform as BrandName} size={iconSize} />
        </a>
      ))}
    </div>
  );
}
