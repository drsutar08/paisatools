/*
 * One place that lists everything shared across pages: menu, footer links, calculators.
 * To add a new calculator:
 *   1. create <name>.html (copy a similar calculator),
 *   2. add one line to `calculators` below,
 *   3. run   node tools/sync.js
 * The script then updates the menu, footer, "More calculators" box and sitemap on every page.
 */
module.exports = {
  domain: 'https://paisatools.pages.dev/',

  // "Last updated" date shown on calculator and guide pages, used as dateModified in structured data
  // and as <lastmod> in the sitemap. Change it when you review the pages (format YYYY-MM-DD).
  lastmod: '2026-11-23',
  // Optional per-page dates that override lastmod, e.g. 'ppf-calculator.html': '2026-12-31'
  // (applies to the Hindi twin too).
  updatedFor: {},
  // First publication date of the guides (Article datePublished).
  published: '2026-11-11',

  // Show the "By <author> · Last updated <date>" line under the heading of calculators and guides.
  // Set to true to bring it back; run node tools/sync.js afterwards.
  showByline: false,

  // Author shown on every calculator and guide page and in the "Who runs PaisaTools" box on the About page.
  // Replace the placeholders with your real details. Sync prints a warning while they are still placeholders.
  author: {
    name: 'Diptiranjan Sutar',
    nameHi: 'Diptiranjan Sutar',    // the name as it should appear on Hindi pages (often the same)
    bio: 'Diptiranjan Sutar built PaisaTools and looks after every calculator and guide on the site. Each tool is checked against a hand-worked example and the official rules from the Income Tax Department, India Post, EPFO and PFRDA, and is updated when those rules change. PaisaTools is independent: it sells no financial products and earns no commissions.',
    // Not shown on any page yet (the author box is only on the English About page); kept for a future Hindi About page.
    bioHi: 'PaisaTools को Diptiranjan Sutar ने बनाया है, और साइट के हर कैलकुलेटर और गाइड की देखरेख भी उन्हीं के ज़िम्मे है। हर टूल को हाथ से निकाले गए उदाहरण और आयकर विभाग, इंडिया पोस्ट, EPFO और PFRDA के आधिकारिक नियमों से जांचा जाता है, और नियम बदलने पर अपडेट किया जाता है। PaisaTools स्वतंत्र है: यह कोई वित्तीय उत्पाद नहीं बेचता और कोई कमीशन नहीं कमाता।',
  },

  // file, English name, Hindi name, footer column
  calculators: [
    ['emi-calculator.html', 'EMI Calculator', 'EMI कैलकुलेटर', 'loans'],
    ['home-loan-eligibility-calculator.html', 'Home Loan Eligibility Calculator', 'होम लोन एलिजिबिलिटी', 'loans'],
    ['car-loan-calculator.html', 'Car Loan Calculator', 'कार लोन EMI', 'loans'],
    ['loan-prepayment-calculator.html', 'Loan Prepayment Calculator', 'लोन प्रीपेमेंट', 'loans'],
    ['loan-comparison-calculator.html', 'Compare Two Loans', 'दो लोन की तुलना', 'loans'],
    ['credit-card-interest-calculator.html', 'Credit Card Interest Calculator', 'क्रेडिट कार्ड ब्याज', 'loans'],
    ['income-tax-calculator.html', 'Income Tax Calculator', 'इनकम टैक्स कैलकुलेटर', 'tax'],
    ['senior-citizen-tax-calculator.html', 'Senior Citizen Income Tax Calculator', 'सीनियर सिटिज़न टैक्स', 'tax'],
    ['salary-in-hand-calculator.html', 'Salary In-Hand Calculator', 'सैलरी इन-हैंड', 'tax'],
    ['hra-calculator.html', 'HRA Exemption Calculator', 'HRA छूट', 'tax'],
    ['gst-calculator.html', 'GST Calculator', 'GST कैलकुलेटर', 'tax'],
    ['gratuity-calculator.html', 'Gratuity Calculator', 'ग्रेच्युटी', 'tax'],
    ['sip-calculator.html', 'SIP Calculator', 'SIP कैलकुलेटर', 'save'],
    ['step-up-sip-calculator.html', 'Step-up SIP Calculator', 'स्टेप-अप SIP', 'save'],
    ['goal-sip-calculator.html', 'Goal SIP Calculator', 'लक्ष्य SIP', 'save'],
    ['lumpsum-calculator.html', 'Lumpsum Calculator', 'एकमुश्त निवेश', 'save'],
    ['mutual-fund-returns-calculator.html', 'Mutual Fund Returns Calculator', 'म्यूचुअल फंड रिटर्न', 'save'],
    ['fd-calculator.html', 'FD Calculator', 'FD कैलकुलेटर', 'save'],
    ['rd-calculator.html', 'RD Calculator', 'RD कैलकुलेटर', 'save'],
    ['ppf-calculator.html', 'PPF Calculator', 'PPF कैलकुलेटर', 'save'],
    ['scss-calculator.html', 'SCSS Calculator', 'SCSS कैलकुलेटर', 'save'],
    ['post-office-mis-calculator.html', 'Post Office MIS Calculator', 'पोस्ट ऑफ़िस MIS', 'save'],
    ['nsc-calculator.html', 'NSC Calculator', 'NSC कैलकुलेटर', 'save'],
    ['kvp-calculator.html', 'KVP Calculator', 'KVP कैलकुलेटर', 'save'],
    ['sukanya-samriddhi-calculator.html', 'Sukanya Samriddhi Calculator', 'सुकन्या समृद्धि', 'plan'],
    ['nps-calculator.html', 'NPS Calculator', 'NPS कैलकुलेटर', 'plan'],
    ['epf-calculator.html', 'EPF Calculator', 'EPF कैलकुलेटर', 'plan'],
    ['retirement-planner.html', 'Retirement Planner', 'रिटायरमेंट प्लानर', 'plan'],
    ['swp-calculator.html', 'SWP Calculator', 'SWP कैलकुलेटर', 'plan'],
    ['cagr-calculator.html', 'CAGR Calculator', 'CAGR कैलकुलेटर', 'plan'],
    ['xirr-calculator.html', 'XIRR Calculator', 'XIRR कैलकुलेटर', 'plan'],
    ['inflation-calculator.html', 'Inflation Calculator', 'महंगाई कैलकुलेटर', 'plan'],
    ['simple-compound-interest-calculator.html', 'Simple and Compound Interest Calculator', 'सिंपल और कंपाउंड ब्याज', 'plan']
  ],

  // Categories (footer columns and homepage groups): key, English title, Hindi title, English and Hindi homepage descriptions
  groups: [
    ['loans', 'Loans', 'लोन', 'EMIs, how much you can borrow, prepaying early and comparing loan offers.', 'EMI, कितना लोन मिल सकता है, जल्दी चुकाने का फ़ायदा और लोन ऑफ़र की तुलना।'],
    ['tax', 'Tax and salary', 'टैक्स और सैलरी', 'Income tax under both regimes, take-home salary, HRA, GST and gratuity.', 'दोनों रीजिम में इनकम टैक्स, हाथ में आने वाली सैलरी, HRA, GST और ग्रेच्युटी।'],
    ['save', 'Save and invest', 'बचत और निवेश', 'SIPs, lumpsums and mutual funds, fixed and recurring deposits, and PPF.', 'SIP, एकमुश्त निवेश और म्यूचुअल फंड, FD, RD और PPF।'],
    ['plan', 'Plan and compare', 'योजना और तुलना', 'Long-term goals: Sukanya Samriddhi, NPS, EPF, retirement and growth rates.', 'लंबे लक्ष्य: सुकन्या समृद्धि, NPS, EPF, रिटायरमेंट और ग्रोथ रेट।']
  ],
  // Hindi names for the guide topics and titles, used on the Hindi homepage (the guides themselves are in English).
  guideTagsHi: { Tax: 'टैक्स', Salary: 'सैलरी', Loans: 'लोन', Investing: 'निवेश', Savings: 'बचत', Retirement: 'रिटायरमेंट' },
  guideTitlesHi: {
    'guide-old-vs-new-tax-regime.html': 'पुराना बनाम नया टैक्स रीजिम (FY 2026-27): कौन सा चुनें?',
    'guide-ctc-to-in-hand-salary.html': 'CTC से इन-हैंड सैलरी: हाथ में कम पैसा क्यों आता है',
    'guide-hra-exemption-explained.html': 'HRA छूट: आपके HRA का कितना हिस्सा टैक्स-फ्री है',
    'guide-senior-citizen-tax-saving.html': 'सीनियर सिटिज़न के लिए टैक्स बचत',
    'guide-gst-cgst-sgst-igst-explained.html': 'GST आसान भाषा में: CGST, SGST और IGST',
    'guide-how-gratuity-is-calculated.html': 'ग्रेच्युटी कैसे निकाली जाती है: फ़ॉर्मूला और पात्रता',
    'guide-lower-home-loan-emi.html': 'होम लोन की EMI और कुल ब्याज कैसे घटाएं',
    'guide-home-loan-eligibility-factors.html': 'कितना होम लोन मिलेगा, यह किन बातों से तय होता है',
    'guide-how-to-choose-a-car-loan.html': 'सही कार लोन कैसे चुनें',
    'guide-prepay-loan-or-invest.html': 'लोन पहले चुकाएं या पैसा निवेश करें?',
    'guide-sip-vs-lumpsum.html': 'SIP बनाम एकमुश्त: किस तरह निवेश करें?',
    'guide-what-is-cagr-and-xirr.html': 'CAGR और XIRR क्या हैं? कौन सा इस्तेमाल करें?',
    'guide-fd-vs-ppf-vs-nps.html': 'FD, RD, PPF, SSY या NPS: आपके लिए कौन सा सही है?',
    'guide-epf-and-vpf-explained.html': 'EPF और VPF: ब्याज और निकासी',
    'guide-retirement-planning-basics.html': 'रिटायरमेंट प्लानिंग की बुनियादी बातें: कितना पैसा चाहिए?'
  },
  // How many guides the homepage shows under "Latest money guides" (newest datePublished first).
  homeGuides: 6,
  blurb: ['Free money calculators for India. No sign-up, and your numbers never leave your device.', 'भारत के लिए मुफ़्त कैलकुलेटर। साइन-अप नहीं, और आपके आंकड़े आपके डिवाइस से बाहर नहीं जाते।'],

  // Guides (shown on guides.html in this order): file, tag, colour. Title and summary are read from each guide page.
  guides: [
    ['guide-old-vs-new-tax-regime.html', 'Tax', 'pink'],
    ['guide-ctc-to-in-hand-salary.html', 'Salary', 'peach'],
    ['guide-hra-exemption-explained.html', 'Tax', 'pink'],
    ['guide-senior-citizen-tax-saving.html', 'Tax', 'pink'],
    ['guide-gst-cgst-sgst-igst-explained.html', 'Tax', 'pink'],
    ['guide-how-gratuity-is-calculated.html', 'Salary', 'peach'],
    ['guide-lower-home-loan-emi.html', 'Loans', 'lav'],
    ['guide-home-loan-eligibility-factors.html', 'Loans', 'lav'],
    ['guide-how-to-choose-a-car-loan.html', 'Loans', 'lav'],
    ['guide-prepay-loan-or-invest.html', 'Loans', 'lav'],
    ['guide-sip-vs-lumpsum.html', 'Investing', 'mint'],
    ['guide-what-is-cagr-and-xirr.html', 'Investing', 'mint'],
    ['guide-fd-vs-ppf-vs-nps.html', 'Savings', 'mint'],
    ['guide-epf-and-vpf-explained.html', 'Savings', 'mint'],
    ['guide-retirement-planning-basics.html', 'Retirement', 'tint']
  ],

  // Which guide each calculator links to (shown in its "More calculators" box)
  guideFor: {
    'emi-calculator.html': 'guide-lower-home-loan-emi.html',
    'home-loan-eligibility-calculator.html': 'guide-home-loan-eligibility-factors.html',
    'car-loan-calculator.html': 'guide-how-to-choose-a-car-loan.html',
    'loan-comparison-calculator.html': 'guide-how-to-choose-a-car-loan.html',
    'loan-prepayment-calculator.html': 'guide-prepay-loan-or-invest.html',
    'income-tax-calculator.html': 'guide-old-vs-new-tax-regime.html',
    'senior-citizen-tax-calculator.html': 'guide-senior-citizen-tax-saving.html',
    'salary-in-hand-calculator.html': 'guide-ctc-to-in-hand-salary.html',
    'hra-calculator.html': 'guide-hra-exemption-explained.html',
    'gst-calculator.html': 'guide-gst-cgst-sgst-igst-explained.html',
    'gratuity-calculator.html': 'guide-how-gratuity-is-calculated.html',
    'sip-calculator.html': 'guide-sip-vs-lumpsum.html',
    'step-up-sip-calculator.html': 'guide-sip-vs-lumpsum.html',
    'lumpsum-calculator.html': 'guide-sip-vs-lumpsum.html',
    'mutual-fund-returns-calculator.html': 'guide-sip-vs-lumpsum.html',
    'fd-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'rd-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'ppf-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'sukanya-samriddhi-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'nps-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'epf-calculator.html': 'guide-epf-and-vpf-explained.html',
    'retirement-planner.html': 'guide-retirement-planning-basics.html',
    'cagr-calculator.html': 'guide-what-is-cagr-and-xirr.html',
    'goal-sip-calculator.html': 'guide-sip-vs-lumpsum.html',
    'scss-calculator.html': 'guide-senior-citizen-tax-saving.html',
    'swp-calculator.html': 'guide-retirement-planning-basics.html',
    'post-office-mis-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'inflation-calculator.html': 'guide-retirement-planning-basics.html',
    'xirr-calculator.html': 'guide-what-is-cagr-and-xirr.html',
    'nsc-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'kvp-calculator.html': 'guide-fd-vs-ppf-vs-nps.html',
    'credit-card-interest-calculator.html': 'guide-prepay-loan-or-invest.html',
    'simple-compound-interest-calculator.html': 'guide-what-is-cagr-and-xirr.html'
  },

  // Related calculators shown in each calculator's sidebar (3–5 each, most useful first). Names omit "-calculator.html".
  related: {
    'emi': ['loan-prepayment', 'loan-comparison', 'home-loan-eligibility', 'car-loan', 'credit-card-interest'],
    'home-loan-eligibility': ['emi', 'loan-prepayment', 'loan-comparison', 'salary-in-hand'],
    'car-loan': ['emi', 'loan-comparison', 'loan-prepayment', 'simple-compound-interest'],
    'loan-prepayment': ['emi', 'loan-comparison', 'home-loan-eligibility', 'sip'],
    'loan-comparison': ['emi', 'car-loan', 'loan-prepayment', 'home-loan-eligibility'],
    'income-tax': ['salary-in-hand', 'hra', 'senior-citizen-tax', 'nps'],
    'senior-citizen-tax': ['income-tax', 'scss', 'fd', 'rd', 'retirement-planner'],
    'salary-in-hand': ['income-tax', 'hra', 'epf', 'gratuity'],
    'hra': ['income-tax', 'salary-in-hand', 'gratuity'],
    'gst': ['income-tax', 'salary-in-hand', 'simple-compound-interest'],
    'gratuity': ['salary-in-hand', 'epf', 'retirement-planner', 'income-tax'],
    'sip': ['goal-sip', 'step-up-sip', 'lumpsum', 'mutual-fund-returns', 'cagr'],
    'step-up-sip': ['sip', 'goal-sip', 'lumpsum', 'retirement-planner', 'mutual-fund-returns'],
    'lumpsum': ['sip', 'swp', 'mutual-fund-returns', 'cagr', 'fd'],
    'mutual-fund-returns': ['sip', 'lumpsum', 'xirr', 'cagr', 'step-up-sip'],
    'fd': ['rd', 'ppf', 'scss', 'simple-compound-interest', 'senior-citizen-tax'],
    'rd': ['fd', 'ppf', 'sip', 'simple-compound-interest'],
    'ppf': ['sukanya-samriddhi', 'nsc', 'nps', 'epf', 'fd'],
    'sukanya-samriddhi': ['ppf', 'fd', 'sip', 'rd'],
    'nps': ['retirement-planner', 'epf', 'ppf', 'income-tax'],
    'epf': ['ppf', 'nps', 'retirement-planner', 'salary-in-hand'],
    'retirement-planner': ['swp', 'nps', 'epf', 'sip', 'step-up-sip'],
    'cagr': ['xirr', 'mutual-fund-returns', 'lumpsum', 'sip', 'simple-compound-interest'],
    'simple-compound-interest': ['fd', 'rd', 'cagr', 'lumpsum'],
    'goal-sip': ['sip', 'step-up-sip', 'inflation', 'lumpsum', 'retirement-planner'],
    'swp': ['retirement-planner', 'lumpsum', 'scss', 'mutual-fund-returns'],
    'scss': ['senior-citizen-tax', 'post-office-mis', 'fd', 'swp', 'ppf'],
    'post-office-mis': ['scss', 'nsc', 'fd', 'rd', 'swp'],
    'inflation': ['retirement-planner', 'goal-sip', 'cagr', 'simple-compound-interest'],
    'xirr': ['cagr', 'mutual-fund-returns', 'sip', 'lumpsum'],
    'nsc': ['ppf', 'kvp', 'fd', 'post-office-mis'],
    'kvp': ['nsc', 'fd', 'ppf', 'inflation'],
    'credit-card-interest': ['emi', 'loan-prepayment', 'loan-comparison', 'simple-compound-interest']
  },

  // Calculators linked from each guide's "Try the calculator" section (the ones the guide talks about).
  guideCalcs: {
    'guide-old-vs-new-tax-regime.html': ['income-tax', 'hra', 'salary-in-hand'],
    'guide-ctc-to-in-hand-salary.html': ['salary-in-hand', 'income-tax', 'hra', 'gratuity'],
    'guide-hra-exemption-explained.html': ['hra', 'income-tax'],
    'guide-senior-citizen-tax-saving.html': ['senior-citizen-tax', 'scss', 'income-tax', 'fd', 'rd'],
    'guide-gst-cgst-sgst-igst-explained.html': ['gst'],
    'guide-how-gratuity-is-calculated.html': ['gratuity', 'salary-in-hand'],
    'guide-lower-home-loan-emi.html': ['emi', 'loan-prepayment', 'loan-comparison', 'home-loan-eligibility'],
    'guide-home-loan-eligibility-factors.html': ['home-loan-eligibility', 'emi'],
    'guide-how-to-choose-a-car-loan.html': ['car-loan', 'emi', 'loan-comparison', 'loan-prepayment'],
    'guide-prepay-loan-or-invest.html': ['loan-prepayment', 'emi', 'sip', 'lumpsum', 'step-up-sip'],
    'guide-sip-vs-lumpsum.html': ['sip', 'lumpsum', 'step-up-sip', 'goal-sip', 'mutual-fund-returns'],
    'guide-what-is-cagr-and-xirr.html': ['cagr', 'xirr', 'mutual-fund-returns', 'sip', 'lumpsum'],
    'guide-fd-vs-ppf-vs-nps.html': ['fd', 'rd', 'ppf', 'sukanya-samriddhi', 'nps', 'retirement-planner'],
    'guide-epf-and-vpf-explained.html': ['epf', 'retirement-planner'],
    'guide-retirement-planning-basics.html': ['retirement-planner', 'swp', 'inflation', 'sip', 'nps', 'epf', 'ppf']
  },

  // Official sources: key, English label, Hindi label, url, English note, Hindi note
  officialSources: {
    itd: ['Income Tax Department', 'आयकर विभाग', 'https://www.incometax.gov.in/iec/foportal/', 'tax slabs, deductions, rebates and TDS rules', 'टैक्स स्लैब, छूट, रिबेट और TDS नियम'],
    rbi: ['Reserve Bank of India (RBI)', 'भारतीय रिज़र्व बैंक (RBI)', 'https://www.rbi.org.in/', 'policy rates and rules for bank deposits', 'पॉलिसी दरें और बैंक जमा के नियम'],
    post: ['India Post', 'इंडिया पोस्ट', 'https://www.indiapost.gov.in/', 'current interest rates on PPF, SSY, post office FD and RD', 'PPF, SSY, डाकघर FD और RD की मौजूदा ब्याज दरें'],
    epfo: ['Employees\' Provident Fund Organisation (EPFO)', 'कर्मचारी भविष्य निधि संगठन (EPFO)', 'https://www.epfo.gov.in/', 'EPF interest rate, contributions and withdrawals', 'EPF ब्याज दर, योगदान और निकासी'],
    pfrda: ['Pension Fund Regulatory and Development Authority (PFRDA)', 'पेंशन फंड नियामक और विकास प्राधिकरण (PFRDA)', 'https://www.pfrda.org.in/', 'NPS rules, withdrawals and annuity', 'NPS नियम, निकासी और एन्युटी'],
    gst: ['CBIC GST portal', 'CBIC GST पोर्टल', 'https://cbic-gst.gov.in/', 'GST rates and notifications', 'GST दरें और अधिसूचनाएं'],
    labour: ['Ministry of Labour and Employment', 'श्रम और रोज़गार मंत्रालय', 'https://www.labour.gov.in/', 'Payment of Gratuity Act and Labour Codes', 'ग्रेच्युटी भुगतान अधिनियम और लेबर कोड']
  },
  // Which official sources each page lists in its "Sources" section (Hindi twins get the same list).
  sourcesFor: {
    'income-tax-calculator.html': ['itd'],
    'senior-citizen-tax-calculator.html': ['itd', 'post'],
    'salary-in-hand-calculator.html': ['itd', 'epfo'],
    'hra-calculator.html': ['itd'],
    'gratuity-calculator.html': ['labour', 'itd'],
    'gst-calculator.html': ['gst'],
    'fd-calculator.html': ['rbi', 'post', 'itd'],
    'rd-calculator.html': ['rbi', 'post'],
    'ppf-calculator.html': ['post', 'itd'],
    'sukanya-samriddhi-calculator.html': ['post', 'itd'],
    'epf-calculator.html': ['epfo', 'itd'],
    'nps-calculator.html': ['pfrda', 'itd'],
    'retirement-planner.html': ['pfrda', 'epfo'],
    'scss-calculator.html': ['post', 'itd'],
    'swp-calculator.html': ['itd'],
    'post-office-mis-calculator.html': ['post', 'itd'],
    'inflation-calculator.html': ['rbi'],
    'nsc-calculator.html': ['post', 'itd'],
    'kvp-calculator.html': ['post', 'itd'],
    'credit-card-interest-calculator.html': ['rbi'],
    'guide-old-vs-new-tax-regime.html': ['itd'],
    'guide-ctc-to-in-hand-salary.html': ['itd', 'epfo'],
    'guide-hra-exemption-explained.html': ['itd'],
    'guide-senior-citizen-tax-saving.html': ['itd', 'post'],
    'guide-gst-cgst-sgst-igst-explained.html': ['gst'],
    'guide-how-gratuity-is-calculated.html': ['labour', 'itd'],
    'guide-fd-vs-ppf-vs-nps.html': ['post', 'rbi', 'pfrda', 'itd'],
    'guide-epf-and-vpf-explained.html': ['epfo', 'itd'],
    'guide-retirement-planning-basics.html': ['pfrda', 'epfo', 'post']
  },

  // Top menu: file, English label, Hindi label
  nav: [
    ['index.html', 'Home', 'होम'],
    ['emi-calculator.html', 'EMI', 'EMI', 'loans'],
    ['income-tax-calculator.html', 'Income Tax', 'इनकम टैक्स', 'tax'],
    ['gst-calculator.html', 'GST', 'GST', 'tax'],
    ['sip-calculator.html', 'SIP', 'SIP', 'save'],
    ['fd-calculator.html', 'FD', 'FD', 'save'],
    ['ppf-calculator.html', 'PPF', 'PPF', 'save'],
    ['guides.html', 'Guides', 'गाइड']
  ],

  // Small links at the top of the footer: file, English label, Hindi label, hasHindiVersion
  footerSite: [
    ['guides.html', 'Guides', 'गाइड'],
    ['about.html', 'About', 'हमारे बारे में'],
    ['contact.html', 'Contact', 'संपर्क'],
    ['privacy-policy.html', 'Privacy policy', 'गोपनीयता नीति'],
    ['disclaimer.html', 'Disclaimer', 'अस्वीकरण']
  ],

  // Support button in the footer: url, English label, Hindi label
  support: ['https://buymeacoffee.com/drsutar08', 'Buy me a coffee', 'मुझे एक कॉफ़ी पिलाएं'],

  // Pages that have a Hindi twin in hi/
  hindiHome: 'hi/index.html',

  legalPages: ['about.html', 'contact.html', 'privacy-policy.html', 'disclaimer.html']
};
