#!/usr/bin/env bash
# Saatlik hatırlatma tetikleyicisi (Faz 4.2).
#
# Anahtar ENV DOSYASINDAN okunur — crontab satırında SIR TUTULMAZ (crontab'ı okuyan
# herkes sırrı görürdü). Uygulamaya doğrudan 127.0.0.1:3000 üzerinden gidilir (Nginx'i
# atlar; dış dünyaya açılmaz).
#
# Kurulum (sunucuda, root):
#   crontab -e
#   0 * * * * /bin/bash /var/www/bucayildiz.com/scripts/cron-reminders.sh >> /var/log/bucayildiz-reminders.log 2>&1
#
# Saatlik çalışır ama mükerrer bildirim ÜRETMEZ: motor yalnız gönderim penceresinde
# (09:00-21:00) çalışır ve her hatırlatma DB'de unique kısıtla bir kez gönderilir.
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.production"
[ -f "$ENV_FILE" ] || ENV_FILE=".env"
[ -f "$ENV_FILE" ] || { echo "[cron-reminders] env dosyası bulunamadı"; exit 1; }

# Değer tırnaklı veya satır sonu yorumlu olabilir → sadece tırnak içini/ilk alanı al.
KEY=$(grep -E '^CRON_SECRET=' "$ENV_FILE" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/".*$//' -e "s/^'//" -e "s/'.*$//" | awk '{print $1}')
if [ -z "$KEY" ]; then
  echo "[cron-reminders] CRON_SECRET tanımlı değil ($ENV_FILE) — 'npm run cron:secret' ile üretin"
  exit 1
fi

echo "[cron-reminders] $(date '+%F %T') tetikleniyor"
curl -fsS --max-time 60 -X POST \
  -H "x-cron-key: $KEY" \
  http://127.0.0.1:3000/api/cron/reminders
echo ""
