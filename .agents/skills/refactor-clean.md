---
name: refactor-clean
description: Karmaşık veya tekrarlı kodu SOLID/DRY/KISS ilkelerine göre sadeleştirir; davranışı koruyarak somut refactor önerileri sunar.
model: claude-sonnet-5
---

# /refactor-clean

## Amaç
Verilen kod bloğunu analiz et, sorunları sırala ve davranışı bozmadan somut refactor önerileri üret.

## Analiz Adımları

1. **Sorun Tespiti** — Aşağıdaki kötü kalıpları ara:
   - Uzun fonksiyonlar (>40-50 satır) — bölünebilir mi?
   - Tekrar eden kod (DRY ihlali) — ortak helper/util çıkarılabilir mi?
   - Derin iç içe koşul blokları (early-return ile düzleştirilebilir mi?)
   - God object/god function — çok fazla sorumluluk taşıyan birim
   - Magic number/string — sabit veya enum ile adlandırılmalı
   - Gereksiz yorum — kod zaten açıklayıcıysa yorum kaldır; açık değilse kodu düzelt
   - Ölü kod / kullanılmayan import

2. **Önceliklendir** — Her sorunu etkisine göre sırala:
   - **Yüksek**: okunabilirlik/bakım maliyetini ciddi artırıyor
   - **Orta**: teknik borç oluşturuyor
   - **Düşük**: kozmetik iyileştirme

3. **Refactor Uygula** — Onay gerektirmeden uygulayabileceğin değişikler için doğrudan düzeltilmiş kodu yaz.  
   Mimariyi etkileyen değişiklikler (dosya taşıma, arayüz kırma) için önce öneri sun, onay al.

## Çıktı Formatı

```
## Refactor Raporu

### Yüksek Öncelik
- [Dosya:Satır] Sorun — Neden kötü — Önerilen değişiklik

### Orta Öncelik
- ...

### Düşük Öncelik
- ...

---

### Düzeltilmiş Kod
\`\`\`<dil>
// refactor edilmiş versiyon
\`\`\`

### Davranış Değişikliği Riski
- (varsa belirt; yoksa "Yok")
```

## Kurallar
- Refactor sonrası davranış değişmemeli; mevcut testlerin hâlâ geçmesi gerekir.
- Yeni bir soyutlama eklemeden önce YAGNI testini geç: "bu soyutlamayı gerçekten 2+ yerde kullanacak mıyız?"
- AGENTS.md §2: "çalışıyor ama karmaşık" kabul edilebilir bir bitiş durumu değildir.
- Refactor tamamlandıktan sonra `/test-writer` skill'ini tetikle (varsa test eksikse).