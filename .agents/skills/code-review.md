---
name: code-review
description: Verilen kod diff'ini SOLID, DRY ve güvenlik açısından inceler; madde madde geri bildirim verir.
model: claude-opus-4-8
---

# /code-review

## Amaç
Bir PR diff'ini veya kod bloğunu aşağıdaki boyutlarda incele ve yapılandırılmış geri bildirim üret.

## İnceleme Boyutları

### 1. SOLID & Tasarım İlkeleri
- Single Responsibility: Her sınıf/fonksiyon tek bir sorumluluğa sahip mi?
- Open/Closed: Mevcut kodu değiştirmeden genişletilebilir mi?
- Liskov / ISP / DIP: Arayüz ve bağımlılık tasarımı sağlam mı?
- DRY: Tekrar eden kod var mı? Soyutlama yerinde mi?
- KISS/YAGNI: Gereksiz karmaşıklık veya erken soyutlama var mı?

### 2. Kod Kalitesi (bkz. AGENTS.md §2)
- Fonksiyonlar 40-50 satırı geçiyor mu?
- İsimlendirme anlamlı ve tutarlı mı?
- Hata yolları (error path) açıkça ele alınmış mı? Sessiz `catch` var mı?
- Linter/type-check uyumlu mu?

### 3. Güvenlik
- Input validation eksik mi?
- Yetkilendirme/kimlik doğrulama atlanmış yer var mı?
- SQL/command injection, XSS gibi açıklar mevcut mu?
- Hassas veri loglanıyor ya da dışarı sızıyor mu?

### 4. Test Kapsamı
- Yeni davranış için test eklenmiş mi?
- Edge-case'ler ele alınmış mı?

## Çıktı Formatı

```
## Kod İncelemesi

### Kritik (blokerlır)
- [Dosya:Satır] Sorun açıklaması — Öneri

### Önemli (düzeltilmeli)
- [Dosya:Satır] Sorun açıklaması — Öneri

### Küçük (isteğe bağlı)
- [Dosya:Satır] Sorun açıklaması — Öneri

### Olumlu
- İyi yapılmış şeyler
```

## Kurallar
- Somut dosya:satır referansı ver; soyut yorum yazma.
- Her bulgu için net bir öneri sun.
- Olumlu geri bildirimi atlama — iyi pratikler de belgelensin.
- AGENTS.md §2'deki standartlar geçerlidir; çelişki varsa AGENTS.md önceliklidir.
