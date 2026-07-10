import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForms } from "@/components/panel/ProfileForms";
import { AvatarUpload } from "@/components/panel/AvatarUpload";

export const metadata: Metadata = { title: "Profil — Sporcu Paneli" };

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
      <div style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)", marginTop: 3 }}>{value}</div>
    </div>
  );
}

export default async function PanelProfil() {
  const session = await requireAthlete();
  const athlete = await prisma.athlete.findUnique({
    where: { id: session.athleteId! },
    include: { team: true, user: { select: { username: true, email: true } } },
  });
  if (!athlete) return null;

  const dash = "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Profil</h1>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "6px 0 0" }}>Bilgilerinizi görüntüleyin; iletişim ve şifrenizi güncelleyin.</p>
      </div>

      {/* Kimlik */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px", flexWrap: "wrap" }}>
        <AvatarUpload name={athlete.name} photoUrl={athlete.photoUrl} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)" }}>{athlete.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {athlete.team.name} · {athlete.position || "Mevki belirtilmemiş"}{athlete.number != null ? ` · #${athlete.number}` : ""}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "6px 0 0" }}>
            Fotoğrafınız yalnızca kulüp içi sistemlerde görüntülenir.
          </p>
        </div>
      </div>

      {/* Salt-okunur bilgiler (kulüp tarafından yönetilir) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        <Info label="Takım" value={athlete.team.name} />
        <Info label="Mevki" value={athlete.position || dash} />
        <Info label="Forma No" value={athlete.number != null ? String(athlete.number) : dash} />
        <Info label="Boy" value={athlete.height != null ? `${athlete.height} cm` : dash} />
        <Info label="Kilo" value={athlete.weight != null ? `${athlete.weight} kg` : dash} />
        <Info label="Ayak" value={athlete.foot || dash} />
        <Info label="Doğum Yılı" value={athlete.birthYear != null ? String(athlete.birthYear) : dash} />
        <Info label="Lisans No" value={athlete.licenseNo || dash} />
        <Info label="Kullanıcı Adı" value={athlete.user?.username || athlete.user?.email || dash} />
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "-8px 0 0" }}>
        Takım, mevki, ölçüm ve lisans bilgileri kulüp tarafından yönetilir. Değişiklik için antrenörünüzle iletişime geçin.
      </p>

      {/* Düzenlenebilir alanlar */}
      <ProfileForms parentPhone={athlete.parentPhone ?? ""} />
    </div>
  );
}
