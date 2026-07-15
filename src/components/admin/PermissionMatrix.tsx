"use client";

import { Button } from "@/components/ui/Button";
import { PERMISSION_AREAS, ROLE_PRESETS, type PermissionArea } from "@/lib/permissions";

/** "kullanicilar.*" owner-exclusive/devredilemez → matriste hiç gösterilme (server
 *  de sanitizePermissions ile aynı alanı ayıklar, bkz. kullanicilar/actions.ts). */
const MANAGEABLE_AREAS: PermissionArea[] = PERMISSION_AREAS.filter((a) => a.key !== "kullanicilar");

function groupByArea(areas: PermissionArea[]): [string, PermissionArea[]][] {
  const map = new Map<string, PermissionArea[]>();
  for (const a of areas) {
    const list = map.get(a.group);
    if (list) list.push(a);
    else map.set(a.group, [a]);
  }
  return [...map.entries()];
}

// PERMISSION_AREAS zaten grup sırasına göre dizili → modül seviyesinde bir kez hesapla.
const GROUPS = groupByArea(MANAGEABLE_AREAS);

const chipStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 12.5,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: "var(--ink-600)",
};

/** Admin rolü için izin matrisi: her alanda "Görüntüle" (.view) + "Yönet" (.manage)
 *  checkbox çifti. "Yönet" işaretlenince "Görüntüle" örtük olarak da işaretlenir
 *  (yöneten görebilir de); "Görüntüle" kaldırılınca "Yönet" de kalkar. */
export function PermissionMatrix({ value, onChange }: { value: string[]; onChange: (perms: string[]) => void }) {
  const has = (key: string) => value.includes(key);

  const setView = (area: string, checked: boolean) => {
    const next = new Set(value);
    if (checked) {
      next.add(`${area}.view`);
    } else {
      next.delete(`${area}.view`);
      next.delete(`${area}.manage`);
    }
    onChange([...next]);
  };

  const setManage = (area: string, checked: boolean) => {
    const next = new Set(value);
    if (checked) {
      next.add(`${area}.manage`);
      next.add(`${area}.view`);
    } else {
      next.delete(`${area}.manage`);
    }
    onChange([...next]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <span style={chipStyle}>Hazır Rol Şablonu</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ROLE_PRESETS.map((p) => (
            <Button key={p.key} type="button" variant="secondary" size="sm" data-testid={`perm-preset-${p.key}`} onClick={() => onChange(p.permissions)}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        {GROUPS.map(([group, areas]) => (
          <div key={group} style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden", minWidth: 0 }}>
            <div style={{ padding: "8px 12px", background: "var(--surface-subtle)", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold-700)" }}>
              {group}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {areas.map((a, i) => (
                <div
                  key={a.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 12px",
                    borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 13.5, color: "var(--text-body)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.label}</span>
                  <div style={{ display: "flex", gap: 14, flex: "none" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-600)", cursor: "pointer" }}>
                      <input type="checkbox" data-testid={`perm-${a.key}-view`} checked={has(`${a.key}.view`)} onChange={(e) => setView(a.key, e.target.checked)} style={{ width: 15, height: 15, accentColor: "var(--navy-700)" }} />
                      Görüntüle
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-600)", cursor: "pointer" }}>
                      <input type="checkbox" data-testid={`perm-${a.key}-manage`} checked={has(`${a.key}.manage`)} onChange={(e) => setManage(a.key, e.target.checked)} style={{ width: 15, height: 15, accentColor: "var(--gold-600)" }} />
                      Yönet
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
