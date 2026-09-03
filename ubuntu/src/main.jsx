import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
const APPS = {
  files:{id:'files',title:'Files',icon:'files',kind:'files'},
  terminal:{id:'terminal',title:'Terminal',icon:'terminal',kind:'terminal'},
  terminal2:{id:'terminal2',title:'Terminal',icon:'terminal-solid',kind:'terminal'},
  notes:{id:'notes',title:'Notes',icon:'notes',kind:'notes'},
  calculator:{id:'calculator',title:'Calculator',icon:'calculator',kind:'calculator'},
  settings:{id:'settings',title:'Settings',icon:'settings',kind:'settings'},
  browser:{id:'browser',title:'Steam',icon:'steam',kind:'browser'},
  steam:{id:'steam',title:'Steam',icon:'steam',kind:'browser'},
  appcenter:{id:'appcenter',title:'App Center',icon:'appgrid',kind:'appcenter'},
  brave:{id:'brave',title:'Brave',icon:'brave',kind:'browser'},
  code:{id:'code',title:'VS Code',icon:'vscode',kind:'browser'},
  youtube:{id:'youtube',title:'YouTube',icon:'youtube',kind:'browser'},
  reddit:{id:'reddit',title:'Reddit',icon:'reddit',kind:'browser'},
  whatsapp:{id:'whatsapp',title:'WhatsApp',icon:'whatsapp',kind:'browser'},
  discord:{id:'discord',title:'Discord',icon:'discord',kind:'browser'},
  telegram:{id:'telegram',title:'Telegram',icon:'telegram',kind:'browser'},
  contacts:{id:'contacts',title:'Contacts',icon:'contacts',kind:'browser'},
  chatgpt:{id:'chatgpt',title:'ChatGPT',icon:'chatgpt',kind:'browser'},
  gemini:{id:'gemini',title:'Gemini',icon:'gemini',kind:'browser'},
  docs2:{id:'docs2',title:'Documents',icon:'docs',kind:'browser'},
  docs:{id:'docs',title:'Docs',icon:'docs',kind:'browser'},
  media:{id:'media',title:'Media',icon:'media',kind:'browser'},
};

const BRAND_URLS={
  brave:'https://cdn.simpleicons.org/brave/ffffff/ff5f19',
  chatgpt:'https://cdn.simpleicons.org/openai/111111',
  discord:'https://cdn.simpleicons.org/discord/5865F2',
  docs:'https://cdn.simpleicons.org/googledocs/4285F4',
  gemini:'https://cdn.simpleicons.org/googlegemini/8E75FF',
  reddit:'https://cdn.simpleicons.org/reddit/FF4500',
  steam:'https://cdn.simpleicons.org/steam/66c0f4',
  telegram:'https://cdn.simpleicons.org/telegram/26A5E4',
  vscode:'https://cdn.simpleicons.org/visualstudiocode/23A8F2',
  whatsapp:'https://cdn.simpleicons.org/whatsapp/25D366',
  youtube:'https://cdn.simpleicons.org/youtube/FF0000',
};
function BrandIcon({name,size=30,className=''}){
  const src=BRAND_URLS[name];
  const localBrand = name==='chatgpt' || name==='discord' || name==='vscode';
  if(!src) return <ImgIcon name={name} size={size} className={className}/>;
  if(localBrand) return <span className={`brand-tile ${name} ${className}`}><img src={`${import.meta.env.BASE_URL}icons/${name}.svg`} width={size} height={size} draggable="false" alt=""/></span>;
  return <span className={`brand-tile ${name} ${className}`}><img src={src} width={size} height={size} draggable="false" alt=""/></span>;
}
function ImgIcon({name,size=24,className=''}){
  return <img className={`svg-icon ${className}`} src={`${import.meta.env.BASE_URL}icons/${name}.svg`} width={size} height={size} draggable="false" alt=""/>;
}

function StatusPopover({type, battery, batterySupported, temp, wifiOnline, volume, muted, setVolume, setMuted, close}){
  if(type==='wifi') return <div className="status-popover" onClick={e=>e.stopPropagation()}>
    <div className="status-popover-title"><ImgIcon name="wifi" size={18}/> Wi-Fi</div>
    <div className="status-row"><span>Status</span><b>{wifiOnline ? 'Connected' : 'Offline'}</b></div>
    <div className="status-note">Browser pages can read connection state, but cannot toggle your computer's Wi-Fi adapter.</div>
  </div>;
  if(type==='volume') return <div className="status-popover" onClick={e=>e.stopPropagation()}>
    <div className="status-popover-title"><ImgIcon name={muted || volume===0 ? 'volume-muted' : 'volume'} size={18}/> Volume</div>
    <div className="volume-control"><input type="range" min="0" max="100" value={muted ? 0 : volume} onChange={e=>{setMuted(false);setVolume(Number(e.target.value))}}/><b>{muted ? 0 : volume}%</b></div>
    <button className="popover-action" onClick={()=>setMuted(v=>!v)}>{muted ? 'Unmute' : 'Mute'}</button>
    <div className="status-note">This slider controls the Web OS UI volume only; browsers cannot change the computer's master volume.</div>
  </div>;
  if(type==='battery') return <div className="status-popover" onClick={e=>e.stopPropagation()}>
    <div className="status-popover-title"><ImgIcon name={batteryIconName(battery?.level ?? null, battery?.charging)} size={18}/> Battery</div>
    {batterySupported ? <><div className="status-row"><span>Charge</span><b>{Math.round((battery?.level ?? 0)*100)}%</b></div><div className="status-row"><span>Power</span><b>{battery?.charging ? 'Charging' : 'On battery'}</b></div></> : <div className="status-note">Battery information is not exposed by this browser.</div>}
  </div>;
  if(type==='temp') return <div className="status-popover" onClick={e=>e.stopPropagation()}>
    <div className="status-popover-title"><ImgIcon name="temp" size={18}/> Temperature</div>
    <div className="status-row"><span>Local temperature</span><b>{temp}</b></div>
    <div className="status-note">Uses your browser's location permission and Open-Meteo. If location is denied, the value stays “-”.</div>
  </div>;
  return null;
}

function batteryIconName(level, charging){
  if(charging) return 'battery-charging';
  if(level == null) return 'battery';
  const pct=level*100;
  if(pct<=15) return 'battery-empty';
  if(pct<=35) return 'battery-low';
  if(pct<=65) return 'battery-medium';
  if(pct<=85) return 'battery-high';
  return 'battery-full';
}

function TopBar({activeApp,onOpenActive}){
  const [now,setNow]=useState(new Date());
  const [temp,setTemp]=useState('-');
  const [battery,setBattery]=useState(null);
  const [batterySupported,setBatterySupported]=useState(true);
  const [wifiOnline,setWifiOnline]=useState(navigator.onLine);
  const [volume,setVolume]=useState(68);
  const [muted,setMuted]=useState(false);
  const [popover,setPopover]=useState(null);
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
  useEffect(()=>{
    let cancelled=false;
    if(!navigator.geolocation){setTemp('-');return;}
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const {latitude,longitude}=pos.coords;
        const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m&temperature_unit=fahrenheit`;
        const r=await fetch(url,{headers:{Accept:'application/json'}});
        if(!r.ok) throw new Error('weather request failed');
        const data=await r.json();
        if(!cancelled && typeof data?.current?.temperature_2m==='number') setTemp(`${Math.round(data.current.temperature_2m)}°F`);
      }catch{if(!cancelled)setTemp('-')}
    },()=>setTemp('-'),{enableHighAccuracy:false,maximumAge:300000,timeout:8000});
    return ()=>{cancelled=true};
  },[]);
  useEffect(()=>{
    const online=()=>setWifiOnline(true), offline=()=>setWifiOnline(false);
    window.addEventListener('online',online);window.addEventListener('offline',offline);
    return ()=>{window.removeEventListener('online',online);window.removeEventListener('offline',offline)};
  },[]);
  useEffect(()=>{
    let mounted=true;
    if(!navigator.getBattery){setBatterySupported(false);return;}
    navigator.getBattery().then(b=>{
      if(!mounted)return;
      const sync=()=>setBattery({level:b.level,charging:b.charging});
      sync();
      b.addEventListener('levelchange',sync);b.addEventListener('chargingchange',sync);
      return ()=>{b.removeEventListener('levelchange',sync);b.removeEventListener('chargingchange',sync)};
    }).catch(()=>setBatterySupported(false));
    return ()=>{mounted=false};
  },[]);
  useEffect(()=>{
    const close=()=>setPopover(null);
    window.addEventListener('click',close);
    return ()=>window.removeEventListener('click',close);
  },[]);
  const date=now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  const time=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  const current=activeApp || {title:'Desktop',icon:null,id:null};
  const toggle=name=>e=>{e.stopPropagation();setPopover(v=>v===name?null:name)};
  return <header className="topbar">
    <div className="top-clock" aria-label="Current date and time">{date} <span>{time}</span></div>
    <button className={`activity-panel ${current.id ? 'has-active-app' : 'is-desktop'}`} onClick={()=>current.id&&onOpenActive(current.id)} disabled={!current.id} aria-label={current.title}>
      {current.id && <span className="activity-brand">{BRAND_URLS[current.icon] ? <BrandIcon name={current.icon} size={22}/> : <ImgIcon name={current.icon} size={22}/>}</span>}
      <span className="activity-copy"><b>{current.title}</b></span>
    </button>
    <div className="top-stats">
      <button className="status-button" onClick={toggle('temp')} title="Location temperature"><ImgIcon name="temp" size={14}/><span>{temp}</span></button>
      <button className="status-button" onClick={toggle('wifi')} title="Wi-Fi status"><ImgIcon name={wifiOnline?'wifi':'wifi-off'} size={15}/></button>
      <button className="status-button" onClick={toggle('volume')} title="Volume"><ImgIcon name={muted || volume===0 ? 'volume-muted' : 'volume'} size={15}/></button>
      <button className="status-button" onClick={toggle('battery')} title={batterySupported && battery ? `${Math.round(battery.level*100)}% battery` : 'Battery'}><ImgIcon name={batteryIconName(battery?.level ?? null, battery?.charging)} size={16}/>{batterySupported && battery ? <span>{Math.round(battery.level*100)}%</span> : null}</button>
      {popover && <StatusPopover type={popover} battery={battery} batterySupported={batterySupported} temp={temp} wifiOnline={wifiOnline} volume={volume} muted={muted} setVolume={setVolume} setMuted={setMuted} close={()=>setPopover(null)}/>} 
    </div>
  </header>
}
const dockItems=[
  ['files','finder','local'],
  ['docs2','document-blue','local'],
  ['contacts','contacts','local'],
  ['chatgpt','chatgpt','brand'],
  ['brave','brave','brand'],
  ['gemini','gemini','brand'],
  ['terminal','terminal-cat','local'],
  ['terminal2','terminal-solid','local'],
  ['youtube','youtube','brand'],
  ['reddit','reddit','brand'],
  ['whatsapp','whatsapp','brand'],
  ['steam','steam','brand'],
  ['discord','discord','brand'],
  ['code','vscode','brand'],
  ['docs','docs','brand'],
  ['notes','notes-color','local'],
  ['telegram','telegram','brand'],
  ['calculator','calculator-color','local'],
  ['media','media','local'],
];
function Dock({open,onLaunch,onOverview}){
  const [hover,setHover]=useState(null);
  return <div className="dock-shell">
    <div className="dock" onMouseLeave={()=>setHover(null)}>
      {dockItems.map(([id,icon,type],i)=><button key={id} className={`dock-item ${open[id]?'active':''}`} onMouseEnter={()=>setHover(i)} onClick={()=>onLaunch(id)} title={APPS[id]?.title||id}>
        <span className="dock-reflection"/><span className={`dock-icon-wrap ${hover===i?'hovered':''}`}>{type==='brand'?<BrandIcon name={icon} size={30}/>:<ImgIcon name={icon} size={30}/>}</span>
      </button>)}
      <span className="dock-separator" aria-hidden="true"/>
      <button className="dock-item dock-apps" onClick={onOverview} title="Show Applications"><span className="dock-icon-wrap"><ImgIcon name="appgrid-color" size={32}/></span></button>
    </div>
  </div>
}

function Window({win,children,onFocus,onClose,onMin,onMax,onDrag}){
  const drag=useRef(null);
  const start=e=>{if(e.button!==0)return; onFocus(win.id); if(win.maximized)return; drag.current={x:e.clientX,y:e.clientY,l:win.x,t:win.y}; window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop)};
  const move=e=>{if(!drag.current)return;onDrag(win.id,{x:Math.max(54,drag.current.l+e.clientX-drag.current.x),y:Math.max(34,drag.current.t+e.clientY-drag.current.y)})};
  const stop=()=>{drag.current=null;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop)};
  return <div className={`window ${win.maximized?'maximized ':''}${win.minimized?'minimized':''}`} style={{left:win.maximized?54:win.x,top:win.maximized?31:win.y,width:win.maximized?'calc(100% - 54px)':win.w,height:win.maximized?'calc(100% - 31px)':win.h,zIndex:win.z}} onPointerDown={()=>onFocus(win.id)}>
    <div className="titlebar" onPointerDown={start}><div className="window-title">{win.title}</div><div className="window-controls"><button onClick={e=>{e.stopPropagation();onMin(win.id)}}>−</button><button onClick={e=>{e.stopPropagation();onMax(win.id)}}>□</button><button className="close" onClick={e=>{e.stopPropagation();onClose(win.id)}}>×</button></div></div>
    <div className="window-content">{children}</div>
  </div>
}

function Terminal(){
  const [lines,setLines]=useState(['Welcome to UbuntuOS Terminal.','This terminal is offline and simulated for the desktop preview.','']);
  const [cmd,setCmd]=useState(''); const input=useRef(null);
  const run=()=>{const c=cmd.trim();if(!c)return;let out='';if(c==='help')out='apps  files  clear  date  echo <text>';else if(c==='apps')out='Files  Terminal  Notes  Calculator  Settings';else if(c==='files')out='Home/  Documents/  Downloads/  Pictures/';else if(c==='clear'){setLines([]);setCmd('');return}else if(c==='date')out=new Date().toString();else if(c.startsWith('echo '))out=c.slice(5);else out=`Command not found: ${c}`;setLines(v=>[...v,`user@ubuntuos:~$ ${c}`,out]);setCmd('')};
  return <div className="terminal" onClick={()=>input.current?.focus()}><div>{lines.map((x,i)=><div key={i}>{x}</div>)}</div><div className="prompt"><span>user@ubuntuos:~$</span><input ref={input} value={cmd} onChange={e=>setCmd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} autoFocus/></div></div>
}
function Files(){return <div className="files-app"><aside><b>Home</b><div>Starred</div><div>Documents</div><div>Downloads</div><div>Pictures</div><div>Music</div><div>Videos</div><div>Trash</div></aside><main><div className="path">Home</div><div className="file-grid"><div className="file-card"><ImgIcon name="files" size={48}/><span>Documents</span></div><div className="file-card"><ImgIcon name="files" size={48}/><span>Downloads</span></div><div className="file-card"><ImgIcon name="files" size={48}/><span>Pictures</span></div></div></main></div>}
function Notes(){const [v,setV]=useState(()=>localStorage.getItem('ubuntuos-note')||'');return <div className="notes"><textarea value={v} onChange={e=>{setV(e.target.value);localStorage.setItem('ubuntuos-note',e.target.value)}} placeholder="Start writing…"/></div>}
function Calculator(){const [v,setV]=useState('');const keys=['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+','C'];const press=k=>{if(k==='C')return setV('');if(k==='='){try{setV(String(Function('return '+v.replaceAll('×','*').replaceAll('÷','/'))()))}catch{setV('Error')}return}setV(x=>x+k)};return <div className="calculator"><div className="calc-display">{v||'0'}</div><div className="calc-grid">{keys.map(k=><button key={k} onClick={()=>press(k)} className={k==='='?'equals':''}>{k}</button>)}</div></div>}
function Settings(){return <div className="settings"><h2>Settings</h2><div className="setting"><b>Appearance</b><p>UbuntuOS GNOME-style desktop shell</p></div><div className="setting"><b>Desktop</b><p>Top bar, centered clock, bottom dock, rounded windows</p></div><div className="setting"><b>Backend</b><p>Remote browser is intentionally left disconnected in this UI-first build.</p></div></div>}
const EXTERNAL_URLS={
  brave:'https://search.brave.com/',
  chatgpt:'https://chatgpt.com/',
  discord:'https://discord.com/app',
  gemini:'https://gemini.google.com/',
  youtube:'https://www.youtube.com/',
  reddit:'https://www.reddit.com/',
  whatsapp:'https://web.whatsapp.com/',
  steam:'https://store.steampowered.com/',
  code:'https://vscode.dev/',
  docs:'https://docs.google.com/',
  docs2:'https://drive.google.com/',
  telegram:'https://web.telegram.org/',
  contacts:'https://contacts.google.com/',
  media:'https://music.youtube.com/'
};
function Browser({appId='steam',title='Browser',icon='brave'}){
  const url=EXTERNAL_URLS[appId]||EXTERNAL_URLS.brave;
  const isProblemApp=appId==='chatgpt'||appId==='discord';
  const openExternal=()=>window.open(url,'_blank','noopener,noreferrer');
  return <div className={`browser ${isProblemApp?'browser-app-shell':''}`}>
    <div className="browser-toolbar"><ImgIcon name={icon||'brave'} size={24}/><button>←</button><button>→</button><button>↻</button><div className="address">{url}</div><button onClick={openExternal}>Open externally</button></div>
    <div className="browser-body">
      <div className="browser-launch-card">
        <ImgIcon name={icon||'brave'} size={56}/>
        <h2>{title}</h2>
        <p>{isProblemApp ? 'This service does not allow reliable embedding inside another webpage. Launch the official site in a new tab.' : 'Launch the official website in a new tab.'}</p>
        <button className="primary-launch" onClick={openExternal}>Open {title}</button>
        <div className="browser-url">{url}</div>
      </div>
    </div>
  </div>}
function AppCenter({onLaunch}){return <div className="app-center"><aside><h2>App Center</h2><div className="nav active">Explore</div><div className="nav">Featured</div><div className="nav">Productivity</div><div className="nav">Development</div><div className="nav">Graphics</div><div className="nav">Games</div><div className="nav">System</div></aside><main><input placeholder="Search for apps…"/><section className="featured"><h2>Featured Apps</h2><p>Discover applications for your Ubuntu Web OS.</p></section><h3>Applications</h3><div className="cards">{['Files','Terminal','Notes','Calculator','Settings','Steam'].map(n=><div className="card" key={n}><div className="card-icon"><ImgIcon name={n==='Steam'?'appgrid':n.toLowerCase()} size={40}/></div><div><b>{n}</b><p>Ubuntu Web OS</p></div><button onClick={()=>onLaunch(n==='Steam'?'browser':n.toLowerCase())}>Open</button></div>)}</div></main></div>}

function App(){
 const [wins,setWins]=useState({}); const [z,setZ]=useState(20); const [overview,setOverview]=useState(false); const [activeId,setActiveId]=useState(null);
 const launch=id=>{if(!APPS[id])return;setWins(v=>v[id]?{...v,[id]:{...v[id],minimized:false,z:z+1}}:{...v,[id]:{...APPS[id],x:window.innerWidth>1000?Math.round(window.innerWidth/2-340):90,y:90,w:680,h:430,z:z+1,minimized:false,maximized:false}});setZ(v=>v+1);setActiveId(id);setOverview(false)};
 useEffect(()=>{const h=e=>launch(e.detail);window.addEventListener('ubuntuos:open',h);return()=>window.removeEventListener('ubuntuos:open',h)},[z]);
 const close=id=>{setWins(v=>{const n={...v};delete n[id];return n});setActiveId(v=>v===id?null:v)}; const min=id=>{setWins(v=>({...v,[id]:{...v[id],minimized:true}}));setActiveId(v=>v===id?null:v)}; const max=id=>setWins(v=>({...v,[id]:{...v[id],maximized:!v[id].maximized}})); const focus=id=>{setZ(v=>v+1);setWins(v=>({...v,[id]:{...v[id],z:z+1,minimized:false}}));setActiveId(id)}; const drag=(id,pos)=>setWins(v=>({...v,[id]:{...v[id],...pos}}));
 const visible=Object.values(wins).filter(w=>!w.minimized);
 const activeApp=activeId && wins[activeId] && !wins[activeId].minimized ? APPS[activeId] : null;
 return <div className="os"><div className="wallpaper" aria-hidden="true" style={{backgroundImage:`url(${import.meta.env.BASE_URL}yaru-mountain-wallpaper.jpg)`}}/><TopBar activeApp={activeApp} onOpenActive={launch}/><Dock open={wins} onLaunch={launch} onOverview={()=>setOverview(v=>!v)}/>{visible.map(w=><Window key={w.id} win={w} onFocus={focus} onClose={close} onMin={min} onMax={max} onDrag={drag}>{w.kind==='terminal'?<Terminal/>:w.kind==='files'?<Files/>:w.kind==='notes'?<Notes/>:w.kind==='calculator'?<Calculator/>:w.kind==='settings'?<Settings/>:w.kind==='browser'?<Browser appId={w.id} title={w.title} icon={w.icon}/>:<AppCenter onLaunch={launch}/>}</Window>)}{overview&&<div className="overview" onClick={()=>setOverview(false)}><div className="overview-search" onClick={e=>e.stopPropagation()}>Type to search</div><div className="overview-grid" onClick={e=>e.stopPropagation()}>{Object.values(APPS).filter(a=>['files','terminal','notes','calculator','settings','browser','appcenter'].includes(a.id)).map(a=><button key={a.id} onClick={()=>launch(a.id)}><ImgIcon name={a.icon} size={36}/><span>{a.title}</span></button>)}</div></div>}</div>
}
createRoot(document.getElementById('root')).render(<App/>);
