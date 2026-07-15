"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Toolbar } from "@/components/admin/kit";
import { TextInput, Drawer, Modal } from "@/components/admin/controls";
import { Panel } from "@/components/admin/ui";
import { CardList, DataCard, CardHeader, CardFields, CardActions } from "@/components/admin/MobileCardList";
import { PermissionMatrix } from "@/components/admin/PermissionMatrix";
import { Select } from "@/components/ui/Select";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { Icon } from "@/lib/icons";
import { createAdminUser, updateAdminUser, deleteAdminUser, resetAdminPassword } from "@/app/admin/(panel)/kullanicilar/actions";

export type AdminUserRow = { id: string; name: string; email: string | null; username: string | null; role: string; permissions: string[]; createdAt: string };
export type AuditRow = { id: string; actorName: string; action: string; targetName: string | null; detail: string; createdAt: string };

const ROLE_OPTIONS = [
  { value: "admin", label: "Yönetici" },
  { value: "owner", label: "Sahip" },
];

const AUDIT_LABELS: Record<string, string> = {
  "user.create": "Oluşturdu",
  "user.update": "Güncelledi",
  "user.delete": "Sildi",
  "user.password_reset": "Parola sıfırladı",
};
const auditLabel = (action: string) => AUDIT_LABELS[action] ?? action;

/** ".view"/".manage" köklerine göre BENZERSİZ alan sayısı (izin özeti için). */
function permissionAreaCount(permissions: string[]): number {
  return new Set(permissions.map((p) => p.replace(/\.(view|manage)$/, ""))).size;
}

function permissionSummary(u: AdminUserRow): string {
  if (u.role === "owner") return "Tüm yetkiler";
  const n = permissionAreaCount(u.permissions);
  return `${n} alan yetkisi`;
}

function RoleBadge({ role }: { role: string }) {
  return role === "owner" ? <Badge tone="gold">Sahip</Badge> : <Badge tone="navy">Yönetici</Badge>;
}

const th: React.CSSProperties = { textAlign: "left", padding: "10px 14px", fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-500)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "var(--text-body)", borderTop: "1px solid var(--border-subtle)" };

/** Oluştur/düzenle Drawer'ı — `user` null ise "yeni yönetici" modu. Düzenlemede
 *  e-posta/kullanıcı adı/parola alanları YOK (parola ayrı "Parola" aksiyonuyla
 *  sıfırlanır); yalnız ad, rol ve izin matrisi güncellenir. */
function UserDrawer({ user, onClose }: { user: AdminUserRow | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !user;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role ?? "admin");
  const [permissions, setPermissions] = useState<string[]>(user?.permissions ?? []);
  const [pending, start] = useTransition();

  const save = () => {
    if (pending) return;
    if (isNew && !email.trim() && !username.trim()) {
      toast.error("E-posta veya kullanıcı adı gerekli.");
      return;
    }
    start(async () => {
      try {
        const res = isNew
          ? await createAdminUser({ name, email, username, password, role, permissions })
          : await updateAdminUser(user.id, { name, role, permissions });
        if (res.ok) {
          toast.success(isNew ? "Yönetici oluşturuldu." : "Yönetici güncellendi.");
          onClose();
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("İşlem başarısız. Lütfen tekrar deneyin.");
      }
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={isNew ? "Yeni Yönetici" : user.name}
      subtitle={isNew ? "Yeni yönetici hesabı oluştur" : "Yönetici bilgilerini düzenle"}
      width={560}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : isNew ? "Yönetici Oluştur" : "Kaydet"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Ad Soyad" required>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" />
        </Field>

        {isNew && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="E-posta">
                <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@bucayildiz.com" />
              </Field>
              <Field label="Kullanıcı Adı">
                <TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="kullanici.adi" />
              </Field>
            </div>
            <span style={{ fontSize: 12, color: "var(--ink-400)", marginTop: -10 }}>E-posta veya kullanıcı adından en az biri gerekli.</span>
            <Field label="Parola" required hint="En az 8 karakter">
              <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" placeholder="En az 8 karakter" leftIcon={<Icon name="lock" size={16} />} />
            </Field>
          </>
        )}

        <Select label="Rol" options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />

        {role === "admin" ? (
          <PermissionMatrix value={permissions} onChange={setPermissions} />
        ) : (
          <div style={{ padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--gold-100)", border: "1px solid var(--gold-300)", fontSize: 13, color: "var(--gold-800)" }}>
            Sahip tüm yetkilere sahiptir.
          </div>
        )}
      </div>
    </Drawer>
  );
}

/** Parola sıfırlama — ayrı küçük Modal (Drawer'daki oluşturma alanından bağımsız). */
function PasswordResetModal({ user, onClose }: { user: AdminUserRow; onClose: () => void }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pending, start] = useTransition();

  const save = () => {
    if (pending) return;
    if (pw.length < 8) {
      toast.error("Parola en az 8 karakter olmalı.");
      return;
    }
    start(async () => {
      try {
        const res = await resetAdminPassword(user.id, pw);
        if (res.ok) {
          toast.success("Parola sıfırlandı, kullanıcının oturumları sonlandırıldı.");
          onClose();
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("İşlem başarısız. Lütfen tekrar deneyin.");
      }
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Parola Sıfırla"
      width={420}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Parolayı Sıfırla"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-500)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--text-strong)" }}>{user.name}</strong> için yeni parola belirleyin. Kaydedince kullanıcının mevcut oturumları sonlandırılır.
        </p>
        <Field label="Yeni Parola" required hint="En az 8 karakter">
          <PasswordInput value={pw} onChange={setPw} autoComplete="new-password" placeholder="En az 8 karakter" leftIcon={<Icon name="lock" size={16} />} />
        </Field>
      </div>
    </Modal>
  );
}

export function KullanicilarView({ currentUserId, ownerCount, users, audit }: { currentUserId: string; ownerCount: number; users: AdminUserRow[]; audit: AuditRow[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null);
  const [pwUser, setPwUser] = useState<AdminUserRow | null>(null);
  const [delPending, startDelete] = useTransition();

  const handleDelete = (u: AdminUserRow) => {
    if (delPending) return;
    if (!window.confirm(`${u.name} adlı yöneticiyi silmek istediğinize emin misiniz?`)) return;
    startDelete(async () => {
      try {
        const res = await deleteAdminUser(u.id);
        if (res.ok) {
          toast.success("Yönetici silindi.");
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("İşlem başarısız. Lütfen tekrar deneyin.");
      }
    });
  };

  const rowActions = (u: AdminUserRow) => {
    const isSelf = u.id === currentUserId;
    const isLastOwner = u.role === "owner" && ownerCount <= 1;
    const delDisabled = isSelf || isLastOwner || delPending;
    const delTitle = isSelf ? "Kendinizi silemezsiniz" : isLastOwner ? "Son sahip silinemez" : "Sil";
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setEditUser(u)}>Düzenle</Button>
        <Button variant="ghost" size="sm" onClick={() => setPwUser(u)}>Parola</Button>
        <Button variant="ghost" size="sm" style={{ color: "var(--red-600)" }} disabled={delDisabled} title={delTitle} onClick={() => handleDelete(u)}>Sil</Button>
      </>
    );
  };

  return (
    <>
      <Toolbar style={{ justifyContent: "flex-end", marginBottom: 16 }}>
        <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setCreateOpen(true)}>Yeni Yönetici</Button>
      </Toolbar>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {users.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-400)", fontSize: 14 }}>Henüz yönetici yok.</div>
        ) : (
          <>
            <div className="adm-table-wrap" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ background: "var(--surface-subtle)" }}>
                    <th style={th}>Yönetici</th>
                    <th style={th}>Rol</th>
                    <th style={th}>Yetki</th>
                    <th style={th}>Kayıt Tarihi</th>
                    <th style={{ ...th, textAlign: "right" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ ...td, fontWeight: 600, color: "var(--text-strong)", minWidth: 0 }}>
                        {u.name}
                        <div style={{ fontWeight: 400, fontSize: 12, color: "var(--ink-400)" }}>{u.email || u.username || "—"}</div>
                      </td>
                      <td style={td}><RoleBadge role={u.role} /></td>
                      <td style={{ ...td, color: "var(--ink-600)" }}>{permissionSummary(u)}</td>
                      <td style={{ ...td, color: "var(--ink-500)", whiteSpace: "nowrap" }}>{u.createdAt}</td>
                      <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>{rowActions(u)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CardList style={{ padding: 14 }}>
              {users.map((u) => (
                <DataCard key={u.id}>
                  <CardHeader title={u.name} subtitle={u.email || u.username || "—"} badge={<RoleBadge role={u.role} />} />
                  <CardFields items={[{ label: "Yetki", value: permissionSummary(u) }, { label: "Kayıt", value: u.createdAt }]} />
                  <CardActions>{rowActions(u)}</CardActions>
                </DataCard>
              ))}
            </CardList>
          </>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <Panel title="Son İşlemler">
          {audit.length === 0 ? (
            <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--ink-400)", fontSize: 13.5 }}>Henüz işlem yok.</div>
          ) : (
            audit.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 20px",
                  borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
                  minWidth: 0,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 13.5 }}>{a.actorName}</span>
                  <span style={{ fontSize: 13.5, color: "var(--ink-600)" }}> {auditLabel(a.action)}</span>
                  {a.targetName && <span style={{ fontSize: 13.5, color: "var(--ink-600)" }}> · {a.targetName}</span>}
                  {a.detail && <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 2 }}>{a.detail}</div>}
                </div>
                <span style={{ flex: "none", fontSize: 12, color: "var(--ink-400)", whiteSpace: "nowrap" }}>{a.createdAt}</span>
              </div>
            ))
          )}
        </Panel>
      </div>

      {createOpen && <UserDrawer user={null} onClose={() => setCreateOpen(false)} />}
      {editUser && <UserDrawer user={editUser} onClose={() => setEditUser(null)} />}
      {pwUser && <PasswordResetModal user={pwUser} onClose={() => setPwUser(null)} />}
    </>
  );
}
