const services = [
  {
    title: 'Solar panel systems',
    text: 'Roof assessment, production estimate, installation and monitoring for villas, BRFs and commercial properties.',
    meta: 'Solar',
  },
  {
    title: 'Batteries and storage',
    text: 'Right-sized battery systems that support self-consumption, peak shaving and smarter energy usage.',
    meta: 'Storage',
  },
  {
    title: 'EV chargers',
    text: 'Certified home, workplace and association charger installations with load balancing from day one.',
    meta: 'Charging',
  },
  {
    title: 'Roof renovation',
    text: 'Tile, metal and felt roof work with moisture checks, clear scope and coordinated site management.',
    meta: 'Roofing',
  },
  {
    title: 'Window replacement',
    text: 'Energy-efficient window replacements with careful fitting, tidy finishing and clear scheduling.',
    meta: 'Envelope',
  },
  {
    title: 'Exterior painting',
    text: 'Surface preparation, scaffolding, primer, paint and cleanup handled as one complete exterior project.',
    meta: 'Facade',
  },
];

const proof = [
  ['24h', 'weekday reply'],
  ['5 yr', 'workmanship guarantee'],
  ['ROT', 'deduction guidance'],
  ['One', 'accountable team'],
];

const process = [
  ['01', 'Site conversation', 'We clarify scope, property type, access, timing and what result matters most.'],
  ['02', 'Inspection', 'Measurements, photos and technical checks happen before a price is promised.'],
  ['03', 'Written quote', 'You receive a clear scope, material choices, timeline and payment schedule.'],
  ['04', 'Build and handover', 'The same accountable team coordinates the work, daily site order and final review.'],
];

const cases = [
  {
    title: 'Villa energy upgrade',
    place: 'Kungsbacka',
    result: '9.6 kWp solar array with battery-ready wiring',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'BRF charging rollout',
    place: 'Molndal',
    result: '18 load-balanced charging points delivered in stages',
    image:
      'https://images.unsplash.com/photo-1593941707882-a5bba53b0998?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Roof and facade refresh',
    place: 'Partille',
    result: 'Roof repairs, repainting and cleaned handover',
    image:
      'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80',
  },
];

const testimonials = [
  {
    quote:
      'The quote was the clearest we received. Rezki explained what mattered, what could wait and what would be guaranteed.',
    name: 'Anna K.',
    role: 'Villa owner, Kungsbacka',
  },
  {
    quote:
      'Our BRF needed a contractor who could coordinate electrical work, access and resident questions. The process stayed controlled.',
    name: 'Lars S.',
    role: 'Board chair, Gothenburg',
  },
  {
    quote:
      'They left the site clean every day and the final invoice matched the written quote. That made the whole project easier.',
    name: 'Martin P.',
    role: 'Homeowner, Molndal',
  },
];

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
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.89.67 2.78a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.29-1.23a2 2 0 0 1 2.11-.45c.89.32 1.82.54 2.78.67A2 2 0 0 1 22 16.92Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    roof: <path d="M3 12 12 4l9 8M5 10v10h14V10M9 20v-6h6v6" />,
    bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    star: <path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-brand-50">
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/70 bg-white/88 px-4 py-3 shadow-soft backdrop-blur-xl">
          <a href="#top" className="focus-ring flex items-center gap-3 rounded-md">
            <img src="/assets/logo.png" alt="RM Bygg & Montage AB" className="h-10 w-10 rounded-md object-contain" />
            <span className="font-display text-sm font-bold leading-tight text-brand-700 sm:text-base">
              RM Bygg
              <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">& Montage AB</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-700 lg:flex">
            <a className="transition-colors hover:text-brand-700" href="#services">Services</a>
            <a className="transition-colors hover:text-brand-700" href="#process">Process</a>
            <a className="transition-colors hover:text-brand-700" href="#work">Work</a>
            <a className="transition-colors hover:text-brand-700" href="#reviews">Reviews</a>
          </div>

          <a
            href="#contact"
            className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md bg-action px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-colors duration-200 hover:bg-orange-600"
          >
            Book visit
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="relative pt-32 sm:pt-36 lg:pt-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(135deg,#eff6ff_0%,#ffffff_46%,#dbeafe_100%)]" />
          <div className="container-pad grid items-center gap-12 pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:pb-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                <Icon name="shield" className="h-4 w-4 text-action" />
                Gothenburg building and energy services
              </div>

              <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-brand-950 sm:text-6xl lg:text-7xl">
                Better home projects, from quote to handover.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                RM Bygg & Montage AB handles solar panels, batteries, EV chargers, roofs, windows and exterior painting with clear scope, tidy sites and written guarantees.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-action px-6 py-4 font-bold text-white shadow-lift transition-colors duration-200 hover:bg-orange-600"
                >
                  Request a quote
                  <Icon name="arrow" />
                </a>
                <a
                  href="tel:+46700000000"
                  className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-6 py-4 font-bold text-brand-700 transition-colors duration-200 hover:border-brand-600 hover:bg-blue-50"
                >
                  <Icon name="phone" />
                  Call Rezki
                </a>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {proof.map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-blue-100 bg-white/80 p-4 shadow-sm">
                    <div className="font-display text-2xl font-bold text-brand-700">{value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-200/70 blur-3xl" />
              <div className="relative overflow-hidden rounded-lg bg-brand-950 shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80"
                  alt="Contractor reviewing building plans at a work site"
                  className="h-[520px] w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-200">
                    <Icon name="star" className="h-4 w-4 fill-current" />
                    4.9 average client rating
                  </div>
                  <p className="max-w-md text-2xl font-bold leading-tight">
                    Owner-led work for homeowners, BRFs and property companies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-white">
          <div className="container-pad grid gap-0 md:grid-cols-4">
            {['F-tax registered', 'ROT guidance', 'Insured projects', 'Written fixed-price quotes'].map((item) => (
              <div key={item} className="flex items-center gap-3 border-blue-100 py-5 md:border-r md:px-6 md:first:border-l">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-700">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="container-pad py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="font-bold uppercase tracking-[0.2em] text-action">Services</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-950 sm:text-5xl">
              One coordinated team for the exterior and energy work around your property.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group cursor-pointer rounded-lg border border-blue-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lift"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
                    {service.meta}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-action transition-colors duration-200 group-hover:bg-action group-hover:text-white">
                    <Icon name={service.meta === 'Roofing' ? 'roof' : 'bolt'} />
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-brand-950">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="bg-brand-950 py-20 text-white lg:py-28">
          <div className="container-pad">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="font-bold uppercase tracking-[0.2em] text-orange-300">Process</p>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  Clear decisions before work begins.
                </h2>
                <p className="mt-5 leading-8 text-blue-100">
                  The goal is simple: fewer surprises, better scheduling and a finished job that matches the quote.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {process.map(([number, title, text]) => (
                  <div key={title} className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
                    <div className="font-display text-3xl font-bold text-orange-300">{number}</div>
                    <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                    <p className="mt-3 leading-7 text-blue-100">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="container-pad py-20 lg:py-28">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="font-bold uppercase tracking-[0.2em] text-action">Recent work</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-950 sm:text-5xl">
                Practical results for real properties.
              </h2>
            </div>
            <a href="#contact" className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-200 hover:bg-blue-50">
              Discuss your project
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {cases.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
                <img src={item.image} alt={`${item.title} in ${item.place}`} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <div className="text-sm font-bold uppercase tracking-[0.16em] text-action">{item.place}</div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-brand-950">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.result}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="reviews" className="bg-white py-20 lg:py-28">
          <div className="container-pad">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-bold uppercase tracking-[0.2em] text-action">Client proof</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-950 sm:text-5xl">
                Trust is built in the details.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {testimonials.map((item) => (
                <figure key={item.name} className="rounded-lg border border-blue-100 bg-brand-50 p-6">
                  <div className="flex gap-1 text-action" aria-label="Five star rating">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon key={index} name="star" className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-lg font-semibold leading-8 text-brand-950">
                    "{item.quote}"
                  </blockquote>
                  <figcaption className="mt-6 border-t border-blue-100 pt-5">
                    <div className="font-bold text-brand-950">{item.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="container-pad py-20 lg:py-28">
          <div className="overflow-hidden rounded-lg bg-brand-950 shadow-soft lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 text-white sm:p-10 lg:p-12">
              <p className="font-bold uppercase tracking-[0.2em] text-orange-300">Start here</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Book a visit or ask for a written quote.
              </h2>
              <p className="mt-5 leading-8 text-blue-100">
                Share the basics and RM Bygg & Montage AB will reply within one weekday. For urgent work, call directly.
              </p>
              <div className="mt-8 space-y-4">
                <a href="tel:+46700000000" className="focus-ring flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4 transition-colors duration-200 hover:bg-white/[0.1]">
                  <Icon name="phone" className="h-5 w-5 text-orange-300" />
                  <span>+46 70 000 00 00</span>
                </a>
                <a href="mailto:info@rmbygg.se" className="focus-ring flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4 transition-colors duration-200 hover:bg-white/[0.1]">
                  <Icon name="mail" className="h-5 w-5 text-orange-300" />
                  <span>info@rmbygg.se</span>
                </a>
              </div>
            </div>

            <form className="bg-white p-8 sm:p-10 lg:p-12" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-bold text-slate-700">Name</label>
                  <input id="name" name="name" className="focus-ring mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-slate-900" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone</label>
                  <input id="phone" name="phone" type="tel" className="focus-ring mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-slate-900" autoComplete="tel" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="service" className="text-sm font-bold text-slate-700">Project type</label>
                  <select id="service" name="service" className="focus-ring mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-slate-900">
                    <option>Solar panels</option>
                    <option>Battery storage</option>
                    <option>EV charger</option>
                    <option>Roofing</option>
                    <option>Windows</option>
                    <option>Exterior painting</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-bold text-slate-700">What should we know?</label>
                  <textarea id="message" name="message" rows="5" className="focus-ring mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-slate-900" />
                </div>
              </div>
              <button className="focus-ring mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-action px-6 py-4 font-bold text-white transition-colors duration-200 hover:bg-orange-600" type="submit">
                Send request
                <Icon name="arrow" />
              </button>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Demo form only. Connect this to your preferred form backend before production.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 bg-white py-8">
        <div className="container-pad flex flex-col justify-between gap-4 text-sm text-slate-600 md:flex-row md:items-center">
          <p>© 2026 RM Bygg & Montage AB. Gothenburg, Sweden.</p>
          <div className="flex gap-5">
            <a className="font-semibold transition-colors hover:text-brand-700" href="#services">Services</a>
            <a className="font-semibold transition-colors hover:text-brand-700" href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
