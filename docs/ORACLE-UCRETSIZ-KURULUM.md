# Buca Yıldız — Oracle Cloud Always Free ile ÜCRETSIZ Canlıya Alma

**Senaryo:** Demo/teslim (henüz gerçek sporcu kişisel verisi girilmeyecek).
**Maliyet:** Sunucu 0 ₺ (süresiz ücretsiz). Tek olası masraf: alan adı (~₺100-300/yıl,
istenirse ücretsiz alt alan adıyla da atlanabilir).

Bölünme:
- **AŞAMA 1-2 (SEN, tarayıcıda):** Oracle hesabı + ücretsiz ARM sunucu oluşturma.
- **AŞAMA 3+ (BEN, SSH ile):** Node, PostgreSQL, Nginx, uygulama kurulumu.

SSH anahtarı zaten üretildi: `~/.ssh/bucayildiz_oracle` (özel) +
`~/.ssh/bucayildiz_oracle.pub` (açık — Oracle'a bu yapıştırılır).

---

## AŞAMA 1 — Oracle Cloud hesabı (10-15 dk, SEN)

1. https://www.oracle.com/cloud/free/ → **Start for free**.
2. E-posta + ülke: **Turkey**. E-posta doğrulama linkine tıkla.
3. Hesap bilgileri:
   - Account type: **Individual** (bireysel)
   - Ad, adres (gerçek — kimlik doğrulama olabilir)
4. **Home Region seçimi — ÇOK ÖNEMLİ, sonradan DEĞİŞTİRİLEMEZ:**
   - **Germany Central (Frankfurt)** seç. (Türkiye'ye en yakın, ücretsiz ARM
     kapasitesi en bol bölgelerden.) Alternatif: Netherlands Northwest (Amsterdam).
5. **Kredi kartı doğrulaması:** Kart bilgisi girilir ama **ücret ÇEKİLMEZ**
   (yalnız ~1$ geçici doğrulama, iade edilir). Always Free katmanı kalıcıdır.
   > Not: Hesap "Free Tier" modunda kalır; yanlışlıkla ücretli kaynak açmadıkça
   > fatura gelmez. Kurduğumuz her şey Always Free sınırları içinde.
6. Telefon doğrulaması (SMS) → hesap oluşur (birkaç dk hazırlık).

---

## AŞAMA 2 — Ücretsiz ARM sunucu (Always Free VM) oluşturma (15 dk, SEN)

Oracle konsoluna girince (cloud.oracle.com):

1. Sol üst menü (☰) → **Compute** → **Instances** → **Create instance**.
2. **Name:** `bucayildiz`
3. **Image and shape** → **Edit**:
   - **Image:** *Change image* → **Canonical Ubuntu** → **24.04** → Select.
   - **Shape:** *Change shape* → **Ampere** sekmesi → **VM.Standard.A1.Flex**.
     - OCPU: **2**, Memory: **12 GB** (Always Free sınırının tamamı) — ya da
       kapasite hatası alırsan **1 OCPU / 6 GB** ile başla, yine yeter.
   > ⚠️ "Out of capacity" / "Out of host capacity" hatası Always Free ARM'de
   > SIK görülür. Çözüm: birkaç saat sonra tekrar dene, ya da OCPU'yu 1'e düşür.
   > Yılmadan tekrar denemek gerekebilir.
4. **Networking:** varsayılan (yeni VCN oluşturacak). **Assign a public IPv4
   address: Yes** (varsayılan açık) — teyit et.
5. **Add SSH keys** → **Paste public keys** → aşağıdaki satırın TAMAMINI yapıştır:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFHUIhUZqpVrg5kJKQEPyjz/g3ZHOtPxT/mniqlYbRvR bucayildiz-oracle
   ```
6. **Boot volume:** varsayılan (47-50 GB) yeter, dokunma.
7. **Create** → 1-2 dk sonra instance "Running" olur. Sayfada **Public IP
   address** görünür → **bunu bana ver.**

### 2.1. Güvenlik: 80/443 portlarını aç (SEN)

Varsayılan olarak yalnız SSH (22) açık. Web için:

1. Instance sayfası → **Virtual Cloud Network** linkine tıkla → **Security Lists**
   → **Default Security List**.
2. **Add Ingress Rules** → iki kural ekle:
   - Source CIDR `0.0.0.0/0`, IP Protocol **TCP**, Destination Port **80**
   - Source CIDR `0.0.0.0/0`, IP Protocol **TCP**, Destination Port **443**
3. Kaydet.

> Not: Ayrıca sunucu içinde Ubuntu firewall'u (iptables) 80/443'ü engelleyebilir;
> onu ben AŞAMA 3'te açacağım.

---

## AŞAMA 3+ — Sunucu kurulumu (BEN, SSH ile)

Public IP'yi verdiğinde bağlanırım (kullanıcı adı Ubuntu image'de `ubuntu`):

```bash
ssh -i ~/.ssh/bucayildiz_oracle ubuntu@PUBLIC_IP
```

Sonra ana rehberdeki (`docs/CANLIYA-ALMA.md`) adımları ARM'e uyarlayarak
yürütürüm — hepsi ARM64'te sorunsuz:
- Sistem güncelleme + firewall (iptables/ufw'de 80/443)
- Node 20 + PostgreSQL 16
- Repo clone + `.env` (AUTH_SECRET üret, DB şifresi) + `npm ci`
- `db:deploy` + `db:seed` + backfill scriptleri
- `npm run build` + PM2
- Nginx + (alan adı varsa) Cloudflare Origin sertifikası; yoksa geçici olarak
  IP + self-signed veya Cloudflare Tunnel ile HTTPS

### Alan adı kararı
- **Alan adın varsa:** Cloudflare'e ekleriz, DNS → sunucu IP, ücretsiz SSL.
- **Alan adı istemiyorsan (0 maliyet):** **Cloudflare Tunnel** ile
  `xxxx.trycloudflare.com` benzeri ücretsiz HTTPS adres verilebilir; ya da
  ücretsiz bir alt alan adı servisi. Görsel olarak zayıf ama tamamen ücretsiz
  ve HTTPS'li (push/PWA için HTTPS şart).

---

## Sıfır maliyet özeti

| Kalem | Ücret |
|---|---|
| Sunucu (Oracle Always Free ARM, 2vCPU/12GB/200GB) | **0 ₺ / süresiz** |
| Cloudflare (DNS/CDN/WAF/SSL) | **0 ₺** |
| Alan adı | ~₺100-300/yıl **veya** ücretsiz alt alan/Tunnel ile 0 ₺ |

## KVKK notu (A senaryosu)
Demo/teslim aşamasında gerçek kişisel/sağlık verisi girilmez → yurt dışı
barındırma sorun değil. Kulüp gerçek veri girmeye başlamadan ÖNCE ya Türkiye
VPS'ine taşınır (`docs/CANLIYA-ALMA.md` hazır) ya da KVKK açık-rıza + yurt dışı
aktarım onayı tamamlanır.
