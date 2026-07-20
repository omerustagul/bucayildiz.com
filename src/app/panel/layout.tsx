import { redirect } from "next/navigation";
import { getPanelSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { missingRequiredConsents, getActiveConsentDocuments } from "@/lib/consent.server";
import { PanelShell } from "@/components/panel/PanelShell";
import { ConsentGate } from "@/components/panel/ConsentGate";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getPanelSession();
  if (!session?.athleteId) redirect("/giris");

  const [athlete, unreadCount, notifUnread, settings, missing, consentDocs] = await Promise.all([
    prisma.athlete.findUnique({ where: { id: session.athleteId }, include: { team: true } }),
    prisma.athleteAssignment.count({ where: { athleteId: session.athleteId, readAt: null } }),
    prisma.notification.count({ where: { athleteId: session.athleteId, readAt: null } }),
    getSettings(),
    missingRequiredConsents(session.athleteId),
    getActiveConsentDocuments(),
  ]);
  if (!athlete) redirect("/giris");

  // KVKK ilk-giriş kapısı (Faz 0.1): zorunlu rıza eksikse (ör. admin'in elle yarattığı
  // sıfır-rızalı sporcu) panel HİÇ render edilmez — server-enforced, JS ile aşılamaz.
  // İmza sonrası captureInitialConsents → router.refresh() → burası yeniden çalışır →
  // eksik kalmaz → panel açılır. Bkz. docs/superpowers/specs/2026-07-17-panel-ilk-giris-*.
  if (missing.length > 0) {
    return (
      <ConsentGate
        docs={consentDocs.map((d) => ({ key: d.key, title: d.title, summary: d.summary, required: d.required, isConsent: d.isConsent, body: d.body }))}
        athleteName={athlete.name}
        birthDate={athlete.birthDate}
        logoUrl={settings.logoUrl}
      />
    );
  }

  return (
    <PanelShell
      athlete={{
        name: athlete.name,
        teamName: athlete.team.name,
        number: athlete.number,
        position: athlete.position,
        photoUrl: athlete.photoUrl,
      }}
      unreadCount={unreadCount}
      notifUnread={notifUnread}
      mobileNav={settings.mobileNavPanel}
      logoUrl={settings.logoUrl}
      paymentsEnabled={athlete.paymentsEnabled}
    >
      {children}
    </PanelShell>
  );
}
