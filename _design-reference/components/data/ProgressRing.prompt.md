Circular progress gauge built from SVG.

```jsx
<ProgressRing value={11.2} max={30} display="11.2%" sublabel="yağ" label="Vücut Yağ" color="var(--gold-600)" />
<ProgressRing value={42} max={60} display="42%" sublabel="kas" label="Kas Oranı" />
```

`display` overrides the centered text (use it when the gauge fill % and the shown number differ). Animates on mount.
