"use client";

/**
 * Leaflet + OpenStreetMap haritaları (ücretsiz, API-key yok, KVKK-dostu — Google'a
 * veri gitmez). İki kullanım: MapPicker (admin ayarlar — tıkla-seç), LocationMap
 * (/iletisim — statik önizleme, tıklayınca Google Maps'te açılır).
 *
 * Tuzaklar ele alındı:
 * - SSR: leaflet window'a erişir → useEffect İÇİNDE dinamik import (yalnız client).
 * - Marker asseti bundler'da bozulur → divIcon (gömülü SVG pin, dış dosya yok).
 * - Konteyner yüksekliği açık verilir (yoksa harita 0px).
 * - StrictMode çift-mount: cancelled bayrağı + _leaflet_id guard + cleanup.
 */

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// İzmir Buca merkezi — kayıtlı konum yoksa başlangıç.
const DEFAULT_CENTER: [number, number] = [38.3894, 27.1786];

// Marka pin'i (lacivert damla + altın halka/nokta) — dış görsele bağımsız.
const PIN_HTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#26215F" stroke="#DDBA4E" stroke-width="1.4"/>
  <circle cx="12" cy="9" r="2.6" fill="#DDBA4E"/>
</svg>`;

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Admin: haritaya tıklayınca marker konur ve (lat,lng) yukarı bildirilir. */
export function MapPicker({
  lat,
  lng,
  onChange,
  height = 300,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // onChange'i ref'te tut — harita bir kez init olur, güncel callback'i çağırır.
  // Ref güncellemesi effect'te (render sırasında ref yazımı lint'e takılır).
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | null = null;
    (async () => {
      const L = (await import("leaflet")).default;
      const el = ref.current as (HTMLDivElement & { _leaflet_id?: number }) | null;
      if (cancelled || !el || el._leaflet_id) return;
      const start: [number, number] = lat != null && lng != null ? [lat, lng] : DEFAULT_CENTER;
      map = L.map(el).setView(start, lat != null ? 16 : 13);
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ html: PIN_HTML, className: "", iconSize: [30, 30], iconAnchor: [15, 30] });
      let marker: import("leaflet").Marker | null = lat != null && lng != null ? L.marker([lat, lng], { icon }).addTo(map) : null;
      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        const la = +e.latlng.lat.toFixed(6);
        const ln = +e.latlng.lng.toFixed(6);
        if (marker) marker.setLatLng([la, ln]);
        else marker = L.marker([la, ln], { icon }).addTo(map!);
        onChangeRef.current(la, ln);
      });
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
    // Bir kez init — sonraki seçimler harita içinde marker'ı günceller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      role="application"
      aria-label="Konum seçme haritası"
      style={{ height, width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", cursor: "crosshair", zIndex: 0 }}
    />
  );
}

/** /iletisim: konum önizlemesi (etkileşimsiz) — tıklayınca Google Maps açılır. */
export function LocationMap({ lat, lng, height = 300 }: { lat: number; lng: number; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | null = null;
    (async () => {
      const L = (await import("leaflet")).default;
      const el = ref.current as (HTMLDivElement & { _leaflet_id?: number }) | null;
      if (cancelled || !el || el._leaflet_id) return;
      map = L.map(el, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
      });
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ html: PIN_HTML, className: "", iconSize: [30, 30], iconAnchor: [15, 30] });
      L.marker([lat, lng], { icon }).addTo(map);
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng]);

  const gmaps = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <a
      href={gmaps}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Konumu Google Maps'te aç"
      style={{ position: "relative", display: "block", height, width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", textDecoration: "none" }}
    >
      {/* Harita etkileşimsiz (pointerEvents none) — tıklama <a>'ya gider */}
      <div ref={ref} style={{ height: "100%", width: "100%", pointerEvents: "none", zIndex: 0 }} />
      <span
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: "var(--radius-pill)",
          background: "var(--navy-900)",
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 600,
          boxShadow: "var(--shadow-md)",
        }}
      >
        {"Google Maps'te aç"}
      </span>
    </a>
  );
}
