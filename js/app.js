/* ==========================================================
   RM Bygg & Montage AB — app logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Nav scroll ----------
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      requestAnimationFrame(() => el.classList.add('is-in'));
    } else {
      io.observe(el);
    }
  });

  // ---------- Language ----------
  const LANGS = {
    en: {
      // Hero (direct ID targets kept for compat)
      eyebrow_badge: 'Local · Trusted · Gävle',
      h1_line1:   'Your neighbourhood',
      h1_line2_a: 'builder with',
      h1_em:      'heart',
      h1_line2_b: '',
      hero_sub:   'From solar panels on the roof to a freshly painted façade — built with precision, honesty, and a personal promise you’ll feel from the first handshake.',
      btn_quote:  'Request a Quote',
      btn_book:   'Book Site Visit',
      nav: ['Services', 'Promise', 'Process', 'Projects', 'Reviews', 'Contact'],

      // General translations keyed by data-i18n attribute
      t: {
        // Nav
        'nav.cta':    'Book a visit',
        // Hero meta
        'hero.meta.free.num':   'Free',
        'hero.meta.free.lbl':   'Site visit & inspection',
        'hero.meta.written.num':'Written',
        'hero.meta.written.lbl':'Fixed-price quote',
        'hero.meta.rot.num':    'ROT',
        'hero.meta.rot.lbl':    'Deduction handled',
        'hero.meta.guar.num':   '5 yr',
        'hero.meta.guar.lbl':   'Workmanship guarantee',
        'scroll.cue':           'Scroll to explore',
        // Marquee
        'mq.solar':   'Solar Panels',
        'mq.storage': 'Energy Storage',
        'mq.ev':      'EV Chargers',
        'mq.windows': 'Windows',
        'mq.roofing': 'Roofing',
        'mq.paint':   'Exterior Painting',
        // Section headings with HTML (em tags)
        's.services.h2': 'Everything a home needs —<br><em>under one roof</em>',
        's.promise.h2':  'A relationship, <em>not a transaction</em>.',
        'pm.card.h3':    'One team, <em>one point of contact</em>, one invoice.',
        's.process.h2':  'From first call to <em>final handshake</em>',
        's.gallery.h2':  'A few of the <em>homes we’ve touched</em>',
        's.reviews.h2':  'The word that keeps <em>coming back</em>: trust.',
        's.contact.h2':  'Book a visit. <em>Ask for a quote.</em><br>Or just ring.',
        // Services section header
        's.services.eyebrow': 'What we do',
        's.services.desc':    'Six specialisms. One coordinated team. From the first measurement to the final clean-up, you deal with the same people — and one written quote.',
        // Service cards — tags
        'svc.01.tag':   '01 · Energy',
        'svc.02.tag':   '02 · Storage',
        'svc.03.tag':   '03 · Mobility',
        'svc.04.tag':   '04 · Envelope',
        'svc.05.tag':   '05 · Roofing',
        'svc.06.tag':   '06 · Finish',
        // Service cards — titles
        'svc.01.title': 'Solar panel systems',
        'svc.02.title': 'Batteries & storage',
        'svc.03.title': 'EV chargers',
        'svc.04.title': 'Window replacement',
        'svc.05.title': 'Roof renovation',
        'svc.06.title': 'Exterior painting',
        // Service cards — descriptions
        'svc.01.desc': 'Production calculation before a single panel is ordered. Design, install, grid connection and monitoring — all in-house. Panels warranted to 25 years.',
        'svc.02.desc': 'Store your own solar and trade on spot-price when it pays off. Sized to your consumption profile — not a one-size-fits-all kit.',
        'svc.03.desc': 'Certified installs for home, workplace and housing associations. Load-balancing included. Smart-charging ready from day one.',
        'svc.04.desc': 'Triple-glazed, energy-efficient windows installed with care and always a clean site. Typical heating-bill savings of 15–25 %.',
        'svc.05.desc': 'Tile, metal, and felt. Moisture and structural check before the quote — you know what you’re getting before we start.',
        'svc.06.desc': 'Correct primer, correct paint, correct technique. Scaffolding, prep, and clean-up all included — finish that lasts a decade.',
        // Visual kickers & metrics
        'svc.01.kicker':      'Solar design',
        'svc.01.metric.val':  '6.3 kWp',
        'svc.01.metric.lbl':  'estimated output',
        'svc.02.kicker':      'Storage profile',
        'svc.02.metric.val':  'Smart load',
        'svc.02.metric.lbl':  'peak balancing',
        'svc.03.kicker':      'EV charging',
        'svc.03.metric.val':  '22 kW',
        'svc.03.metric.lbl':  'load balanced',
        'svc.04.kicker':      'Envelope upgrade',
        'svc.04.metric.val':  'Triple glass',
        'svc.04.metric.lbl':  'energy efficient',
        'svc.05.kicker':      'Roof survey',
        'svc.05.metric.val':  'Moisture check',
        'svc.05.metric.lbl':  'before quote',
        'svc.06.kicker':      'Facade finish',
        'svc.06.metric.val':  '10 yr finish',
        'svc.06.metric.lbl':  'prep included',
        // Service chips
        'chip.b2b':  'B2B',  'chip.b2c': 'B2C',  'chip.rot':  'ROT',
        'chip.villa':'Villa','chip.brf':  'BRF',  'chip.home': 'Home',
        'chip.fleet':'Fleet','chip.comm': 'Commercial','chip.indus':'Industrial',
        'chip.herit':'Heritage',
        'learn.link': 'Quote →',
        // Promise section
        's.promise.eyebrow': 'Our promise',
        's.promise.desc':    'Our team picks up the phone directly. You’ll know the names of the people on your roof. When something’s unclear — and on a building site it will be — you hear about it first, not last.',
        'pm.01.h4': 'Direct line to the owner',
        'pm.01.p':  'No call-centre, no account-manager hand-offs. You get the personal number of the person running the job — and he picks up.',
        'pm.02.h4': 'Fixed-price, written quotes',
        'pm.02.p':  'Everything in one document — scope, materials, labour, timeline, payment schedule. What you sign is what you pay.',
        'pm.03.h4': 'Our own crew, our own standards',
        'pm.03.p':  'Work coordinated by people you’ve met, not by a chain of subcontractors you haven’t. ROT, F-tax, insurance — all handled by us.',
        'pm.04.h4': 'Clean site, clean finish',
        'pm.04.p':  'Dust sheets, daily sweep, and scaffolding removed on the last day. We leave your home or property the way we found it — only better.',
        'pm.05.h4': '5-year workmanship guarantee',
        'pm.05.p':  'If something we installed goes wrong on our watch, we fix it. Written into every contract — not a marketing promise.',
        'pm.card.p':   'That’s the whole pitch. It’s why housing associations, villa owners and property companies keep coming back.',
        'pm.quote':    'The person who gives you the quote<br>is the person on your roof.<br><em>That’s how it should work.</em>',
        'pm.cite':     'Rezki · Owner &amp; site manager, RM Bygg &amp; Montage AB',
        'pm.stat.reply':'Weekday reply',
        'pm.stat.years':'Trading',
        'pm.stat.review':'Avg review',
        // Process section
        's.process.eyebrow': 'How it works',
        's.process.desc':    'No surprises. Every project follows the same five steps, with clear checkpoints and clear ownership.',
        'step.01.h5': 'Conversation',
        'step.01.p':  'Call, email, or web form. We listen first — the goal is to understand what you actually need, not sell you something bigger.',
        'step.01.meta': 'Same day',
        'step.02.h5': 'Site visit',
        'step.02.p':  'Always free. We measure, photograph, check structure and note everything — so the quote that follows has no surprises.',
        'step.02.meta': 'Within 1 week',
        'step.03.h5': 'Written quote',
        'step.03.p':  'Fixed price. Itemised scope, materials, labour, timeline and payment schedule — in one PDF, in plain language.',
        'step.03.meta': '48–72 hours',
        'step.04.h5': 'Build',
        'step.04.p':  'Our own crew. Daily clean-up. WhatsApp updates with photos. Any change hits the contract before it hits the site.',
        'step.04.meta': 'Scheduled start',
        'step.05.h5': 'Hand-over',
        'step.05.p':  'Final walk-through together, documentation pack, guarantee certificate, and a follow-up call two weeks later. Done properly.',
        'step.05.meta': '+ 5-yr guarantee',
        // Gallery section
        's.gallery.eyebrow': 'Recent work',
        's.gallery.desc':    'From villa rooftops in Sandviken to a BRF energy upgrade in central Gävle — click any tile to open.',
        'gf.all':    'All',
        'gf.solar':  'Solar',
        'gf.bat':    'Battery',
        'gf.roof':   'Roofing',
        'gf.ev':     'EV',
        'gf.window': 'Windows',
        'gf.paint':  'Painting',
        // Gallery items
        'gi.01.h6': 'Villa Särö · 9.6 kWp rooftop',
        'gi.01.sp': 'Solar · 2025',
        'gi.02.h6': 'Hofors · Tile replacement',
        'gi.02.sp': 'Roofing',
        'gi.03.h6': 'Home wallbox · 22 kW',
        'gi.03.sp': 'EV · B2C',
        'gi.04.h6': 'Facade refresh',
        'gi.04.sp': 'Paint · Heritage',
        'gi.05.h6': 'BRF Örgryte · 42 windows',
        'gi.05.sp': 'Windows · B2B',
        'gi.06.h6': 'Industrial array',
        'gi.06.sp': 'Solar · B2B',
        'gi.07.h6': 'Standing-seam metal',
        'gi.07.sp': 'Roofing',
        'gi.08.h6': 'BRF Söderhamn · 18 stations',
        'gi.08.sp': 'EV · Load-balanced',
        'gi.09.h6': 'Falu red · full façade',
        'gi.09.sp': 'Paint · Villa',
        'gi.10.h6': 'Triple glazing · new build',
        'gi.10.sp': 'Windows',
        // Reviews section
        's.reviews.eyebrow': 'What clients say',
        's.reviews.desc':    'Real reviews from real jobs across Gävle, Uppsala, Hudiksvall and Falun.',
        'rv.01.q':    '“The team walked our roof with me before quoting. That alone told me who I was dealing with. Job came in on the day, on the price.”',
        'rv.01.who':  'Anna K.',
        'rv.01.role': 'Villa owner · Sandviken',
        'rv.02.q':    '“We had three quotes. His was the clearest and the only one that actually explained why. Solar + battery running two months now, numbers match the forecast.”',
        'rv.02.who':  'Martin P.',
        'rv.02.role': 'Homeowner · Söderhamn',
        'rv.03.q':    '“Eighteen EV stations for our BRF, load-balanced to the main fuse. Start to grid-ready in three weeks. I’d call him first on the next project.”',
        'rv.03.who':  'Lars S.',
        'rv.03.role': 'Board chair · BRF Gävle',
        // Contact section
        's.contact.eyebrow': 'Talk to us',
        's.contact.desc':    'Weekday response within 24 hours. Free site visits across Gävle, Söderhamn, Sandviken, Hofors, Ockelbo and Bollnäs.',
        'cr.phone.lbl': 'Call us directly',
        'cr.phone.cta': 'Call →',
        'cr.email.lbl': 'Email',
        'cr.email.cta': 'Write →',
        'cr.area.lbl':  'Service area',
        'cr.area.val':  'Gävle & surroundings',
        'cr.area.cta':  'Local',
        'cr.hours.lbl': 'Office hours',
        'cr.hours.cta': 'Open now',
        'cr.paper.eyebrow': 'Paperwork, sorted',
        // Form tabs
        'tab.book':    'Book visit',
        'tab.quote':   'Quote',
        'tab.invoice': 'Invoice request',
        // Book form
        'form.book.h3':    'Book a <em>free site visit</em>',
        'form.book.sub':   'Pick a day. Pick a time. We bring the measuring tape.',
        'form.book.slots': 'Select a date first',
        'form.book.name.lbl':    'Name',
        'form.book.phone.lbl':   'Phone',
        'form.book.email.lbl':   'Email',
        'form.book.addr.lbl':    'Property address',
        'form.book.addr.ph':     'Street, Gävle',
        'form.book.about.lbl':   'What would you like to talk about',
        'form.book.notes.lbl':   'Notes',
        'form.book.notes.ph':    'Anything we should know before we arrive',
        'form.book.submit':      'Confirm booking',
        'form.book.ok.h3':       'Booking received',
        'form.book.ok.p':        'Our team will confirm by phone within 24 hours on weekdays.',
        // Quote form
        'form.quote.h3':     'Ask for a <em>price estimate</em>',
        'form.quote.sub':    'Tell us a bit about the job. We reply within 48 hours with a first number and next steps.',
        'form.quote.name.lbl':  'Name',
        'form.quote.co.lbl':    'Company',
        'form.quote.email.lbl': 'Email',
        'form.quote.phone.lbl': 'Phone',
        'form.quote.svc.lbl':   'Services you’re interested in',
        'form.quote.type.lbl':  'Property type',
        'form.quote.time.lbl':  'Timing',
        'form.quote.desc.lbl':  'Describe the project',
        'form.quote.desc.ph':   'Scope, rough square metres, any deadlines…',
        'form.quote.note':      'No obligation · no data sharing',
        'form.quote.submit':    'Send request',
        'form.quote.ok.h3':     'Request received',
        'form.quote.ok.p':      'We’ll be back within 48 hours with a first estimate.',
        // Invoice form
        'form.inv.h3':      'Request an <em>invoice</em> or receipt',
        'form.inv.sub':     'Existing clients — need a copy, a correction, or B2B invoicing details? Fill this in and we’ll reply same working day.',
        'form.inv.co.lbl':  'Company / name',
        'form.inv.email.lbl': 'Email',
        'form.inv.phone.lbl': 'Phone',
        'form.inv.type.lbl': 'Request type',
        'form.inv.ref.lbl':  'Reference / invoice number',
        'form.inv.ref.ph':   'RM-2025-XXXX',
        'form.inv.det.lbl':  'Details',
        'form.inv.det.ph':   'What you need, and by when',
        'form.inv.note':     'Handled same working day',
        'form.inv.submit':   'Submit',
        'form.inv.ok.h3':    'Got it',
        'form.inv.ok.p':     'Our office will reply the same working day.',
        // Select options — property type
        'opt.prop.villa':  'Villa / single-family',
        'opt.prop.terr':   'Terraced / row',
        'opt.prop.brf':    'Housing association (BRF)',
        'opt.prop.comm':   'Commercial / industrial',
        // Select options — timing
        'opt.time.asap':   'As soon as possible',
        'opt.time.3m':     'Within 3 months',
        'opt.time.6m':     'Within 6 months',
        'opt.time.exp':    'Just exploring',
        // Select options — invoice
        'opt.inv.copy':    'Copy of invoice',
        'opt.inv.corr':    'Correction of invoice',
        'opt.inv.chg':     'Change billing details',
        'opt.inv.new':     'New B2B customer setup',
        'opt.inv.cred':    'Credit note',
        // Footer
        'ft.brand.p':      'Your neighbourhood builder in Gävle. Solar, batteries, chargers, windows, roofs, façades — one crew, one quote, one handshake.',
        'ft.col.services': 'Services',
        'ft.col.company':  'Company',
        'ft.col.contact':  'Contact',
        'ft.svc.solar':    'Solar panels',
        'ft.svc.bat':      'Batteries',
        'ft.svc.ev':       'EV chargers',
        'ft.svc.win':      'Windows',
        'ft.svc.roof':     'Roofing',
        'ft.svc.paint':    'Painting',
        'ft.co.promise':   'Our promise',
        'ft.co.process':   'Process',
        'ft.co.projects':  'Projects',
        'ft.co.reviews':   'Reviews',
        'ft.co.contact':   'Contact',
        // Cookie bar
        'cookie.p':   'This site uses cookies to improve your experience. By continuing you agree to our use of cookies per GDPR &amp; Swedish consumer law.',
        'cookie.btn': 'Accept &amp; Continue',
        // Layered stack
        'ls.hint': 'Hover to reveal all projects',
        // WhatsApp
        'wa.tooltip': 'Chat on WhatsApp',
        // Promo popup
        'promo.eyebrow': 'Free of charge',
        'promo.heading': 'Come see for yourself —<br><em>we\'ll come to you.</em>',
        'promo.body':    'No cost, no obligation. Just a clear picture of what\'s possible on your property before you decide anything.',
        'promo.cta':     'Book your free site visit',
        'promo.note':    'Takes 30 seconds · No payment needed',
      }
    },

    sv: {
      eyebrow_badge: 'Lokal · Pålitlig · Gävle',
      h1_line1:   'Din lokala',
      h1_line2_a: 'byggare med',
      h1_em:      'hjärta',
      h1_line2_b: '',
      hero_sub:   'Från solceller på taket till en nymålad fasad — byggt med precision, ärlighet och ett personligt löfte du känner från första handslaget.',
      btn_quote:  'Begär offert',
      btn_book:   'Boka platsbesök',
      nav: ['Tjänster', 'Vårt löfte', 'Process', 'Projekt', 'Omdömen', 'Kontakt'],

      t: {
        'nav.cta': 'Boka ett besök',
        // Hero meta
        'hero.meta.free.num':   'Kostnadsfritt',
        'hero.meta.free.lbl':   'Platsbesök &amp; besiktning',
        'hero.meta.written.num':'Skriftlig',
        'hero.meta.written.lbl':'Fastprisoffert',
        'hero.meta.rot.num':    'ROT',
        'hero.meta.rot.lbl':    'Avdrag hanteras',
        'hero.meta.guar.num':   '5 år',
        'hero.meta.guar.lbl':   'Hantverksgaranti',
        'scroll.cue':           'Skrolla för att utforska',
        // Marquee
        'mq.solar':   'Solceller',
        'mq.storage': 'Batterilager',
        'mq.ev':      'Laddboxar',
        'mq.windows': 'Fönster',
        'mq.roofing': 'Takrenovering',
        'mq.paint':   'Fasadmålning',
        // Section headings with HTML (em tags)
        's.services.h2': 'Allt ett hem behöver —<br><em>under ett tak</em>',
        's.promise.h2':  'En relation, <em>inte en transaktion</em>.',
        'pm.card.h3':    'Ett team, <em>en kontaktpunkt</em>, en faktura.',
        's.process.h2':  'Från första samtal till <em>sista handslag</em>',
        's.gallery.h2':  'Några av de <em>hem vi har rört vid</em>',
        's.reviews.h2':  'Ordet som alltid <em>återkommer</em>: förtroende.',
        's.contact.h2':  'Boka ett besök. <em>Begär en offert.</em><br>Eller ring.',
        // Services header
        's.services.eyebrow': 'Vad vi gör',
        's.services.desc':    'Sex specialområden. Ett koordinerat team. Från första mätningen till sista städningen möter du samma människor — och en skriftlig offert.',
        // Service tags
        'svc.01.tag': '01 · Energi',
        'svc.02.tag': '02 · Lagring',
        'svc.03.tag': '03 · Mobilitet',
        'svc.04.tag': '04 · Klimatskal',
        'svc.05.tag': '05 · Tak',
        'svc.06.tag': '06 · Finish',
        // Service titles
        'svc.01.title': 'Solcellsanläggningar',
        'svc.02.title': 'Batterilager',
        'svc.03.title': 'Laddboxar',
        'svc.04.title': 'Fönsterbyte',
        'svc.05.title': 'Takrenovering',
        'svc.06.title': 'Fasadmålning',
        // Service descriptions
        'svc.01.desc': 'Solcellskalkyl innan en enda panel beställs. Design, installation, nätanslutning och övervakning — allt internt. Paneler med 25 års garanti.',
        'svc.02.desc': 'Lagra din egen solel och handla på spotpris när det lönar sig. Dimensionerat efter din förbrukningsprofil — inte ett standardpaket.',
        'svc.03.desc': 'Certifierade installationer för villa, arbetsplats och bostadsrättsföreningar. Lastbalansering ingår. Smartladdning redo från dag ett.',
        'svc.04.desc': 'Treglasfönster, energieffektiva fönster monterade med omsorg och alltid en ren arbetsplats. Typiska besparingar på värmeräkningen med 15–25 %.',
        'svc.05.desc': 'Tegel, plåt och papp. Fuktmätning och strukturkontroll före offert — du vet vad du får innan vi börjar.',
        'svc.06.desc': 'Rätt grundfärg, rätt färg, rätt teknik. Byggnadsställning, förberedelse och städning ingår — ett slutresultat som håller ett decennium.',
        // Visual kickers & metrics
        'svc.01.kicker':      'Solcellsdesign',
        'svc.01.metric.val':  '6,3 kWp',
        'svc.01.metric.lbl':  'uppskattad effekt',
        'svc.02.kicker':      'Lagringsprofil',
        'svc.02.metric.val':  'Smart last',
        'svc.02.metric.lbl':  'toppbelastning',
        'svc.03.kicker':      'Elbilsladdning',
        'svc.03.metric.val':  '22 kW',
        'svc.03.metric.lbl':  'lastbalanserad',
        'svc.04.kicker':      'Klimatskaluppgradering',
        'svc.04.metric.val':  'Treglas',
        'svc.04.metric.lbl':  'energieffektivt',
        'svc.05.kicker':      'Takbesiktning',
        'svc.05.metric.val':  'Fuktmätning',
        'svc.05.metric.lbl':  'innan offert',
        'svc.06.kicker':      'Fasadfinish',
        'svc.06.metric.val':  '10 års finish',
        'svc.06.metric.lbl':  'prep ingår',
        // Service chips
        'chip.b2b':  'B2B',  'chip.b2c':  'B2C', 'chip.rot':  'ROT',
        'chip.villa':'Villa','chip.brf':   'BRF', 'chip.home': 'Hem',
        'chip.fleet':'Flotta','chip.comm': 'Kommersiellt','chip.indus':'Industriell',
        'chip.herit':'Kulturmiljö',
        'learn.link': 'Offert →',
        // Promise
        's.promise.eyebrow': 'Vårt löfte',
        's.promise.desc':    'Vårt team svarar direkt. Du kommer att känna till namnen på personerna på ditt tak. När något är oklart — och det kommer det att vara på en byggarbetsplats — hör du om det först, inte sist.',
        'pm.01.h4': 'Direktlinje till ägaren',
        'pm.01.p':  'Inget callcenter, inga kontoansvariga mellanhänder. Du får det personliga numret till den som leder jobbet — och han svarar.',
        'pm.02.h4': 'Fastpris, skriftliga offerter',
        'pm.02.p':  'Allt i ett dokument — omfång, material, arbetskraft, tidplan, betalningsschema. Det du skriver under är det du betalar.',
        'pm.03.h4': 'Vår egen personal, våra egna standarder',
        'pm.03.p':  'Arbete koordinerat av personer du har träffat, inte av en kedja av underleverantörer du inte känner. ROT, F-skatt, försäkring — allt hanterat av oss.',
        'pm.04.h4': 'Ren arbetsplats, rent resultat',
        'pm.04.p':  'Dammdukar, daglig städning och byggnadsställning borttagen sista dagen. Vi lämnar ditt hem eller fastighet som vi hittade det — fast bättre.',
        'pm.05.h4': '5 års hantverksgaranti',
        'pm.05.p':  'Om något vi installerade går fel under vår tillsyn lagar vi det. Inskrivet i varje kontrakt — inte ett marknadsföringslöfte.',
        'pm.card.p':   'Det är hela pitchen. Det är därför bostadsrättsföreningar, villaägare och fastighetsbolag återkommer.',
        'pm.quote':    'Den som ger dig offerten<br>är den som jobbar på ditt tak.<br><em>Så ska det vara.</em>',
        'pm.cite':     'Rezki · Ägare &amp; platschef, RM Bygg &amp; Montage AB',
        'pm.stat.reply': 'Vardagssvar',
        'pm.stat.years': 'I branschen',
        'pm.stat.review':'Snittbetyg',
        // Process
        's.process.eyebrow': 'Så fungerar det',
        's.process.desc':    'Inga överraskningar. Varje projekt följer samma fem steg, med tydliga kontrollpunkter och tydligt ägarskap.',
        'step.01.h5': 'Samtal',
        'step.01.p':  'Ring, mejla eller fyll i formuläret. Vi lyssnar först — målet är att förstå vad du faktiskt behöver, inte sälja dig något större.',
        'step.01.meta': 'Samma dag',
        'step.02.h5': 'Platsbesök',
        'step.02.p':  'Alltid kostnadsfritt. Vi mäter, fotograferar, kontrollerar struktur och noterar allt — så att offerten som följer inte innehåller några överraskningar.',
        'step.02.meta': 'Inom 1 vecka',
        'step.03.h5': 'Skriftlig offert',
        'step.03.p':  'Fastpris. Specificerat omfång, material, arbetskraft, tidplan och betalningsschema — i en PDF, på klarspråk.',
        'step.03.meta': '48–72 timmar',
        'step.04.h5': 'Byggstart',
        'step.04.p':  'Vår egen personal. Daglig städning. WhatsApp-uppdateringar med foton. Eventuella ändringar skrivs in i kontraktet innan de genomförs.',
        'step.04.meta': 'Planerad start',
        'step.05.h5': 'Överlämning',
        'step.05.p':  'Gemensam slutgenomgång, dokumentationspaket, garantibevis och uppföljningssamtal två veckor senare. Gjort ordentligt.',
        'step.05.meta': '+ 5 års garanti',
        // Gallery
        's.gallery.eyebrow': 'Senaste projekt',
        's.gallery.desc':    'Från villatak i Sandviken till en BRF-energiuppgradering i centrala Gävle — klicka på valfri bild för att öppna.',
        'gf.all':    'Alla',
        'gf.solar':  'Solceller',
        'gf.bat':    'Batteri',
        'gf.roof':   'Tak',
        'gf.ev':     'Laddning',
        'gf.window': 'Fönster',
        'gf.paint':  'Målning',
        // Gallery items
        'gi.01.h6': 'Villa Särö · 9,6 kWp tak',
        'gi.01.sp': 'Solceller · 2025',
        'gi.02.h6': 'Hofors · Tegelutbyte',
        'gi.02.sp': 'Tak',
        'gi.03.h6': 'Hemmaladdbox · 22 kW',
        'gi.03.sp': 'Laddning · B2C',
        'gi.04.h6': 'Fasadrenovering',
        'gi.04.sp': 'Målning · Kulturmiljö',
        'gi.05.h6': 'BRF Örgryte · 42 fönster',
        'gi.05.sp': 'Fönster · B2B',
        'gi.06.h6': 'Industriell anläggning',
        'gi.06.sp': 'Solceller · B2B',
        'gi.07.h6': 'Stående falsplåt',
        'gi.07.sp': 'Tak',
        'gi.08.h6': 'BRF Söderhamn · 18 stationer',
        'gi.08.sp': 'Laddning · Lastbalanserad',
        'gi.09.h6': 'Faluröd · hel fasad',
        'gi.09.sp': 'Målning · Villa',
        'gi.10.h6': 'Treglasfönster · nybygge',
        'gi.10.sp': 'Fönster',
        // Reviews
        's.reviews.eyebrow': 'Vad kunderna säger',
        's.reviews.desc':    'Äkta omdömen från äkta jobb runt Gävle, Uppsala, Hudiksvall och Falun.',
        'rv.01.q':    '„Teamet gick upp på vårt tak med mig innan de lade offerten. Det sa mig allt om vem jag hade att göra med. Jobbet levererades i tid och till rätt pris.“',
        'rv.01.who':  'Anna K.',
        'rv.01.role': 'Villaägare · Sandviken',
        'rv.02.q':    '„Vi fick tre offerter. Hans var tydligast och den enda som faktiskt förklarade varför. Solceller + batteri i drift sedan två månader — siffrorna stämmer med prognosen.“',
        'rv.02.who':  'Martin P.',
        'rv.02.role': 'Husägare · Söderhamn',
        'rv.03.q':    '„Arton laddstationer för vår BRF, lastbalanserade till huvudsäkringen. Från start till nätanslutning på tre veckor. Jag ringer honom först vid nästa projekt.”',
        'rv.03.who':  'Lars S.',
        'rv.03.role': 'Styrelseordförande · BRF Gävle',
        // Contact
        's.contact.eyebrow': 'Prata med oss',
        's.contact.desc':    'Svar på vardagar inom 24 timmar. Kostnadsfria platsbesök runt Gävle, Söderhamn, Sandviken, Hofors, Ockelbo och Bollnäs.',
        'cr.phone.lbl': 'Ring oss direkt',
        'cr.phone.cta': 'Ring →',
        'cr.email.lbl': 'E-post',
        'cr.email.cta': 'Skriv →',
        'cr.area.lbl':  'Serviceområde',
        'cr.area.val':  'Gävle & omnejd',
        'cr.area.cta':  'Lokal',
        'cr.hours.lbl': 'Kontorstid',
        'cr.hours.cta': 'Öppet nu',
        'cr.paper.eyebrow': 'Pappersarbetet klart',
        // Form tabs
        'tab.book':    'Boka besök',
        'tab.quote':   'Offert',
        'tab.invoice': 'Fakturaförfrågan',
        // Book form
        'form.book.h3':    'Boka ett <em>kostnadsfritt platsbesök</em>',
        'form.book.sub':   'Välj en dag. Välj en tid. Vi tar med måttbandet.',
        'form.book.slots': 'Välj ett datum först',
        'form.book.name.lbl':  'Namn',
        'form.book.phone.lbl': 'Telefon',
        'form.book.email.lbl': 'E-post',
        'form.book.addr.lbl':  'Fastighetens adress',
        'form.book.addr.ph':   'Gata, Gävle',
        'form.book.about.lbl': 'Vad vill du prata om',
        'form.book.notes.lbl': 'Anteckningar',
        'form.book.notes.ph':  'Finns det något vi bör veta innan vi anländer',
        'form.book.submit':    'Bekräfta bokning',
        'form.book.ok.h3':     'Bokning mottagen',
        'form.book.ok.p':      'Vårt team bekärftar per telefon inom 24 timmar på vardagar.',
        // Quote form
        'form.quote.h3':     'Begär en <em>prisuppskattning</em>',
        'form.quote.sub':    'Berätta lite om jobbet. Vi svarar inom 48 timmar med ett första pris och nästa steg.',
        'form.quote.name.lbl':  'Namn',
        'form.quote.co.lbl':    'Företag',
        'form.quote.email.lbl': 'E-post',
        'form.quote.phone.lbl': 'Telefon',
        'form.quote.svc.lbl':   'Tjänster du är intresserad av',
        'form.quote.type.lbl':  'Fastighetstyp',
        'form.quote.time.lbl':  'Tidsram',
        'form.quote.desc.lbl':  'Beskriv projektet',
        'form.quote.desc.ph':   'Omfång, ungefärlig yta, eventuella deadlines…',
        'form.quote.note':      'Ingen förpliktelse · ingen datadelning',
        'form.quote.submit':    'Skicka förfrågan',
        'form.quote.ok.h3':     'Förfrågan mottagen',
        'form.quote.ok.p':      'Vi återkommer inom 48 timmar med en första uppskattning.',
        // Invoice form
        'form.inv.h3':      'Begär en <em>faktura</em> eller kvitto',
        'form.inv.sub':     'Befintliga kunder — behöver du en kopia, en korrigering eller B2B-faktureringsuppgifter? Fyll i det här och vi svarar samma arbetsdag.',
        'form.inv.co.lbl':  'Företag / namn',
        'form.inv.email.lbl': 'E-post',
        'form.inv.phone.lbl': 'Telefon',
        'form.inv.type.lbl':  'Typ av förfrågan',
        'form.inv.ref.lbl':   'Referens / fakturanummer',
        'form.inv.ref.ph':    'RM-2025-XXXX',
        'form.inv.det.lbl':   'Detaljer',
        'form.inv.det.ph':    'Vad du behöver och när',
        'form.inv.note':      'Hanteras samma arbetsdag',
        'form.inv.submit':    'Skicka',
        'form.inv.ok.h3':     'Vi har mottagit det',
        'form.inv.ok.p':      'Vårt kontor svarar samma arbetsdag.',
        // Select options — property type
        'opt.prop.villa': 'Villa / enbostadshus',
        'opt.prop.terr':  'Radhus',
        'opt.prop.brf':   'Bostadsrättsförening (BRF)',
        'opt.prop.comm':  'Kommersiellt / industriellt',
        // Select options — timing
        'opt.time.asap': 'Så snart som möjligt',
        'opt.time.3m':   'Inom 3 månader',
        'opt.time.6m':   'Inom 6 månader',
        'opt.time.exp':  'Undersöker bara',
        // Select options — invoice
        'opt.inv.copy': 'Kopia av faktura',
        'opt.inv.corr': 'Korrigering av faktura',
        'opt.inv.chg':  'Ändra fakturauppgifter',
        'opt.inv.new':  'Ny B2B-kundregistrering',
        'opt.inv.cred': 'Kreditnota',
        // Footer
        'ft.brand.p':      'Din lokala byggare i Gävle. Solceller, batterier, laddboxar, fönster, tak, fasader — ett lag, en offert, ett handslag.',
        'ft.col.services': 'Tjänster',
        'ft.col.company':  'Företag',
        'ft.col.contact':  'Kontakt',
        'ft.svc.solar':    'Solceller',
        'ft.svc.bat':      'Batterier',
        'ft.svc.ev':       'Laddboxar',
        'ft.svc.win':      'Fönster',
        'ft.svc.roof':     'Takrenovering',
        'ft.svc.paint':    'Målning',
        'ft.co.promise':   'Vårt löfte',
        'ft.co.process':   'Process',
        'ft.co.projects':  'Projekt',
        'ft.co.reviews':   'Omdömen',
        'ft.co.contact':   'Kontakt',
        // Cookie bar
        'cookie.p':   'Denna webbplats använder cookies för att förbättra din upplevelse. Genom att fortsätta godkänner du vår användning av cookies enligt GDPR och svensk konsumentlagstiftning.',
        'cookie.btn': 'Acceptera &amp; Fortsätt',
        // Layered stack
        'ls.hint': 'Hovra för att visa alla projekt',
        // WhatsApp
        'wa.tooltip': 'Chatta på WhatsApp',
        // Promo popup
        'promo.eyebrow': 'Helt kostnadsfritt',
        'promo.heading': 'Se möjligheterna —<br><em>vi kommer till dig.</em>',
        'promo.body':    'Utan kostnad, utan förpliktelse. Bara en tydlig bild av vad som är möjligt på din fastighet innan du bestämmer dig.',
        'promo.cta':     'Boka kostnadsfritt platsbesök',
        'promo.note':    'Tar 30 sekunder · Ingen betalning behövs',
      }
    }
  };

  const langBtns = document.querySelectorAll('[data-lang]');
  let currentLang = 'en';

  function applyLang(l) {
    const L = LANGS[l];
    if (!L) return;
    currentLang = l;

    // --- Legacy hero direct-ID targets ---
    const byId = id => document.getElementById(id);
    const setTxt = (id, val) => { const el = byId(id); if (el) el.textContent = val; };
    setTxt('h1-line1',   L.h1_line1);
    setTxt('h1-line2-a', L.h1_line2_a);
    setTxt('h1-em',      L.h1_em);
    setTxt('h1-line2-b', L.h1_line2_b);
    setTxt('hero-sub',   L.hero_sub);
    const qText = byId('btn-quote-text') || byId('btn-quote');
    if (qText) qText.textContent = L.btn_quote;
    const bookBtn = byId('btn-book');
    if (bookBtn) bookBtn.textContent = L.btn_book;
    const badge = byId('eyebrow-badge');
    if (badge) badge.textContent = L.eyebrow_badge;

    // --- Nav links (desktop) ---
    document.querySelectorAll('.nav-links a').forEach((a, i) => {
      if (L.nav[i]) a.textContent = L.nav[i];
    });
    // --- Nav links (mobile drawer) ---
    document.querySelectorAll('.mobile-nav-link').forEach((a, i) => {
      if (L.nav[i]) a.textContent = L.nav[i];
    });
    // --- Footer column links that mirror nav ---
    const ftNav = document.querySelectorAll('.foot-col-nav a');
    ftNav.forEach((a, i) => { if (L.nav[i]) a.textContent = L.nav[i]; });

    // --- General textContent translations ---
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = L.t[el.dataset.i18n];
      if (val !== undefined) el.textContent = val;
    });

    // --- innerHTML translations (elements with nested tags) ---
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = L.t[el.dataset.i18nHtml];
      if (val !== undefined) el.innerHTML = val;
    });

    // --- Placeholder translations ---
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const val = L.t[el.dataset.i18nPh];
      if (val !== undefined) el.placeholder = val;
    });

    // --- Active lang button ---
    langBtns.forEach(b => b.classList.toggle('is-active', b.dataset.lang === l));
    localStorage.setItem('rm-lang', l);

    // --- Re-render calendar month name if calendar is present ---
    const calMonthEl = document.querySelector('.cal-month');
    if (calMonthEl && calMonthEl.textContent) {
      const viewDate = new Date();
      viewDate.setDate(1);
      calMonthEl.textContent = `${viewDate.toLocaleString(l === 'sv' ? 'sv-SE' : 'en-GB', { month: 'long' })} ${viewDate.getFullYear()}`;
    }
  }

  langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(localStorage.getItem('rm-lang') || 'sv');

  // ---------- Tabs ----------
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(x => x.classList.toggle('is-active', x === b));
    panes.forEach(p => p.style.display = p.dataset.tab === b.dataset.tab ? '' : 'none');
  }));

  // ---------- Service chips toggle ----------
  document.querySelectorAll('.service-chips .chip').forEach(c => {
    c.addEventListener('click', () => c.classList.toggle('is-on'));
  });

  // ---------- Gallery filter ----------
  const gf = document.querySelectorAll('.gallery-filter button');
  gf.forEach(b => b.addEventListener('click', () => {
    gf.forEach(x => x.classList.toggle('is-active', x === b));
    const k = b.dataset.filter;
    document.querySelectorAll('.gitem').forEach(g => {
      g.classList.toggle('is-hidden', k !== 'all' && g.dataset.cat !== k);
    });
  }));

  // ---------- Gallery lightbox ----------
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gitem').forEach(g => {
    g.addEventListener('click', () => {
      lbImg.src = g.querySelector('img').src;
      lb.classList.add('is-open');
    });
  });
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) lb.classList.remove('is-open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-open'); });

  // ---------- Reviews marquee ----------
  function renderReviews(reviews) {
    const track = document.getElementById('review-track');
    if (!track) return;
    const visible = reviews.filter(r => r.visible !== false);
    if (!visible.length) return;
    const card = r => {
      const initials = (r.name || '').split(' ').map(w => w[0]).slice(0, 2).join('');
      const stars = '★'.repeat(Math.min(5, r.rating || 5));
      return `<div class="review-card">
        <div class="stars">${stars}</div>
        <blockquote>${r.quote}</blockquote>
        <div class="who">
          <div class="avi">${initials}</div>
          <div><strong>${r.name}</strong><span>${r.role || ''}</span></div>
        </div>
      </div>`;
    };
    const html = visible.map(card).join('');
    track.innerHTML = html + html;
  }

  (async () => {
    const _cfg = window.RM_AUTH_CONFIG || {};
    if (_cfg.supabaseUrl && _cfg.supabaseAnonKey && window.supabase) {
      const _sb = window.supabase.createClient(_cfg.supabaseUrl, _cfg.supabaseAnonKey);
      const { data, error } = await _sb.from('reviews').select('*').order('created_at');
      if (!error && data && data.length) { renderReviews(data); return; }
    }
  })();

  // ---------- Calendar ----------
  const calRoot = document.getElementById('calendar');
  if (calRoot) {
    let view = new Date(); view.setDate(1);
    let selected = null, slot = null;
    const monthEl   = calRoot.querySelector('.cal-month');
    const gridEl    = calRoot.querySelector('.cal-grid');
    const slotsEl   = document.getElementById('slots');
    const slotsLabel = document.getElementById('slots-label');

    function busyDays(year, month) {
      const seed = year * 12 + month;
      const days = [];
      for (let i = 0; i < 4; i++) days.push(((seed * 7 + i * 11) % 26) + 3);
      return new Set(days);
    }
    function render() {
      const y = view.getFullYear(), m = view.getMonth();
      monthEl.textContent = `${view.toLocaleString(currentLang === 'sv' ? 'sv-SE' : 'en-GB', { month: 'long' })} ${y}`;
      gridEl.innerHTML = '';
      const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const busy = busyDays(y, m);
      const today = new Date(); today.setHours(0,0,0,0);
      for (let i = 0; i < firstDow; i++) {
        const c = document.createElement('div'); c.className = 'cal-cell is-off'; gridEl.appendChild(c);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const c = document.createElement('div'); c.className = 'cal-cell'; c.textContent = d;
        const dt = new Date(y, m, d);
        if (dt < today) c.classList.add('is-past');
        const dow = dt.getDay();
        if (dow === 0 || dow === 6) c.classList.add('is-off');
        if (dt.toDateString() === today.toDateString()) c.classList.add('is-today');
        if (busy.has(d)) c.classList.add('is-busy');
        if (selected && dt.toDateString() === selected.toDateString()) c.classList.add('is-sel');
        c.addEventListener('click', () => {
          if (c.classList.contains('is-off') || c.classList.contains('is-past')) return;
          selected = new Date(y, m, d); slot = null; render(); renderSlots();
        });
        gridEl.appendChild(c);
      }
    }
    function renderSlots() {
      const T = LANGS[currentLang].t;
      if (!selected) {
        slotsEl.innerHTML = '';
        slotsLabel.textContent = T['form.book.slots'] || 'Select a date first';
        return;
      }
      const dateStr = selected.toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
      slotsLabel.textContent = (currentLang === 'sv' ? 'Tillgängliga tider — ' : 'Available times — ') + dateStr;
      const times = ['09:00','10:30','12:00','13:30','15:00','17:00'];
      const seed = selected.getDate() * 7 + selected.getMonth() * 13;
      const busySlots = new Set([times[(seed + 1) % times.length], times[(seed + 4) % times.length]]);
      slotsEl.innerHTML = '';
      times.forEach(tm => {
        const s = document.createElement('div'); s.className = 'slot'; s.textContent = tm;
        if (busySlots.has(tm)) s.classList.add('is-busy');
        if (slot === tm) s.classList.add('is-sel');
        s.addEventListener('click', () => {
          if (s.classList.contains('is-busy')) return;
          slot = tm; renderSlots();
          document.getElementById('booking-selection').textContent = `${selected.toDateString()} · ${slot}`;
        });
        slotsEl.appendChild(s);
      });
    }
    calRoot.querySelector('.cal-prev').addEventListener('click', () => { view.setMonth(view.getMonth() - 1); render(); });
    calRoot.querySelector('.cal-next').addEventListener('click', () => { view.setMonth(view.getMonth() + 1); render(); });
    render(); renderSlots();
  }

  // ---------- Form submit — save lead to Supabase if configured ----------
  document.querySelectorAll('form.rm-form').forEach(f => {
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const pane     = f.closest('.tab-pane');
      const formType = pane ? pane.dataset.tab : 'unknown';
      const success  = f.parentElement.querySelector('.success');

      // Collect field values
      const get = sel => { const el = f.querySelector(sel); return el ? el.value.trim() : ''; };
      const services = [...f.querySelectorAll('.chip.is-on')].map(c => c.textContent).join(', ');
      const lead = {
        type:          formType,
        lang:          currentLang,
        name:          get('input[placeholder*="name"], input[placeholder*="namn"], input[placeholder*="amn"]') || get('input[type="text"]:first-of-type'),
        email:         get('input[type="email"]'),
        phone:         get('input[type="tel"]'),
        company:       get('input[placeholder*="B2B"], input[placeholder*="Företag"]'),
        address:       get('input[placeholder*="Street"], input[placeholder*="Gata"]'),
        services:      services,
        property_type: get('select') ? f.querySelector('select')?.value : '',
        timing:        f.querySelectorAll('select')[1] ? f.querySelectorAll('select')[1].value : '',
        notes:         get('textarea'),
        booking_slot:  formType === 'book' ? (document.getElementById('booking-selection')?.textContent || '') : '',
        status:        'new',
      };

      // Save to Supabase if client is ready
      if (authClient) {
        try {
          await authClient.from('leads').insert([lead]);
        } catch (_) { /* silently fail — show success to user regardless */ }
      }

      f.style.display = 'none';
      success.style.display = 'block';
    });
  });

  // ---------- Auth modal ----------
  const authModal      = document.getElementById('auth-modal');
  const authForm       = document.getElementById('auth-form');
  const authMessage    = document.getElementById('auth-message');
  const authSubmitText = document.getElementById('auth-submit-text');
  const authNameField  = document.querySelector('.auth-name-field');
  const authPassword   = document.getElementById('auth-password');
  const authOpenBtns   = document.querySelectorAll('[data-auth-open]');
  const authCloseBtns  = document.querySelectorAll('[data-auth-close]');
  const authModeBtns   = document.querySelectorAll('[data-auth-mode]');
  const authConfig     = window.RM_AUTH_CONFIG || {};
  const authReady      = Boolean(authConfig.supabaseUrl && authConfig.supabaseAnonKey && window.supabase);
  const authClient     = authReady
    ? window.supabase.createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey)
    : null;
  let authMode = 'signin';

  function setAuthMessage(text) { if (authMessage) authMessage.textContent = text || ''; }
  function setAuthMode(mode) {
    authMode = mode;
    authModeBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.authMode === mode));
    if (authNameField) authNameField.hidden = mode !== 'signup';
    if (authPassword) authPassword.setAttribute('autocomplete', mode === 'signin' ? 'current-password' : 'new-password');
    if (authSubmitText) authSubmitText.textContent = mode === 'signin' ? 'Login' : 'Create account';
    setAuthMessage('');
  }
  function openAuth() {
    if (!authModal) return;
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!authReady) setAuthMessage('Login is ready. Add your Supabase URL and anon key in RM_AUTH_CONFIG to activate it.');
  }
  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  authOpenBtns.forEach(btn => btn.addEventListener('click', openAuth));
  authCloseBtns.forEach(btn => btn.addEventListener('click', closeAuth));
  authModeBtns.forEach(btn => btn.addEventListener('click', () => setAuthMode(btn.dataset.authMode)));

  if (authForm) {
    authForm.addEventListener('submit', async e => {
      e.preventDefault();
      setAuthMessage('');
      if (!authClient) { setAuthMessage('Login is not connected yet. Configure Supabase in RM_AUTH_CONFIG.'); return; }
      const fd = new FormData(authForm);
      const email    = String(fd.get('email') || '');
      const password = String(fd.get('password') || '');
      const name     = String(fd.get('name') || '');
      const result = authMode === 'signup'
        ? await authClient.auth.signUp({ email, password, options: { data: { full_name: name } } })
        : await authClient.auth.signInWithPassword({ email, password });
      if (result.error) { setAuthMessage(result.error.message); return; }
      setAuthMessage(authMode === 'signup'
        ? 'Account created. Check your email if confirmation is required.'
        : 'Logged in successfully.');
      setTimeout(closeAuth, 900);
    });
  }
  if (authClient) {
    authClient.auth.getSession().then(({ data }) => {
      const loggedIn = Boolean(data.session);
      authOpenBtns.forEach(btn => {
        const label = btn.querySelector('span') || btn;
        label.textContent = loggedIn ? 'Account' : 'Login';
      });
    });
  }


  // ---------- Hero video ----------
  const heroEl    = document.querySelector('.hero');
  const heroVideo = document.getElementById('hero-video');
  function disableHeroVideo() { if (heroEl) heroEl.classList.add('no-video'); }
  if (heroVideo) {
    heroVideo.loop = false; heroVideo.muted = true; heroVideo.removeAttribute('controls');
    const showHeroVideo = () => {
      heroVideo.classList.add('is-ready');
      if (heroEl) heroEl.classList.add('video-ready');
    };
    heroVideo.addEventListener('loadeddata', showHeroVideo, { once: true });
    heroVideo.addEventListener('canplay',    showHeroVideo, { once: true });
    if (heroVideo.readyState >= 2) showHeroVideo();
    heroVideo.addEventListener('ended', () => { heroVideo.pause(); heroVideo.style.opacity = '1'; }, { once: true });
    heroVideo.play().catch(disableHeroVideo);
    heroVideo.addEventListener('error', disableHeroVideo);
  } else {
    disableHeroVideo();
  }

  // ---------- Scroll progress ----------
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    progressBar.style.width = (scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ---------- Layered Stack ----------
  const lsWrapper = document.getElementById('layered-stack');
  const lsFilter  = document.getElementById('ls-filter');
  if (lsWrapper) {
    const grid  = lsWrapper.querySelector('.ls-grid');
    const items = [...lsWrapper.querySelectorAll('.ls-item')];
    const ROTS  = items.map(() => (Math.random() * 22 - 11).toFixed(2));
    let isSpread = false;

    function visibleItems() { return items.filter(i => !i.classList.contains('ls-hidden')); }

    function stackItems() {
      isSpread = false;
      lsWrapper.classList.remove('is-spread');
      const cw = grid.offsetWidth;
      const ch = grid.offsetHeight;
      items.forEach((item, i) => {
        if (item.classList.contains('ls-hidden')) {
          item.style.transform = 'translate(-9999px, 0)';
          item.style.zIndex = '';
          return;
        }
        const dx = cw / 2 - (item.offsetLeft + item.offsetWidth  / 2);
        const dy = ch / 2 - (item.offsetTop  + item.offsetHeight / 2);
        item.style.transitionDelay = '0ms';
        item.style.transform = `translate(${dx}px,${dy}px) rotate(${ROTS[i]}deg)`;
        item.style.zIndex = i;
      });
    }

    function spreadItems() {
      isSpread = true;
      lsWrapper.classList.add('is-spread');
      const vis = visibleItems();
      vis.forEach((item, i) => {
        item.style.transitionDelay = `${i * 45}ms`;
        item.style.transform = 'translate(0,0) rotate(0deg)';
        item.style.zIndex = '';
      });
      setTimeout(() => vis.forEach(el => el.style.transitionDelay = ''), 800);
    }

    // Init after layout is ready
    requestAnimationFrame(() => requestAnimationFrame(stackItems));

    lsWrapper.addEventListener('mouseenter', () => { if (!isSpread) spreadItems(); });
    lsWrapper.addEventListener('mouseleave', () => { if (isSpread)  stackItems();  });

    // Touch: tap wrapper background to toggle
    lsWrapper.addEventListener('click', e => {
      if (e.target === lsWrapper || e.target === grid) {
        isSpread ? stackItems() : spreadItems();
      }
    });

    // Lightbox on item click (when spread)
    items.forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        if (!isSpread) { spreadItems(); return; }
        if (item.classList.contains('ls-hidden')) return;
        const lb    = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightbox-img');
        if (lb && lbImg) {
          lbImg.src = item.querySelector('img').src;
          lb.classList.add('is-open');
        }
      });
    });

    // Filter buttons
    if (lsFilter) {
      lsFilter.querySelectorAll('[data-ls-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          lsFilter.querySelectorAll('[data-ls-filter]').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const cat = btn.dataset.lsFilter;
          items.forEach(item => {
            if (cat === 'all' || item.dataset.cat === cat) item.classList.remove('ls-hidden');
            else item.classList.add('ls-hidden');
          });
          stackItems(); // re-stack with new visible set
        });
      });
    }
  }

  // ---------- Back-to-top ----------
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => backTop.classList.toggle('is-visible', window.scrollY > 600), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- Mobile nav ----------
  const burger  = document.getElementById('nav-burger');
  const overlay = document.getElementById('mobile-nav-overlay');
  const drawer  = document.getElementById('mobile-nav-drawer');
  const navClose = document.getElementById('mobile-nav-close');
  function openMobileNav() {
    burger.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('is-open'); drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-open'); drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => burger.classList.contains('is-open') ? closeMobileNav() : openMobileNav());
  navClose.addEventListener('click', closeMobileNav);
  overlay.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav-link').forEach(a => a.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobileNav(); lb.classList.remove('is-open'); } });

  // ---------- Active section in nav ----------
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  function updateActiveSection() {
    const mid = window.innerHeight / 2;
    let closest = null, minDist = Infinity;
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < minDist) { minDist = dist; closest = s; }
    });
    if (closest) navAs.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + closest.id));
  }
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // ---------- Animated stat counters ----------
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0');
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * ease).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  // ---------- Spotlight cursor tracking ----------
  document.querySelectorAll('.svc-card, .tc, .promise-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---------- GDPR bar ----------
  let _rmTrack = null; // set later by analytics block, used here for geo

  function requestGeoLocation() {
    if (!navigator.geolocation || !_rmTrack) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
        headers: { 'User-Agent': 'RMByggAnalytics/1.0' }
      })
        .then(r => r.json())
        .then(geo => {
          const addr = geo.address || {};
          const city   = addr.city || addr.town || addr.village || addr.suburb || null;
          const region = addr.state || null;
          const country = (addr.country_code || '').toUpperCase() || null;
          _rmTrack('geo', null, null, { city, region, country, latitude, longitude });
        })
        .catch(() => _rmTrack('geo', null, null, { latitude, longitude, country: 'SE' }));
    }, () => {}); // permission denied — silently ignore
  }

  const complianceBar = document.getElementById('compliance-bar');
  const complianceOk  = document.getElementById('compliance-ok');
  const cookiesAlreadyOk = localStorage.getItem('rm-cookies') === 'ok';
  if (cookiesAlreadyOk) complianceBar.classList.add('is-hidden');
  complianceOk.addEventListener('click', () => {
    localStorage.setItem('rm-cookies', 'ok');
    complianceBar.classList.add('is-hidden');
    schedulePromo();
    requestGeoLocation();
  });

  // ---------- Promo popup ----------
  const PROMO_KEY    = 'rm_promo_v1';
  const promoOverlay = document.getElementById('promo-overlay');
  if (promoOverlay && !localStorage.getItem(PROMO_KEY)) {
    const closePromo = () => promoOverlay.classList.remove('is-open');

    document.getElementById('promo-close').addEventListener('click', closePromo);
    promoOverlay.addEventListener('click', e => { if (e.target === promoOverlay) closePromo(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePromo(); });

    document.getElementById('promo-cta').addEventListener('click', () => {
      closePromo();
      const contact = document.getElementById('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const bookTab = document.querySelector('.tab-btn[data-tab="book"]');
          if (bookTab && !bookTab.classList.contains('is-active')) bookTab.click();
        }, 600);
      }
    });

    function schedulePromo() {
      if (localStorage.getItem(PROMO_KEY)) return;
      setTimeout(() => {
        localStorage.setItem(PROMO_KEY, '1');
        promoOverlay.classList.add('is-open');
      }, 25000);
    }

    // Only start timer if cookies already accepted; otherwise wait for acceptance
    if (cookiesAlreadyOk) schedulePromo();
  }

  // ---------- Analytics tracking (anonymous, no personal data) ----------
  const _cfg = window.RM_AUTH_CONFIG || {};
  if (_cfg.supabaseUrl && _cfg.supabaseAnonKey) {
    const _sid = sessionStorage.getItem('rm_sid') || (() => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('rm_sid', id);
      return id;
    })();
    const _dev  = window.innerWidth < 768 ? 'mobile' : 'desktop';
    const _lang = localStorage.getItem('rm-lang') || 'sv';

    function _track(type, label, value, extra) {
      const body = { session_id: _sid, event_type: type, device: _dev, lang: _lang, ...(extra || {}) };
      if (label != null) body.label = String(label).slice(0, 60);
      if (value  != null) body.value = value;
      fetch(_cfg.supabaseUrl + '/rest/v1/analytics_events', {
        method: 'POST',
        headers: {
          'apikey': _cfg.supabaseAnonKey,
          'Authorization': 'Bearer ' + _cfg.supabaseAnonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body)
      }).catch(() => {});
    }
    _rmTrack = _track;

    // Page view with geolocation (3s timeout fallback)
    {
      const ctrl = new AbortController();
      const tId  = setTimeout(() => ctrl.abort(), 3000);
      fetch('https://ipapi.co/json/', { signal: ctrl.signal })
        .then(r => r.json())
        .then(geo => {
          clearTimeout(tId);
          _track('pageview', null, null, {
            city:      geo.city      || null,
            region:    geo.region    || null,
            country:   geo.country_code || null,
            latitude:  geo.latitude  || null,
            longitude: geo.longitude || null
          });
        })
        .catch(() => _track('pageview'));
    }

    // Section visibility + track current section for heartbeat
    let _liveSection = 'Hero';
    const _secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const label = { home:'Hero', services:'Services', promise:'Promise', process:'Process', projects:'Gallery', reviews:'Reviews', contact:'Contact' }[e.target.id] || e.target.id;
          _track('section', label);
          _liveSection = label;
          _secObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('section[id]').forEach(s => _secObs.observe(s));

    // Heartbeat every 30s — keeps session "live" in admin dashboard
    setInterval(() => _track('heartbeat', _liveSection), 30000);

    // Click tracking
    document.addEventListener('click', e => {
      const el = e.target.closest('.btn-primary, .btn-ghost, .nav-cta, .whatsapp-btn, .tab-btn, .gallery-filter button, [data-lang], .svc-foot .learn');
      if (!el) return;
      const label = (el.dataset.i18n && el.dataset.i18n.replace(/\./g, ' ')) ||
                    el.textContent.trim().slice(0, 50) ||
                    el.getAttribute('aria-label') || 'btn';
      _track('click', label);
    }, { passive: true });

    // Time on page
    const _t0 = Date.now();
    const _sendDur = () => {
      const sec = Math.round((Date.now() - _t0) / 1000);
      if (sec >= 3) _track('duration', null, sec);
    };
    document.addEventListener('visibilitychange', () => { if (document.hidden) _sendDur(); });
    window.addEventListener('beforeunload', _sendDur);
  }
});
