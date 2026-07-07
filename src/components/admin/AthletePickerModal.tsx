"use client";

import { useMemo, useState } from "react";
import { Modal, SearchBox } from "@/components/admin/controls";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

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

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      width={560}
      footer={
        mode === "multi" ? (
          <>
            <Button variant="secondary" onClick={onClose}>Vazgeç</Button>
            <Button variant="primary" onClick={handleApply}>Uygula ({draft.size})</Button>
          </>
        ) : undefined
      }
    >
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

        <div style={{ maxHeight: "48vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
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
    </Modal>
  );
}
