import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Sprout, CloudSun, Leaf, Tractor, LogOut, LayoutDashboard, Plus, Trash2, Droplets, MapPin, Wheat, ShieldCheck } from 'lucide-react';
import api from './api';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agritech_user') || 'null'); } catch { return null; }
  });
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('agritech_token');
    localStorage.removeItem('agritech_user');
    setUser(null); setNotice('You have logged out.'); navigate('/');
  };
  const onLogin = (data) => {
    localStorage.setItem('agritech_token', data.token);
    localStorage.setItem('agritech_user', JSON.stringify(data.user));
    setUser(data.user); setNotice(`Welcome, ${data.user.name}!`); navigate('/dashboard');
  };
  return <div className="app-shell">
    <nav className="navbar navbar-expand-lg navbar-dark site-nav">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/"><Sprout size={27}/> AgriTech</Link>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link className="nav-link text-white" to="/">Home</Link>
          {user ? <><Link className="nav-link text-white" to="/dashboard">Dashboard</Link><button className="btn btn-sm btn-light" onClick={logout}><LogOut size={15} className="me-1"/>Logout</button></> :
            <><Link className="btn btn-sm btn-outline-light" to="/login">Login</Link><Link className="btn btn-sm btn-light" to="/register">Get Started</Link></>}
        </div>
      </div>
    </nav>
    {notice && <div className="container mt-3"><div className="alert alert-success alert-dismissible">{notice}<button className="btn-close" onClick={() => setNotice('')}/></div></div>}
    <Routes>
      <Route path="/" element={<Home user={user}/>} />
      <Route path="/login" element={<AuthPage mode="login" onSuccess={onLogin}/>} />
      <Route path="/register" element={<AuthPage mode="register" onSuccess={onLogin}/>} />
      <Route path="/dashboard" element={user ? <Dashboard user={user}/> : <AuthPage mode="login" onSuccess={onLogin}/>} />
      <Route path="*" element={<Home user={user}/>} />
    </Routes>
    <footer className="footer"><div className="container d-flex flex-wrap justify-content-between gap-2"><span>🌱 AgriTech — smarter decisions, healthier farms.</span><span>Built with React, Express & MongoDB</span></div></footer>
  </div>;
}

function Home({ user }) {
  return <><header className="hero"><div className="container hero-content">
    <span className="eyebrow"><Sprout size={16}/> SMART FARMING PLATFORM</span>
    <h1>Grow smarter.<br/><span>Harvest better.</span></h1>
    <p>Bring your farm records, crop planning, soil observations, and weather information together in one simple dashboard.</p>
    <div className="d-flex flex-wrap gap-3"><Link className="btn btn-success btn-lg" to={user ? '/dashboard' : '/register'}>{user ? 'Open Dashboard' : 'Get Started'} →</Link><a className="btn btn-outline-light btn-lg" href="#features">Explore Features</a></div>
    <div className="hero-note"><ShieldCheck size={17}/> Keep your farm records organized in one place</div>
  </div></header>
  <section className="container section-pad" id="features"><div className="section-heading"><span className="eyebrow green">MADE FOR FARMERS</span><h2>Everything your farm needs to get organized</h2><p>Practical digital tools for day-to-day farm management.</p></div>
    <div className="row g-4 mt-2">
      <Feature icon={<Tractor/>} title="Farm Management" text="Record farm locations, area, soil type, and irrigation details."/>
      <Feature icon={<Wheat/>} title="Crop Tracking" text="Keep crop names, sowing dates, harvest plans, and growth stages together."/>
      <Feature icon={<CloudSun/>} title="Weather Overview" text="Look up weather information. Demo readings are clearly labeled when no API key is configured."/>
      <Feature icon={<Droplets/>} title="Soil Records" text="Save soil pH, nutrient readings, and moisture observations for reference."/>
    </div>
  </section>
  <section className="benefits"><div className="container row align-items-center g-4"><div className="col-lg-6"><span className="eyebrow green">SIMPLE. USEFUL. ACCESSIBLE.</span><h2>Spend less time searching for records.</h2><p className="text-secondary">AgriTech helps you organize essential farm information so you can review your records whenever you need them.</p><Link className="btn btn-success" to={user ? '/dashboard' : '/register'}>Start managing your farm</Link></div><div className="col-lg-6"><img className="benefit-image" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85" alt="Green agricultural fields"/></div></div></section>
  </>;
}
function Feature({icon,title,text}) { return <div className="col-md-6 col-lg-3"><div className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div></div>; }

function AuthPage({ mode, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      onSuccess(data);
    } catch (err) { setError(err.response?.data?.message || 'Could not connect to the server. Check that the backend is running.'); }
    finally { setBusy(false); }
  };
  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <div className="feature-icon mx-auto"><Sprout/></div><h2>{isRegister ? 'Create your farmer account' : 'Welcome back'}</h2><p className="text-secondary">{isRegister ? 'Start organizing your farm records.' : 'Log in to continue to your dashboard.'}</p>
    {error && <div className="alert alert-danger">{error}</div>}
    {isRegister && <label className="form-label">Full name<input className="form-control" required maxLength="80" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}
    <label className="form-label">Email<input type="email" className="form-control" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label className="form-label">Password<input type="password" className="form-control" required minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{isRegister && <small className="text-secondary">Use at least 8 characters.</small>}</label>
    <button className="btn btn-success w-100 mt-2" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create Account' : 'Log In'}</button>
    <p className="auth-switch">{isRegister ? 'Already registered?' : 'New to AgriTech?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create account'}</Link></p>
  </form></main>;
}

function Dashboard({ user }) {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soil, setSoil] = useState([]);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Indore');
  const [farmForm, setFarmForm] = useState({name:'',location:'',area:'',soilType:'Loamy',irrigation:'Drip'});
  const [cropForm, setCropForm] = useState({name:'',farm:'',sowingDate:'',expectedHarvest:'',area:'',stage:'Growing',notes:''});
  const [soilForm, setSoilForm] = useState({location:'',soilType:'Loamy',ph:'7',nitrogen:'0',phosphorus:'0',potassium:'0',moisture:'0'});
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const refresh = async () => {
    try {
      const [f,c,s] = await Promise.all([api.get('/farms'),api.get('/crops'),api.get('/soil')]);
      setFarms(f.data); setCrops(c.data); setSoil(s.data);
    } catch (e) { setError(e.response?.data?.message || 'Could not load records. Is the backend connected?'); }
  };
  useEffect(() => { refresh(); getWeather('Indore'); }, []);
  const getWeather = async (target) => { try { const {data}=await api.get('/weather',{params:{city:target}}); setWeather(data); } catch { setWeather(null); } };
  const addFarm = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { await api.post('/farms',{...farmForm,area:Number(farmForm.area||0)}); setFarmForm({name:'',location:'',area:'',soilType:'Loamy',irrigation:'Drip'}); await refresh(); setTab('farms'); } catch(e){setError(e.response?.data?.message||'Could not save farm.');} finally{setLoading(false);} };
  const addCrop = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { await api.post('/crops',{...cropForm,area:Number(cropForm.area||0)}); setCropForm({name:'',farm:'',sowingDate:'',expectedHarvest:'',area:'',stage:'Growing',notes:''}); await refresh(); setTab('crops'); } catch(e){setError(e.response?.data?.message||'Could not save crop.');} finally{setLoading(false);} };
  const addSoil = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { await api.post('/soil',{...soilForm,ph:Number(soilForm.ph),nitrogen:Number(soilForm.nitrogen),phosphorus:Number(soilForm.phosphorus),potassium:Number(soilForm.potassium),moisture:Number(soilForm.moisture)}); await refresh(); setTab('soil'); } catch(e){setError(e.response?.data?.message||'Could not save soil record.');} finally{setLoading(false);} };
  const remove = async (kind,id) => { if(!confirm('Delete this record?')) return; try { await api.delete(`/${kind}/${id}`); await refresh(); } catch(e){setError(e.response?.data?.message||'Could not delete record.');} };
  const Field = ({label,children}) => <div className="col-md-6"><label className="form-label">{label}{children}</label></div>;
  return <main className="dashboard-bg"><div className="container py-4 py-lg-5">
    <div className="dash-welcome"><div><span className="eyebrow green">FARMER WORKSPACE</span><h1>Hello, {user.name.split(' ')[0]} <span>🌿</span></h1><p>Here is your farm management overview.</p></div><div className="date-pill">{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</div></div>
    {error && <div className="alert alert-danger alert-dismissible">{error}<button className="btn-close" onClick={()=>setError('')}/></div>}
    <div className="row g-3 mb-4">
      <Stat icon={<Tractor/>} label="My Farms" value={farms.length}/>
      <Stat icon={<Wheat/>} label="Crop Records" value={crops.length}/>
      <Stat icon={<Droplets/>} label="Soil Reports" value={soil.length}/>
      <Stat icon={<CloudSun/>} label="Weather" value={weather ? `${weather.temperature}°C` : '—'}/>
    </div>
    <div className="dashboard-layout">
      <aside className="dash-sidebar">
        { [['overview','Overview'],['farms','My Farms'],['crops','Crop Tracking'],['soil','Soil Analysis'],['weather','Weather']].map(([key,label])=><button key={key} className={`side-link ${tab===key?'active':''}`} onClick={()=>setTab(key)}>{label}</button>)}
        <div className="sidebar-help"><Leaf size={21}/><b>Farm tip</b><p>Keep sowing dates and soil observations up to date to make your records more useful.</p></div>
      </aside>
      <section className="dash-main">
        {tab==='overview' && <><div className="content-heading"><div><h2>Dashboard overview</h2><p>Your latest farm activity and quick actions.</p></div></div><div className="quick-grid"><button onClick={()=>setTab('farms')} className="quick-card"><Plus/>Add a farm</button><button onClick={()=>setTab('crops')} className="quick-card"><Plus/>Record a crop</button><button onClick={()=>setTab('soil')} className="quick-card"><Plus/>Add soil report</button></div><div className="row g-3 mt-1"><div className="col-lg-6"><div className="panel"><h3>Recent farms</h3>{farms.slice(0,3).map(f=><div className="record-row" key={f._id}><div className="record-icon"><MapPin/></div><div><b>{f.name}</b><small>{f.location} · {f.area} acres</small></div></div>)}{!farms.length&&<p className="empty-state">No farms yet. Use “My Farms” to add your first farm.</p>}</div></div><div className="col-lg-6"><div className="panel"><h3>Recent crops</h3>{crops.slice(0,3).map(c=><div className="record-row" key={c._id}><div className="record-icon"><Wheat/></div><div><b>{c.name}</b><small>{c.stage} · {c.area} acres</small></div></div>)}{!crops.length&&<p className="empty-state">Your crop records will appear here.</p>}</div></div></div></>}
        {tab==='farms' && <><div className="content-heading"><div><h2>My Farms</h2><p>Save and manage your farm details.</p></div></div><form className="panel form-panel" onSubmit={addFarm}><h3><Plus size={20}/> Add a farm</h3><div className="row g-3"><Field label="Farm name"><input className="form-control" required value={farmForm.name} onChange={e=>setFarmForm({...farmForm,name:e.target.value})}/></Field><Field label="Location"><input className="form-control" required placeholder="Village, district" value={farmForm.location} onChange={e=>setFarmForm({...farmForm,location:e.target.value})}/></Field><Field label="Area (acres)"><input type="number" min="0" step="0.1" className="form-control" value={farmForm.area} onChange={e=>setFarmForm({...farmForm,area:e.target.value})}/></Field><Field label="Soil type"><select className="form-select" value={farmForm.soilType} onChange={e=>setFarmForm({...farmForm,soilType:e.target.value})}>{['Loamy','Clay','Sandy','Silty','Black soil','Other'].map(x=><option>{x}</option>)}</select></Field><Field label="Irrigation"><select className="form-select" value={farmForm.irrigation} onChange={e=>setFarmForm({...farmForm,irrigation:e.target.value})}>{['Drip','Sprinkler','Canal','Rain-fed','Other'].map(x=><option>{x}</option>)}</select></Field></div><button className="btn btn-success mt-3" disabled={loading}>{loading?'Saving…':'Save Farm'}</button></form><div className="record-list">{farms.map(f=><div className="record-card" key={f._id}><div className="record-icon"><Tractor/></div><div className="record-info"><b>{f.name}</b><span><MapPin size={14}/> {f.location} · {f.area} acres</span><small>{f.soilType} soil · {f.irrigation} irrigation</small></div><button className="icon-btn danger" title="Delete farm" onClick={()=>remove('farms',f._id)}><Trash2/></button></div>)}{!farms.length&&<div className="panel empty-state">No farms added yet.</div>}</div></>}
        {tab==='crops' && <><div className="content-heading"><div><h2>Crop Tracking</h2><p>Record what you grow and when you plan to harvest.</p></div></div><form className="panel form-panel" onSubmit={addCrop}><h3><Plus size={20}/> Add a crop</h3><div className="row g-3"><Field label="Crop name"><input className="form-control" required placeholder="e.g. Wheat" value={cropForm.name} onChange={e=>setCropForm({...cropForm,name:e.target.value})}/></Field><Field label="Farm (optional)"><select className="form-select" value={cropForm.farm} onChange={e=>setCropForm({...cropForm,farm:e.target.value})}><option value="">No farm selected</option>{farms.map(f=><option value={f._id} key={f._id}>{f.name}</option>)}</select></Field><Field label="Sowing date"><input type="date" className="form-control" value={cropForm.sowingDate} onChange={e=>setCropForm({...cropForm,sowingDate:e.target.value})}/></Field><Field label="Expected harvest"><input type="date" className="form-control" value={cropForm.expectedHarvest} onChange={e=>setCropForm({...cropForm,expectedHarvest:e.target.value})}/></Field><Field label="Area (acres)"><input type="number" min="0" step="0.1" className="form-control" value={cropForm.area} onChange={e=>setCropForm({...cropForm,area:e.target.value})}/></Field><Field label="Growth stage"><select className="form-select" value={cropForm.stage} onChange={e=>setCropForm({...cropForm,stage:e.target.value})}>{['Planned','Sowing','Growing','Flowering','Ready to harvest','Harvested'].map(x=><option>{x}</option>)}</select></Field></div><button className="btn btn-success mt-3" disabled={loading}>{loading?'Saving…':'Save Crop'}</button></form><div className="record-list">{crops.map(c=><div className="record-card" key={c._id}><div className="record-icon"><Wheat/></div><div className="record-info"><b>{c.name}</b><span>{c.stage} · {c.area} acres</span><small>{c.farm?.name || 'No farm linked'}{c.expectedHarvest ? ` · Harvest: ${new Date(c.expectedHarvest).toLocaleDateString()}` : ''}</small></div><button className="icon-btn danger" onClick={()=>remove('crops',c._id)} title="Delete crop"><Trash2/></button></div>)}{!crops.length&&<div className="panel empty-state">No crops recorded yet.</div>}</div></>}
        {tab==='soil' && <><div className="content-heading"><div><h2>Soil Analysis</h2><p>Save measurements from your soil test or field observations.</p></div></div><div className="alert alert-warning">These records are for tracking only, not a laboratory diagnosis or fertilizer prescription.</div><form className="panel form-panel" onSubmit={addSoil}><h3><Plus size={20}/> New soil record</h3><div className="row g-3"><Field label="Location"><input className="form-control" required value={soilForm.location} onChange={e=>setSoilForm({...soilForm,location:e.target.value})}/></Field><Field label="Soil type"><select className="form-select" value={soilForm.soilType} onChange={e=>setSoilForm({...soilForm,soilType:e.target.value})}>{['Loamy','Clay','Sandy','Silty','Black soil','Other'].map(x=><option>{x}</option>)}</select></Field>{[['pH','ph',0,14],['Nitrogen','nitrogen',0,100000],['Phosphorus','phosphorus',0,100000],['Potassium','potassium',0,100000],['Moisture (%)','moisture',0,100]].map(([label,key,min,max])=><Field key={key} label={label}><input type="number" min={min} max={max} step="any" required className="form-control" value={soilForm[key]} onChange={e=>setSoilForm({...soilForm,[key]:e.target.value})}/></Field>)}</div><button className="btn btn-success mt-3" disabled={loading}>{loading?'Saving…':'Save Soil Record'}</button></form><div className="record-list">{soil.map(s=><div className="record-card" key={s._id}><div className="record-icon"><Droplets/></div><div className="record-info"><b>{s.location} · {s.soilType}</b><span>pH {s.ph} · Moisture {s.moisture}%</span><small>N {s.nitrogen} · P {s.phosphorus} · K {s.potassium}</small></div></div>)}{!soil.length&&<div className="panel empty-state">No soil records yet.</div>}</div></>}
        {tab==='weather' && <><div className="content-heading"><div><h2>Weather Overview</h2><p>Search current weather by city.</p></div></div><form className="weather-search" onSubmit={e=>{e.preventDefault();getWeather(city)}}><input className="form-control" value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter city name"/><button className="btn btn-success">Search</button></form>{weather&&<div className="weather-card"><div className="weather-top"><CloudSun size={52}/><div><span>{weather.source==='demo'?'DEMO WEATHER':'LIVE WEATHER'}</span><h3>{weather.city}</h3><p className="text-capitalize">{weather.condition}</p></div><strong>{weather.temperature}°C</strong></div><div className="weather-metrics"><div><span>Humidity</span><b>{weather.humidity}%</b></div><div><span>Wind speed</span><b>{weather.windSpeed} m/s</b></div></div>{weather.message&&<small className="weather-disclaimer">{weather.message}</small>}</div>}<div className="alert alert-info mt-3">Weather data is informational. Check a trusted local forecast before making time-sensitive farm decisions.</div></>}
      </section>
    </div>
  </div></main>;
}
function Stat({icon,label,value}) { return <div className="col-6 col-lg-3"><div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><b>{value}</b></div></div></div>; }
export default App;
