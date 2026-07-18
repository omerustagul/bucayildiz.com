"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, TextArea, SearchBox, Drawer } from "@/components/admin/controls";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import { MapPicker } from "@/components/ui/LeafletMap";
import { Table, type Column } from "@/components/ui/Table";
import { CardList, CardEmpty, DataCard, CardHeader, CardFields } from "@/components/admin/MobileCardList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Icon } from "@/lib/icons";
import { toast } from "@/components/ui/Toast";
import { createFacility, updateFacility, deleteFacility } from "@/app/admin/(panel)/tesisler/actions";

export type FacilityRow = {
  id: string;
  name: string;
  description: string;
  capacity: string | null;
  features: string;
  photoUrl: string | null;
  sort: number;
  /** Harita konumu — ikisi de doluysa public tesisler sayfasında harita gösterilir. */
  latitude: number | null;
  longitude: number | null;
  isPitch: boolean;
};

/** "a, b,c" → ["a","b","c"] — boş parçalar atılır. */
function parseFeatures(s: string): string[] {
  return s
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}

function FeatureChips({ features }: { features: string }) {
  const list = parseFeatures(features);
  if (list.length === 0) return <span style={{ color: "var(--ink-400)" }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {list.map((f) => (
        <Badge key={f} tone="neutral">{f}</Badge>
      ))}
    </div>
  );
}

function FacilityDrawer({ facility, onClose }: { facility: FacilityRow | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !facility;
  const [v, setV] = useState({
    name: facility?.name ?? "",
    description: facility?.description ?? "",
    capacity: facility?.capacity ?? "",
    features: facility?.features ?? "",
    photoUrl: facility?.photoUrl ?? "",
    sort: facility?.sort?.toString() ?? "0",
    latitude: facility?.latitude ?? null,
    longitude: facility?.longitude ?? null,
    isPitch: facility?.isPitch ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));
  /** Konum ikisi birlikte set/temizlenir (yarım koordinat haritayı yanlış yere koyar). */
  const setLocation = (lat: number | null, lng: number | null) => setV((s) => ({ ...s, latitude: lat, longitude: lng }));

  const save = () => {
    setError(null);
    const payload = {
      name: v.name,
      description: v.description,
      capacity: v.capacity,
      features: v.features,
      photoUrl: v.photoUrl || null,
      sort: v.sort.trim() === "" ? 0 : Number(v.sort),
      latitude: v.latitude,
      longitude: v.longitude,
      isPitch: v.isPitch,
    };
    startTransition(async () => {
      const res = isNew ? await createFacility(payload) : await updateFacility(facility!.id, payload);
      if (res?.error) setError(res.error);
      else {
        toast.success(isNew ? "Tesis oluşturuldu." : "Tesis güncellendi.");
        onClose();
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!facility) return;
    if (!window.confirm("Bu tesisi silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteFacility(facility.id);
      toast.success("Tesis silindi.");
      onClose();
      router.refresh();
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={facility ? facility.name : "Yeni Tesis"}
      subtitle={facility ? "Tesis bilgilerini düzenle" : "Yeni tesis kaydı oluştur"}
      width={520}
      footer={
        <>
          {facility && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
              Sil
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : facility ? "Kaydet" : "Oluştur"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Field label="Kapak Görseli">
          <MediaLibraryPicker value={v.photoUrl || null} onChange={(url) => set("photoUrl", url ?? "")} label="Tesis görseli seç" hint="16:10 önerilir" aspect="16 / 10" />
        </Field>

        <Field label="Tesis Adı" required>
          <TextInput value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="örn. Hibrit Çim Saha" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Kapasite" hint="örn. 2× tam saha">
            <TextInput value={v.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="2× tam saha" />
          </Field>
          <Field label="Sıra">
            <TextInput type="number" value={v.sort} onChange={(e) => set("sort", e.target.value)} />
          </Field>
        </div>

        <Field label="Açıklama">
          <TextArea rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="Tesisin kısa açıklaması" />
        </Field>

        <Field label="Özellikler" hint="Virgülle ayırarak yazın — sitede rozet olarak gösterilir">
          <TextInput value={v.features} onChange={(e) => set("features", e.target.value)} placeholder="Aydınlatma, Soyunma Odası, Tribün" />
        </Field>
        {v.features.trim() && <FeatureChips features={v.features} />}

        {/* Konum opsiyoneldir: girilirse public tesisler sayfasında harita çıkar,
            boşsa harita HİÇ gösterilmez. Kulüp konumundaki MapPicker ile aynı bileşen. */}
        <Field label="Konum" hint="Haritaya tıklayın — sitede bu tesisin haritası görünür (boş bırakılabilir)">
          <MapPicker lat={v.latitude} lng={v.longitude} onChange={setLocation} height={240} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
              {v.latitude != null && v.longitude != null
                ? `Seçili konum: ${v.latitude.toFixed(4)}, ${v.longitude.toFixed(4)}`
                : "Konum seçilmedi — bu tesiste harita gösterilmez"}
            </span>
            {v.latitude != null && v.longitude != null && (
              <button
                type="button"
                onClick={() => setLocation(null, null)}
                style={{ flex: "none", background: "none", border: "none", padding: 0, color: "var(--red-600)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                Konumu temizle
              </button>
            )}
          </div>
        </Field>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)" }}>Antrenman sahası</div>
            <div style={{ fontSize: 12, color: "var(--ink-400)", lineHeight: 1.4 }}>Açıkken Takvim Programı&apos;nda saha seçeneği olarak listelenir</div>
          </div>
          <Switch checked={v.isPitch} onChange={(val) => set("isPitch", val)} />
        </div>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}

export function TesislerView({ facilities }: { facilities: FacilityRow[] }) {
  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState<{ facility: FacilityRow | null } | null>(null);

  const rows = useMemo(
    () => facilities.filter((f) => f.name.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr"))),
    [facilities, q],
  );

  const cols: Column<FacilityRow>[] = [
    {
      key: "name",
      label: "Tesis",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 44, height: 32, borderRadius: "var(--radius-sm)", overflow: "hidden", background: r.photoUrl ? `center/cover no-repeat url("${r.photoUrl}")` : "var(--grad-navy)", flex: "none", display: "grid", placeItems: "center", color: "rgba(255,255,255,.2)" }}>
            {!r.photoUrl && <Icon name="shield-check" size={15} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
            <span style={{ fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{r.name}</span>
            {r.isPitch && <Badge tone="gold">Saha</Badge>}
          </div>
        </div>
      ),
    },
    { key: "capacity", label: "Kapasite", render: (r) => r.capacity ?? "—" },
    { key: "features", label: "Özellikler", render: (r) => <FeatureChips features={r.features} /> },
    { key: "sort", label: "Sıra", align: "right", render: (r) => <span style={{ fontFamily: "var(--font-stat)" }}>{r.sort}</span> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="chevron-right" size={16} /></span> },
  ];

  return (
    <>
      <ViewHeader
        title="Tesisler"
        subtitle={`${facilities.length} kayıtlı tesis`}
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setDrawer({ facility: null })}>
            Tesis Ekle
          </Button>
        }
      />

      <Toolbar>
        <SearchBox placeholder="İsimle ara…" value={q} onChange={setQ} />
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-400)" }}>{rows.length} sonuç</span>
      </Toolbar>

      <div key={q} className="adm-table-wrap by-anim-pane">
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ facility: r })} empty="Bu filtreye uygun tesis yok." />
      </div>
      <CardList key={`${q}-cards`} className="by-anim-pane">
        {rows.length === 0 ? (
          <CardEmpty>Bu filtreye uygun tesis yok.</CardEmpty>
        ) : (
          rows.map((r) => (
            <DataCard key={r.id} onClick={() => setDrawer({ facility: r })}>
              <CardHeader
                avatar={
                  <div style={{ width: 44, height: 32, borderRadius: "var(--radius-sm)", overflow: "hidden", background: r.photoUrl ? `center/cover no-repeat url("${r.photoUrl}")` : "var(--grad-navy)", flex: "none", display: "grid", placeItems: "center", color: "rgba(255,255,255,.2)" }}>
                    {!r.photoUrl && <Icon name="shield-check" size={15} />}
                  </div>
                }
                title={r.name}
                subtitle={r.capacity ?? undefined}
              />
              <CardFields
                items={[
                  { label: "Özellikler", value: <FeatureChips features={r.features} /> },
                  { label: "Saha", value: r.isPitch ? <Badge tone="gold">Evet</Badge> : "—" },
                  { label: "Sıra", value: r.sort },
                ]}
              />
            </DataCard>
          ))
        )}
      </CardList>

      {drawer && <FacilityDrawer facility={drawer.facility} onClose={() => setDrawer(null)} />}
    </>
  );
}
