Tab bar with gold active underline (or pill/segmented variant).

```jsx
<Tabs tabs={[{id:'all',label:'Tümü',count:42},{id:'u17',label:'U-17',count:24}]}
  value={tab} onChange={setTab} />
<Tabs tabs={['Hafta','Ay']} variant="pill" defaultValue="Hafta" />
```

Items can be strings or `{id,label,icon,count}`. Controlled or uncontrolled.
