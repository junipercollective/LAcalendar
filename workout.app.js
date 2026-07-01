/* Compiled from workout.src.jsx by build.js — do not edit directly. */
const {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext
} = React;

// ══════════════════════════════════════════════════════════════════════════════
// THEMES — the whole app is re-skinned by swapping this token object.
// Add another entry here to add a 5th style; the UI picks it up automatically.
// ══════════════════════════════════════════════════════════════════════════════
const THEMES = {
  editorial: {
    name: 'Editorial',
    blurb: 'Dark, gold & serif',
    swatch: ['#100f0c', '#c9b26a', '#8fae7a'],
    isDark: true,
    bg: '#100f0c',
    bgDeep: '#0a0906',
    navBg: '#0c0b08',
    modalBg: '#181510',
    surface: '#1a1712',
    surfaceRaised: '#221f18',
    surface3: '#2b271e',
    border: '#221f18',
    border2: '#332e23',
    text: '#ece7dc',
    textBright: '#ded7c8',
    textDim: '#a49a86',
    textDim2: '#8a806e',
    textMute: '#6d6455',
    textFaint: '#4f4839',
    textGhost: '#3a3428',
    accent: '#c9b26a',
    accent2: '#b58a6a',
    accentInk: '#100f0c',
    success: '#8fae7a',
    danger: '#c77b6a',
    display: "'Oranienbaum', serif",
    italic: "'Cormorant Garamond', serif",
    headTransform: 'uppercase',
    headSpacing: '0.04em',
    headWeight: '400'
  },
  midnight: {
    name: 'Midnight',
    blurb: 'Deep indigo & blue',
    swatch: ['#0c0c14', '#8ab4e8', '#4ade80'],
    isDark: true,
    bg: '#0c0c14',
    bgDeep: '#080812',
    navBg: '#0e0e1a',
    modalBg: '#13131f',
    surface: '#10101c',
    surfaceRaised: '#1a1a28',
    surface3: '#252535',
    border: '#1a1a28',
    border2: '#2a2a3e',
    text: '#e8e8f0',
    textBright: '#d0d0e0',
    textDim: '#8a8aaa',
    textDim2: '#6a6a80',
    textMute: '#5a5a70',
    textFaint: '#3a3a50',
    textGhost: '#2a2a3a',
    accent: '#8ab4e8',
    accent2: '#9b70d4',
    accentInk: '#0c0c14',
    success: '#4ade80',
    danger: '#d46080',
    display: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    italic: "'Cormorant Garamond', serif",
    headTransform: 'none',
    headSpacing: '-0.5px',
    headWeight: '800'
  },
  juniper: {
    name: 'Juniper',
    blurb: 'Sage, cream & gold',
    swatch: ['#fcfaf3', '#30523a', '#c1a55f'],
    isDark: false,
    bg: '#fcfaf3',
    bgDeep: '#f2ede4',
    navBg: '#ffffff',
    modalBg: '#ffffff',
    surface: '#ffffff',
    surfaceRaised: '#f6f2e9',
    surface3: '#ece5d7',
    border: '#e8e1d5',
    border2: '#ded4c2',
    text: '#1e2e23',
    textBright: '#28382c',
    textDim: '#4a5e50',
    textDim2: '#5f7566',
    textMute: '#7a8f80',
    textFaint: '#9aab9e',
    textGhost: '#c3cfc5',
    accent: '#30523a',
    accent2: '#c1a55f',
    accentInk: '#f2ede4',
    success: '#5e8a68',
    danger: '#b0574a',
    display: "'Oranienbaum', serif",
    italic: "'Cormorant Garamond', serif",
    headTransform: 'uppercase',
    headSpacing: '0.04em',
    headWeight: '400'
  },
  blush: {
    name: 'Blush',
    blurb: 'Warm cream & terracotta',
    swatch: ['#f6efe8', '#b8674f', '#c99a5a'],
    isDark: false,
    bg: '#f6efe8',
    bgDeep: '#efe4da',
    navBg: '#fffdfa',
    modalBg: '#fffdfa',
    surface: '#fffdfa',
    surfaceRaised: '#f2e7dc',
    surface3: '#e9dccd',
    border: '#e7d9cc',
    border2: '#dcc9b8',
    text: '#3a2e2a',
    textBright: '#4a3a34',
    textDim: '#8a736a',
    textDim2: '#9c847a',
    textMute: '#a8938a',
    textFaint: '#c0ada3',
    textGhost: '#d8c9bf',
    accent: '#b8674f',
    accent2: '#c99a5a',
    accentInk: '#fffdfa',
    success: '#7f9b6a',
    danger: '#c0574a',
    display: "'Cormorant Garamond', serif",
    italic: "'Cormorant Garamond', serif",
    headTransform: 'none',
    headSpacing: '0',
    headWeight: '600'
  }
};
const THEME_ORDER = ['editorial', 'midnight', 'juniper', 'blush'];

// App-wide context: theme tokens + weight unit
const AppCtx = createContext(null);
const useT = () => useContext(AppCtx);

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_S = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#6B9FD4', '#D4607A', '#5DB87A', '#D4965A', '#9B70D4', '#D47A5A', '#5AB8B8'];
const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const uid = () => Math.random().toString(36).slice(2, 9);
const getYTId = (url = '') => (url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/) || [])[1] || null;
const parseTS = s => {
  if (!s) return null;
  const p = String(s).split(':').map(Number);
  return p.length === 2 ? p[0] * 60 + p[1] : parseInt(s) || null;
};
const fmtTS = s => s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : '';
const fmtDate = s => {
  try {
    return new Date(s + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return s;
  }
};
const findLastSess = (logs, pid, eid, skip) => {
  for (const d of Object.keys(logs).sort().reverse()) {
    if (d === skip) continue;
    const sets = logs[d]?.[pid]?.[eid]?.sets?.filter(s => s.done);
    if (sets?.length) return {
      date: d,
      sets
    };
  }
  return null;
};

// ─── Storage (localStorage) ───────────────────────────────────────────────────
const store = {
  get: k => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  }
};

// ─── Claude API (text + vision) ───────────────────────────────────────────────
// NOTE: These call api.anthropic.com directly. In this static build they require
// a backend proxy that adds the API key (see handoff "Migration Notes"). Until
// that proxy exists the AI buttons fail gracefully — every manual flow works.
const CLAUDE_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const claudeMsg = async ({
  sys,
  messages,
  search = false
}) => {
  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages
  };
  if (sys) body.system = sys;
  if (search) body.tools = [{
    type: 'web_search_20250305',
    name: 'web_search'
  }];
  const r = await fetch(CLAUDE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content.filter(b => b.type === 'text').map(b => b.text).join('');
};
const claudeText = ({
  sys,
  msg,
  search = false
}) => claudeMsg({
  sys,
  messages: [{
    role: 'user',
    content: msg
  }],
  search
});
const analyzeImage = async (base64, mediaType, mode = 'single') => {
  const sys = mode === 'single' ? `Extract exercise info from this image (coaching app screenshot, fitness platform, workout card, etc).
Return ONLY raw JSON, no markdown: {"name":"string","sets":3,"reps":12,"duration":null,"restSeconds":60,"notes":"coaching cues visible in image","videoUrl":"","alternatives":[]}` : `Extract ALL exercises from this workout screenshot (coaching platform, fitness app, etc).
Return ONLY raw JSON, no markdown: {"workoutName":"string","exercises":[{"name":"string","sets":3,"reps":12,"duration":null,"restSeconds":60,"notes":"string","videoUrl":"","alternatives":[]}]}`;
  const text = mode === 'single' ? 'Extract the exercise information visible in this screenshot.' : 'Extract every exercise visible in this workout screenshot. Capture all sets, reps, hold times, and coaching notes shown.';
  return claudeMsg({
    sys,
    messages: [{
      role: 'user',
      content: [{
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64
        }
      }, {
        type: 'text',
        text
      }]
    }]
  });
};
const readFileB64 = file => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res([r.result.split(',')[1], file.type || 'image/jpeg']);
  r.onerror = () => rej(new Error('Read failed'));
  r.readAsDataURL(file);
});
const extractJSON = text => {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON');
  return JSON.parse(m[0]);
};

// ─── Style helpers (theme-aware) ──────────────────────────────────────────────
const lbl = t => ({
  display: 'block',
  fontSize: '11px',
  color: t.textMute,
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  marginBottom: '7px',
  fontWeight: '700'
});
const inp = t => ({
  width: '100%',
  background: t.surfaceRaised,
  border: `1px solid ${t.border2}`,
  color: t.text,
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  boxSizing: 'border-box',
  marginBottom: '16px',
  fontFamily: 'inherit',
  outline: 'none'
});
const btn = {
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '700',
  fontFamily: 'inherit'
};
const head = (t, size) => ({
  fontFamily: t.display,
  fontWeight: t.headWeight,
  textTransform: t.headTransform,
  letterSpacing: t.headSpacing,
  fontSize: size,
  lineHeight: 1.1
});

// ─── Defaults ─────────────────────────────────────────────────────────────────
const INIT_PROGS = [{
  id: 'pt',
  name: 'Physical Therapy',
  color: '#6B9FD4',
  days: [0, 1, 2, 3, 4, 5, 6],
  isPersonal: false,
  exercises: [{
    id: 'pt-1',
    name: 'Glute Bridge (sample)',
    sets: 3,
    reps: 15,
    duration: null,
    restSeconds: 60,
    videoUrl: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    videoStartSeconds: null,
    notes: 'Press through heels. Hold 2 sec at top. Core braced.',
    equipment: ['bodyweight'],
    category: 'legs',
    alternatives: ['Hip Thrust', 'Single-Leg Glute Bridge']
  }]
}, {
  id: 'glutes',
  name: 'Butt Lifting',
  color: '#D4607A',
  days: [1, 3, 5],
  isPersonal: false,
  exercises: []
}, {
  id: 'abs',
  name: 'Ab Circuit',
  color: '#5DB87A',
  days: [2, 4, 6],
  isPersonal: false,
  exercises: []
}, {
  id: 'core',
  name: 'Core Program',
  color: '#D4965A',
  days: [1, 3, 5],
  isPersonal: false,
  exercises: []
}];

// ══════════════════════════════════════════════════════════════════════════════
// PHOTO FILL BUTTON — reusable image upload → AI extract
// ══════════════════════════════════════════════════════════════════════════════
function PhotoFill({
  mode = 'single',
  onData,
  accentColor,
  label
}) {
  const t = useT();
  const ac = accentColor || t.accent;
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const ref = useRef(null);
  const handle = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setErr('');
    try {
      const [b64, mtype] = await readFileB64(file);
      const raw = await analyzeImage(b64, mtype, mode);
      const parsed = extractJSON(raw);
      onData(parsed);
    } catch {
      setErr("Couldn't read the image — try a clearer screenshot with the exercise details visible. (AI extraction needs the API proxy configured — see handoff.)");
    }
    setLoading(false);
    e.target.value = '';
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: ref,
    type: "file",
    accept: "image/*,image/heic",
    capture: "environment",
    style: {
      display: 'none'
    },
    onChange: handle
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ref.current?.click(),
    disabled: loading,
    style: {
      width: '100%',
      background: t.surfaceRaised,
      border: `1.5px dashed ${ac}77`,
      color: ac,
      borderRadius: '12px',
      padding: '14px 16px',
      cursor: loading ? 'default' : 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'opacity 0.2s',
      opacity: loading ? 0.6 : 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "8.5",
    r: "1.5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "21 15 16 10 5 21"
  })), loading ? 'Reading screenshot...' : label || 'Fill from screenshot'), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.danger,
      marginTop: '6px',
      lineHeight: '1.5'
    }
  }, err));
}

// ══════════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════════
function App() {
  const [themeId, setThemeId] = useState('editorial');
  const [unit, setUnit] = useState('lbs');
  const [tab, setTab] = useState('today');
  const [progs, setProgs] = useState(INIT_PROGS);
  const [logs, setLogs] = useState({});
  const [rdy, setRdy] = useState(false);
  const [modal, setModal] = useState(null);
  const [gym, setGym] = useState(null);
  const TODAY = getToday();
  const DOW = new Date().getDay();
  useEffect(() => {
    const p = store.get('gwv10-p');
    if (p) {
      try {
        setProgs(JSON.parse(p));
      } catch {}
    }
    const l = store.get('gwv10-l');
    if (l) {
      try {
        setLogs(JSON.parse(l));
      } catch {}
    }
    const th = store.get('gwv10-theme');
    if (th && THEMES[th]) setThemeId(th);
    const u = store.get('gwv10-unit');
    if (u === 'lbs' || u === 'kg') setUnit(u);
    setRdy(true);
  }, []);
  useEffect(() => {
    if (rdy) store.set('gwv10-p', JSON.stringify(progs));
  }, [progs, rdy]);
  useEffect(() => {
    if (rdy) store.set('gwv10-l', JSON.stringify(logs));
  }, [logs, rdy]);
  useEffect(() => {
    if (rdy) store.set('gwv10-theme', themeId);
  }, [themeId, rdy]);
  useEffect(() => {
    if (rdy) store.set('gwv10-unit', unit);
  }, [unit, rdy]);
  const t = THEMES[themeId] || THEMES.editorial;
  const ctx = {
    ...t,
    unit,
    themeId,
    setThemeId,
    setUnit
  };
  useEffect(() => {
    document.body.style.background = t.bg;
  }, [t]);
  const saveProg = p => setProgs(prev => {
    const i = prev.findIndex(x => x.id === p.id);
    if (i >= 0) {
      const n = [...prev];
      n[i] = p;
      return n;
    }
    return [...prev, p];
  });
  const delProg = id => setProgs(prev => prev.filter(p => p.id !== id));
  const saveEx = (pid, ex) => setProgs(prev => prev.map(p => {
    if (p.id !== pid) return p;
    const i = p.exercises.findIndex(e => e.id === ex.id);
    return {
      ...p,
      exercises: i >= 0 ? p.exercises.map((e, j) => j === i ? ex : e) : [...p.exercises, ex]
    };
  }));
  const delEx = (pid, eid) => setProgs(prev => prev.map(p => p.id !== pid ? p : {
    ...p,
    exercises: p.exercises.filter(e => e.id !== eid)
  }));
  const logSet = (pid, eid, idx, data) => setLogs(prev => {
    const day = {
      ...(prev[TODAY] || {})
    };
    const pr = {
      ...(day[pid] || {})
    };
    const ex = {
      sets: [...(pr[eid]?.sets || [])]
    };
    while (ex.sets.length <= idx) ex.sets.push({
      reps: null,
      weight: 0,
      done: false
    });
    ex.sets[idx] = {
      ...ex.sets[idx],
      ...data
    };
    pr[eid] = ex;
    day[pid] = pr;
    return {
      ...prev,
      [TODAY]: day
    };
  });
  const todayPs = progs.filter(p => p.days.includes(DOW));
  if (!rdy) return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.bg,
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: t.textMute
    }
  }, "Loading...");
  return /*#__PURE__*/React.createElement(AppCtx.Provider, {
    value: ctx
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'inherit',
      background: t.bg,
      color: t.text,
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }
  }, gym && /*#__PURE__*/React.createElement(GymMode, {
    prog: gym.prog,
    startIdx: gym.idx,
    logs: logs,
    onLog: logSet,
    onClose: () => setGym(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 12px',
      borderBottom: `1px solid ${t.border}`,
      background: t.bg,
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", null, tab === 'today' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: t.accent,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontWeight: '600',
      marginBottom: '5px'
    }
  }, DAYS[DOW]), /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '26px'),
      color: t.text
    }
  }, "Today's Workout")), tab === 'history' && /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '26px'),
      color: t.text
    }
  }, "History"), tab === 'programs' && /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '26px'),
      color: t.text
    }
  }, "Programs"), tab === 'build' && /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '26px'),
      color: t.text
    }
  }, "Build")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }
  }, tab === 'programs' && /*#__PURE__*/React.createElement("button", {
    onClick: () => setModal({
      type: 'ep',
      prog: {
        id: uid(),
        name: '',
        color: COLORS[0],
        days: [],
        isPersonal: false,
        exercises: []
      }
    }),
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.text,
      borderRadius: '10px',
      padding: '8px 14px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700'
    }
  }, "+ New"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModal({
      type: 'settings'
    }),
    "aria-label": "Settings",
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textDim,
      borderRadius: '10px',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      paddingBottom: '76px'
    }
  }, tab === 'today' && /*#__PURE__*/React.createElement(TodayTab, {
    progs: todayPs,
    logs: logs,
    today: TODAY,
    onGym: (p, i) => setGym({
      prog: p,
      idx: i
    }),
    onView: (p, e) => setModal({
      type: 've',
      prog: p,
      ex: e
    })
  }), tab === 'history' && /*#__PURE__*/React.createElement(HistoryTab, {
    progs: progs,
    logs: logs
  }), tab === 'programs' && /*#__PURE__*/React.createElement(ProgsTab, {
    progs: progs,
    onEP: p => setModal({
      type: 'ep',
      prog: {
        ...p
      }
    }),
    onEE: (pid, ex) => setModal({
      type: 'ee',
      pid,
      ex: ex ? {
        ...ex
      } : null
    }),
    onDE: delEx,
    onDP: delProg,
    onView: (p, e) => setModal({
      type: 've',
      prog: p,
      ex: e
    }),
    onImport: saveProg
  }), tab === 'build' && /*#__PURE__*/React.createElement(BuildTab, {
    onSave: saveProg
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: t.navBg,
      borderTop: `1px solid ${t.border}`,
      display: 'flex',
      zIndex: 10
    }
  }, [['today', 'Today'], ['history', 'History'], ['programs', 'Programs'], ['build', 'Build']].map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTab(id),
    style: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      color: tab === id ? t.accent : t.textFaint,
      cursor: 'pointer',
      padding: '11px 0 15px',
      fontSize: '11px',
      fontWeight: tab === id ? '700' : '500',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3px',
      transition: 'color 0.15s'
    }
  }, /*#__PURE__*/React.createElement(NavIc, {
    id: id,
    active: tab === id
  }), label))), modal && /*#__PURE__*/React.createElement("div", {
    onClick: () => setModal(null),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.72)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      background: t.modalBg,
      borderRadius: '22px 22px 0 0',
      maxHeight: '92vh',
      overflowY: 'auto',
      border: `1px solid ${t.border}`,
      borderBottom: 'none'
    }
  }, modal.type === 've' && /*#__PURE__*/React.createElement(ExDetail, {
    prog: modal.prog,
    ex: modal.ex,
    logs: logs,
    today: TODAY,
    onClose: () => setModal(null)
  }), modal.type === 'ep' && /*#__PURE__*/React.createElement(EditProg, {
    prog: modal.prog,
    onSave: p => {
      saveProg(p);
      setModal(null);
    },
    onCancel: () => setModal(null)
  }), modal.type === 'ee' && /*#__PURE__*/React.createElement(EditEx, {
    ex: modal.ex,
    onSave: ex => {
      saveEx(modal.pid, ex);
      setModal(null);
    },
    onCancel: () => setModal(null)
  }), modal.type === 'settings' && /*#__PURE__*/React.createElement(Settings, {
    onClose: () => setModal(null)
  })))));
}

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS — theme picker + units
// ══════════════════════════════════════════════════════════════════════════════
function Settings({
  onClose
}) {
  const t = useT();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '22px'),
      color: t.text
    }
  }, "Settings"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textMute,
      borderRadius: '50%',
      width: '34px',
      height: '34px',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "×")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      fontWeight: '700',
      marginBottom: '12px'
    }
  }, "Appearance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '26px'
    }
  }, THEME_ORDER.map(id => {
    const th = THEMES[id];
    const active = t.themeId === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => t.setThemeId(id),
      style: {
        textAlign: 'left',
        background: th.surface,
        border: active ? `2px solid ${th.accent}` : `1px solid ${t.border2}`,
        borderRadius: '14px',
        padding: '13px',
        cursor: 'pointer',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '5px',
        marginBottom: '10px'
      }
    }, th.swatch.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: c,
        border: `1px solid rgba(128,128,128,0.25)`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: th.display,
        fontWeight: th.headWeight,
        textTransform: th.headTransform,
        letterSpacing: th.headSpacing,
        fontSize: '16px',
        color: th.text,
        marginBottom: '2px'
      }
    }, th.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: th.italic,
        fontStyle: 'italic',
        fontSize: '13px',
        color: th.textDim
      }
    }, th.blurb), active && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '11px',
        right: '11px',
        color: th.accent,
        fontSize: '14px',
        fontWeight: '800'
      }
    }, "✓"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      fontWeight: '700',
      marginBottom: '12px'
    }
  }, "Weight unit"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: t.surfaceRaised,
      borderRadius: '12px',
      padding: '4px',
      marginBottom: '8px'
    }
  }, ['lbs', 'kg'].map(u => /*#__PURE__*/React.createElement("button", {
    key: u,
    onClick: () => t.setUnit(u),
    style: {
      flex: 1,
      border: 'none',
      borderRadius: '9px',
      padding: '11px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      background: t.unit === u ? t.accent : 'transparent',
      color: t.unit === u ? t.accentInk : t.textMute,
      transition: 'all 0.15s',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  }, u))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textFaint,
      lineHeight: '1.6'
    }
  }, "Changes the label only — existing logged numbers are not converted."));
}

// ══════════════════════════════════════════════════════════════════════════════
// GYM MODE
// ══════════════════════════════════════════════════════════════════════════════
function GymMode({
  prog,
  startIdx,
  logs,
  onLog,
  onClose
}) {
  const t = useT();
  const [exIdx, setExIdx] = useState(startIdx);
  const [setData, setSetData] = useState([]);
  const [rest, setRest] = useState(null);
  const timerRef = useRef(null);
  const logsRef = useRef(logs);
  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);
  const TODAY = getToday();
  const ex = prog.exercises[exIdx];
  useEffect(() => {
    if (!ex) return;
    const l = logsRef.current;
    const todaySets = l[TODAY]?.[prog.id]?.[ex.id]?.sets || [];
    const last = findLastSess(l, prog.id, ex.id, TODAY);
    setSetData(Array.from({
      length: ex.sets
    }, (_, i) => {
      if (todaySets[i]) return {
        ...todaySets[i]
      };
      if (last?.sets[i]) return {
        ...last.sets[i],
        done: false
      };
      return {
        reps: ex.reps || 10,
        weight: 0,
        done: false
      };
    }));
    clearInterval(timerRef.current);
    setRest(null);
  }, [exIdx]);
  useEffect(() => () => clearInterval(timerRef.current), []);
  if (!ex) return null;
  const last = findLastSess(logs, prog.id, ex.id, TODAY);
  const vid = getYTId(ex.videoUrl);
  const isFirst = exIdx === 0,
    isLast = exIdx === prog.exercises.length - 1;
  const allDone = setData.length > 0 && setData.every(s => s.done);
  const showWeight = !(ex.equipment?.length === 1 && ex.equipment[0] === 'bodyweight') && !ex.duration;
  const startRest = secs => {
    setRest(secs);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setRest(p => {
      if (p <= 1) {
        clearInterval(timerRef.current);
        return null;
      }
      return p - 1;
    }), 1000);
  };
  const toggleSet = i => {
    const nd = !setData[i].done;
    const up = {
      ...setData[i],
      done: nd
    };
    const nx = [...setData];
    nx[i] = up;
    setSetData(nx);
    onLog(prog.id, ex.id, i, up);
    if (nd && ex.restSeconds) startRest(ex.restSeconds);
  };
  const updateField = (i, field, val) => {
    const nx = [...setData];
    nx[i] = {
      ...nx[i],
      [field]: val
    };
    setSetData(nx);
    onLog(prog.id, ex.id, i, {
      ...nx[i]
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: t.bgDeep,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      color: t.text
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: t.navBg,
      borderBottom: `1px solid ${t.border}`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 'none',
      color: t.textMute,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600'
    }
  }, "✕ End"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textFaint,
      fontWeight: '600'
    }
  }, prog.name, " · ", exIdx + 1, "/", prog.exercises.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => !isFirst && setExIdx(i => i - 1),
    style: {
      background: isFirst ? 'transparent' : t.surfaceRaised,
      border: 'none',
      color: isFirst ? t.textGhost : t.textDim,
      borderRadius: '8px',
      padding: '5px 12px',
      cursor: isFirst ? 'default' : 'pointer',
      fontSize: '16px',
      fontWeight: '700'
    }
  }, "‹"), /*#__PURE__*/React.createElement("button", {
    onClick: () => !isLast && setExIdx(i => i + 1),
    style: {
      background: isLast ? 'transparent' : t.surfaceRaised,
      border: 'none',
      color: isLast ? t.textGhost : t.textDim,
      borderRadius: '8px',
      padding: '5px 12px',
      cursor: isLast ? 'default' : 'pointer',
      fontSize: '16px',
      fontWeight: '700'
    }
  }, "›"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 6px',
      display: 'flex',
      gap: '5px',
      justifyContent: 'center',
      flexShrink: 0,
      background: t.navBg
    }
  }, prog.exercises.map((_, i) => {
    const exS = logs[TODAY]?.[prog.id]?.[prog.exercises[i].id]?.sets || [];
    const done = exS.length >= prog.exercises[i].sets && exS.filter(x => x.done).length >= prog.exercises[i].sets;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => setExIdx(i),
      style: {
        height: '5px',
        borderRadius: '3px',
        cursor: 'pointer',
        background: done ? t.success : i === exIdx ? prog.color : t.surface3,
        width: i === exIdx ? '20px' : '7px',
        transition: 'all 0.2s',
        flexShrink: 0
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '14px 14px 8px',
      padding: '16px',
      background: t.surface,
      borderRadius: '14px',
      borderLeft: `3px solid ${prog.color}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: prog.color,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px'
    }
  }, exIdx + 1, " of ", prog.exercises.length), /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '23px'),
      color: t.text,
      marginBottom: '8px'
    }
  }, ex.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: t.textDim,
      fontWeight: '500'
    }
  }, ex.sets, " sets", ex.reps ? ` · ${ex.reps} reps` : '', ex.duration ? ` · ${ex.duration}s` : '', ex.restSeconds ? ` · ${ex.restSeconds}s rest` : ''), ex.equipment?.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textFaint,
      marginTop: '5px'
    }
  }, ex.equipment.join(', '))), rest !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px 8px',
      background: t.success + '18',
      border: `1px solid ${t.success}44`,
      borderRadius: '14px',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: t.success,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  }, "Rest"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '36px',
      fontWeight: '800',
      color: t.success,
      letterSpacing: '-1px',
      lineHeight: '1'
    }
  }, rest, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      opacity: 0.7
    }
  }, " s"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      clearInterval(timerRef.current);
      setRest(null);
    },
    style: {
      background: t.success + '26',
      border: 'none',
      color: t.success,
      borderRadius: '10px',
      padding: '10px 16px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700'
    }
  }, "Skip")), last && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px 8px',
      background: t.surfaceRaised,
      border: `1px solid ${t.border2}`,
      borderRadius: '12px',
      padding: '10px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: t.textFaint,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '3px'
    }
  }, "Last session (", fmtDate(last.date), ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textDim2,
      fontWeight: '500'
    }
  }, last.sets.map((s, i) => `Set ${i + 1}: ${s.weight > 0 ? `${s.weight}${t.unit} × ` : ''}${s.reps}r`).join(' · '))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 4px'
    }
  }, setData.map((sd, i) => /*#__PURE__*/React.createElement(SetRow, {
    key: i,
    idx: i,
    data: sd,
    color: prog.color,
    showWeight: showWeight,
    onToggle: () => toggleSet(i),
    onReps: v => updateField(i, 'reps', v),
    onWeight: v => updateField(i, 'weight', v)
  }))), vid && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '4px 14px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: t.textFaint,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px'
    }
  }, "Reference"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      paddingBottom: '56.25%',
      background: '#000',
      borderRadius: '12px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    src: `https://www.youtube-nocookie.com/embed/${vid}${ex.videoStartSeconds ? `?start=${ex.videoStartSeconds}&` : '?'}rel=0&modestbranding=1`,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none'
    },
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true
  })), ex.videoStartSeconds && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textFaint,
      marginTop: '4px',
      textAlign: 'center'
    }
  }, "Starting at ", fmtTS(ex.videoStartSeconds))), !vid && ex.videoUrl && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '4px 14px 10px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: ex.videoUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: t.surfaceRaised,
      color: t.accent,
      borderRadius: '12px',
      padding: '12px 16px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '700',
      border: `1px solid ${t.border2}`
    }
  }, "▷ Watch Reference Video")), ex.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px 10px',
      background: t.surfaceRaised,
      borderRadius: '12px',
      padding: '12px 14px',
      fontSize: '13px',
      color: t.textDim,
      lineHeight: '1.7',
      borderLeft: `3px solid ${prog.color}66`
    }
  }, ex.notes), ex.alternatives?.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px 10px',
      background: t.accent2 + '14',
      border: `1px solid ${t.accent2}33`,
      borderRadius: '12px',
      padding: '10px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: t.accent2,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px'
    }
  }, "Equipment not available? Try:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, ex.alternatives.map(a => /*#__PURE__*/React.createElement("span", {
    key: a,
    style: {
      background: t.accent2 + '22',
      color: t.accent2,
      borderRadius: '6px',
      padding: '4px 10px',
      fontSize: '12px',
      fontWeight: '500'
    }
  }, a)))), allDone && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '6px 14px 24px'
    }
  }, !isLast ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setExIdx(i => i + 1),
    style: {
      width: '100%',
      background: prog.color,
      border: 'none',
      color: '#fff',
      borderRadius: '14px',
      padding: '16px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '800'
    }
  }, "Next: ", prog.exercises[exIdx + 1].name, " →") : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '24px'),
      color: t.success,
      marginBottom: '16px'
    }
  }, "Workout complete"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: t.success,
      border: 'none',
      color: t.isDark ? '#080812' : '#fff',
      borderRadius: '14px',
      padding: '14px 32px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '800'
    }
  }, "Done"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '32px'
    }
  })));
}
function SetRow({
  idx,
  data,
  color,
  showWeight,
  onToggle,
  onReps,
  onWeight
}) {
  const t = useT();
  const iS = {
    background: t.surfaceRaised,
    border: `1px solid ${t.border2}`,
    color: t.text,
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '18px',
    fontWeight: '700',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '10px',
      background: data.done ? color + '1c' : t.surface,
      borderRadius: '14px',
      padding: '12px 14px',
      border: data.done ? `1px solid ${color}44` : `1px solid ${t.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.2s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: data.done ? color : 'transparent',
      border: data.done ? 'none' : `2px solid ${t.border2}`,
      color: data.done ? '#fff' : t.textMute,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: '800',
      flexShrink: 0,
      transition: 'all 0.15s'
    }
  }, data.done ? '✓' : idx + 1), showWeight && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      color: t.textFaint,
      fontWeight: '700',
      marginBottom: '3px',
      letterSpacing: '0.5px'
    }
  }, t.unit.toUpperCase()), /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    min: "0",
    step: "2.5",
    value: data.weight || '',
    onChange: e => onWeight(parseFloat(e.target.value) || 0),
    placeholder: "0",
    style: {
      ...iS,
      width: '76px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      color: t.textFaint,
      fontWeight: '700',
      marginBottom: '3px',
      letterSpacing: '0.5px'
    }
  }, "REPS"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    min: "1",
    value: data.reps || '',
    onChange: e => onReps(parseInt(e.target.value) || 0),
    placeholder: "—",
    style: {
      ...iS,
      width: '68px'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      background: data.done ? color : t.surface3,
      color: data.done ? '#fff' : t.textMute,
      fontSize: '18px',
      fontWeight: '800',
      flexShrink: 0,
      transition: 'all 0.15s',
      boxShadow: data.done ? `0 0 12px ${color}55` : 'none'
    }
  }, data.done ? '✓' : '→'));
}
function TodayTab({
  progs,
  logs,
  today,
  onGym,
  onView
}) {
  const t = useT();
  if (!progs.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '90px 20px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '26px'),
      color: t.textMute,
      marginBottom: '8px'
    }
  }, "Rest day"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: t.italic,
      fontStyle: 'italic',
      fontSize: '16px',
      color: t.textFaint
    }
  }, "Nothing scheduled. Recover well."));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px'
    }
  }, progs.map(prog => {
    const total = prog.exercises.reduce((s, e) => s + e.sets, 0);
    const done = prog.exercises.reduce((s, e) => s + (logs[today]?.[prog.id]?.[e.id]?.sets || []).filter(x => x.done).length, 0);
    const complete = total > 0 && done === total;
    return /*#__PURE__*/React.createElement("div", {
      key: prog.id,
      style: {
        marginBottom: '14px',
        background: t.surface,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${complete ? t.success + '33' : t.border}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '15px 16px',
        borderLeft: `3px solid ${prog.color}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...head(t, '18px'),
        color: t.text
      }
    }, prog.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        color: t.textFaint,
        marginTop: '4px'
      }
    }, prog.exercises.length, " exercises · ", done, "/", total, " sets")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '6px',
        flexShrink: 0,
        marginLeft: '10px'
      }
    }, complete ? /*#__PURE__*/React.createElement("div", {
      style: {
        color: t.success,
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }
    }, "Done") : prog.exercises.length > 0 && /*#__PURE__*/React.createElement("button", {
      onClick: () => onGym(prog, 0),
      style: {
        background: prog.color,
        border: 'none',
        color: '#fff',
        borderRadius: '10px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '800',
        boxShadow: `0 4px 14px ${prog.color}40`
      }
    }, "Start"))), total > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        height: '2px',
        background: t.border2,
        borderRadius: '2px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        background: complete ? t.success : prog.color,
        borderRadius: '2px',
        width: `${Math.round(done / total * 100)}%`,
        transition: 'width 0.3s'
      }
    }))), prog.exercises.map(ex => {
      const exS = logs[today]?.[prog.id]?.[ex.id]?.sets || [];
      const exDone = ex.sets > 0 && exS.filter(s => s.done).length === ex.sets;
      const lw = exS.find(s => s.done && s.weight > 0);
      return /*#__PURE__*/React.createElement("div", {
        key: ex.id,
        style: {
          borderTop: `1px solid ${t.border}`,
          padding: '11px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: exDone ? 0.5 : 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '13px',
          fontWeight: '600',
          color: exDone ? t.textMute : t.textBright,
          textDecoration: exDone ? 'line-through' : 'none'
        }
      }, ex.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '11px',
          color: t.textFaint,
          marginTop: '2px'
        }
      }, ex.sets, "×", ex.reps || ex.duration && `${ex.duration}s` || '?', lw && ` · ${lw.weight}${t.unit}`)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '5px',
          flexShrink: 0,
          marginLeft: '8px'
        }
      }, (ex.videoUrl || ex.notes) && /*#__PURE__*/React.createElement("button", {
        onClick: () => onView(prog, ex),
        style: {
          background: t.surfaceRaised,
          border: 'none',
          color: t.textDim2,
          borderRadius: '7px',
          padding: '5px 9px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '600'
        }
      }, "Info"), /*#__PURE__*/React.createElement("button", {
        onClick: () => onGym(prog, prog.exercises.findIndex(e => e.id === ex.id)),
        style: {
          background: t.surfaceRaised,
          border: 'none',
          color: t.accent,
          borderRadius: '7px',
          padding: '5px 9px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '700'
        }
      }, "Do")));
    }), prog.exercises.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: `1px solid ${t.border}`,
        padding: '12px 16px',
        color: t.textGhost,
        fontSize: '13px'
      }
    }, "No exercises yet. Go to Programs to add them."));
  }));
}
function HistoryTab({
  progs,
  logs
}) {
  const t = useT();
  const dates = Object.keys(logs).sort().reverse().slice(0, 30);
  if (!dates.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '70px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: t.italic,
      fontStyle: 'italic',
      fontSize: '17px',
      color: t.textMute,
      lineHeight: '1.6'
    }
  }, "No workouts logged yet. Complete sets in gym mode to build your history."));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px'
    }
  }, dates.map(date => {
    const dayLog = logs[date];
    const pw = progs.filter(p => dayLog[p.id] && Object.keys(dayLog[p.id]).some(eid => dayLog[p.id][eid]?.sets?.some(s => s.done)));
    if (!pw.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: date,
      style: {
        marginBottom: '12px',
        background: t.surface,
        borderRadius: '14px',
        padding: '15px 16px',
        border: `1px solid ${t.border}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...head(t, '16px'),
        color: t.textBright,
        marginBottom: '12px'
      }
    }, fmtDate(date)), pw.map(prog => /*#__PURE__*/React.createElement("div", {
      key: prog.id,
      style: {
        marginBottom: '10px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: prog.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        fontWeight: '700',
        color: t.textDim
      }
    }, prog.name)), Object.keys(dayLog[prog.id]).map(eid => {
      const ex = prog.exercises.find(e => e.id === eid);
      if (!ex) return null;
      const sets = (dayLog[prog.id][eid]?.sets || []).filter(s => s.done);
      if (!sets.length) return null;
      const hw = sets.some(s => s.weight > 0);
      return /*#__PURE__*/React.createElement("div", {
        key: eid,
        style: {
          padding: '2px 8px 2px 13px',
          fontSize: '12px',
          color: t.textMute,
          lineHeight: '1.6'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: t.textDim2,
          fontWeight: '500'
        }
      }, ex.name, ":"), '  ', sets.map((s, i) => /*#__PURE__*/React.createElement("span", {
        key: i
      }, i > 0 ? ', ' : '', hw && s.weight > 0 ? `${s.weight}${t.unit}×` : '', s.reps, "r")));
    }))));
  }));
}
function ProgsTab({
  progs,
  onEP,
  onEE,
  onDE,
  onDP,
  onView,
  onImport
}) {
  const t = useT();
  const [expanded, setExpanded] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [importBox, setImportBox] = useState(false);
  const [importText, setImportText] = useState('');
  const [importErr, setImportErr] = useState('');
  const doImport = () => {
    try {
      const p = JSON.parse(importText.trim());
      if (!p.id || !p.name || !Array.isArray(p.exercises)) throw new Error('Invalid');
      onImport({
        ...p,
        id: uid()
      });
      setImportBox(false);
      setImportText('');
      setImportErr('');
    } catch {
      setImportErr('Could not read that program. Make sure you pasted the full export.');
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setImportBox(b => !b),
    style: {
      flex: 1,
      background: t.surfaceRaised,
      border: 'none',
      color: t.accent,
      borderRadius: '10px',
      padding: '11px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '700'
    }
  }, "Import Program")), importBox && /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.surface,
      border: `1px solid ${t.border2}`,
      borderRadius: '14px',
      padding: '16px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: t.textDim2,
      marginBottom: '10px'
    }
  }, "Paste a program someone shared with you:"), /*#__PURE__*/React.createElement("textarea", {
    value: importText,
    onChange: e => {
      setImportText(e.target.value);
      setImportErr('');
    },
    placeholder: "Paste exported program JSON here...",
    rows: 4,
    style: {
      ...inp(t),
      resize: 'none',
      fontFamily: 'monospace',
      fontSize: '12px'
    }
  }), importErr && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.danger,
      marginBottom: '10px'
    }
  }, importErr), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setImportBox(false);
      setImportText('');
      setImportErr('');
    },
    style: {
      flex: 1,
      background: t.surfaceRaised,
      border: 'none',
      color: t.textMute,
      borderRadius: '10px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: doImport,
    style: {
      flex: 2,
      background: t.accent,
      border: 'none',
      color: t.accentInk,
      borderRadius: '10px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700'
    }
  }, "Add Program"))), exportData && /*#__PURE__*/React.createElement("div", {
    onClick: () => setExportData(null),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.78)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: t.modalBg,
      borderRadius: '18px',
      padding: '24px',
      margin: '0 16px',
      maxWidth: '400px',
      width: '100%',
      border: `1px solid ${t.border2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '18px'),
      color: t.text,
      marginBottom: '8px'
    }
  }, "Share: ", exportData.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textMute,
      marginBottom: '12px',
      lineHeight: '1.5'
    }
  }, "Copy and send to a friend. They paste it into Import."), /*#__PURE__*/React.createElement("textarea", {
    readOnly: true,
    value: JSON.stringify({
      ...exportData,
      isPersonal: false
    }),
    rows: 5,
    style: {
      ...inp(t),
      resize: 'none',
      fontFamily: 'monospace',
      fontSize: '11px',
      color: t.textDim2
    },
    onClick: e => e.target.select()
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard?.writeText(JSON.stringify({
        ...exportData,
        isPersonal: false
      })).catch(() => {});
      setExportData(null);
    },
    style: {
      width: '100%',
      ...btn,
      background: t.accent,
      color: t.accentInk,
      padding: '12px'
    }
  }, "Copy to Clipboard"))), progs.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: t.textMute,
      padding: '50px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: t.italic,
      fontStyle: 'italic',
      fontSize: '16px'
    }
  }, "No programs yet. Tap + New or use Build to create one.")), progs.map(prog => /*#__PURE__*/React.createElement("div", {
    key: prog.id,
    style: {
      marginBottom: '12px',
      background: t.surface,
      borderRadius: '16px',
      overflow: 'hidden',
      border: `1px solid ${t.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setExpanded(expanded === prog.id ? null : prog.id),
    style: {
      padding: '15px 16px',
      borderLeft: `3px solid ${prog.color}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '17px'),
      color: t.text
    }
  }, prog.name), prog.isPersonal && /*#__PURE__*/React.createElement("span", {
    style: {
      background: t.accent2 + '22',
      color: t.accent2,
      fontSize: '9px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '4px',
      letterSpacing: '0.3px'
    }
  }, "PERSONAL")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textFaint,
      marginTop: '4px'
    }
  }, DAYS_S.filter((_, i) => prog.days.includes(i)).join(' · ') || 'No schedule', " · ", prog.exercises.length, " ex")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      flexShrink: 0,
      marginLeft: '10px'
    }
  }, !prog.isPersonal && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setExportData(prog);
    },
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textDim2,
      borderRadius: '8px',
      padding: '6px 10px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600'
    }
  }, "Share"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onEP(prog);
    },
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textDim,
      borderRadius: '8px',
      padding: '6px 10px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600'
    }
  }, "Edit"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.textGhost,
      fontSize: '11px',
      alignSelf: 'center'
    }
  }, expanded === prog.id ? '▲' : '▼'))), expanded === prog.id && /*#__PURE__*/React.createElement("div", null, prog.exercises.map(ex => /*#__PURE__*/React.createElement("div", {
    key: ex.id,
    style: {
      borderTop: `1px solid ${t.border}`,
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      fontWeight: '600',
      color: t.textBright
    }
  }, ex.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textFaint,
      marginTop: '2px'
    }
  }, ex.sets, "×", ex.reps || ex.duration && `${ex.duration}s` || '?', ex.videoUrl ? ' · video' : '', ex.videoStartSeconds ? ` @ ${fmtTS(ex.videoStartSeconds)}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '5px',
      flexShrink: 0,
      marginLeft: '8px'
    }
  }, (ex.videoUrl || ex.notes) && /*#__PURE__*/React.createElement("button", {
    onClick: () => onView(prog, ex),
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.accent,
      borderRadius: '7px',
      padding: '5px 8px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600'
    }
  }, "View"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onEE(prog.id, ex),
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textDim,
      borderRadius: '7px',
      padding: '5px 8px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600'
    }
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirm({
      type: 'ex',
      pid: prog.id,
      eid: ex.id,
      name: ex.name
    }),
    style: {
      background: t.danger + '1e',
      border: 'none',
      color: t.danger,
      borderRadius: '7px',
      padding: '5px 8px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600'
    }
  }, "Del")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${t.border}`,
      padding: '12px 16px',
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onEE(prog.id, null),
    style: {
      flex: 1,
      background: 'transparent',
      border: `1.5px dashed ${prog.color}66`,
      color: prog.color,
      borderRadius: '10px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700'
    }
  }, "+ Add Exercise"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirm({
      type: 'prog',
      pid: prog.id,
      name: prog.name
    }),
    style: {
      background: t.danger + '1e',
      border: 'none',
      color: t.danger,
      borderRadius: '10px',
      padding: '10px 14px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600'
    }
  }, "Delete"))))), confirm && /*#__PURE__*/React.createElement("div", {
    onClick: () => setConfirm(null),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: t.modalBg,
      borderRadius: '18px',
      padding: '26px',
      margin: '0 20px',
      maxWidth: '340px',
      width: '100%',
      border: `1px solid ${t.border2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '19px'),
      color: t.text,
      marginBottom: '8px'
    }
  }, "Delete \"", confirm.name, "\"?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: t.textMute,
      marginBottom: '22px'
    }
  }, "This cannot be undone."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirm(null),
    style: {
      flex: 1,
      background: t.surfaceRaised,
      border: 'none',
      color: t.textDim,
      borderRadius: '10px',
      padding: '13px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (confirm.type === 'ex') onDE(confirm.pid, confirm.eid);else {
        onDP(confirm.pid);
        setExpanded(null);
      }
      setConfirm(null);
    },
    style: {
      flex: 1,
      background: t.danger,
      border: 'none',
      color: '#fff',
      borderRadius: '10px',
      padding: '13px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700'
    }
  }, "Delete")))));
}
function BuildTab({
  onSave
}) {
  const t = useT();
  const [view, setView] = useState(null);
  if (view === 'import') return /*#__PURE__*/React.createElement(ImportWorkout, {
    onSave: p => {
      onSave(p);
      setView(null);
    },
    onBack: () => setView(null)
  });
  if (view === 'generate') return /*#__PURE__*/React.createElement(GenerateWorkout, {
    onSave: p => {
      onSave(p);
      setView(null);
    },
    onBack: () => setView(null)
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: t.italic,
      fontStyle: 'italic',
      fontSize: '16px',
      color: t.textDim,
      marginBottom: '16px',
      lineHeight: '1.5'
    }
  }, "Import a full workout by screenshot or pasted text, or generate a new program from YouTube videos."), [{
    id: 'import',
    title: 'Import a Workout',
    desc: "Screenshot your coaching platform, PT's app, or a workout doc. Or paste text. Claude reads it and builds a trackable program with all exercises filled in."
  }, {
    id: 'generate',
    title: 'Generate from YouTube',
    desc: 'Paste YouTube URLs and pick your parameters. Claude analyzes the videos and builds a structured program.'
  }].map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    onClick: () => setView(c.id),
    style: {
      background: t.surface,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '12px',
      border: `1px solid ${t.border}`,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '19px'),
      color: t.text,
      marginBottom: '8px'
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: t.textDim,
      lineHeight: '1.6',
      marginBottom: '12px'
    }
  }, c.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      color: t.accent,
      fontSize: '13px',
      fontWeight: '700'
    }
  }, "Open →"))));
}

// ─── IMPORT WORKOUT (screenshot or text → full program) ───────────────────────
function ImportWorkout({
  onSave,
  onBack
}) {
  const t = useT();
  const [mode, setMode] = useState('photo');
  const [source, setSource] = useState('');
  const [text, setText] = useState('');
  const [isPersonal, setIsPersonal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState(null);
  const makeProgram = raw => {
    const parsed = extractJSON(raw);
    return {
      ...parsed,
      id: uid(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      days: [1, 3, 5],
      isPersonal,
      exercises: (parsed.exercises || []).map(e => ({
        ...e,
        id: uid()
      }))
    };
  };
  const parseText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setErr('');
    try {
      const sys = `Parse this workout into structured JSON. Return ONLY raw JSON, no markdown.
Schema: {"name":"string","exercises":[{"id":"x","name":"string","sets":3,"reps":12,"duration":null,"restSeconds":60,"videoUrl":"","videoStartSeconds":null,"notes":"string","equipment":["bodyweight"],"category":"legs","alternatives":[]}]}`;
      const raw = await claudeText({
        sys,
        msg: `Source: ${source || 'workout'}\n\n${text}`
      });
      setPreview(makeProgram(raw));
    } catch {
      setErr('Could not parse. Try clearer formatting: exercise name, sets × reps per line. (AI parsing needs the API proxy — see handoff.)');
    }
    setLoading(false);
  };
  const handlePhotoData = async raw => {
    try {
      setPreview(makeProgram(raw));
    } catch {
      setErr('Could not read the workout from that image. Try a clearer screenshot.');
    }
  };
  if (preview) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPreview(null),
    style: {
      background: 'transparent',
      border: 'none',
      color: t.textMute,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '16px',
      padding: 0
    }
  }, "← Edit"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '20px'),
      color: t.text,
      marginBottom: '12px'
    }
  }, preview.name), /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.surface,
      borderRadius: '14px',
      overflow: 'hidden',
      border: `1px solid ${t.border}`,
      marginBottom: '14px'
    }
  }, (preview.exercises || []).map((ex, i) => /*#__PURE__*/React.createElement("div", {
    key: ex.id,
    style: {
      borderTop: i > 0 ? `1px solid ${t.border}` : 'none',
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      fontWeight: '700',
      color: t.textBright
    }
  }, ex.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textDim,
      marginTop: '3px'
    }
  }, ex.sets, " sets × ", ex.reps || ex.duration && `${ex.duration}s` || '?', ex.notes ? ` · ${ex.notes.slice(0, 60)}${ex.notes.length > 60 ? '...' : ''}` : '')))), isPersonal && /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.accent2 + '14',
      border: `1px solid ${t.accent2}33`,
      borderRadius: '10px',
      padding: '10px 14px',
      marginBottom: '14px',
      fontSize: '12px',
      color: t.accent2
    }
  }, "Marked personal — stays on your device only."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      flex: 1,
      ...btn,
      background: t.surfaceRaised,
      color: t.textMute,
      padding: '13px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSave(preview),
    style: {
      flex: 2,
      ...btn,
      background: t.accent,
      color: t.accentInk,
      padding: '13px'
    }
  }, "Save Program")));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: 'transparent',
      border: 'none',
      color: t.textMute,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '16px',
      padding: 0
    }
  }, "← Back"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: t.surfaceRaised,
      borderRadius: '12px',
      padding: '4px',
      marginBottom: '20px'
    }
  }, [['photo', 'Screenshot'], ['text', 'Paste Text']].map(([m, l]) => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setMode(m),
    style: {
      flex: 1,
      border: 'none',
      borderRadius: '9px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700',
      background: mode === m ? t.surface3 : 'transparent',
      color: mode === m ? t.text : t.textMute,
      transition: 'all 0.2s'
    }
  }, l))), mode === 'photo' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.surfaceRaised,
      border: `1px solid ${t.border2}`,
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '16px',
      fontSize: '12px',
      color: t.textDim2,
      lineHeight: '1.6'
    }
  }, "Take a screenshot of your coaching platform, PT app, or workout document showing the full exercise list. The clearer the text, the better the extraction."), /*#__PURE__*/React.createElement(PhotoFill, {
    mode: "bulk",
    label: "Upload workout screenshot",
    accentColor: t.success,
    onData: handlePhotoData
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.danger,
      marginBottom: '14px',
      lineHeight: '1.5'
    }
  }, err)), mode === 'text' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Source (optional)"), /*#__PURE__*/React.createElement("input", {
    value: source,
    onChange: e => setSource(e.target.value),
    placeholder: "My PT, Coach name, Peloton program...",
    style: inp(t)
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Paste the workout"), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: `Example:\n\nHip Thrust: 4×12\nSumo Squat: 3×15 @ bodyweight\nGlute Bridge: 3×20 hold 2s`,
    rows: 10,
    style: {
      ...inp(t),
      resize: 'vertical',
      lineHeight: '1.7',
      fontFamily: 'monospace',
      fontSize: '13px'
    }
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.danger + '1e',
      border: `1px solid ${t.danger}44`,
      borderRadius: '10px',
      padding: '12px',
      marginBottom: '14px',
      fontSize: '13px',
      color: t.danger
    }
  }, err)), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      marginBottom: '20px',
      userSelect: 'none'
    },
    onClick: () => setIsPersonal(p => !p)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      background: isPersonal ? t.accent2 : t.surfaceRaised,
      position: 'relative',
      transition: 'background 0.2s',
      flexShrink: 0,
      border: `1px solid ${isPersonal ? t.accent2 : t.border2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#fff',
      position: 'absolute',
      top: '1px',
      left: isPersonal ? '21px' : '1px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      fontWeight: '700',
      color: t.textBright
    }
  }, "Purchased content (personal)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      marginTop: '2px'
    }
  }, "Stays on your device, not shareable"))), mode === 'text' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      flex: 1,
      ...btn,
      background: t.surfaceRaised,
      color: t.textMute,
      padding: '13px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: parseText,
    disabled: loading || !text.trim(),
    style: {
      flex: 2,
      ...btn,
      background: loading || !text.trim() ? t.surface3 : t.accent,
      color: loading || !text.trim() ? t.textMute : t.accentInk,
      padding: '13px',
      cursor: loading || !text.trim() ? 'default' : 'pointer'
    }
  }, loading ? 'Parsing...' : 'Parse Workout')));
}

// ─── GENERATE WORKOUT (from YouTube) ─────────────────────────────────────────
function GenerateWorkout({
  onSave,
  onBack
}) {
  const t = useT();
  const [urls, setUrls] = useState(['']);
  const [params, setParams] = useState({
    dur: '45',
    diff: 'medium',
    freq: '3',
    focus: 'full body',
    equip: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState(null);
  const generate = async () => {
    const valid = urls.filter(u => u.trim());
    if (!valid.length) {
      setErr('Add at least one YouTube URL.');
      return;
    }
    setLoading(true);
    setErr('');
    const msgs = ['Searching for video content...', 'Analyzing exercises...', 'Building your program...'];
    let mi = 0;
    setLoadMsg(msgs[0]);
    const iv = setInterval(() => {
      mi = (mi + 1) % msgs.length;
      setLoadMsg(msgs[mi]);
    }, 3000);
    try {
      const sys = `You are a fitness expert. Search for these YouTube videos, understand their exercise content, build a workout. Return ONLY raw JSON, no markdown.
Schema: {"name":"string","exercises":[{"id":"x","name":"string","sets":3,"reps":12,"duration":null,"restSeconds":60,"videoUrl":"youtube_url","videoStartSeconds":null,"notes":"form cue","equipment":["dumbbell"],"category":"legs","alternatives":["alt"]}]}
Limit to 6-8 exercises. Keep notes to one sentence.`;
      const msg = `Videos:\n${valid.map((u, i) => `${i + 1}. ${u}`).join('\n')}\n\nParameters: ${params.dur} min, ${params.diff}, ${params.freq}x/week, ${params.focus}, equipment: ${params.equip}\n\nSearch these videos and build a structured workout.`;
      const raw = await claudeText({
        sys,
        msg,
        search: true
      });
      clearInterval(iv);
      const parsed = extractJSON(raw);
      const dayMap = {
        '1': [3],
        '2': [1, 4],
        '3': [1, 3, 5],
        '4': [1, 2, 4, 5]
      };
      setPreview({
        ...parsed,
        id: uid(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        days: dayMap[params.freq] || [1, 3, 5],
        isPersonal: false,
        exercises: (parsed.exercises || []).map(e => ({
          ...e,
          id: uid()
        }))
      });
    } catch {
      clearInterval(iv);
      setErr('Could not generate. Try more specific URLs. (AI generation needs the API proxy — see handoff.)');
    }
    setLoading(false);
  };
  if (preview) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPreview(null),
    style: {
      background: 'transparent',
      border: 'none',
      color: t.textMute,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '16px',
      padding: 0
    }
  }, "← Regenerate"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '20px'),
      color: t.text,
      marginBottom: '12px'
    }
  }, preview.name), /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.surface,
      borderRadius: '14px',
      overflow: 'hidden',
      border: `1px solid ${t.border}`,
      marginBottom: '14px'
    }
  }, (preview.exercises || []).map((ex, i) => /*#__PURE__*/React.createElement("div", {
    key: ex.id,
    style: {
      borderTop: i > 0 ? `1px solid ${t.border}` : 'none',
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      fontWeight: '700',
      color: t.textBright
    }
  }, ex.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textDim,
      marginTop: '3px'
    }
  }, ex.sets, "×", ex.reps || ex.duration && `${ex.duration}s` || '?', " ", ex.equipment?.[0] ? `· ${ex.equipment[0]}` : ''), ex.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textFaint,
      marginTop: '2px'
    }
  }, ex.notes.slice(0, 80), ex.notes.length > 80 ? '...' : '')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      flex: 1,
      ...btn,
      background: t.surfaceRaised,
      color: t.textMute,
      padding: '13px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSave(preview),
    style: {
      flex: 2,
      ...btn,
      background: t.accent,
      color: t.accentInk,
      padding: '13px'
    }
  }, "Save Program")));
  const PBtn = ({
    k,
    opts
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
      marginBottom: '20px'
    }
  }, opts.map(([l, v]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setParams(p => ({
      ...p,
      [k]: v
    })),
    style: {
      padding: '8px 12px',
      borderRadius: '9px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '700',
      background: params[k] === v ? t.accent : t.surfaceRaised,
      color: params[k] === v ? t.accentInk : t.textMute
    }
  }, l)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: 'transparent',
      border: 'none',
      color: t.textMute,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '16px',
      padding: 0
    }
  }, "← Back"), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "YouTube Video URLs"), urls.map((u, i) => /*#__PURE__*/React.createElement("input", {
    key: i,
    value: u,
    onChange: e => {
      const n = [...urls];
      n[i] = e.target.value;
      setUrls(n);
    },
    placeholder: `Video URL ${i + 1}${i === 0 ? ' (required)' : ''}`,
    style: {
      ...inp(t),
      marginBottom: '8px'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setUrls(u => [...u, '']),
    style: {
      background: 'transparent',
      border: `1px dashed ${t.border2}`,
      color: t.textMute,
      borderRadius: '8px',
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '20px',
      width: '100%'
    }
  }, "+ Add another URL"), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Session length"), /*#__PURE__*/React.createElement(PBtn, {
    k: "dur",
    opts: [['15 min', '15'], ['30 min', '30'], ['45 min', '45'], ['60 min', '60']]
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Difficulty"), /*#__PURE__*/React.createElement(PBtn, {
    k: "diff",
    opts: [['Easy', 'easy'], ['Medium', 'medium'], ['Hard', 'hard']]
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Days per week"), /*#__PURE__*/React.createElement(PBtn, {
    k: "freq",
    opts: [['1×', '1'], ['2×', '2'], ['3×', '3'], ['4×', '4']]
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Focus"), /*#__PURE__*/React.createElement(PBtn, {
    k: "focus",
    opts: [['Full Body', 'full body'], ['Lower Body', 'lower body'], ['Upper Body', 'upper body'], ['Core', 'core']]
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Equipment"), /*#__PURE__*/React.createElement(PBtn, {
    k: "equip",
    opts: [['All', 'all'], ['Dumbbells', 'dumbbells'], ['Bodyweight', 'bodyweight'], ['Machines', 'machines']]
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.danger + '1e',
      border: `1px solid ${t.danger}44`,
      borderRadius: '10px',
      padding: '12px',
      marginBottom: '14px',
      fontSize: '13px',
      color: t.danger
    }
  }, err), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '12px',
      color: t.textDim2,
      fontSize: '13px',
      fontWeight: '500',
      marginBottom: '8px'
    }
  }, loadMsg), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      flex: 1,
      ...btn,
      background: t.surfaceRaised,
      color: t.textMute,
      padding: '13px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: generate,
    disabled: loading,
    style: {
      flex: 2,
      ...btn,
      background: loading ? t.surface3 : t.accent,
      color: loading ? t.textMute : t.accentInk,
      padding: '13px',
      cursor: loading ? 'default' : 'pointer'
    }
  }, loading ? loadMsg : 'Generate Program')));
}

// ─── EXERCISE DETAIL ──────────────────────────────────────────────────────────
function ExDetail({
  prog,
  ex,
  logs,
  today,
  onClose
}) {
  const t = useT();
  const vid = getYTId(ex.videoUrl);
  const history = Object.keys(logs).sort().reverse().slice(0, 8).map(d => {
    const s = (logs[d]?.[prog.id]?.[ex.id]?.sets || []).filter(s => s.done);
    return s.length ? {
      date: d,
      sets: s
    } : null;
  }).filter(Boolean).slice(0, 5);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: `1px solid ${t.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: '5px',
      color: prog.color
    }
  }, prog.name), /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '22px'),
      color: t.text
    }
  }, ex.name)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textMute,
      borderRadius: '50%',
      width: '34px',
      height: '34px',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginLeft: '12px'
    }
  }, "×")), vid && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      paddingBottom: '56.25%',
      background: '#000'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    src: `https://www.youtube-nocookie.com/embed/${vid}${ex.videoStartSeconds ? `?start=${ex.videoStartSeconds}&` : '?'}rel=0&modestbranding=1`,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none'
    },
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true
  })), !vid && ex.videoUrl && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: ex.videoUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      background: t.surfaceRaised,
      color: t.accent,
      borderRadius: '12px',
      padding: '14px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '700',
      border: `1px solid ${t.border2}`
    }
  }, "▷ Watch Video")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    }
  }, [[' Sets', ex.sets], ex.reps && ['Reps', ex.reps], ex.duration && ['Hold', `${ex.duration}s`], ex.restSeconds && ['Rest', `${ex.restSeconds}s`]].filter(Boolean).map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: t.surfaceRaised,
      borderRadius: '12px',
      padding: '12px 14px',
      flex: 1,
      border: `1px solid ${t.border2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: t.textFaint,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      marginBottom: '4px',
      fontWeight: '700'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '24px',
      fontWeight: '800',
      color: t.text
    }
  }, v)))), ex.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.surfaceRaised,
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '16px',
      fontSize: '13px',
      color: t.textDim,
      lineHeight: '1.7',
      borderLeft: `3px solid ${prog.color}`
    }
  }, ex.notes), ex.alternatives?.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.accent2 + '12',
      borderRadius: '10px',
      padding: '10px 14px',
      marginBottom: '16px',
      border: `1px solid ${t.accent2}30`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.accent2,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px'
    }
  }, "Alternatives"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, ex.alternatives.map(a => /*#__PURE__*/React.createElement("span", {
    key: a,
    style: {
      background: t.accent2 + '22',
      color: t.accent2,
      borderRadius: '6px',
      padding: '4px 10px',
      fontSize: '12px'
    }
  }, a)))), history.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      marginBottom: '10px'
    }
  }, "History"), history.map(({
    date,
    sets
  }) => /*#__PURE__*/React.createElement("div", {
    key: date,
    style: {
      marginBottom: '8px',
      background: t.surfaceRaised,
      borderRadius: '10px',
      padding: '10px 14px',
      border: `1px solid ${t.border2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      fontWeight: '700',
      marginBottom: '4px'
    }
  }, fmtDate(date)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: t.textDim
    }
  }, sets.map((s, i) => `${i > 0 ? ', ' : ''}${s.weight > 0 ? `${s.weight}${t.unit}×` : ''}${s.reps}r`)))))));
}

// ─── EDIT EXERCISE (with photo fill) ─────────────────────────────────────────
function EditEx({
  ex,
  onSave,
  onCancel
}) {
  const t = useT();
  const [form, setForm] = useState(ex || {
    id: uid(),
    name: '',
    sets: 3,
    reps: 10,
    duration: null,
    restSeconds: 60,
    videoUrl: '',
    videoStartSeconds: null,
    tsStr: '',
    notes: '',
    equipment: ['bodyweight'],
    category: 'legs',
    alternatives: []
  });
  const [altStr, setAltStr] = useState((ex?.alternatives || []).join('\n'));
  const [findingTS, setFindingTS] = useState(false);
  const [fillMsg, setFillMsg] = useState('');
  const handlePhotoFill = parsed => {
    setFillMsg('');
    try {
      const data = typeof parsed === 'string' ? extractJSON(parsed) : parsed;
      setForm(f => ({
        ...f,
        name: data.name || f.name,
        sets: data.sets || f.sets,
        reps: data.reps || f.reps,
        duration: data.duration || f.duration,
        restSeconds: data.restSeconds || f.restSeconds,
        notes: data.notes || f.notes,
        videoUrl: data.videoUrl || f.videoUrl,
        alternatives: data.alternatives?.length ? data.alternatives : f.alternatives
      }));
      if (data.alternatives?.length) setAltStr(data.alternatives.join('\n'));
      setFillMsg('Fields filled from screenshot. Review and adjust below.');
    } catch {
      setFillMsg('Read the screenshot but could not extract all fields. Fill in the rest manually.');
    }
  };
  const findTimestamp = async () => {
    if (!form.videoUrl || !form.name) return;
    setFindingTS(true);
    try {
      const sys = 'Find the timestamp in a YouTube video where a specific exercise is demonstrated. Return ONLY JSON: {"startSeconds":120,"notes":"key form cue from that section"}';
      const raw = await claudeText({
        sys,
        msg: `URL: ${form.videoUrl}\nExercise: ${form.name}\nFind where ${form.name} is demonstrated.`,
        search: true
      });
      const data = extractJSON(raw);
      if (data.startSeconds) {
        setForm(f => ({
          ...f,
          videoStartSeconds: data.startSeconds,
          tsStr: fmtTS(data.startSeconds)
        }));
        if (data.notes) setForm(f => ({
          ...f,
          notes: f.notes ? f.notes + '\n' + data.notes : data.notes
        }));
      }
    } catch {}
    setFindingTS(false);
  };
  const save = () => {
    if (!form.name.trim()) return;
    const alts = altStr.split('\n').map(s => s.trim()).filter(Boolean);
    const vStart = form.tsStr ? parseTS(form.tsStr) : form.videoStartSeconds;
    onSave({
      ...form,
      alternatives: alts,
      videoStartSeconds: vStart,
      tsStr: undefined
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '21px'),
      color: t.text
    }
  }, ex ? 'Edit Exercise' : 'New Exercise'), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textMute,
      borderRadius: '50%',
      width: '34px',
      height: '34px',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "×")), /*#__PURE__*/React.createElement(PhotoFill, {
    mode: "single",
    label: "Fill from screenshot",
    onData: handlePhotoFill
  }), fillMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: fillMsg.startsWith('Fields filled') ? t.success : t.danger,
      marginBottom: '14px',
      marginTop: '-8px',
      lineHeight: '1.5'
    }
  }, fillMsg), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${t.border}`,
      paddingTop: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      marginBottom: '14px'
    }
  }, "Or fill manually"), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Exercise Name"), /*#__PURE__*/React.createElement("input", {
    value: form.name,
    onChange: e => setForm(f => ({
      ...f,
      name: e.target.value
    })),
    placeholder: "e.g. Hip Thrust",
    style: inp(t)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Sets"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: form.sets,
    onChange: e => setForm(f => ({
      ...f,
      sets: Math.max(1, parseInt(e.target.value) || 1)
    })),
    style: inp(t)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Reps"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: form.reps || '',
    onChange: e => setForm(f => ({
      ...f,
      reps: parseInt(e.target.value) || null
    })),
    placeholder: "—",
    style: inp(t)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Hold (sec)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: form.duration || '',
    onChange: e => setForm(f => ({
      ...f,
      duration: parseInt(e.target.value) || null
    })),
    placeholder: "—",
    style: inp(t)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Rest (sec)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: form.restSeconds || '',
    onChange: e => setForm(f => ({
      ...f,
      restSeconds: parseInt(e.target.value) || null
    })),
    placeholder: "60",
    style: inp(t)
  }))), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Video URL"), /*#__PURE__*/React.createElement("input", {
    value: form.videoUrl || '',
    onChange: e => setForm(f => ({
      ...f,
      videoUrl: e.target.value
    })),
    placeholder: "YouTube or any link",
    style: inp(t)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      marginTop: '-10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Start at (MM:SS)"), /*#__PURE__*/React.createElement("input", {
    value: form.tsStr || (form.videoStartSeconds ? fmtTS(form.videoStartSeconds) : ''),
    onChange: e => setForm(f => ({
      ...f,
      tsStr: e.target.value
    })),
    placeholder: "e.g. 2:30",
    style: {
      ...inp(t),
      marginBottom: 0
    }
  })), form.videoUrl && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      paddingTop: '20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: findTimestamp,
    disabled: findingTS,
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: findingTS ? t.textMute : t.accent,
      borderRadius: '10px',
      padding: '12px 10px',
      cursor: findingTS ? 'default' : 'pointer',
      fontSize: '11px',
      fontWeight: '700',
      whiteSpace: 'nowrap'
    }
  }, findingTS ? 'Finding...' : 'Find with AI'))), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Coaching Notes"), /*#__PURE__*/React.createElement("textarea", {
    value: form.notes || '',
    onChange: e => setForm(f => ({
      ...f,
      notes: e.target.value
    })),
    placeholder: "Form cues, what to focus on...",
    rows: 3,
    style: {
      ...inp(t),
      resize: 'vertical',
      lineHeight: '1.7'
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Alternatives (one per line)"), /*#__PURE__*/React.createElement("textarea", {
    value: altStr,
    onChange: e => setAltStr(e.target.value),
    placeholder: "Hip Thrust\nSingle-Leg Glute Bridge",
    rows: 2,
    style: {
      ...inp(t),
      resize: 'vertical'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      flex: 1,
      ...btn,
      background: t.surfaceRaised,
      color: t.textMute,
      padding: '13px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      flex: 2,
      ...btn,
      background: t.accent,
      color: t.accentInk,
      padding: '13px'
    }
  }, "Save Exercise")));
}

// ─── EDIT PROGRAM ─────────────────────────────────────────────────────────────
function EditProg({
  prog,
  onSave,
  onCancel
}) {
  const t = useT();
  const [form, setForm] = useState({
    ...prog
  });
  const isNew = !prog.name;
  const tDay = d => setForm(f => ({
    ...f,
    days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d].sort((a, b) => a - b)
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...head(t, '21px'),
      color: t.text
    }
  }, isNew ? 'New Program' : 'Edit Program'), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      background: t.surfaceRaised,
      border: 'none',
      color: t.textMute,
      borderRadius: '50%',
      width: '34px',
      height: '34px',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "×")), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    value: form.name,
    onChange: e => setForm(f => ({
      ...f,
      name: e.target.value
    })),
    placeholder: "e.g. Glute Circuit",
    style: inp(t),
    autoFocus: true
  }), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Color"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }
  }, COLORS.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    onClick: () => setForm(f => ({
      ...f,
      color: c
    })),
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: c,
      cursor: 'pointer',
      border: form.color === c ? `3px solid ${t.text}` : '3px solid transparent',
      boxSizing: 'border-box',
      boxShadow: form.color === c ? `0 0 10px ${c}60` : 'none',
      transition: 'all 0.15s'
    }
  }))), /*#__PURE__*/React.createElement("label", {
    style: lbl(t)
  }, "Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }
  }, DAYS_S.map((d, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => tDay(i),
    style: {
      padding: '8px 12px',
      borderRadius: '9px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '700',
      background: form.days.includes(i) ? form.color : t.surfaceRaised,
      color: form.days.includes(i) ? '#fff' : t.textMute
    }
  }, d))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      marginBottom: '24px',
      userSelect: 'none'
    },
    onClick: () => setForm(f => ({
      ...f,
      isPersonal: !f.isPersonal
    }))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      background: form.isPersonal ? t.accent2 : t.surfaceRaised,
      position: 'relative',
      transition: 'background 0.2s',
      flexShrink: 0,
      border: `1px solid ${form.isPersonal ? t.accent2 : t.border2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#fff',
      position: 'absolute',
      top: '1px',
      left: form.isPersonal ? '21px' : '1px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      fontWeight: '700',
      color: t.textBright
    }
  }, "Personal (purchased content)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: t.textMute,
      marginTop: '2px'
    }
  }, "Stays private, not shareable"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      flex: 1,
      ...btn,
      background: t.surfaceRaised,
      color: t.textMute,
      padding: '13px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (form.name.trim()) onSave(form);
    },
    style: {
      flex: 2,
      ...btn,
      background: form.color,
      color: '#fff',
      padding: '13px'
    }
  }, "Save Program")));
}
function NavIc({
  id,
  active
}) {
  const t = useT();
  const c = active ? t.accent : t.textFaint;
  const w = 18;
  if (id === 'today') return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: w,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
  }));
  if (id === 'history') return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: w,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "22 12 18 12 15 21 9 3 6 12 2 12"
  }));
  if (id === 'programs') return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: w,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
  }));
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: w,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20h9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));