import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const services = ['Solar panels', 'Battery storage', 'EV charger', 'Roofing', 'Windows', 'Exterior painting'];

const serviceCards = [
  ['Solar panels', 'Productieberekening, dakinspectie, installatie en monitoring.'],
  ['Battery storage', 'Batterijen afgestemd op verbruik, piekbelasting en slimme energie.'],
  ['EV charger', 'Gecertificeerde laadpunten voor woningen, bedrijven en BRF/VvE.'],
  ['Roofing', 'Dakrenovatie met vochtcontrole, duidelijke scope en nette werf.'],
  ['Windows', 'Energiezuinige ramen met zorgvuldige plaatsing en afwerking.'],
  ['Exterior painting', 'Voorbereiding, primer, verf, stelling en opkuis in een traject.'],
];

const initialLead = { name: '', email: '', phone: '', service: services[0], message: '' };
const initialAppointment = { service: services[0], preferred_date: '', preferred_time: '09:00', address: '', notes: '' };
const initialWarranty = { purchase_id: '', invoice_id: '', subject: '', description: '' };

function Icon({ name, className = 'h-5 w-5' }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    user: <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />,
    lock: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z" />,
    chart: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-8" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.89.67 2.78a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.29-1.23a2 2 0 0 1 2.11-.45c.89.32 1.82.54 2.78.67A2 2 0 0 1 22 16.92Z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className="focus-ring w-full rounded-md border border-slate-200 px-4 py-3 text-slate-900" />;
}

function SelectInput(props) {
  return <select {...props} className="focus-ring w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-900" />;
}

function TextArea(props) {
  return <textarea {...props} className="focus-ring w-full rounded-md border border-slate-200 px-4 py-3 text-slate-900" />;
}

function StatusBadge({ value }) {
  return (
    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-brand-700">
      {value}
    </span>
  );
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('nl-BE', { dateStyle: 'medium' }).format(new Date(value));
}

function ConfigNotice() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="border-b border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-900">
      Supabase is nog niet geconfigureerd. Maak een `.env` op basis van `.env.example` en voer de SQL-migratie uit om login,
      database en adminfuncties te activeren.
    </div>
  );
}

function AuthPanel({ onClose }) {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [message, setMessage] = useState('');
  const disabled = !isSupabaseConfigured;

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    if (!supabase) {
      setMessage('Supabase is nog niet geconfigureerd.');
      return;
    }

    const result =
      mode === 'signup'
        ? await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { full_name: form.full_name, phone: form.phone } },
          })
        : await supabase.auth.signInWithPassword({ email: form.email, password: form.password });

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(mode === 'signup' ? 'Account aangemaakt. Controleer je mailbox indien bevestiging vereist is.' : 'Je bent ingelogd.');
    if (mode === 'signin') onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[0.18em] text-action">{mode === 'signup' ? 'Account maken' : 'Login'}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-950">Klantportaal</h2>
          </div>
          <button className="focus-ring rounded-md px-3 py-2 font-bold text-slate-500 hover:bg-slate-100" onClick={onClose}>
            Sluiten
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === 'signup' && (
            <>
              <Field label="Naam">
                <TextInput value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </Field>
              <Field label="Telefoon">
                <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
            </>
          )}
          <Field label="E-mail">
            <TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
          </Field>
          <Field label="Wachtwoord">
            <TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
          </Field>
          <button disabled={disabled} className="focus-ring inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-action px-5 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300" type="submit">
            <Icon name="lock" />
            {mode === 'signup' ? 'Account aanmaken' : 'Inloggen'}
          </button>
        </form>

        {message && <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-semibold text-brand-700">{message}</p>}

        <button className="mt-5 text-sm font-bold text-brand-700 hover:text-brand-950" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Nog geen account? Registreer hier.' : 'Al een account? Log in.'}
        </button>
      </div>
    </div>
  );
}

function CustomerPortal({ user, profile, data, reload }) {
  const [appointment, setAppointment] = useState(initialAppointment);
  const [claim, setClaim] = useState(initialWarranty);
  const [message, setMessage] = useState('');

  async function createAppointment(event) {
    event.preventDefault();
    setMessage('');
    const { error } = await supabase.from('appointments').insert({ ...appointment, customer_id: user.id });
    if (error) setMessage(error.message);
    else {
      setAppointment(initialAppointment);
      setMessage('Afspraakaanvraag opgeslagen.');
      reload();
    }
  }

  async function createWarrantyClaim(event) {
    event.preventDefault();
    setMessage('');
    const payload = {
      ...claim,
      customer_id: user.id,
      purchase_id: claim.purchase_id || null,
      invoice_id: claim.invoice_id || null,
    };
    const { error } = await supabase.from('warranty_claims').insert(payload);
    if (error) setMessage(error.message);
    else {
      setClaim(initialWarranty);
      setMessage('Garantieaanvraag opgeslagen.');
      reload();
    }
  }

  return (
    <section id="portal" className="container-pad py-20">
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg bg-brand-950 p-6 text-white md:flex-row md:items-center">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-orange-300">Klantportaal</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Welkom, {profile?.full_name || user.email}</h2>
        </div>
        <StatusBadge value={profile?.role || 'customer'} />
      </div>

      {message && <p className="mb-6 rounded-md bg-blue-50 p-4 font-semibold text-brand-700">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm" onSubmit={createAppointment}>
          <h3 className="font-display text-2xl font-bold text-brand-950">Afspraak maken</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Dienst">
              <SelectInput value={appointment.service} onChange={(e) => setAppointment({ ...appointment, service: e.target.value })}>
                {services.map((service) => <option key={service}>{service}</option>)}
              </SelectInput>
            </Field>
            <Field label="Datum">
              <TextInput type="date" value={appointment.preferred_date} onChange={(e) => setAppointment({ ...appointment, preferred_date: e.target.value })} required />
            </Field>
            <Field label="Tijd">
              <TextInput type="time" value={appointment.preferred_time} onChange={(e) => setAppointment({ ...appointment, preferred_time: e.target.value })} required />
            </Field>
            <Field label="Adres">
              <TextInput value={appointment.address} onChange={(e) => setAppointment({ ...appointment, address: e.target.value })} required />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Opmerkingen">
                <TextArea rows="4" value={appointment.notes} onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })} />
              </Field>
            </div>
          </div>
          <button className="focus-ring mt-5 rounded-md bg-action px-5 py-3 font-bold text-white hover:bg-orange-600">Afspraak aanvragen</button>
        </form>

        <form className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm" onSubmit={createWarrantyClaim}>
          <h3 className="font-display text-2xl font-bold text-brand-950">Factuur of garantie</h3>
          <div className="mt-5 space-y-4">
            <Field label="Aankoop/project">
              <SelectInput value={claim.purchase_id} onChange={(e) => setClaim({ ...claim, purchase_id: e.target.value })}>
                <option value="">Kies een aankoop</option>
                {data.purchases.map((purchase) => <option key={purchase.id} value={purchase.id}>{purchase.project_name}</option>)}
              </SelectInput>
            </Field>
            <Field label="Factuur">
              <SelectInput value={claim.invoice_id} onChange={(e) => setClaim({ ...claim, invoice_id: e.target.value })}>
                <option value="">Kies een factuur</option>
                {data.invoices.map((invoice) => <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} - {invoice.status}</option>)}
              </SelectInput>
            </Field>
            <Field label="Onderwerp">
              <TextInput value={claim.subject} onChange={(e) => setClaim({ ...claim, subject: e.target.value })} required />
            </Field>
            <Field label="Beschrijving">
              <TextArea rows="4" value={claim.description} onChange={(e) => setClaim({ ...claim, description: e.target.value })} required />
            </Field>
          </div>
          <button className="focus-ring mt-5 rounded-md bg-brand-700 px-5 py-3 font-bold text-white hover:bg-brand-950">Garantieaanvraag versturen</button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <DataCard title="Afspraken" rows={data.appointments} empty="Nog geen afspraken">
          {(row) => <Row key={row.id} title={`${row.service} - ${formatDate(row.preferred_date)}`} subtitle={`${row.preferred_time} | ${row.address}`} status={row.status} />}
        </DataCard>
        <DataCard title="Aankopen" rows={data.purchases} empty="Nog geen aankopen gekoppeld">
          {(row) => <Row key={row.id} title={row.project_name} subtitle={`${row.service} | garantie tot ${formatDate(row.warranty_until)}`} />}
        </DataCard>
        <DataCard title="Facturen" rows={data.invoices} empty="Nog geen facturen">
          {(row) => <Row key={row.id} title={row.invoice_number} subtitle={`EUR ${row.amount} | ${formatDate(row.issued_at)}`} status={row.status} />}
        </DataCard>
      </div>
    </section>
  );
}

function DataCard({ title, rows, empty, children }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-bold text-brand-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.length ? rows.map(children) : <p className="text-sm text-slate-500">{empty}</p>}
      </div>
    </div>
  );
}

function Row({ title, subtitle, status }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        {status && <StatusBadge value={status} />}
      </div>
    </div>
  );
}

function AdminPortal({ data, reload }) {
  const stats = useMemo(() => {
    const newLeads = data.leads.filter((lead) => lead.status === 'new').length;
    return [
      ['Leads', data.leads.length],
      ['Nieuwe leads', newLeads],
      ['Afspraken', data.allAppointments.length],
      ['Website events', data.siteEvents.length],
    ];
  }, [data]);

  async function updateLeadStatus(id, status) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!error) reload();
  }

  return (
    <section id="admin" className="bg-slate-950 py-20 text-white">
      <div className="container-pad">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold uppercase tracking-[0.18em] text-orange-300">Admin</p>
            <h2 className="mt-2 font-display text-4xl font-bold">Leads, statistieken en audit trail</h2>
          </div>
          <StatusBadge value="admin access" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
              <div className="font-display text-3xl font-bold text-orange-300">{value}</div>
              <div className="mt-1 text-sm font-bold uppercase tracking-[0.13em] text-blue-100">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
            <h3 className="font-display text-2xl font-bold">Inkomende leads</h3>
            <div className="mt-5 space-y-4">
              {data.leads.map((lead) => (
                <div key={lead.id} className="rounded-md bg-white p-4 text-slate-900">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-bold">{lead.name} - {lead.service}</p>
                      <p className="mt-1 text-sm text-slate-600">{lead.email || 'geen e-mail'} | {lead.phone || 'geen telefoon'}</p>
                      <p className="mt-2 text-sm text-slate-700">{lead.message}</p>
                    </div>
                    <SelectInput value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value)}>
                      {['new', 'contacted', 'quoted', 'won', 'lost'].map((status) => <option key={status}>{status}</option>)}
                    </SelectInput>
                  </div>
                </div>
              ))}
              {!data.leads.length && <p className="text-blue-100">Nog geen leads.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
            <h3 className="font-display text-2xl font-bold">Admin wijzigingen</h3>
            <div className="mt-5 max-h-[520px] space-y-3 overflow-auto pr-2">
              {data.auditLogs.map((log) => (
                <div key={log.id} className="rounded-md border border-white/10 bg-slate-900 p-4">
                  <p className="font-bold text-orange-200">{log.action} op {log.table_name}</p>
                  <p className="mt-1 text-sm text-blue-100">{formatDate(log.created_at)}</p>
                </div>
              ))}
              {!data.auditLogs.length && <p className="text-blue-100">Nog geen audit logs.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState({
    appointments: [],
    purchases: [],
    invoices: [],
    warrantyClaims: [],
    leads: [],
    allAppointments: [],
    auditLogs: [],
    siteEvents: [],
  });
  const [lead, setLead] = useState(initialLead);
  const [notice, setNotice] = useState('');

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: sessionData }) => setUser(sessionData.session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    supabase.from('site_events').insert({ event_name: 'page_view', path: window.location.pathname }).then(() => {});

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadData(user.id);
    else {
      setProfile(null);
      setData({ appointments: [], purchases: [], invoices: [], warrantyClaims: [], leads: [], allAppointments: [], auditLogs: [], siteEvents: [] });
    }
  }, [user]);

  async function loadData(userId = user?.id) {
    if (!supabase || !userId) return;
    const profileResult = await supabase.from('profiles').select('*').eq('id', userId).single();
    const nextProfile = profileResult.data;
    setProfile(nextProfile);

    const [appointments, purchases, invoices, warrantyClaims] = await Promise.all([
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('purchases').select('*').order('purchase_date', { ascending: false }),
      supabase.from('invoices').select('*').order('issued_at', { ascending: false }),
      supabase.from('warranty_claims').select('*').order('created_at', { ascending: false }),
    ]);

    const nextData = {
      appointments: appointments.data || [],
      purchases: purchases.data || [],
      invoices: invoices.data || [],
      warrantyClaims: warrantyClaims.data || [],
      leads: [],
      allAppointments: [],
      auditLogs: [],
      siteEvents: [],
    };

    if (nextProfile?.role === 'admin') {
      const [leads, allAppointments, auditLogs, siteEvents] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('site_events').select('*').order('created_at', { ascending: false }).limit(250),
      ]);
      nextData.leads = leads.data || [];
      nextData.allAppointments = allAppointments.data || [];
      nextData.auditLogs = auditLogs.data || [];
      nextData.siteEvents = siteEvents.data || [];
    }

    setData(nextData);
  }

  async function submitLead(event) {
    event.preventDefault();
    setNotice('');
    if (!supabase) {
      setNotice('Configureer Supabase om leads op te slaan.');
      return;
    }
    const payload = { ...lead, customer_id: user?.id || null };
    const { error } = await supabase.from('leads').insert(payload);
    if (error) setNotice(error.message);
    else {
      setLead(initialLead);
      setNotice('Bedankt. Je aanvraag is opgeslagen.');
      if (user) loadData();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen overflow-hidden bg-brand-50">
      <ConfigNotice />
      {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl">
          <a href="#top" className="focus-ring flex items-center gap-3 rounded-md">
            <img src="/assets/logo.png" alt="RM Bygg & Montage AB" className="h-10 w-10 rounded-md object-contain" />
            <span className="font-display text-sm font-bold leading-tight text-brand-700 sm:text-base">
              RM Bygg
              <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">& Montage AB</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-700 lg:flex">
            <a className="transition-colors hover:text-brand-700" href="#services">Diensten</a>
            <a className="transition-colors hover:text-brand-700" href="#portal">Klantportaal</a>
            {isAdmin && <a className="transition-colors hover:text-brand-700" href="#admin">Admin</a>}
            <a className="transition-colors hover:text-brand-700" href="#contact">Contact</a>
          </div>
          {user ? (
            <button onClick={signOut} className="focus-ring rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 hover:bg-blue-50">Uitloggen</button>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="focus-ring inline-flex items-center gap-2 rounded-md bg-action px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600">
              <Icon name="user" className="h-4 w-4" />
              Login
            </button>
          )}
        </nav>
      </header>

      <main id="top">
        <section className="relative pt-32 sm:pt-36 lg:pt-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(135deg,#eff6ff_0%,#ffffff_46%,#dbeafe_100%)]" />
          <div className="container-pad grid items-center gap-12 pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:pb-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                <Icon name="shield" className="h-4 w-4 text-action" />
                Beveiligd klantportaal + admin dashboard
              </div>
              <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-brand-950 sm:text-6xl lg:text-7xl">
                Bouwprojecten, afspraken en facturen op een plek.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Klanten loggen in om afspraken te maken, aankopen te bekijken en facturen of garantieaanvragen terug te vinden. Admins behandelen leads, volgen statistieken en krijgen een audit trail van wijzigingen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => (user ? document.getElementById('portal')?.scrollIntoView() : setAuthOpen(true))} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-action px-6 py-4 font-bold text-white shadow-lift hover:bg-orange-600">
                  {user ? 'Naar klantportaal' : 'Login of registreer'}
                  <Icon name="arrow" />
                </button>
                <a href="#contact" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-6 py-4 font-bold text-brand-700 hover:bg-blue-50">
                  Lead aanvragen
                </a>
              </div>
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Auth', 'login vereist'],
                  ['Admin', 'meerdere accounts'],
                  ['Audit', 'wijzigingen gelogd'],
                  ['DB', 'Supabase schema'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-blue-100 bg-white/80 p-4 shadow-sm">
                    <div className="font-display text-2xl font-bold text-brand-700">{value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-brand-950 shadow-soft">
              <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80" alt="Dashboard with business documents and planning" className="h-[520px] w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-orange-200">
                  <Icon name="chart" className="h-4 w-4" />
                  Live lead workflow
                </div>
                <p className="max-w-md text-2xl font-bold leading-tight">Gebouwd voor klanten, administratie en opvolging na oplevering.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-white">
          <div className="container-pad grid gap-0 md:grid-cols-4">
            {['Afspraken na login', 'Facturen per klant', 'Garantieclaims', 'Admin audit logs'].map((item) => (
              <div key={item} className="flex items-center gap-3 border-blue-100 py-5 md:border-r md:px-6 md:first:border-l">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-700"><Icon name="check" className="h-4 w-4" /></span>
                <span className="text-sm font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="container-pad py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="font-bold uppercase tracking-[0.2em] text-action">Diensten</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-950 sm:text-5xl">De publieke site blijft conversiegericht.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map(([title, text]) => (
              <article key={title} className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-action"><Icon name="shield" /></div>
                <h3 className="font-display text-xl font-bold text-brand-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {user ? (
          <CustomerPortal user={user} profile={profile} data={data} reload={() => loadData()} />
        ) : (
          <section id="portal" className="container-pad py-20">
            <div className="rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
              <Icon name="lock" className="mx-auto h-10 w-10 text-action" />
              <h2 className="mt-4 font-display text-3xl font-bold text-brand-950">Login vereist voor afspraken, aankopen en facturen.</h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">Bezoekers kunnen een lead sturen, maar afspraken en klantdocumenten zitten achter beveiligde login.</p>
              <button onClick={() => setAuthOpen(true)} className="focus-ring mt-6 rounded-md bg-action px-6 py-3 font-bold text-white hover:bg-orange-600">Inloggen of registreren</button>
            </div>
          </section>
        )}

        {isAdmin && <AdminPortal data={data} reload={() => loadData()} />}

        <section id="contact" className="container-pad py-20 lg:py-28">
          <div className="overflow-hidden rounded-lg bg-brand-950 shadow-soft lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 text-white sm:p-10 lg:p-12">
              <p className="font-bold uppercase tracking-[0.2em] text-orange-300">Lead intake</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Vraag een offerte of eerste contact aan.</h2>
              <p className="mt-5 leading-8 text-blue-100">Deze lead wordt opgeslagen in de database en verschijnt voor admins in het dashboard.</p>
              <div className="mt-8 space-y-4">
                <a href="tel:+46700000000" className="focus-ring flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4 hover:bg-white/[0.1]"><Icon name="phone" className="h-5 w-5 text-orange-300" /><span>+46 70 000 00 00</span></a>
                <a href="mailto:info@rmbygg.se" className="focus-ring flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4 hover:bg-white/[0.1]"><Icon name="mail" className="h-5 w-5 text-orange-300" /><span>info@rmbygg.se</span></a>
              </div>
            </div>
            <form className="bg-white p-8 sm:p-10 lg:p-12" onSubmit={submitLead}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Naam"><TextInput value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} required /></Field>
                <Field label="Telefoon"><TextInput value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} /></Field>
                <Field label="E-mail"><TextInput type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} /></Field>
                <Field label="Dienst">
                  <SelectInput value={lead.service} onChange={(e) => setLead({ ...lead, service: e.target.value })}>
                    {services.map((service) => <option key={service}>{service}</option>)}
                  </SelectInput>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Bericht"><TextArea rows="5" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} /></Field>
                </div>
              </div>
              <button className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-action px-6 py-4 font-bold text-white hover:bg-orange-600" type="submit">Lead opslaan <Icon name="arrow" /></button>
              {notice && <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-semibold text-brand-700">{notice}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 bg-white py-8">
        <div className="container-pad flex flex-col justify-between gap-4 text-sm text-slate-600 md:flex-row md:items-center">
          <p>© 2026 RM Bygg & Montage AB. Klantportaal met Supabase auth en database.</p>
          <div className="flex gap-5">
            <a className="font-semibold hover:text-brand-700" href="#portal">Klantportaal</a>
            {isAdmin && <a className="font-semibold hover:text-brand-700" href="#admin">Admin</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
