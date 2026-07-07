---
name: test-writer
description: Verilen fonksiyon veya modül için birim testleri üretir; edge-case'leri ve hata yollarını kapsar.
model: claude-sonnet-5
---

# /test-writer

## Amaç
Bir fonksiyon, sınıf veya modül verildiğinde kapsamlı birim testleri yaz.

## Çalışma Akışı

1. **Analiz** — Fonksiyonun girdilerini, çıktılarını ve yan etkilerini belirle.
2. **Test Planı** — Aşağıdaki kategorileri listele:
   - Happy path (beklenen normal akış)
   - Edge cases (sınır değerleri, boş giriş, null/undefined)
   - Hata yolları (exception, reject, hata kodu dönüşü)
   - Bağımlılık mocklama gereken durumlar
3. **Testleri Yaz** — Projenin mevcut test framework'ünü kullan (Jest, Vitest, pytest vb.); yeni bir bağımlılık ekleme.

## Test Yazım Standartları (bkz. AGENTS.md §2)

- Her test tek bir davranışı doğrular; çoklu assert'ten kaçın.
- Test isimleri `should <beklenti> when <koşul>` formatında olsun.
- Mock/stub dışarıda tanımla; test içinde karmaşık setup kurma.
- Asenkron testlerde her zaman `await` / `async` kullan.
- Sessizce geçen testler (`expect()` çağrısı olmayan) yasak.

## Çıktı Formatı

```
// <ModülAdı>.test.<uzantı>

describe('<ModülAdı>', () => {
  describe('<fonksiyonAdı>', () => {
    it('should <beklenti> when <koşul>', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Kurallar
- Proje dizinindeki mevcut test örneklerini incele; aynı kalıbı kullan.
- %80+ branch coverage hedefle; raporlama istenmişse özet çıkar.
- Entegrasyon testi gerekiyorsa belirt ama sadece birim testi yaz — kapsam dışını not geç.
- AGENTS.md §2: yeni davranışa her zaman test eşlik eder.
