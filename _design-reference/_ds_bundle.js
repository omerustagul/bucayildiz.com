/* @ds-bundle: {"format":3,"namespace":"BucaYLdZTasarMSistemi_45a34f","components":[{"name":"AgeGroupCard","sourcePath":"components/club/AgeGroupCard.jsx"},{"name":"FixtureCard","sourcePath":"components/club/FixtureCard.jsx"},{"name":"NewsCard","sourcePath":"components/club/NewsCard.jsx"},{"name":"SectionHeading","sourcePath":"components/club/SectionHeading.jsx"},{"name":"TrialBanner","sourcePath":"components/club/TrialBanner.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"MetricBar","sourcePath":"components/data/MetricBar.jsx"},{"name":"ProgressRing","sourcePath":"components/data/ProgressRing.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/club/AgeGroupCard.jsx":"59fff72e5449","components/club/FixtureCard.jsx":"f20fe10a446e","components/club/NewsCard.jsx":"936a43363b12","components/club/SectionHeading.jsx":"18ebce0f7f4e","components/club/TrialBanner.jsx":"bf9105df0bcd","components/core/Avatar.jsx":"bd1a0078b181","components/core/Badge.jsx":"a1f4278094d7","components/core/Button.jsx":"aaabfd16e7e2","components/core/Card.jsx":"9f177f3e5f29","components/core/IconButton.jsx":"9c4932dc993f","components/data/MetricBar.jsx":"8517e5dd33d1","components/data/ProgressRing.jsx":"93024227f396","components/data/StatTile.jsx":"a58464c3cb27","components/data/Table.jsx":"5557ec31dddb","components/forms/Checkbox.jsx":"c5b0a8af4a2f","components/forms/Input.jsx":"cf4b343bfcc0","components/forms/Select.jsx":"6e70659cd55d","components/forms/Switch.jsx":"9977eceb7956","components/navigation/Tabs.jsx":"1c6e6c2c50a2","ui_kits/admin/AdminData.jsx":"9b99b8aac64e","ui_kits/admin/AdminShell.jsx":"90bda3938f95","ui_kits/admin/AdminUI.jsx":"7609f0d5335e","ui_kits/admin/AthletesView.jsx":"06bce2bbe392","ui_kits/admin/BlogView.jsx":"cfb9dd20df5f","ui_kits/admin/DashboardView.jsx":"da2d2d14c1b0","ui_kits/admin/FixturesView.jsx":"dd2ce25cae59","ui_kits/admin/JerseysView.jsx":"c73d346bfcd5","ui_kits/admin/MediaView.jsx":"f3667fb77ffb","ui_kits/admin/TeamsView.jsx":"3de477b96132","ui_kits/admin/TrainingView.jsx":"5bdb493d5ba8","ui_kits/panel/AthleteCard.jsx":"911c974d630b","ui_kits/panel/PanelShell.jsx":"e98417044f41","ui_kits/panel/PerformanceMatrix.jsx":"9f25b20f7d92","ui_kits/panel/TrainingCalendar.jsx":"b9fe4c62b445","ui_kits/website/AgeGroupsSection.jsx":"a47752a79573","ui_kits/website/FixtureSection.jsx":"63c90be254be","ui_kits/website/JerseySection.jsx":"29278a592b62","ui_kits/website/MediaSection.jsx":"0b7db87328c6","ui_kits/website/NewsSection.jsx":"15008defc041","ui_kits/website/SiteFooter.jsx":"d248e28d3bfe","ui_kits/website/SiteHeader.jsx":"50a5f064db72","ui_kits/website/TrialJourney.jsx":"420e08947f2b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BucaYLdZTasarMSistemi_45a34f = window.BucaYLdZTasarMSistemi_45a34f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/club/AgeGroupCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — AgeGroupCard
 * Yaş grubu kartı (A Takım, U-15…U-18). Photo + navy scrim + big label.
 */
function AgeGroupCard({
  label,
  title,
  count,
  image,
  href = '#',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: {
      position: 'relative',
      display: 'block',
      overflow: 'hidden',
      aspectRatio: '3 / 4',
      borderRadius: 'var(--radius-lg)',
      textDecoration: 'none',
      border: '1px solid var(--navy-700)',
      background: image ? `center/cover no-repeat url("${image}")` : 'var(--grad-navy)',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transition: 'box-shadow var(--dur-base) var(--ease-out)',
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), !image && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255,255,255,0.06)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 120,
      textTransform: 'uppercase'
    }
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-navy)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'var(--grad-gold)',
      transform: hover ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 0.95,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color: '#fff'
    }
  }, label), title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--navy-100)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 8,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)'
    }
  }, count ? `${count} Sporcu` : 'Kadroyu Gör', /*#__PURE__*/React.createElement("span", {
    style: {
      transition: 'transform var(--dur-fast)',
      transform: hover ? 'translateX(4px)' : 'none'
    }
  }, "\u2192"))));
}
Object.assign(__ds_scope, { AgeGroupCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/club/AgeGroupCard.jsx", error: String((e && e.message) || e) }); }

// components/club/FixtureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TeamCrest({
  crest,
  name
}) {
  if (crest) return /*#__PURE__*/React.createElement("img", {
    src: crest,
    alt: name,
    style: {
      width: 52,
      height: 52,
      objectFit: 'contain'
    }
  });
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--navy-50)',
      border: '1.5px solid var(--ink-200)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--navy-700)',
      textTransform: 'uppercase'
    }
  }, initials);
}

/**
 * Buca Yıldız — FixtureCard
 * Güncel fikstür kartı. Two teams, competition, date/time or score.
 */
function FixtureCard({
  competition = 'Lig Maçı',
  date,
  venue,
  status = 'upcoming',
  home = {},
  away = {},
  style = {},
  ...rest
}) {
  const finished = status === 'finished';
  const live = status === 'live';
  const center = live ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 34,
      color: 'var(--navy-900)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, home.score ?? 0, "\u2013", away.score ?? 0) : finished ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 34,
      color: 'var(--navy-900)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, home.score ?? 0, "\u2013", away.score ?? 0) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 26,
      color: 'var(--navy-600)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, home.time || 'VS');
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '11px 16px',
      background: 'var(--navy-800)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, competition), live ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--red-600)',
      animation: 'byPulse 1.4s var(--ease-in-out) infinite'
    }
  }), "Canl\u0131") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--navy-200)',
      fontWeight: 500
    }
  }, finished ? 'Tamamlandı' : date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 12,
      padding: '22px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(TeamCrest, {
    crest: home.crest,
    name: home.name
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 16,
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      lineHeight: 1.1
    }
  }, home.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      minWidth: 70
    }
  }, center), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(TeamCrest, {
    crest: away.crest,
    name: away.name
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 16,
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      lineHeight: 1.1
    }
  }, away.name))), venue && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px',
      borderTop: '1px solid var(--border-subtle)',
      textAlign: 'center',
      fontSize: 12.5,
      color: 'var(--ink-500)',
      letterSpacing: '0.02em'
    }
  }, venue));
}
Object.assign(__ds_scope, { FixtureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/club/FixtureCard.jsx", error: String((e && e.message) || e) }); }

// components/club/NewsCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — NewsCard
 * Haber kartı. Image (or navy placeholder) + category + date + title.
 */
function NewsCard({
  image,
  category = 'Haber',
  date,
  title,
  excerpt,
  href = '#',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: {
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'all var(--dur-base) var(--ease-out)',
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16 / 10',
      overflow: 'hidden',
      background: image ? `center/cover no-repeat url("${image}")` : 'var(--grad-navy)'
    }
  }, !image && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255,255,255,0.10)',
      fontFamily: 'var(--font-heading)',
      fontSize: 60,
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "BY"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      background: 'var(--gold-500)',
      color: 'var(--navy-900)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-sm)'
    }
  }, category)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, date && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-400)',
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }, date), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 21,
      lineHeight: 1.12,
      letterSpacing: '0',
      color: 'var(--text-strong)',
      margin: 0,
      textTransform: 'none'
    }
  }, title), excerpt && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, excerpt), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      paddingTop: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--navy-600)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Haberi Oku ", /*#__PURE__*/React.createElement("span", {
    style: {
      transition: 'transform var(--dur-fast)',
      transform: hover ? 'translateX(3px)' : 'none'
    }
  }, "\u2192"))));
}
Object.assign(__ds_scope, { NewsCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/club/NewsCard.jsx", error: String((e && e.message) || e) }); }

// components/club/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — SectionHeading
 * Eyebrow kicker + uppercase condensed title, optional action link.
 * The standard header for every homepage section.
 */
function SectionHeading({
  kicker,
  title,
  action,
  onDark = false,
  align = 'left',
  style = {},
  ...rest
}) {
  const titleColor = onDark ? '#fff' : 'var(--text-strong)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-6)',
      flexWrap: 'wrap',
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      alignItems: align === 'center' ? 'center' : 'flex-start'
    }
  }, kicker && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: onDark ? 'var(--gold-400)' : 'var(--gold-700)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      lineHeight: 1.05,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color: titleColor,
      margin: 0
    }
  }, title)), action);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/club/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Avatar
 * Image or initials monogram. Navy gradient fallback.
 */
const A_SIZES = {
  xs: 26,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 72
};
function Avatar({
  name = '',
  src,
  size = 'md',
  ring = false,
  square = false,
  style = {},
  ...rest
}) {
  const dim = A_SIZES[size] || (typeof size === 'number' ? size : 40);
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: dim,
      height: dim,
      flex: 'none',
      borderRadius: square ? 'var(--radius-sm)' : '50%',
      background: src ? `center/cover no-repeat url("${src}")` : 'var(--grad-navy)',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: dim * 0.4,
      letterSpacing: '.02em',
      boxShadow: ring ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--gold-400)' : 'none',
      ...style
    }
  }, rest), !src && (initials || '?'));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Badge
 * Small status pill. "CANLI", "YENİ", "U-17", result states.
 */
const TONES = {
  navy: {
    background: 'var(--navy-700)',
    color: '#fff',
    border: 'transparent'
  },
  gold: {
    background: 'var(--gold-100)',
    color: 'var(--gold-800)',
    border: 'var(--gold-300)'
  },
  neutral: {
    background: 'var(--ink-100)',
    color: 'var(--ink-700)',
    border: 'var(--ink-200)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--navy-700)',
    border: 'var(--ink-300)'
  },
  live: {
    background: 'var(--red-600)',
    color: '#fff',
    border: 'transparent'
  },
  success: {
    background: 'var(--green-100)',
    color: 'var(--green-600)',
    border: 'transparent'
  },
  'on-navy': {
    background: 'rgba(255,255,255,0.10)',
    color: '#fff',
    border: 'rgba(255,255,255,0.22)'
  }
};
function Badge({
  children,
  tone = 'navy',
  dot = false,
  uppercase = true,
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.navy;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 11.5,
      letterSpacing: '0.08em',
      textTransform: uppercase ? 'uppercase' : 'none',
      lineHeight: 1,
      padding: '5px 9px',
      borderRadius: 'var(--radius-sm)',
      background: t.background,
      color: t.color,
      border: `1px solid ${t.border}`,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: tone === 'live' ? '#fff' : 'currentColor',
      ...(tone === 'live' ? {
        animation: 'byPulse 1.4s var(--ease-in-out) infinite'
      } : null)
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Button
 * Corporate-sporty button. Navy primary, gold accent used sparingly.
 * Square-ish corners (radius-sm) to keep the sharp brand line.
 */
const SIZES = {
  sm: {
    fontSize: 13,
    padding: '8px 14px',
    gap: 7,
    minHeight: 34
  },
  md: {
    fontSize: 14,
    padding: '11px 20px',
    gap: 8,
    minHeight: 42
  },
  lg: {
    fontSize: 16,
    padding: '15px 28px',
    gap: 10,
    minHeight: 52
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--navy-700)',
    color: '#fff',
    border: '1px solid var(--navy-700)',
    hover: {
      background: 'var(--navy-800)',
      borderColor: 'var(--navy-800)'
    }
  },
  accent: {
    background: 'var(--grad-gold)',
    color: 'var(--navy-900)',
    border: '1px solid var(--gold-600)',
    hover: {
      filter: 'brightness(1.05)'
    }
  },
  secondary: {
    background: 'transparent',
    color: 'var(--navy-700)',
    border: '1.5px solid var(--navy-700)',
    hover: {
      background: 'var(--navy-50)'
    }
  },
  ghost: {
    background: 'transparent',
    color: 'var(--navy-700)',
    border: '1px solid transparent',
    hover: {
      background: 'var(--ink-100)'
    }
  },
  'on-navy': {
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.28)',
    hover: {
      background: 'rgba(255,255,255,0.14)',
      borderColor: 'rgba(255,255,255,0.5)'
    }
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  as = 'button',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const Comp = as;
  const base = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: s.fontSize,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: s.padding,
    minHeight: s.minHeight,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    ...v,
    ...(hover && !disabled ? v.hover : null),
    ...style
  };
  delete base.hover;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    style: base,
    disabled: as === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), leftIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, leftIcon), children, rightIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, rightIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/club/TrialBanner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — TrialBanner
 * "Ücretsiz denemelere katıl" çağrı kartı. Navy gradient + gold accents.
 * The hero CTA card at the top of the homepage.
 */
function TrialBanner({
  kicker = 'Ücretsiz Deneme',
  title = 'Ücretsiz Denemelerimize Katıl',
  text = 'Yıldız adaylarını sahaya bekliyoruz. Antrenörlerimiz eşliğinde ücretsiz deneme antrenmanına kayıt ol, yeteneğini göster.',
  ctaLabel = 'Hemen Kayıt Ol',
  onCta,
  href = '#',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--grad-navy)',
      border: '1px solid var(--navy-600)',
      borderRadius: 'var(--radius-xl)',
      color: '#fff',
      boxShadow: 'var(--shadow-lg)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 4,
      background: 'var(--grad-gold)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -20,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 240,
      lineHeight: 1,
      color: 'rgba(201,162,39,0.07)',
      pointerEvents: 'none'
    }
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-8)',
      flexWrap: 'wrap',
      padding: 'clamp(24px, 4vw, 44px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 'clamp(30px, 3.6vw, 46px)',
      lineHeight: 1.0,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color: '#fff',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.6,
      color: 'var(--navy-100)',
      margin: 0
    }
  }, text)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    as: "a",
    href: href,
    variant: "accent",
    size: "lg",
    onClick: onCta
  }, ctaLabel)));
}
Object.assign(__ds_scope, { TrialBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/club/TrialBanner.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Card
 * Corporate surface container. Sharp corners, hairline border,
 * navy-tinted shadow. Optional gold top-accent rule.
 */
function Card({
  children,
  padding = 'md',
  interactive = false,
  accent = false,
  variant = 'surface',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)'
  };
  const variants = {
    surface: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-body)'
    },
    subtle: {
      background: 'var(--surface-subtle)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-body)'
    },
    navy: {
      background: 'var(--grad-navy)',
      border: '1px solid var(--navy-600)',
      color: '#fff'
    }
  };
  const v = variants[variant] || variants.surface;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      padding: pads[padding] ?? pads.md,
      boxShadow: hover && interactive ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover && interactive ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...v,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), accent && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'var(--grad-gold)'
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — IconButton
 * Square icon-only button. Used for social links, nav controls, carousels.
 */
const SIZES = {
  sm: 32,
  md: 40,
  lg: 48
};
const VARIANTS = {
  solid: {
    background: 'var(--navy-700)',
    color: '#fff',
    border: '1px solid var(--navy-700)',
    hover: {
      background: 'var(--navy-800)'
    }
  },
  outline: {
    background: 'transparent',
    color: 'var(--navy-700)',
    border: '1.5px solid var(--ink-200)',
    hover: {
      borderColor: 'var(--navy-700)',
      background: 'var(--navy-50)'
    }
  },
  ghost: {
    background: 'transparent',
    color: 'var(--navy-600)',
    border: '1px solid transparent',
    hover: {
      background: 'var(--ink-100)'
    }
  },
  'on-navy': {
    background: 'rgba(255,255,255,0.07)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.18)',
    hover: {
      background: 'rgba(255,255,255,0.16)',
      borderColor: 'var(--gold-400)'
    }
  },
  gold: {
    background: 'var(--grad-gold)',
    color: 'var(--navy-900)',
    border: '1px solid var(--gold-600)',
    hover: {
      filter: 'brightness(1.05)'
    }
  }
};
function IconButton({
  children,
  label,
  variant = 'outline',
  size = 'md',
  round = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dim = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.outline;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--dur-fast) var(--ease-out)',
    ...v,
    ...(hover && !disabled ? v.hover : null),
    ...style
  };
  delete base.hover;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: base,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — MetricBar
 * Horizontal labeled progress bar for attributes / comparisons.
 */
function MetricBar({
  label,
  value = 0,
  max = 100,
  display,
  color = 'var(--navy-700)',
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 13.5,
      color: 'var(--ink-700)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, display != null ? display : value)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--ink-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      background: color,
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { MetricBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricBar.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressRing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — ProgressRing
 * Circular progress gauge. For body composition, VO2 percentile, readiness.
 */
function ProgressRing({
  value = 0,
  max = 100,
  size = 132,
  stroke = 12,
  color = 'var(--navy-700)',
  track = 'var(--ink-100)',
  label,
  sublabel,
  display,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: track,
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeDasharray: circ,
    strokeDashoffset: offset,
    strokeLinecap: "round",
    style: {
      transition: 'stroke-dashoffset var(--dur-slow) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: size * 0.26,
      lineHeight: 1,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, display != null ? display : `${Math.round(pct * 100)}%`), sublabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-400)',
      fontWeight: 500
    }
  }, sublabel))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)'
    }
  }, label));
}
Object.assign(__ds_scope, { ProgressRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressRing.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — StatTile
 * Metric tile: label, big value, optional unit, delta/trend, icon.
 */
const TONES = {
  up: {
    color: 'var(--green-600)',
    bg: 'var(--green-100)',
    sign: '▲'
  },
  down: {
    color: 'var(--red-600)',
    bg: 'var(--red-100)',
    sign: '▼'
  },
  neutral: {
    color: 'var(--ink-500)',
    bg: 'var(--ink-100)',
    sign: '•'
  }
};
function StatTile({
  label,
  value,
  unit,
  delta,
  deltaTone = 'up',
  icon,
  sub,
  accent = false,
  style = {},
  ...rest
}) {
  const t = TONES[deltaTone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, rest), accent && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 3,
      background: 'var(--grad-gold)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-500)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--navy-400)'
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 34,
      lineHeight: 1,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--ink-400)'
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      fontWeight: 700,
      color: t.color,
      background: t.bg,
      padding: '3px 7px',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9
    }
  }, t.sign), delta), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-400)'
    }
  }, sub)));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Table
 * Lightweight data table. columns: [{key,label,width,align,render}], rows: [].
 */
function Table({
  columns = [],
  rows = [],
  onRowClick,
  getRowKey,
  empty = 'Kayıt bulunamadı.',
  dense = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(-1);
  const pad = dense ? '10px 14px' : '14px 16px';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflowX: 'auto',
      background: 'var(--surface-card)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      minWidth: 540,
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--ink-50)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: pad,
      width: c.width,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 11.5,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-500)',
      whiteSpace: 'nowrap'
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: '40px 16px',
      textAlign: 'center',
      color: 'var(--ink-400)',
      fontSize: 14
    }
  }, empty)), rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: getRowKey ? getRowKey(row, i) : i,
    onClick: onRowClick ? () => onRowClick(row, i) : undefined,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--ink-100)',
      background: hover === i && onRowClick ? 'var(--navy-50)' : 'transparent',
      cursor: onRowClick ? 'pointer' : 'default',
      transition: 'background var(--dur-fast)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: pad,
      fontSize: 14,
      color: 'var(--ink-700)',
      verticalAlign: 'middle'
    }
  }, c.render ? c.render(row, i) : row[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Checkbox
 * Square check with navy fill and gold-free, sharp aesthetic.
 */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      color: 'var(--ink-700)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${on ? 'var(--navy-700)' : 'var(--ink-300)'}`,
      background: on ? 'var(--navy-700)' : '#fff',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L5 8.5L9.5 3.5",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Input
 * Labeled text field. Sharp corners, gold focus ring.
 */
function Input({
  label,
  hint,
  error,
  leftIcon,
  id,
  required = false,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const borderColor = error ? 'var(--red-600)' : focus ? 'var(--navy-700)' : 'var(--ink-200)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-600)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: '#fff',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      padding: '0 12px',
      boxShadow: focus ? 'var(--ring-focus)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, leftIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--ink-400)'
    }
  }, leftIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-900)',
      padding: '11px 0',
      minWidth: 0,
      ...style
    }
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--red-600)',
      fontWeight: 500
    }
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-400)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Select
 * Native select with brand styling and a custom chevron.
 */
function Select({
  label,
  hint,
  options = [],
  placeholder,
  id,
  required = false,
  containerStyle = {},
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-600)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      appearance: 'none',
      WebkitAppearance: 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-900)',
      background: '#fff',
      border: `1.5px solid ${focus ? 'var(--navy-700)' : 'var(--ink-200)'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '12px 38px 12px 12px',
      boxShadow: focus ? 'var(--ring-focus)' : 'none',
      cursor: 'pointer',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--navy-600)',
      fontSize: 12
    }
  }, "\u25BE")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-400)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Switch
 * On/off toggle. Navy when on. For publish state, featured, settings.
 */
function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  size = 'md',
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const W = size === 'sm' ? 36 : 44,
    H = size === 'sm' ? 20 : 24,
    K = H - 6;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };
  const control = /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    role: "switch",
    "aria-checked": on,
    style: {
      width: W,
      height: H,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--navy-700)' : 'var(--ink-300)',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? W - K - 3 : 3,
      width: K,
      height: K,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-fast) var(--ease-out)'
    }
  }));
  if (!label) return control;
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--ink-700)',
      ...style
    }
  }, rest), control, label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Buca Yıldız — Tabs
 * Underline tab bar. Gold active indicator.
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  style = {},
  ...rest
}) {
  const isControlled = value !== undefined;
  const first = defaultValue ?? (tabs[0] && (tabs[0].id ?? tabs[0]));
  const [internal, setInternal] = React.useState(first);
  const active = isControlled ? value : internal;
  const pick = id => {
    if (!isControlled) setInternal(id);
    onChange && onChange(id);
  };
  const pill = variant === 'pill';
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: pill ? 4 : 2,
      borderBottom: pill ? 'none' : '1px solid var(--border-subtle)',
      background: pill ? 'var(--ink-100)' : 'transparent',
      padding: pill ? 3 : 0,
      borderRadius: pill ? 'var(--radius-md)' : 0,
      ...style
    }
  }, rest), tabs.map(t => {
    const id = t.id ?? t;
    const label = t.label ?? t;
    const on = id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      "aria-selected": on,
      onClick: () => pick(id),
      style: {
        font: 'inherit',
        cursor: 'pointer',
        border: 'none',
        background: pill && on ? 'var(--surface-card)' : 'transparent',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '.01em',
        color: on ? pill ? 'var(--navy-800)' : 'var(--navy-700)' : 'var(--ink-500)',
        padding: pill ? '8px 16px' : '11px 16px',
        borderRadius: pill ? 'var(--radius-sm)' : 0,
        boxShadow: pill && on ? 'var(--shadow-xs)' : 'none',
        borderBottom: pill ? 'none' : `2px solid ${on ? 'var(--gold-500)' : 'transparent'}`,
        marginBottom: pill ? 0 : -1,
        transition: 'color var(--dur-fast), border-color var(--dur-fast)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7
      }
    }, t.icon, label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-stat)',
        fontSize: 11.5,
        fontWeight: 700,
        color: on ? 'var(--navy-700)' : 'var(--ink-400)',
        background: on ? 'var(--navy-50)' : 'var(--ink-100)',
        borderRadius: 'var(--radius-pill)',
        padding: '1px 7px'
      }
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminData.jsx
try { (() => {
// Buca Yıldız Admin — shared sample data → window.AdminData
(function () {
  const TEAMS = [{
    id: 'a',
    name: 'A Takım',
    short: 'A',
    coach: 'Serkan Aydın',
    count: 26,
    born: 'Üst yapı',
    color: 'var(--navy-700)'
  }, {
    id: 'u18',
    name: 'U-18',
    short: 'U18',
    coach: 'Tolga Demir',
    count: 23,
    born: '2008',
    color: 'var(--navy-600)'
  }, {
    id: 'u17',
    name: 'U-17',
    short: 'U17',
    coach: 'Emre Kaya',
    count: 24,
    born: '2009',
    color: 'var(--gold-600)'
  }, {
    id: 'u16',
    name: 'U-16',
    short: 'U16',
    coach: 'Barış Şahin',
    count: 25,
    born: '2010',
    color: 'var(--navy-500)'
  }, {
    id: 'u15',
    name: 'U-15',
    short: 'U15',
    coach: 'Onur Çelik',
    count: 28,
    born: '2011',
    color: 'var(--green-600)'
  }];
  const POS = ['Kaleci', 'Stoper', 'Bek', 'Ön Libero', 'Orta Saha', 'Ofansif O.S.', 'Kanat', 'Forvet'];
  const FIRST = ['Arda', 'Mehmet', 'Kaan', 'Yusuf', 'Emir', 'Berke', 'Doruk', 'Çınar', 'Ali', 'Efe', 'Kerem', 'Mert', 'Deniz', 'Tunahan', 'Bora', 'Ege', 'Poyraz', 'Aras', 'Toprak', 'Demir'];
  const LAST = ['Yılmaz', 'Demir', 'Şahin', 'Kaya', 'Çelik', 'Aydın', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Öztürk', 'Korkmaz', 'Polat', 'Yıldız', 'Erdoğan'];
  function rand(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  const ATHLETES = Array.from({
    length: 36
  }, (_, i) => {
    const team = TEAMS[Math.floor(rand(i + 1) * TEAMS.length)];
    const baseBoy = team.id === 'a' ? 180 : team.id === 'u18' ? 178 : team.id === 'u17' ? 176 : team.id === 'u16' ? 172 : 168;
    return {
      id: 'a' + (100 + i),
      name: FIRST[Math.floor(rand(i + 2) * FIRST.length)] + ' ' + LAST[Math.floor(rand(i + 3) * LAST.length)],
      team: team.id,
      teamName: team.name,
      pos: POS[Math.floor(rand(i + 4) * POS.length)],
      no: 1 + Math.floor(rand(i + 5) * 35),
      boy: baseBoy + Math.floor(rand(i + 6) * 12) - 4,
      kilo: Math.round(baseBoy - 110 + rand(i + 7) * 10),
      foot: rand(i + 8) > 0.25 ? 'Sağ' : 'Sol',
      status: rand(i + 9) > 0.16 ? 'active' : rand(i + 10) > 0.5 ? 'injured' : 'rest',
      vo2: (50 + rand(i + 11) * 9).toFixed(1),
      attend: 78 + Math.floor(rand(i + 12) * 22)
    };
  });
  const OPP = ['Karşıyaka SK', 'Altay', 'Göztepe', 'Bucaspor', 'Menemen FK', 'Bornova 1877', 'Aliağa FK', 'Ödemişspor'];
  const COMPS = ['U-17 Gelişim Ligi', 'U-15 Bölgesel', 'U-18 Gelişim Ligi', 'Hazırlık Maçı', 'A Takım Bölgesel'];
  const FIXTURES = [{
    id: 'f1',
    comp: 'U-17 Gelişim Ligi',
    home: 'Buca Yıldız',
    away: 'Karşıyaka SK',
    date: '2026-06-14',
    time: '19:00',
    venue: 'Buca Yıldız Tesisleri',
    status: 'upcoming',
    hs: null,
    as: null
  }, {
    id: 'f2',
    comp: 'U-15 Bölgesel',
    home: 'Buca Yıldız',
    away: 'Altay',
    date: '2026-06-08',
    time: '11:00',
    venue: 'İskenderun Stadı',
    status: 'finished',
    hs: 3,
    as: 1
  }, {
    id: 'f3',
    comp: 'U-18 Gelişim Ligi',
    home: 'Göztepe',
    away: 'Buca Yıldız',
    date: '2026-06-21',
    time: '17:30',
    venue: 'Bornova Saha 2',
    status: 'upcoming',
    hs: null,
    as: null
  }, {
    id: 'f4',
    comp: 'A Takım Bölgesel',
    home: 'Buca Yıldız',
    away: 'Menemen FK',
    date: '2026-06-07',
    time: '20:00',
    venue: 'Buca Yıldız Tesisleri',
    status: 'finished',
    hs: 2,
    as: 2
  }, {
    id: 'f5',
    comp: 'Hazırlık Maçı',
    home: 'Buca Yıldız',
    away: 'Bucaspor',
    date: '2026-06-28',
    time: '18:00',
    venue: 'Buca Yıldız Tesisleri',
    status: 'upcoming',
    hs: null,
    as: null
  }];
  const CATEGORIES = [{
    id: 'antrenman',
    name: 'Antrenman',
    color: 'var(--navy-600)',
    count: 48
  }, {
    id: 'mac',
    name: 'Maç Günü',
    color: 'var(--red-600)',
    count: 126
  }, {
    id: 'odul',
    name: 'Ödül Töreni',
    color: 'var(--gold-600)',
    count: 22
  }, {
    id: 'tesis',
    name: 'Tesisler',
    color: 'var(--green-600)',
    count: 17
  }, {
    id: 'roportaj',
    name: 'Röportaj',
    color: 'var(--navy-400)',
    count: 9
  }];
  const FOLDERS = [{
    id: 'root',
    name: 'Tüm Medya',
    parent: null,
    count: 222
  }, {
    id: '2026',
    name: '2026 Sezonu',
    parent: 'root',
    count: 140
  }, {
    id: 'u17-kamp',
    name: 'U-17 Kamp',
    parent: '2026',
    count: 36
  }, {
    id: 'final',
    name: 'Final Maçı',
    parent: '2026',
    count: 54
  }, {
    id: 'odul-2026',
    name: 'Ödül Gecesi',
    parent: '2026',
    count: 22
  }, {
    id: 'arsiv',
    name: 'Arşiv',
    parent: 'root',
    count: 82
  }];

  // homepage "görseller & videolar" cards
  const MEDIA_CARDS = [{
    id: 'c1',
    title: 'Antrenman',
    category: 'antrenman',
    count: 48,
    kind: 'photo'
  }, {
    id: 'c2',
    title: 'Maç Günü',
    category: 'mac',
    count: 126,
    kind: 'photo'
  }, {
    id: 'c3',
    title: 'Ödül Töreni',
    category: 'odul',
    count: 22,
    kind: 'photo'
  }, {
    id: 'c4',
    title: 'Tesisler',
    category: 'tesis',
    count: 17,
    kind: 'photo'
  }, {
    id: 'feat',
    title: 'Sezon 2025/26 — Akademi Özeti',
    category: 'mac',
    count: 1,
    kind: 'video',
    featured: true,
    duration: '4:12'
  }];
  const JERSEYS = [{
    id: 'home',
    name: 'İç Saha',
    primary: '#15295A',
    accent: '#DDBA4E',
    desc: 'Lacivert gövde, altın detaylar',
    active: true
  }, {
    id: 'away',
    name: 'Deplasman',
    primary: '#FFFFFF',
    accent: '#15295A',
    desc: 'Beyaz gövde, lacivert detaylar',
    active: true
  }, {
    id: 'third',
    name: 'Üçüncü Forma',
    primary: '#C9A227',
    accent: '#0E2148',
    desc: 'Altın gövde, lacivert detaylar',
    active: true
  }, {
    id: 'gk',
    name: 'Kaleci',
    primary: '#1E7D4F',
    accent: '#F8EFD2',
    desc: 'Yeşil gövde, krem detaylar',
    active: true
  }];
  const POSTS = [{
    id: 'p1',
    title: 'A Takımımız sezonu kupayla taçlandırdı',
    template: 'Maç Raporu',
    category: 'mac',
    status: 'published',
    date: '2026-06-11',
    author: 'Basın'
  }, {
    id: 'p2',
    title: 'U-17 takımımız grubunu lider tamamladı',
    template: 'Son Dakika',
    category: 'mac',
    status: 'published',
    date: '2026-06-10',
    author: 'Basın'
  }, {
    id: 'p3',
    title: 'Yeni antrenman sahamız hizmete girdi',
    template: 'Standart Haber',
    category: 'tesis',
    status: 'published',
    date: '2026-06-06',
    author: 'Kulüp'
  }, {
    id: 'p4',
    title: 'Yaz okulu kayıtları başladı',
    template: 'Duyuru',
    category: 'antrenman',
    status: 'draft',
    date: '2026-06-02',
    author: 'Kulüp'
  }, {
    id: 'p5',
    title: 'Ödül gecemizden kareler',
    template: 'Galeri / Ödül Töreni',
    category: 'odul',
    status: 'scheduled',
    date: '2026-06-18',
    author: 'Basın'
  }];
  const TEMPLATES = [{
    id: 'sondakika',
    name: 'Son Dakika',
    icon: 'zap',
    desc: 'Tek manşet, büyük kapak görseli ve kısa metin. Hızlı duyurular için.',
    tag: 'Haber',
    blocks: ['Kapak görseli', 'Manşet', 'Özet', 'Metin']
  }, {
    id: 'macraporu',
    name: 'Maç Raporu',
    icon: 'trophy',
    desc: 'Skor başlığı, kadro, maç anlatımı ve foto galeri.',
    tag: 'Spor',
    blocks: ['Skor başlığı', 'Kapak', 'Maç anlatımı', 'Galeri']
  }, {
    id: 'galeri',
    name: 'Galeri / Ödül Töreni',
    icon: 'images',
    desc: 'Görsel ağırlıklı; kapak + foto ızgarası + kısa açıklamalar.',
    tag: 'Galeri',
    blocks: ['Kapak', 'Foto ızgarası', 'Açıklama']
  }, {
    id: 'standart',
    name: 'Standart Haber',
    icon: 'newspaper',
    desc: 'Klasik; görsel + paragraflar + ara başlıklar. Çok amaçlı.',
    tag: 'Genel',
    blocks: ['Kapak', 'Giriş', 'Ara başlık + metin', 'Görsel']
  }, {
    id: 'roportaj',
    name: 'Röportaj',
    icon: 'mic',
    desc: 'Soru–cevap blokları, alıntılar ve portre görseli.',
    tag: 'Söyleşi',
    blocks: ['Portre', 'Giriş', 'Soru–Cevap', 'Alıntı']
  }, {
    id: 'duyuru',
    name: 'Duyuru',
    icon: 'megaphone',
    desc: 'Sade, metin odaklı; logo + başlık + bilgilendirme.',
    tag: 'Resmî',
    blocks: ['Başlık', 'Bilgilendirme', 'İletişim']
  }];
  window.AdminData = {
    TEAMS,
    ATHLETES,
    POS,
    FIXTURES,
    OPP,
    COMPS,
    CATEGORIES,
    FOLDERS,
    MEDIA_CARDS,
    JERSEYS,
    POSTS,
    TEMPLATES
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminData.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminShell.jsx
try { (() => {
// Buca Yıldız Admin — shell: grouped navy sidebar + topbar
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    IconButton,
    Badge
  } = NS;
  const ic = (n, sz = 18) => React.createElement('i', {
    'data-lucide': n,
    style: {
      width: sz,
      height: sz
    }
  });
  const SLOGO = '../../assets/logo-emblem.png';
  const NAV = [{
    group: 'Genel',
    items: [{
      id: 'dashboard',
      label: 'Genel Bakış',
      icon: 'layout-dashboard'
    }]
  }, {
    group: 'Kulüp',
    items: [{
      id: 'athletes',
      label: 'Sporcular',
      icon: 'users'
    }, {
      id: 'teams',
      label: 'Takımlar',
      icon: 'shield'
    }, {
      id: 'training',
      label: 'Antrenmanlar',
      icon: 'dumbbell'
    }, {
      id: 'fixtures',
      label: 'Fikstür',
      icon: 'calendar-days'
    }]
  }, {
    group: 'İçerik & Site',
    items: [{
      id: 'blog',
      label: 'Haberler / Blog',
      icon: 'newspaper'
    }, {
      id: 'media',
      label: 'Medya Kütüphanesi',
      icon: 'images'
    }, {
      id: 'jerseys',
      label: 'Formalar',
      icon: 'shirt'
    }]
  }];
  function Sidebar({
    active,
    onNav,
    collapsed
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: collapsed ? 76 : 256,
        flex: 'none',
        background: 'var(--navy-950)',
        borderRight: '1px solid rgba(255,255,255,.07)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: collapsed ? '20px 0' : '20px 22px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 12,
        borderBottom: '1px solid rgba(255,255,255,.07)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: SLOGO,
      alt: "",
      style: {
        width: 38,
        height: 38,
        objectFit: 'contain'
      }
    }), !collapsed && /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 16,
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '.02em'
      }
    }, "Buca Y\u0131ld\u0131z"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9.5,
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        color: 'var(--gold-400)',
        marginTop: 3,
        fontWeight: 600
      }
    }, "Y\xF6netim Paneli"))), /*#__PURE__*/React.createElement("nav", {
      style: {
        padding: collapsed ? '10px 10px' : 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        flex: 1,
        overflowY: 'auto'
      }
    }, NAV.map(sec => /*#__PURE__*/React.createElement("div", {
      key: sec.group,
      style: {
        marginBottom: 6
      }
    }, !collapsed && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'var(--navy-400)',
        padding: '10px 14px 6px'
      }
    }, sec.group), sec.items.map(n => {
      const on = active === n.id;
      return /*#__PURE__*/React.createElement("a", {
        key: n.id,
        href: "#",
        onClick: e => {
          e.preventDefault();
          onNav(n.id);
        },
        title: n.label,
        style: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '12px 0' : '11px 14px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 'var(--radius-sm)',
          textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          fontWeight: on ? 600 : 500,
          fontSize: 14.5,
          color: on ? '#fff' : 'var(--navy-200)',
          background: on ? 'rgba(255,255,255,.07)' : 'transparent'
        },
        onMouseEnter: e => {
          if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.04)';
        },
        onMouseLeave: e => {
          if (!on) e.currentTarget.style.background = 'transparent';
        }
      }, on && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 0,
          top: 8,
          bottom: 8,
          width: 3,
          background: 'var(--grad-gold)',
          borderRadius: '0 2px 2px 0'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          color: on ? 'var(--gold-400)' : 'var(--navy-300)',
          display: 'inline-flex'
        }
      }, ic(n.icon, 18)), !collapsed && n.label);
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        borderTop: '1px solid rgba(255,255,255,.07)'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "../website/index.html",
      title: "Siteyi g\xF6r\xFCnt\xFCle",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 12,
        padding: '11px 14px',
        borderRadius: 'var(--radius-sm)',
        textDecoration: 'none',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: 14,
        color: 'var(--navy-200)'
      }
    }, ic('external-link', 18), !collapsed && 'Siteyi Görüntüle')));
  }
  function Topbar({
    onToggle,
    breadcrumb
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(255,255,255,.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "Men\xFC",
      variant: "ghost",
      onClick: onToggle
    }, ic('panel-left', 18)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13.5,
        color: 'var(--ink-500)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: 'var(--ink-700)'
      }
    }, "Y\xF6netim"), ic('chevron-right', 14), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--navy-700)',
        fontWeight: 600
      }
    }, breadcrumb))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "Bildirimler",
      variant: "outline"
    }, ic('bell', 18)), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: 'var(--red-600)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        display: 'grid',
        placeItems: 'center',
        border: '2px solid #fff'
      }
    }, "3")), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 1,
        height: 30,
        background: 'var(--ink-200)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: 'var(--grad-gold)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--navy-900)',
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 15
      }
    }, "MK"), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13.5,
        color: 'var(--text-strong)'
      }
    }, "M. Ko\xE7"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--ink-400)'
      }
    }, "Y\xF6netici"))))));
  }
  function AdminShell({
    active,
    onNav,
    breadcrumb,
    children
  }) {
    const [collapsed, setCollapsed] = React.useState(false);
    React.useEffect(() => {
      const mq = window.matchMedia('(max-width: 900px)');
      const on = () => setCollapsed(mq.matches);
      on();
      mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--surface-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active,
      onNav: onNav,
      collapsed: collapsed
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(Topbar, {
      onToggle: () => setCollapsed(c => !c),
      breadcrumb: breadcrumb
    }), /*#__PURE__*/React.createElement("main", {
      style: {
        padding: '28px 28px 56px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        width: '100%',
        maxWidth: 1380,
        margin: '0 auto'
      }
    }, children)));
  }
  window.AdminShell = AdminShell;
  window.ADMIN_NAV = NAV;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminUI.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Buca Yıldız Admin — shared UI building blocks → window.AdminUI
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Button,
    IconButton
  } = NS;
  const ic = (n, sz = 18) => React.createElement('i', {
    'data-lucide': n,
    style: {
      width: sz,
      height: sz
    }
  });
  const cardStyle = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)'
  };

  // ---- View header (title + actions) ----
  function ViewHeader({
    title,
    subtitle,
    actions,
    tabs
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 30,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: 0,
        lineHeight: 1
      }
    }, title), subtitle && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--ink-500)',
        margin: '8px 0 0'
      }
    }, subtitle)), actions && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, actions)), tabs);
  }

  // ---- Toolbar (search + filters row) ----
  function Toolbar({
    children,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        ...style
      }
    }, children);
  }
  function SearchBox({
    placeholder = 'Ara…',
    value,
    onChange,
    width = 260
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '0 12px',
        height: 40,
        width
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-400)',
        display: 'inline-flex'
      }
    }, ic('search', 16)), /*#__PURE__*/React.createElement("input", {
      value: value,
      onChange: e => onChange && onChange(e.target.value),
      placeholder: placeholder,
      style: {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--ink-800)',
        minWidth: 0
      }
    }));
  }

  // ---- Field wrapper (label over control) ----
  function Field({
    label,
    required,
    hint,
    children,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style
      }
    }, label && /*#__PURE__*/React.createElement("label", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12.5,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        color: 'var(--ink-600)'
      }
    }, label, required && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--gold-600)'
      }
    }, " *")), children, hint && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-400)'
      }
    }, hint));
  }

  // ---- Plain styled text input (uncontrolled-friendly) ----
  function TextInput({
    style,
    ...rest
  }) {
    const [f, setF] = React.useState(false);
    return /*#__PURE__*/React.createElement("input", _extends({}, rest, {
      onFocus: e => {
        setF(true);
        rest.onFocus && rest.onFocus(e);
      },
      onBlur: e => {
        setF(false);
        rest.onBlur && rest.onBlur(e);
      },
      style: {
        width: '100%',
        fontFamily: 'var(--font-body)',
        fontSize: 14.5,
        color: 'var(--ink-900)',
        background: '#fff',
        border: `1.5px solid ${f ? 'var(--navy-700)' : 'var(--ink-200)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '11px 12px',
        outline: 'none',
        boxShadow: f ? 'var(--ring-focus)' : 'none',
        transition: 'all var(--dur-fast)',
        ...style
      }
    }));
  }
  function TextArea({
    style,
    rows = 4,
    ...rest
  }) {
    const [f, setF] = React.useState(false);
    return /*#__PURE__*/React.createElement("textarea", _extends({
      rows: rows
    }, rest, {
      onFocus: () => setF(true),
      onBlur: () => setF(false),
      style: {
        width: '100%',
        fontFamily: 'var(--font-body)',
        fontSize: 14.5,
        lineHeight: 1.6,
        color: 'var(--ink-900)',
        background: '#fff',
        border: `1.5px solid ${f ? 'var(--navy-700)' : 'var(--ink-200)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '11px 12px',
        outline: 'none',
        resize: 'vertical',
        boxShadow: f ? 'var(--ring-focus)' : 'none',
        transition: 'all var(--dur-fast)',
        ...style
      }
    }));
  }

  // ---- File / image drop placeholder ----
  function FileDrop({
    label = 'Görsel yükle',
    hint,
    aspect = '16 / 10',
    filled = false,
    icon = 'image-up',
    compact = false,
    style
  }) {
    const [over, setOver] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      onDragOver: e => {
        e.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: e => {
        e.preventDefault();
        setOver(false);
      },
      style: {
        position: 'relative',
        aspectRatio: aspect,
        borderRadius: 'var(--radius-md)',
        border: `1.5px dashed ${over ? 'var(--navy-700)' : 'var(--ink-300)'}`,
        background: filled ? 'var(--grad-navy)' : over ? 'var(--navy-50)' : 'var(--ink-50)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all var(--dur-fast)',
        ...style
      }
    }, filled ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(255,255,255,.18)'
      }
    }, ic('image', compact ? 24 : 38)), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: 8,
        top: 8,
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(255,255,255,.14)',
        display: 'grid',
        placeItems: 'center',
        color: '#fff'
      }
    }, ic('pencil', 14)))) : /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? 4 : 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: compact ? 34 : 44,
        height: compact ? 34 : 44,
        borderRadius: '50%',
        background: 'var(--navy-50)',
        color: 'var(--navy-600)',
        display: 'grid',
        placeItems: 'center'
      }
    }, ic(icon, compact ? 17 : 20)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: compact ? 12.5 : 14,
        color: 'var(--ink-700)'
      }
    }, label), hint && !compact && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--ink-400)'
      }
    }, hint)));
  }

  // ---- Stepper ----
  function Stepper({
    steps,
    current
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 0
      }
    }, steps.map((s, i) => {
      const done = i < current,
        active = i === current;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 30,
          height: 30,
          borderRadius: '50%',
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-stat)',
          fontWeight: 700,
          fontSize: 14,
          background: active ? 'var(--navy-700)' : done ? 'var(--green-600)' : 'var(--ink-100)',
          color: active || done ? '#fff' : 'var(--ink-400)',
          border: active ? '2px solid var(--gold-400)' : 'none'
        }
      }, done ? ic('check', 15) : i + 1), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-body)',
          fontWeight: active ? 600 : 500,
          fontSize: 13.5,
          color: active ? 'var(--text-strong)' : 'var(--ink-500)',
          whiteSpace: 'nowrap'
        }
      }, s)), i < steps.length - 1 && /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          height: 2,
          background: done ? 'var(--green-600)' : 'var(--ink-200)',
          margin: '0 14px',
          minWidth: 24
        }
      }));
    }));
  }

  // ---- Drawer (right side panel) ----
  // Conditional-mount, STATIC open state (no enter transition/animation) so the
  // panel is unconditionally on-screen in every environment.
  function Drawer({
    open,
    onClose,
    title,
    subtitle,
    children,
    footer,
    width = 480
  }) {
    if (!open) return null;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,18,38,.45)',
        zIndex: 200
      }
    }), /*#__PURE__*/React.createElement("aside", {
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(' + width + 'px, 94vw)',
        background: 'var(--surface-page)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 22,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: 0,
        lineHeight: 1.05
      }
    }, title), subtitle && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: 'var(--ink-500)',
        margin: '6px 0 0'
      }
    }, subtitle)), /*#__PURE__*/React.createElement(IconButton, {
      label: "Kapat",
      variant: "ghost",
      onClick: onClose
    }, ic('x', 18))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 24
      }
    }, children), footer && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: 10,
        justifyContent: 'flex-end',
        background: 'var(--surface-subtle)'
      }
    }, footer)));
  }

  // ---- Modal (centered) ----
  function Modal({
    open,
    onClose,
    title,
    children,
    footer,
    width = 460
  }) {
    if (!open) return null;
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,18,38,.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 210,
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        width: 'min(' + width + 'px, 96vw)',
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 20,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, title), /*#__PURE__*/React.createElement(IconButton, {
      label: "Kapat",
      variant: "ghost",
      onClick: onClose
    }, ic('x', 18))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24
      }
    }, children), footer && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: 10,
        justifyContent: 'flex-end',
        background: 'var(--surface-subtle)'
      }
    }, footer)));
  }

  // ---- Section block (titled card) ----
  function Panel({
    title,
    action,
    children,
    pad = 22,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...cardStyle,
        ...style
      }
    }, (title || action) && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 17,
        color: 'var(--text-strong)',
        margin: 0
      }
    }, title), action), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: pad
      }
    }, children));
  }
  window.AdminUI = {
    ic,
    cardStyle,
    ViewHeader,
    Toolbar,
    SearchBox,
    Field,
    TextInput,
    TextArea,
    FileDrop,
    Stepper,
    Drawer,
    Modal,
    Panel
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminUI.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AthletesView.jsx
try { (() => {
// Buca Yıldız Admin — Sporcular (list + create/edit)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Table,
    Badge,
    Avatar,
    Button,
    Select,
    Switch,
    Tabs
  } = NS;
  const {
    ViewHeader,
    Panel,
    Drawer,
    Field,
    TextInput,
    FileDrop,
    SearchBox,
    Toolbar,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const aStatus = {
    active: {
      tone: 'success',
      label: 'Aktif'
    },
    injured: {
      tone: 'live',
      label: 'Sakat'
    },
    rest: {
      tone: 'neutral',
      label: 'İzinli'
    }
  };

  // Turkish-safe slug → default panel username, e.g. "Arda Yılmaz" → "arda.yilmaz"
  const trSlug = s => (s || '').toLocaleLowerCase('tr').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, '.');
  const genPassword = () => {
    const cs = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let p = '';
    for (let i = 0; i < 9; i++) p += cs[Math.floor(Math.random() * cs.length)];
    return p;
  };

  // Panel login credentials — athlete signs in with username, e-posta OR telefon
  function CredFields({
    athlete
  }) {
    const [pw, setPw] = React.useState('');
    const [show, setShow] = React.useState(true);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--gold-700)'
      }
    }, "Panel Giri\u015F Bilgileri"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-400)',
        margin: '6px 0 0'
      }
    }, "Sporcu panele ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--ink-600)'
      }
    }, "kullan\u0131c\u0131 ad\u0131, e-posta veya telefon"), " ile giri\u015F yapabilir.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Kullan\u0131c\u0131 Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: athlete ? trSlug(athlete.name) : '',
      placeholder: "arda.yilmaz"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Telefon (giri\u015F i\xE7in)"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "tel",
      placeholder: "05xx xxx xx xx"
    }))), /*#__PURE__*/React.createElement(Field, {
      label: "E-posta (giri\u015F i\xE7in)"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "email",
      placeholder: "sporcu@eposta.com"
    })), /*#__PURE__*/React.createElement(Field, {
      label: athlete ? 'Şifre Sıfırla' : 'Geçici Şifre',
      required: !athlete,
      hint: "Sporcu ilk giri\u015Fte de\u011Fi\u015Ftirebilir."
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: show ? 'text' : 'password',
      value: pw,
      onChange: e => setPw(e.target.value),
      placeholder: "\u015Eifre olu\u015Ftur veya gir",
      style: {
        flex: 1,
        fontFamily: pw ? 'var(--font-stat)' : 'inherit',
        letterSpacing: pw && show ? '.04em' : 0
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      type: "button",
      onClick: () => setShow(s => !s),
      title: show ? 'Gizle' : 'Göster'
    }, ic(show ? 'eye-off' : 'eye', 15)), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      type: "button",
      leftIcon: ic('refresh-cw', 15),
      onClick: () => {
        setPw(genPassword());
        setShow(true);
      }
    }, "Olu\u015Ftur"))));
  }
  function AthleteForm({
    athlete
  }) {
    const isNew = !athlete;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(FileDrop, {
      label: "Foto\u011Fraf",
      compact: true,
      icon: "user-round",
      aspect: "1 / 1",
      style: {
        width: 96,
        height: 96,
        flex: 'none'
      },
      filled: !isNew
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Ad Soyad",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: athlete ? athlete.name : '',
      placeholder: "Sporcunun ad\u0131 soyad\u0131"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--gold-700)'
      }
    }, "Tak\u0131m & Mevki"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Tak\u0131m",
      required: true
    }, /*#__PURE__*/React.createElement(Select, {
      placeholder: "Tak\u0131m se\xE7",
      options: D.TEAMS.map(t => ({
        value: t.id,
        label: t.name
      })),
      defaultValue: athlete ? athlete.team : ''
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Mevki",
      required: true
    }, /*#__PURE__*/React.createElement(Select, {
      placeholder: "Mevki se\xE7",
      options: D.POS,
      defaultValue: athlete ? athlete.pos : ''
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Forma No"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      defaultValue: athlete ? athlete.no : '',
      placeholder: "10"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Ayak"
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Sağ', 'Sol', 'Çift'],
      defaultValue: athlete ? athlete.foot : 'Sağ'
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--gold-700)'
      }
    }, "Fiziksel Veriler"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Boy",
      hint: "cm"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      defaultValue: athlete ? athlete.boy : '',
      placeholder: "178"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Kilo",
      hint: "kg"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      defaultValue: athlete ? athlete.kilo : '',
      placeholder: "68"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Do\u011Fum Y\u0131l\u0131"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      placeholder: "2009"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Lisans No"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "34721"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Veli Telefon"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "05xx xxx xx xx"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement(CredFields, {
      athlete: athlete
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14,
        color: 'var(--text-strong)'
      }
    }, "Aktif sporcu"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-400)'
      }
    }, "Pasif sporcular kadro listelerinde g\xF6r\xFCnmez.")), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: !athlete || athlete.status === 'active'
    })));
  }
  function AthletesView() {
    const [team, setTeam] = React.useState('all');
    const [q, setQ] = React.useState('');
    const [drawer, setDrawer] = React.useState(null); // {athlete} | {athlete:null} for new

    const rows = D.ATHLETES.filter(a => (team === 'all' || a.team === team) && a.name.toLowerCase().includes(q.toLowerCase()));
    const tabs = [{
      id: 'all',
      label: 'Tümü',
      count: D.ATHLETES.length
    }, ...D.TEAMS.map(t => ({
      id: t.id,
      label: t.name,
      count: D.ATHLETES.filter(a => a.team === t.id).length
    }))];
    const cols = [{
      key: 'name',
      label: 'Sporcu',
      render: r => /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: r.name,
        size: "sm"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          lineHeight: 1.3
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          color: 'var(--text-strong)',
          whiteSpace: 'nowrap'
        }
      }, r.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--ink-400)',
          whiteSpace: 'nowrap'
        }
      }, "#", r.no, " \xB7 ", r.pos)))
    }, {
      key: 'teamName',
      label: 'Takım',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: "navy"
      }, r.teamName)
    }, {
      key: 'boy',
      label: 'Boy',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-stat)'
        }
      }, r.boy, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--ink-400)',
          fontSize: 12
        }
      }, " cm"))
    }, {
      key: 'kilo',
      label: 'Kilo',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-stat)'
        }
      }, r.kilo, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--ink-400)',
          fontSize: 12
        }
      }, " kg"))
    }, {
      key: 'foot',
      label: 'Ayak',
      align: 'center'
    }, {
      key: 'status',
      label: 'Durum',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: aStatus[r.status].tone,
        dot: r.status === 'injured'
      }, aStatus[r.status].label)
    }, {
      key: 'go',
      label: '',
      width: 44,
      align: 'right',
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--ink-300)',
          display: 'inline-flex'
        }
      }, ic('chevron-right', 16))
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Sporcular",
      subtitle: `${D.ATHLETES.length} kayıtlı sporcu`,
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        size: "sm",
        leftIcon: ic('plus', 16),
        onClick: () => setDrawer({
          athlete: null
        })
      }, "Sporcu Ekle"),
      tabs: /*#__PURE__*/React.createElement(Tabs, {
        tabs: tabs,
        value: team,
        onChange: setTeam
      })
    }), /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(SearchBox, {
      placeholder: "\u0130simle ara\u2026",
      value: q,
      onChange: setQ
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['Tüm mevkiler', ...D.POS],
      containerStyle: {
        minWidth: 160
      }
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['Tüm durumlar', 'Aktif', 'Sakat', 'İzinli'],
      containerStyle: {
        minWidth: 150
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 13,
        color: 'var(--ink-400)'
      }
    }, rows.length, " sonu\xE7")), /*#__PURE__*/React.createElement(Table, {
      columns: cols,
      rows: rows,
      getRowKey: r => r.id,
      onRowClick: r => setDrawer({
        athlete: r
      }),
      empty: "Bu filtreye uygun sporcu yok."
    }), /*#__PURE__*/React.createElement(Drawer, {
      open: !!drawer,
      onClose: () => setDrawer(null),
      title: drawer && drawer.athlete ? drawer.athlete.name : 'Yeni Sporcu',
      subtitle: drawer && drawer.athlete ? 'Sporcu bilgilerini düzenle' : 'Yeni sporcu kaydı oluştur',
      width: 520,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, drawer && drawer.athlete && /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        style: {
          color: 'var(--red-600)',
          marginRight: 'auto'
        },
        leftIcon: ic('trash-2', 15)
      }, "Sil"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setDrawer(null)
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: () => setDrawer(null)
      }, drawer && drawer.athlete ? 'Kaydet' : 'Sporcu Oluştur'))
    }, drawer && /*#__PURE__*/React.createElement(AthleteForm, {
      athlete: drawer.athlete
    })));
  }
  window.AthletesView = AthletesView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AthletesView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/BlogView.jsx
try { (() => {
// Buca Yıldız Admin — Haberler / Blog (list + step-by-step template wizard)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Table,
    Badge,
    Button,
    Select,
    Tabs,
    Switch,
    IconButton
  } = NS;
  const {
    ViewHeader,
    Panel,
    Stepper,
    Field,
    TextInput,
    TextArea,
    FileDrop,
    SearchBox,
    Toolbar,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const postStatus = {
    published: {
      tone: 'success',
      label: 'Yayında'
    },
    draft: {
      tone: 'neutral',
      label: 'Taslak'
    },
    scheduled: {
      tone: 'gold',
      label: 'Planlı'
    }
  };
  const fmt = d => {
    const [y, m, day] = d.split('-');
    return `${day}.${m}.${y}`;
  };

  // ---------- Wizard ----------
  // STEP 1 — template picker
  function TemplatePicker({
    value,
    onPick
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 22,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: '0 0 6px'
      }
    }, "Bir \u015Fablon se\xE7"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--ink-500)',
        margin: '0 0 22px'
      }
    }, "Yaz\u0131n\u0131n t\xFCr\xFCne uygun haz\u0131r bir d\xFCzen se\xE7 \u2014 sonraki ad\u0131mda yaln\u0131zca g\xF6rselleri ve metinleri dolduracaks\u0131n."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, D.TEMPLATES.map(t => {
      const on = value === t.id;
      return /*#__PURE__*/React.createElement("button", {
        key: t.id,
        onClick: () => onPick(t.id),
        style: {
          textAlign: 'left',
          cursor: 'pointer',
          font: 'inherit',
          padding: 18,
          borderRadius: 'var(--radius-lg)',
          border: `1.5px solid ${on ? 'var(--navy-700)' : 'var(--border-subtle)'}`,
          background: on ? 'var(--navy-50)' : 'var(--surface-card)',
          boxShadow: on ? 'var(--ring-focus)' : 'var(--shadow-xs)',
          transition: 'all var(--dur-fast)',
          position: 'relative'
        }
      }, on && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          top: 14,
          right: 14,
          color: 'var(--navy-700)'
        }
      }, ic('check-circle-2', 20)), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-md)',
          background: on ? 'var(--navy-700)' : 'var(--navy-50)',
          color: on ? 'var(--gold-400)' : 'var(--navy-600)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 14
        }
      }, ic(t.icon, 21)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 19,
          textTransform: 'uppercase',
          color: 'var(--text-strong)'
        }
      }, t.name)), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 13,
          lineHeight: 1.5,
          color: 'var(--ink-500)',
          margin: '0 0 12px'
        }
      }, t.desc), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6
        }
      }, t.blocks.map(b => /*#__PURE__*/React.createElement("span", {
        key: b,
        style: {
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--ink-500)',
          background: 'var(--ink-100)',
          borderRadius: 'var(--radius-xs)',
          padding: '3px 7px'
        }
      }, b))));
    })));
  }

  // STEP 2 — fill content (adaptive) + live preview
  function ContentEditor({
    tpl,
    form,
    set
  }) {
    const isMatch = tpl.id === 'macraporu';
    const isGallery = tpl.id === 'galeri';
    const isInterview = tpl.id === 'roportaj';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 22,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--gold-700)'
      }
    }, tpl.name, " \xB7 \u0130\xE7erik"), isMatch && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 10,
        alignItems: 'end',
        padding: 14,
        background: 'var(--navy-50)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Ev sahibi"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: "Buca Y\u0131ld\u0131z"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Skor"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "2-0",
      style: {
        textAlign: 'center',
        width: 70
      }
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Deplasman"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "Rakip"
    }))), /*#__PURE__*/React.createElement(Field, {
      label: isInterview ? 'Portre görseli' : 'Kapak görseli',
      required: true
    }, /*#__PURE__*/React.createElement(FileDrop, {
      label: "Kapak g\xF6rseli y\xFCkle",
      hint: "1600\xD7900 \xF6nerilir",
      aspect: "16 / 9",
      icon: "image-up"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Ba\u015Fl\u0131k",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      value: form.title,
      onChange: e => set('title', e.target.value),
      placeholder: "Haber ba\u015Fl\u0131\u011F\u0131"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "\xD6zet / Spot"
    }, /*#__PURE__*/React.createElement(TextArea, {
      rows: 2,
      value: form.summary,
      onChange: e => set('summary', e.target.value),
      placeholder: "K\u0131sa giri\u015F metni (man\u015Fet alt\u0131)"
    })), isInterview ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
      label: "Soru 1"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "Soru\u2026"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Cevap 1"
    }, /*#__PURE__*/React.createElement(TextArea, {
      rows: 3,
      value: form.body,
      onChange: e => set('body', e.target.value),
      placeholder: "Cevap metni\u2026"
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      leftIcon: ic('plus', 15),
      style: {
        alignSelf: 'flex-start'
      }
    }, "Soru\u2013Cevap Ekle")) : /*#__PURE__*/React.createElement(Field, {
      label: "Metin"
    }, /*#__PURE__*/React.createElement(TextArea, {
      rows: 6,
      value: form.body,
      onChange: e => set('body', e.target.value),
      placeholder: "Haber metni\u2026"
    })), (isGallery || isMatch) && /*#__PURE__*/React.createElement(Field, {
      label: "Foto Galeri"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(FileDrop, {
      compact: true,
      label: "Ekle",
      aspect: "1 / 1",
      icon: "plus"
    }), [0, 1, 2].map(i => /*#__PURE__*/React.createElement(FileDrop, {
      key: i,
      compact: true,
      label: "",
      aspect: "1 / 1",
      filled: true,
      icon: "image"
    })))), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      leftIcon: ic('plus', 15),
      style: {
        alignSelf: 'flex-start'
      }
    }, "Blok Ekle (metin, g\xF6rsel, al\u0131nt\u0131\u2026)")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 11.5,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: 'var(--ink-400)',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 7
      }
    }, ic('eye', 14), " Canl\u0131 \xD6nizleme"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.AdminUI.cardStyle,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        aspectRatio: '16 / 9',
        background: 'var(--grad-navy)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(255,255,255,.14)'
      }
    }, ic('image', 34)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--scrim-bottom)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 16,
        bottom: 14
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "gold"
    }, tpl.tag))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 22
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 26,
        lineHeight: 1.02,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, form.title || 'Haber Başlığı Buraya Gelecek'), form.summary && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        lineHeight: 1.55,
        color: 'var(--ink-600)',
        margin: '12px 0 0',
        fontWeight: 500
      }
    }, form.summary), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 3,
        background: 'var(--grad-gold)',
        borderRadius: 999,
        margin: '16px 0'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14.5,
        lineHeight: 1.7,
        color: 'var(--ink-600)',
        margin: 0,
        whiteSpace: 'pre-wrap'
      }
    }, form.body || 'Metin alanına yazdıkça burada anında görünür. Bu sayede teknik bilgiye ihtiyaç duymadan, şablonun düzenini koruyarak profesyonel bir haber sayfası oluşturabilirsin.')))));
  }

  // STEP 3 — publish settings
  function PublishStep({
    tpl,
    form,
    set
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 22,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 22,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, "Yay\u0131n ayarlar\u0131"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Kategori",
      required: true
    }, /*#__PURE__*/React.createElement(Select, {
      options: D.CATEGORIES.map(c => ({
        value: c.id,
        label: c.name
      })),
      value: form.category,
      onChange: e => set('category', e.target.value),
      placeholder: "Se\xE7"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Yazar"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: "Bas\u0131n"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Yay\u0131n Tarihi"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "date",
      defaultValue: "2026-06-14"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "G\xF6r\xFCn\xFCrl\xFCk"
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Herkese açık', 'Sadece üyeler']
    }))), /*#__PURE__*/React.createElement(Field, {
      label: "URL K\u0131saltmas\u0131",
      hint: "bucayildiz.com/haber/\u2026"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: (form.title || 'yeni-haber').toLowerCase().replace(/[^a-z0-9ğüşiöç ]/g, '').replace(/\s+/g, '-').slice(0, 40)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        background: 'var(--surface-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, "Ana sayfada \xF6ne \xE7\u0131kar"), /*#__PURE__*/React.createElement(Switch, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, "Sosyal medyada payla\u015F"), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: true
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.AdminUI.cardStyle,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 11.5,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: 'var(--ink-400)'
      }
    }, "\xD6zet"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 'var(--radius-md)',
        background: 'var(--navy-50)',
        color: 'var(--navy-600)',
        display: 'grid',
        placeItems: 'center'
      }
    }, ic(tpl.icon, 18)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, tpl.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-400)'
      }
    }, "\u015Eablon"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--text-strong)',
        fontWeight: 600,
        lineHeight: 1.3
      }
    }, form.title || 'Başlıksız haber'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--ink-500)',
        lineHeight: 1.5
      }
    }, form.summary || 'Özet girilmedi.'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "outline"
    }, form.category ? (D.CATEGORIES.find(c => c.id === form.category) || {}).name : 'Kategori yok'))));
  }
  function Wizard({
    initialTpl,
    onExit
  }) {
    const [step, setStep] = React.useState(initialTpl ? 1 : 0);
    const [tplId, setTplId] = React.useState(initialTpl || null);
    const [form, setForm] = React.useState({
      title: '',
      summary: '',
      body: '',
      category: '',
      status: 'draft'
    });
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const tpl = D.TEMPLATES.find(t => t.id === tplId);
    const canNext = step === 0 ? !!tplId : true;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "\xC7\u0131k",
      variant: "outline",
      onClick: onExit
    }, ic('arrow-left', 18)), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 26,
        textTransform: 'uppercase',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, "Yeni Haber")), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: onExit
    }, "Taslak olarak kaydet")), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 560,
        margin: '0 auto 4px'
      }
    }, /*#__PURE__*/React.createElement(Stepper, {
      steps: ['Şablon', 'İçerik', 'Yayınla'],
      current: step
    }))), /*#__PURE__*/React.createElement(Panel, {
      pad: 26
    }, step === 0 && /*#__PURE__*/React.createElement(TemplatePicker, {
      value: tplId,
      onPick: setTplId
    }), step === 1 && tpl && /*#__PURE__*/React.createElement(ContentEditor, {
      tpl: tpl,
      form: form,
      set: set
    }), step === 2 && tpl && /*#__PURE__*/React.createElement(PublishStep, {
      tpl: tpl,
      form: form,
      set: set
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: 0,
        background: 'var(--surface-subtle)',
        padding: '14px 0',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "md",
      leftIcon: ic('arrow-left', 16),
      onClick: () => step === 0 ? onExit() : setStep(step - 1),
      disabled: false
    }, step === 0 ? 'Vazgeç' : 'Geri'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--ink-400)'
      }
    }, "Ad\u0131m ", step + 1, " / 3"), step < 2 ? /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "md",
      rightIcon: ic('arrow-right', 16),
      disabled: !canNext,
      onClick: () => canNext && setStep(step + 1)
    }, "Devam Et") : /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "md",
      leftIcon: ic('send', 16),
      onClick: onExit
    }, "Yay\u0131nla")));
  }

  // ---------- List ----------
  function BlogView() {
    const [mode, setMode] = React.useState('list');
    const [tab, setTab] = React.useState('all');
    const rows = D.POSTS.filter(p => tab === 'all' || p.status === tab);
    const tabs = [{
      id: 'all',
      label: 'Tümü',
      count: D.POSTS.length
    }, {
      id: 'published',
      label: 'Yayında',
      count: D.POSTS.filter(p => p.status === 'published').length
    }, {
      id: 'draft',
      label: 'Taslak',
      count: D.POSTS.filter(p => p.status === 'draft').length
    }, {
      id: 'scheduled',
      label: 'Planlı',
      count: D.POSTS.filter(p => p.status === 'scheduled').length
    }];
    const cols = [{
      key: 'title',
      label: 'Başlık',
      render: r => /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 46,
          height: 34,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--grad-navy)',
          display: 'grid',
          placeItems: 'center',
          color: 'rgba(255,255,255,.2)',
          flex: 'none'
        }
      }, ic('image', 15)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          color: 'var(--text-strong)'
        }
      }, r.title))
    }, {
      key: 'template',
      label: 'Şablon',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: "outline"
      }, r.template)
    }, {
      key: 'author',
      label: 'Yazar',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: 'var(--ink-500)'
        }
      }, r.author)
    }, {
      key: 'date',
      label: 'Tarih',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-stat)',
          fontSize: 13
        }
      }, fmt(r.date))
    }, {
      key: 'status',
      label: 'Durum',
      align: 'center',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: postStatus[r.status].tone,
        dot: r.status === 'scheduled'
      }, postStatus[r.status].label)
    }, {
      key: 'go',
      label: '',
      width: 44,
      align: 'right',
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--ink-300)',
          display: 'inline-flex'
        }
      }, ic('pencil', 15))
    }];
    if (mode === 'wizard') return /*#__PURE__*/React.createElement(Wizard, {
      onExit: () => setMode('list')
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Haberler / Blog",
      subtitle: "\u015Eablonlarla ad\u0131m ad\u0131m profesyonel haber sayfalar\u0131 olu\u015Ftur",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        size: "sm",
        leftIcon: ic('plus', 16),
        onClick: () => setMode('wizard')
      }, "Yeni Yaz\u0131"),
      tabs: /*#__PURE__*/React.createElement(Tabs, {
        tabs: tabs,
        value: tab,
        onChange: setTab
      })
    }), /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(SearchBox, {
      placeholder: "Ba\u015Fl\u0131k ara\u2026"
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['Tüm şablonlar', ...D.TEMPLATES.map(t => t.name)],
      containerStyle: {
        minWidth: 170
      }
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['Tüm kategoriler', ...D.CATEGORIES.map(c => c.name)],
      containerStyle: {
        minWidth: 160
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 13,
        color: 'var(--ink-400)'
      }
    }, rows.length, " yaz\u0131")), /*#__PURE__*/React.createElement(Table, {
      columns: cols,
      rows: rows,
      getRowKey: r => r.id,
      onRowClick: () => setMode('wizard')
    }));
  }
  window.BlogView = BlogView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/BlogView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/DashboardView.jsx
try { (() => {
// Buca Yıldız Admin — Genel Bakış / Raporlama
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    StatTile,
    Badge,
    Avatar,
    Table,
    Button
  } = NS;
  const {
    ViewHeader,
    Panel,
    cardStyle,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const dashStatus = {
    active: {
      tone: 'success',
      label: 'Aktif'
    },
    injured: {
      tone: 'live',
      label: 'Sakat'
    },
    rest: {
      tone: 'neutral',
      label: 'İzinli'
    }
  };

  // squad distribution bar chart
  function SquadChart() {
    const max = Math.max(...D.TEAMS.map(t => t.count));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 18,
        height: 180,
        padding: '8px 4px 0'
      }
    }, D.TEAMS.map(t => /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        height: '100%',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-stat)',
        fontWeight: 700,
        fontSize: 15,
        color: 'var(--text-strong)'
      }
    }, t.count), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: 54,
        height: `${t.count / max * 130}px`,
        background: t.id === 'u17' ? 'var(--grad-gold)' : 'var(--grad-navy)',
        borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 13,
        textTransform: 'uppercase',
        color: 'var(--ink-600)'
      }
    }, t.name))));
  }
  function DashboardView({
    onNav
  }) {
    const recent = D.ATHLETES.slice(0, 6);
    const cols = [{
      key: 'name',
      label: 'Sporcu',
      render: r => /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: r.name,
        size: "sm"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          lineHeight: 1.3
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          color: 'var(--text-strong)',
          whiteSpace: 'nowrap'
        }
      }, r.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--ink-400)',
          whiteSpace: 'nowrap'
        }
      }, "#", r.no, " \xB7 ", r.pos)))
    }, {
      key: 'teamName',
      label: 'Takım',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: "navy"
      }, r.teamName)
    }, {
      key: 'vo2',
      label: 'VO2',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-stat)',
          fontWeight: 700
        }
      }, r.vo2)
    }, {
      key: 'attend',
      label: 'Katılım',
      align: 'right',
      render: r => `%${r.attend}`
    }, {
      key: 'status',
      label: 'Durum',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: dashStatus[r.status].tone,
        dot: r.status === 'injured'
      }, dashStatus[r.status].label)
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Genel Bak\u0131\u015F",
      subtitle: "Kul\xFCp geneli \xF6zet rapor \u2014 14 Haziran 2026",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        leftIcon: ic('download', 15)
      }, "Rapor \u0130ndir")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      label: "Toplam Sporcu",
      value: "126",
      delta: "6",
      deltaTone: "up",
      sub: "bu ay",
      icon: ic('users', 18),
      accent: true
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Aktif Tak\u0131m",
      value: "5",
      deltaTone: "neutral",
      sub: "A \u2192 U-15",
      icon: ic('shield', 18)
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Bu Hafta Antrenman",
      value: "34",
      unit: "seans",
      delta: "4%",
      deltaTone: "up",
      icon: ic('dumbbell', 18)
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Sakatl\u0131k",
      value: "4",
      delta: "1",
      deltaTone: "down",
      sub: "takipte",
      icon: ic('heart-pulse', 18)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Tak\u0131m Mevcutlar\u0131",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => onNav('teams'),
        rightIcon: ic('arrow-right', 15)
      }, "Tak\u0131mlar")
    }, /*#__PURE__*/React.createElement(SquadChart, null)), /*#__PURE__*/React.createElement(Panel, {
      title: "Yakla\u015Fan Ma\xE7lar",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => onNav('fixtures'),
        rightIcon: ic('arrow-right', 15)
      }, "Fikst\xFCr")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, D.FIXTURES.filter(f => f.status === 'upcoming').slice(0, 3).map(f => /*#__PURE__*/React.createElement("div", {
      key: f.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        textAlign: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-stat)',
        fontWeight: 700,
        fontSize: 18,
        color: 'var(--navy-700)',
        lineHeight: 1
      }
    }, f.date.slice(8)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        textTransform: 'uppercase',
        color: 'var(--ink-400)',
        letterSpacing: '.06em'
      }
    }, "Haz")), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 1,
        height: 30,
        background: 'var(--ink-200)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13.5,
        color: 'var(--text-strong)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, f.home, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-400)'
      }
    }, "vs"), " ", f.away), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-400)'
      }
    }, f.comp, " \xB7 ", f.time))))))), /*#__PURE__*/React.createElement(Panel, {
      title: "\xD6ne \xC7\u0131kan Sporcular",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => onNav('athletes'),
        rightIcon: ic('arrow-right', 15)
      }, "T\xFCm Sporcular"),
      pad: 0
    }, /*#__PURE__*/React.createElement(Table, {
      columns: cols,
      rows: recent,
      onRowClick: () => onNav('athletes'),
      getRowKey: r => r.id,
      style: {
        border: 'none',
        borderRadius: 0
      }
    })));
  }
  window.DashboardView = DashboardView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/DashboardView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/FixturesView.jsx
try { (() => {
// Buca Yıldız Admin — Fikstür yönetimi
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Table,
    Badge,
    Button,
    Select,
    Tabs,
    IconButton
  } = NS;
  const {
    ViewHeader,
    Drawer,
    Field,
    TextInput,
    FileDrop,
    Toolbar,
    SearchBox,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const CREST = '../../assets/logo-emblem.png';
  const fxStatus = {
    upcoming: {
      tone: 'navy',
      label: 'Yaklaşan'
    },
    live: {
      tone: 'live',
      label: 'Canlı'
    },
    finished: {
      tone: 'neutral',
      label: 'Bitti'
    }
  };
  const fmtDate = d => {
    const [y, m, day] = d.split('-');
    return `${day}.${m}.${y}`;
  };
  function FixtureForm({
    fx
  }) {
    const homeIsUs = !fx || fx.home === 'Buca Yıldız';
    const [side, setSide] = React.useState(homeIsUs ? 'home' : 'away');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "M\xFCsabaka / Lig",
      required: true
    }, /*#__PURE__*/React.createElement(Select, {
      placeholder: "Lig se\xE7",
      options: D.COMPS,
      defaultValue: fx ? fx.comp : ''
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12.5,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        color: 'var(--ink-600)',
        marginBottom: 8
      }
    }, "Ev Sahibi / Deplasman"), /*#__PURE__*/React.createElement(Tabs, {
      tabs: [{
        id: 'home',
        label: 'Biz Ev Sahibiyiz'
      }, {
        id: 'away',
        label: 'Biz Deplasmandayız'
      }],
      variant: "pill",
      value: side,
      onChange: setSide
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 14,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        padding: 14,
        border: '1.5px solid var(--navy-300)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--navy-50)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: CREST,
      alt: "",
      style: {
        width: 52,
        height: 52,
        objectFit: 'contain'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 16,
        textTransform: 'uppercase',
        color: 'var(--navy-800)'
      }
    }, "Buca Y\u0131ld\u0131z"), /*#__PURE__*/React.createElement(Badge, {
      tone: "gold"
    }, side === 'home' ? 'Ev Sahibi' : 'Deplasman')), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'center',
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 22,
        color: 'var(--ink-400)'
      }
    }, "VS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(FileDrop, {
      label: "Rakip logosu",
      hint: "PNG / SVG",
      icon: "upload",
      aspect: "1 / 1",
      style: {
        width: 72,
        height: 72,
        alignSelf: 'center'
      }
    }), /*#__PURE__*/React.createElement(Field, {
      label: "Rakip Tak\u0131m",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: fx ? homeIsUs ? fx.away : fx.home : '',
      placeholder: "Rakip tak\u0131m ad\u0131"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Tarih",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "date",
      defaultValue: fx ? fx.date : ''
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Saat",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "time",
      defaultValue: fx ? fx.time : ''
    }))), /*#__PURE__*/React.createElement(Field, {
      label: "Saha / Stadyum"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: fx ? fx.venue : '',
      placeholder: "\xF6rn. Buca Y\u0131ld\u0131z Tesisleri"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement(Field, {
      label: "Durum"
    }, /*#__PURE__*/React.createElement(Select, {
      options: [{
        value: 'upcoming',
        label: 'Yaklaşan'
      }, {
        value: 'live',
        label: 'Canlı'
      }, {
        value: 'finished',
        label: 'Tamamlandı'
      }],
      defaultValue: fx ? fx.status : 'upcoming'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 12,
        alignItems: 'end'
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Skor (biz)"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      placeholder: "0",
      defaultValue: fx && fx.hs != null ? fx.hs : ''
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 12,
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        color: 'var(--ink-400)'
      }
    }, "\u2013"), /*#__PURE__*/React.createElement(Field, {
      label: "Skor (rakip)"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      placeholder: "0",
      defaultValue: fx && fx.as != null ? fx.as : ''
    }))));
  }
  function FixturesView() {
    const [tab, setTab] = React.useState('all');
    const [drawer, setDrawer] = React.useState(null);
    const rows = D.FIXTURES.filter(f => tab === 'all' || f.status === tab);
    const tabs = [{
      id: 'all',
      label: 'Tümü',
      count: D.FIXTURES.length
    }, {
      id: 'upcoming',
      label: 'Yaklaşan',
      count: D.FIXTURES.filter(f => f.status === 'upcoming').length
    }, {
      id: 'finished',
      label: 'Tamamlanan',
      count: D.FIXTURES.filter(f => f.status === 'finished').length
    }];
    const cols = [{
      key: 'date',
      label: 'Tarih',
      render: r => /*#__PURE__*/React.createElement("div", {
        style: {
          lineHeight: 1.3
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-stat)',
          fontWeight: 700,
          color: 'var(--text-strong)'
        }
      }, fmtDate(r.date)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--ink-400)'
        }
      }, r.time))
    }, {
      key: 'match',
      label: 'Maç',
      render: r => /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          color: r.home === 'Buca Yıldız' ? 'var(--navy-700)' : 'var(--ink-700)'
        }
      }, r.home), r.status === 'finished' ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-stat)',
          fontWeight: 700,
          background: 'var(--ink-100)',
          borderRadius: 'var(--radius-sm)',
          padding: '2px 9px',
          color: 'var(--text-strong)'
        }
      }, r.hs, "\u2013", r.as) : /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--ink-400)',
          fontSize: 12,
          fontWeight: 600
        }
      }, "vs"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          color: r.away === 'Buca Yıldız' ? 'var(--navy-700)' : 'var(--ink-700)'
        }
      }, r.away))
    }, {
      key: 'comp',
      label: 'Lig',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: "outline"
      }, r.comp)
    }, {
      key: 'venue',
      label: 'Saha',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: 'var(--ink-500)'
        }
      }, r.venue)
    }, {
      key: 'status',
      label: 'Durum',
      align: 'center',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: fxStatus[r.status].tone,
        dot: r.status === 'live'
      }, fxStatus[r.status].label)
    }, {
      key: 'go',
      label: '',
      width: 44,
      align: 'right',
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--ink-300)',
          display: 'inline-flex'
        }
      }, ic('pencil', 15))
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Fikst\xFCr",
      subtitle: "Ma\xE7 program\u0131n\u0131 g\xF6r\xFCnt\xFCle ve manuel y\xF6net",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        size: "sm",
        leftIcon: ic('plus', 16),
        onClick: () => setDrawer({
          fx: null
        })
      }, "Ma\xE7 Ekle"),
      tabs: /*#__PURE__*/React.createElement(Tabs, {
        tabs: tabs,
        value: tab,
        onChange: setTab
      })
    }), /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(SearchBox, {
      placeholder: "Rakip / lig ara\u2026"
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['Tüm ligler', ...D.COMPS],
      containerStyle: {
        minWidth: 180
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 13,
        color: 'var(--ink-400)'
      }
    }, rows.length, " ma\xE7")), /*#__PURE__*/React.createElement(Table, {
      columns: cols,
      rows: rows,
      getRowKey: r => r.id,
      onRowClick: r => setDrawer({
        fx: r
      })
    }), /*#__PURE__*/React.createElement(Drawer, {
      open: !!drawer,
      onClose: () => setDrawer(null),
      title: drawer && drawer.fx ? 'Maçı Düzenle' : 'Yeni Maç',
      subtitle: "Rakip bilgilerini ve logosunu manuel girebilirsin",
      width: 540,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, drawer && drawer.fx && /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        style: {
          color: 'var(--red-600)',
          marginRight: 'auto'
        },
        leftIcon: ic('trash-2', 15)
      }, "Sil"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setDrawer(null)
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: () => setDrawer(null)
      }, "Kaydet"))
    }, drawer && /*#__PURE__*/React.createElement(FixtureForm, {
      fx: drawer.fx
    })));
  }
  window.FixturesView = FixturesView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/FixturesView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/JerseysView.jsx
try { (() => {
// Buca Yıldız Admin — Formalar yönetimi
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Badge,
    Button,
    Switch,
    IconButton
  } = NS;
  const {
    ViewHeader,
    Modal,
    Field,
    TextInput,
    FileDrop,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const JERSEY_CLIP = 'polygon(30% 0,42% 8%,58% 8%,70% 0,100% 14%,87% 39%,78% 30%,78% 100%,22% 100%,22% 30%,13% 39%,0 14%)';
  function JerseyShape({
    primary,
    accent
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 120,
        height: 140,
        filter: 'drop-shadow(0 12px 18px rgba(14,33,72,.22))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        clipPath: JERSEY_CLIP,
        background: primary,
        border: primary === '#FFFFFF' ? '1px solid var(--ink-200)' : 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '7%',
        left: '42%',
        width: '16%',
        height: '6%',
        background: accent,
        borderRadius: '0 0 40% 40%'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: '34%',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-stat)',
        fontWeight: 700,
        fontSize: 42,
        color: accent,
        lineHeight: 1
      }
    }, "10"));
  }
  function JerseyCard({
    j,
    onEdit
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...window.AdminUI.cardStyle,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        padding: '26px 18px 18px',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--ink-50)',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12
      }
    }, j.active ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, "Yay\u0131nda") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Pasif")), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 12,
        right: 12
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "D\xFCzenle",
      variant: "outline",
      size: "sm",
      onClick: () => onEdit(j)
    }, ic('pencil', 15))), /*#__PURE__*/React.createElement(JerseyShape, {
      primary: j.primary,
      accent: j.accent
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 19,
        textTransform: 'uppercase',
        color: 'var(--text-strong)'
      }
    }, j.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-500)',
        marginTop: 3
      }
    }, j.desc)));
  }
  function JerseyDrawerModal({
    j,
    isNew,
    onClose
  }) {
    return /*#__PURE__*/React.createElement(Modal, {
      open: !!j || isNew,
      onClose: onClose,
      title: isNew ? 'Yeni Forma' : j ? j.name : '',
      width: 460,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, !isNew && /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        style: {
          color: 'var(--red-600)',
          marginRight: 'auto'
        },
        leftIcon: ic('trash-2', 15)
      }, "Sil"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: onClose
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: onClose
      }, "Kaydet"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Forma G\xF6rseli",
      hint: "\u015Eeffaf PNG \xF6nerilir (ana sayfada kayan vitrin)"
    }, /*#__PURE__*/React.createElement(FileDrop, {
      label: "Forma g\xF6rseli y\xFCkle",
      aspect: "4 / 3",
      icon: "shirt"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Forma Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: j && !isNew ? j.name : '',
      placeholder: "\xF6rn. \xD6zel Seri"
    })), isNew && /*#__PURE__*/React.createElement(Field, {
      label: "Forma Tipi"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, ['İç Saha', 'Deplasman', 'Üçüncü', 'Kaleci', 'Alternatif'].map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        padding: '7px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1.5px solid var(--ink-200)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ink-600)',
        cursor: 'pointer'
      }
    }, t)))), /*#__PURE__*/React.createElement(Field, {
      label: "A\xE7\u0131klama"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: j && !isNew ? j.desc : '',
      placeholder: "K\u0131sa a\xE7\u0131klama"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: 'var(--ink-600)'
      }
    }, "Ana sayfada yay\u0131nla"), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: !j || j.active
    }))));
  }
  function JerseysView() {
    const [edit, setEdit] = React.useState(null);
    const [isNew, setIsNew] = React.useState(false);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Formalar",
      subtitle: "\u0130\xE7 saha, deplasman, \xFC\xE7\xFCnc\xFC, kaleci ve alternatif formalar\u0131 y\xF6net",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        size: "sm",
        leftIcon: ic('plus', 16),
        onClick: () => {
          setIsNew(true);
          setEdit(null);
        }
      }, "Forma Ekle")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 18
      }
    }, D.JERSEYS.map(j => /*#__PURE__*/React.createElement(JerseyCard, {
      key: j.id,
      j: j,
      onEdit: jj => {
        setEdit(jj);
        setIsNew(false);
      }
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setIsNew(true);
        setEdit(null);
      },
      style: {
        cursor: 'pointer',
        font: 'inherit',
        minHeight: 240,
        border: '1.5px dashed var(--ink-300)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--ink-50)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: 'var(--ink-500)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 46,
        borderRadius: '50%',
        background: 'var(--navy-50)',
        color: 'var(--navy-600)',
        display: 'grid',
        placeItems: 'center'
      }
    }, ic('plus', 22)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14
      }
    }, "Alternatif Forma"))), /*#__PURE__*/React.createElement(JerseyDrawerModal, {
      j: edit,
      isNew: isNew,
      onClose: () => {
        setEdit(null);
        setIsNew(false);
      }
    }));
  }
  window.JerseysView = JerseysView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/JerseysView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/MediaView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Buca Yıldız Admin — Medya Kütüphanesi (folders + categories + homepage cards)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Badge,
    Button,
    Select,
    Tabs,
    IconButton,
    Switch
  } = NS;
  const {
    ViewHeader,
    Panel,
    Modal,
    Drawer,
    Field,
    TextInput,
    FileDrop,
    SearchBox,
    Toolbar,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const catColor = id => (D.CATEGORIES.find(c => c.id === id) || {}).color || 'var(--ink-400)';
  const catName = id => (D.CATEGORIES.find(c => c.id === id) || {}).name || '—';

  // ---- Asset tile ----
  function Asset({
    i,
    video
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--grad-navy)',
        border: '1px solid var(--navy-700)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        color: 'rgba(255,255,255,.12)'
      }
    }, ic(video ? 'play' : 'image', 26)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--scrim-bottom)'
      }
    }), video && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: 7,
        top: 7,
        fontSize: 10,
        fontWeight: 700,
        color: '#fff',
        background: 'rgba(0,0,0,.4)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-xs)'
      }
    }, "0:", 20 + i), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 7,
        bottom: 7,
        fontSize: 11,
        color: '#fff',
        fontWeight: 500
      }
    }, "IMG_", 2400 + i));
  }

  // ---- Folder tree ----
  function FolderTree({
    active,
    onPick
  }) {
    const children = pid => D.FOLDERS.filter(f => f.parent === pid);
    const Node = ({
      f,
      depth
    }) => {
      const kids = children(f.id);
      const [open, setOpen] = React.useState(depth < 2);
      const on = active === f.id;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        onClick: () => onPick(f.id),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 10px',
          paddingLeft: 10 + depth * 16,
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          background: on ? 'var(--navy-50)' : 'transparent',
          color: on ? 'var(--navy-800)' : 'var(--ink-700)',
          fontWeight: on ? 600 : 500,
          fontSize: 13.5
        }
      }, kids.length > 0 ? /*#__PURE__*/React.createElement("span", {
        onClick: e => {
          e.stopPropagation();
          setOpen(!open);
        },
        style: {
          display: 'inline-flex',
          color: 'var(--ink-400)'
        }
      }, ic(open ? 'chevron-down' : 'chevron-right', 14)) : /*#__PURE__*/React.createElement("span", {
        style: {
          width: 14
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          color: on ? 'var(--gold-600)' : 'var(--navy-400)'
        }
      }, ic(on ? 'folder-open' : 'folder', 15)), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, f.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          color: 'var(--ink-400)',
          fontFamily: 'var(--font-stat)'
        }
      }, f.count)), open && kids.map(k => /*#__PURE__*/React.createElement(Node, {
        key: k.id,
        f: k,
        depth: depth + 1
      })));
    };
    const roots = children(null);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, roots.map(r => /*#__PURE__*/React.createElement(Node, {
      key: r.id,
      f: r,
      depth: 0
    })));
  }

  // ---- Library tab ----
  function LibraryTab() {
    const [folder, setFolder] = React.useState('2026');
    const [newFolder, setNewFolder] = React.useState(false);
    const f = D.FOLDERS.find(x => x.id === folder) || D.FOLDERS[0];
    const assets = Array.from({
      length: 12
    }, (_, i) => ({
      i,
      video: i % 7 === 3
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '252px 1fr',
        gap: 18,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Klas\xF6rler",
      action: /*#__PURE__*/React.createElement(IconButton, {
        label: "Yeni klas\xF6r",
        variant: "ghost",
        size: "sm",
        onClick: () => setNewFolder(true)
      }, ic('folder-plus', 16)),
      pad: 10
    }, /*#__PURE__*/React.createElement(FolderTree, {
      active: folder,
      onPick: setFolder
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 18,
        textTransform: 'uppercase',
        color: 'var(--text-strong)'
      }
    }, ic('folder-open', 18), f.name, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: 13,
        textTransform: 'none',
        color: 'var(--ink-400)'
      }
    }, "\xB7 ", f.count, " dosya")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Tüm kategoriler', ...D.CATEGORIES.map(c => c.name)],
      containerStyle: {
        minWidth: 160
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "sm",
      leftIcon: ic('upload', 15)
    }, "Y\xFCkle"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(FileDrop, {
      label: "S\xFCr\xFCkle / y\xFCkle",
      hint: "JPG, PNG, MP4",
      aspect: "1 / 1",
      icon: "upload"
    }), assets.map(a => /*#__PURE__*/React.createElement(Asset, _extends({
      key: a.i
    }, a))))), /*#__PURE__*/React.createElement(Modal, {
      open: newFolder,
      onClose: () => setNewFolder(false),
      title: "Yeni Klas\xF6r",
      width: 420,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setNewFolder(false)
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: () => setNewFolder(false)
      }, "Olu\u015Ftur"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Klas\xF6r Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "\xF6rn. U-16 Kamp"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "\xDCst Klas\xF6r"
    }, /*#__PURE__*/React.createElement(Select, {
      options: D.FOLDERS.map(f => ({
        value: f.id,
        label: f.name
      })),
      defaultValue: "2026"
    })))));
  }

  // ---- Categories tab ----
  function CategoriesTab() {
    const [newCat, setNewCat] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13.5,
        color: 'var(--ink-500)',
        maxWidth: 560
      }
    }, "Kategoriler, ana sayfadaki \u201CG\xF6rseller & Videolar\u201D kartlar\u0131n\u0131 besler. Bir medyay\u0131 bir kategoriye atad\u0131\u011F\u0131nda, o kategorinin kart\u0131na t\u0131klay\u0131nca otomatik g\xF6r\xFCn\xFCr."), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "sm",
      leftIcon: ic('plus', 15),
      style: {
        marginLeft: 'auto'
      },
      onClick: () => setNewCat(true)
    }, "Kategori Olu\u015Ftur")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14
      }
    }, D.CATEGORIES.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        ...window.AdminUI.cardStyle,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-md)',
        background: c.color,
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        flex: 'none'
      }
    }, ic('tag', 18)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        lineHeight: 1.3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 17,
        color: 'var(--text-strong)'
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-400)'
      }
    }, c.count, " medya")), /*#__PURE__*/React.createElement(IconButton, {
      label: "D\xFCzenle",
      variant: "ghost",
      size: "sm"
    }, ic('pencil', 15))))), /*#__PURE__*/React.createElement(Modal, {
      open: newCat,
      onClose: () => setNewCat(false),
      title: "Yeni Kategori",
      width: 420,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setNewCat(false)
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: () => setNewCat(false)
      }, "Olu\u015Ftur"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Kategori Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "\xF6rn. Alt Yap\u0131 Se\xE7meleri"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Renk"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, ['var(--navy-700)', 'var(--gold-600)', 'var(--green-600)', 'var(--red-600)', 'var(--navy-400)'].map(col => /*#__PURE__*/React.createElement("span", {
      key: col,
      style: {
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-sm)',
        background: col,
        cursor: 'pointer',
        border: '2px solid #fff',
        boxShadow: '0 0 0 1px var(--ink-200)'
      }
    })))))));
  }

  // ---- Homepage cards tab ----
  function CardsTab() {
    const [edit, setEdit] = React.useState(null);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13.5,
        color: 'var(--ink-500)',
        maxWidth: 620
      }
    }, "Ana sayfadaki \u201CG\xF6rseller & Videolar\u201D b\xF6l\xFCm\xFCn\xFC y\xF6net. Kart\u0131n ad\u0131n\u0131 de\u011Fi\u015Ftir, bir kategori ata; ziyaret\xE7i karta t\u0131klad\u0131\u011F\u0131nda yaln\u0131zca o kategorideki medya klas\xF6rlenmi\u015F olarak g\xF6r\xFCn\xFCr."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14
      }
    }, D.MEDIA_CARDS.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        ...window.AdminUI.cardStyle,
        overflow: 'hidden',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120,
        flex: 'none',
        background: 'var(--grad-navy)',
        display: 'grid',
        placeItems: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(255,255,255,.16)'
      }
    }, ic(c.kind === 'video' ? 'play' : 'image', 26)), c.featured && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 8,
        left: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "gold"
    }, "\xD6ne \xE7\u0131kan"))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 17,
        color: 'var(--text-strong)',
        lineHeight: 1.1
      }
    }, c.title), /*#__PURE__*/React.createElement(IconButton, {
      label: "D\xFCzenle",
      variant: "ghost",
      size: "sm",
      onClick: () => setEdit(c)
    }, ic('pencil', 15))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--ink-600)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 3,
        background: catColor(c.category)
      }
    }), catName(c.category)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--ink-400)'
      }
    }, "\xB7 ", c.count, " medya")))))), /*#__PURE__*/React.createElement(Drawer, {
      open: !!edit,
      onClose: () => setEdit(null),
      title: "Kart\u0131 D\xFCzenle",
      subtitle: "Ana sayfa medya kart\u0131",
      width: 460,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setEdit(null)
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: () => setEdit(null)
      }, "Kaydet"))
    }, edit && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Kart Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: edit.title
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Kategori",
      hint: "Bu kategorideki medya karta otomatik dolar"
    }, /*#__PURE__*/React.createElement(Select, {
      options: D.CATEGORIES.map(c => ({
        value: c.id,
        label: c.name
      })),
      defaultValue: edit.category
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Kapak G\xF6rseli"
    }, /*#__PURE__*/React.createElement(FileDrop, {
      label: "Kapak se\xE7",
      aspect: "16 / 10",
      filled: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: 'var(--ink-600)'
      }
    }, "\xD6ne \xE7\u0131kan kart (b\xFCy\xFCk g\xF6sterim)"), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: !!edit.featured
    })))));
  }
  function MediaView() {
    const [tab, setTab] = React.useState('library');
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Medya K\xFCt\xFCphanesi",
      subtitle: "G\xF6rselleri ve videolar\u0131 klas\xF6rle, kategorile ve ana sayfay\u0131 y\xF6net",
      tabs: /*#__PURE__*/React.createElement(Tabs, {
        value: tab,
        onChange: setTab,
        tabs: [{
          id: 'library',
          label: 'Kütüphane',
          icon: ic('images', 15)
        }, {
          id: 'categories',
          label: 'Kategoriler',
          icon: ic('tags', 15)
        }, {
          id: 'cards',
          label: 'Ana Sayfa Kartları',
          icon: ic('layout-grid', 15)
        }]
      })
    }), tab === 'library' && /*#__PURE__*/React.createElement(LibraryTab, null), tab === 'categories' && /*#__PURE__*/React.createElement(CategoriesTab, null), tab === 'cards' && /*#__PURE__*/React.createElement(CardsTab, null));
  }
  window.MediaView = MediaView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/MediaView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/TeamsView.jsx
try { (() => {
// Buca Yıldız Admin — Takımlar (manage teams + roster)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Badge,
    Avatar,
    Button,
    Select,
    IconButton
  } = NS;
  const {
    ViewHeader,
    Panel,
    Drawer,
    Modal,
    Field,
    TextInput,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  function TeamCard({
    team,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => onOpen(team),
      style: {
        textAlign: 'left',
        cursor: 'pointer',
        font: 'inherit',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        padding: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grad-navy)',
        padding: '18px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 3,
        background: team.id === 'u17' ? 'var(--grad-gold)' : 'transparent'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.16)',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 18,
        color: 'var(--gold-400)'
      }
    }, team.short), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 24,
        textTransform: 'uppercase',
        color: '#fff',
        lineHeight: 1
      }
    }, team.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--navy-200)',
        marginTop: 4
      }
    }, team.born === 'Üst yapı' ? 'Üst yapı' : team.born + ' doğumlular'))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: 'var(--ink-600)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        color: 'var(--navy-400)'
      }
    }, ic('clipboard-list', 15)), team.coach), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, team.count, " sporcu")));
  }
  function TeamDrawer({
    team,
    onClose
  }) {
    const roster = D.ATHLETES.filter(a => a.team === team.id).slice(0, 9);
    const [addOpen, setAddOpen] = React.useState(false);
    const others = D.ATHLETES.filter(a => a.team !== team.id).slice(0, 8);
    return /*#__PURE__*/React.createElement(Drawer, {
      open: !!team,
      onClose: onClose,
      title: team.name,
      subtitle: "Tak\u0131m yap\u0131land\u0131rmas\u0131 ve kadro",
      width: 560,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        style: {
          color: 'var(--red-600)',
          marginRight: 'auto'
        },
        leftIcon: ic('trash-2', 15)
      }, "Tak\u0131m\u0131 Sil"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: onClose
      }, "Kapat"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: onClose
      }, "Kaydet"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Tak\u0131m Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: team.name
    })), /*#__PURE__*/React.createElement(Field, {
      label: "K\u0131sa Kod"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: team.short
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Antren\xF6r"
    }, /*#__PURE__*/React.createElement(TextInput, {
      defaultValue: team.coach
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Ya\u015F Kategorisi"
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Üst yapı', '2008', '2009', '2010', '2011', '2012'],
      defaultValue: team.born
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--gold-700)'
      }
    }, "Kadro \xB7 ", roster.length, " sporcu"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      leftIcon: ic('user-plus', 15),
      onClick: () => setAddOpen(true)
    }, "Sporcu Ata")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, roster.map(a => /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '8px 10px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: a.name,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        lineHeight: 1.3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 13.5,
        color: 'var(--text-strong)'
      }
    }, a.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-400)'
      }
    }, "#", a.no, " \xB7 ", a.pos)), /*#__PURE__*/React.createElement(IconButton, {
      label: "Kadrodan \xE7\u0131kar",
      variant: "ghost",
      size: "sm"
    }, ic('x', 15)))))), /*#__PURE__*/React.createElement(Modal, {
      open: addOpen,
      onClose: () => setAddOpen(false),
      title: "Sporcu Ata",
      width: 460,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: () => setAddOpen(false)
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        onClick: () => setAddOpen(false)
      }, "Se\xE7ilenleri Ata"))
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13.5,
        color: 'var(--ink-500)',
        margin: '0 0 14px'
      }
    }, "Ba\u015Fka tak\u0131mlardan veya bo\u015Ftaki sporculardan ", team.name, " kadrosuna ekleyin."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 280,
        overflowY: 'auto'
      }
    }, others.map(a => /*#__PURE__*/React.createElement("label", {
      key: a.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '8px 10px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      style: {
        width: 16,
        height: 16,
        accentColor: 'var(--navy-700)'
      }
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: a.name,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        lineHeight: 1.3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 13.5,
        color: 'var(--text-strong)'
      }
    }, a.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-400)'
      }
    }, a.teamName, " \xB7 ", a.pos)))))));
  }
  function NewTeamModal({
    open,
    onClose
  }) {
    return /*#__PURE__*/React.createElement(Modal, {
      open: open,
      onClose: onClose,
      title: "Yeni Tak\u0131m Olu\u015Ftur",
      width: 480,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        onClick: onClose
      }, "\u0130ptal"), /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        size: "sm",
        onClick: onClose
      }, "Tak\u0131m\u0131 Olu\u015Ftur"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Tak\u0131m Ad\u0131",
      required: true
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "\xF6rn. U-14"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "K\u0131sa Kod"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "U14"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Antren\xF6r"
    }, /*#__PURE__*/React.createElement(TextInput, {
      placeholder: "Antren\xF6r ad\u0131"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Ya\u015F Kategorisi"
    }, /*#__PURE__*/React.createElement(Select, {
      placeholder: "Se\xE7",
      options: ['Üst yapı', '2008', '2009', '2010', '2011', '2012', '2013']
    })))));
  }
  function TeamsView() {
    const [open, setOpen] = React.useState(null);
    const [newOpen, setNewOpen] = React.useState(false);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Tak\u0131mlar",
      subtitle: `${D.TEAMS.length} aktif takım`,
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        size: "sm",
        leftIcon: ic('plus', 16),
        onClick: () => setNewOpen(true)
      }, "Tak\u0131m Olu\u015Ftur")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 18
      }
    }, D.TEAMS.map(t => /*#__PURE__*/React.createElement(TeamCard, {
      key: t.id,
      team: t,
      onOpen: setOpen
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setNewOpen(true),
      style: {
        cursor: 'pointer',
        font: 'inherit',
        minHeight: 150,
        border: '1.5px dashed var(--ink-300)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--ink-50)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: 'var(--ink-500)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'var(--navy-50)',
        color: 'var(--navy-600)',
        display: 'grid',
        placeItems: 'center'
      }
    }, ic('plus', 22)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14
      }
    }, "Yeni Tak\u0131m"))), open && /*#__PURE__*/React.createElement(TeamDrawer, {
      team: open,
      onClose: () => setOpen(null)
    }), /*#__PURE__*/React.createElement(NewTeamModal, {
      open: newOpen,
      onClose: () => setNewOpen(false)
    }));
  }
  window.TeamsView = TeamsView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/TeamsView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/TrainingView.jsx
try { (() => {
// Buca Yıldız Admin — Antrenman atama
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const {
    Badge,
    Button,
    Select,
    Avatar,
    Switch,
    IconButton
  } = NS;
  const {
    ViewHeader,
    Panel,
    Field,
    TextInput,
    TextArea,
    ic
  } = window.AdminUI;
  const D = window.AdminData;
  const TYPES = [{
    id: 'saha',
    label: 'Saha Antrenmanı',
    color: 'var(--navy-600)'
  }, {
    id: 'kondisyon',
    label: 'Kondisyon',
    color: 'var(--gold-600)'
  }, {
    id: 'taktik',
    label: 'Taktik',
    color: 'var(--green-600)'
  }, {
    id: 'bireysel',
    label: 'Bireysel',
    color: 'var(--navy-400)'
  }, {
    id: 'mac',
    label: 'Maç',
    color: 'var(--red-600)'
  }];
  const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // sample weekly plan per day -> list of sessions
  const PLAN = {
    Pzt: [{
      t: '17:00',
      type: 'saha',
      dur: 90
    }, {
      t: '18:30',
      type: 'kondisyon',
      dur: 45
    }],
    Sal: [{
      t: '17:30',
      type: 'taktik',
      dur: 75
    }],
    Çar: [{
      t: '17:00',
      type: 'saha',
      dur: 90
    }],
    Per: [{
      t: '17:30',
      type: 'kondisyon',
      dur: 60
    }],
    Cum: [{
      t: '17:00',
      type: 'saha',
      dur: 90
    }, {
      t: '18:30',
      type: 'taktik',
      dur: 45
    }],
    Cmt: [{
      t: '11:00',
      type: 'mac',
      dur: 90
    }],
    Paz: []
  };
  function TypePill({
    type
  }) {
    const t = TYPES.find(x => x.id === type);
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--ink-700)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 3,
        background: t.color
      }
    }), t.label);
  }
  function TrainingView() {
    const [team, setTeam] = React.useState('u17');
    const [type, setType] = React.useState('saha');
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewHeader, {
      title: "Antrenmanlar",
      subtitle: "Tak\u0131m ve sporculara antrenman plan\u0131 ata"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: 18,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Antrenman Ata"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Tak\u0131m",
      required: true
    }, /*#__PURE__*/React.createElement(Select, {
      options: D.TEAMS.map(t => ({
        value: t.id,
        label: t.name
      })),
      defaultValue: "u17",
      onChange: () => {}
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Antrenman T\xFCr\xFC",
      required: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, TYPES.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setType(t.id),
      style: {
        font: 'inherit',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        border: `1.5px solid ${type === t.id ? t.color : 'var(--ink-200)'}`,
        background: type === t.id ? 'var(--navy-50)' : '#fff',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--ink-700)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 3,
        background: t.color
      }
    }), t.label)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Tarih"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "date",
      defaultValue: "2026-06-15"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Saat"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "time",
      defaultValue: "17:00"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Field, {
      label: "S\xFCre",
      hint: "dakika"
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "number",
      defaultValue: "90"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Saha"
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Saha 1', 'Saha 2', 'Kapalı Salon', 'Kondisyon']
    }))), /*#__PURE__*/React.createElement(Field, {
      label: "Not / \u0130\xE7erik"
    }, /*#__PURE__*/React.createElement(TextArea, {
      rows: 3,
      placeholder: "\xF6rn. Pas kal\u0131plar\u0131 + duran top \xE7al\u0131\u015Fmas\u0131"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--ink-600)'
      }
    }, "Sporculara bildirim g\xF6nder"), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: true
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      fullWidth: true,
      leftIcon: ic('calendar-plus', 16)
    }, "Antrenman\u0131 Ata"))), /*#__PURE__*/React.createElement(Panel, {
      title: "Haftal\u0131k Plan \u2014 U-17",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "gold"
      }, "15\u201321 Haziran")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 10
      }
    }, DOW.map(d => /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        minHeight: 150,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 10px',
        background: 'var(--ink-50)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        color: 'var(--ink-500)',
        textAlign: 'center'
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 7,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1
      }
    }, PLAN[d].length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        margin: 'auto',
        fontSize: 11,
        color: 'var(--ink-300)'
      }
    }, "\u0130zin"), PLAN[d].map((s, i) => {
      const t = TYPES.find(x => x.id === s.type);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          padding: '7px 8px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface-card)',
          borderLeft: `3px solid ${t.color}`,
          boxShadow: 'var(--shadow-xs)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-stat)',
          fontWeight: 700,
          fontSize: 12,
          color: 'var(--ink-700)'
        }
      }, s.t), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--ink-800)',
          lineHeight: 1.15
        }
      }, t.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          color: 'var(--ink-400)'
        }
      }, s.dur, " dk"));
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        marginTop: 14
      }
    }, TYPES.map(t => /*#__PURE__*/React.createElement(TypePill, {
      key: t.id,
      type: t.id
    }))))));
  }
  window.TrainingView = TrainingView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/TrainingView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/panel/AthleteCard.jsx
try { (() => {
// Buca Yıldız — Sporcu Bilgileri Kartı (section 1)
const {
  Badge,
  Button
} = window.BucaYLdZTasarMSistemi_45a34f;
const AI = (n, sz = 16) => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: sz,
    height: sz
  }
});
function Metric({
  label,
  value,
  unit
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: '14px 18px',
      background: 'var(--surface-subtle)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      minWidth: 96
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-500)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 24,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 600,
      fontSize: 13,
      color: 'var(--ink-400)'
    }
  }, unit)));
}
function AthleteCard() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)',
      margin: 0
    }
  }, "Sporcu Bilgileri")), /*#__PURE__*/React.createElement("div", {
    className: "pl-athlete",
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      display: 'flex',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-athlete-photo",
    style: {
      width: 188,
      flex: 'none',
      position: 'relative',
      background: 'var(--grad-navy)',
      display: 'grid',
      placeItems: 'center',
      minHeight: 160
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'rgba(255,255,255,.18)'
    }
  }, AI('user-round', 64)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-bottom)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 42,
      color: 'var(--gold-400)',
      lineHeight: 1
    }
  }, "10")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 34,
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      margin: 0,
      lineHeight: 1
    }
  }, "Arda Y\u0131lmaz"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "navy"
  }, "U-17"), /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, "Ofansif Orta Saha"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "2009 do\u011Fumlu"))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    leftIcon: AI('pencil', 15)
  }, "Profili D\xFCzenle")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Boy",
    value: "178",
    unit: "cm"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Kilo",
    value: "68",
    unit: "kg"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Ayak",
    value: "Sa\u011F"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "VK\u0130",
    value: "21.5"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Lisans",
    value: "34721"
  })))));
}
window.AthleteCard = AthleteCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/panel/AthleteCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/panel/PanelShell.jsx
try { (() => {
// Buca Yıldız — Sporcu Paneli shell: navy sidebar + top header
const {
  IconButton,
  Badge
} = window.BucaYLdZTasarMSistemi_45a34f;
const PLOGO = '../../assets/logo-emblem.png';
const PI = (n, sz = 18) => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: sz,
    height: sz
  }
});
const NAV = [{
  ic: 'layout-dashboard',
  label: 'Genel Bakış',
  active: true
}, {
  ic: 'calendar-days',
  label: 'Antrenmanlar'
}, {
  ic: 'activity',
  label: 'Performans'
}, {
  ic: 'swords',
  label: 'Maçlar'
}, {
  ic: 'credit-card',
  label: 'Ödemeler'
}, {
  ic: 'user-round',
  label: 'Profil'
}];
function Sidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 252,
      flex: 'none',
      background: 'var(--navy-950)',
      borderRight: '1px solid rgba(255,255,255,.07)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderBottom: '1px solid rgba(255,255,255,.07)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PLOGO,
    alt: "",
    style: {
      width: 40,
      height: 40,
      objectFit: 'contain'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 17,
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, "Buca Y\u0131ld\u0131z"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)',
      marginTop: 3,
      fontWeight: 600
    }
  }, "Sporcu Paneli"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flex: 1
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.label,
    href: "#",
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 14px',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      fontFamily: 'var(--font-body)',
      fontWeight: n.active ? 600 : 500,
      fontSize: 14.5,
      color: n.active ? '#fff' : 'var(--navy-200)',
      background: n.active ? 'rgba(255,255,255,.07)' : 'transparent'
    },
    onMouseEnter: e => {
      if (!n.active) e.currentTarget.style.background = 'rgba(255,255,255,.04)';
    },
    onMouseLeave: e => {
      if (!n.active) e.currentTarget.style.background = 'transparent';
    }
  }, n.active && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 8,
      bottom: 8,
      width: 3,
      background: 'var(--grad-gold)',
      borderRadius: '0 2px 2px 0'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: n.active ? 'var(--gold-400)' : 'var(--navy-300)',
      display: 'inline-flex'
    }
  }, PI(n.ic, 18)), n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      borderTop: '1px solid rgba(255,255,255,.07)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../website/panel-giris.html",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 14px',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 14.5,
      color: 'var(--navy-200)'
    }
  }, PI('log-out', 18), " \xC7\u0131k\u0131\u015F Yap")));
}
function PanelHeader({
  title,
  subtitle
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(255,255,255,.88)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 26,
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      margin: 0,
      lineHeight: 1
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-500)',
      marginTop: 4
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Bildirimler",
    variant: "outline"
  }, PI('bell', 18)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 30,
      background: 'var(--ink-200)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--grad-navy)',
      display: 'grid',
      placeItems: 'center',
      color: '#fff',
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 16
    }
  }, "AY"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-strong)'
    }
  }, "Arda Y\u0131lmaz"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-400)'
    }
  }, "U-17 \xB7 10 Numara"))))));
}
function PanelShell({
  title,
  subtitle,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(PanelHeader, {
    title: title,
    subtitle: subtitle
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: '28px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 1240,
      width: '100%'
    }
  }, children)));
}
window.PanelShell = PanelShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/panel/PanelShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/panel/PerformanceMatrix.jsx
try { (() => {
// Buca Yıldız — Sporcu Performans Matrisi (section 3)
const {
  StatTile,
  ProgressRing,
  MetricBar,
  Badge
} = window.BucaYLdZTasarMSistemi_45a34f;
const MI = (n, sz = 16) => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: sz,
    height: sz
  }
});
function SectionTitle({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)',
      margin: 0
    }
  }, children));
}
function CardHead({
  icon,
  title,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--navy-50)',
      color: 'var(--navy-600)',
      display: 'grid',
      placeItems: 'center'
    }
  }, MI(icon, 16)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 18,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title)), right);
}
const cardStyle = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  padding: 22,
  display: 'flex',
  flexDirection: 'column'
};

// ---- VO2 Max trend sparkline ----
function Sparkline({
  data,
  w = 340,
  h = 96
}) {
  const min = Math.min(...data) - 1,
    max = Math.max(...data) + 1;
  const px = i => i / (data.length - 1) * (w - 8) + 4;
  const py = v => h - 8 - (v - min) / (max - min) * (h - 20);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L${px(data.length - 1).toFixed(1)} ${h} L${px(0).toFixed(1)} ${h} Z`;
  const lastX = px(data.length - 1),
    lastY = py(data[data.length - 1]);
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "vo2grad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--gold-400)",
    stopOpacity: "0.30"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--gold-400)",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#vo2grad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: "var(--gold-600)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: lastX,
    cy: lastY,
    r: "4.5",
    fill: "var(--gold-600)",
    stroke: "#fff",
    strokeWidth: "2"
  }));
}

// ---- Atletik profil radar (hexagon) ----
function Radar({
  axes,
  size = 220
}) {
  const cx = size / 2,
    cy = size / 2,
    R = size / 2 - 28;
  const n = axes.length;
  const pt = (i, r) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const ring = frac => axes.map((_, i) => pt(i, R * frac).join(',')).join(' ');
  const shape = axes.map((ax, i) => pt(i, R * (ax.value / 100)).join(',')).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      display: 'block',
      margin: '0 auto'
    }
  }, [0.33, 0.66, 1].map(f => /*#__PURE__*/React.createElement("polygon", {
    key: f,
    points: ring(f),
    fill: "none",
    stroke: "var(--ink-200)",
    strokeWidth: "1"
  })), axes.map((_, i) => {
    const [x, y] = pt(i, R);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "var(--ink-200)",
      strokeWidth: "1"
    });
  }), /*#__PURE__*/React.createElement("polygon", {
    points: shape,
    fill: "rgba(21,41,90,0.16)",
    stroke: "var(--navy-700)",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), axes.map((ax, i) => {
    const [x, y] = pt(i, R * (ax.value / 100));
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x,
      cy: y,
      r: "3.5",
      fill: "var(--gold-500)",
      stroke: "#fff",
      strokeWidth: "1.5"
    });
  }), axes.map((ax, i) => {
    const [x, y] = pt(i, R + 16);
    return /*#__PURE__*/React.createElement("text", {
      key: i,
      x: x,
      y: y,
      textAnchor: "middle",
      dominantBaseline: "middle",
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 600,
        fill: 'var(--ink-500)'
      }
    }, ax.label);
  }));
}
const VO2_HISTORY = [51.2, 52.8, 53.4, 54.1, 55.0, 56.4];
const RADAR = [{
  label: 'Sürat',
  value: 78
}, {
  label: 'Dayanıklılık',
  value: 85
}, {
  label: 'Güç',
  value: 70
}, {
  label: 'Teknik',
  value: 88
}, {
  label: 'Taktik',
  value: 82
}, {
  label: 'Pas',
  value: 90
}];
function PerformanceMatrix() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionTitle, null, "Sporcu Performans Matrisi"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr 1.25fr',
      gap: 18,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cardStyle
  }, /*#__PURE__*/React.createElement(CardHead, {
    icon: "heart-pulse",
    title: "VO2 Max",
    right: /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, "M\xFCkemmel")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 46,
      lineHeight: 1,
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "56.4"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--ink-400)'
    }
  }, "ml/kg/dk"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 12.5,
      fontWeight: 700,
      color: 'var(--green-600)',
      background: 'var(--green-100)',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)'
    }
  }, "\u25B2 3.1%")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '14px 0 6px'
    }
  }, /*#__PURE__*/React.createElement(Sparkline, {
    data: VO2_HISTORY
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11.5,
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Oca"), /*#__PURE__*/React.createElement("span", null, "\u015Eub"), /*#__PURE__*/React.createElement("span", null, "Mar"), /*#__PURE__*/React.createElement("span", null, "Nis"), /*#__PURE__*/React.createElement("span", null, "May"), /*#__PURE__*/React.createElement("span", null, "Haz")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(MetricBar, {
    label: "Ya\u015F grubu y\xFCzdelik dilim",
    value: 92,
    display: "92.",
    color: "var(--navy-700)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: cardStyle
  }, /*#__PURE__*/React.createElement(CardHead, {
    icon: "scale",
    title: "V\xFCcut Kompozisyonu"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      gap: 12,
      flex: 1,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ProgressRing, {
    value: 11.2,
    max: 30,
    display: "11.2%",
    sublabel: "ya\u011F",
    label: "V\xFCcut Ya\u011F",
    color: "var(--gold-600)",
    size: 118,
    stroke: 11
  }), /*#__PURE__*/React.createElement(ProgressRing, {
    value: 42.5,
    max: 60,
    display: "42.5%",
    sublabel: "kas",
    label: "Kas Oran\u0131",
    color: "var(--navy-600)",
    size: 118,
    stroke: 11
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12.5,
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Son \xF6l\xE7\xFCm: 8 Haz 2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--green-600)',
      fontWeight: 600
    }
  }, "Hedef aral\u0131\u011F\u0131nda"))), /*#__PURE__*/React.createElement("div", {
    style: cardStyle
  }, /*#__PURE__*/React.createElement(CardHead, {
    icon: "radar",
    title: "Atletik Profil",
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--ink-400)'
      }
    }, "0\u2013100")
  }), /*#__PURE__*/React.createElement(Radar, {
    axes: RADAR
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Sprint 30m",
    value: "4.18",
    unit: "sn",
    delta: "0.06",
    deltaTone: "down",
    sub: "daha h\u0131zl\u0131",
    accent: true
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Dikey S\u0131\xE7rama",
    value: "58",
    unit: "cm",
    delta: "2",
    deltaTone: "up",
    sub: "cm"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Maks. Nab\u0131z",
    value: "196",
    unit: "bpm",
    delta: "0",
    deltaTone: "neutral",
    sub: "stabil"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Antrenman Y\xFCk\xFC",
    value: "412",
    unit: "AU",
    delta: "8%",
    deltaTone: "up",
    sub: "bu hafta"
  })));
}
window.PerformanceMatrix = PerformanceMatrix;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/panel/PerformanceMatrix.jsx", error: String((e && e.message) || e) }); }

// ui_kits/panel/TrainingCalendar.jsx
try { (() => {
// Buca Yıldız — Program Takvimi (section 2): interactive weekly ⇄ monthly calendar
const {
  Badge,
  IconButton
} = window.BucaYLdZTasarMSistemi_45a34f;
const CI = (n, sz = 16) => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: sz,
    height: sz
  }
});
const TODAY = new Date(2026, 5, 12); // 12 Haziran 2026
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const TYPES = {
  saha: {
    label: 'Saha Antrenmanı',
    color: 'var(--navy-600)',
    soft: 'var(--navy-50)'
  },
  kondisyon: {
    label: 'Kondisyon',
    color: 'var(--gold-600)',
    soft: 'var(--gold-100)'
  },
  taktik: {
    label: 'Taktik',
    color: 'var(--green-600)',
    soft: 'var(--green-100)'
  },
  mac: {
    label: 'Maç',
    color: 'var(--red-600)',
    soft: 'var(--red-100)'
  },
  bireysel: {
    label: 'Bireysel',
    color: 'var(--navy-400)',
    soft: 'var(--ink-100)'
  },
  izin: {
    label: 'İzin',
    color: 'var(--ink-300)',
    soft: 'var(--ink-50)'
  }
};

// Deterministic weekly training pattern → any date gets a program
function eventsFor(date) {
  const d = date.getDay(); // 0 Sun .. 6 Sat
  const P = {
    1: [['17:00', 'saha'], ['18:30', 'kondisyon']],
    2: [['17:30', 'taktik']],
    3: [['17:00', 'saha'], ['19:00', 'bireysel']],
    4: [['17:30', 'kondisyon']],
    5: [['17:00', 'saha'], ['18:30', 'taktik']],
    6: [['11:00', 'mac']],
    0: [['—', 'izin']]
  }[d] || [];
  return P.map(([time, type]) => ({
    time,
    type
  }));
}
const startOfWeek = d => {
  const x = new Date(d);
  const wd = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - wd);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const addMonths = (d, n) => {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n, 1);
  return x;
};
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
function EventChip({
  ev,
  compact
}) {
  const t = TYPES[ev.type];
  if (compact) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: 'var(--ink-700)',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 2,
        background: t.color,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--ink-400)'
      }
    }, ev.time), /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, t.label));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '8px 10px',
      borderRadius: 'var(--radius-sm)',
      background: t.soft,
      borderLeft: `3px solid ${t.color}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 12.5,
      color: 'var(--ink-700)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, ev.time), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--ink-800)',
      lineHeight: 1.15
    }
  }, t.label));
}
function WeekView({
  anchor
}) {
  const mon = startOfWeek(anchor);
  const days = Array.from({
    length: 7
  }, (_, i) => addDays(mon, i));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 10
    }
  }, days.map((day, i) => {
    const today = sameDay(day, TODAY);
    const evs = eventsFor(day);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: today ? 'var(--navy-50)' : 'var(--surface-card)',
        border: `1px solid ${today ? 'var(--navy-300)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        minHeight: 188,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 10px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: today ? 'var(--navy-700)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        color: today ? '#fff' : 'var(--ink-400)'
      }
    }, DOW[i]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-stat)',
        fontWeight: 700,
        fontSize: 16,
        color: today ? 'var(--gold-400)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, day.getDate())), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1
      }
    }, evs.map((ev, j) => /*#__PURE__*/React.createElement(EventChip, {
      key: j,
      ev: ev
    }))));
  }));
}
function MonthView({
  anchor,
  onPickDay
}) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfWeek(first);
  const cells = Array.from({
    length: 42
  }, (_, i) => addDays(gridStart, i));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 6,
      marginBottom: 6
    }
  }, DOW.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      textAlign: 'center',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-400)',
      padding: '2px 0'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridAutoRows: '1fr',
      gap: 6
    }
  }, cells.map((day, i) => {
    const inMonth = day.getMonth() === anchor.getMonth();
    const today = sameDay(day, TODAY);
    const evs = eventsFor(day);
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => onPickDay(day),
      style: {
        textAlign: 'left',
        cursor: 'pointer',
        font: 'inherit',
        background: today ? 'var(--navy-50)' : 'var(--surface-card)',
        border: `1px solid ${today ? 'var(--navy-300)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '7px 8px',
        minHeight: 92,
        opacity: inMonth ? 1 : 0.42,
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-stat)',
        fontWeight: 700,
        fontSize: 14,
        color: today ? 'var(--navy-700)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
        alignSelf: today ? 'flex-start' : 'auto',
        background: today ? 'var(--gold-300)' : 'transparent',
        borderRadius: 3,
        padding: today ? '0 5px' : 0
      }
    }, day.getDate()), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflow: 'hidden'
      }
    }, evs.slice(0, 2).map((ev, j) => /*#__PURE__*/React.createElement(EventChip, {
      key: j,
      ev: ev,
      compact: true
    })), evs.length > 2 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        color: 'var(--ink-400)',
        fontWeight: 600
      }
    }, "+", evs.length - 2, " daha")));
  })));
}
function Legend() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      marginTop: 14
    }
  }, Object.entries(TYPES).map(([k, t]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: t.color
    }
  }), t.label)));
}
function TrainingCalendar() {
  const [view, setView] = React.useState('week');
  const [anchor, setAnchor] = React.useState(new Date(TODAY));
  const go = dir => setAnchor(a => view === 'week' ? addDays(a, dir * 7) : addMonths(a, dir));
  const mon = startOfWeek(anchor);
  const title = view === 'week' ? `${mon.getDate()} – ${addDays(mon, 6).getDate()} ${MONTHS[addDays(mon, 6).getMonth()]} ${anchor.getFullYear()}` : `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  const Seg = ({
    id,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => setView(id),
    style: {
      font: 'inherit',
      cursor: 'pointer',
      padding: '7px 16px',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '.02em',
      background: view === id ? 'var(--navy-700)' : 'transparent',
      color: view === id ? '#fff' : 'var(--ink-500)'
    }
  }, label);
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)',
      margin: 0
    }
  }, "Program Takvimi")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "\xD6nceki",
    variant: "outline",
    size: "sm",
    onClick: () => go(-1)
  }, CI('chevron-left', 16)), /*#__PURE__*/React.createElement(IconButton, {
    label: "Sonraki",
    variant: "outline",
    size: "sm",
    onClick: () => go(1)
  }, CI('chevron-right', 16)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 21,
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 3,
      background: 'var(--ink-100)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Seg, {
    id: "week",
    label: "Hafta"
  }), /*#__PURE__*/React.createElement(Seg, {
    id: "month",
    label: "Ay"
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: view === 'week' ? 'Aylık görünüme büyüt' : 'Haftalık görünüme küçült',
    variant: "outline",
    size: "sm",
    onClick: () => setView(v => v === 'week' ? 'month' : 'week')
  }, CI(view === 'week' ? 'maximize-2' : 'minimize-2', 16)))), view === 'week' ? /*#__PURE__*/React.createElement(WeekView, {
    anchor: anchor
  }) : /*#__PURE__*/React.createElement(MonthView, {
    anchor: anchor,
    onPickDay: d => {
      setAnchor(d);
      setView('week');
    }
  }), /*#__PURE__*/React.createElement(Legend, null)));
}
window.TrainingCalendar = TrainingCalendar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/panel/TrainingCalendar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/AgeGroupsSection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Buca Yıldız — Yaş grupları section
const {
  SectionHeading,
  AgeGroupCard,
  Button
} = window.BucaYLdZTasarMSistemi_45a34f;
const GROUPS = [{
  label: 'A Takım',
  title: 'Üst yapı kadrosu',
  count: 26
}, {
  label: 'U-18',
  title: '2008 doğumlular',
  count: 23
}, {
  label: 'U-17',
  title: '2009 doğumlular',
  count: 24
}, {
  label: 'U-16',
  title: '2010 doğumlular',
  count: 25
}, {
  label: 'U-15',
  title: '2011 doğumlular',
  count: 28
}];
function AgeGroupsSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '88px 32px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Akademi",
    title: "Ya\u015F Gruplar\u0131",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "T\xFCm Tak\u0131mlar"),
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hp-grid-ages",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 18
    }
  }, GROUPS.map(g => /*#__PURE__*/React.createElement(AgeGroupCard, _extends({
    key: g.label
  }, g))))));
}
window.AgeGroupsSection = AgeGroupsSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AgeGroupsSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/FixtureSection.jsx
try { (() => {
// Buca Yıldız — Güncel fikstür section (navy band)
const {
  SectionHeading,
  FixtureCard,
  Button,
  Badge
} = window.BucaYLdZTasarMSistemi_45a34f;
const CREST = '../../assets/logo-emblem.png';
function FixtureSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--grad-navy-deep)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -80,
      top: -60,
      fontSize: 420,
      lineHeight: 1,
      color: 'rgba(201,162,39,0.04)',
      pointerEvents: 'none'
    }
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '88px 32px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Fikst\xFCr",
    title: "G\xFCncel Ma\xE7 Program\u0131",
    onDark: true,
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "on-navy",
      size: "sm"
    }, "T\xFCm Fikst\xFCr"),
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hp-grid-2",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 'var(--radius-xl)',
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, "S\u0131radaki Ma\xE7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--navy-200)',
      fontWeight: 500
    }
  }, "U-17 Geli\u015Fim Ligi \xB7 22. Hafta")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: CREST,
    alt: "",
    style: {
      width: 84,
      height: 84,
      objectFit: 'contain'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 22,
      textTransform: 'uppercase',
      color: '#fff',
      textAlign: 'center',
      lineHeight: 1
    }
  }, "Buca Y\u0131ld\u0131z")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 44,
      color: 'var(--gold-400)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "19:00"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--navy-200)'
    }
  }, "14 Haziran Cmt")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(255,255,255,0.06)',
      border: '1.5px solid rgba(255,255,255,0.18)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 30,
      color: '#fff'
    }
  }, "KS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 22,
      textTransform: 'uppercase',
      color: '#fff',
      textAlign: 'center',
      lineHeight: 1
    }
  }, "Kar\u015F\u0131yaka SK"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid rgba(255,255,255,0.10)',
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--navy-100)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin",
    style: {
      width: 15,
      height: 15
    }
  }), " Buca Y\u0131ld\u0131z Tesisleri \xB7 Saha 1"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm"
  }, "Ma\xE7 Detay\u0131"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FixtureCard, {
    competition: "U-15 B\xF6lgesel",
    status: "finished",
    venue: "Sonu\xE7 \xB7 \u0130skenderun Stad\u0131",
    home: {
      name: 'Buca Yıldız',
      crest: CREST,
      score: 3
    },
    away: {
      name: 'Altay',
      score: 1
    }
  }), /*#__PURE__*/React.createElement(FixtureCard, {
    competition: "U-18 Geli\u015Fim",
    date: "21 Haz \xB7 17:30",
    status: "upcoming",
    venue: "Deplasman \xB7 Bornova",
    home: {
      name: 'Göztepe'
    },
    away: {
      name: 'Buca Yıldız',
      crest: CREST,
      time: '17:30'
    }
  })))));
}
window.FixtureSection = FixtureSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/FixtureSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/JerseySection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Buca Yıldız — Formalar (jerseys) horizontal sliding showcase, transparent kits
const {
  SectionHeading
} = window.BucaYLdZTasarMSistemi_45a34f;
const JERSEY_CLIP = 'polygon(30% 0,42% 8%,58% 8%,70% 0,100% 14%,87% 39%,78% 30%,78% 100%,22% 100%,22% 30%,13% 39%,0 14%)';
const KITS = [{
  no: '10',
  name: 'Yılmaz',
  kind: 'home'
}, {
  no: '7',
  name: 'Demir',
  kind: 'away'
}, {
  no: '9',
  name: 'Kaya',
  kind: 'third'
}, {
  no: '4',
  name: 'Şahin',
  kind: 'home'
}, {
  no: '11',
  name: 'Aydın',
  kind: 'away'
}, {
  no: '1',
  name: 'Çelik',
  kind: 'gk'
}];
const STYLES = {
  home: {
    body: 'linear-gradient(160deg,#1D3568,#0E2148)',
    num: '#DDBA4E',
    trim: '#C9A227',
    label: 'İç Saha'
  },
  away: {
    body: 'linear-gradient(160deg,#FFFFFF,#E8ECF3)',
    num: '#15295A',
    trim: '#15295A',
    label: 'Deplasman'
  },
  third: {
    body: 'linear-gradient(160deg,#E9CE79,#C9A227)',
    num: '#0E2148',
    trim: '#0E2148',
    label: 'Üçüncü'
  },
  gk: {
    body: 'linear-gradient(160deg,#1E7D4F,#14543a)',
    num: '#F8EFD2',
    trim: '#F8EFD2',
    label: 'Kaleci'
  }
};
function Jersey({
  no,
  name,
  kind
}) {
  const s = STYLES[kind];
  return /*#__PURE__*/React.createElement("div", {
    className: "by-jersey"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 180,
      height: 210,
      filter: 'drop-shadow(0 22px 30px rgba(0,0,0,.35))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: JERSEY_CLIP,
      background: s.body
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '7%',
      left: '42%',
      width: '16%',
      height: '5%',
      background: s.trim,
      borderRadius: '0 0 40% 40%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '34%',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: 'var(--font-stat)',
      fontWeight: 700,
      fontSize: 64,
      color: s.num,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, no), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '20%',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: s.num,
      opacity: .85
    }
  }, name)), /*#__PURE__*/React.createElement("span", {
    className: "by-jersey-label"
  }, s.label));
}
function JerseySection() {
  const loop = [...KITS, ...KITS];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--grad-navy)',
      borderTop: '1px solid var(--navy-600)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '72px 32px 24px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Ma\u011Faza",
    title: "2025/26 Formalar\u0131m\u0131z",
    onDark: true,
    style: {
      marginBottom: 8,
      color: 'rgb(255, 255, 255)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "by-marquee"
  }, /*#__PURE__*/React.createElement("div", {
    className: "by-marquee-track"
  }, loop.map((k, i) => /*#__PURE__*/React.createElement(Jersey, _extends({
    key: i
  }, k))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--navy-200)',
      letterSpacing: '.04em'
    }
  }, "Resmi formalar yak\u0131nda kul\xFCp ma\u011Fazas\u0131nda \xB7 \xDCzerine gelin, kayma durur")));
}
window.JerseySection = JerseySection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/JerseySection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/MediaSection.jsx
try { (() => {
// Buca Yıldız — Medya (görseller & videolar) section
const {
  SectionHeading,
  Button,
  Badge
} = window.BucaYLdZTasarMSistemi_45a34f;
function PhotoTile({
  label,
  tall
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      position: 'relative',
      display: 'block',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--grad-navy)',
      border: '1px solid var(--navy-700)',
      minHeight: tall ? 0 : 130,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image",
    style: {
      width: 30,
      height: 30
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-bottom)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      bottom: 10,
      fontSize: 12,
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '.02em'
    }
  }, label));
}
function MediaSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '88px 32px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Medya",
    title: "G\xF6rseller & Videolar",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Galeriye Git"),
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hp-grid-2",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      position: 'relative',
      display: 'block',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 360,
      background: 'var(--grad-navy)',
      border: '1px solid var(--navy-700)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 76,
      height: 76,
      borderRadius: '50%',
      background: 'var(--grad-gold)',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "play",
    style: {
      width: 30,
      height: 30,
      color: 'var(--navy-900)',
      fill: 'var(--navy-900)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-bottom)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 28,
      bottom: 24,
      right: 28
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    dot: true
  }, "\xD6ne \xC7\u0131kan"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 28,
      textTransform: 'uppercase',
      color: '#fff',
      margin: '12px 0 0',
      lineHeight: 1
    }
  }, "Sezon 2025/26 \u2014 Akademi \xD6zeti"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--navy-100)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "clock",
    style: {
      width: 14,
      height: 14
    }
  }), " 4:12"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(PhotoTile, {
    label: "Antrenman",
    tall: true
  }), /*#__PURE__*/React.createElement(PhotoTile, {
    label: "Ma\xE7 G\xFCn\xFC",
    tall: true
  }), /*#__PURE__*/React.createElement(PhotoTile, {
    label: "\xD6d\xFCl T\xF6reni",
    tall: true
  }), /*#__PURE__*/React.createElement(PhotoTile, {
    label: "Tesisler",
    tall: true
  })))));
}
window.MediaSection = MediaSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/MediaSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/NewsSection.jsx
try { (() => {
// Buca Yıldız — Haberler (news) section
const {
  SectionHeading,
  NewsCard,
  Button,
  Badge
} = window.BucaYLdZTasarMSistemi_45a34f;
const FEATURE = {
  category: 'Manşet',
  date: '11 Haziran 2026',
  title: 'A Takımımız sezonu kupayla taçlandırdı',
  excerpt: 'Final karşılaşmasında sahadan 2-0 galip ayrılan A Takımımız, bölgesel ligi namağlup şampiyon olarak tamamladı. Teknik ekibimiz ve sporcularımızı tebrik ederiz.'
};
const ITEMS = [{
  category: 'Altyapı',
  date: '10 Haziran 2026',
  title: 'U-17 takımımız grubunu lider tamamladı',
  excerpt: 'Sezonun son maçında alınan galibiyetle play-off biletini erken aldık.'
}, {
  category: 'Tesis',
  date: '6 Haziran 2026',
  title: 'Yeni antrenman sahamız hizmete girdi',
  excerpt: 'Hibrit çim yüzeyli yeni sahamız tüm yaş gruplarımızın hizmetinde.'
}, {
  category: 'Etkinlik',
  date: '2 Haziran 2026',
  title: 'Yaz okulu kayıtları başladı',
  excerpt: '7-14 yaş arası tüm çocuklarımızı ücretsiz tanışma antrenmanına bekliyoruz.'
}];
function NewsSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '88px 32px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Kul\xFCpten",
    title: "Son Haberler",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "T\xFCm Haberler"),
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hp-grid-2",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      position: 'relative',
      display: 'block',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 420,
      background: 'var(--grad-navy)',
      border: '1px solid var(--navy-700)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(201,162,39,0.08)',
      fontFamily: 'var(--font-heading)',
      fontSize: 200
    }
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-navy)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, FEATURE.category), /*#__PURE__*/React.createElement(Badge, {
    tone: "on-navy"
  }, FEATURE.date)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 36,
      lineHeight: 1,
      textTransform: 'uppercase',
      color: '#fff',
      margin: 0,
      maxWidth: 540
    }
  }, FEATURE.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.6,
      color: 'var(--navy-100)',
      margin: 0,
      maxWidth: 520
    }
  }, FEATURE.excerpt))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: 16
    }
  }, ITEMS.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 14,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--grad-navy)',
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255,255,255,0.10)',
      fontFamily: 'var(--font-heading)',
      fontSize: 44
    }
  }, "BY"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 14px 14px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--gold-700)'
    }
  }, it.category, " \xB7 ", it.date), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 1.1,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, it.title))))))));
}
window.NewsSection = NewsSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/NewsSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
// Buca Yıldız — Footer with crest overhanging the top edge
const {
  IconButton,
  Button,
  Input
} = window.BucaYLdZTasarMSistemi_45a34f;
const FLOGO = '../../assets/logo-emblem.png';
const FICON = n => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: 17,
    height: 17
  }
});
const F_BRAND = {
  instagram: 'M12 2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5-.7.2-1.3.6-1.8 1.1S2.8 4.8 2.6 5.5c-.3.6-.4 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.8.5 2.4.2.7.6 1.3 1.1 1.8s1.1.9 1.8 1.1c.6.3 1.4.4 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.1c1 0 1.8-.2 2.4-.5.7-.2 1.3-.6 1.8-1.1s.9-1.1 1.1-1.8c.3-.6.4-1.4.5-2.4 0-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4-.2-.7-.6-1.3-1.1-1.8s-1.1-.9-1.8-1.1c-.6-.3-1.4-.4-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z',
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z',
  youtube: 'M23 8.2a3 3 0 0 0-2.1-2.1C19 5.5 12 5.5 12 5.5s-7 0-8.9.6A3 3 0 0 0 1 8.2 31 31 0 0 0 .7 12 31 31 0 0 0 1 15.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z',
  x: 'M17.5 3h3.1l-6.7 7.7L21.7 21h-6.1l-4.8-6.3L5.3 21H2.2l7.2-8.2L2 3h6.3l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7.4 4.7H5.6l10.8 14.5z'
};
const FGlyph = k => React.createElement('svg', {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true
}, React.createElement('path', {
  d: F_BRAND[k]
}));
function Col({
  title,
  links
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)',
      margin: 0
    }
  }, title), links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: 14,
      color: 'var(--navy-100)',
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#fff',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--navy-100)'
  }, l)));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      position: 'relative',
      background: 'var(--navy-950)',
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 92,
      height: 92,
      borderRadius: '50%',
      background: 'var(--navy-950)',
      display: 'grid',
      placeItems: 'center',
      border: '1px solid var(--navy-700)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FLOGO,
    alt: "Buca Y\u0131ld\u0131z",
    style: {
      width: 78,
      height: 78,
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '78px 32px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-grid-footer",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 24,
      textTransform: 'uppercase',
      color: '#fff',
      letterSpacing: '.02em'
    }
  }, "Buca Y\u0131ld\u0131z", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 10.5,
      letterSpacing: '.26em',
      color: 'var(--gold-400)',
      marginTop: 4
    }
  }, "Futbol Akademisi")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.65,
      color: 'var(--navy-200)',
      margin: 0,
      maxWidth: 320
    }
  }, "\u0130zmir Buca'da gelece\u011Fin futbolcular\u0131n\u0131 disiplin, sayg\u0131 ve tak\u0131m ruhuyla yeti\u015Ftiren altyap\u0131 kul\xFCb\xFC."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Instagram",
    variant: "on-navy"
  }, FGlyph('instagram')), /*#__PURE__*/React.createElement(IconButton, {
    label: "Facebook",
    variant: "on-navy"
  }, FGlyph('facebook')), /*#__PURE__*/React.createElement(IconButton, {
    label: "YouTube",
    variant: "on-navy"
  }, FGlyph('youtube')), /*#__PURE__*/React.createElement(IconButton, {
    label: "X",
    variant: "on-navy"
  }, FGlyph('x')))), /*#__PURE__*/React.createElement(Col, {
    title: "Kurumsal",
    links: ['Hakkımızda', 'Antrenörler', 'Tesisler', 'Kariyer']
  }), /*#__PURE__*/React.createElement(Col, {
    title: "Akademi",
    links: ['A Takım', 'U-18', 'U-17', 'Seçmeler']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)',
      margin: 0
    }
  }, "B\xFClten"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--navy-200)',
      margin: 0
    }
  }, "Kul\xFCpten haberler ve ma\xE7 duyurular\u0131 i\xE7in kay\u0131t olun."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "E-posta adresiniz",
    containerStyle: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent"
  }, "Kat\u0131l")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--navy-200)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, FICON('map-pin'), " Buca, \u0130zmir"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, FICON('phone'), " +90 232 000 00 00")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      marginTop: 44,
      paddingTop: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--navy-300)'
    }
  }, "\xA9 2026 Buca Y\u0131ld\u0131z Futbol Akademisi. T\xFCm haklar\u0131 sakl\u0131d\u0131r."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      color: 'var(--navy-300)',
      textDecoration: 'none'
    }
  }, "KVKK"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      color: 'var(--navy-300)',
      textDecoration: 'none'
    }
  }, "Gizlilik"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      color: 'var(--navy-300)',
      textDecoration: 'none'
    }
  }, "\xC7erez Politikas\u0131")))));
}
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteHeader.jsx
try { (() => {
// Buca Yıldız — Site header: logo + social (left), panel/başvuru (right), mega menu (bottom)
// Responsive: collapses to a hamburger drawer under 900px. Optional `backHref` adds an "Ana Sayfa" button.
const {
  Button,
  IconButton
} = window.BucaYLdZTasarMSistemi_45a34f;
const LOGO = '../../assets/logo-emblem.png';
const ICON = (n, sz = 17) => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: sz,
    height: sz
  }
});

// Brand glyphs as inline SVG (Lucide dropped brand icons)
const BRAND = {
  instagram: 'M12 2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5-.7.2-1.3.6-1.8 1.1S2.8 4.8 2.6 5.5c-.3.6-.4 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.8.5 2.4.2.7.6 1.3 1.1 1.8s1.1.9 1.8 1.1c.6.3 1.4.4 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.1c1 0 1.8-.2 2.4-.5.7-.2 1.3-.6 1.8-1.1s.9-1.1 1.1-1.8c.3-.6.4-1.4.5-2.4 0-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4-.2-.7-.6-1.3-1.1-1.8s-1.1-.9-1.8-1.1c-.6-.3-1.4-.4-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z',
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z',
  youtube: 'M23 8.2a3 3 0 0 0-2.1-2.1C19 5.5 12 5.5 12 5.5s-7 0-8.9.6A3 3 0 0 0 1 8.2 31 31 0 0 0 .7 12 31 31 0 0 0 1 15.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z',
  x: 'M17.5 3h3.1l-6.7 7.7L21.7 21h-6.1l-4.8-6.3L5.3 21H2.2l7.2-8.2L2 3h6.3l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7.4 4.7H5.6l10.8 14.5z'
};
const Glyph = k => React.createElement('svg', {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true
}, React.createElement('path', {
  d: BRAND[k]
}));
const MENU = [{
  label: 'Kurumsal',
  items: ['Hakkımızda', 'Yönetim', 'Tesisler', 'Vizyon & Misyon']
}, {
  label: 'Takımlar',
  items: ['A Takım', 'U-18', 'U-17', 'U-16', 'U-15']
}, {
  label: 'Altyapı',
  items: ['Antrenörler', 'Gelişim Programı', 'Seçmeler', 'Yaz Okulu']
}, {
  label: 'Haberler',
  items: []
}, {
  label: 'Fikstür',
  items: ['Maç Programı', 'Puan Durumu', 'Sonuçlar']
}, {
  label: 'Medya',
  items: ['Fotoğraflar', 'Videolar', 'Basında Biz']
}, {
  label: 'İletişim',
  items: []
}];
function Brand({
  homeHref,
  compact
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: homeHref,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 11 : 13,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "Buca Y\u0131ld\u0131z",
    style: {
      width: compact ? 42 : 50,
      height: compact ? 42 : 50,
      objectFit: 'contain'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: compact ? 20 : 23,
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '.02em'
    }
  }, "Buca Y\u0131ld\u0131z"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: compact ? 9.5 : 10.5,
      letterSpacing: '.24em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)',
      marginTop: 3
    }
  }, "Futbol Akademisi")));
}
function Social({
  size = 'sm'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Instagram",
    variant: "on-navy",
    size: size
  }, Glyph('instagram')), /*#__PURE__*/React.createElement(IconButton, {
    label: "Facebook",
    variant: "on-navy",
    size: size
  }, Glyph('facebook')), /*#__PURE__*/React.createElement(IconButton, {
    label: "YouTube",
    variant: "on-navy",
    size: size
  }, Glyph('youtube')), /*#__PURE__*/React.createElement(IconButton, {
    label: "X",
    variant: "on-navy",
    size: size
  }, Glyph('x')));
}
function SiteHeader({
  onApply,
  onLogin,
  active = 'Haberler',
  backHref
}) {
  const [open, setOpen] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [acc, setAcc] = React.useState(null);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setMobileOpen(false);
    };
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const homeHref = backHref || '#';
  const go = href => () => {
    window.location.href = href;
  };

  // ---------- MOBILE ----------
  if (isMobile) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--navy-800)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Brand, {
      homeHref: homeHref,
      compact: true
    }), /*#__PURE__*/React.createElement(IconButton, {
      label: "Men\xFC",
      variant: "on-navy",
      onClick: () => setMobileOpen(v => !v)
    }, ICON(mobileOpen ? 'x' : 'menu', 20))), mobileOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid rgba(255,255,255,0.08)',
        maxHeight: 'calc(100vh - 66px)',
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }
    }, backHref && /*#__PURE__*/React.createElement(Button, {
      as: "a",
      href: backHref,
      variant: "on-navy",
      size: "md",
      fullWidth: true,
      leftIcon: ICON('arrow-left', 16)
    }, "Ana Sayfa"), /*#__PURE__*/React.createElement(Button, {
      variant: "on-navy",
      size: "md",
      fullWidth: true,
      leftIcon: ICON('lock', 16),
      onClick: onLogin
    }, "Panele Giri\u015F"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "md",
      fullWidth: true,
      leftIcon: ICON('clipboard-list', 16),
      onClick: onApply
    }, "Ba\u015Fvuru Formu")), /*#__PURE__*/React.createElement("nav", {
      style: {
        padding: '8px 10px'
      }
    }, MENU.map(m => {
      const expandable = !!m.items.length;
      const isOpen = acc === m.label;
      return /*#__PURE__*/React.createElement("div", {
        key: m.label
      }, /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: e => {
          if (expandable) {
            e.preventDefault();
            setAcc(isOpen ? null : m.label);
          }
        },
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 12px',
          textDecoration: 'none',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: '.03em',
          color: m.label === active ? 'var(--gold-400)' : '#fff'
        }
      }, m.label, expandable && /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--navy-300)',
          display: 'inline-flex',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform .2s'
        }
      }, ICON('chevron-down', 16))), expandable && isOpen && /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 6
        }
      }, m.items.map(it => /*#__PURE__*/React.createElement("a", {
        key: it,
        href: "#",
        style: {
          padding: '10px 12px 10px 24px',
          textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: 14.5,
          color: 'var(--navy-200)'
        }
      }, it))));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }
    }, /*#__PURE__*/React.createElement(Social, {
      size: "md"
    }))));
  }

  // ---------- DESKTOP ----------
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--navy-800)',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Brand, {
    homeHref: homeHref
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 34,
      background: 'rgba(255,255,255,0.12)'
    }
  }), /*#__PURE__*/React.createElement(Social, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, backHref && /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: backHref,
    variant: "on-navy",
    size: "sm",
    leftIcon: ICON('arrow-left')
  }, "Ana Sayfa"), /*#__PURE__*/React.createElement(Button, {
    variant: "on-navy",
    size: "sm",
    leftIcon: ICON('lock'),
    onClick: onLogin
  }, "Panele Giri\u015F"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    leftIcon: ICON('clipboard-list'),
    onClick: onApply
  }, "Ba\u015Fvuru Formu"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      background: 'var(--navy-900)',
      borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    onMouseLeave: () => setOpen(null)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 32px',
      display: 'flex',
      gap: 2,
      flexWrap: 'wrap'
    }
  }, MENU.map(m => {
    const isActive = m.label === active;
    const isOpen = open === m.label;
    return /*#__PURE__*/React.createElement("div", {
      key: m.label,
      style: {
        position: 'relative'
      },
      onMouseEnter: () => setOpen(m.items.length ? m.label : null)
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '14px 18px',
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: isActive ? '#fff' : 'var(--navy-200)',
        borderBottom: `2px solid ${isActive || isOpen ? 'var(--gold-500)' : 'transparent'}`,
        transition: 'color .15s, border-color .15s',
        textDecoration: 'none'
      }
    }, m.label, !!m.items.length && ICON('chevron-down')), isOpen && !!m.items.length && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '100%',
        left: 0,
        minWidth: 210,
        background: '#fff',
        border: '1px solid var(--ink-200)',
        borderTop: '2px solid var(--gold-500)',
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: 6,
        zIndex: 60
      }
    }, m.items.map(it => /*#__PURE__*/React.createElement("a", {
      key: it,
      href: "#",
      style: {
        display: 'block',
        padding: '10px 14px',
        fontFamily: 'var(--font-body)',
        fontSize: 14.5,
        fontWeight: 500,
        color: 'var(--ink-700)',
        textDecoration: 'none',
        borderRadius: 'var(--radius-sm)'
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = 'var(--navy-50)';
        e.currentTarget.style.color = 'var(--navy-800)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--ink-700)';
      }
    }, it))));
  }))));
}
window.SiteHeader = SiteHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/TrialJourney.jsx
try { (() => {
// Buca Yıldız — Ücretsiz Deneme "Yolculuk" ekranı (veli gözünden)
const {
  Button,
  IconButton
} = window.BucaYLdZTasarMSistemi_45a34f;
const TJLOGO = '../../assets/logo-emblem.png';
const TJI = (n, sz = 16) => React.createElement('i', {
  'data-lucide': n,
  style: {
    width: sz,
    height: sz
  }
});

// ---- Reusable running silhouette ----
function Runner({
  run = false,
  fast = false,
  stand = false
}) {
  const cls = ['tj-fig', run && 'run', fast && 'fast', stand && 'stand'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, /*#__PURE__*/React.createElement("div", {
    className: "face"
  }, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("i", {
    className: "head"
  }), /*#__PURE__*/React.createElement("i", {
    className: "neck"
  }), /*#__PURE__*/React.createElement("i", {
    className: "torso"
  }), /*#__PURE__*/React.createElement("i", {
    className: "arm back"
  }), /*#__PURE__*/React.createElement("i", {
    className: "arm front"
  }), /*#__PURE__*/React.createElement("i", {
    className: "leg back"
  }), /*#__PURE__*/React.createElement("i", {
    className: "leg front"
  }))));
}

// ---- Scenes ----
function SceneBody() {
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-scene s-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tj-flood"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bracket"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tr"
  }), /*#__PURE__*/React.createElement("span", {
    className: "bl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "br"
  })), /*#__PURE__*/React.createElement(Runner, {
    stand: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-scan"
  }), /*#__PURE__*/React.createElement("div", {
    className: "s-chip c1"
  }, /*#__PURE__*/React.createElement("b", null, "%12,4"), /*#__PURE__*/React.createElement("span", null, "Ya\u011F")), /*#__PURE__*/React.createElement("div", {
    className: "s-chip c2"
  }, /*#__PURE__*/React.createElement("b", null, "%41"), /*#__PURE__*/React.createElement("span", null, "Kas")), /*#__PURE__*/React.createElement("div", {
    className: "s-chip c3"
  }, /*#__PURE__*/React.createElement("b", null, "19,8"), /*#__PURE__*/React.createElement("span", null, "VK\u0130")), /*#__PURE__*/React.createElement("div", {
    className: "pitch-lines"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-grass"
  }));
}
function SceneSprint() {
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-scene s-sprint"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tj-flood"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cone l"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cone r"
  }), /*#__PURE__*/React.createElement("div", {
    className: "streak a"
  }), /*#__PURE__*/React.createElement("div", {
    className: "streak b"
  }), /*#__PURE__*/React.createElement(Runner, {
    run: true,
    fast: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "hr"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("b", null, "168")), /*#__PURE__*/React.createElement("div", {
    className: "pitch-lines"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-grass"
  }));
}
function SceneLadder() {
  const rungs = [10, 22, 34, 46, 58, 70, 82, 94];
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-scene s-ladder"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tj-flood"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ladder"
  }, /*#__PURE__*/React.createElement("span", {
    className: "side l"
  }), /*#__PURE__*/React.createElement("span", {
    className: "side r"
  }), rungs.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "rung",
    style: {
      left: p + '%'
    }
  }))), /*#__PURE__*/React.createElement(Runner, {
    run: true,
    fast: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pitch-lines"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-grass"
  }));
}
function SceneDribble() {
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-scene s-dribble"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tj-flood"
  }), /*#__PURE__*/React.createElement("div", {
    className: "goal"
  }), /*#__PURE__*/React.createElement("div", {
    className: "net-flash"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cone c1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cone c2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cone c3"
  }), /*#__PURE__*/React.createElement(Runner, {
    run: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-ball"
  }), /*#__PURE__*/React.createElement("div", {
    className: "gol"
  }, "GOL!"), /*#__PURE__*/React.createElement("div", {
    className: "pitch-lines"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-grass"
  }));
}
function SceneRoad() {
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-scene s-road"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tj-flood"
  }), /*#__PURE__*/React.createElement("div", {
    className: "plan"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pl m"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pl s"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pl m"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pg"
  })), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 520 300",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("path", {
    className: "draw",
    d: "M60,252 C140,252 150,188 220,188 C290,188 300,120 360,140 C405,155 412,150 432,150"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "pin p1",
    cx: "60",
    cy: "252",
    r: "7",
    fill: "#fff",
    stroke: "var(--gold-600)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "pin p2",
    cx: "220",
    cy: "188",
    r: "7",
    fill: "#fff",
    stroke: "var(--gold-600)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "pin p3",
    cx: "360",
    cy: "140",
    r: "7",
    fill: "#fff",
    stroke: "var(--gold-600)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("text", {
    className: "goalstar",
    x: "432",
    y: "162",
    textAnchor: "middle",
    fontSize: "40",
    fill: "var(--gold-400)"
  }, "\u2605")), /*#__PURE__*/React.createElement("div", {
    className: "pitch-lines"
  }));
}
function SceneStar() {
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-scene s-star"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tj-flood"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ray r1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ray r2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ray r3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ray r4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ray r5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ray r6"
  }), /*#__PURE__*/React.createElement("div", {
    className: "star"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l2.92 6.26 6.86.62-5.18 4.55 1.54 6.71L12 17.8l-6.14 3.34 1.54-6.71L2.22 8.88l6.86-.62z",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "spark s1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "spark s2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "spark s3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "spark s4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "spark s5"
  }), /*#__PURE__*/React.createElement(Runner, {
    run: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pitch-lines"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tj-grass"
  }));
}
const TJ_STEPS = [{
  kicker: 'Adım 01',
  title: 'Vücut Profili Çıkarılır',
  scene: SceneBody,
  text: 'Çocuğunuzun boyu, kilosu, vücut yağ ve kas oranı ölçülür; sağlıklı gelişim için başlangıç noktasını birlikte görürüz.'
}, {
  kicker: 'Adım 02',
  title: 'Kondisyon & Çabukluk Testi',
  scene: SceneSprint,
  text: 'Kısa mesafe sürat ve mekik koşularıyla dayanıklılık ve hız ölçülür. Nabız takibiyle bilimsel bir değerlendirme yapılır.'
}, {
  kicker: 'Adım 03',
  title: 'Koordinasyon Testi',
  scene: SceneLadder,
  text: 'Çeviklik merdiveni ve ayak çalışmalarıyla denge, ritim ve koordinasyon becerileri ölçülür — futbolun temel taşı.'
}, {
  kicker: 'Adım 04',
  title: 'Top Becerisi Belirleme',
  scene: SceneDribble,
  text: 'Top sürme, çalım ve şut; engeller arasında top hakimiyeti gözlemlenir. Çocuğunuzun topla ilişkisini keşfederiz.'
}, {
  kicker: 'Adım 05',
  title: 'Kişiye Özel Yol Haritası',
  scene: SceneRoad,
  text: 'Tüm test sonuçları birleştirilir ve çocuğunuza özel, adım adım bir gelişim planı hazırlanır. Her sporcu farklıdır.'
}, {
  kicker: 'Sonuç',
  title: 'Geleceğin Yıldızı',
  scene: SceneStar,
  final: true,
  text: 'Disiplin, özgüven ve takım ruhuyla; önce iyi bir insan, sonra iyi bir sporcu. Yolculuğun sonunda çocuğunuz sahada parlar.'
}];
function TrialJourney() {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
    const steps = document.querySelectorAll('.tj-step');
    steps.forEach(s => s.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) {
      steps.forEach(s => s.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.25
    });
    steps.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-page"
  }, window.SiteHeader && React.createElement(window.SiteHeader, {
    backHref: 'index.html',
    onApply: () => {
      window.location.href = 'basvuru.html';
    },
    onLogin: () => {
      window.location.href = 'panel-giris.html';
    }
  }), /*#__PURE__*/React.createElement("header", {
    className: "tj-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tj-star-bg"
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    className: "tj-hero-inner"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), "\xDCcretsiz Deneme Program\u0131"), /*#__PURE__*/React.createElement("h1", null, "\xD6nce iyi bir ", /*#__PURE__*/React.createElement("span", {
    className: "gold"
  }, "insan"), ",", /*#__PURE__*/React.createElement("br", null), "sonra iyi bir ", /*#__PURE__*/React.createElement("span", {
    className: "gold"
  }, "sporcu"), " yeti\u015Ftiriyoruz"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'clamp(16px,2vw,19px)',
      lineHeight: 1.6,
      color: 'var(--navy-100)',
      maxWidth: 640,
      margin: '20px auto 0'
    }
  }, "\xC7ocu\u011Funuzu sahaya bekliyoruz. Antren\xF6rlerimiz e\u015Fli\u011Finde uygulanan ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#fff'
    }
  }, "tamamen \xFCcretsiz"), " 5 ad\u0131ml\u0131k de\u011Ferlendirmeyle yetene\u011Fini ke\u015Ffediyor, ona \xF6zel bir yol haritas\u0131 \xE7iziyoruz."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "basvuru.html",
    variant: "accent",
    size: "lg",
    leftIcon: TJI('star', 18)
  }, "Hemen \xDCcretsiz Kay\u0131t Ol"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#yolculuk",
    variant: "on-navy",
    size: "lg",
    rightIcon: TJI('arrow-down', 16)
  }, "Nas\u0131l \u0130\u015Fliyor?")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: '0 auto',
      padding: 'clamp(32px,5vw,52px) 32px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 'clamp(20px,2.6vw,30px)',
      lineHeight: 1.15,
      textTransform: 'uppercase',
      letterSpacing: '-.005em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Fiziksel ve psikolojik geli\u015Fimin yan\u0131nda ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-700)'
    }
  }, "sosyalle\u015Fme"), " becerisini \xF6nemsiyoruz"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 'clamp(10px,2vw,16px)',
      flexWrap: 'wrap',
      marginTop: 22
    }
  }, [['dumbbell', 'Fiziksel Gelişim'], ['brain', 'Psikolojik Gelişim'], ['users', 'Sosyalleşme']].map(([icon, label]) => /*#__PURE__*/React.createElement("span", {
    key: label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '10px 18px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--navy-600)'
    }
  }, TJI(icon, 18)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14.5,
      color: 'var(--text-strong)'
    }
  }, label)))))), /*#__PURE__*/React.createElement("section", {
    className: "tj-road",
    id: "yolculuk"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto clamp(36px,5vw,64px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--gold-700)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 2,
      background: 'var(--gold-500)'
    }
  }), "Yolculuk"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 'clamp(28px,4vw,44px)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      margin: '12px 0 0',
      lineHeight: 1.02
    }
  }, "5 Ad\u0131mda Yetene\u011Fi Ke\u015Ffediyoruz")), /*#__PURE__*/React.createElement("div", {
    className: "tj-steps"
  }, TJ_STEPS.map((s, i) => {
    const Scene = s.scene;
    return /*#__PURE__*/React.createElement("div", {
      className: 'tj-step' + (s.final ? ' is-final' : ''),
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "tj-pane scene-col"
    }, /*#__PURE__*/React.createElement(Scene, null)), /*#__PURE__*/React.createElement("div", {
      className: "tj-spine"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tj-node"
    }, s.final ? TJI('star', 22) : i + 1)), /*#__PURE__*/React.createElement("div", {
      className: "tj-pane text-col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tj-kicker"
    }, s.kicker), /*#__PURE__*/React.createElement("h3", {
      className: "tj-h"
    }, s.title), /*#__PURE__*/React.createElement("p", {
      className: "tj-p"
    }, s.text), /*#__PURE__*/React.createElement("span", {
      className: "tj-free"
    }, TJI('gift', 14), " Tamamen \xFCcretsiz")));
  }))), /*#__PURE__*/React.createElement("section", {
    className: "tj-cta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tj-star-bg"
  }, "\u2605"), /*#__PURE__*/React.createElement("div", {
    className: "tj-cta-inner"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 'clamp(28px,4vw,46px)',
      textTransform: 'uppercase',
      color: '#fff',
      margin: 0,
      lineHeight: 1.02
    }
  }, "Y\u0131ld\u0131z aday\u0131n\u0131z\u0131 sahaya bekliyoruz"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--navy-100)',
      maxWidth: 520,
      margin: '16px auto 28px'
    }
  }, "Ba\u015Fvuru formunu doldurun, antren\xF6rlerimiz \xFCcretsiz deneme antrenman\u0131 i\xE7in sizinle ileti\u015Fime ge\xE7sin."), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "basvuru.html",
    variant: "accent",
    size: "lg",
    leftIcon: TJI('clipboard-list', 18)
  }, "\xDCcretsiz Ba\u015Fvuru Formu"))), window.SiteFooter && React.createElement(window.SiteFooter));
}
window.TrialJourney = TrialJourney;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/TrialJourney.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AgeGroupCard = __ds_scope.AgeGroupCard;

__ds_ns.FixtureCard = __ds_scope.FixtureCard;

__ds_ns.NewsCard = __ds_scope.NewsCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.TrialBanner = __ds_scope.TrialBanner;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.MetricBar = __ds_scope.MetricBar;

__ds_ns.ProgressRing = __ds_scope.ProgressRing;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
