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
  lastmod: '2026-11-11',

  // file, English name, Hindi name, footer column
  calculators: [
    ['emi-calculator.html', 'EMI Calculator', 'EMI कैलकुलेटर', 'loans'],
    ['home-loan-eligibility-calculator.html', 'Home Loan Eligibility Calculator', 'होम लोन एलिजिबिलिटी', 'loans'],
    ['car-loan-calculator.html', 'Car Loan Calculator', 'कार लोन EMI', 'loans'],
    ['loan-prepayment-calculator.html', 'Loan Prepayment Calculator', 'लोन प्रीपेमेंट', 'loans'],
    ['loan-comparison-calculator.html', 'Compare Two Loans', 'दो लोन की तुलना', 'loans'],
    ['income-tax-calculator.html', 'Income Tax Calculator', 'इनकम टैक्स कैलकुलेटर', 'tax'],
    ['senior-citizen-tax-calculator.html', 'Senior Citizen Income Tax Calculator', 'सीनियर सिटिज़न टैक्स', 'tax'],
    ['salary-in-hand-calculator.html', 'Salary In-Hand Calculator', 'सैलरी इन-हैंड', 'tax'],
    ['hra-calculator.html', 'HRA Exemption Calculator', 'HRA छूट', 'tax'],
    ['gst-calculator.html', 'GST Calculator', 'GST कैलकुलेटर', 'tax'],
    ['gratuity-calculator.html', 'Gratuity Calculator', 'ग्रेच्युटी', 'tax'],
    ['sip-calculator.html', 'SIP Calculator', 'SIP कैलकुलेटर', 'save'],
    ['step-up-sip-calculator.html', 'Step-up SIP Calculator', 'स्टेप-अप SIP', 'save'],
    ['lumpsum-calculator.html', 'Lumpsum Calculator', 'एकमुश्त निवेश', 'save'],
    ['mutual-fund-returns-calculator.html', 'Mutual Fund Returns Calculator', 'म्यूचुअल फंड रिटर्न', 'save'],
    ['fd-calculator.html', 'FD Calculator', 'FD कैलकुलेटर', 'save'],
    ['rd-calculator.html', 'RD Calculator', 'RD कैलकुलेटर', 'save'],
    ['ppf-calculator.html', 'PPF Calculator', 'PPF कैलकुलेटर', 'save'],
    ['sukanya-samriddhi-calculator.html', 'Sukanya Samriddhi Calculator', 'सुकन्या समृद्धि', 'plan'],
    ['nps-calculator.html', 'NPS Calculator', 'NPS कैलकुलेटर', 'plan'],
    ['epf-calculator.html', 'EPF Calculator', 'EPF कैलकुलेटर', 'plan'],
    ['retirement-planner.html', 'Retirement Planner', 'रिटायरमेंट प्लानर', 'plan'],
    ['cagr-calculator.html', 'CAGR Calculator', 'CAGR कैलकुलेटर', 'plan'],
    ['simple-compound-interest-calculator.html', 'Simple and Compound Interest Calculator', 'सिंपल और कंपाउंड ब्याज', 'plan']
  ],

  // Footer columns: key, English title, Hindi title
  groups: [
    ['loans', 'Loans', 'लोन'],
    ['tax', 'Tax and salary', 'टैक्स और सैलरी'],
    ['save', 'Save and invest', 'बचत और निवेश'],
    ['plan', 'Plan and compare', 'योजना और तुलना']
  ],
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
    'cagr-calculator.html': 'guide-what-is-cagr-and-xirr.html'
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
