Primary action button — navy by default; use the gold `accent` variant sparingly for the single most important CTA on a view (e.g. "Kayıt Ol").

```jsx
<Button variant="accent" size="lg">Ücretsiz Denemeye Kayıt Ol</Button>
<Button variant="primary">Başvuru Yap</Button>
<Button variant="secondary">Detaylar</Button>
<Button variant="on-navy" size="sm">Panele Giriş</Button>
```

Variants: `primary` (navy), `accent` (gold gradient, dark text), `secondary` (navy outline), `ghost` (text only), `on-navy` (for dark/navy backgrounds). Sizes: `sm` `md` `lg`. Labels render UPPERCASE automatically. Supports `leftIcon` / `rightIcon`, `fullWidth`, `disabled`, and `as="a"`.
