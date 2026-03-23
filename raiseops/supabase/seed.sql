-- ============================================================
-- SEED DATA: Investors
-- ============================================================
-- 12 realistic investor records covering various types, stages, and focus areas

insert into public.investors (
  name, firm, email, linkedin_url, focus_areas, funding_stages,
  investment_range_min, investment_range_max, location, portfolio_count,
  match_score, bio, investor_type, is_verified
) values

-- 1. VC - Sequoia Capital
(
  'Sarah Kim',
  'Sequoia Capital',
  'sarah.kim@sequoia.com',
  'https://linkedin.com/in/sarahkim-sequoia',
  ARRAY['SaaS', 'FinTech', 'AI/ML', 'Enterprise Software'],
  ARRAY['seed', 'series-a', 'series-b'],
  500000, 5000000,
  'Menlo Park, CA',
  47,
  94,
  'Partner at Sequoia Capital focused on enterprise SaaS, fintech, and AI-powered applications. Former founder with two successful exits. Invested in over 47 companies across her career, with 8 unicorns.',
  'vc',
  true
),

-- 2. VC - Andreessen Horowitz
(
  'Marcus Thompson',
  'Andreessen Horowitz',
  'mthompson@a16z.com',
  'https://linkedin.com/in/marcusthompson-a16z',
  ARRAY['HealthTech', 'AI/ML', 'DeepTech', 'BioTech'],
  ARRAY['series-a', 'series-b', 'series-c'],
  2000000, 20000000,
  'San Francisco, CA',
  62,
  88,
  'General Partner at a16z Bio focused on digital health and life sciences. PhD in Computational Biology from Stanford. Passionate about startups using AI to transform patient outcomes.',
  'vc',
  true
),

-- 3. Angel - Independent
(
  'Jennifer Walsh',
  null,
  'jen@jenwalsh.vc',
  'https://linkedin.com/in/jenniferwalsh-angel',
  ARRAY['EdTech', 'Consumer', 'SaaS', 'Future of Work'],
  ARRAY['pre-seed', 'seed'],
  50000, 500000,
  'New York, NY',
  28,
  82,
  'Angel investor and former EdTech founder (sold to Pearson for $48M in 2021). Investing in early-stage consumer and education technology startups. Particular interest in workforce upskilling and K-12 innovation.',
  'angel',
  true
),

-- 4. VC - Lightspeed
(
  'David Nakamura',
  'Lightspeed Venture Partners',
  'dnakamura@lsvp.com',
  'https://linkedin.com/in/davidnakamura-lsvp',
  ARRAY['B2B', 'SaaS', 'FinTech', 'PropTech'],
  ARRAY['seed', 'series-a'],
  1000000, 8000000,
  'Palo Alto, CA',
  34,
  79,
  'Partner at Lightspeed Venture Partners focused on enterprise software and B2B marketplaces. Former McKinsey Principal turned investor. Writes extensively about product-led growth and enterprise sales motions.',
  'vc',
  true
),

-- 5. VC - Bessemer
(
  'Aisha Okonkwo',
  'Bessemer Venture Partners',
  'aokonkwo@bvp.com',
  'https://linkedin.com/in/aishaokonkwo-bvp',
  ARRAY['FinTech', 'HealthTech', 'DeepTech', 'Climate Tech'],
  ARRAY['series-a', 'series-b'],
  3000000, 15000000,
  'New York, NY',
  41,
  91,
  'Partner at Bessemer Venture Partners with a focus on transformative fintech and health technology companies. Actively looks for founders building infrastructure for underserved markets.',
  'vc',
  true
),

-- 6. Accelerator - Techstars
(
  'Roberto Fernandez',
  'Techstars',
  'rfernandez@techstars.com',
  'https://linkedin.com/in/robertofernandez-techstars',
  ARRAY['SaaS', 'B2B', 'Consumer', 'MarTech'],
  ARRAY['pre-seed', 'seed'],
  100000, 200000,
  'Austin, TX',
  120,
  73,
  'Managing Director at Techstars Austin. Former 3x founder and operator. Supporting early-stage founders with capital, mentorship, and the Techstars global network. Run the Spring and Fall cohorts in Austin.',
  'accelerator',
  true
),

-- 7. Corporate VC - Google Ventures
(
  'Christina Park',
  'GV (Google Ventures)',
  'cpark@gv.com',
  'https://linkedin.com/in/christinapark-gv',
  ARRAY['AI/ML', 'HealthTech', 'SaaS', 'Developer Tools'],
  ARRAY['series-a', 'series-b'],
  5000000, 30000000,
  'Mountain View, CA',
  55,
  85,
  'Investment Partner at GV focused on applied AI and digital health. Former product lead at Google DeepMind. Looking for companies where AI is the core differentiator, not just a feature.',
  'corporate',
  true
),

-- 8. Family Office
(
  'Michael Brennan',
  'Brennan Capital Group',
  'michael@brennancapital.com',
  'https://linkedin.com/in/michaelbrennan-capital',
  ARRAY['FinTech', 'Real Estate Tech', 'B2B', 'InsurTech'],
  ARRAY['seed', 'series-a'],
  250000, 2000000,
  'Chicago, IL',
  19,
  68,
  'Principal at Brennan Capital Group, a multi-family office with a dedicated technology allocation. Background in investment banking at Goldman Sachs. Focuses on fintech, real estate technology, and insurance technology.',
  'family-office',
  false
),

-- 9. VC - First Round Capital
(
  'Priya Mehta',
  'First Round Capital',
  'pmehta@firstround.com',
  'https://linkedin.com/in/priyamehta-frc',
  ARRAY['Consumer', 'Marketplace', 'SaaS', 'Developer Tools', 'Web3'],
  ARRAY['pre-seed', 'seed'],
  250000, 1500000,
  'San Francisco, CA',
  38,
  87,
  'Partner at First Round Capital. Previously a founder and engineer. Particularly excited about consumer internet, marketplace businesses, developer tools, and the next generation of social platforms.',
  'vc',
  true
),

-- 10. Angel - DeepTech focus
(
  'Tom Bradley',
  null,
  'tom@tombradley.com',
  'https://linkedin.com/in/tombradley-angel',
  ARRAY['DeepTech', 'Climate Tech', 'AI/ML', 'SpaceTech'],
  ARRAY['pre-seed', 'seed'],
  25000, 200000,
  'Boston, MA',
  22,
  62,
  'Angel investor and MIT Professor of Computer Science. Investing in deep tech, climate technology, and hard science startups. Co-founded two companies (one acquired by NASA, one IPO''d). Technical advisor to 40+ startups.',
  'angel',
  false
),

-- 11. VC - Accel Partners
(
  'Elena Vasquez',
  'Accel Partners',
  'evasquez@accel.com',
  'https://linkedin.com/in/elenavasquez-accel',
  ARRAY['SaaS', 'EdTech', 'FinTech', 'HR Tech', 'Cybersecurity'],
  ARRAY['series-a', 'series-b', 'series-c'],
  5000000, 50000000,
  'Palo Alto, CA',
  78,
  76,
  'Partner at Accel Partners. Former founder with 15+ years in enterprise software and education technology. Led investments in companies totaling over $8B in enterprise value. Passionate about category-defining B2B companies.',
  'vc',
  true
),

-- 12. Angel - YC Alumni
(
  'James Okafor',
  'YC Alumni Angels',
  'james@ycalumnni.vc',
  'https://linkedin.com/in/jamesokafor-angel',
  ARRAY['SaaS', 'B2B', 'AI/ML', 'DevOps', 'Data Infrastructure'],
  ARRAY['pre-seed', 'seed'],
  10000, 100000,
  'San Francisco, CA',
  31,
  90,
  'YC alum (W19) and angel investor. My startup (DevFlow) was acquired by Atlassian in 2023. Now actively investing in early-stage B2B SaaS and AI tools for developers and data teams. Syndicate lead with $12M deployed.',
  'angel',
  true
);
