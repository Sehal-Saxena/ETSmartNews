export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Union Budget 2026: Government Announces Major Tax Reforms',
    content: 'The Finance Minister unveiled sweeping tax reforms in the Union Budget 2026, including revised income tax slabs benefiting the middle class, increased capital expenditure allocation of ₹12.5 lakh crore, and new incentives for the manufacturing sector under the PLI scheme extension.',
    date: '2026-02-01',
    category: 'Economy',
    source: 'Economic Times',
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'IT Sector Sees Mixed Response to Budget Proposals',
    content: 'While the IT sector welcomed increased digital infrastructure spending and AI research funding, concerns were raised about changes to SEZ tax benefits. Major IT companies like TCS and Infosys showed cautious optimism about the new digital economy framework.',
    date: '2026-02-02',
    category: 'Technology',
    source: 'Mint',
    sentiment: 'neutral',
  },
  {
    id: '3',
    title: 'Green Energy Push: ₹2 Lakh Crore Allocated for Renewable Sector',
    content: 'The budget allocated an unprecedented ₹2 lakh crore for renewable energy, including solar manufacturing, green hydrogen, and EV infrastructure. Analysts predict this could create 500,000 new jobs in the clean energy sector.',
    date: '2026-02-03',
    category: 'Energy',
    source: 'Business Standard',
    sentiment: 'positive',
  },
  {
    id: '4',
    title: 'Real Estate Sector Faces New Regulations',
    content: 'New affordable housing norms and changes to capital gains taxation have created uncertainty in the real estate market. While affordable housing got a boost with ₹50,000 crore allocation, luxury real estate faces higher tax burden.',
    date: '2026-02-04',
    category: 'Real Estate',
    source: 'Financial Express',
    sentiment: 'negative',
  },
  {
    id: '5',
    title: 'Startup Ecosystem Gets ₹10,000 Crore Fund',
    content: 'The government announced a dedicated ₹10,000 crore fund for deep-tech startups, along with simplified compliance norms and extended tax holidays. The startup community has largely welcomed these measures.',
    date: '2026-02-05',
    category: 'Startups',
    source: 'YourStory',
    sentiment: 'positive',
  },
  {
    id: '6',
    title: 'Agriculture Sector: MSP Reforms and Digital Agriculture',
    content: 'Major reforms in MSP mechanism and a new digital agriculture platform aim to connect farmers directly to markets. ₹1.5 lakh crore allocated for agricultural infrastructure modernization.',
    date: '2026-02-06',
    category: 'Agriculture',
    source: 'The Hindu',
    sentiment: 'positive',
  },
  {
    id: '7',
    title: 'Banking Sector Braces for New NPA Norms',
    content: 'RBI-aligned NPA classification changes announced in the budget may impact banking profitability in the short term. However, analysts see long-term benefits for financial system stability.',
    date: '2026-02-07',
    category: 'Banking',
    source: 'Moneycontrol',
    sentiment: 'neutral',
  },
  {
    id: '8',
    title: 'Healthcare Gets Record Budget Allocation',
    content: 'Healthcare sector receives ₹3.2 lakh crore, the highest ever allocation, with focus on digital health infrastructure, medical education expansion, and pharmaceutical R&D incentives.',
    date: '2026-02-08',
    category: 'Healthcare',
    source: 'NDTV',
    sentiment: 'positive',
  },
];

export const timelineEvents = [
  { date: '2026-01-15', event: 'Pre-budget economic survey released', sentiment: 65 },
  { date: '2026-01-25', event: 'Industry bodies submit recommendations', sentiment: 70 },
  { date: '2026-02-01', event: 'Union Budget 2026 presented', sentiment: 75 },
  { date: '2026-02-02', event: 'Market reacts positively, Sensex up 2%', sentiment: 80 },
  { date: '2026-02-05', event: 'Sector-specific analysis emerges', sentiment: 72 },
  { date: '2026-02-08', event: 'Implementation roadmap announced', sentiment: 78 },
  { date: '2026-02-15', event: 'State-level budget discussions begin', sentiment: 68 },
  { date: '2026-03-01', event: 'First quarter implementation begins', sentiment: 74 },
];
