On/off toggle, navy when active.

```jsx
<Switch defaultChecked label="Yayında" />
<Switch checked={featured} onChange={(v)=>setFeatured(v)} />
```

Controlled (`checked`+`onChange`) or uncontrolled (`defaultChecked`). Optional `label`, `size="sm"`.
