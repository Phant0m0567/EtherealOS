const { useEffect, useRef, useState } = React;
const APPS = {
    files: { id: 'files', title: 'Files', icon: 'files', kind: 'files' },
    terminal: { id: 'terminal', title: 'Terminal', icon: 'terminal', kind: 'terminal' },
    terminal2: { id: 'terminal2', title: 'Terminal', icon: 'terminal-solid', kind: 'terminal' },
    notes: { id: 'notes', title: 'Notes', icon: 'notes', kind: 'notes' },
    calculator: { id: 'calculator', title: 'Calculator', icon: 'calculator', kind: 'calculator' },
    settings: { id: 'settings', title: 'Settings', icon: 'settings', kind: 'settings' },
    browser: { id: 'browser', title: 'Steam', icon: 'steam', kind: 'browser' },
    steam: { id: 'steam', title: 'Steam', icon: 'steam', kind: 'browser' },
    appcenter: { id: 'appcenter', title: 'App Center', icon: 'appgrid', kind: 'appcenter' },
    brave: { id: 'brave', title: 'Brave', icon: 'brave', kind: 'browser' },
    code: { id: 'code', title: 'VS Code', icon: 'vscode', kind: 'browser' },
    youtube: { id: 'youtube', title: 'YouTube', icon: 'youtube', kind: 'browser' },
    reddit: { id: 'reddit', title: 'Reddit', icon: 'reddit', kind: 'browser' },
    whatsapp: { id: 'whatsapp', title: 'WhatsApp', icon: 'whatsapp', kind: 'browser' },
    discord: { id: 'discord', title: 'Discord', icon: 'discord', kind: 'browser' },
    telegram: { id: 'telegram', title: 'Telegram', icon: 'telegram', kind: 'browser' },
    contacts: { id: 'contacts', title: 'Contacts', icon: 'contacts', kind: 'browser' },
    chatgpt: { id: 'chatgpt', title: 'ChatGPT', icon: 'chatgpt', kind: 'browser' },
    gemini: { id: 'gemini', title: 'Gemini', icon: 'gemini', kind: 'browser' },
    docs2: { id: 'docs2', title: 'Documents', icon: 'docs', kind: 'browser' },
    docs: { id: 'docs', title: 'Docs', icon: 'docs', kind: 'browser' },
    media: { id: 'media', title: 'Media', icon: 'media', kind: 'browser' },
};
const BRAND_URLS = {
    brave: 'https://cdn.simpleicons.org/brave/ffffff/ff5f19',
    chatgpt: 'https://cdn.simpleicons.org/openai/111111',
    discord: 'https://cdn.simpleicons.org/discord/5865F2',
    docs: 'https://cdn.simpleicons.org/googledocs/4285F4',
    gemini: 'https://cdn.simpleicons.org/googlegemini/8E75FF',
    reddit: 'https://cdn.simpleicons.org/reddit/FF4500',
    steam: 'https://cdn.simpleicons.org/steam/66c0f4',
    telegram: 'https://cdn.simpleicons.org/telegram/26A5E4',
    vscode: 'https://cdn.simpleicons.org/visualstudiocode/23A8F2',
    whatsapp: 'https://cdn.simpleicons.org/whatsapp/25D366',
    youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
};
function BrandIcon({ name, size = 30, className = '' }) {
    const src = BRAND_URLS[name];
    const localBrand = name === 'chatgpt' || name === 'discord' || name === 'vscode';
    if (!src)
        return React.createElement(ImgIcon, { name: name, size: size, className: className });
    if (localBrand)
        return React.createElement("span", { className: `brand-tile ${name} ${className}` },
            React.createElement("img", { src: `${'./'}icons/${name}.svg`, width: size, height: size, draggable: "false", alt: "" }));
    return React.createElement("span", { className: `brand-tile ${name} ${className}` },
        React.createElement("img", { src: src, width: size, height: size, draggable: "false", alt: "" }));
}
function ImgIcon({ name, size = 24, className = '' }) {
    return React.createElement("img", { className: `svg-icon ${className}`, src: `${'./'}icons/${name}.svg`, width: size, height: size, draggable: "false", alt: "" });
}
function StatusPopover({ type, battery, batterySupported, temp, wifiOnline, volume, muted, setVolume, setMuted, close }) {
    var _a, _b;
    if (type === 'wifi')
        return React.createElement("div", { className: "status-popover", onClick: e => e.stopPropagation() },
            React.createElement("div", { className: "status-popover-title" },
                React.createElement(ImgIcon, { name: "wifi", size: 18 }),
                " Wi-Fi"),
            React.createElement("div", { className: "status-row" },
                React.createElement("span", null, "Status"),
                React.createElement("b", null, wifiOnline ? 'Connected' : 'Offline')),
            React.createElement("div", { className: "status-note" }, "Browser pages can read connection state, but cannot toggle your computer's Wi-Fi adapter."));
    if (type === 'volume')
        return React.createElement("div", { className: "status-popover", onClick: e => e.stopPropagation() },
            React.createElement("div", { className: "status-popover-title" },
                React.createElement(ImgIcon, { name: muted || volume === 0 ? 'volume-muted' : 'volume', size: 18 }),
                " Volume"),
            React.createElement("div", { className: "volume-control" },
                React.createElement("input", { type: "range", min: "0", max: "100", value: muted ? 0 : volume, onChange: e => { setMuted(false); setVolume(Number(e.target.value)); } }),
                React.createElement("b", null,
                    muted ? 0 : volume,
                    "%")),
            React.createElement("button", { className: "popover-action", onClick: () => setMuted(v => !v) }, muted ? 'Unmute' : 'Mute'),
            React.createElement("div", { className: "status-note" }, "This slider controls the Web OS UI volume only; browsers cannot change the computer's master volume."));
    if (type === 'battery')
        return React.createElement("div", { className: "status-popover", onClick: e => e.stopPropagation() },
            React.createElement("div", { className: "status-popover-title" },
                React.createElement(ImgIcon, { name: batteryIconName((_a = battery === null || battery === void 0 ? void 0 : battery.level) !== null && _a !== void 0 ? _a : null, battery === null || battery === void 0 ? void 0 : battery.charging), size: 18 }),
                " Battery"),
            batterySupported ? React.createElement(React.Fragment, null,
                React.createElement("div", { className: "status-row" },
                    React.createElement("span", null, "Charge"),
                    React.createElement("b", null,
                        Math.round(((_b = battery === null || battery === void 0 ? void 0 : battery.level) !== null && _b !== void 0 ? _b : 0) * 100),
                        "%")),
                React.createElement("div", { className: "status-row" },
                    React.createElement("span", null, "Power"),
                    React.createElement("b", null, (battery === null || battery === void 0 ? void 0 : battery.charging) ? 'Charging' : 'On battery'))) : React.createElement("div", { className: "status-note" }, "Battery information is not exposed by this browser."));
    if (type === 'temp')
        return React.createElement("div", { className: "status-popover", onClick: e => e.stopPropagation() },
            React.createElement("div", { className: "status-popover-title" },
                React.createElement(ImgIcon, { name: "temp", size: 18 }),
                " Temperature"),
            React.createElement("div", { className: "status-row" },
                React.createElement("span", null, "Local temperature"),
                React.createElement("b", null, temp)),
            React.createElement("div", { className: "status-note" }, "Uses your browser's location permission and Open-Meteo. If location is denied, the value stays \u201C-\u201D."));
    return null;
}
function batteryIconName(level, charging) {
    if (charging)
        return 'battery-charging';
    if (level == null)
        return 'battery';
    const pct = level * 100;
    if (pct <= 15)
        return 'battery-empty';
    if (pct <= 35)
        return 'battery-low';
    if (pct <= 65)
        return 'battery-medium';
    if (pct <= 85)
        return 'battery-high';
    return 'battery-full';
}
function TopBar({ activeApp, onOpenActive }) {
    var _a;
    const [now, setNow] = useState(new Date());
    const [temp, setTemp] = useState('-');
    const [battery, setBattery] = useState(null);
    const [batterySupported, setBatterySupported] = useState(true);
    const [wifiOnline, setWifiOnline] = useState(navigator.onLine);
    const [volume, setVolume] = useState(68);
    const [muted, setMuted] = useState(false);
    const [popover, setPopover] = useState(null);
    useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
    useEffect(() => {
        let cancelled = false;
        if (!navigator.geolocation) {
            setTemp('-');
            return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
            var _a;
            try {
                const { latitude, longitude } = pos.coords;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m&temperature_unit=fahrenheit`;
                const r = await fetch(url, { headers: { Accept: 'application/json' } });
                if (!r.ok)
                    throw new Error('weather request failed');
                const data = await r.json();
                if (!cancelled && typeof ((_a = data === null || data === void 0 ? void 0 : data.current) === null || _a === void 0 ? void 0 : _a.temperature_2m) === 'number')
                    setTemp(`${Math.round(data.current.temperature_2m)}°F`);
            }
            catch (_b) {
                if (!cancelled)
                    setTemp('-');
            }
        }, () => setTemp('-'), { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 });
        return () => { cancelled = true; };
    }, []);
    useEffect(() => {
        const online = () => setWifiOnline(true), offline = () => setWifiOnline(false);
        window.addEventListener('online', online);
        window.addEventListener('offline', offline);
        return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
    }, []);
    useEffect(() => {
        let mounted = true;
        if (!navigator.getBattery) {
            setBatterySupported(false);
            return;
        }
        navigator.getBattery().then(b => {
            if (!mounted)
                return;
            const sync = () => setBattery({ level: b.level, charging: b.charging });
            sync();
            b.addEventListener('levelchange', sync);
            b.addEventListener('chargingchange', sync);
            return () => { b.removeEventListener('levelchange', sync); b.removeEventListener('chargingchange', sync); };
        }).catch(() => setBatterySupported(false));
        return () => { mounted = false; };
    }, []);
    useEffect(() => {
        const close = () => setPopover(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);
    const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const current = activeApp || { title: 'Desktop', icon: null, id: null };
    const toggle = name => e => { e.stopPropagation(); setPopover(v => v === name ? null : name); };
    return React.createElement("header", { className: "topbar" },
        React.createElement("div", { className: "top-clock", "aria-label": "Current date and time" },
            date,
            " ",
            React.createElement("span", null, time)),
        React.createElement("button", { className: `activity-panel ${current.id ? 'has-active-app' : 'is-desktop'}`, onClick: () => current.id && onOpenActive(current.id), disabled: !current.id, "aria-label": current.title },
            current.id && React.createElement("span", { className: "activity-brand" }, BRAND_URLS[current.icon] ? React.createElement(BrandIcon, { name: current.icon, size: 22 }) : React.createElement(ImgIcon, { name: current.icon, size: 22 })),
            React.createElement("span", { className: "activity-copy" },
                React.createElement("b", null, current.title))),
        React.createElement("div", { className: "top-stats" },
            React.createElement("button", { className: "status-button", onClick: toggle('temp'), title: "Location temperature" },
                React.createElement(ImgIcon, { name: "temp", size: 14 }),
                React.createElement("span", null, temp)),
            React.createElement("button", { className: "status-button", onClick: toggle('wifi'), title: "Wi-Fi status" },
                React.createElement(ImgIcon, { name: wifiOnline ? 'wifi' : 'wifi-off', size: 15 })),
            React.createElement("button", { className: "status-button", onClick: toggle('volume'), title: "Volume" },
                React.createElement(ImgIcon, { name: muted || volume === 0 ? 'volume-muted' : 'volume', size: 15 })),
            React.createElement("button", { className: "status-button", onClick: toggle('battery'), title: batterySupported && battery ? `${Math.round(battery.level * 100)}% battery` : 'Battery' },
                React.createElement(ImgIcon, { name: batteryIconName((_a = battery === null || battery === void 0 ? void 0 : battery.level) !== null && _a !== void 0 ? _a : null, battery === null || battery === void 0 ? void 0 : battery.charging), size: 16 }),
                batterySupported && battery ? React.createElement("span", null,
                    Math.round(battery.level * 100),
                    "%") : null),
            popover && React.createElement(StatusPopover, { type: popover, battery: battery, batterySupported: batterySupported, temp: temp, wifiOnline: wifiOnline, volume: volume, muted: muted, setVolume: setVolume, setMuted: setMuted, close: () => setPopover(null) })));
}
const dockItems = [
    ['files', 'finder', 'local'],
    ['docs2', 'document-blue', 'local'],
    ['contacts', 'contacts', 'local'],
    ['chatgpt', 'chatgpt', 'brand'],
    ['brave', 'brave', 'brand'],
    ['gemini', 'gemini', 'brand'],
    ['terminal', 'terminal-cat', 'local'],
    ['terminal2', 'terminal-solid', 'local'],
    ['youtube', 'youtube', 'brand'],
    ['reddit', 'reddit', 'brand'],
    ['whatsapp', 'whatsapp', 'brand'],
    ['steam', 'steam', 'brand'],
    ['discord', 'discord', 'brand'],
    ['code', 'vscode', 'brand'],
    ['docs', 'docs', 'brand'],
    ['notes', 'notes-color', 'local'],
    ['telegram', 'telegram', 'brand'],
    ['calculator', 'calculator-color', 'local'],
    ['media', 'media', 'local'],
];
function Dock({ open, onLaunch, onOverview }) {
    const [hover, setHover] = useState(null);
    return React.createElement("div", { className: "dock-shell" },
        React.createElement("div", { className: "dock", onMouseLeave: () => setHover(null) },
            dockItems.map(([id, icon, type], i) => {
                var _a;
                return React.createElement("button", { key: id, className: `dock-item ${open[id] ? 'active' : ''}`, onMouseEnter: () => setHover(i), onClick: () => onLaunch(id), title: ((_a = APPS[id]) === null || _a === void 0 ? void 0 : _a.title) || id },
                    React.createElement("span", { className: "dock-reflection" }),
                    React.createElement("span", { className: `dock-icon-wrap ${hover === i ? 'hovered' : ''}` }, type === 'brand' ? React.createElement(BrandIcon, { name: icon, size: 30 }) : React.createElement(ImgIcon, { name: icon, size: 30 })));
            }),
            React.createElement("span", { className: "dock-separator", "aria-hidden": "true" }),
            React.createElement("button", { className: "dock-item dock-apps", onClick: onOverview, title: "Show Applications" },
                React.createElement("span", { className: "dock-icon-wrap" },
                    React.createElement(ImgIcon, { name: "appgrid-color", size: 32 })))));
}
function Window({ win, children, onFocus, onClose, onMin, onMax, onDrag }) {
    const drag = useRef(null);
    const start = e => { if (e.button !== 0)
        return; onFocus(win.id); if (win.maximized)
        return; drag.current = { x: e.clientX, y: e.clientY, l: win.x, t: win.y }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop); };
    const move = e => { if (!drag.current)
        return; onDrag(win.id, { x: Math.max(54, drag.current.l + e.clientX - drag.current.x), y: Math.max(34, drag.current.t + e.clientY - drag.current.y) }); };
    const stop = () => { drag.current = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    return React.createElement("div", { className: `window ${win.maximized ? 'maximized ' : ''}${win.minimized ? 'minimized' : ''}`, style: { left: win.maximized ? 54 : win.x, top: win.maximized ? 31 : win.y, width: win.maximized ? 'calc(100% - 54px)' : win.w, height: win.maximized ? 'calc(100% - 31px)' : win.h, zIndex: win.z }, onPointerDown: () => onFocus(win.id) },
        React.createElement("div", { className: "titlebar", onPointerDown: start },
            React.createElement("div", { className: "window-title" }, win.title),
            React.createElement("div", { className: "window-controls" },
                React.createElement("button", { onClick: e => { e.stopPropagation(); onMin(win.id); } }, "\u2212"),
                React.createElement("button", { onClick: e => { e.stopPropagation(); onMax(win.id); } }, "\u25A1"),
                React.createElement("button", { className: "close", onClick: e => { e.stopPropagation(); onClose(win.id); } }, "\u00D7"))),
        React.createElement("div", { className: "window-content" }, children));
}
function Terminal() {
    const [lines, setLines] = useState(['Welcome to UbuntuOS Terminal.', 'This terminal is offline and simulated for the desktop preview.', '']);
    const [cmd, setCmd] = useState('');
    const input = useRef(null);
    const run = () => { const c = cmd.trim(); if (!c)
        return; let out = ''; if (c === 'help')
        out = 'apps  files  clear  date  echo <text>';
    else if (c === 'apps')
        out = 'Files  Terminal  Notes  Calculator  Settings';
    else if (c === 'files')
        out = 'Home/  Documents/  Downloads/  Pictures/';
    else if (c === 'clear') {
        setLines([]);
        setCmd('');
        return;
    }
    else if (c === 'date')
        out = new Date().toString();
    else if (c.startsWith('echo '))
        out = c.slice(5);
    else
        out = `Command not found: ${c}`; setLines(v => [...v, `user@ubuntuos:~$ ${c}`, out]); setCmd(''); };
    return React.createElement("div", { className: "terminal", onClick: () => { var _a; return (_a = input.current) === null || _a === void 0 ? void 0 : _a.focus(); } },
        React.createElement("div", null, lines.map((x, i) => React.createElement("div", { key: i }, x))),
        React.createElement("div", { className: "prompt" },
            React.createElement("span", null, "user@ubuntuos:~$"),
            React.createElement("input", { ref: input, value: cmd, onChange: e => setCmd(e.target.value), onKeyDown: e => e.key === 'Enter' && run(), autoFocus: true })));
}
function Files() { return React.createElement("div", { className: "files-app" },
    React.createElement("aside", null,
        React.createElement("b", null, "Home"),
        React.createElement("div", null, "Starred"),
        React.createElement("div", null, "Documents"),
        React.createElement("div", null, "Downloads"),
        React.createElement("div", null, "Pictures"),
        React.createElement("div", null, "Music"),
        React.createElement("div", null, "Videos"),
        React.createElement("div", null, "Trash")),
    React.createElement("main", null,
        React.createElement("div", { className: "path" }, "Home"),
        React.createElement("div", { className: "file-grid" },
            React.createElement("div", { className: "file-card" },
                React.createElement(ImgIcon, { name: "files", size: 48 }),
                React.createElement("span", null, "Documents")),
            React.createElement("div", { className: "file-card" },
                React.createElement(ImgIcon, { name: "files", size: 48 }),
                React.createElement("span", null, "Downloads")),
            React.createElement("div", { className: "file-card" },
                React.createElement(ImgIcon, { name: "files", size: 48 }),
                React.createElement("span", null, "Pictures"))))); }
function Notes() { const [v, setV] = useState(() => localStorage.getItem('ubuntuos-note') || ''); return React.createElement("div", { className: "notes" },
    React.createElement("textarea", { value: v, onChange: e => { setV(e.target.value); localStorage.setItem('ubuntuos-note', e.target.value); }, placeholder: "Start writing\u2026" })); }
function Calculator() { const [v, setV] = useState(''); const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+', 'C']; const press = k => { if (k === 'C')
    return setV(''); if (k === '=') {
    try {
        setV(String(Function('return ' + v.replaceAll('×', '*').replaceAll('÷', '/'))()));
    }
    catch (_a) {
        setV('Error');
    }
    return;
} setV(x => x + k); }; return React.createElement("div", { className: "calculator" },
    React.createElement("div", { className: "calc-display" }, v || '0'),
    React.createElement("div", { className: "calc-grid" }, keys.map(k => React.createElement("button", { key: k, onClick: () => press(k), className: k === '=' ? 'equals' : '' }, k)))); }
function Settings() { return React.createElement("div", { className: "settings" },
    React.createElement("h2", null, "Settings"),
    React.createElement("div", { className: "setting" },
        React.createElement("b", null, "Appearance"),
        React.createElement("p", null, "UbuntuOS GNOME-style desktop shell")),
    React.createElement("div", { className: "setting" },
        React.createElement("b", null, "Desktop"),
        React.createElement("p", null, "Top bar, centered clock, bottom dock, rounded windows")),
    React.createElement("div", { className: "setting" },
        React.createElement("b", null, "Backend"),
        React.createElement("p", null, "Remote browser is intentionally left disconnected in this UI-first build."))); }
const EXTERNAL_URLS = {
    brave: 'https://search.brave.com/',
    chatgpt: 'https://chatgpt.com/',
    discord: 'https://discord.com/app',
    gemini: 'https://gemini.google.com/',
    youtube: 'https://www.youtube.com/',
    reddit: 'https://www.reddit.com/',
    whatsapp: 'https://web.whatsapp.com/',
    steam: 'https://store.steampowered.com/',
    code: 'https://vscode.dev/',
    docs: 'https://docs.google.com/',
    docs2: 'https://drive.google.com/',
    telegram: 'https://web.telegram.org/',
    contacts: 'https://contacts.google.com/',
    media: 'https://music.youtube.com/'
};
function Browser({ appId = 'steam', title = 'Browser', icon = 'brave' }) {
    const url = EXTERNAL_URLS[appId] || EXTERNAL_URLS.brave;
    const isProblemApp = appId === 'chatgpt' || appId === 'discord';
    const openExternal = () => window.open(url, '_blank', 'noopener,noreferrer');
    return React.createElement("div", { className: `browser ${isProblemApp ? 'browser-app-shell' : ''}` },
        React.createElement("div", { className: "browser-toolbar" },
            React.createElement(ImgIcon, { name: icon || 'brave', size: 24 }),
            React.createElement("button", null, "\u2190"),
            React.createElement("button", null, "\u2192"),
            React.createElement("button", null, "\u21BB"),
            React.createElement("div", { className: "address" }, url),
            React.createElement("button", { onClick: openExternal }, "Open externally")),
        React.createElement("div", { className: "browser-body" },
            React.createElement("div", { className: "browser-launch-card" },
                React.createElement(ImgIcon, { name: icon || 'brave', size: 56 }),
                React.createElement("h2", null, title),
                React.createElement("p", null, isProblemApp ? 'This service does not allow reliable embedding inside another webpage. Launch the official site in a new tab.' : 'Launch the official website in a new tab.'),
                React.createElement("button", { className: "primary-launch", onClick: openExternal },
                    "Open ",
                    title),
                React.createElement("div", { className: "browser-url" }, url))));
}
function AppCenter({ onLaunch }) { return React.createElement("div", { className: "app-center" },
    React.createElement("aside", null,
        React.createElement("h2", null, "App Center"),
        React.createElement("div", { className: "nav active" }, "Explore"),
        React.createElement("div", { className: "nav" }, "Featured"),
        React.createElement("div", { className: "nav" }, "Productivity"),
        React.createElement("div", { className: "nav" }, "Development"),
        React.createElement("div", { className: "nav" }, "Graphics"),
        React.createElement("div", { className: "nav" }, "Games"),
        React.createElement("div", { className: "nav" }, "System")),
    React.createElement("main", null,
        React.createElement("input", { placeholder: "Search for apps\u2026" }),
        React.createElement("section", { className: "featured" },
            React.createElement("h2", null, "Featured Apps"),
            React.createElement("p", null, "Discover applications for your Ubuntu Web OS.")),
        React.createElement("h3", null, "Applications"),
        React.createElement("div", { className: "cards" }, ['Files', 'Terminal', 'Notes', 'Calculator', 'Settings', 'Steam'].map(n => React.createElement("div", { className: "card", key: n },
            React.createElement("div", { className: "card-icon" },
                React.createElement(ImgIcon, { name: n === 'Steam' ? 'appgrid' : n.toLowerCase(), size: 40 })),
            React.createElement("div", null,
                React.createElement("b", null, n),
                React.createElement("p", null, "Ubuntu Web OS")),
            React.createElement("button", { onClick: () => onLaunch(n === 'Steam' ? 'browser' : n.toLowerCase()) }, "Open")))))); }
function App() {
    const [wins, setWins] = useState({});
    const [z, setZ] = useState(20);
    const [overview, setOverview] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const launch = id => { if (!APPS[id])
        return; setWins(v => v[id] ? Object.assign(Object.assign({}, v), { [id]: Object.assign(Object.assign({}, v[id]), { minimized: false, z: z + 1 }) }) : Object.assign(Object.assign({}, v), { [id]: Object.assign(Object.assign({}, APPS[id]), { x: window.innerWidth > 1000 ? Math.round(window.innerWidth / 2 - 340) : 90, y: 90, w: 680, h: 430, z: z + 1, minimized: false, maximized: false }) })); setZ(v => v + 1); setActiveId(id); setOverview(false); };
    useEffect(() => { const h = e => launch(e.detail); window.addEventListener('ubuntuos:open', h); return () => window.removeEventListener('ubuntuos:open', h); }, [z]);
    const close = id => { setWins(v => { const n = Object.assign({}, v); delete n[id]; return n; }); setActiveId(v => v === id ? null : v); };
    const min = id => { setWins(v => (Object.assign(Object.assign({}, v), { [id]: Object.assign(Object.assign({}, v[id]), { minimized: true }) }))); setActiveId(v => v === id ? null : v); };
    const max = id => setWins(v => (Object.assign(Object.assign({}, v), { [id]: Object.assign(Object.assign({}, v[id]), { maximized: !v[id].maximized }) })));
    const focus = id => { setZ(v => v + 1); setWins(v => (Object.assign(Object.assign({}, v), { [id]: Object.assign(Object.assign({}, v[id]), { z: z + 1, minimized: false }) }))); setActiveId(id); };
    const drag = (id, pos) => setWins(v => (Object.assign(Object.assign({}, v), { [id]: Object.assign(Object.assign({}, v[id]), pos) })));
    const visible = Object.values(wins).filter(w => !w.minimized);
    const activeApp = activeId && wins[activeId] && !wins[activeId].minimized ? APPS[activeId] : null;
    return React.createElement("div", { className: "os" },
        React.createElement("div", { className: "wallpaper", "aria-hidden": "true", style: { backgroundImage: `url(${'./'}yaru-mountain-wallpaper.jpg)` } }),
        React.createElement(TopBar, { activeApp: activeApp, onOpenActive: launch }),
        React.createElement(Dock, { open: wins, onLaunch: launch, onOverview: () => setOverview(v => !v) }),
        visible.map(w => React.createElement(Window, { key: w.id, win: w, onFocus: focus, onClose: close, onMin: min, onMax: max, onDrag: drag }, w.kind === 'terminal' ? React.createElement(Terminal, null) : w.kind === 'files' ? React.createElement(Files, null) : w.kind === 'notes' ? React.createElement(Notes, null) : w.kind === 'calculator' ? React.createElement(Calculator, null) : w.kind === 'settings' ? React.createElement(Settings, null) : w.kind === 'browser' ? React.createElement(Browser, { appId: w.id, title: w.title, icon: w.icon }) : React.createElement(AppCenter, { onLaunch: launch }))),
        overview && React.createElement("div", { className: "overview", onClick: () => setOverview(false) },
            React.createElement("div", { className: "overview-search", onClick: e => e.stopPropagation() }, "Type to search"),
            React.createElement("div", { className: "overview-grid", onClick: e => e.stopPropagation() }, Object.values(APPS).filter(a => ['files', 'terminal', 'notes', 'calculator', 'settings', 'browser', 'appcenter'].includes(a.id)).map(a => React.createElement("button", { key: a.id, onClick: () => launch(a.id) },
                React.createElement(ImgIcon, { name: a.icon, size: 36 }),
                React.createElement("span", null, a.title))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
