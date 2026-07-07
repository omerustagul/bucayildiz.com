"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";
import { markAssignmentRead } from "@/app/panel/mesajlar/actions";

export type PanelAssignment = {
  id: string;
  kind: string;
  title: string;
  body: string;
  fileUrl: string | null;
  readAt: string | null;
  createdAt: string;
};

const card: React.CSSProperties = {
  background: "var(--surface-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: 20,
};

/** ISO tarihi "gg.aa.yyyy ss:dd" biçiminde gösterir. */
function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

function KindBadge({ kind }: { kind: string }) {
  return kind === "document" ? (
    <Badge tone="gold">Doküman</Badge>
  ) : (
    <Badge tone="navy">Mesaj</Badge>
  );
}

function AssignmentDetail({ assignment, isMobile, onClose }: { assignment: PanelAssignment; isMobile: boolean; onClose: () => void }) {
  useOverlayDismiss(true, onClose);

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <KindBadge kind={assignment.kind} />
        {!isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "50%", border: "none", background: "var(--surface-subtle)", color: "var(--ink-600)", cursor: "pointer" }}
          >
            <Icon name="x" size={15} />
          </button>
        )}
      </div>
      <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)", minWidth: 0, overflowWrap: "break-word" }}>{assignment.title}</h3>
      <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{fmtDateTime(assignment.createdAt)}</span>
      {assignment.body && (
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6, whiteSpace: "pre-wrap", minWidth: 0 }}>{assignment.body}</p>
      )}
      {assignment.fileUrl && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assignment.fileUrl}
            alt={assignment.title}
            style={{ display: "block", width: "100%", maxWidth: "100%", height: "auto", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}
          />
          <a
            href={assignment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-link)", textDecoration: "underline" }}
          >
            <Icon name="external-link" size={14} /> Yeni sekmede aç
          </a>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return createPortal(
      <>
        <div className="by-anim-fade" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.45)", zIndex: 70 }} />
        <div
          className="by-anim-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Mesaj detayı"
          style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 71, maxHeight: "80vh", overflowY: "auto", borderRadius: "16px 16px 0 0", background: "var(--surface-card)", boxShadow: "var(--shadow-lg)", padding: "8px 20px 22px" }}
        >
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "8px auto 14px" }} />
          {content}
        </div>
      </>,
      document.body,
    );
  }

  return createPortal(
    <div
      className="by-anim-fade"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.55)", zIndex: 210, display: "grid", placeItems: "center", padding: 20 }}
    >
      <div
        className="by-anim-pop"
        role="dialog"
        aria-modal="true"
        aria-label="Mesaj detayı"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(560px, 92vw)", maxHeight: "86vh", overflowY: "auto", background: "var(--surface-card)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xl)", padding: 24 }}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}

function AssignmentCard({ assignment, onOpen }: { assignment: PanelAssignment; onOpen: () => void }) {
  const unread = !assignment.readAt;
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        ...card,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        textAlign: "left",
        cursor: "pointer",
        borderColor: unread ? "var(--gold-300)" : "var(--border-subtle)",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <KindBadge kind={assignment.kind} />
        <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1 }}>
          {unread && <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold-500)", flex: "none" }} />}
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14.5, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
            {assignment.title}
          </span>
        </span>
        <span style={{ fontSize: 12, color: "var(--ink-400)", flex: "none" }}>{fmtDateTime(assignment.createdAt)}</span>
      </div>
    </button>
  );
}

export function AssignmentsPanelView({ assignments }: { assignments: PanelAssignment[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [, startTransition] = useTransition();
  const markedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const openAssignment = assignments.find((a) => a.id === openId) ?? null;

  const handleOpen = (assignment: PanelAssignment) => {
    setOpenId(assignment.id);
    if (!assignment.readAt && !markedRef.current.has(assignment.id)) {
      markedRef.current.add(assignment.id);
      startTransition(async () => {
        await markAssignmentRead(assignment.id);
        router.refresh();
      });
    }
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>Mesajlar</h2>
      </div>
      <p style={{ margin: 0, marginTop: -12, fontSize: 13.5, color: "var(--ink-500)" }}>Antrenörünüzden gelen mesaj ve dokümanlar</p>

      {assignments.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "40px 24px", color: "var(--ink-500)" }}>
          <Icon name="mail" size={30} style={{ color: "var(--ink-300)", marginBottom: 10 }} />
          <p style={{ margin: 0, fontSize: 14 }}>Henüz mesajınız yok.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} onOpen={() => handleOpen(a)} />
          ))}
        </div>
      )}

      {openAssignment && (
        <AssignmentDetail assignment={openAssignment} isMobile={isMobile} onClose={() => setOpenId(null)} />
      )}
    </section>
  );
}
