/* ============================================================
   RM Bygg & Montage AB — Translations (EN / SV)

   Elementen in de HTML gebruiken data-attributen:
     data-i18n="key"              → el.textContent = t[key]
     data-i18n-html="key"        → el.innerHTML   = t[key]
     data-i18n-placeholder="key" → el.placeholder  = t[key]
   Geneste sleutels via puntnotatie: "nav.0", "svcs.1.t", etc.
   ============================================================ */

const TRANSLATIONS = {
  en: {
    nav:   ['Services', 'About', 'Projects', 'Reviews', 'Book Now'],
    badge: '&#9889; Local &amp; Trusted \u2013 Gothenburg &amp; Surroundings',
    h1:    'Your <em>neighbourhood</em><br/>builder with heart',
    sub:   "From solar panels on the roof to a freshly painted facade \u2013 we do it with care, precision, and a personal commitment you'll feel from day one.",
    btn1:  'Request a Quote',
    btn2:  'See What We Do',
    scroll: 'Scroll down',
    stats: ['Happy Customers', 'Years in Business', '% Satisfaction Rate', 'kW Solar Installed'],

    stag1: 'What We Offer',
    st1:   'Everything under one roof \u2013<br/>literally',
    ss1:   "We help homeowners and businesses with comprehensive solutions for homes and properties \u2013 whether you're an individual or a real estate company.",

    svcs: [
      { t: 'Solar Panel Systems',        p: "We install complete solar systems tailored to your property. From analysis and planning to commissioning and grid connection. ROT deduction applies." },
      { t: 'Energy Storage & Batteries', p: "Maximise the value of your solar energy with smart battery storage. Modern solutions that save money and give you energy independence." },
      { t: 'EV Chargers',                p: "Certified installation of EV charging stations \u2013 at home, at your business, or in apartment complexes. We handle everything from planning to inspection." },
      { t: 'Window Replacement',         p: "New energy-efficient windows reduce heating costs and improve comfort. We supply and install with care, and always leave the site clean." },
      { t: 'Roof Renovation',            p: "We replace and renovate roofs of all types \u2013 tiles, metal or felt. A proper roof protects your home for decades to come." },
      { t: 'Exterior Painting',          p: "We give your home a fresh new look with professional facade painting. Right primer, right paint, right technique \u2013 results that last for years." },
    ],
    svcPage: {
      creds: ['F-tax certificate', 'ROT approved', 'Registered electrical installer', '5-year workmanship guarantee', 'Consumer protection compliant'],
      cardTags: ['B2B & B2C', 'Residential'],
      solar: {
        label: 'Solar & Energy',
        title: 'Solar panels that actually pay off',
        body: "A well-dimensioned solar system covers 60-80% of a typical Swedish household's annual electricity use. We start with a site survey and a production calculation before a single panel is ordered. You get a written quote with no hidden add-ons.",
        list: [
          'Free site survey and production calculation',
          'Supply and installation of panels, inverter and monitoring',
          'Grid connection and application to your network operator',
          'ROT deduction handled by us - you pay the net amount',
          '5-year workmanship guarantee, panel warranty up to 25 years',
        ],
        tags: ['Homeowners', 'Housing Associations', 'Businesses', 'ROT'],
        statNums: ['2 days'],
        stats: ['kW installed across the region', 'typical installation time for a villa'],
        note: 'Combine with battery storage and cut your grid dependency even further.',
        link: 'Ask us how ->',
      },
      ev: {
        label: 'EV Charging',
        title: 'Charge at home - done right',
        body: "We're certified installers for major charger brands and handle the full electrical work in-house. No subcontracting, no surprises. Whether it's a single wall-box or a shared charging solution for a housing association, we size it correctly from the start.",
        list: [
          "Load balancing so you don't exceed your main fuse",
          'Installation report and inspection certificate included',
          'Smart charging compatible (app control, scheduling)',
          'Suitable for houses, garages and parking facilities',
          'Grant guidance available on request',
        ],
        tags: ['Private homes', 'Housing associations', 'Property companies'],
        statNums: ['3 buildings', '1 day'],
        stats: ['charging infrastructure for a housing portfolio in Partille', 'standard home installation'],
        note: 'Pair with solar panels and charge your car on your own electricity.',
        link: 'Get a combined quote ->',
      },
      roof: {
        label: 'Roof & Facade',
        title: 'A roof that holds - for the next generation',
        body: "We renovate and replace all common roof types in Sweden: concrete tiles, clay tiles, standing seam metal and bitumen felt. Before work starts we do a moisture scan and structural check - if the underlying timber is sound, we say so; if it needs attention, you'll know before we start.",
        list: [
          'Full roof replacement or targeted renovation',
          'Tiles, metal sheet and felt systems',
          'Gutters, downpipes and snow guards',
          'Ridge ventilation and moisture barriers',
          'Exterior painting and facade cladding',
          'Complete site cleanup - including scaffolding removal',
        ],
        tags: ['Detached homes', 'Townhouses', 'Apartment buildings'],
        statNums: ['10 years'],
        stats: ['roofs renovated since 2013', 'workmanship guarantee on roof work'],
        note: 'Thinking about solar too? Install panels at the same time and save on scaffolding costs.',
        link: 'Talk to us ->',
      },
      faq: {
        tag: 'Common Questions',
        title: 'Things people ask us',
        items: [
          {
            q: 'Can I get ROT deduction on solar panel installation?',
            a: 'Yes. Solar panel installation qualifies for ROT deduction (rotavdrag) in Sweden. We handle the application as part of the project — you pay only the net amount. The deduction is currently 30% of labour costs, up to 50,000 SEK per person per year. The deduction is applied directly on the invoice; you never need to claim it yourself.',
          },
          {
            q: 'How long does a solar installation take from start to finish?',
            a: 'The on-site installation of a typical villa system takes 1–2 days. Before that, we spend 1–2 weeks on design, equipment ordering and permit applications. After installation, grid connection is handled by your network operator and typically takes 2–4 weeks. We track this on your behalf and notify you when you are live.',
          },
          {
            q: 'What size solar system do I need?',
            a: 'It depends on your annual electricity consumption, roof orientation and available roof area. We calculate this for free during the site visit. As a rough guide, a 10 kW system on a south-facing roof in Gothenburg produces around 9,000–10,500 kWh per year — enough for a typical 150 m² villa. We never oversize just to increase the invoice.',
          },
          {
            q: 'Do solar panels work well in Swedish winters?',
            a: 'Yes, though output is lower than in summer. Solar panels work on light intensity, not heat — they actually perform slightly better in cold, clear conditions. Snow slides off most panels at angles above 15°. A properly sized system accounts for seasonal variation, and with battery storage you can shift summer surplus to cover winter demand.',
          },
          {
            q: 'Can I add battery storage to an existing solar installation?',
            a: 'In most cases, yes. Modern hybrid inverters and retrofit battery systems can be added to existing installations. We inspect the current setup first to check inverter compatibility, available space and grid connection type. If your system is too old to integrate cleanly, we will tell you honestly.',
          },
          {
            q: 'Which EV charger brands do you install?',
            a: 'We install all major brands certified for the Swedish market, including Zaptec, Easee, Wallbox and Garo, among others. We do not favour any single brand — we recommend the model that best fits your technical setup and usage pattern. All installations include a full inspection report and certificate.',
          },
          {
            q: 'My garage is on a separate fuse — is that a problem for EV charging?',
            a: 'Not necessarily. We assess the full electrical situation during the site visit: main fuse capacity, cable distances and existing load. If the garage fuse is undersized we will either upgrade it or install a load-balancing charger that automatically adjusts output to stay within limits. You will know the full solution and cost before any work begins.',
          },
          {
            q: 'Are there grants or subsidies available for EV charging or solar?',
            a: 'Several apply. Solar installations qualify for ROT deduction. EV charging at home may qualify for the Skatteverket installation deduction. Businesses and housing associations can apply for Klimatklivet grants. We stay current on what is available and will flag any grants that apply to your project during the quote process.',
          },
          {
            q: 'How do I know if my roof needs replacing or just repairing?',
            a: 'Signs that point toward full replacement: cracked or missing tiles across more than 15–20% of the surface, visible moisture damage on rafters or insulation, a roof over 30–40 years old with no major renovation. Signs that a repair may be sufficient: isolated leaks around flashings or ridge, a handful of broken tiles on an otherwise sound surface. We do a moisture scan and structural assessment before recommending anything — and we have no incentive to oversell.',
          },
          {
            q: 'Do you work with housing associations (BRF) and property companies?',
            a: 'Yes, and it is a significant part of what we do. We have experience with the tendering process, board decision timelines and the specific requirements around shared electrical infrastructure. We can present to the board, provide decision material and coordinate with the property manager. References from previous BRF projects are available on request.',
          },
          {
            q: 'What guarantee do you offer on your work?',
            a: 'All workmanship carries a minimum 5-year guarantee. Roof renovations are guaranteed for 10 years. Product warranties depend on the manufacturer: solar panels typically carry a 10–25 year product warranty, inverters 10 years, EV chargers 2–5 years depending on brand. Everything is set out clearly in the written quote — no small print.',
          },
          {
            q: 'What area do you cover?',
            a: 'We work primarily across Gothenburg (Göteborg) and the surrounding municipalities: Mölndal, Partille, Härryda, Lerum, Kungsbacka, Kungälv, Ale and Stenungsund. For larger projects we travel further within Västra Götaland. If you are unsure whether we cover your address, just ask — we will tell you straightforwardly.',
          },
          {
            q: 'How quickly will you respond to my enquiry?',
            a: 'We respond to all enquiries within 24 hours on weekdays. You will speak directly with someone from the team — not a booking system or chatbot. In most cases we can arrange a site visit within the same week. Urgent situations (a leaking roof, for example) are prioritised.',
          },
          {
            q: 'Is the quote really free and without obligation?',
            a: 'Always. We come to the site, assess the job and give you a written quote at no cost. If you decide not to go ahead, no invoice follows. We do not use quotes as a sales pressure tool — if our price or approach does not fit, we respect that.',
          },
        ],
      },
      cta: {
        title: 'Ready to move forward?',
        body: 'Free site visit. Written quote. No obligation.',
        call: 'Call Us Now',
      },
    },

    stag2: 'Our Work',
    st2:   "Projects we're proud of",
    ss2:   "Every job is unique \u2013 and every customer deserves the best result. Here's a selection of what we've done.",
    gl: [
      '&#9728;&#65039; Solar Installation \u2013 Villa, Gothenburg',
      '&#128396;&#65039; Exterior Painting \u2013 Apartment, M\u00f6lndal',
      '&#127968; Roof Renovation \u2013 Kungsbacka',
      '&#9889; EV Charging \u2013 Business, Partille',
      '&#129695; Window Replacement \u2013 Villa, Lerum',
      '&#128267; Energy Storage \u2013 H\u00e4rryda',
    ],

    stag3: 'About RM Bygg & Montage',
    st3:   "We're not a big<br/>anonymous company",
    ss3a:  "RM Bygg & Montage AB was founded on a simple belief: every customer deserves personal service, honest communication, and work you're proud to show off.",
    ss3b:  "We're a small team with a big heart. You always have direct contact with us \u2013 not a call centre.",
    feats: [
      { t: 'Personal Relationship', p: 'You speak directly with the person doing the work. No middlemen, no miscommunication.' },
      { t: 'Transparent Pricing',   p: "Free quote, no hidden fees. You know exactly what you're paying for." },
      { t: 'Guaranteed Work',       p: 'We provide a warranty on everything we do. Your peace of mind is our priority.' },
      { t: 'Sustainable Thinking',  p: 'We help you reduce your carbon footprint \u2013 solar, storage, and energy efficiency.' },
    ],
    bs:   'Always Available',
    bsub: 'We respond within 24 hours',

    stag4: 'How We Work',
    st4:   'Simple from start to finish',
    ss4:   'We keep the process straightforward, clear, and stress-free for you.',
    steps: [
      { t: 'Get in Touch',    p: 'Fill in the form or call us. We get back to you quickly with questions and info.' },
      { t: 'Free Site Visit', p: 'We visit the site, assess the job, and give you an honest, transparent quote.' },
      { t: 'We Do the Work',  p: "Professional, tidy, and on time. You're kept updated throughout the entire process." },
      { t: 'Final Check',     p: "We make sure you're 100% satisfied and answer any questions afterwards." },
    ],

    stag5: 'What Our Customers Say',
    st5:   'Happy customers \u2013<br/>the best receipt',
    revs: [
      '\u201cFantastic service from first contact to the last detail. The solar panels were installed in two days and the whole team was incredibly professional. Highly recommended!\u201d',
      '\u201cAs a property company we need suppliers we can trust. RM Bygg & Montage has installed charging stations in three of our buildings \u2013 always structured and clean.\u201d',
      '\u201cThe roof was in bad shape and they handled it quickly and professionally. The price was fair and they cleaned up thoroughly. I called and they answered straight away.\u201d',
    ],
    rt: ['Homeowner, Gothenburg', 'CEO, Fastighetsbolaget AB', 'Homeowner, Kungsbacka'],

    stag6: 'Get Started',
    st6:   'Ready to take<br/>the next step?',
    bp:    'Book a meeting, request a quote or ask a question \u2013 we always respond personally and quickly. No automated replies, no call centre.',
    cl:    ['Call Us Directly', 'Email Us', 'Area We Cover', 'Opening Hours'],
    cv:    'Mon\u2013Fri 07:00\u201317:00',
    fh3:   'Send a Request',
    fp:    "We'll get back to you within 24 hours on weekdays",
    tabs:  ['&#128197; Book Meeting', '&#128203; Quote Request', '&#129534; Invoice Query'],
    fls:   ['First Name', 'Last Name', 'Email', 'Phone', 'Customer Type', 'Service', 'Preferred Date (approx.)', 'Message'],
    fps:   ['John', 'Smith', 'john@example.com', '+46 70 000 00 00', 'Tell us briefly about your project, address and any specific wishes\u2026'],
    fs1:   ['Select...', 'Private Individual', 'Business / Organisation', 'Housing Association'],
    fs2:   ['Select service...', 'Solar Panel System', 'Energy Storage / Battery', 'EV Charger', 'Window Replacement', 'Roof Renovation', 'Exterior Painting', 'Multiple Services / Not Sure'],
    fsub:  'Send Request \u2192',
    fok:   'Thank you for your request!',
    fok2:  "We've received your message and will get back to you within 24 hours on weekdays.",
    fbk:   'Send Another Request',

    fc: {
      s:     'Services',
      c:     'Company',
      ct:    'Contact',
      c1:    ['Solar Panels', 'Energy Storage', 'EV Chargers', 'Windows', 'Roofing', 'Exterior Painting'],
      c2:    ['About Us', 'Our Process', 'Customer Reviews', 'Projects'],
      c3:    ['Book a Meeting', 'Request a Quote'],
      copy:  '\u00a9 2025 RM Bygg & Montage AB. Org.nr: 556XXX-XXXX. All rights reserved.',
      badge: 'F-tax certificate \u00b7 Liability Insurance \u00b7 ROT Approved',
    },

    errMsgs: {
      required:  '{label} is required.',
      minLen:    '{label} must be at least {n} characters.',
      email:     'Please enter a valid email address.',
      phone:     'Please enter a valid phone number.',
      select:    'Please choose a {label}.',
      rateLimit: 'Please wait {n}s before resubmitting.',
      submitErr: 'Something went wrong. Please try again or contact us directly.',
    },
  },

  sv: {
    nav:   ['Tj\u00e4nster', 'Om oss', 'Projekt', 'Recensioner', 'Boka Nu'],
    badge: '&#9889; Lokalt &amp; P\u00e5litligt \u2013 G\u00f6teborg &amp; Omnejd',
    h1:    'Din <em>lokala</em><br/>hantverkare med hj\u00e4rtat r\u00e4tt',
    sub:   'Fr\u00e5n solceller p\u00e5 taket till en nym\u00e5lad fasad \u2013 vi g\u00f6r det med omsorg, precision och personligt engagemang du k\u00e4nner fr\u00e5n dag ett.',
    btn1:  'Beg\u00e4r Offert',
    btn2:  'Vad Vi G\u00f6r',
    scroll: 'Scrolla ned',
    stats: ['N\u00f6jda Kunder', '\u00c5r i Branschen', '% N\u00f6jdhetsgrad', 'kW Sol Installerad'],

    stag1: 'Vad Vi Erbjuder',
    st1:   'Allt under ett tak \u2013<br/>bokstavligen',
    ss1:   'Vi hj\u00e4lper privatpersoner och f\u00f6retag med kompletta l\u00f6sningar f\u00f6r hem och fastighet.',

    svcs: [
      { t: 'Solcellsanl\u00e4ggningar',  p: 'Vi installerar kompletta solcellssystem anpassade f\u00f6r din fastighet. Fr\u00e5n analys och projektering till drifts\u00e4ttning och n\u00e4tanslutning. ROT-avdrag g\u00e4ller.' },
      { t: 'Energilager & Batterier', p: 'Maximera v\u00e4rdet av din solel med smart energilagring. Vi installerar moderna l\u00f6sningar som sparar pengar och ger dig energioberoende.' },
      { t: 'Elbilsladdare',           p: 'Certifierad installation av laddstationer \u2013 hemma, p\u00e5 f\u00f6retaget eller i flerbostadshus. Vi hanterar allt fr\u00e5n planering till besiktning.' },
      { t: 'F\u00f6nsterbyte',         p: 'Nya energieffektiva f\u00f6nster s\u00e4nker uppv\u00e4rmningskostnaderna och \u00f6kar komforten. Vi levererar och monterar med omsorg.' },
      { t: 'Takrenovering',           p: 'Vi l\u00e4gger om och renoverar tak av alla typer \u2013 tegelpannor, pl\u00e5t eller papp. Med r\u00e4tt tak skyddar du ditt hem i decennier.' },
      { t: 'Fasadm\u00e5lning',        p: 'Vi ger ditt hus ett fr\u00e4scht utseende med professionell fasadm\u00e5lning. R\u00e4tt grundning, r\u00e4tt f\u00e4rg, r\u00e4tt teknik.' },
    ],
    svcPage: {
      creds: ['F-skattsedel', 'ROT-godk\u00e4nd', 'Elinstallationsf\u00f6retag', '5 \u00e5rs garanti', 'Konsumentskyddad process'],
      cardTags: ['B2B & B2C', 'Privat'],
      solar: {
        label: 'Sol & Energi',
        title: 'Solceller som faktiskt l\u00f6nar sig',
        body: 'En r\u00e4tt dimensionerad solcellsanl\u00e4ggning kan t\u00e4cka 60\u201380\u00a0% av en normal svensk villas \u00e5rliga elanv\u00e4ndning. Vi b\u00f6rjar alltid med platsbes\u00f6k och produktionsber\u00e4kning innan n\u00e5got best\u00e4lls. Du f\u00e5r en skriftlig offert utan dolda till\u00e4gg.',
        list: [
          'Kostnadsfritt platsbes\u00f6k och produktionskalkyl',
          'Leverans och installation av paneler, v\u00e4xelriktare och uppf\u00f6ljning',
          'N\u00e4tanslutning och ans\u00f6kan till ditt n\u00e4tbolag',
          'ROT-avdrag hanteras av oss \u2014 du betalar nettobeloppet',
          '5 \u00e5rs garanti p\u00e5 arbete, panelgaranti upp till 25 \u00e5r',
        ],
        tags: ['Vill\u00e4gare', 'Bostadsr\u00e4ttsf\u00f6reningar', 'F\u00f6retag', 'ROT'],
        statNums: ['2 dagar'],
        stats: ['kW installerat i regionen', 'typisk installationstid f\u00f6r en villa'],
        note: 'Kombinera med batterilager och minska ditt beroende av eln\u00e4tet ytterligare.',
        link: 'Fr\u00e5ga oss hur \u2192',
      },
      ev: {
        label: 'Laddning',
        title: 'Ladda hemma \u2014 gjort p\u00e5 r\u00e4tt s\u00e4tt',
        body: 'Vi \u00e4r certifierade install\u00f6rer f\u00f6r flera ledande laddboxm\u00e4rken och hanterar hela elinstallationen i egen regi. Inga underentrepren\u00f6rer, inga \u00f6verraskningar. Oavsett om det g\u00e4ller en villaladdare eller en delad l\u00f6sning f\u00f6r en bostadsr\u00e4ttsf\u00f6rening dimensionerar vi allt korrekt fr\u00e5n start.',
        list: [
          'Lastbalansering s\u00e5 att huvud-s\u00e4kringen inte \u00f6verbelastas',
          'Installationsrapport och kontrollintyg ing\u00e5r',
          'St\u00f6d f\u00f6r smart laddning med app och schemal\u00e4ggning',
          'Passar villor, garage och parkeringsanl\u00e4ggningar',
          'Bidragsr\u00e5dgivning vid behov',
        ],
        tags: ['Privat', 'Bostadsr\u00e4ttsf\u00f6reningar', 'Fastighetsbolag'],
        statNums: ['3 fastigheter', '1 dag'],
        stats: ['laddinfrastruktur f\u00f6r en portf\u00f6lj i Partille', 'normal installation i villa'],
        note: 'Kombinera med solceller och ladda bilen med din egen el.',
        link: 'F\u00e5 en kombinerad offert \u2192',
      },
      roof: {
        label: 'Tak & Fasad',
        title: 'Ett tak som h\u00e5ller \u2014 f\u00f6r n\u00e4sta generation',
        body: 'Vi renoverar och byter alla vanliga taktyper i Sverige: betongpannor, tegel, f\u00e4ltad pl\u00e5t och papp. Innan arbetet startar g\u00f6r vi fuktkontroll och konstruktionsbedömning \u2014 \u00e4r underlaget friskt s\u00e4ger vi det, och beh\u00f6vs \u00e5tg\u00e4rder f\u00e5r du veta det innan vi b\u00f6rjar.',
        list: [
          'Komplett takbyte eller riktad renovering',
          'Tegel, pl\u00e5t och papptak',
          'H\u00e4ngr\u00f6r och stupr\u00f6r samt sn\u00f6rasskydd',
          'Nockventilation och fuktbarri\u00e4rer',
          'Fasadm\u00e5lning och fasadbeklädnad',
          'Fullst\u00e4ndig arbetsplatsstädning inklusive st\u00e4llning',
        ],
        tags: ['Villor', 'Radhus', 'Flerbostadshus'],
        statNums: ['10 \u00e5r'],
        stats: ['tak renoverade sedan 2013', 'garanti p\u00e5 takarbeten'],
        note: 'Funderar du p\u00e5 solceller ocks\u00e5? Montera panelerna samtidigt och spara p\u00e5 st\u00e4llningskostnaden.',
        link: 'Prata med oss \u2192',
      },
      faq: {
        tag: 'Vanliga fr\u00e5gor',
        title: 'Det h\u00e4r fr\u00e5gar kunder oss',
        items: [
          {
            q: 'Kan jag f\u00e5 ROT-avdrag f\u00f6r solcellsinstallation?',
            a: 'Ja. Solcellsinstallation omfattas av ROT-avdrag i Sverige. Vi hanterar ans\u00f6kan som en del av projektet \u2014 du betalar bara nettokostnaden. Avdraget \u00e4r f\u00f6r n\u00e4rvarande 30\u00a0% av arbetskostnaden, upp till 50\u00a0000\u00a0kr per person och \u00e5r. Avdraget dras direkt p\u00e5 fakturan \u2014 du beh\u00f6ver inte g\u00f6ra n\u00e5got sj\u00e4lv.',
          },
          {
            q: 'Hur l\u00e5ng tid tar en solcellsinstallation fr\u00e5n start till m\u00e5l?',
            a: 'Sj\u00e4lva installationen p\u00e5 plats tar vanligtvis 1\u20132 dagar f\u00f6r en villa. Dessf\u00f6rinnan l\u00e4gger vi 1\u20132 veckor p\u00e5 projektering, best\u00e4llning och eventuella tillst\u00e5nd. Efter installation hanterar n\u00e4tbolaget n\u00e4tanslutningen, vilket brukar ta 2\u20134 veckor. Vi f\u00f6ljer upp detta \u00e5t dig och meddelar n\u00e4r du \u00e4r ign\u00e5ng.',
          },
          {
            q: 'Hur stor solcellsanl\u00e4ggning beh\u00f6ver jag?',
            a: 'Det beror p\u00e5 din \u00e5rliga elanv\u00e4ndning, takets orientering och tillg\u00e4nglig takyta. Vi ber\u00e4knar detta gratis vid platsbes\u00f6ket. Som tumregel producerar ett 10\u00a0kW-system p\u00e5 s\u00f6dertak i G\u00f6teborg ca 9\u00a0000\u201310\u00a0500\u00a0kWh per \u00e5r \u2014 tillr\u00e4ckligt f\u00f6r en normal villa p\u00e5 150\u00a0m\u00b2. Vi \u00f6verdimensionerar aldrig bara f\u00f6r att h\u00f6ja fakturan.',
          },
          {
            q: 'Fungerar solceller i svenska vintrar?',
            a: 'Ja, \u00e4ven om produktionen \u00e4r l\u00e4gre \u00e4n p\u00e5 sommaren. Solceller drivs av ljusintensitet, inte v\u00e4rme \u2014 de presterar faktiskt lite b\u00e4ttre i kallt, klart v\u00e4der. Sn\u00f6 glider av de flesta paneler vid lutningar \u00f6ver 15\u00b0. En r\u00e4tt dimensionerad anl\u00e4ggning tar h\u00e4nsyn till s\u00e4songsvariationen, och med batterilager kan du spara sommar\u00f6verskott till vinter.',
          },
          {
            q: 'Kan jag l\u00e4gga till batterilager p\u00e5 en befintlig solcellsanl\u00e4ggning?',
            a: 'I de flesta fall ja. Moderna hybridinvertrar och retrofitbatterier kan anslutas till befintliga anl\u00e4ggningar. Vi kontrollerar f\u00f6rst inverterkompatibilitet, tillg\u00e4ngligt utrymme och typ av n\u00e4tanslutning. Om ditt system \u00e4r f\u00f6r gammalt f\u00f6r att integreras p\u00e5 ett bra s\u00e4tt s\u00e4ger vi det \u00e4rligt.',
          },
          {
            q: 'Vilka laddbox-m\u00e4rken installerar ni?',
            a: 'Vi installerar alla ledande m\u00e4rken certifierade f\u00f6r den svenska marknaden, bland annat Zaptec, Easee, Wallbox och Garo. Vi favoriserar inget enskilt m\u00e4rke \u2014 vi rekommenderar den modell som b\u00e4st passar din tekniska situation och anv\u00e4ndningsprofil. Alla installationer inkluderar installationsrapport och kontrollintyg.',
          },
          {
            q: 'Mitt garage har en separat s\u00e4kring \u2014 \u00e4r det ett problem?',
            a: 'Inte n\u00f6dv\u00e4ndigtvis. Vi bed\u00f6mer hela elf\u00f6rs\u00f6rjningssituationen vid platsbes\u00f6ket: huvs\u00e4kringens kapacitet, kabelavst\u00e5nd och befintlig last. Om garages\u00e4kringen \u00e4r underst\u00e4rkt kan vi antingen uppgradera den eller installera en lastbalanserande laddare som automatiskt anpassar effekten. Du vet hela l\u00f6sningen och kostnaden innan n\u00e5got utf\u00f6rs.',
          },
          {
            q: 'Finns det bidrag f\u00f6r laddbox eller solceller?',
            a: 'Flera g\u00e4ller. Solcellsinstallationer ger ROT-avdrag. Privata laddboxinstallationer kan ge skattereduktion via Skatteverket. F\u00f6retag och bostadsr\u00e4ttsf\u00f6reningar kan ans\u00f6ka om Klimatklivet-bidrag. Vi h\u00e5ller oss uppdaterade och informerar dig om vilka bidrag som \u00e4r aktuella f\u00f6r ditt projekt under offertprocessen.',
          },
          {
            q: 'Hur vet jag om taket beh\u00f6ver bytas eller bara lagas?',
            a: 'Tecken p\u00e5 att ett byte kan beh\u00f6vas: sprickta eller saknade pannor p\u00e5 mer \u00e4n 15\u201320\u00a0% av ytan, synlig fuktskada p\u00e5 spar eller isolering, ett tak \u00f6ver 30\u201340 \u00e5r utan st\u00f6rre renovering. Tecken p\u00e5 att en lagning kan r\u00e4cka: enstaka l\u00e4ckor kring pl\u00e5tdetaljer eller nock, ett f\u00e5tal krossade pannor p\u00e5 ett i \u00f6vrigt friskt tak. Vi g\u00f6r fuktkontroll och konstruktionsbed\u00f6mning innan vi rekommenderar n\u00e5got.',
          },
          {
            q: 'Jobbar ni med bostadsr\u00e4ttsf\u00f6reningar och fastighetsbolag?',
            a: 'Ja, och det \u00e4r en viktig del av v\u00e5r verksamhet. Vi k\u00e4nner till anbudsprocessen, styrelsebeslutens tidslinjer och de specifika kraven kring delad elinfrastruktur. Vi kan presentera f\u00f6r styrelsen, ta fram beslutsunderlag och samordna med fastighetsf\u00f6rvaltaren. Referenser fr\u00e5n tidigare BRF-projekt l\u00e4mnas p\u00e5 beg\u00e4ran.',
          },
          {
            q: 'Vilka garantier l\u00e4mnar ni?',
            a: 'Allt v\u00e5rt arbete omfattas av minst 5 \u00e5rs garanti. Takarbeten har 10 \u00e5rs garanti. Produktgarantier beror p\u00e5 tillverkaren: solpaneler har typiskt 10\u201325 \u00e5rs produktgaranti, v\u00e4xelriktare 10 \u00e5r, laddboxar 2\u20135 \u00e5r beroende p\u00e5 m\u00e4rke. Allt framg\u00e5r tydligt av den skriftliga offerten.',
          },
          {
            q: 'Vilket omr\u00e5de t\u00e4cker ni?',
            a: 'Vi arbetar i f\u00f6rsta hand i G\u00f6teborg och angr\u00e4nsande kommuner: M\u00f6lndal, Partille, H\u00e4rryda, Lerum, Kungsbacka, Kung\u00e4lv, Ale och Stenungsund. F\u00f6r st\u00f6rre projekt reser vi l\u00e4ngre inom V\u00e4stra G\u00f6taland. \u00c4r du os\u00e4ker p\u00e5 om vi t\u00e4cker din adress \u2014 fr\u00e5ga, s\u00e5 svarar vi rakt.',
          },
          {
            q: 'Hur snabbt svarar ni p\u00e5 en f\u00f6rfr\u00e5gan?',
            a: 'Vi svarar p\u00e5 alla f\u00f6rfr\u00e5gningar inom 24 timmar p\u00e5 vardagar. Du pratar direkt med n\u00e5gon i teamet \u2014 inte ett bokningssystem eller en chatt-robot. I de flesta fall kan vi boka ett platsbes\u00f6k inom samma vecka. Bruk\u00e4renden (som ett l\u00e4ckande tak) prioriteras.',
          },
          {
            q: '\u00c4r offerten verkligen gratis och utan f\u00f6rpliktelser?',
            a: 'Alltid. Vi kommer ut, bed\u00f6mer jobbet och l\u00e4mnar en skriftlig offert utan kostnad. Om du v\u00e4ljer att inte g\u00e5 vidare kommer ingen faktura. Vi anv\u00e4nder inte offerter som s\u00e4ljtryck \u2014 passar inte v\u00e5rt pris eller uppf\u00f6rs\u00e4tt, respekterar vi det.',
          },
        ],
      },
      cta: {
        title: 'Redo att g\u00e5 vidare?',
        body: 'Kostnadsfritt platsbes\u00f6k. Skriftlig offert. Ingen f\u00f6rpliktelse.',
        call: 'Ring oss nu',
      },
    },

    stag2: 'V\u00e5rt Arbete',
    st2:   'Projekt vi \u00e4r stolta \u00f6ver',
    ss2:   'Varje uppdrag \u00e4r unikt \u2013 och varje kund f\u00f6rtj\u00e4nar det b\u00e4sta resultatet.',
    gl: [
      '&#9728;&#65039; Solcellsinstallation \u2013 Villa, G\u00f6teborg',
      '&#128396;&#65039; Fasadm\u00e5lning \u2013 L\u00e4genhet, M\u00f6lndal',
      '&#127968; Takrenovering \u2013 Kungsbacka',
      '&#9889; Laddstation \u2013 F\u00f6retag, Partille',
      '&#129695; F\u00f6nsterbyte \u2013 Villa, Lerum',
      '&#128267; Energilager \u2013 H\u00e4rryda',
    ],

    stag3: 'Om RM Bygg & Montage',
    st3:   'Vi \u00e4r inte ett stort<br/>anonymt bolag',
    ss3a:  'RM Bygg & Montage AB grundades med en enkel \u00f6vertygelse: att varje kund f\u00f6rtj\u00e4nar personlig service, \u00e4rlig kommunikation och ett arbete man \u00e4r stolt \u00f6ver.',
    ss3b:  'Vi \u00e4r ett litet lag med stort hj\u00e4rta. Du har alltid direkt kontakt med oss \u2013 inte ett callcenter.',
    feats: [
      { t: 'Personlig Relation',           p: 'Du pratar direkt med den som utf\u00f6r jobbet. Inga mellanh\u00e4nder, inga missf\u00f6rst\u00e5nd.' },
      { t: 'Transparent Priss\u00e4ttning', p: 'Kostnadsfri offert, inga dolda avgifter. Du vet exakt vad du betalar f\u00f6r.' },
      { t: 'Garantiarbeten',               p: 'Vi l\u00e4mnar garanti p\u00e5 allt vi utf\u00f6r. Din trygghet \u00e4r v\u00e5r prioritet.' },
      { t: 'H\u00e5llbart T\u00e4nk',      p: 'Vi hj\u00e4lper dig minska koldioxidavtrycket \u2013 solel, energilager och effektivitet.' },
    ],
    bs:   'Alltid Tillg\u00e4ngliga',
    bsub: 'Vi svarar inom 24 timmar',

    stag4: 'Hur Vi Jobbar',
    st4:   'Enkelt fr\u00e5n start till m\u00e5l',
    ss4:   'Vi h\u00e5ller processen enkel, tydlig och stressfri f\u00f6r dig.',
    steps: [
      { t: 'Kontakta Oss',           p: 'Fyll i formul\u00e4ret eller ring oss. Vi \u00e5terkommer snabbt.' },
      { t: 'Kostnadsfri Besiktning',  p: 'Vi bes\u00f6ker platsen och ger en \u00e4rlig, transparent offert.' },
      { t: 'Vi Utf\u00f6r Jobbet',   p: 'Professionellt, st\u00e4dat och i tid. Du h\u00e5lls uppdaterad.' },
      { t: 'Efterkontroll',          p: 'Vi s\u00e4kerst\u00e4ller att du \u00e4r 100% n\u00f6jd.' },
    ],

    stag5: 'Vad Kunderna S\u00e4ger',
    st5:   'N\u00f6jda kunder \u2013<br/>det b\u00e4sta kvittot',
    revs: [
      '\u201dFantastisk service fr\u00e5n f\u00f6rsta kontakt till sista detalj. Solcellerna installerades p\u00e5 tv\u00e5 dagar och hela teamet var otroligt professionellt.\u201d',
      '\u201dSom fastighetsbolag beh\u00f6ver vi leverant\u00f6rer vi kan lita p\u00e5. RM Bygg & Montage har installerat laddstationer i tre av v\u00e5ra fastigheter \u2013 alltid strukturerat och rent.\u201d',
      '\u201dTaket var i d\u00e5ligt skick och de hanterade det snabbt och professionellt. Priset var rimligt och de st\u00e4dade noggrant. Jag ringde och de svarade direkt.\u201d',
    ],
    rt: ['Vill\u00e4gare, G\u00f6teborg', 'VD, Fastighetsbolaget AB', 'Vill\u00e4gare, Kungsbacka'],

    stag6: 'Kom Ig\u00e5ng',
    st6:   'Redo att ta<br/>n\u00e4sta steg?',
    bp:    'Boka ett m\u00f6te, beg\u00e4r en offert eller st\u00e4ll en fr\u00e5ga \u2013 vi svarar alltid personligt och snabbt.',
    cl:    ['Ring Oss Direkt', 'Maila Oss', 'Omr\u00e5de Vi T\u00e4cker', '\u00d6ppettider'],
    cv:    'M\u00e5n\u2013Fre 07:00\u201317:00',
    fh3:   'Skicka en F\u00f6rfr\u00e5gan',
    fp:    'Vi \u00e5terkommer inom 24 timmar p\u00e5 vardagar',
    tabs:  ['&#128197; Boka M\u00f6te', '&#128203; Offertf\u00f6rfr\u00e5gan', '&#129534; Fakturarender'],
    fls:   ['F\u00f6rnamn', 'Efternamn', 'E-post', 'Telefon', 'Kundtyp', 'Tj\u00e4nst', '\u00d6nskat Datum (ca.)', 'Meddelande'],
    fps:   ['Erik', 'Johansson', 'erik@example.se', '070-000 00 00', 'Ber\u00e4tta kort om ditt projekt, adress och eventuella \u00f6nskem\u00e5l\u2026'],
    fs1:   ['V\u00e4lj...', 'Privatperson', 'F\u00f6retag / Organisation', 'Bostadsr\u00e4ttsf\u00f6rening'],
    fs2:   ['V\u00e4lj tj\u00e4nst...', 'Solcellsanl\u00e4ggning', 'Energilager / Batteri', 'Elbilsladdare', 'F\u00f6nsterbyte', 'Takrenovering', 'Fasadm\u00e5lning', 'Flera Tj\u00e4nster / Vet Ej'],
    fsub:  'Skicka F\u00f6rfr\u00e5gan \u2192',
    fok:   'Tack f\u00f6r din f\u00f6rfr\u00e5gan!',
    fok2:  'Vi har tagit emot ditt meddelande och \u00e5terkommer inom 24 timmar p\u00e5 vardagar.',
    fbk:   'Skicka Ny F\u00f6rfr\u00e5gan',

    fc: {
      s:     'Tj\u00e4nster',
      c:     'F\u00f6retaget',
      ct:    'Kontakt',
      c1:    ['Solceller', 'Energilager', 'Elbilsladdare', 'F\u00f6nster', 'Tak', 'Fasadm\u00e5lning'],
      c2:    ['Om Oss', 'V\u00e5r Process', 'Kundrecensioner', 'Projekt'],
      c3:    ['Boka M\u00f6te', 'Beg\u00e4r Offert'],
      copy:  '\u00a9 2025 RM Bygg & Montage AB. Org.nr: 556XXX-XXXX. Alla r\u00e4ttigheter f\u00f6rbeh\u00e5lls.',
      badge: 'F-skattsedel \u00b7 Ansvarss\u00e4kring \u00b7 ROT-godk\u00e4nd',
    },

    errMsgs: {
      required:  '{label} kr\u00e4vs.',
      minLen:    '{label} m\u00e5ste vara minst {n} tecken.',
      email:     'Ange en giltig e-postadress.',
      phone:     'Ange ett giltigt telefonnummer.',
      select:    'V\u00e4lj {label}.',
      rateLimit: 'V\u00e4nta {n}s innan du skickar igen.',
      submitErr: 'N\u00e5got gick fel. F\u00f6rs\u00f6k igen eller kontakta oss direkt.',
    },
  },
};

/* ============================================================
   Language Service
   ============================================================ */
const LanguageService = {
  /* try-catch: localStorage kan gooien in private mode / sommige browsers */
  current: (() => { try { return localStorage.getItem('rmLang') || 'en'; } catch (_) { return 'en'; } })(),

  init() {
    this.set(this.current);
  },

  set(lang) {
    this.current = lang;
    try { localStorage.setItem('rmLang', lang); } catch (_) { /* private mode */ }
    document.documentElement.lang = lang;  // sync <html lang="…"> met actieve taal
    const btnEN = document.getElementById('langEN');
    const btnSV = document.getElementById('langSV');
    if (btnEN) btnEN.classList.toggle('active', lang === 'en');
    if (btnSV) btnSV.classList.toggle('active', lang === 'sv');
    this._apply(TRANSLATIONS[lang]);
  },

  /* Resolve "nav.0", "svcs.1.t", "fc.c1.2" etc. */
  _resolve(obj, path) {
    return path.split('.').reduce((o, k) => {
      if (o == null) return undefined;
      return isNaN(k) ? o[k] : o[parseInt(k, 10)];
    }, obj);
  },

  _apply(t) {
    /* --- Generic data-i18n attributes --- */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = this._resolve(t, el.dataset.i18n);
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = this._resolve(t, el.dataset.i18nHtml);
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = this._resolve(t, el.dataset.i18nPlaceholder);
      if (val !== undefined) el.placeholder = val;
    });

    /* --- Select options (need full rebuild) --- */
    const s1 = document.getElementById('customer-type');
    if (s1 && t.fs1) {
      s1.innerHTML = t.fs1.map((o, i) => `<option value="${i === 0 ? '' : o}">${o}</option>`).join('');
    }

    const s2 = document.querySelector('.booking-form select:not(#customer-type)');
    if (s2 && t.fs2) {
      s2.innerHTML = t.fs2.map((o, i) => `<option value="${i === 0 ? '' : o}">${o}</option>`).join('');
    }

    /* --- Form tabs (contain emoji + text) --- */
    document.querySelectorAll('.form-tab').forEach((tab, i) => {
      if (t.tabs && t.tabs[i]) tab.innerHTML = t.tabs[i];
    });
  },
};

/* Expose globally for inline onclick handlers in nav */
function setLang(l) { LanguageService.set(l); }
