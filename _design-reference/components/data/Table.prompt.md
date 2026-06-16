Admin data table. Define `columns` (with optional `render`), pass `rows`.

```jsx
<Table
  columns={[
    { key:'name', label:'Sporcu', render:(r)=><b>{r.name}</b> },
    { key:'team', label:'Takım' },
    { key:'boy', label:'Boy', align:'right', render:(r)=>`${r.boy} cm` },
  ]}
  rows={athletes}
  onRowClick={(r)=>openAthlete(r)} />
```

`render(row,i)` returns any node — compose DS `Avatar`/`Badge` inside. `dense` tightens row padding.
