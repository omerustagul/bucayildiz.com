"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Modal, SearchBox } from "@/components/admin/controls";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** Buca Yıldız Admin — 150+ sporcu ölçeğinde aranabilir/filtrelenebilir sporcu seçici. */

export type PickerAthlete = { id: string; name: string; teamId: string };
export type PickerTeam = { id: string; name: string };

type BaseProps = {
  open: boolean;
  onClose: () => void;
  teams: PickerTeam[];
  athletes: PickerAthlete[];
  title?: string;
};

type SingleProps = BaseProps & {
  mode: "single";
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onApply?: never;
};

type MultiProps = BaseProps & {
  mode: "multi";
  selectedIds?: string[];
  onApply?: (ids: string[]) => void;
  onSelect?: never;
};

export type AthletePickerModalProps = SingleProps | MultiProps;

export function AthletePickerModal(props: AthletePickerModalProps) {
  if (!props.open) return null;
  return <AthletePickerModalBody {...props} />;
}

function AthletePickerModalBody({
  onClose,
  teams,
  athletes,
  mode,
  selectedIds,
  onSelect,
  onApply,
  title = "Sporcu Seç",
}: AthletePickerModalProps) {
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [draft, setDraft] = useState<Set<string>>(() => new Set(selectedIds ?? []));
  // Mobilde ortada sıkışan Modal yerine alttan tam genişlik sheet.
  // (Bileşen yalnız client etkileşimiyle mount olur; lazy init güvenli.)
  const [isMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches);
  useOverlayDismiss(isMobile, onClose); // sheet yolunda kilit/Escape (Modal kendi içinde hallediyor)

  const teamNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of teams) m.set(t.id, t.name);
    return m;
  }, [teams]);

  const tabs = useMemo(
    () => [
      { id: "all", label: "Tümü", count: athletes.length },
      ...teams.map((t) => ({ id: t.id, label: t.name, count: athletes.filter((a) => a.teamId === t.id).length })),
    ],
    [teams, athletes],
  );

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase("tr");
    return athletes.filter(
      (a) => (teamFilter === "all" || a.teamId === teamFilter) && a.name.toLocaleLowerCase("tr").includes(q),
    );
  }, [athletes, teamFilter, query]);

  const toggle = (id: string) =>
    setDraft((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const selectFiltered = () => setDraft((s) => new Set([...s, ...filtered.map((a) => a.id)]));
  const clearAll = () => setDraft(new Set());

  const handleSingleSelect = (id: string) => {
    onSelect?.(id);
    onClose();
  };

  const handleApply = () => {
    onApply?.([...draft]);
    onClose();
  };

  const content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <SearchBox value={query} onChange={setQuery} placeholder="Sporcu ara…" width="100%" />
        <Tabs variant="pill" tabs={tabs} value={teamFilter} onChange={setTeamFilter} />

        {mode === "multi" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-500)", fontWeight: 600 }}>{draft.size} seçili</span>
            <div style={{ display: "flex", gap: 14 }}>
              <button
                type="button"
                onClick={selectFiltered}
                style={{ font: "inherit", cursor: "pointer", border: "none", background: "none", padding: 0, fontSize: 12.5, fontWeight: 600, color: "var(--navy-700)" }}
              >
                Filtredekileri Seç
              </button>
              <button
                type="button"
                disabled={draft.size === 0}
                onClick={clearAll}
                style={{ font: "inherit", cursor: draft.size ? "pointer" : "default", border: "none", background: "none", padding: 0, fontSize: 12.5, fontWeight: 600, color: draft.size ? "var(--ink-500)" : "var(--ink-300)" }}
              >
                Temizle
              </button>
            </div>
          </div>
        )}

        <div className="by-overlay-scroll" style={{ maxHeight: isMobile ? "50dvh" : "48vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.length === 0 && (
            <div style={{ padding: "24px 8px", textAlign: "center", fontSize: 13.5, color: "var(--ink-400)" }}>
              Eşleşen sporcu yok.
            </div>
          )}
          {filtered.map((a) => {
            const teamName = teamNameById.get(a.teamId) ?? "";
            if (mode === "multi") {
              const checked = draft.has(a.id);
              return (
                <label
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 11px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    background: checked ? "var(--navy-50)" : "transparent",
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(a.id)} style={{ flex: "none" }} />
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13.5, fontWeight: 500, color: "var(--ink-700)" }}>
                    {a.name}
                  </span>
                  <span style={{ flex: "none", fontSize: 12, color: "var(--ink-400)" }}>{teamName}</span>
                </label>
              );
            }
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => handleSingleSelect(a.id)}
                style={{
                  font: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 11px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: "transparent",
                  width: "100%",
                }}
              >
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13.5, fontWeight: 500, color: "var(--ink-700)" }}>
                  {a.name}
                </span>
                <span style={{ flex: "none", fontSize: 12, color: "var(--ink-400)" }}>{teamName}</span>
                <Icon name="chevron-right" size={14} />
              </button>
            );
          })}
        </div>
      </div>
  );

  const multiFooter =
    mode === "multi" ? (
      <>
        <Button variant="secondary" onClick={onClose}>Vazgeç</Button>
        <Button variant="primary" onClick={handleApply}>Uygula ({draft.size})</Button>
      </>
    ) : undefined;

  // Mobil: alttan tam genişlik sheet (kompakt, animasyonlu)
  if (isMobile) {
    return createPortal(
      <>
        <div className="by-anim-fade" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.5)", zIndex: 210 }} />
        <div className="by-anim-sheet" role="dialog" aria-modal="true" aria-label={title} style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 211, maxHeight: "90dvh", display: "flex", flexDirection: "column", borderRadius: "20px 20px 0 0", background: "var(--surface-page)", boxShadow: "var(--shadow-xl)" }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "8px auto 2px", flex: "none" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 10px", borderBottom: "1px solid var(--border-subtle)", flex: "none" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{title}</h2>
            <IconButton label="Kapat" variant="ghost" onClick={onClose}><Icon name="x" size={18} /></IconButton>
          </div>
          <div style={{ padding: "14px 16px", overflowY: "auto", minHeight: 0 }} className="by-overlay-scroll">
            {content}
          </div>
          {multiFooter && (
            <div style={{ padding: "12px 16px calc(12px + env(safe-area-inset-bottom))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, justifyContent: "flex-end", background: "var(--surface-subtle)", flex: "none" }}>
              {multiFooter}
            </div>
          )}
        </div>
      </>,
      document.body,
    );
  }

  return (
    <Modal open onClose={onClose} title={title} width={560} footer={multiFooter}>
      {content}
    </Modal>
  );
}
