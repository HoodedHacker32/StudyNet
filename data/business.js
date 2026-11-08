/* StudyNet — Business Studies data (2nd Year). Loaded by business.html and the dashboard.
   A secret subject: it only appears once the student's name contains the cheat code (see SN.secretUnlocked).
   Notes follow the class notes for the November assessment, written in StudyNet's own words. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  function cards(pairs) { return pairs.map(function (p) { return { front: p[0], back: p[1] }; }); }
  function pairs(list) { return list.map(function (p) { return { left: p[0], right: p[1] }; }); }

  var y2 = {
    blurb: 'Business Studies — November assessment revision',
    exam: '<b>November assessment:</b> Ch 12 Protecting the Consumer, Ch 13 Ethical &amp; Sustainable Consumption, Ch 15 Entrepreneurs &amp; Enterprising People and Ch 16 Types of Enterprise. Ch 17 Impact of Organisations was in the class test, so it’s here too. Learn the definitions word for word, and back up each point with an example.',
    store: 'sn_business_y2',
    score: 'business_y2',
    /* Exam bank: Junior Cycle style questions with marking schemes, written for StudyNet. */
    examq: [
      // ---- Ch 12 Protecting the Consumer
      { id: 'bu-con-1', topic: 'consumer', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'Under the Sale of Goods and Supply of Services Act 1980, goods must meet four conditions. Name and explain <b>two</b> of them.',
        scheme: ['First condition named, e.g. merchantable quality / fit for purpose / as described / as per sample (2 marks)', 'First condition explained, e.g. merchantable quality: of a good enough standard to sell (2 marks)',
          'Second condition named (2 marks)', 'Second condition explained, e.g. fit for purpose: does the job it is meant to do (2 marks)'],
        model: 'Merchantable quality: the goods must be of a reasonable standard, good enough to be sold. Fit for the purpose intended: they must do the job they were sold for, e.g. a waterproof jacket must keep out the rain.' },
      { id: 'bu-con-2', topic: 'consumer', src: 'Exam style', type: 'group', q: 'Consumer rights.', parts: [
        { type: 'short', q: 'What does the Latin phrase <i>caveat emptor</i> mean?', ans: ['let the buyer beware', 'buyer beware'], marks: 2 },
        { type: 'mcq', q: 'Which form of redress means you get your money back?', ans: 'Refund', opts: ['Repair', 'Replacement', 'Credit note'], marks: 2 },
        { type: 'written', q: 'Explain the difference between a guarantee and an extended warranty.', marks: 6, lines: 4,
          scheme: ['Guarantee: a free promise from the manufacturer to repair or replace a faulty item within a set time (3 marks)', 'Warranty: you pay extra for it; the retailer covers repairs after the guarantee runs out; you don’t have to buy it (3 marks)'],
          model: 'A guarantee is a free promise from the manufacturer to repair or replace the item if it develops a fault within a set time. An extended warranty is like insurance: you pay extra and it covers repairs after the guarantee has run out. You don’t have to buy one.' }] },
      { id: 'bu-con-3', topic: 'consumer', src: 'Exam style', type: 'written', marks: 8, lines: 6,
        q: 'You bought headphones that stopped working after a week. List <b>four</b> steps you should follow to make a complaint.',
        scheme: ['Stop using the item (2 marks)', 'Return it to the shop with the receipt and ask for the manager (2 marks)', 'Explain the problem clearly and say which redress you want: refund, repair or replacement (2 marks)',
          'If it isn’t sorted: complain in writing / contact the CCPC / use the Small Claims Procedure (2 marks)'],
        model: 'Stop using the headphones. Bring them back to the shop with the receipt and ask to speak to the manager. Explain the fault and when it started, and say whether I want a refund, repair or replacement. If the shop won’t help, put the complaint in writing and get advice from the CCPC, then use the Small Claims Procedure if needed.' },
      { id: 'bu-con-4', topic: 'consumer', src: 'Exam style', type: 'group', q: 'Consumer law and help.', parts: [
        { type: 'short', q: 'Which Act protects consumers who buy online, by phone or by mail order?', ans: ['Consumer Rights Act 2022', 'the Consumer Rights Act 2022', 'Consumer Rights Act'], marks: 2 },
        { type: 'short', q: 'What is the most you can claim using the Small Claims Procedure?', ans: ['€2,000', '2000', '€2000', '2,000', '2000 euro'], marks: 2 },
        { type: 'written', q: 'Name the three unfair commercial practices banned by the Consumer Protection Act 2007 and explain one.', marks: 6, lines: 4,
          scheme: ['Misleading (1 mark)', 'Aggressive (1 mark)', 'Prohibited (1 mark)', 'One explained, e.g. aggressive: harassment or pressure used to force someone to buy (3 marks)'],
          model: 'Misleading, aggressive and prohibited practices. An aggressive practice is when a business uses harassment, force or pressure to make a consumer buy something.' }] },
      // ---- Ch 13 Ethical & Sustainable Consumption
      { id: 'bu-eth-1', topic: 'ethical', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain the terms <b>sustainable development</b> and <b>sustainable consumption</b>.',
        scheme: ['Sustainable development: meeting today’s needs (2 marks)', '…without stopping future generations from meeting theirs (1 mark)', 'Sustainable consumption: choosing goods and services produced or supplied in an environmentally sustainable way (3 marks)'],
        model: 'Sustainable development is meeting the world’s needs today without preventing people in the future from meeting their needs. Sustainable consumption is choosing goods and services that were produced or supplied in an environmentally sustainable way.' },
      { id: 'bu-eth-2', topic: 'ethical', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: '“Paying the minimum wage is legal, but it may not be ethical.” Explain this statement and give an example.',
        scheme: ['Minimum wage: the lowest pay an employer can legally pay (2 marks)', 'It may not cover a worker’s living costs, e.g. rent and food (2 marks)', 'A living wage is the pay needed for a basic acceptable standard of living (2 marks)', 'Suitable example (2 marks)'],
        model: 'The minimum wage is the lowest hourly pay an employer can legally pay, but it may not be enough to live on. A full-time worker on the minimum wage might not cover rent, groceries and bills, so they fall short each week. It’s legal, but not fair, so it may be unethical. The living wage is what a worker needs for a basic decent standard of living.' },
      { id: 'bu-eth-3', topic: 'ethical', src: 'Exam style', type: 'group', q: 'Ethical consumption.', parts: [
        { type: 'mcq', q: 'Which mark shows that farmers and workers were paid a fair minimum price?', ans: 'Fairtrade', opts: ['Origin Green', 'Love Irish Food', 'Guaranteed Irish'], marks: 2 },
        { type: 'short', q: 'Which state agency runs the Origin Green sustainability programme?', ans: ['Bord Bia', 'bordbia'], marks: 2 },
        { type: 'written', q: 'Outline three ways a consumer can make ethical decisions when buying goods.', marks: 6, lines: 4,
          scheme: ['Any three, e.g. avoid very cheap goods that may be made in sweatshops / buy Fairtrade / avoid factory-farmed products / choose environmentally friendly options / buy Irish and local (2 marks each)'],
          model: 'Avoid very cheap clothes that may have been made in sweatshops by children. Buy Fairtrade products so producers get a fair price. Choose eco-friendly options, like an electric car or products with recyclable packaging.' }] },
      { id: 'bu-eth-4', topic: 'ethical', src: 'Exam style', type: 'written', marks: 8, lines: 6,
        q: 'Outline one ethical or social responsibility a business has to each of these: <b>employees</b>, <b>customers</b>, <b>suppliers</b> and <b>the local community</b>.',
        scheme: ['Employees: fair pay and safe, healthy working conditions (2 marks)', 'Customers: safe, good-quality goods at a fair price (2 marks)', 'Suppliers: pay them on time and at a fair price (2 marks)', 'Local community: a clean environment, no noise or pollution, enough parking (2 marks)'],
        model: 'Employees: pay them fairly and give them safe working conditions. Customers: sell safe, good-quality products at a fair price. Suppliers: pay them on time and a fair price. Local community: keep the area clean and free from noise and pollution, and provide parking so traffic isn’t disrupted.' },
      // ---- Ch 15 Entrepreneurs & Enterprising People
      { id: 'bu-ent-1', topic: 'entrepreneur', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'What is the difference between a <b>skill</b> and a <b>characteristic</b>? Give one example of each that an entrepreneur needs.',
        scheme: ['Characteristic: a personality trait you are born with (2 marks)', 'Skill: an ability developed through practice, learning or training (2 marks)', 'Example characteristic, e.g. innovative, decisive, self-confident (2 marks)', 'Example skill, e.g. time management, planning, financial management (2 marks)'],
        model: 'A characteristic is a personality trait you are born with, such as being innovative. A skill is an ability you develop through practice, experience or training, such as time management.' },
      { id: 'bu-ent-2', topic: 'entrepreneur', src: 'Exam style', type: 'group', q: 'Entrepreneurs.', parts: [
        { type: 'short', q: 'What do we call an enterprising employee inside a business?', ans: ['an intrapreneur', 'intrapreneur'], marks: 2 },
        { type: 'mcq', q: 'Which of these is an <b>internal</b> source of new product ideas?', ans: 'Research and development (R&D) department', opts: ['Competitors', 'Customer complaints', 'Import substitution'], marks: 2 },
        { type: 'written', q: 'Outline two rewards and two risks of being an entrepreneur.', marks: 8, lines: 5,
          scheme: ['Reward, e.g. be your own boss / keep the profits (2 marks)', 'Second reward, e.g. flexible hours / sense of satisfaction (2 marks)', 'Risk, e.g. lose the money invested (2 marks)', 'Second risk, e.g. long hours / income not guaranteed / damaged credit rating (2 marks)'],
          model: 'Rewards: you are your own boss and make the decisions, and you keep all the profits. Risks: you could lose the money you invested if the business fails, and you may have to work very long hours with no guaranteed income.' }] },
      { id: 'bu-ent-3', topic: 'entrepreneur', src: 'Exam style', type: 'written', marks: 7, lines: 5,
        q: 'List the stages of the new product development process in order.',
        scheme: ['Idea generation (1 mark)', 'Product screening (1 mark)', 'Concept development (1 mark)', 'Feasibility study (1 mark)', 'Prototype development (1 mark)', 'Test marketing (1 mark)', 'Product launch (1 mark)'],
        model: '1. Idea generation 2. Product screening 3. Concept development 4. Feasibility study 5. Prototype development 6. Test marketing 7. Product launch.' },
      { id: 'bu-ent-4', topic: 'entrepreneur', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'Explain two ways entrepreneurs benefit the economy and two ways they benefit society.',
        scheme: ['Economy, e.g. create jobs and wealth / generate tax revenue / boost exports / provide goods and services (2 marks each, max 4)', 'Society, e.g. provide services and amenities / improve infrastructure / raise the standard of living / sponsor community groups / promote an enterprise culture (2 marks each, max 4)'],
        model: 'Economy: they create jobs, and the business and its staff pay taxes that fund public services. Society: they provide services and amenities in the area, and they often sponsor local clubs and community groups.' },
      // ---- Ch 16 Types of Enterprise
      { id: 'bu-typ-1', topic: 'enterprise', src: 'Exam style', type: 'written', marks: 9, lines: 6,
        q: 'Explain the main aim of a <b>financial</b>, a <b>social</b> and a <b>cultural</b> enterprise, and give an example of each.',
        scheme: ['Financial: set up to make a profit (2 marks) + example, e.g. a supermarket (1 mark)', 'Social: puts people and community ahead of private gain (2 marks) + example, e.g. a credit union (1 mark)', 'Cultural: gives people access to the arts and cultural events (2 marks) + example, e.g. a music festival (1 mark)'],
        model: 'A financial enterprise is set up to make a profit, e.g. a supermarket chain. A social enterprise puts people and the community ahead of personal gain, e.g. a credit union. A cultural enterprise gives people access to the arts and culture, e.g. a music festival.' },
      { id: 'bu-typ-2', topic: 'enterprise', src: 'Exam style', type: 'group', q: 'Supports for enterprise.', parts: [
        { type: 'mcq', q: 'Which organisation is responsible for promoting Irish acts worldwide?', ans: 'Culture Ireland', opts: ['Enterprise Ireland', 'Local Enterprise Office', 'Social Entrepreneurs Ireland'], marks: 2 },
        { type: 'short', q: 'Name the organisation that gives financial and practical support to social entrepreneurs.', ans: ['Social Entrepreneurs Ireland', 'SEI'], marks: 2 },
        { type: 'written', q: 'Name two supports a Local Enterprise Office (LEO) gives to new businesses.', marks: 4, lines: 3,
          scheme: ['Any two: financial advice / mentoring / training (2 marks each)'],
          model: 'Financial advice, and a mentoring service where an experienced business person guides the owner.' }] },
      { id: 'bu-typ-3', topic: 'enterprise', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Your friend wants to start a community sports club. Is this a financial, social or cultural enterprise? Explain your answer and give one benefit to the community.',
        scheme: ['Social enterprise (accept cultural if justified by sport/culture) (2 marks)', 'Reason: its aim is to serve the community, not to make a profit for owners (2 marks)', 'Benefit, e.g. healthier lifestyles / brings people together / creates some jobs (2 marks)'],
        model: 'It is a social enterprise because its main aim is to help people in the community rather than to make a profit. It would bring people together and help young people stay active and healthy.' },
      { id: 'bu-typ-4', topic: 'enterprise', src: 'Exam style', type: 'group', q: 'Organisations.', parts: [
        { type: 'mcq', q: 'An organisation with operations all over the world is…', ans: 'Global', opts: ['Local', 'National', 'Social'], marks: 2 },
        { type: 'written', q: 'Outline two roles a financial enterprise plays in society.', marks: 4, lines: 3,
          scheme: ['Any two: provides goods and services / provides employment / pays tax / provides finance to others / boosts economic growth (2 marks each)'],
          model: 'It provides goods and services people need, and it employs people and pays tax to the government.' }] },
      // ---- Ch 17 Impact of Organisations
      { id: 'bu-imp-1', topic: 'impact', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'A large factory opens in your town. Outline two <b>positive</b> and two <b>negative</b> economic impacts on the community.',
        scheme: ['Positive, e.g. employment (incl. spin-off jobs) / tax revenue / higher standard of living / economic growth / multiplier effect (2 marks each, max 4)', 'Negative, e.g. pressure on resources such as land / housing shortage / crowding out small businesses / over-reliance on one employer (2 marks each, max 4)'],
        model: 'Positive: it creates jobs in the factory and spin-off jobs in transport and banking, and wages spent locally help other businesses (the multiplier effect). Negative: demand for housing rises, causing a shortage, and the town may rely too much on one employer if it closes.' },
      { id: 'bu-imp-2', topic: 'impact', src: 'Exam style', type: 'group', q: 'Impact of organisations.', parts: [
        { type: 'short', q: 'What is the name for money paid to workers and suppliers being spent again and again in the local area?', ans: ['the multiplier effect', 'multiplier effect'], marks: 2 },
        { type: 'mcq', q: 'Which of these is a negative <b>social</b> impact?', ans: 'Increased traffic', opts: ['Tax revenue', 'More local services', 'Pollution controls'], marks: 2 },
        { type: 'written', q: 'Explain one positive and one negative environmental impact an organisation can have.', marks: 4, lines: 3,
          scheme: ['Positive, e.g. clean technology / renewable energy / using vacant land for community facilities (2 marks)', 'Negative, e.g. pollution / unsustainable use of resources / habitat destruction (2 marks)'],
          model: 'Positive: many firms use renewable energy and clean technology to keep pollution low. Negative: clearing land for a large site can destroy natural habitats.' }] },
      { id: 'bu-imp-3', topic: 'impact', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain what a <b>community</b> is and describe one positive social impact a new organisation can have on it.',
        scheme: ['Community: a group of people who live in the same place or share attitudes and interests (2 marks)', 'Positive social impact named, e.g. more local services / sustains the community / more choice and lower prices / better quality of life (2 marks)', 'Explained (2 marks)'],
        model: 'A community is a group of people who live in the same area or share interests. A new organisation can bring more local services, such as childcare and transport, which makes the area a better place to live.' }
    ],
    topics: [
      { id: 'consumer', label: 'Protecting the Consumer', icon: 'shield', desc: 'Ch 12: consumer rights and laws, redress, complaints and who helps',
        notes: ['consumer'], fc: ['consumer'], quiz: ['consumer'], match: ['consumerHelp'], prac: ['consumer'] },
      { id: 'ethical', label: 'Ethical & Sustainable Consumption', icon: 'leaf', desc: 'Ch 13: sustainable development, ethics, Fairtrade and business responsibilities',
        notes: ['ethical'], fc: ['ethical'], quiz: ['ethical'], match: ['ethical'], prac: ['ethical'] },
      { id: 'entrepreneur', label: 'Entrepreneurs', icon: 'bulb', desc: 'Ch 15: enterprise, characteristics and skills, rewards and risks, new ideas',
        notes: ['entrepreneur'], fc: ['entrepreneur'], quiz: ['entrepreneur'], match: ['traits'], prac: ['entrepreneur', 'npd'] },
      { id: 'enterprise', label: 'Types of Enterprise', icon: 'store', desc: 'Ch 16: financial, social and cultural enterprises and their supports',
        notes: ['enterprise'], fc: ['enterprise'], quiz: ['enterprise'], match: ['enterprise'], prac: ['enterprise'] },
      { id: 'impact', label: 'Impact of Organisations', icon: 'users', desc: 'Ch 17: economic, social and environmental impacts on a community',
        notes: ['impact'], fc: ['impact'], quiz: ['impact'], match: ['impact'], prac: ['impact'] }
    ],

    notes: {
      consumer: { label: 'Protecting the Consumer', sections: [
        { h: 'Consumers', kv: [['Consumer', 'A person who buys goods or services for their own use.'], ['Good', 'Something you can touch or see, e.g. a phone or a kettle.'],
          ['Service', 'Something done for you, e.g. a haircut or a car wash.'], ['Own-label product', 'A product carrying the shop’s own brand. Usually cheaper than well-known brands.']] },
        { h: 'Being a wise consumer', list: ['Do I really need it, and can I afford it?', 'Is it an <b>impulse buy</b> or a <b>false economy</b> (cheap now, costly later)?', 'Are there hidden extra charges? Can I get it cheaper elsewhere?',
          'Is it safe? Was it made ethically? Will buying it support Irish jobs?'],
          tip: 'A food label can show: name, producer, weight, price, best before / use by date, nutrition, storage instructions, barcode, country of origin and ingredients.' },
        { h: 'Consumer responsibilities', kv: [['Caveat emptor', 'Latin for <b>“let the buyer beware”</b>: use common sense when buying.']],
          list: ['Research the product and the shop first.', 'Avoid impulse buys and false economies; shop around for value.', 'Know your legal rights.', 'Use products as the instructions say.', 'Recycle packaging and think about the environment.', '<b>Keep receipts</b> as proof of purchase.'] },
        { h: 'Sale of Goods and Supply of Services Act 1980', list: ['Goods must be of <b>merchantable quality</b> (good enough to sell), <b>fit for purpose</b>, <b>as described</b> and <b>as per sample</b>.',
          'Services must be given by someone with the right <b>skills</b>, with proper <b>care and attention</b>, using materials of merchantable quality.'],
          kv: [['Redress: the 3 Rs', '<b>Repair</b> (fixed for free, permanently), <b>Replacement</b> (same or similar item), <b>Refund</b> (money back).'],
            ['Not a valid complaint', 'You changed your mind (in a shop), you caused the fault by misuse, or you were told about the fault before buying.'],
            ['Credit note', 'Lets you spend a set amount in that shop. For a faulty item you can refuse it and ask for a refund.'],
            ['Guarantee', 'A free promise from the <b>manufacturer</b> to repair or replace a faulty item within a set time. Extra to your legal rights.'],
            ['Extended warranty', 'You <b>pay</b> for it, like insurance; the retailer covers repairs after the guarantee ends. You don’t have to buy one.']],
          tip: 'Shops can’t display signs like “No refunds” to limit your rights.' },
        { h: 'Consumer Protection Act 2007', list: ['Bans misleading claims about the <b>business</b>, its <b>goods and services</b> and its <b>prices</b>.',
          'A “previous price” must have been charged in the same shop for <b>28 days in a row</b> in the last three months.'],
          kv: [['Misleading', 'False information used to deceive consumers.'], ['Aggressive', 'Harassment, force or pressure used to make someone buy.'], ['Prohibited', '32 practices banned outright, e.g. falsely claiming to be closing down.']] },
        { h: 'Consumer Rights Act 2022', list: ['Protects you when buying <b>online, by phone or by mail order</b> (distance selling).',
          'You have the right to clear information before you buy, a refund if goods don’t arrive, to return faulty goods, to return goods if you change your mind, and to cancel services and digital purchases.'] },
        { h: 'Making a complaint', ol: ['Stop using the item.', 'Bring it back with the receipt and ask for the manager.', 'Explain the problem clearly: what, when, where.', 'Say which redress you want: refund, repair or replacement.',
          'If it isn’t sorted, complain <b>in writing</b>.', 'Get help from a third party, e.g. the <b>CCPC</b>.', 'Use the <b>Small Claims Procedure</b>.', 'Go to court.'],
          tip: 'A complaint letter: your address and date, the person’s name and title, details of the purchase, what’s wrong and which law it breaks, the redress you want, then “Yours faithfully” (no name) or “Yours sincerely” (name used).' },
        { h: 'Who can help', kv: [['CCPC', 'Competition and Consumer Protection Commission: gives information, investigates and enforces consumer law, researches and advises the government.'],
          ['Consumers’ Association of Ireland (CAI)', 'Independent; protects consumers’ rights and publishes <i>Consumer Choice</i> magazine.'],
          ['Ombudsman', 'Investigates complaints about <b>public bodies</b>, e.g. the HSE or a council.'],
          ['Small Claims Procedure', 'Low-cost court process for claims up to <b>€2,000</b>; the fee is <b>€25</b>.'],
          ['ComReg', 'Regulates phone, broadband and postal services.'], ['FSPO', 'Financial Services and Pensions Ombudsman: complaints about banks, insurers and pensions.'],
          ['CRU', 'Commission for Regulation of Utilities: energy and water.'], ['ECC Ireland', 'European Consumer Centre: disputes with traders in other EU countries.']] }
      ] },
      ethical: { label: 'Ethical & Sustainable Consumption', sections: [
        { h: 'Key words', kv: [['Ethics', 'What is right and wrong, fair and honest.'], ['Sustainable development', 'Meeting the world’s needs today <b>without</b> stopping people in the future from meeting their needs.'],
          ['Sustainable consumption', 'Choosing goods and services that were produced or supplied in an <b>environmentally sustainable</b> way.'],
          ['Ethical consumption', 'Choosing goods and services that reflect our <b>morals, values and beliefs</b>.']] },
        { h: 'The responsible consumer asks…', kv: [['Is it environmentally friendly?', 'Did making it cause pollution? Is it recycled or recyclable? Is there too much packaging? Is there a safer alternative?'],
          ['Is it ethical?', 'Were workers paid fairly, safe and given breaks? Was child labour used? Does the firm pay its fair share of tax?'],
          ['Is it sustainable?', 'Will the raw materials run out for future generations?']] },
        { h: 'Sustainable development in action', kv: [['Fossil fuels', 'Oil, gas, coal and turf are non-renewable and running out, so we must find alternatives.'],
          ['Fish stocks', 'The EU’s <b>Common Fisheries Policy</b> uses quotas and bans on some fishing to protect fish for the future.'],
          ['Smarter Travel', 'Ireland’s sustainable transport policy: walk, cycle, car-share or use public transport.']] },
        { h: 'How to be a sustainable consumer', list: ['Learn about climate change and sustainable development.', 'Think green when shopping, e.g. an electric or hybrid car.', 'Know how a product affects the environment.',
          'Cut waste: less packaging, recyclable packaging.', 'Buy local, from firms that treat workers and the environment well.', 'Do the small things: reusable bags, rechargeable batteries, lights off. <b>Reduce, reuse, recycle.</b>'] },
        { h: 'Ethical or just legal?', kv: [['Minimum wage', 'The lowest hourly pay an employer can <b>legally</b> pay. It may not cover rent, food and bills, so it can be legal but unethical.'],
          ['Living wage', 'The pay needed for a basic, socially acceptable standard of living. It is higher than the minimum wage.'],
          ['Food labels', 'Using harps, shamrocks or “locally produced” on food that isn’t Irish may be legal but misleading, and it hurts genuine Irish producers.']] },
        { h: 'Buy Irish', kv: [['Love Irish Food', 'Its logo only goes on food and drink made in the Republic of Ireland, using Irish ingredients where possible. It protects Irish jobs.'],
          ['Origin Green', '<b>Bord Bia</b>’s sustainability programme: producers commit to sustainability targets.'],
          ['Fairtrade', 'Farmers and workers in developing countries are paid at least a fair minimum price.']] },
        { h: 'Being an ethical consumer', list: ['Avoid very cheap goods: someone may be paying the price, e.g. children in sweatshops.', 'Choose environmentally friendly alternatives.',
          'Avoid products from factory farms, where animals are kept in cramped conditions.', 'Buy Fairtrade.'],
          tip: 'It can be hard: money is limited, we don’t always know where products come from, and people think their choice won’t matter. But boycotts have made big firms change.' },
        { h: 'Business responsibilities', kv: [['Employees', 'Fair pay; safe, healthy working conditions.'], ['Customers', 'Safe, good-quality goods at a fair price.'], ['Suppliers', 'Paid on time and fairly; only use ethical suppliers.'],
          ['Revenue Commissioners', 'Pay the right taxes on time.'], ['Local community', 'A clean area, no noise or air pollution, enough parking.'], ['Environment', 'Eco-friendly products, recyclable packaging, proper waste control.']],
          tip: 'Many businesses have a <b>code of ethics</b> that guides how staff make decisions.' }
      ] },
      entrepreneur: { label: 'Entrepreneurs & Enterprising People', sections: [
        { h: 'Enterprise', kv: [['Enterprise', 'Any attempt to start or do something new: turning ideas into action.'], ['Entrepreneur', 'Someone who takes the <b>initiative</b> and the <b>personal and financial risk</b> of setting up an organisation.'],
          ['Social entrepreneur', 'Uses enterprise to benefit the wider community.'], ['Intrapreneur', 'An enterprising <b>employee</b> inside a business.']],
          list: ['<b>Home:</b> learning a new skill, DIY, a household budget, selling unwanted things.', '<b>School:</b> a mini-company, clubs, organising events.', '<b>Community:</b> youth clubs, Tidy Towns, Meals on Wheels.',
            '<b>Public service:</b> the National Broadband Plan, Revenue’s online tax system, Local Enterprise Offices.', '<b>Business:</b> setting up firms that provide goods and services.'] },
        { h: 'Characteristics (traits you’re born with)', kv: [['Realistic risk-taker', 'Researches carefully and only takes calculated risks.'], ['Innovative', 'Thinks of new ways of doing things.'], ['Proactive', 'Makes things happen.'],
          ['Flexible', 'Adapts and learns from mistakes.'], ['Self-confident', 'Believes in themselves and their ideas.'], ['Decisive', 'Makes timely decisions and takes responsibility.'], ['Determined / resilient', 'Doesn’t give up easily.']] },
        { h: 'Skills (developed through practice and training)', list: ['<b>Identifying opportunities:</b> spotting gaps in the market.', '<b>Planning and goal setting.</b>', '<b>Time management.</b>', '<b>Financial management:</b> budgets and cash flow.',
          '<b>Human relations:</b> communication and teamwork.', '<b>Risk management:</b> assessing and reducing risks.'] },
        { h: 'Rewards and risks', kv: [['Rewards', 'Be your own boss, keep the profits, flexible hours, great satisfaction if it succeeds.'],
          ['Risks', 'Lose the money you invested, long hours, hard to take time off, income not guaranteed, may lack some skills, reputation and credit rating may suffer if it fails.']] },
        { h: 'The role of entrepreneurs', kv: [['In the economy', 'Use resources well, provide goods and services, create jobs and wealth, train people, raise living standards, generate tax, boost exports.'],
          ['In society', 'Provide services and amenities, improve infrastructure, raise the standard of living, promote an enterprise culture, sponsor community groups.']] },
        { h: 'Where ideas come from', kv: [['Internal sources', 'Brainstorming, feedback from sales staff, ideas from employees (intrapreneurs), the research and development (R&D) department.'],
          ['External sources', 'Competitors, import substitution, customer complaints and feedback, market research.'],
          ['Import substitution', 'Making in Ireland goods that are usually imported.'],
          ['Market research', 'Gathering, recording and analysing information about what consumers want, to make informed decisions.']] },
        { h: 'New product development', ol: ['Idea generation', 'Product screening', 'Concept development', 'Feasibility study', 'Prototype development', 'Test marketing', 'Product launch'],
          tip: 'Memory trick: “<b>I S</b>ee <b>C</b>ool <b>F</b>riends <b>P</b>lay <b>T</b>ennis <b>L</b>ate”.' }
      ] },
      enterprise: { label: 'Types of Enterprise', sections: [
        { h: 'Size of organisation', kv: [['Local', 'Operates in one local area.'], ['National', 'Operates or has branches all over Ireland.'], ['Global', 'Very large, with operations all over the world.']] },
        { h: '1. Financial enterprise', kv: [['Aim', 'To make a <b>profit</b> by selling goods or services.'], ['Examples', 'Apple, McDonald’s, Centra, a local shop.'],
          ['Role in society', 'Provides goods, services and jobs; pays tax; provides finance to others; boosts economic growth.'],
          ['Supports', '<b>Local Enterprise Offices (LEOs):</b> financial advice, mentoring, training. <b>Enterprise Ireland:</b> financial support, research and development, help with exporting.']] },
        { h: '2. Social enterprise', kv: [['Aim', 'Puts <b>people and the community</b> ahead of personal or private gain.'], ['Examples', 'Credit unions, Macra na Feirme, CoderDojo.'],
          ['Role in society', 'Tackles social problems, provides services, creates jobs, provides finance, builds an enterprise culture.'],
          ['Supports', '<b>Social Entrepreneurs Ireland (SEI):</b> financial and practical support.']],
          tip: '<b>Not-for-profit</b> enterprises include charities and voluntary organisations that serve communities.' },
        { h: '3. Cultural enterprise', kv: [['Aim', 'Gives people access to the <b>arts and culture</b>.'], ['Examples', 'Electric Picnic, the Fleadh, the Rose of Tralee, Cork Jazz Festival.'],
          ['Role in society', 'Promotes arts and culture, creates jobs, supports the local economy, entertains.'],
          ['Supports', '<b>Culture Ireland:</b> promotes Irish acts worldwide. <b>The Arts Council:</b> develops the arts.']] },
        { h: 'Can an enterprise be two types?', list: ['Yes. Some make a profit <b>and</b> help society, e.g. a social enterprise that sells products to fund community projects.'] }
      ] },
      impact: { label: 'Impact of Organisations', sections: [
        { h: 'Key words', kv: [['Community', 'A group of people who live in the same place or share attitudes and interests.'], ['Positive impact', 'Benefits the community.'], ['Negative impact', 'Costs or a loss to the community.']] },
        { h: 'Economic perspective (money, wealth, jobs, profit)', kv: [['Positive', '<b>Employment</b> (plus spin-off jobs in transport and banking), <b>tax revenue</b> for health and education, a higher <b>standard of living</b>, <b>economic growth</b>, an <b>enterprise culture</b>, and the <b>multiplier effect</b>.'],
          ['Negative', '<b>Pressure on resources</b> such as land, a <b>housing shortage</b>, <b>crowding out</b> small local businesses, and <b>over-reliance</b> on one big employer.']],
          tip: '<b>Multiplier effect:</b> wages and payments to local suppliers are spent locally, which supports other businesses, so the first investment grows again and again.' },
        { h: 'Social perspective (people and communities)', kv: [['Positive', 'More local services (childcare, transport, finance), it helps sustain the community, more choice and lower prices, a better quality of life.'],
          ['Negative', 'Sudden population increases put pressure on services such as hospitals, more traffic, and social tension if locals feel it doesn’t fit.']] },
        { h: 'Environmental perspective (surroundings and natural resources)', kv: [['Positive', 'Pollution controls and clean technology, renewable energy, land used for parks and community facilities.'],
          ['Negative', 'Pollution, unsustainable use of resources, and habitat destruction.']] }
      ] }
    },

    decks: {
      consumer: { label: 'Protecting the Consumer', cards: cards([['Consumer', 'A person who buys goods or services for their own use'], ['Caveat emptor', 'Let the buyer beware'],
        ['Merchantable quality', 'Good enough to sell'], ['Fit for purpose', 'Does the job it was sold for'], ['The 3 Rs of redress', 'Repair, replacement, refund'],
        ['Credit note', 'Lets you spend a set amount in that shop only'], ['Guarantee', 'A free promise from the manufacturer to repair or replace within a set time'],
        ['Extended warranty', 'Paid cover for repairs after the guarantee ends'], ['Consumer Protection Act 2007', 'Bans misleading claims about businesses, goods and prices'],
        ['Consumer Rights Act 2022', 'Protects online, phone and mail-order buyers'], ['Aggressive practice', 'Harassment or pressure to make someone buy'],
        ['CCPC', 'Investigates and enforces consumer law'], ['Small Claims Procedure', 'Claims up to €2,000; €25 fee'], ['Ombudsman', 'Complaints about public bodies'],
        ['ComReg', 'Regulates phone, broadband and post'], ['CRU', 'Regulates energy and water']]) },
      ethical: { label: 'Ethical & Sustainable', cards: cards([['Ethics', 'What is right and wrong, fair and honest'], ['Sustainable development', 'Meeting today’s needs without stopping future generations meeting theirs'],
        ['Sustainable consumption', 'Choosing goods produced in an environmentally sustainable way'], ['Ethical consumption', 'Choosing goods that reflect our morals, values and beliefs'],
        ['Minimum wage', 'The lowest hourly pay that is legal'], ['Living wage', 'Pay needed for a basic acceptable standard of living'], ['Fairtrade', 'Producers get at least a fair minimum price'],
        ['Origin Green', 'Bord Bia’s sustainability programme'], ['Love Irish Food', 'Logo for food made in Ireland with Irish ingredients'], ['Common Fisheries Policy', 'EU quotas to protect fish stocks'],
        ['Smarter Travel', 'Ireland’s sustainable transport policy'], ['Code of ethics', 'Rules guiding how a business and its staff behave'], ['The three Rs', 'Reduce, reuse, recycle']]) },
      entrepreneur: { label: 'Entrepreneurs', cards: cards([['Enterprise', 'Any attempt to start or do something new'], ['Entrepreneur', 'Takes the initiative and the risk of setting up an organisation'],
        ['Intrapreneur', 'An enterprising employee'], ['Social entrepreneur', 'Uses enterprise to benefit the community'], ['Characteristic', 'A personality trait you are born with'],
        ['Skill', 'An ability developed through practice or training'], ['Innovative', 'Thinks of new ways of doing things'], ['Proactive', 'Makes things happen'], ['Decisive', 'Makes timely decisions'],
        ['Import substitution', 'Making in Ireland what is usually imported'], ['Market research', 'Gathering and analysing information on what consumers want'],
        ['Prototype', 'A first working model of a new product'], ['Feasibility study', 'Checks if an idea is practical and profitable'], ['Test marketing', 'Selling the product in a small area first']]) },
      enterprise: { label: 'Types of Enterprise', cards: cards([['Financial enterprise', 'Set up to make a profit'], ['Social enterprise', 'Puts people and community ahead of private gain'],
        ['Cultural enterprise', 'Gives access to the arts and culture'], ['Local organisation', 'Operates in one local area'], ['National organisation', 'Operates all over Ireland'], ['Global organisation', 'Operates all over the world'],
        ['Local Enterprise Office (LEO)', 'Financial advice, mentoring, training'], ['Enterprise Ireland', 'Financial support, R&D, help with exporting'],
        ['Social Entrepreneurs Ireland', 'Supports social entrepreneurs'], ['Culture Ireland', 'Promotes Irish acts worldwide'], ['Arts Council', 'Develops the arts in Ireland'], ['Credit union', 'An example of a social enterprise']]) },
      impact: { label: 'Impact of Organisations', cards: cards([['Community', 'People who live in the same place or share interests'], ['Multiplier effect', 'Money spent locally keeps supporting other businesses'],
        ['Spin-off jobs', 'Extra jobs created in other firms, e.g. transport'], ['Crowding out', 'Big firms forcing small local businesses to close'], ['Over-reliance', 'Depending too much on one employer'],
        ['Economic perspective', 'Money, wealth, jobs and profit'], ['Social perspective', 'Impact on people and communities'], ['Environmental perspective', 'Impact on surroundings and natural resources'],
        ['Habitat destruction', 'Natural habitats cleared for development']]) }
    },

    quizzes: {
      consumer: { label: 'Protecting the Consumer', questions: [
        { q: 'What does caveat emptor mean?', ans: ['Let the buyer beware'], opts: ['The customer is always right', 'Buy now, pay later', 'No refunds'] },
        { q: 'Which law says goods must be of merchantable quality?', ans: ['Sale of Goods and Supply of Services Act 1980'], opts: ['Consumer Protection Act 2007', 'Consumer Rights Act 2022', 'Small Claims Act'] },
        { q: 'Which is NOT one of the 3 Rs of redress?', ans: ['Receipt'], opts: ['Repair', 'Replacement', 'Refund'] },
        { q: 'A free promise from the manufacturer to fix a faulty item is a…', ans: ['Guarantee'], opts: ['Extended warranty', 'Credit note', 'Receipt'] },
        { q: 'Which Act covers buying online?', ans: ['Consumer Rights Act 2022'], opts: ['Sale of Goods Act 1980', 'Consumer Protection Act 2007', 'The Ombudsman Act'] },
        { q: 'Using pressure or harassment to make someone buy is…', ans: ['An aggressive practice'], opts: ['A misleading practice', 'A false economy', 'An impulse buy'] },
        { q: 'What is the most you can claim through the Small Claims Procedure?', ans: ['€2,000'], opts: ['€500', '€5,000', '€25'] },
        { q: 'Who investigates complaints about public bodies like the HSE?', ans: ['The Ombudsman'], opts: ['ComReg', 'The CCPC', 'The CRU'] },
        { q: 'When is a complaint NOT valid?', ans: ['You caused the fault by misusing it'], opts: ['The item is faulty', 'It isn’t as described', 'It isn’t fit for purpose'] },
        { q: 'A previous price must have been charged for how many days in a row?', ans: ['28'], opts: ['7', '14', '90'] }
      ] },
      ethical: { label: 'Ethical & Sustainable', questions: [
        { q: 'Meeting today’s needs without harming future generations is…', ans: ['Sustainable development'], opts: ['Ethical consumption', 'Import substitution', 'Market research'] },
        { q: 'Which programme is run by Bord Bia?', ans: ['Origin Green'], opts: ['Fairtrade', 'Love Irish Food', 'Smarter Travel'] },
        { q: 'The living wage is…', ans: ['Higher than the minimum wage'], opts: ['Lower than the minimum wage', 'The same as the minimum wage', 'Only for over-65s'] },
        { q: 'What does the Common Fisheries Policy protect?', ans: ['Fish stocks'], opts: ['Fossil fuels', 'Farm animals', 'Irish jobs'] },
        { q: 'Which is a non-renewable resource?', ans: ['Coal'], opts: ['Wind', 'Solar power', 'Wave energy'] },
        { q: 'Smarter Travel is Ireland’s policy on…', ans: ['Sustainable transport'], opts: ['Food labels', 'Fair wages', 'Recycling'] },
        { q: 'Choosing goods that match your morals and values is…', ans: ['Ethical consumption'], opts: ['Impulse buying', 'Sustainable development', 'A false economy'] },
        { q: 'A business’s responsibility to the Revenue Commissioners is to…', ans: ['Pay its taxes on time'], opts: ['Pay suppliers on time', 'Provide parking', 'Recycle packaging'] }
      ] },
      entrepreneur: { label: 'Entrepreneurs', questions: [
        { q: 'An enterprising employee is called an…', ans: ['Intrapreneur'], opts: ['Entrepreneur', 'Investor', 'Ombudsman'] },
        { q: 'Which is a SKILL rather than a characteristic?', ans: ['Time management'], opts: ['Self-confident', 'Innovative', 'Determined'] },
        { q: 'Which is an INTERNAL source of ideas?', ans: ['Brainstorming with staff'], opts: ['Competitors', 'Customer complaints', 'Import substitution'] },
        { q: 'What comes straight after idea generation?', ans: ['Product screening'], opts: ['Test marketing', 'Product launch', 'Prototype development'] },
        { q: 'What is the last stage of new product development?', ans: ['Product launch'], opts: ['Feasibility study', 'Concept development', 'Test marketing'] },
        { q: 'Which is a RISK of being an entrepreneur?', ans: ['Losing the money you invested'], opts: ['Being your own boss', 'Keeping the profits', 'Flexible hours'] },
        { q: 'A realistic risk-taker…', ans: ['Takes only calculated risks after research'], opts: ['Takes every risk going', 'Never takes risks', 'Lets others decide'] },
        { q: 'Making goods in Ireland that are normally imported is…', ans: ['Import substitution'], opts: ['Market research', 'Exporting', 'Test marketing'] }
      ] },
      enterprise: { label: 'Types of Enterprise', questions: [
        { q: 'The main aim of a financial enterprise is to…', ans: ['Make a profit'], opts: ['Promote the arts', 'Help the community first', 'Raise money for charity'] },
        { q: 'A credit union is an example of a…', ans: ['Social enterprise'], opts: ['Financial enterprise', 'Cultural enterprise', 'Global organisation'] },
        { q: 'Electric Picnic is an example of a…', ans: ['Cultural enterprise'], opts: ['Social enterprise', 'Financial enterprise', 'Public service'] },
        { q: 'Who promotes Irish acts worldwide?', ans: ['Culture Ireland'], opts: ['The Arts Council', 'Enterprise Ireland', 'The CCPC'] },
        { q: 'Who helps Irish businesses export?', ans: ['Enterprise Ireland'], opts: ['Culture Ireland', 'Social Entrepreneurs Ireland', 'The Ombudsman'] },
        { q: 'Which support does a Local Enterprise Office give?', ans: ['Mentoring'], opts: ['Promoting Irish acts abroad', 'Regulating energy', 'Investigating public bodies'] },
        { q: 'An organisation with branches all over Ireland is…', ans: ['National'], opts: ['Local', 'Global', 'Cultural'] }
      ] },
      impact: { label: 'Impact of Organisations', questions: [
        { q: 'Money spent locally that keeps supporting other businesses is the…', ans: ['Multiplier effect'], opts: ['Crowding-out effect', 'Living wage', 'Enterprise culture'] },
        { q: 'Which is a negative ECONOMIC impact?', ans: ['A housing shortage'], opts: ['Tax revenue', 'Economic growth', 'Spin-off jobs'] },
        { q: 'Which is a negative SOCIAL impact?', ans: ['More traffic'], opts: ['Pollution controls', 'More jobs', 'Tax revenue'] },
        { q: 'Which is a negative ENVIRONMENTAL impact?', ans: ['Habitat destruction'], opts: ['Social tension', 'Over-reliance', 'Crowding out'] },
        { q: 'A big supermarket forcing small shops to close is…', ans: ['Crowding out'], opts: ['The multiplier effect', 'Over-reliance', 'Import substitution'] },
        { q: 'A town that depends on one big employer risks…', ans: ['Over-reliance'], opts: ['Crowding out', 'Economic growth', 'Habitat destruction'] }
      ] }
    },

    matches: {
      consumerHelp: { label: 'Who can help?', colL: 'Body', colR: 'What it does', pairs: pairs([['CCPC', 'Enforces consumer law'], ['Ombudsman', 'Complaints about public bodies'], ['Small Claims Procedure', 'Claims up to €2,000'],
        ['ComReg', 'Phones, broadband and post'], ['CRU', 'Energy and water'], ['FSPO', 'Banks, insurers and pensions'], ['ECC Ireland', 'Disputes with traders in other EU countries']]) },
      ethical: { label: 'Key terms', colL: 'Term', colR: 'Meaning', pairs: pairs([['Ethics', 'Right and wrong, fair and honest'], ['Sustainable development', 'Today’s needs met without harming the future'],
        ['Fairtrade', 'Fair minimum price for producers'], ['Origin Green', 'Bord Bia sustainability programme'], ['Living wage', 'Enough for a basic decent life'], ['Minimum wage', 'The lowest legal hourly pay']]) },
      traits: { label: 'Characteristics', colL: 'Characteristic', colR: 'Meaning', pairs: pairs([['Innovative', 'Thinks of new ways of doing things'], ['Proactive', 'Makes things happen'], ['Flexible', 'Adapts and learns from mistakes'],
        ['Self-confident', 'Believes in their ideas'], ['Decisive', 'Makes timely decisions'], ['Resilient', 'Doesn’t give up easily']]) },
      enterprise: { label: 'Enterprises and supports', colL: 'Organisation', colR: 'Type or role', pairs: pairs([['Supermarket chain', 'Financial enterprise'], ['Credit union', 'Social enterprise'], ['Music festival', 'Cultural enterprise'],
        ['Local Enterprise Office', 'Mentoring and training'], ['Enterprise Ireland', 'Help with exporting'], ['Culture Ireland', 'Promotes Irish acts abroad'], ['Social Entrepreneurs Ireland', 'Supports social entrepreneurs']]) },
      impact: { label: 'Impacts', colL: 'Impact', colR: 'Perspective', pairs: pairs([['Tax revenue', 'Positive economic'], ['Housing shortage', 'Negative economic'], ['More local services', 'Positive social'],
        ['Increased traffic', 'Negative social'], ['Renewable energy', 'Positive environmental'], ['Habitat destruction', 'Negative environmental']]) }
    },

    practice: {
      consumer: { label: 'Protecting the Consumer', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Caveat emptor means let the ___ beware.', ans: ['buyer'] }, { q: 'Goods must be of ___ quality.', ans: ['merchantable'] },
        { q: 'The 3 Rs of redress are repair, replacement and ___.', ans: ['refund'] }, { q: 'A free promise from the manufacturer is a ___.', ans: ['guarantee'] },
        { q: 'The Consumer Rights Act ___ covers online shopping.', ans: ['2022'] }, { q: 'The Small Claims Procedure covers claims up to €___.', ans: ['2,000', '2000'] },
        { q: 'The ___ investigates complaints about public bodies.', ans: ['Ombudsman'] }] },
      ethical: { label: 'Ethical & Sustainable', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: '___ is concerned with what is right and wrong.', ans: ['Ethics'] }, { q: 'The ___ wage is the lowest pay an employer can legally pay.', ans: ['minimum'] },
        { q: 'Origin Green is run by Bord ___.', ans: ['Bia'] }, { q: 'The EU protects fish stocks with the Common ___ Policy.', ans: ['Fisheries'] },
        { q: 'Reduce, reuse, ___.', ans: ['recycle'] }, { q: 'Oil, gas and coal are ___ fuels.', ans: ['fossil'] }] },
      entrepreneur: { label: 'Entrepreneurs', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Enterprise is turning ideas into ___.', ans: ['action', 'actions'] }, { q: 'An enterprising employee is an ___.', ans: ['intrapreneur'] },
        { q: 'A ___ is a personality trait you are born with.', ans: ['characteristic'] }, { q: 'A ___ is developed through practice and training.', ans: ['skill'] },
        { q: 'Making in Ireland goods that are usually imported is import ___.', ans: ['substitution'] }, { q: 'The R&D department is an ___ source of ideas.', ans: ['internal'] }] },
      npd: { label: 'New product development', type: 'lines', intro: 'Name each stage, in order.', items: [
        { q: 'Stage 1: ___ generation', ans: ['idea', 'ideas'] }, { q: 'Stage 2: product ___', ans: ['screening'] }, { q: 'Stage 3: ___ development', ans: ['concept'] },
        { q: 'Stage 4: ___ study', ans: ['feasibility'] }, { q: 'Stage 5: ___ development', ans: ['prototype'] }, { q: 'Stage 6: test ___', ans: ['marketing'] }, { q: 'Stage 7: product ___', ans: ['launch'] }] },
      enterprise: { label: 'Types of Enterprise', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'A ___ enterprise is set up to make a profit.', ans: ['financial'] }, { q: 'A ___ enterprise puts people and community first.', ans: ['social'] },
        { q: 'A ___ enterprise gives access to the arts.', ans: ['cultural'] }, { q: 'Culture ___ promotes Irish acts worldwide.', ans: ['Ireland'] },
        { q: 'LEO stands for Local ___ Office.', ans: ['Enterprise'] }, { q: 'An organisation operating all over the world is ___.', ans: ['global'] }] },
      impact: { label: 'Impact of Organisations', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Money spent locally again and again is the ___ effect.', ans: ['multiplier'] }, { q: 'Big firms forcing small shops to close is called crowding ___.', ans: ['out'] },
        { q: 'Depending too much on one employer is over-___.', ans: ['reliance'] }, { q: 'Clearing land for development can cause habitat ___.', ans: ['destruction'] },
        { q: 'The ___ perspective looks at money, wealth, jobs and profit.', ans: ['economic'] }] }
    }
  };

  window.SN_DATA.business = { id: 'business', title: 'Business Studies', subtitle: 'Business', marking: { spelling: 'lenient', note: 'Business: accept any correctly explained point in your own words; definitions need their key words.' }, years: { '2': y2 } };
})();
