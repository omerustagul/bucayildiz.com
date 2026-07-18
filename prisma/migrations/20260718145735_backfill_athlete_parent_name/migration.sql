-- VERİ MİGRATION'I (şema değişikliği yok).
--
-- `Athlete.parentName` yeni eklendi. Başvurudan DÖNÜŞTÜRÜLMÜŞ sporcularda sorumlu
-- kişinin adı zaten `Application.parentName`de duruyor — oradan taşı. Böylece mevcut
-- sporcuların rıza kayıtları da gerçek veli adını taşımaya başlar.
--
-- Elle oluşturulan sporcularda (applicationId NULL) kaynak YOK → boş kalır; kod
-- tarafı boşken "veli" ilişkisi İDDİA ETMEZ (yanlış denetim izi yazmaktansa boş bırak).
--
-- Idempotent: yalnız hâlâ boş olanları doldurur, tekrar çalışsa üzerine yazmaz.
UPDATE "Athlete" a
SET "parentName" = NULLIF(btrim(ap."parentName"), '')
FROM "Application" ap
WHERE a."applicationId" = ap."id"
  AND a."parentName" IS NULL
  AND NULLIF(btrim(ap."parentName"), '') IS NOT NULL;
