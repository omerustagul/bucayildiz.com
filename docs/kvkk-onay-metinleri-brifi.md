# KVKK Onay Metinleri — Avukat Brifi

> **Bu belge nedir?** Buca Yıldız Futbol Akademisi web uygulamasının kullandığı
> **6 ayrı onay/aydınlatma metninin** ne içermesi gerektiğini anlatan brieftir.
> Amaç: avukata **tam olarak neyin gerektiğini** iletmek; avukat **nihai metinleri**
> yazıp onaylayacak. Buradaki taslaklar yalnızca **niyet/başlangıç noktasıdır**,
> hukuki metin değildir.
>
> **Kod karşılığı:** `src/lib/consent.ts` → `CONSENT_DOCS` (5 belge) +
> `CAREER_CONSENT_TEXT` (1 belge). Şu anki `body` metinleri **TASLAK**tır ve
> `⚠️ Bu metin taslaktır…` ibaresiyle işaretlidir. Onaylı metinler gelince bu
> alanlar değiştirilir ve `CONSENT_VERSION` güncellenir.

---

## 0. En kritik 6 kural (avukat metinleri bunlara uymalı)

1. **Ayrı metinler — battaniye rıza YOK.** Tek bir "hepsini kabul ediyorum"
   kutusu KVKK'da geçersizdir. Her amaç kendi metnine + kendi onay kutusuna
   sahiptir.
2. **Aydınlatma ≠ Rıza.** Aydınlatma metni bir *bilgilendirmedir* (onay değil).
   Açık rıza ayrı, iradi bir beyandır.
3. **Opsiyonel onaylar kayıt/üyelik şartına bağlanamaz.** Fotoğraf-video ve
   pazarlama onayları **opsiyoneldir**; verilmemesi başvuru/üyelik hakkını
   etkilemez ve metin bunu **açıkça** yazmalıdır.
4. **Çocuk verisi + veli rızası.** Sporcuların büyük kısmı 18 yaş altıdır; açık
   rıza **veli/yasal temsilci** tarafından, çocuk adına verilir. Metinler bunu
   yansıtmalı.
5. **Özel nitelikli veri (sağlık) ayrı ve açık rıza ile.** Sağlık ve fiziksel
   ölçüm verileri KVKK md.6 kapsamında özel nitelikli veridir; ayrı bir açık
   rıza ile ve dar bir erişim çevresiyle işlenir.
6. **Her onay geri alınabilir; yöntem metinde belirtilir.** Onay/geri-alma
   **denetim izi** ile saklanır (metin sürümü + SHA-256 hash + tarih + IP/UA +
   veli). Bu yüzden metin bir kez onaylanınca **sürümü sabitlenir**; değişiklikte
   yeni sürüm çıkar (eski kayıtlar hangi sürüme onay verildiğini korur).

---

## 1. Bağlam — avukatın bilmesi gerekenler

- **Veri sorumlusu:** Buca Yıldız Futbol Akademisi.
  *(Kulüp doldurmalı: tam yasal unvan, adres, VERBİS kayıt no, KEP/e-posta,
  başvuru kanalı.)*
- **İşlenen kişisel veriler:**
  - Sporcu adayı: ad-soyad, **doğum tarihi**, iletişim, **boy/kilo/fiziksel
    performans ölçümleri**, **sağlık durumu** (özel nitelikli), varsa **görsel**
    (foto/video), varsa mevcut kulüp/lisans bilgisi.
  - Veli/yasal temsilci: ad-soyad, iletişim.
  - İş başvurusu (kariyer): ad-soyad, e-posta, telefon, özgeçmiş (CV).
- **Barındırma / aktarım:** Veriler **Türkiye'de** barındırılır. Şu an yurt dışına
  aktarım **yoktur** — metinler bunu doğrulamalı. (Kullanılan altyapı/veri
  işleyenler — hosting, ileride SMS/e-posta sağlayıcı — kulüp tarafından avukata
  bildirilmeli.)
- **Saklama süreleri:** Taslaklarda "mevzuatın gerektirdiği süre" gibi genel
  ifade var; **avukat/kulüp somut süreleri** (ör. üyelik boyunca + X yıl)
  belirlemeli.

---

## 2. Tüm metinlerde bulunması gereken ortak unsurlar

**Aydınlatma unsurları (KVKK md.10):**
- Veri sorumlusunun (ve varsa temsilcisinin) kimliği,
- Kişisel verilerin hangi amaçla işleneceği,
- İşlenen veri kategorileri,
- Kimlere ve hangi amaçla aktarılabileceği (şu an: aktarım yok / yalnızca yasal
  zorunluluk),
- Toplama yöntemi ve hukuki sebebi,
- **KVKK md.11 hakları:** bilgi talep etme, erişim, düzeltme, silme/yok etme,
  işlemenin sınırlanması/itiraz, zararın giderilmesini talep — ve bu hakların
  **nasıl kullanılacağı** (başvuru kanalı).

**Açık rıza unsurları (KVKK md.3/5):** rıza **belirli bir konuya** ilişkin,
**bilgilendirmeye dayalı** ve **özgür iradeyle** açıklanmış olmalı. "Genel/belirsiz"
rıza geçersizdir.

---

## 3. Metin metin brief (6 belge)

### 3.1 Aydınlatma Metni — `aydinlatma`
- **Tür:** Bilgilendirme (onay/rıza **değil**). **Zorunlu** (okundu onayı).
- **Formdaki kısa cümle:** "Aydınlatma metnini okudum."
- **Amaç:** Başvuru öncesi, sporcu adayı ve velisini md.10 kapsamında bütün
  işleme hakkında bilgilendirmek.
- **İçermesi gerekenler:**
  - Yukarıdaki **md.10 unsurlarının tamamı**.
  - İşlenen veri kategorilerinin **açık listesi** (kimlik, iletişim, doğum tarihi,
    fiziksel ölçüm, sağlık, görsel).
  - İşleme amaçları: başvuru değerlendirme, deneme antrenmanı, antrenman
    planlama, performans takibi, yasal yükümlülük.
  - Türkiye'de barındırma; saklama süresi; aktarım durumu.
  - md.11 hakları ve başvuru kanalı.
- **Mevcut taslak (niyet):** Kulübün veri sorumlusu sıfatı, veri kategorileri,
  amaçlar, TR barındırma ve md.11 haklarını özetliyor.
- **Avukata not:** Bu metin diğer 4 metnin "şemsiye bilgilendirmesidir"; en
  kapsamlı olan budur.

### 3.2 Kişisel Verilerin İşlenmesi — Açık Rıza — `acik-riza`
- **Tür:** Açık rıza. **Zorunlu.**
- **Formdaki kısa cümle:** "Kişisel verilerimin yukarıdaki amaçlarla işlenmesine
  açık rıza veriyorum."
- **Amaç:** Sporcu adayı + velinin **kimlik ve iletişim** verilerinin başvuru
  değerlendirmesi, deneme antrenmanı organizasyonu ve iletişim amaçlarıyla
  işlenmesine rıza.
- **İçermesi gerekenler:**
  - Rızanın **konusu ve amacı** net (sağlık/özel nitelikli veri **buraya
    girmez** — o ayrı belgede, madde 3.3).
  - Rızanın **geri alınabilirliği** ve yöntemi.
  - Veli, çocuk adına rıza veriyorsa bunun beyanı.
- **Avukata not:** Sağlık verisini bu metne KARIŞTIRMAYIN — özel nitelikli veri
  ayrı açık rıza ister (md.3.3).

### 3.3 Sağlık ve Fiziksel Ölçüm Verileri — Açık Rıza (Özel Nitelikli) — `saglik-verisi`
- **Tür:** Açık rıza — **özel nitelikli** (KVKK md.6). **Zorunlu.**
- **Formdaki kısa cümle:** "Sporcunun sağlık ve fiziksel ölçüm (özel nitelikli)
  verilerinin işlenmesine açık rıza veriyorum."
- **Amaç:** Boy, kilo, fiziksel performans ölçümleri ve sağlık durumunun
  antrenman güvenliği, gelişim ve performans takibi amacıyla işlenmesi.
- **İçermesi gerekenler:**
  - Verinin **özel nitelikli** olduğunun açıkça belirtilmesi.
  - **Dar erişim çevresi:** yalnızca yetkili antrenör/sağlık personeli.
  - İşleme amacının **spesifik** olması (sağlık verisi başka amaçla kullanılamaz).
  - Türkiye'de saklama; geri alma hakkı.
- **Avukata not:** **KVKK md.6 (özel nitelikli veriler) 2024 değişikliklerinden
  etkilenmiştir** — lütfen **güncel md.6 rejimine** (açık rıza / kanuni işleme
  şartları / aktarım kuralları) göre teyit edin. Bu, tüm sistemin en hassas
  metnidir.

### 3.4 Fotoğraf ve Video Paylaşım Muvafakatnamesi — `foto-video`
- **Tür:** Açık rıza / muvafakat. **OPSİYONEL** (kayda bağlanamaz).
- **Formdaki kısa cümle:** "Sporcunun fotoğraf/videolarının Kulüp tanıtımında ve
  sosyal medyada paylaşılmasına izin veriyorum."
- **Amaç:** Antrenman/maç/etkinlik görsellerinin web sitesi, sosyal medya ve
  tanıtım materyallerinde paylaşımı.
- **İçermesi gerekenler:**
  - Paylaşım **kanalları/mecraları** (web, sosyal medya, basılı tanıtım).
  - **"Bu izin opsiyoneldir; verilmemesi üyelik/kayıt hakkını etkilemez"**
    ifadesi (zorunlu — KVKK).
  - Geri alma → **ileriye dönük** paylaşımların durdurulacağı; yayınlanmış
    materyal için sınırlar.
  - Çocuk görseli olduğundan veli muvafakati.
- **Avukata not:** Çocuğun görüntüsü kişilik hakkı + özel önem taşır; kapsam dar
  ve anlaşılır olmalı.

### 3.5 Ticari Elektronik İleti (Pazarlama) İzni — `pazarlama`
- **Tür:** Açık rıza / ETK izni. **OPSİYONEL.**
- **Formdaki kısa cümle:** "Kulüpten haber, duyuru ve kampanyalardan haberdar
  olmak istiyorum."
- **Amaç:** Haber/duyuru/etkinlik/kampanya amaçlı **ticari elektronik ileti**
  (SMS/e-posta) gönderimi.
- **İçermesi gerekenler:**
  - **6563 sayılı Kanun + Ticari İletişim Yönetmeliği** ve **İYS (İleti Yönetim
    Sistemi)** uyumu.
  - İletinin **türü** (SMS/e-posta) ve **konusu**.
  - **Ret/çıkış (opt-out)** hakkı ve yöntemi; opsiyonel olduğu.
- **Avukata not:** Bu izin **KVKK açık rızasından ayrı** olarak **ETK/İYS**
  mevzuatına da tabidir; her ileti tipinde onay ve red kolaylığı sağlanmalı.

### 3.6 Kariyer / İş Başvurusu — Aydınlatma + Açık Rıza — `CAREER_CONSENT_TEXT`
- **Tür:** Kayıt-**içinde** tek metin (aydınlatma + rıza birlikte). **Yetişkin**
  başvuran; sporcu tarafının çok-belgeli sistemi burada **tekrarlanmaz**.
- **Amaç:** İş/staj başvurusu için ad-soyad, e-posta, telefon ve **CV**'nin
  **yalnızca başvuru değerlendirme ve iletişim** amacıyla işlenmesi.
- **İçermesi gerekenler:**
  - Veri kategorileri (ad-soyad, iletişim, CV içeriği).
  - Amaç **sınırlaması:** yalnızca işe alım değerlendirmesi + iletişim;
    **üçüncü kişilerle paylaşılmaz**.
  - Saklama süresi (süreç sonuçlanana kadar / mevzuat süresi — **somutlaştırılmalı**).
  - Türkiye'de barındırma; md.11 hakları.
  - Açık rıza beyanı.
- **Avukata not:** CV serbest metin/dosya olduğundan **beklenmeyen özel nitelikli
  veri** (ör. sağlık, ceza mahkûmiyeti) içerebilir; metin, istenmeyen özel
  nitelikli verinin gönderilmemesi yönünde uyarı içerebilir.

---

## 4. Teknik kısıtlar (onaylı metin sisteme sorunsuz otursun diye)

- **Ayrı `body` alanları:** Her metin `CONSENT_DOCS` içindeki ilgili `key` altına
  yerleştirilir; metinler **bağımsız** olmalı (biri diğerine "yukarıda kabul
  ettiğiniz" diye zorunlu atıfla bağlanmamalı — sıralama değişebilir).
- **`summary` (kısa onay cümlesi):** Formda checkbox yanında görünen tek cümle;
  avukat isterse revize eder ama **kısa ve tek amaçlı** kalmalı.
- **Opsiyoneller:** `foto-video` ve `pazarlama` metinleri, opsiyonel olduklarını
  **kendi gövdelerinde** yazmalı (form da opsiyonel gösteriyor).
- **Sürümleme:** Onaylı metin gelince ilgili `body` güncellenir ve
  `CONSENT_VERSION` (şu an `2026-06-15`) ile `CAREER_CONSENT_VERSION` yeni tarihe
  çekilir. Böylece her `ConsentRecord`, onay verilen **tam metin sürümünü**
  (hash'iyle) korur — geriye dönük denetim için kritik.
- **Dokunulmaması gereken:** Onay/denetim akışı (hash, IP/UA, veli, sürüm) ve
  ayrı-belge mimarisi **değişmez**; avukat yalnız **metin içeriğini** verir.

---

## 5. Kulübün avukata iletmesi gereken eksik bilgiler

Aşağıdakiler koda gömülü değildir; metinlerin tamamlanması için gerekir:

- [ ] Tam **yasal unvan** ve **adres**
- [ ] **VERBİS** kayıt numarası (varsa)
- [ ] **KEP adresi** / resmi e-posta
- [ ] **KVKK başvuru kanalı** (md.11 haklarının kullanımı için)
- [ ] Somut **saklama süreleri** (sporcu, sağlık, görsel, kariyer için ayrı ayrı)
- [ ] Varsa **veri işleyenler** (barındırma sağlayıcı, ileride SMS/e-posta servisi)
- [ ] **İYS** marka/kayıt bilgileri (pazarlama izni için)

---

## 6. Özet tablo

| # | Metin | `key` | Tür | Zorunlu? | Özel not |
|---|---|---|---|---|---|
| 1 | Aydınlatma Metni | `aydinlatma` | Bilgilendirme | Zorunlu | md.10 şemsiye |
| 2 | Kişisel Veri — Açık Rıza | `acik-riza` | Açık rıza | Zorunlu | Sağlık HARİÇ |
| 3 | Sağlık/Ölçüm — Açık Rıza | `saglik-verisi` | Açık rıza (özel nitelikli) | Zorunlu | md.6, dar erişim |
| 4 | Foto/Video Muvafakat | `foto-video` | Muvafakat | **Opsiyonel** | Kayda bağlanamaz |
| 5 | Ticari Elektronik İleti | `pazarlama` | ETK/İYS izni | **Opsiyonel** | 6563 + İYS |
| 6 | Kariyer Başvurusu | `CAREER_CONSENT_TEXT` | Aydınlatma+rıza | Rıza kutusu | Yetişkin, tek metin |

> **Süreç:** Avukat yukarıdaki 6 metni onaylı hâle getirir → geliştirici
> `src/lib/consent.ts` içindeki `body`/`CAREER_CONSENT_TEXT` alanlarına yerleştirir
> ve sürüm tarihlerini günceller → yeni belge sürümü seed edilir. Onay/denetim
> altyapısı hazırdır; **yalnız metinler beklenmektedir.**
