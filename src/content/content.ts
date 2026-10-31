import type { SiteContent } from './types';

/*
 * All the copy on the site lives in this file. Edit it without touching any component.
 *
 * Working tagline: "Every small business deserves to be found online."
 * TODO: pick a tagline. Three alternatives, ready to swap into hero.headline and motto.text:
 *   1. "A good shop shouldn't be a secret."
 *   2. "From the shopfront to the search result."
 *   3. "If you make something good, people should be able to find you."
 */

export const content: SiteContent = {
  meta: {
    name: 'Addin.in',
    role: 'Founder & Software Engineer, Addin.in',
    duration: 'Apr 2010 – Dec 2013',
    durationLength: '3 yrs 9 mos',
    location: 'Kerala, India',
    summary:
      'Founded an early-stage digital platform company to bring small-scale industries online. Evolved into startup mentoring, seed funding advisory, and tech community leadership.',
  },

  nav: {
    wordmark: 'Addin.in',
    links: [
      { id: 'origin', label: 'Origin' },
      { id: 'motto', label: 'Motto' },
      { id: 'shop', label: 'Take a shop online' },
      { id: 'work', label: 'What we did' },
      { id: 'mvp', label: 'Build an MVP' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'lessons', label: 'Lessons' },
      { id: 'next', label: 'Next chapter' },
    ],
    menuLabel: 'Menu',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    eraClock: { gingerbread: '2010', holo: '2013', modern: '2026' },
  },

  preloader: {
    lines: [
      '> initializing addin.in ... 2010',
      '> looking for small businesses ... offline',
      '> bringing them online ...',
    ],
    skipHint: 'Press any key or click to skip',
    statusLabel: 'Loading the story',
  },

  hero: {
    headline: 'Every small business deserves to be found online.',
    subline:
      'Addin.in · Kerala · 2010–2013 · A college-born, self-funded mission to digitize small industries.',
    cta: 'Read the story ↓',
    scrollHint: 'Scroll',
  },

  // TODO: these four frames are drafted from your brief. Check that each one matches what happened.
  origin: {
    number: '01',
    title: 'It started at a hostel desk',
    frames: [
      {
        id: 'desk',
        title: 'A college hostel desk',
        body: 'April 2010, Kerala. I was still a student when I started Addin.in, and I funded it myself. The idea was simple: small industries around me made good things, and the internet had no idea they existed.',
        alt: 'Line drawing of a hostel desk with a laptop, a stack of books and a glass of tea, under a window with a coconut palm outside.',
      },
      {
        id: 'client',
        title: 'The first client',
        body: 'A small local industry with a real product, known mainly to the people who already knew it. Getting it online started with understanding the business: what it sold, who bought it, and what people needed to know.',
        alt: 'Line drawing of a small shopfront with a tiled roof, a signboard, sacks of goods and a counter.',
      },
      {
        id: 'live',
        title: 'The first website goes live',
        body: 'I built it, deployed it and looked after it: full-stack ownership from day one. Now that business could be found by someone who had never walked past it.',
        alt: 'Line drawing of a browser window showing a small shop website with a live indicator and signal waves.',
      },
      {
        id: 'android',
        title: 'The first Android app',
        body: 'Chunky status bars, glossy buttons, a trackball on the phone. Early Android was a strange place to build, and a good one. The mission stayed the same, and now it fit in a pocket.',
        alt: 'Line drawing of an early Android phone with hardware buttons, a trackball and a grid of app icons.',
      },
    ],
  },

  motto: {
    number: '02',
    text: 'Every small business deserves to be found online.',
    pillarsTitle: 'What the motto turned into',
    pillars: [
      {
        id: 'digitize',
        title: 'Digitize',
        body: 'Bring businesses online with web and Android apps they could actually use.',
      },
      {
        id: 'empower',
        title: 'Empower',
        body: 'Mentor founders, and help them work out what to build first and why.',
      },
      {
        id: 'inspire',
        title: 'Inspire',
        body: 'Grow the tech community through talks, workshops and hackathons.',
      },
    ],
  },

  shop: {
    number: '03',
    title: 'Take a shop online',
    lead: 'This is what the work looked like. Pick a business, drag the slider, and see the same shop on both sides of the line.',
    demoNotice: 'This is a demo. The shops are made up, and nothing gets published anywhere.',
    chooseLabel: 'Choose a business',
    nameLabel: 'Or use your own business name',
    namePlaceholder: 'Your business name',
    nameHelp: 'Stays in your browser. It is only drawn into the mock-ups.',
    sliderLabel: 'Slide between the offline and online versions of the shop',
    offlineLabel: 'Offline',
    onlineLabel: 'Online',
    offlineAlt:
      'The shop offline: a painted signboard, a phone number on a wall and a paper ledger.',
    onlineAlt: 'The shop online: a small website and an Android app carrying the shop name.',
    deployLabel: 'Deploy my shop',
    deployingLabel: 'Deploying...',
    deployAgainLabel: 'Deploy another shop',
    liveMessage: 'Your shop is live!',
    liveDetail: 'Only in this demo, though. In 2010 this part took me a lot longer.',
    deploySteps: [
      'Claiming the web address',
      'Painting the signboard in pixels',
      'Packing the Android app',
      'Going live',
    ],
    mockNav: ['Home', 'Products', 'Find us'],
    mockCall: 'Call now',
    mockFind: 'Get directions',
    appInstalled: 'Installed',
    domainSuffix: '.example',
    fallbackSlug: 'your-shop',
    businesses: [
      {
        id: 'spice-trader',
        label: 'Spice trader',
        sampleName: 'Kayal Spice Traders',
        tagline: 'Pepper, cardamom and clove, sold by weight.',
        phone: 'Ph. 0000 12345',
        ledger: ['Pepper, 2 kg', 'Cardamom, 500 g', 'Clove, 250 g'],
        appAction: 'Order spices',
        colors: { primary: '#6f2a12', accent: '#e8a33d', tint: '#fbf1e4' },
      },
      {
        id: 'coir-maker',
        label: 'Coir maker',
        sampleName: 'Kayal Coir Works',
        tagline: 'Mats and rope, made from coconut husk.',
        phone: 'Ph. 0000 23456',
        ledger: ['Door mats, 12', 'Rope, 40 m', 'Runner, 2'],
        appAction: 'Browse mats',
        colors: { primary: '#5c4018', accent: '#c8862b', tint: '#f7efe0' },
      },
      {
        id: 'handloom-weaver',
        label: 'Handloom weaver',
        sampleName: 'Thari Handlooms',
        tagline: 'Hand-woven cotton, with the border of your choice.',
        phone: 'Ph. 0000 34567',
        ledger: ['Mundu, 6', 'Set saree, 3', 'Towels, 10'],
        appAction: 'See the weaves',
        colors: { primary: '#7a1f3d', accent: '#e0b23f', tint: '#fbf3ea' },
      },
      {
        id: 'bakery',
        label: 'Bakery',
        sampleName: 'Puthiya Bakery',
        tagline: 'Fresh bread and plum cake, baked every morning.',
        phone: 'Ph. 0000 45678',
        ledger: ['Bread, 30', 'Plum cake, 8', 'Rusk, 5 packs'],
        appAction: 'Reserve a cake',
        colors: { primary: '#8a3b12', accent: '#f2b84b', tint: '#fff4e3' },
      },
      {
        id: 'auto-workshop',
        label: 'Auto workshop',
        sampleName: 'Puthiya Auto Works',
        tagline: 'Servicing and repairs, by the people who know your car.',
        phone: 'Ph. 0000 56789',
        ledger: ['Oil change, 3', 'Brake pads, 2', 'Wheel balance, 4'],
        appAction: 'Book a service',
        colors: { primary: '#123a5c', accent: '#f0a02b', tint: '#eef3f7' },
      },
    ],
  },

  work: {
    number: '04',
    title: 'What we did',
    blocks: [
      {
        id: 'web-mobile',
        icon: 'devices',
        title: 'Web and mobile for SMEs',
        body: 'Built web and mobile solutions that digitized the presence of small-scale industries, with full-stack product ownership from day one.',
      },
      {
        id: 'seed-funding',
        icon: 'seedling',
        title: 'MVP definition and seed-funding advisory',
        body: 'Helped multiple startups secure seed funding by defining MVPs and demonstrating measurable value to investors.',
      },
      {
        id: 'keynotes',
        icon: 'podium',
        title: 'Keynotes and workshops',
        body: 'Delivered keynote sessions and workshops at community events, inspiring professionals to pursue technology careers.',
      },
      {
        id: 'community',
        icon: 'community',
        title: 'Mentoring, accelerators and hackathons',
        body: 'Contributed actively to the startup ecosystem through mentoring programs, accelerators and hackathons.',
      },
    ],
    statsTitle: 'In numbers',
    stats: {
      // Your stated 3 yrs 9 mos (Apr 2010 to Dec 2013), written in months.
      monthsBuilding: 45,
      // TODO: fill in. Each of these stays hidden until it has a real number.
      businessesDigitized: undefined,
      // TODO: fill in
      appsShipped: undefined,
      // TODO: fill in
      talksGiven: undefined,
      // TODO: fill in
      startupsMentored: undefined,
    },
    statLabels: {
      monthsBuilding: 'months, April 2010 to December 2013',
      businessesDigitized: 'businesses brought online',
      appsShipped: 'apps shipped',
      talksGiven: 'talks and workshops given',
      startupsMentored: 'startups mentored',
    },
  },

  mvp: {
    number: '05',
    title: 'Build your MVP',
    lead: 'Much of my advisory work came down to one exercise: decide what not to build. You have 5 points. Spend them on the features that would convince an investor.',
    poolTitle: 'Features',
    zoneTitle: 'Your MVP',
    zoneEmpty: 'Drag features here, or press Add on any of them.',
    dragHint: 'Drag',
    addLabel: 'Add',
    removeLabel: 'Remove',
    submitLabel: 'Show it to investors',
    tryAgainLabel: 'Try again',
    overBudget: 'Not enough points left. Remove something first.',
    budgetLabel: 'points spent',
    gaugeLabel: 'Investor readiness',
    resultTitle: 'Your result',
    pickedLabel: 'You built',
    lesson: 'Investors fund focus, not features.',
    budget: 5,
    features: [
      {
        id: 'core-feature',
        label: 'The one core feature',
        note: 'The thing only you do',
        cost: 2,
        kind: 'core',
      },
      {
        id: 'landing-page',
        label: 'Landing page',
        note: 'Explains the promise',
        cost: 1,
        kind: 'proof',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        note: 'Shows what people actually do',
        cost: 1,
        kind: 'proof',
      },
      {
        id: 'payments',
        label: 'Payments',
        note: 'Proves someone will pay',
        cost: 2,
        kind: 'proof',
      },
      { id: 'login', label: 'Login', note: 'Needed if accounts matter', cost: 1, kind: 'support' },
      { id: 'chat', label: 'Chat', note: 'Users talk to each other', cost: 2, kind: 'extra' },
      {
        id: 'admin-panel',
        label: 'Admin panel',
        note: 'Manage everything nicely',
        cost: 2,
        kind: 'extra',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        note: 'Bring people back',
        cost: 1,
        kind: 'extra',
      },
      {
        id: 'native-app',
        label: 'Native mobile app',
        note: 'A second codebase, early',
        cost: 3,
        kind: 'extra',
      },
      {
        id: 'referrals',
        label: 'Referral program',
        note: 'Growth before value',
        cost: 1,
        kind: 'extra',
      },
    ],
    outcomes: {
      empty: {
        title: 'Nothing to show yet',
        message: 'An empty pitch is at least cheap. Add the one feature your idea depends on.',
      },
      fundable: {
        title: 'That is a fundable MVP',
        message:
          'A core feature, some evidence that people want it, and nothing extra. You could say in one sentence what this is trying to prove.',
      },
      promising: {
        title: 'Promising, and still a little busy',
        message:
          'The core is there, but some of your budget went on things that do not answer the main question. Cut one and look again.',
      },
      'no-core': {
        title: 'Everything except the product',
        message:
          'You built the parts around a product without the part only you can do. Start with the one core feature.',
      },
      'feature-soup': {
        title: 'Lots of features, no question',
        message:
          'This looks impressive and tells an investor very little. Nothing here shows that anyone wants the core idea.',
      },
    },
  },

  timeline: {
    number: '06',
    title: 'April 2010 to December 2013',
    milestones: [
      {
        id: 'founded',
        title: 'Founded Addin.in',
        date: 'Apr 2010',
        detail:
          'Started during my college days in Kerala, self-funded, to bring small-scale industries online.',
        verified: true,
      },
      {
        id: 'first-clients',
        title: 'First SME clients',
        // TODO: add the date, and confirm the wording.
        date: undefined,
        detail:
          'Web projects for small-scale industries, with full-stack product ownership from day one.',
        verified: false,
      },
      {
        id: 'mobile-apps',
        title: 'Mobile apps',
        // TODO: add the date, and confirm the wording.
        date: undefined,
        detail: 'Android applications joined the websites, for the same kind of small businesses.',
        verified: false,
      },
      {
        id: 'mentoring',
        title: 'Mentoring and seed-funding advisory',
        // TODO: add the date, and confirm the wording.
        date: undefined,
        detail:
          'Helped multiple startups secure seed funding by defining MVPs and demonstrating measurable value to investors.',
        verified: false,
      },
      {
        id: 'keynotes',
        title: 'Keynotes and community',
        // TODO: add the date, and confirm the wording.
        date: undefined,
        detail:
          'Keynote sessions and workshops at community events, along with mentoring programs, accelerators and hackathons.',
        verified: false,
      },
      {
        id: 'next-chapter',
        title: 'Next chapter',
        date: 'Dec 2013',
        detail: 'I moved into employment on purpose, to learn what running at scale really takes.',
        verified: true,
      },
    ],
  },

  // TODO: all six lessons are drafts written in your voice. Rewrite them, then set draft: false.
  lessons: {
    number: '07',
    title: 'What it taught me',
    hint: 'Drag a card away for the next lesson. Tap or press Enter to flip it. Arrow keys work too.',
    previousLabel: 'Previous lesson',
    nextLabel: 'Next lesson',
    flipLabel: 'Flip card',
    cardHint: 'Press Enter to flip the card. Use the left and right arrow keys to change lesson.',
    lessons: [
      {
        id: 'ship',
        front: "Ship before you're ready",
        back: 'Time spent polishing in private taught me very little. Putting something rough in front of a real customer taught me something every time.',
        draft: true,
      },
      {
        id: 'trust',
        front: 'Small businesses buy trust, not technology',
        back: 'Nobody asked me which framework I used. They wanted to know if I would still pick up the phone next year.',
        draft: true,
      },
      {
        id: 'question',
        front: 'An MVP is a question, not a product',
        back: 'Write down what you are trying to find out. Any feature that does not help answer it can wait.',
        draft: true,
      },
      {
        id: 'community',
        front: 'Community compounds',
        back: 'A talk or a hackathon rarely pays off that day. The people you meet there keep coming back into your work for years.',
        draft: true,
      },
      {
        id: 'discipline',
        front: 'Self-funding teaches discipline',
        back: 'With nobody else’s money, every rupee needs a job. I still ask what something will return before I build it.',
        draft: true,
      },
      {
        id: 'scale',
        front: 'To scale a business, first scale yourself',
        back: 'I could build products and help others start. I had not seen how large systems run. So I went to learn.',
        draft: true,
      },
    ],
  },

  next: {
    number: '08',
    title: 'Then I went to learn scale',
    paragraphs: [
      'By the end of 2013 I knew how to start things. I could find a customer, build the first version, and help a founder explain why it mattered.',
      'I did not yet know how large systems stay up, or how large organizations make decisions. To scale a business I needed real experience of both, so I chose employment and went to get it.',
      'The mission did not end there. Small businesses still deserve to be found, and everything I learn still connects back to that first network.',
    ],
    closing: 'Addin was my first classroom. The lessons are still compounding.',
  },

  footer: {
    title: 'Say hello',
    // TODO: replace these placeholder links. The GitHub one comes from this repo's remote.
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
      { label: 'GitHub', href: 'https://github.com/muhdashiq' },
      { label: 'Email', href: 'mailto:hello@example.com' },
    ],
    backToTop: 'Back to top',
    credit: 'Made with ♥ in Kerala, originally in 2010, remastered in 2026.',
  },

  easterEgg: {
    onMessage: 'Welcome back to 2010. Type 2010 again to leave.',
    offMessage: 'Back to the present.',
    exitLabel: 'Exit 2010',
  },
};
