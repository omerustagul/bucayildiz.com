---
name: security-audit
description: Kodu input validation, yetkilendirme ve bağımlılık güvenliği açısından tarar; OWASP Top 10 odaklı bulgular üretir.
model: claude-opus-4-8
---

# /security-audit

## Amaç
Belirtilen dosya, modül veya değişikliği güvenlik açıklarına karşı tara ve önceliklendirilmiş bulgular sun.

## Tarama Kategorileri

### A. Input Validation
- Kullanıcıdan gelen her girdi doğrulanıyor mu? (tip, uzunluk, format)
- SQL injection, NoSQL injection riski var mı?
- XSS — kullanıcı girdisi DOM'a veya HTML'e ham şekilde yazılıyor mu?
- Path traversal, shell injection riski var mı?
- Dosya yükleme kısıtlamaları yeterli mi?

### B. Kimlik Doğrulama & Yetkilendirme
- Kimlik doğrulama atlanabilecek endpoint var mı?
- Yatay yetki yükseltme (kullanıcı A, kullanıcı B'nin verisine erişebiliyor mu)?
- JWT/session token güvenli saklanıyor ve doğrulanıyor mu?
- Hassas route'larda middleware/guard eksik mi?

### C. Veri Güvenliği
- Şifre, token, API anahtarı log'a yazılıyor mu?
- Hassas veri response body'sinde gereksiz yere dönüyor mu?
- Veritabanında hassas alan şifrelemesi var mı?

### D. Bağımlılık Güvenliği
- `package.json` / `requirements.txt` / `Gemfile`'da bilinen CVE içeren paket var mı?
- Paket sürümleri sabitlenmiş mi (lock dosyası mevcut mu)?
- Gereksizsiz ayrıcalıkla çalışan bağımlılık var mı?

### E. Altyapı & Konfigürasyon
- `.env` dosyası git'e eklenmiş mi?
- CORS politikası `*` ile açık mı?
- Rate limiting eksik endpoint var mı?
- HTTPS zorunlu mu?

## Çıktı Formatı

```
## Güvenlik Denetimi

### Kritik (hemen düzeltilmeli)
- [CWE-ID] [Dosya:Satır] Açıklama — Saldırı senaryosu — Öneri

### Yüksek
- ...

### Orta
- ...

### Düşük / Bilgi
- ...

### Taranmayan Alan
- (kapsam dışı kalan kısımlar)
```

## Kurallar
- Her bulguya OWASP Top 10 veya CWE referansı ekle.
- Gerçekçi saldırı senaryosu yaz; teorik tehdit yeterli değil.
- False positive olabilecekleri "(doğrulama gerekli)" ile işaretle.
- AGENTS.md §3 Güvenlik & Kod İnceleme rolü kapsamındadır.