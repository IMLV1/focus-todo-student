import React, { useEffect, useState } from 'react';
import { Check, Plus, Search, LayoutDashboard, CircleCheck, Circle, ArrowRight, LogOut, Pencil, Trash2, X, ListTodo, Sparkles, ArrowUpRight } from 'lucide-react';
import './App.css';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const sample = [
  { _id: 'demo-1', text: 'ออกแบบหน้า Frontend ในสไตล์ของตัวเอง', completed: true },
  { _id: 'demo-2', text: 'ทดสอบการเพิ่ม แก้ไข และจัดการรายการ Todo', completed: false },
  { _id: 'demo-3', text: 'เชื่อมต่อ Backend และฐานข้อมูล MongoDB', completed: false },
  { _id: 'demo-4', text: 'Deploy โปรเจกต์ขึ้น Railway', completed: false },
  { _id: 'demo-5', text: 'แคปหน้า Railway Diagram และหน้าเว็บ Todo', completed: false },
];
const labels = { all: 'งานทั้งหมด', active: 'กำลังทำ', completed: 'เสร็จแล้ว' };
function savedDemo() { try { return JSON.parse(localStorage.getItem('focus_demo_tasks')) || sample; } catch { return sample; } }

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem('focus_token') || '');
  const [user, setUser] = useState(sessionStorage.getItem('focus_user') || '');
  const [demo, setDemo] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const done = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  function logout() { setToken(''); setDemo(false); setTasks([]); sessionStorage.removeItem('focus_token'); sessionStorage.removeItem('focus_user'); }
  async function api(path, method = 'GET', body) {
    if (!API) throw new Error('ยังไม่ได้ตั้งค่า Backend URL กรุณาตั้ง VITE_API_URL ก่อนใช้งานบัญชี');
    const res = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && token) logout();
    if (!res.ok) throw new Error(data.error || 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง');
    return data;
  }
  useEffect(() => {
    if (demo) { setTasks(savedDemo()); return; }
    if (!token) return;
    let active = true;
    setBusy(true);
    api('/api/todos').then(data => { if (active) setTasks(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [token, demo]);
  function update(next) { setTasks(next); if (demo) localStorage.setItem('focus_demo_tasks', JSON.stringify(next)); }
  async function auth(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { const data = await api('/api/auth/' + (register ? 'register' : 'login'), 'POST', { email, password });
      if (!data.token) throw new Error('ไม่พบ token จากเซิร์ฟเวอร์');
      sessionStorage.setItem('focus_token', data.token); sessionStorage.setItem('focus_user', data.email || email);
      setToken(data.token); setUser(data.email || email); setPassword('');
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function add(e) {
    e.preventDefault(); if (!text.trim() || busy) return; setBusy(true); setError('');
    try { const task = demo ? { _id: crypto.randomUUID(), text: text.trim(), completed: false } : await api('/api/todos', 'POST', { text: text.trim() }); update([task, ...tasks]); setText(''); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function change(task, patch) {
    if (busy) return; setBusy(true); setError('');
    try { if (!demo) await api('/api/todos/' + task._id, 'PUT', patch); update(tasks.map(t => t._id === task._id ? { ...t, ...patch } : t)); setEditing(null); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setError('');
    try { if (!demo) await api('/api/todos/' + deleting._id, 'DELETE'); update(tasks.filter(t => t._id !== deleting._id)); setDeleting(null); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  const visible = tasks.filter(t => (filter === 'all' || (filter === 'completed' ? t.completed : !t.completed)) && t.text.toLowerCase().includes(query.toLowerCase()));
  const brand = <div className="brand"><span className="brand-icon"><Check size={23}/></span>focus<span className="brand-dot">.</span></div>;
  if (!token && !demo) return <div className="auth-page">
    <section className="auth-story">{brand}<div><span className="eyebrow">A LITTLE FOCUS, EVERY DAY</span><h1>Make room<br/>for what<br/><em>matters.</em></h1><p>เปลี่ยนสิ่งที่ต้องทำ ให้เป็นสิ่งที่ทำสำเร็จ<br/>จัดระเบียบวันของคุณ เริ่มจากงานเล็ก ๆ เพียงหนึ่งงาน</p><div className="story-card"><span className="mini-check"><Check size={18}/></span><div>One task at a time.<small>ทุกความสำเร็จ เริ่มจากการลงมือทำ</small></div><Sparkles size={22}/></div></div><small>YOUR PERSONAL TASK SPACE · STUDENT EDITION</small></section>
    <section className="auth-form"><div className="auth-box"><span className="eyebrow">WELCOME TO YOUR SPACE</span><h2>{register ? 'เริ่มต้นวันใหม่ด้วยกัน' : 'กลับมาโฟกัสกันอีกครั้ง'}</h2><p className="muted">{register ? 'สร้างบัญชีเพื่อจัดการงานของคุณ' : 'เข้าสู่ระบบเพื่อจัดการรายการสิ่งที่ต้องทำ'}</p>
    {error && <p role="alert" className="error">{error}</p>}
    <form onSubmit={auth}><label>อีเมล<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label><label>รหัสผ่าน<input type="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร"/></label><button className="primary" disabled={busy}>{busy ? 'กำลังเชื่อมต่อ…' : register ? 'สร้างบัญชี' : 'เข้าสู่ระบบ'}<ArrowRight size={18}/></button></form>
    <p className="auth-switch">{register ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?'} <button className="text-button" onClick={() => {setRegister(!register); setError('');}}>{register ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</button></p>
    <div className="divider">หรือทดลองหน้าตาและการใช้งาน</div><button className="demo-button" onClick={() => {setDemo(true); setError('');}}>เปิดโหมดตัวอย่าง <ArrowUpRight size={17}/></button><p className="fine">โหมดตัวอย่างเก็บข้อมูลเฉพาะในเบราว์เซอร์นี้<br/>ยังไม่เชื่อมต่อ Backend หรือ Railway</p></div></section></div>;
  return <div className="workspace">
    <aside className="sidebar">{brand}<div className="workspace-name"><span className="avatar">S</span><div>My workspace<small>Student edition</small></div></div><span className="nav-label">WORKSPACE</span><nav>{Object.entries(labels).map(([key,label]) => <button key={key} onClick={() => setFilter(key)} className={filter === key ? 'nav-item selected' : 'nav-item'}>{key === 'all' ? <LayoutDashboard size={19}/> : key === 'completed' ? <CircleCheck size={19}/> : <Circle size={19}/>} {label}<span>{key === 'all' ? tasks.length : key === 'completed' ? done : tasks.length - done}</span></button>)}</nav><div className="sidebar-note"><Sparkles size={23}/><h3>Small steps.<br/>Real progress.</h3><p>ไม่ต้องทำทุกอย่างในวันเดียว<br/>แค่ก้าวไปข้างหน้าวันละนิดก็พอ</p></div><div className="profile"><span className="avatar">{demo ? 'D' : user.slice(0,1).toUpperCase()}</span><div>{demo ? 'Demo workspace' : user}<small>{demo ? 'ข้อมูลตัวอย่าง · Local only' : 'Personal account'}</small></div><button aria-label="ออกจากระบบ" title="ออกจากระบบ" onClick={logout}><LogOut size={18}/></button></div></aside>
    <main><header className="topbar"><span>Workspace <span className="slash">/</span> <b>My tasks</b></span><span className="mode"><i/>{demo ? 'โหมดตัวอย่าง · ยังไม่เชื่อมต่อ Railway' : 'บัญชีส่วนตัว'}</span></header><div className="main-content"><div className="page-heading"><div><span className="eyebrow">LET’S MAKE THINGS HAPPEN</span><h1>พื้นที่เล็ก ๆ สำหรับ<span>ความสำเร็จ</span></h1><p className="muted">วางแผนให้ชัด ลงมือทีละงาน แล้วไปต่อในแบบของคุณ</p></div><div className="date-box"><span>TODAY</span><b>{new Date().toLocaleDateString('th-TH', {day:'numeric',month:'short'})}</b></div></div>
    <div className="stats"><div className="stat"><span>งานทั้งหมด <ListTodo size={20}/></span><b>{String(tasks.length).padStart(2,'0')}</b><small>ทุกไอเดีย เริ่มต้นได้ที่นี่</small></div><div className="stat"><span>กำลังทำ <Circle size={20}/></span><b>{String(tasks.length-done).padStart(2,'0')}</b><small>ค่อย ๆ ทำ ทีละอย่าง</small></div><div className="stat progress-stat"><span>เสร็จแล้ว <CircleCheck size={20}/></span><b>{String(done).padStart(2,'0')}<small>{progress}% สำเร็จ</small></b><div className="progress"><div style={{width: progress+'%'}}/></div></div></div>
    <section className="task-panel"><div className="panel-heading"><div><h2>My tasks <span>{tasks.length}</span></h2><p className="muted">จัดการสิ่งที่ต้องทำในวันนี้</p></div><span className="panel-tag">ONE TASK AT A TIME</span></div>
    <form onSubmit={add} className="add-form"><Plus size={21}/><input aria-label="งานใหม่" value={text} onChange={e=>setText(e.target.value)} placeholder="วันนี้อยากทำอะไรให้สำเร็จ?" maxLength={500}/><button className="primary" disabled={busy || !text.trim()}><Plus size={17}/> เพิ่มงาน</button></form>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="toolbar"><div className="tabs">{Object.entries(labels).map(([key,label]) => <button key={key} aria-pressed={filter === key} onClick={()=>setFilter(key)} className={filter === key ? 'active' : ''}>{label}</button>)}</div><label className="search"><Search size={17}/><input aria-label="ค้นหางาน" placeholder="ค้นหางาน…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
    <div className="task-list">{visible.map(task => <div className={'task-row '+(task.completed ? 'is-done' : '')} key={task._id}><button className="task-check" role="checkbox" aria-checked={task.completed} aria-label={'ทำสำเร็จ: '+task.text} disabled={busy} onClick={()=>change(task,{completed:!task.completed})}>{task.completed && <Check size={16}/>}</button><div className="task-body">{editing === task._id ? <form className="edit-form" onSubmit={e=>{e.preventDefault(); if(editText.trim()) change(task,{text:editText.trim()});}}><input aria-label="แก้ไขข้อความ" autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')setEditing(null);}}/><button aria-label="บันทึกการแก้ไข" disabled={busy || !editText.trim()}><Check size={18}/></button><button type="button" aria-label="ยกเลิกการแก้ไข" onClick={()=>setEditing(null)}><X size={18}/></button></form> : <><p>{task.text}</p><small>{task.completed ? 'อีกหนึ่งงานที่ทำสำเร็จแล้ว' : 'พร้อมเมื่อคุณพร้อม เริ่มได้เลย'}</small></>}</div><span className={'status '+(task.completed ? 'done' : '')}>{task.completed ? 'เสร็จแล้ว' : 'กำลังทำ'}</span><button className="icon-button" aria-label={'แก้ไข: '+task.text} onClick={()=>{setEditing(task._id);setEditText(task.text);}}><Pencil size={16}/></button><button className="icon-button" aria-label={'ลบ: '+task.text} onClick={()=>setDeleting(task)}><Trash2 size={16}/></button></div>)}{!visible.length && <div className="empty"><CircleCheck size={30}/><h3>{busy ? 'กำลังโหลด…' : 'ยังไม่มีงานในรายการนี้'}</h3><p>เพิ่มงานใหม่ หรือเปลี่ยนตัวกรองเพื่อดูรายการอื่น</p></div>}</div><footer className="list-footer"><span>{visible.length} รายการ · {tasks.length-done} งานที่รอคุณอยู่</span><span>Make today a little lighter.</span></footer></section><footer className="page-footer">Designed for a clearer day.<span>focus. / STUDENT EDITION</span></footer></div></main>
    {deleting && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title">ลบงานนี้?</h2><p>{deleting.text}</p><div><button onClick={()=>setDeleting(null)} disabled={busy}>ยกเลิก</button><button className="danger" onClick={remove} disabled={busy}>ยืนยันลบ</button></div></section></div>}
  </div>;
}
