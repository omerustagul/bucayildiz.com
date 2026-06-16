Dashboard metric tile — uppercase label, big tabular value, optional unit and trend delta.

```jsx
<StatTile label="VO2 Max" value="56.4" unit="ml/kg" delta="3.1%" deltaTone="up" sub="son ölçüm" accent />
<StatTile label="Vücut Yağ" value="11.2" unit="%" delta="0.6%" deltaTone="down" />
```

`deltaTone`: `up` (green ▲), `down` (red ▼), `neutral`. Note: for performance metrics, decide per-metric whether "down" is good (body fat) or bad (VO2) and set the tone accordingly.
