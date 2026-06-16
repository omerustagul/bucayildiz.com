Fixture (maç) card with a navy header strip, both team crests, and either a score or kickoff time.

```jsx
<FixtureCard competition="U-17 Gelişim Ligi" date="14 Haziran" venue="Buca Yıldız Tesisleri"
  status="upcoming"
  home={{ name: 'Buca Yıldız', crest: '/assets/logo-emblem.png', time: '19:00' }}
  away={{ name: 'Karşıyaka SK' }} />
```

`status`: `upcoming` (shows `home.time`), `live` (pulsing CANLI + live score), `finished` (final score). Crests fall back to an initials monogram.
