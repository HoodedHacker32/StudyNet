/* StudyNet — History data (1st and 2nd Year). Loaded by history.html. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  function cards(pairs) { return pairs.map(function (p) { return { front: p[0], back: p[1] }; }); }

  /* ════════════════════════════════════════════════════════════
     1st YEAR (storage keys unchanged from the original page)
  ════════════════════════════════════════════════════════════ */
  var y1 = {
    /* Exam bank (1st Year): exam-style questions written for StudyNet, modelled on the question types that recur in Junior Cycle papers. */
    examq: [
      { id: 'hi1-hs-1', topic: 'historian', src: 'Exam style', type: 'group', q: 'Sources.', parts: [
        { type: 'mcq', q: 'Which of these is a primary source?', ans: 'A diary written during the event', opts: ['A school textbook', 'A documentary made 50 years later', 'A history website'], marks: 2 },
        { type: 'short', q: 'A place where sources are kept, such as an archive or a museum, is called a…', ans: ['repository', 'a repository'], marks: 2 },
        { type: 'written', q: 'What is bias, and why must historians be careful of it?', marks: 4, lines: 3,
          scheme: ['Bias: a one-sided view that favours one side (2 marks)', 'Historians must cross-check sources because a biased source may not give an accurate picture (2 marks)'],
          model: 'Bias is a one-sided view. Historians have to be careful because a biased source may leave things out or exaggerate, so they cross-check it with other sources.' }] },
      { id: 'hi1-hs-2', topic: 'historian', src: 'Exam style', type: 'group', q: 'Time and archives.', parts: [
        { type: 'short', q: 'The years 701 to 800 AD are in which century?', ans: ['8th', 'eighth', 'the 8th', 'the eighth', '8th century', 'eighth century'], marks: 2 },
        { type: 'short', q: 'The year 1066 is in which century?', ans: ['11th', 'eleventh', 'the 11th', '11th century', 'eleventh century'], marks: 2 },
        { type: 'written', q: 'Give two reasons why archives are important to historians.', marks: 4, lines: 3,
          scheme: ['Any two: they keep original (primary) sources safe / records can be checked by anyone / they preserve evidence that might otherwise be lost or damaged / sources are organised so they can be found (2 marks each)'],
          model: 'Archives keep original documents safe from damage, and they organise them so historians can find and check the evidence.' }] },
      { id: 'hi1-hs-3', topic: 'historian', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain two methods archaeologists use to find or date a site.',
        scheme: ['Any two explained: aerial photography (crop marks) / geophysical survey / radiocarbon (carbon-14) dating / dendrochronology (tree rings) / stratigraphy (deeper layers are older) / excavation (3 marks each)'],
        model: 'Aerial photography spots crop marks from above that show where buried walls are. Radiocarbon dating measures the carbon-14 left in once-living things such as bone or wood to work out their age.' },
      { id: 'hi1-ma-1', topic: 'middle-ages', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Describe the stages in becoming a knight in the Middle Ages.',
        scheme: ['Page: from about 7, served a lord and learned manners and riding (2 marks)', 'Squire: from about 14, served a knight and trained with weapons (2 marks)', 'Dubbing: at about 21 he was knighted in a ceremony (2 marks)'],
        model: 'At about seven a boy became a page in a lord’s castle, learning manners and riding. At fourteen he became a squire, looking after a knight’s armour and training with weapons. At about twenty-one he was dubbed a knight.' },
      { id: 'hi1-ma-2', topic: 'middle-ages', src: 'Exam style', type: 'group', q: 'Life in the Middle Ages.', parts: [
        { type: 'mcq', q: 'The strongest tower of a castle, the last line of defence, was the…', ans: 'Keep', opts: ['Moat', 'Drawbridge', 'Bailey'], marks: 2 },
        { type: 'short', q: 'What was land given by a lord to a knight in return for military service called?', ans: ['a fief', 'fief'], marks: 2 },
        { type: 'written', q: 'Explain two aspects of medieval life that lowered life expectancy.', marks: 4, lines: 3,
          scheme: ['Any two: disease, e.g. the Black Death / poor hygiene and dirty water / little medical knowledge / famine and poor diet / warfare / dangerous childbirth (2 marks each)'],
          model: 'Towns had no sewers and dirty water, so diseases spread easily. Doctors had little medical knowledge, so plagues like the Black Death killed millions.' }] },
      { id: 'hi1-ma-3', topic: 'middle-ages', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Describe how a craftsman was trained in a medieval town, and explain the role of a guild.',
        scheme: ['Apprentice: worked for a master for about seven years for food and board (2 marks)', 'Journeyman: qualified and paid, then made a masterpiece to become a master (2 marks)', 'Guild: controlled training, prices and quality and looked after members (2 marks)'],
        model: 'A boy became an apprentice to a master for about seven years. Then he became a journeyman, paid by the day, and could become a master by making a masterpiece. The guild controlled training, prices and quality, and helped members who were sick.' },
      { id: 'hi1-re-1', topic: 'renaissance', src: 'Exam style', type: 'group', q: 'The Renaissance.', parts: [
        { type: 'short', q: 'What does the word Renaissance mean?', ans: ['rebirth', 're-birth'], marks: 2 },
        { type: 'short', q: 'Name the wealthy family of Florence who were patrons of artists.', ans: ['Medici', 'the Medici', 'Medici family', 'the Medici family'], marks: 2 },
        { type: 'written', q: 'Name two features of Renaissance painting.', marks: 4, lines: 2,
          scheme: ['Any two: perspective / realism / oil paints / everyday and classical subjects as well as religious / sfumato or light and shade (2 marks each)'],
          model: 'Perspective, to give depth and distance, and realism, painting people as they really looked.' }] },
      { id: 'hi1-re-2', topic: 'renaissance', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'Name a technological development of the Renaissance period, give its date, and explain how it changed people’s lives.',
        scheme: ['Named development, e.g. the printing press (2 marks)', 'Date or person, e.g. Gutenberg, about 1450 (2 marks)', 'Two changes, e.g. books became cheaper and more common / more people learned to read / new ideas spread quickly, e.g. the Reformation (2 marks each)'],
        model: 'The printing press, developed by Johannes Gutenberg around 1450. Books became much cheaper and more plentiful, so more people learned to read, and new ideas such as Luther’s spread quickly across Europe.' },
      { id: 'hi1-re-3', topic: 'renaissance', src: 'Exam style', type: 'group', q: 'Renaissance people.', parts: [
        { type: 'short', q: 'Who discovered that the heart pumps blood around the body?', ans: ['William Harvey', 'Harvey'], marks: 2 },
        { type: 'written', q: 'Name a Renaissance artist you studied, two of his works, and one technique he used.', marks: 6, lines: 4,
          scheme: ['Named artist, e.g. Leonardo da Vinci / Michelangelo (2 marks)', 'Two works, e.g. Mona Lisa, The Last Supper / David, Sistine Chapel ceiling (1 mark each)', 'A technique, e.g. perspective / sfumato / fresco / anatomy studies (2 marks)'],
          model: 'Leonardo da Vinci painted the Mona Lisa and The Last Supper. He used sfumato, soft blending of light and shade, to make faces look real.' }] },
      { id: 'hi1-ex-1', topic: 'exploration', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Give two reasons why Europeans began to explore and colonise other parts of the world in the 1400s and 1500s.',
        scheme: ['Any two developed: gold and riches / spices and new trade routes to Asia / spreading Christianity / glory and fame / better ships (caravel) and navigation instruments (3 marks each)'],
        model: 'They wanted gold and spices, and a sea route to Asia to trade directly. They also wanted to spread Christianity to new lands.' },
      { id: 'hi1-ex-2', topic: 'exploration', src: 'Exam style', type: 'group', q: 'Voyages and conquest.', parts: [
        { type: 'short', q: 'In what year did Columbus reach the Americas?', ans: ['1492'], marks: 2 },
        { type: 'short', q: 'Name the instrument sailors used to measure the angle of the sun or stars.', ans: ['astrolabe', 'an astrolabe', 'quadrant'], marks: 2 },
        { type: 'written', q: 'Explain two effects of the European conquest on the native peoples of the Americas.', marks: 4, lines: 3,
          scheme: ['Any two: European diseases such as smallpox killed millions / enslavement and forced labour / loss of land / their culture and religion were destroyed / forced conversion (2 marks each)'],
          model: 'Diseases such as smallpox killed millions because native people had no immunity, and many survivors were forced to work as slaves.' }] },
      { id: 'hi1-ex-3', topic: 'exploration', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'People today see Christopher Columbus in very different ways. Explain two different points of view about him.',
        scheme: ['One view, e.g. a brave explorer whose voyages connected Europe and the Americas (3 marks)', 'Another view, e.g. he treated the Taíno brutally, enslaved people and began colonisation that led to mass deaths (3 marks)'],
        model: 'Some see him as a brave explorer who crossed the Atlantic and linked Europe with the Americas. Others see him as cruel: he enslaved the Taíno people, and his voyages began a conquest that killed millions.' },
    ],
    blurb: 'History — the historian, Middle Ages, Renaissance and Age of Exploration',
    store: 'sn_history_v1',
    score: 'history',
    topics: [
      { id: 'historian', label: 'The historian & archaeologist', icon: 'text', desc: 'Sources, bias, dating and excavation',
        fc: ['historian'], quiz: ['historian'], match: ['historian'], prac: ['historian'] },
      { id: 'middle-ages', label: 'The Middle Ages', icon: 'flag', desc: 'Knights, monks, craftsmen and the Black Death',
        fc: ['middleAges'], quiz: ['middleAges'], match: ['middleAges'], prac: ['middleAges'], tl: ['medieval'] },
      { id: 'renaissance', label: 'The Renaissance', icon: 'flask', desc: 'Art, science and technology',
        fc: ['renaissance'], quiz: ['renaissance'], match: ['renaissance'], prac: ['renaissance'] },
      { id: 'exploration', label: 'Age of Exploration', icon: 'compass', desc: 'Explorers, conquests and their impact',
        fc: ['exploration'], quiz: ['exploration'], match: ['exploration'], prac: ['exploration'], tl: ['voyages'] }
    ],
    decks: {
      historian: { label: 'Historian', cards: cards([
        ['History', 'The study of the past using written and other sources'], ['Prehistory', 'The period before writing was invented'],
        ['Primary source', 'Evidence from the time of an event (e.g. a diary or artefact)'], ['Secondary source', 'An account by someone who was not there (e.g. a textbook)'],
        ['Repository', 'A place where sources are kept, e.g. an archive or museum'], ['Bias', 'A one-sided view that affects how a source presents information'],
        ['Propaganda', 'Information spread to promote a political view or cause'], ['Fact', 'Something that can be proven to be true'],
        ['Opinion', 'A personal view that cannot be proven true or false'], ['Cross-checking', 'Using several sources to check information'],
        ['Chronology', 'Arranging events in the order they happened'], ['Archaeology', 'The study of the past through physical remains and artefacts'],
        ['Aerial photography', 'Used by archaeologists to spot sites from above (e.g. crop marks)'], ['Radiocarbon dating', 'Uses carbon-14 to estimate the age of once-living material'],
        ['Conservation', 'Protecting artefacts from decay or damage'], ['Reinterpretation', 'Looking at sources again in the light of new evidence']]) },
      middleAges: { label: 'Middle Ages', cards: cards([
        ['Middle Ages', 'Period from c.500 AD to c.1500 AD in Europe'], ['Feudal system', 'Hierarchy of king, lords, knights and peasants based on land'],
        ['Fief', 'Land granted by a lord to a knight in return for military service'], ['Keep', 'The strongest tower of a castle, the last line of defence'],
        ['Trebuchet', 'Siege weapon that hurled boulders at castle walls'], ['Moat', 'Deep ditch filled with water around a castle'],
        ['Dowry', 'Money or property a bride brought to her husband on marriage'], ['Chivalry', 'The knights’ code: brave, loyal and courteous'],
        ['Page', 'First stage of becoming a knight (age 7–14, served a lord)'], ['Squire', 'Second stage of knighthood (age 14–21, trained with weapons)'],
        ['Dubbing', 'Ceremony in which a squire was made a knight'], ['Apprentice', 'First stage of becoming a craftsman, working under a master'],
        ['Journeyman', 'A qualified craftsman who is not yet a master'], ['Guild', 'An association of craftsmen that controlled training and quality'],
        ['Novice', 'A monk in training who has not yet taken final vows'], ['Monastery', 'A religious community where monks lived, prayed and worked'],
        ['Refectory', 'The dining hall in a monastery'], ['Cloister', 'Covered walkway in a monastery used for prayer and study'],
        ['Black Death', 'Bubonic plague that killed 30–60% of Europe’s population (1347–1353)']]) },
      renaissance: { label: 'Renaissance', cards: cards([
        ['Renaissance', '“Rebirth”: a period of cultural renewal (c.1300–1600) that began in Italy'],
        ['Patronage', 'Financial support given to artists by wealthy people'], ['Medici family', 'Wealthy Florentine bankers who were patrons of artists'],
        ['Perspective', 'Technique that creates the illusion of depth and distance'], ['Realism', 'Painting people and nature as they really look'],
        ['Leonardo da Vinci', 'Painted the Mona Lisa and The Last Supper; also a scientist and inventor'],
        ['Michelangelo', 'Sculpted the statue of David; painted the Sistine Chapel ceiling'],
        ['St Peter’s Basilica', 'Renaissance building in Rome, famous for its great dome'],
        ['Andreas Vesalius', 'Wrote On the Fabric of the Human Body, an accurate anatomy based on dissection'],
        ['William Harvey', 'Discovered that the heart pumps blood around the body'], ['Ambroise Paré', 'Used ligatures instead of hot oil to treat wounds'],
        ['Galileo Galilei', 'Used experiments and an improved telescope; supported the sun-centred model'],
        ['Printing press', 'Invented by Johannes Gutenberg c.1440; spread ideas quickly'],
        ['Nicolaus Copernicus', 'Proposed that the sun is at the centre of the solar system'], ['Johannes Kepler', 'Showed that planets move in elliptical orbits']]) },
      exploration: { label: 'Age of Exploration', cards: cards([
        ['Age of Exploration', '1400s–1500s: Europeans explored sea routes to Asia and the Americas'], ['The 3 Gs', 'Gold, Glory, God: the main motives for exploring'],
        ['Log and line', 'Device used to measure a ship’s speed'], ['Astrolabe', 'Instrument used to measure the angle of the sun or stars'],
        ['Portolan charts', 'Detailed sea maps used by sailors'], ['Vasco da Gama', 'Portuguese explorer, first European to reach India by sea (1498)'],
        ['Christopher Columbus', 'Reached the Caribbean on 12 October 1492, sailing west for Spain'],
        ['Treaty of Tordesillas', '1494: divided new lands between Spain (west) and Portugal (east)'],
        ['Hernán Cortés', 'Spanish conquistador who conquered the Aztecs (1521)'], ['Tenochtitlán', 'Capital of the Aztec Empire, destroyed by Cortés'],
        ['Francisco Pizarro', 'Conquered the Incas of Peru and executed Atahualpa'], ['Atlantic slave trade', 'About 12.5 million Africans were enslaved and shipped to the Americas'],
        ['Columbian Exchange', 'Transfer of plants, animals and diseases between continents'],
        ['Impact on native peoples', 'Around 90% died, mostly from European diseases']]) }
    },
    quizzes: {
      historian: { label: 'Historian & archaeologist', questions: [
        { q: 'What is the study of the past using sources called?', ans: ['History'] },
        { q: 'What is the period before writing was invented called?', ans: ['Prehistory'] },
        { q: 'A diary written at the time of an event is what type of source?', ans: ['Primary source'] },
        { q: 'A textbook written about a past event is what type of source?', ans: ['Secondary source'] },
        { q: 'What is a place where sources are kept, like an archive, called?', ans: ['A repository'] },
        { q: 'Using several sources to check information is called what?', ans: ['Cross-checking'] },
        { q: 'Which dating method uses carbon-14?', ans: ['Radiocarbon dating'] },
        { q: 'What is arranging events in time order called?', ans: ['Chronology'] }
      ] },
      middleAges: { label: 'The Middle Ages', questions: [
        { q: 'What was the social hierarchy of the Middle Ages called?', ans: ['The feudal system'] },
        { q: 'What were the stages of becoming a knight, in order?', ans: ['Page, squire, knight'], opts: ['Squire, page, knight', 'Page, knight, squire', 'Novice, squire, knight'] },
        { q: 'What was the knights’ code of conduct called?', ans: ['Chivalry'] },
        { q: 'Which siege weapon hurled boulders at castle walls?', ans: ['Trebuchet'] },
        { q: 'What was the first stage of becoming a craftsman?', ans: ['Apprentice'] },
        { q: 'What was the highest rank a craftsman could reach?', ans: ['Master'] },
        { q: 'Which disease killed 30–60% of Europe’s population from 1347?', ans: ['The Black Death'] },
        { q: 'What was the dining hall of a monastery called?', ans: ['Refectory'] },
        { q: 'Which three vows did a monk take?', ans: ['Poverty, chastity and obedience'], opts: ['Poverty, silence and prayer', 'Chastity, charity and work', 'Obedience, fasting and prayer'] }
      ] },
      renaissance: { label: 'The Renaissance', questions: [
        { q: 'What does “Renaissance” mean?', ans: ['Rebirth'] },
        { q: 'In which country did the Renaissance begin?', ans: ['Italy'], opts: ['France', 'Spain', 'Germany'] },
        { q: 'Which family were famous patrons in Florence?', ans: ['The Medici'] },
        { q: 'Who painted the Mona Lisa?', ans: ['Leonardo da Vinci'] },
        { q: 'Who sculpted the statue of David?', ans: ['Michelangelo'] },
        { q: 'Who first proposed that the sun is at the centre of the solar system?', ans: ['Copernicus'] },
        { q: 'Who invented the printing press around 1440?', ans: ['Gutenberg'] },
        { q: 'Who discovered that the heart pumps blood around the body?', ans: ['William Harvey'] },
        { q: 'Which technique creates the illusion of depth in a painting?', ans: ['Perspective'] }
      ] },
      exploration: { label: 'Age of Exploration', questions: [
        { q: 'What were the three main motives for exploration?', ans: ['Gold, Glory, God'], opts: ['Gold, Glory, Grain', 'God, Guns, Gold', 'Glory, Goods, Grain'] },
        { q: 'Who was the first European to reach India by sea?', ans: ['Vasco da Gama'] },
        { q: 'When did Columbus reach the Caribbean?', ans: ['12 October 1492'], opts: ['12 October 1498', '4 July 1492', '12 October 1519'] },
        { q: 'What did the Treaty of Tordesillas (1494) do?', ans: ['Divided new lands between Spain and Portugal'] },
        { q: 'Which conquistador conquered the Aztec Empire?', ans: ['Hernán Cortés'] },
        { q: 'Which conquistador conquered the Incas of Peru?', ans: ['Francisco Pizarro'] },
        { q: 'About how many Africans were enslaved in the Atlantic slave trade?', ans: ['12.5 million'], opts: ['1 million', '50 million', '500,000'] },
        { q: 'What was the Columbian Exchange?', ans: ['Transfer of plants, animals and diseases between continents'] }
      ] }
    },
    matches: {
      historian: { label: 'History terms', colL: 'Term', colR: 'Meaning', pairs: [
        { left: 'History', right: 'Study of the past' }, { left: 'Prehistory', right: 'Before writing was invented' }, { left: 'Primary source', right: 'Evidence from the time' },
        { left: 'Repository', right: 'Archive or museum' }, { left: 'Cross-checking', right: 'Using several sources' }, { left: 'Chronology', right: 'Events in time order' }] },
      middleAges: { label: 'Medieval roles', colL: 'Stage / role', colR: 'Description', pairs: [
        { left: 'Page', right: 'Age 7–14, served a lord' }, { left: 'Squire', right: 'Age 14–21, weapons training' }, { left: 'Dubbing', right: 'Ceremony to become a knight' },
        { left: 'Apprentice', right: 'Learning a craft' }, { left: 'Journeyman', right: 'Qualified, not yet a master' }, { left: 'Novice', right: 'Monk in training' }] },
      renaissance: { label: 'Renaissance figures', colL: 'Person', colR: 'Known for', pairs: [
        { left: 'Leonardo da Vinci', right: 'Mona Lisa' }, { left: 'Michelangelo', right: 'Statue of David' }, { left: 'Gutenberg', right: 'Printing press' },
        { left: 'Copernicus', right: 'Sun-centred model' }, { left: 'Galileo', right: 'Improved telescope' }, { left: 'William Harvey', right: 'Circulation of blood' }] },
      exploration: { label: 'Explorers & events', colL: 'Explorer / event', colR: 'What happened', pairs: [
        { left: 'Vasco da Gama', right: 'First to reach India by sea' }, { left: 'Columbus', right: 'Reached the Caribbean in 1492' }, { left: 'Cortés', right: 'Conquered the Aztecs' },
        { left: 'Pizarro', right: 'Conquered the Incas' }, { left: 'Treaty of Tordesillas', right: 'Spain west, Portugal east' }, { left: 'Columbian Exchange', right: 'Goods and diseases crossed continents' }] }
    },
    timelines: {
      medieval: { label: 'Medieval & Renaissance dates', nodes: [
        { year: 1066, event: 'Battle of Hastings' }, { year: 1215, event: 'Magna Carta signed' }, { year: 1347, event: 'Black Death reaches Europe' },
        { year: 1440, event: 'Gutenberg’s printing press' }, { year: 1492, event: 'Columbus reaches the Caribbean' }] },
      voyages: { label: 'Voyages of exploration', nodes: [
        { year: 1488, event: 'Dias rounds the Cape of Good Hope' }, { year: 1492, event: 'Columbus reaches the Caribbean' }, { year: 1494, event: 'Treaty of Tordesillas' },
        { year: 1498, event: 'Vasco da Gama reaches India' }, { year: 1519, event: 'Cortés begins the Aztec conquest' }, { year: 1532, event: 'Pizarro begins the Inca conquest' }] }
    },
    practice: {
      historian: { label: 'Historian & archaeologist', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The study of the past using sources is called ___.', ans: ['history'] }, { q: 'The period before writing was invented is called ___.', ans: ['prehistory'] },
        { q: 'A diary written at the time of an event is a ___ source.', h: 'Evidence from the time', ans: ['primary'] },
        { q: 'A place like an archive or museum where sources are kept is a ___.', ans: ['repository'] },
        { q: 'Checking information against several sources is called ___.', ans: ['cross-checking', 'cross checking'] },
        { q: 'Arranging events in time order is called ___.', ans: ['chronology'] },
        { q: 'Using carbon-14 to date once-living material is called ___ dating.', ans: ['radiocarbon'] },
        { q: 'Protecting artefacts from decay is called ___.', ans: ['conservation'] }] },
      middleAges: { label: 'The Middle Ages', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The social hierarchy of the Middle Ages was the ___ system.', ans: ['feudal'] }, { q: 'Land granted by a lord to a knight was a ___.', ans: ['fief'] },
        { q: 'The knights’ code of conduct was called ___.', ans: ['chivalry'] }, { q: 'The stages of knighthood were page, ___, knight.', ans: ['squire'] },
        { q: 'The ceremony where a squire became a knight was called ___.', ans: ['dubbing'] }, { q: 'The first stage of becoming a craftsman was an ___.', ans: ['apprentice'] },
        { q: 'The dining hall in a monastery was the ___.', ans: ['refectory'] }, { q: 'The Black Death killed about 30 to ___% of Europe’s population.', ans: ['60', '60%'] }] },
      renaissance: { label: 'The Renaissance', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Renaissance means ___.', ans: ['rebirth'] }, { q: 'The ___ family were famous patrons in Florence.', ans: ['Medici'] },
        { q: '___ painted the Mona Lisa.', ans: ['Leonardo da Vinci', 'Leonardo'] }, { q: '___ sculpted the statue of David.', ans: ['Michelangelo'] },
        { q: '___ proposed that the sun is at the centre of the solar system.', ans: ['Copernicus', 'Nicolaus Copernicus'] },
        { q: 'The printing press was invented by ___ around 1440.', ans: ['Gutenberg', 'Johannes Gutenberg'] },
        { q: '___ discovered that the heart pumps blood around the body.', ans: ['William Harvey', 'Harvey'] },
        { q: '___ used ligatures instead of hot oil to treat wounds.', h: 'French surgeon', ans: ['Paré', 'Ambroise Paré'] }] },
      exploration: { label: 'Age of Exploration', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The 3 Gs were gold, ___ and God.', ans: ['glory'] }, { q: '___ was the first European to reach India by sea, in 1498.', ans: ['Vasco da Gama'] },
        { q: 'Columbus reached the Caribbean on 12 October ___.', ans: ['1492'] },
        { q: 'The ___ divided new lands between Spain and Portugal.', h: 'Signed in 1494', ans: ['Treaty of Tordesillas'] },
        { q: '___ conquered the Aztec Empire.', ans: ['Hernán Cortés', 'Cortés'] }, { q: '___ conquered the Incas of Peru.', ans: ['Francisco Pizarro', 'Pizarro'] },
        { q: 'The ___ Exchange moved goods and diseases between continents.', ans: ['Columbian'] },
        { q: 'About ___ million Africans were enslaved in the Atlantic slave trade.', ans: ['12.5'] }] }
    }
  };

  /* ════════════════════════════════════════════════════════════
     2nd YEAR — November exam: the Reformation, the Plantation of
     Ulster, the American Revolution (from the class revision list).
  ════════════════════════════════════════════════════════════ */
  var y2 = {
    blurb: 'History — November exam revision',
    exam: '<b>November exam:</b> the Reformation, the Plantation of Ulster and the American Revolution. Know the answers to every question on the class revision list.',
    store: 'sn_history_y2',
    score: 'history_y2',
    /* Exam bank: Junior Cycle style questions with marking schemes. */
    examq: [
      { id: 'hi-ref-3', topic: 'reformation', src: 'Exam style', type: 'group', q: 'Causes and consequences of the Reformation.', parts: [
        { type: 'written', q: 'What is meant by the term ‘Reformation’?', marks: 3, lines: 2,
          scheme: ['A movement in 16th-century Europe to reform the Catholic Church, which led to a split and new Protestant churches (3 marks)'],
          model: 'The Reformation was a movement in the 1500s that tried to reform the Catholic Church and ended with Christianity splitting into Catholic and Protestant churches.' },
        { type: 'mcq', q: 'The sale of indulgences was a…', ans: 'Cause of the Reformation', opts: ['Consequence of the Reformation'], marks: 2 },
        { type: 'mcq', q: 'The Council of Trent was a…', ans: 'Consequence of the Reformation', opts: ['Cause of the Reformation'], marks: 2 },
        { type: 'written', q: 'Explain the difference between a cause and a consequence of a historical event.', marks: 4, lines: 2,
          scheme: ['Cause: a reason why something happened (2 marks)', 'Consequence: a result or effect of what happened (2 marks)'],
          model: 'A cause is a reason why an event happened; a consequence is something that happened as a result of it.' }] },
      { id: 'hi-ref-4', topic: 'reformation', src: 'Exam style', type: 'written', marks: 12, lines: 8,
        q: 'Name a religious reformer you studied. State three of his religious beliefs and explain three actions he took to bring about religious change.',
        scheme: ['Three beliefs, e.g. salvation by faith alone / the Bible as the only authority / two sacraments (baptism and communion) / services in the vernacular / clergy may marry / the Pope has no special authority (2 marks each)', 'Three actions, e.g. posted the 95 Theses (1517) / translated the Bible into German / refused to recant at the Diet of Worms (1521) / wrote pamphlets spread by printing / set up the Lutheran Church / married a former nun (2 marks each)'],
        model: 'Martin Luther believed in salvation by faith alone, that the Bible was the only source of authority, and that there were only two sacraments. He posted his 95 Theses in Wittenberg in 1517, refused to take back his views at the Diet of Worms in 1521, and translated the Bible into German so ordinary people could read it.' },
      { id: 'hi-pl-3', topic: 'plantation', src: 'Exam style', type: 'group', q: 'The Plantation of Ulster.', parts: [
        { type: 'short', q: 'Which English king ordered the Plantation of Ulster?', ans: ['James I', 'King James I', 'James the First', 'James'], marks: 2 },
        { type: 'short', q: 'In what year did the plantation begin?', ans: ['1609'], marks: 2 },
        { type: 'written', q: 'What were the undertakers required to do?', marks: 4, lines: 3,
          scheme: ['Build a castle / stone house and a bawn (walled enclosure) for defence (2 marks)', 'Bring English or Scottish Protestant tenants; no Irish tenants (2 marks)'],
          model: 'Undertakers had to build a bawn and a stone house or castle for defence, and bring over English or Scottish Protestant tenants instead of renting to the Irish.' }] },
      { id: 'hi-pl-4', topic: 'plantation', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Describe two ways the Plantation of Ulster changed Ireland.',
        scheme: ['Any two developed points, e.g. a large Protestant population in Ulster / new planned towns with a diamond (square), e.g. Derry / Coleraine / English language and law spread / Irish lost their land / lasting religious and political divisions, e.g. 1641 rising / new farming methods (3 marks each)'],
        model: 'Thousands of English and Scottish Protestants settled in Ulster, so it became different in religion from the rest of Ireland, a division that lasted for centuries. New planned towns such as Derry were built around a central square called the diamond.' },
      { id: 'hi-am-3', topic: 'america', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Explain three causes of the American Revolution.',
        scheme: ['Taxation without representation, e.g. the Stamp Act / Townshend Acts / Tea Act (2 marks)', 'Events that raised tension, e.g. the Boston Massacre (1770) / the Boston Tea Party (1773) / the Intolerable Acts (2 marks)', 'Other cause, e.g. Enlightenment ideas of liberty / soldiers quartered in homes / restrictions on settling west (2 marks)'],
        model: 'Britain taxed the colonists through acts like the Stamp Act although they had no MPs in parliament. The Boston Massacre in 1770 turned many colonists against British soldiers. Enlightenment ideas made people believe they had a right to govern themselves.' },
      { id: 'hi-am-4', topic: 'america', src: 'Exam style', type: 'group', q: 'The American War of Independence.', parts: [
        { type: 'short', q: 'Who commanded the Continental Army?', ans: ['George Washington', 'Washington'], marks: 2 },
        { type: 'short', q: 'In what year was the Declaration of Independence signed?', ans: ['1776'], marks: 2 },
        { type: 'written', q: 'Do you think the revolution had a positive or a negative impact on America? Give reasons.', marks: 6, lines: 4,
          scheme: ['A clear view (2 marks)', 'Two developed reasons, e.g. independence and a democratic republic with a constitution / rights for some but not enslaved people or Native Americans / deaths and destruction of war (2 marks each)'],
          model: 'Mostly positive. America became an independent republic with a constitution and an elected president, an example to other countries. But enslaved people and Native Americans did not get the same rights.' }] },
      { id: 'hi-ref-1', topic: 'reformation', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Give three reasons why Martin Luther criticised the Catholic Church.',
        scheme: ['Selling of indulgences (e.g. by Johann Tetzel) (2 marks)', 'Wealth / corruption of the clergy, simony, nepotism or pluralism (2 marks)', 'Belief in salvation by faith alone / the Bible as the only authority (2 marks)'],
        model: 'He objected to the sale of indulgences by Johann Tetzel, to corruption among the clergy (simony, nepotism, absenteeism), and he believed people were saved by faith alone, with the Bible as the only authority.' },
      { id: 'hi-ref-2', topic: 'reformation', src: 'Exam style', type: 'group', q: 'The Reformation.', parts: [
        { type: 'short', q: 'In what year did Luther post his 95 Theses?', ans: ['1517'], marks: 2 },
        { type: 'short', q: 'Which invention helped Luther’s ideas spread quickly?', ans: ['the printing press', 'printing press', 'printing'], marks: 2 },
        { type: 'written', q: 'What was the Counter-Reformation? Give two examples of it.', marks: 6, lines: 4,
          scheme: ['The Catholic Church’s response / reform to stop the spread of Protestantism (2 marks)', 'Council of Trent (2 marks)', 'Jesuits (Society of Jesus), Index of Forbidden Books or the Inquisition (2 marks)'],
          model: 'The Catholic Church’s reform movement to stop Protestantism spreading. Examples: the Council of Trent, the Jesuits founded by Ignatius Loyola, the Index of Forbidden Books.' }] },
      { id: 'hi-pl-1', topic: 'plantation', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Explain two reasons why the English government planted Ulster.',
        scheme: ['Flight of the Earls (1607) left land free / confiscated (2 marks)', 'To stop rebellion / make Ulster loyal and secure (2 marks)', 'Spread Protestantism, English language and customs, or make money (2 marks)'],
        model: 'After the Flight of the Earls in 1607 the lords’ lands were confiscated. The government wanted loyal Protestant English and Scottish settlers to stop future rebellions and to spread English customs, language and the Protestant religion.' },
      { id: 'hi-pl-2', topic: 'plantation', src: 'Exam style', type: 'group', q: 'The Plantation of Ulster.', parts: [
        { type: 'short', q: 'Name the planters who received land and had to bring English or Scottish tenants.', ans: ['undertakers', 'the undertakers'], marks: 2 },
        { type: 'short', q: 'Which group of planters were former soldiers who could have Irish tenants?', ans: ['servitors', 'the servitors'], marks: 2 },
        { type: 'written', q: 'Describe two long-term results of the Plantation of Ulster.', marks: 6, lines: 4,
          scheme: ['A large Protestant population / religious division in Ulster (2 marks)', 'New towns built (e.g. Derry/Londonderry, Coleraine) or new farming methods (2 marks)', 'Conflict / resentment between planters and native Irish, e.g. the 1641 rebellion (2 marks)'],
          model: 'Ulster gained a large Protestant population, which led to religious division that lasts to today. Planned towns such as Derry were built. The native Irish resented losing their land, which led to conflict such as the 1641 rebellion.' }] },
      { id: 'hi-am-1', topic: 'america', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Give two causes of the American Revolution.',
        scheme: ['Taxes passed by the British Parliament, e.g. Stamp Act, Townshend Acts, tea tax (3 marks)', '“No taxation without representation”: colonists had no MPs in Parliament (3 marks)'],
        model: 'Britain taxed the colonies with acts like the Stamp Act and the tax on tea, and the colonists objected because they had no representation in Parliament: “no taxation without representation”.' },
      { id: 'hi-am-2', topic: 'america', src: 'Exam style', type: 'group', q: 'The American Revolution.', parts: [
        { type: 'short', q: 'In what year was the Declaration of Independence signed?', ans: ['1776'], marks: 2 },
        { type: 'short', q: 'Who was the commander of the American (Continental) army?', ans: ['George Washington', 'Washington'], marks: 2 },
        { type: 'written', q: 'What happened at the Boston Tea Party (1773)?', marks: 4, lines: 3,
          scheme: ['Colonists (dressed as Mohawks) boarded British ships in Boston harbour (2 marks)', 'Threw the tea overboard in protest at the tax on tea (2 marks)'],
          model: 'Colonists dressed as Mohawk Indians boarded ships in Boston harbour and dumped the tea into the sea to protest against the tax on tea.' }] }
    ],
    /* The November exam run-through (course.js), built from the "November Exams topics" post in the History team:
       every question on the teacher's revision list, the Plantation causes / course / consequences homework and the four battles. */
    courses: {
      nov: { label: 'November exam run-through', intro: 'Every question on your teacher’s revision list, topic by topic. Type your answer to each one and it’s checked; any you miss come back. Then do the quick check. Exam: 12:00 to 13:00.',
        sections: [
          { id: 'ref', h: 'The Reformation', p: 'The 17 questions on the revision list.', drills: [
            { id: 'refList', label: 'Reformation: revision list', topic: 'reformation', items: [
              { need: 2, keys: [['christian', 'christianity', 'catholic', 'catholicism', 'catholics'], ['islam', 'muslim', 'muslims', 'orthodox']], q: 'What were the 2 main religions in Europe around 1500?', a: '<b>Christianity and Islam.</b> Most of Europe was Christian: <b>Catholic</b> in the west (led by the Pope) and <b>Orthodox</b> in the east. Islam was the religion of the Ottoman Empire in the south-east.' },
              { need: 2, keys: [['reform', 'reformed', 'reforming', 'change', 'changed', 'protest', 'protested'], ['church', 'catholic', 'catholics', 'pope'], ['protestant', 'protestants', 'broke away', 'split', 'new churches']], q: 'What was the Reformation?', a: 'A movement in the 1500s to <b>reform the Catholic Church</b>. It led to new <b>Protestant</b> churches breaking away from Rome.' },
              { need: 2, keys: [['simony'], ['pluralism'], ['absenteeism'], ['nepotism'], ['indulgence', 'indulgences'], ['uneducated', 'poorly educated', 'badly educated', 'not educated', 'illiterate']], q: 'Name 2 abuses in the Catholic Church at the time of the Reformation.', a: 'Any two: <b>simony</b> (buying and selling Church jobs), <b>pluralism</b> (holding several Church jobs at once), <b>absenteeism</b> (bishops not living in their dioceses), <b>nepotism</b> (giving jobs to relatives), poorly educated priests, the <b>sale of indulgences</b>.' },
              { need: 2, keys: [['faith', 'believe', 'belief', 'believing'], ['saved', 'heaven', 'salvation', 'forgiven', 'forgiveness', 'justified']], q: 'What does “justification by faith alone” mean?', a: 'People are saved (get to heaven) by their <b>faith in God</b> alone, not by good works or by buying indulgences.' },
              { need: 2, keys: [['buy', 'bought', 'pay', 'paid', 'money', 'sold', 'sell', 'selling', 'purchase'], ['forgiveness', 'forgive', 'forgiven', 'sins', 'sin', 'heaven', 'salvation', 'purgatory']], q: 'Why did Luther oppose the sale of indulgences?', a: 'They suggested people could <b>buy forgiveness for their sins</b>. Johann <b>Tetzel</b> sold them to raise money to rebuild <b>St Peter’s</b> in Rome.' },
              { need: 2, keys: [['95', 'ninety five', 'arguments', 'list', 'points', 'complaints', 'theses'], ['indulgence', 'indulgences', 'abuses', 'church'], ['wittenberg', 'door', 'nailed']], q: 'What were Luther’s 95 Theses?', a: 'A list of <b>95 arguments against indulgences</b> and Church abuses, which Luther nailed to the church door in <b>Wittenberg</b> in <b>1517</b>.' },
              { need: 1, keys: [['eck']], q: 'Who did Luther debate his ideas with?', a: '<b>Johann Eck</b>, at <b>Leipzig</b> in 1519.' },
              { need: 1, keys: [['bull']], q: 'What name is given to the letter the Pope sent Luther warning him to recant?', a: 'A <b>papal bull</b> (1520). Luther burned it in public.' },
              { need: 1, keys: [['outlaw', 'outlawed', 'criminal', 'arrested', 'arrest'], ['banned', 'ban', 'writings', 'books']], q: 'What did the Edict of Worms say?', a: 'It declared Luther an <b>outlaw</b> (1521) and <b>banned his writings</b>.' },
              { need: 1, keys: [['printing', 'press', 'printed', 'print'], ['princes', 'prince', 'nobles', 'frederick']], q: 'How did Luther’s ideas spread so quickly?', a: 'The <b>printing press</b> (pamphlets and his Bible were printed quickly and cheaply) and the support of <b>German princes</b>.' },
              { need: 2, keys: [['translated', 'translate', 'translation', 'translating'], ['bible', 'testament']], q: 'What did Luther do at Wartburg Castle?', a: 'He hid there, protected by Frederick the Wise, and <b>translated the New Testament into German</b>.' },
              { need: 1, keys: [['katharina', 'katherine', 'katharine', 'catherine', 'katarina', 'bora']], q: 'Who did Luther marry?', a: '<b>Katharina von Bora</b>, a former nun.' },
              { need: 2, keys: [['faith'], ['bible', 'scripture'], ['sacraments', 'baptism', 'eucharist', 'communion'], ['german', 'own language', 'vernacular', 'language'], ['marry', 'married', 'marriage']], q: 'List 2 of the ideas of Luther’s religion.', a: 'Any two: <b>faith alone</b> saves you; the <b>Bible is the only authority</b>; only <b>two sacraments</b> (baptism and the Eucharist); services in the <b>people’s own language</b> (German); <b>priests could marry</b>.' },
              { need: 2, keys: [['prince', 'princes', 'ruler', 'rulers', 'king', 'kings', 'leader'], ['religion', 'choose', 'chose', 'decide', 'catholic', 'lutheran', 'pick']], q: 'What did the Peace of Augsburg state?', a: 'In <b>1555</b>: each German <b>prince could choose the religion</b> of his state (Catholic or Lutheran), and his people had to follow it.' },
              { need: 1, keys: [['counter reformation'], ['trent', 'council'], ['jesuit', 'jesuits'], ['inquisition'], ['index']], q: 'What was the Catholic response to the Reformation?', a: 'The <b>Counter-Reformation</b>: the <b>Council of Trent</b> (1545–63) reformed abuses and restated Catholic teaching; the <b>Jesuits</b> were set up; the <b>Inquisition</b>; the <b>Index</b> of forbidden books.' },
              { need: 1, keys: [['ignatius', 'loyola']], q: 'Who set up the Jesuits?', a: '<b>Ignatius of Loyola</b> (1540). They set up schools and sent out missionaries.' },
              { need: 2, keys: [['court', 'courts', 'trial', 'trials', 'tried', 'punished', 'tortured'], ['heresy', 'heretics', 'heretic', 'heresies', 'protestants', 'against the church']], q: 'What was the Inquisition?', a: '<b>Church courts</b> that tried people accused of <b>heresy</b> (beliefs against Church teaching).' }] }],
            checks: [{ id: 'refQ', label: 'Reformation: quick check', quiz: 'reformation', topic: 'reformation' }] },
          { id: 'pla', h: 'The Plantation of Ulster', p: 'The 13 questions on the revision list, then causes, course and consequences.', drills: [
            { id: 'plaList', label: 'Plantation: revision list', topic: 'plantation', items: [
              { need: 1, keys: [['pale']], q: 'What name was given to the part of Ireland that was loyal to the King?', a: '<b>The Pale</b> (the area around Dublin).' },
              { need: 2, keys: [['laois', 'leix', 'queens'], ['offaly', 'kings']], q: 'Where was the first plantation carried out?', a: '<b>Laois and Offaly</b> (1550s, under Mary I).' },
              { need: 2, keys: [['earls', 'earl', 'o neill', 'oneill', 'o donnell', 'odonnell', 'tyrone', 'tyrconnell'], ['fled', 'flight', 'left', 'escaped', 'flee', 'europe', 'spain', 'rome', 'continent', 'ran away']], q: 'What was the Flight of the Earls?', a: 'In <b>1607</b> the Earls of <b>Tyrone (Hugh O’Neill)</b> and <b>Tyrconnell (Rory O’Donnell)</b> fled to Europe after losing the Nine Years’ War. Their lands were confiscated, which made the plantation possible.' },
              { need: 1, keys: [['james']], q: 'What monarch carried out the Ulster Plantation?', a: '<b>King James I</b> (from 1609).' },
              { need: 6, keys: [['donegal'], ['derry', 'coleraine', 'londonderry'], ['tyrone'], ['armagh'], ['fermanagh'], ['cavan']], q: 'Name the 6 counties that were planted.', a: '<b>Donegal, Coleraine (Derry), Tyrone, Armagh, Fermanagh and Cavan.</b>' },
              { need: 2, keys: [['montgomery'], ['hamilton']], q: 'Who carried out the private plantation in Ulster?', a: 'Two Scots, <b>Hugh Montgomery and James Hamilton</b>, in <b>Antrim and Down</b>.' },
              { need: 1, keys: [['2000', 'two thousand']], q: 'What size were the estates in Ulster capped at?', a: '<b>2,000 acres</b> (estates were 1,000, 1,500 or 2,000 acres).' },
              { need: 2, keys: [['undertaker', 'undertakers'], ['servitor', 'servitors'], ['deserving irish', 'deserving', 'loyal irish']], q: 'Name 2 groups of people that were given land in Ulster.', a: 'Any two: <b>undertakers</b> (English and Scottish settlers who had to bring Protestant tenants), <b>servitors</b> (soldiers and officials who served the Crown), <b>deserving Irish</b> (Irish loyal to the Crown).' },
              { need: 1, keys: [['wall', 'walled', 'walls', 'enclosure', 'fortified', 'fence']], q: 'What was a bawn?', a: 'A <b>walled enclosure</b> built around a planter’s house for <b>defence</b>.' },
              { need: 1, keys: [['london', 'guilds', 'companies']], q: 'Who helped with the plantation of Derry?', a: 'The <b>London companies</b> (guilds of the City of London). Derry was renamed <b>Londonderry</b>.' },
              { need: 2, keys: [['derry', 'londonderry'], ['coleraine'], ['enniskillen'], ['cavan'], ['strabane'], ['dungannon'], ['virginia'], ['lifford'], ['limavady'], ['omagh']], q: 'Name 2 towns that were built during the Ulster Plantation.', a: 'Any two: <b>Derry (Londonderry), Coleraine, Enniskillen, Cavan, Strabane</b>.' },
              { need: 2, keys: [['diamond', 'square'], ['wide streets', 'wide', 'straight'], ['walls', 'wall', 'walled'], ['market', 'markets'], ['church', 'churches']], q: 'Name 2 features of plantation towns.', a: 'Any two: a central square called the <b>Diamond</b>, <b>wide streets</b>, <b>town walls</b>, a <b>market</b>, a <b>Protestant church</b>.' },
              { need: 1, keys: [['enclosed', 'fences', 'fenced', 'hedges', 'enclosure'], ['tillage', 'crops', 'crop', 'wheat', 'plough', 'ploughing', 'grew'], ['money', 'cash', 'sold', 'sell'], ['booleying', 'cattle', 'cows', 'herding']], q: 'List 1 way in which plantation farming methods differed from those of the Gaelic Irish.', a: 'Planters used <b>enclosed fields</b>, grew <b>crops (tillage)</b> and sold for money; the Gaelic Irish practised <b>booleying</b> (moving cattle to summer pastures) and measured wealth in <b>cattle</b>.' }] },
            { id: 'plaCcc', label: 'Plantation: causes, course and consequences', topic: 'plantation', items: [
              { need: 3, keys: [['control', 'loyal', 'loyalty', 'rebel', 'rebels', 'rebellion', 'rebellions', 'nine years'], ['protestant', 'protestantism', 'religion'], ['language', 'law', 'laws', 'culture'], ['spain', 'spanish', 'invade', 'invasion', 'attack', 'back door'], ['flight', 'earls', 'confiscated']], q: '<b>Causes:</b> why did the English want to plant Ulster? Give as many as you can (aim for 5).', a: 'To <b>control</b> Ireland and make it <b>loyal</b>; to spread the <b>Protestant</b> religion; to spread the <b>English language and law</b>; to stop Spain using Ireland to <b>attack England</b>; the <b>Flight of the Earls</b> (1607) left their lands free to confiscate; Ulster was the most <b>Gaelic and rebellious</b> province (the Nine Years’ War).' },
              { need: 3, keys: [['james'], ['1609'], ['six counties', '6 counties', 'counties'], ['acres', 'estates', 'estate', '2000'], ['undertaker', 'undertakers', 'servitor', 'servitors', 'deserving'], ['bawn', 'bawns'], ['london'], ['montgomery', 'hamilton', 'private', 'antrim'], ['tenants', 'settlers', 'planters', 'scottish', 'scots']], q: '<b>Course:</b> how was the plantation carried out? Aim for 5 points.', a: '<b>James I</b> from <b>1609</b>; <b>six counties</b> planted; land split into estates of <b>1,000–2,000 acres</b>; given to <b>undertakers, servitors and deserving Irish</b>; undertakers had to bring <b>Protestant tenants</b> and build a <b>bawn</b>; the <b>London companies</b> planted Derry; Antrim and Down planted <b>privately</b> by Montgomery and Hamilton.' },
              { need: 3, keys: [['towns', 'town', 'diamond'], ['farming', 'tillage', 'enclosed', 'fields'], ['language', 'law', 'laws'], ['protestant', 'protestants', 'religion', 'presbyterian'], ['poorer land', 'moved', 'driven', 'lost land', 'lost their land', 'bad land'], ['two communities', 'division', 'divided', 'conflict', 'troubles', 'northern ireland', 'sectarian', 'tension']], q: '<b>Consequences:</b> what were the results? Aim for 5 points.', a: '<b>New towns</b> with a Diamond, walls and a market; <b>new farming</b> (enclosed fields, tillage); <b>English law and language</b> spread; the <b>Protestant</b> religion spread; many native Irish were <b>moved to poorer land</b>; <b>two communities</b> with different religions and identities, the roots of later conflict in Northern Ireland.' }] }],
            checks: [{ id: 'plaQ', label: 'Plantation: quick check', quiz: 'plantation', topic: 'plantation' }] },
          { id: 'am', h: 'The American Revolution', p: 'The 15 questions on the revision list, then the four key battles.', drills: [
            { id: 'amList', label: 'American Revolution: revision list', topic: 'america', items: [
              { need: 1, keys: [['13', 'thirteen']], q: 'How many colonies did English settlers establish in North America?', a: '<b>13</b> colonies, on the east coast.' },
              { need: 2, keys: [['trade', 'traded', 'goods', 'export', 'exports', 'imports', 'trading'], ['britain', 'british', 'england', 'english']], q: 'What were the Navigation Acts?', a: 'Laws saying colonial trade had to <b>go through Britain</b> and be carried in <b>British ships</b>.' },
              { need: 1, keys: [['protest', 'protested', 'protests', 'riot', 'riots', 'rioted'], ['attacked', 'attack', 'tarred', 'feathered', 'collectors'], ['boycott', 'boycotted', 'boycotts', 'boycotting']], q: 'What did the Sons of Liberty do after the introduction of the Stamp Act?', a: 'They <b>protested</b>, <b>attacked tax collectors</b> and organised <b>boycotts</b> of British goods. (The Stamp Act, 1765, was a tax on printed paper.)' },
              { need: 1, keys: [['no taxation without representation', 'taxation without representation']], q: 'What slogan is associated with American discontent over taxation?', a: '<b>“No taxation without representation”</b>: the colonists had no MPs in the British parliament.' },
              { need: 2, keys: [['tea'], ['harbour', 'harbor', 'sea', 'water', 'dumped', 'threw', 'thrown', 'destroyed', 'overboard', 'river']], q: 'What happened during the Boston Tea Party?', a: 'In <b>1773</b> the Sons of Liberty, dressed as Mohawks, dumped <b>342 chests of British tea</b> into Boston Harbour in protest at the Tea Act.' },
              { need: 2, keys: [['soldiers', 'british', 'troops', 'redcoats', 'army'], ['fired', 'shot', 'killed', 'shooting', 'kill', 'dead', 'died']], q: 'What was the Boston Massacre?', a: 'In <b>1770</b> British soldiers <b>fired on a crowd</b> in Boston, killing <b>five</b> colonists.' },
              { need: 1, keys: [['lexington', 'concord']], q: 'Where were the first shots of the American Revolution fired?', a: 'At <b>Lexington and Concord</b> (1775).' },
              { need: 1, keys: [['paine']], q: 'Who wrote Common Sense?', a: '<b>Thomas Paine</b> (1776). It argued for independence.' },
              { need: 1, keys: [['commander', 'chief', 'general', 'leader', 'head of the army']], q: 'What position was George Washington appointed to at the Second Continental Congress?', a: '<b>Commander-in-chief</b> of the Continental Army.' },
              { need: 1, keys: [['1776']], q: 'When was the Declaration of Independence adopted?', a: '<b>4 July 1776</b> (written mainly by Thomas Jefferson).' },
              { need: 2, keys: [['france', 'french'], ['spain', 'spanish'], ['dutch', 'netherlands', 'holland']], q: 'Name 2 countries that joined the war on the American side.', a: 'Any two: <b>France, Spain</b>, the <b>Dutch Republic</b>.' },
              { need: 1, keys: [['steuben']], q: 'Who trained the American troops at Valley Forge?', a: '<b>Baron von Steuben</b> (winter 1777–78).' },
              { need: 1, keys: [['paris']], q: 'What treaty recognised the independence of the former British colonies?', a: 'The <b>Treaty of Paris</b> (1783).' },
              { need: 1, keys: [['washington']], q: 'Who was the first president of the United States?', a: '<b>George Washington</b> (1789).' },
              { need: 2, keys: [['independent', 'independence', 'free', 'freedom'], ['republic', 'constitution', 'no king'], ['washington', 'president'], ['french revolution', 'inspired', 'other revolutions', '1798'], ['lost', 'colonies'], ['native', 'slaves', 'enslaved', 'slavery']], q: 'Give 2 results of the American Revolution.', a: 'Any two: the USA became <b>independent</b>; a <b>republic</b> with a new constitution and no king; Washington the first president; it <b>inspired other revolutions</b> (the French Revolution, the 1798 Rebellion in Ireland); Britain <b>lost its 13 colonies</b>; Native Americans and enslaved people gained little.' }] },
            { id: 'amBattles', label: 'The four key battles', topic: 'america', items: [
              { need: 2, keys: [['1775'], ['first shots', 'first', 'start', 'began', 'beginning', 'started'], ['colonists', 'colonial', 'minutemen', 'militia', 'americans', 'american', 'patriots']], q: '<b>Lexington and Concord</b>: when, who won, and why does it matter?', a: '<b>April 1775</b>, Massachusetts. British troops marched to seize colonial weapons; colonial militia (minutemen) forced them back to Boston. <b>The first shots of the Revolution</b>: the war had begun.' },
              { need: 2, keys: [['1775'], ['british', 'britain', 'redcoats'], ['losses', 'casualties', 'heavy', 'dead', 'lost many', 'killed']], q: '<b>Bunker Hill</b>: when, who won, and why does it matter?', a: '<b>June 1775</b>, near Boston. A <b>British victory</b>, but with <b>heavy British losses</b> (over 1,000 casualties). It showed the colonists could stand up to the British army.' },
              { need: 2, keys: [['1777'], ['american', 'americans', 'colonists', 'patriots'], ['france', 'french', 'turning point', 'turning'], ['burgoyne', 'surrender', 'surrendered']], q: '<b>Saratoga</b>: when, who won, and why does it matter?', a: '<b>1777</b>, New York. A major <b>American victory</b>: British general Burgoyne surrendered. <b>The turning point</b>: it persuaded <b>France</b> to join the war on the American side.' },
              { need: 2, keys: [['1781'], ['cornwallis'], ['surrender', 'surrendered'], ['last', 'end', 'ended', 'final'], ['french', 'france']], q: '<b>Yorktown</b>: when, who won, and why does it matter?', a: '<b>1781</b>, Virginia. Washington’s army and the <b>French</b> army and navy trapped the British; <b>Cornwallis surrendered</b>. The <b>last major battle</b>: it led to peace and the Treaty of Paris (1783).' }] }],
            checks: [{ id: 'amQ', label: 'American Revolution: quick check', quiz: 'america', topic: 'america' }] }
        ] }
    },
    topics: [
      { id: 'exam', info: true, label: 'The November exam', icon: 'target', desc: 'What’s on it, and a run-through of every question on the revision list', course: ['nov'], notes: ['examHist'] },
      { id: 'reformation', label: 'The Reformation', icon: 'cross', desc: 'Luther, the spread of Protestantism and the Catholic response',
        notes: ['reformation'], fc: ['reformation'], quiz: ['reformation'], match: ['reformation'], tl: ['reformation'], prac: ['reformation'] },
      { id: 'plantation', label: 'The Plantation of Ulster', icon: 'map', desc: 'Causes, course and consequences',
        notes: ['plantation'], fc: ['plantation'], quiz: ['plantation'], match: ['plantation'], tl: ['plantation'], prac: ['plantation'] },
      { id: 'america', label: 'The American Revolution', icon: 'flag', desc: 'From the 13 colonies to independence',
        notes: ['america'], fc: ['america'], quiz: ['america'], match: ['battles'], tl: ['america'], prac: ['america'] }
    ],
    notes: {
      examHist: { label: 'What’s on the exam', sections: [
        { h: 'Three topics', kv: [['The Reformation', 'Luther, his ideas and how they spread, and the Catholic response.'], ['The Plantation of Ulster', 'Causes, course and consequences.'],
          ['The American Revolution', 'Causes, the four key battles and the results.']], tip: 'Your teacher said: know the answers to every question on the revision list. The Run-through tab drills every one.' },
        { h: 'In the exam (12:00 to 13:00)', list: ['Read each question twice and underline the key words (name, explain, why).', 'Look at the marks: 2 marks usually means 2 points.',
          'For “explain” or “why” questions, give a fact and then say why it matters.', 'Use names, dates and places: Luther 1517, James I 1609, Declaration of Independence 1776.', 'Leave five minutes to read back over your answers.'] }
      ] },
      reformation: { label: 'The Reformation', sections: [
        { h: 'Background', list: ['Around 1500 Europe was mostly <b>Christian</b>: <b>Catholic</b> in the west (led by the Pope in Rome) and <b>Orthodox</b> in the east. <b>Islam</b> was the religion of the Ottoman Empire in the south-east. Check which pair your textbook uses for the “two main religions” question.',
          'The <b>Reformation</b> was the movement to reform the Catholic Church that led to new Protestant churches.',
          'Abuses in the Church: <b>simony</b> (buying and selling Church jobs), <b>pluralism</b> (holding several Church jobs at once), <b>absenteeism</b> (bishops not living in their dioceses), <b>nepotism</b> (giving jobs to relatives), poorly educated priests and the <b>sale of indulgences</b>.'] },
        { h: 'Martin Luther', kv: [['Who', 'A German monk and professor at the University of Wittenberg.'],
          ['Justification by faith alone', 'People are saved by their faith in God, not by good works or by buying indulgences.'],
          ['Indulgences', 'Luther opposed them because they suggested people could buy forgiveness for sins. Johann Tetzel sold them to raise money to rebuild St Peter’s in Rome.'],
          ['95 Theses (1517)', 'A list of 95 arguments against indulgences and abuses, nailed to the church door in Wittenberg.'],
          ['Debate', 'Luther debated <b>Johann Eck</b> at Leipzig in 1519.'],
          ['Papal bull', 'The Pope’s letter warning Luther to recant was a <b>papal bull</b> (<i>Exsurge Domine</i>, 1520). Luther burned it.'],
          ['Edict of Worms (1521)', 'Declared Luther an outlaw and banned his writings.'],
          ['Wartburg Castle', 'Protected by Frederick the Wise, Luther hid there and translated the New Testament into German.'],
          ['Marriage', 'Luther married <b>Katharina von Bora</b>, a former nun.'],
          ['Spread', 'His ideas spread quickly because of the <b>printing press</b> and support from German princes.']] },
        { h: 'Luther’s ideas (Lutheranism)', list: ['Faith alone saves you.', 'The Bible is the only authority, and it should be in the people’s own language.',
          'Only two sacraments: baptism and the Eucharist (Lord’s Supper).', 'Priests could marry; services were in German.'] },
        { h: 'Peace and the Catholic response', kv: [['Peace of Augsburg (1555)', 'Each German prince could choose the religion of his state, Catholic or Lutheran, and his people had to follow it.'],
          ['Counter-Reformation', 'The Catholic Church’s response: the <b>Council of Trent</b> (1545–1563) reformed abuses and restated Catholic teaching.'],
          ['Jesuits', 'Founded by <b>Ignatius of Loyola</b> (1540): set up schools and sent missionaries.'],
          ['Inquisition', 'Church courts that tried people accused of heresy (beliefs against Church teaching).'],
          ['Index of forbidden books', 'A list of books Catholics were banned from reading.']] }
      ] },
      plantation: { label: 'The Plantation of Ulster', sections: [
        { h: 'Causes', list: ['English monarchs wanted to <b>control Ireland</b>, make it loyal, Protestant and English-speaking, and stop it being used by Spain to attack England.',
          'The area around Dublin loyal to the king was called <b>the Pale</b>.',
          'Earlier plantations: the first was <b>Laois–Offaly</b> (1550s) under Mary I, then the <b>Munster Plantation</b> (1580s).',
          'After the Nine Years’ War, the earls of Tyrone (Hugh O’Neill) and Tyrconnell (Rory O’Donnell) fled to Europe in <b>1607</b>: the <b>Flight of the Earls</b>. Their lands were confiscated.'] },
        { h: 'Course', kv: [['Monarch', '<b>James I</b>, from 1609.'],
          ['Counties planted', 'Six: <b>Donegal, Coleraine (Derry), Tyrone, Armagh, Fermanagh and Cavan</b>.'],
          ['Private plantation', 'Antrim and Down were planted privately by <b>Hugh Montgomery and James Hamilton</b>, two Scots.'],
          ['Estate sizes', '1,000, 1,500 or 2,000 acres: no estate was bigger than <b>2,000 acres</b>.'],
          ['Who got land', '<b>Undertakers</b> (English and Scottish settlers who had to bring Protestant tenants), <b>servitors</b> (soldiers and officials who served the Crown) and <b>deserving Irish</b> (Irish loyal to the Crown).'],
          ['Bawn', 'A walled enclosure built around a planter’s house for defence.'],
          ['Derry', 'The <b>London companies</b> (guilds of the City of London) funded and planted Derry, renamed Londonderry, and Coleraine.']] },
        { h: 'Consequences', list: ['New towns: <b>Derry, Coleraine, Enniskillen, Cavan, Strabane</b>, Belfast grew later.',
          'Plantation towns had a central square called <b>the Diamond</b>, wide streets, town walls, a market and a Protestant church.',
          'Farming changed: planters used enclosed fields, tillage (crops) and a cash economy, while the Gaelic Irish practised <b>booleying</b> (moving cattle to summer pastures) and measured wealth in cattle.',
          'English law, language and the Protestant religion spread. Many native Irish were moved to poorer land.',
          'Two communities with different religions and identities: the roots of later divisions in Northern Ireland (e.g. Drumcree).'] }
      ] },
      america: { label: 'The American Revolution', sections: [
        { h: 'Causes', kv: [['13 colonies', 'English settlers set up 13 colonies on the east coast of North America.'],
          ['Navigation Acts', 'Laws saying colonial trade must go through Britain and be carried in British ships.'],
          ['Stamp Act (1765)', 'A tax on printed paper. The <b>Sons of Liberty</b> protested, attacked tax collectors and organised boycotts of British goods.'],
          ['Slogan', '“<b>No taxation without representation</b>”: colonists had no MPs in the British parliament.'],
          ['Boston Massacre (1770)', 'British soldiers fired on a crowd in Boston, killing five colonists.'],
          ['Boston Tea Party (1773)', 'Sons of Liberty dressed as Mohawks dumped 342 chests of British tea into Boston Harbour in protest at the Tea Act.']] },
        { h: 'Course of the war', kv: [['Lexington & Concord (1775)', 'The first shots of the Revolution were fired here.'],
          ['Second Continental Congress', 'Appointed <b>George Washington</b> commander-in-chief of the Continental Army.'],
          ['Common Sense (1776)', 'Pamphlet by <b>Thomas Paine</b> arguing for independence.'],
          ['Declaration of Independence', 'Adopted on <b>4 July 1776</b>; written mainly by Thomas Jefferson.'],
          ['Bunker Hill (1775)', 'A British victory but with heavy British losses.'],
          ['Saratoga (1777)', 'Major American victory; the turning point that brought <b>France</b> into the war.'],
          ['Valley Forge (1777–78)', 'Washington’s army spent a hard winter there and was trained by <b>Baron von Steuben</b>.'],
          ['Allies', '<b>France</b> and <b>Spain</b> (and the Dutch Republic) joined on the American side.'],
          ['Yorktown (1781)', 'British general Cornwallis surrendered: the last major battle.']] },
        { h: 'Results', list: ['The <b>Treaty of Paris (1783)</b> recognised American independence.', '<b>George Washington</b> became the first President of the United States (1789).',
          'A new constitution created a republic with no king.', 'It inspired other revolutions, such as the French Revolution and the 1798 Rebellion in Ireland.',
          'Britain lost its 13 colonies; Native Americans and enslaved people gained little.'] }
      ] }
    },
    decks: {
      reformation: { label: 'The Reformation', cards: cards([
        ['Reformation', 'The movement to reform the Catholic Church that led to Protestant churches'], ['Indulgence', 'A pardon for the punishment due for sin, sold by the Church'],
        ['Simony', 'Buying and selling Church jobs'], ['Pluralism', 'Holding more than one Church job at a time'], ['Absenteeism', 'Bishops or priests not living in their area'],
        ['Nepotism', 'Giving Church jobs to relatives'], ['Justification by faith alone', 'Faith in God, not good works, saves a person'],
        ['95 Theses', 'Luther’s 95 arguments against indulgences (1517)'], ['Johann Eck', 'Debated Luther at Leipzig (1519)'],
        ['Papal bull', 'Letter from the Pope; Exsurge Domine told Luther to recant'], ['Edict of Worms', 'Made Luther an outlaw and banned his books (1521)'],
        ['Wartburg Castle', 'Where Luther hid and translated the New Testament into German'], ['Katharina von Bora', 'Former nun who married Luther'],
        ['Peace of Augsburg', '1555: each prince chose his state’s religion'], ['Council of Trent', '1545–1563: the Catholic Church reformed itself'],
        ['Jesuits', 'Order founded by Ignatius of Loyola: schools and missions'], ['Inquisition', 'Church courts that tried people for heresy']]) },
      plantation: { label: 'The Plantation of Ulster', cards: cards([
        ['The Pale', 'Area around Dublin loyal to the English Crown'], ['Plantation', 'Confiscating land and settling it with loyal settlers'],
        ['First plantation', 'Laois–Offaly (1550s)'], ['Flight of the Earls', '1607: the earls of Tyrone and Tyrconnell fled to Europe'],
        ['James I', 'The monarch who carried out the Ulster Plantation'], ['Six planted counties', 'Donegal, Coleraine (Derry), Tyrone, Armagh, Fermanagh, Cavan'],
        ['Private plantation', 'Antrim and Down, by Hamilton and Montgomery'], ['Largest estate', '2,000 acres'],
        ['Undertakers', 'Settlers who undertook to bring English or Scottish Protestant tenants'], ['Servitors', 'Soldiers and officials who had served the Crown'],
        ['Deserving Irish', 'Native Irish thought loyal to the Crown'], ['Bawn', 'Walled enclosure around a planter’s house'],
        ['London companies', 'City of London guilds that planted Derry'], ['The Diamond', 'Central square of a plantation town'],
        ['Booleying', 'Gaelic practice of moving cattle to summer pastures']]) },
      america: { label: 'The American Revolution', cards: cards([
        ['13 colonies', 'English colonies on the east coast of North America'], ['Navigation Acts', 'Colonial trade had to go through Britain in British ships'],
        ['Stamp Act', '1765 tax on printed paper'], ['Sons of Liberty', 'Protest group: boycotts, attacks on tax collectors, Boston Tea Party'],
        ['No taxation without representation', 'Colonists had no MPs, so Britain shouldn’t tax them'], ['Boston Massacre', '1770: British soldiers killed five colonists'],
        ['Boston Tea Party', '1773: tea dumped into Boston Harbour'], ['Lexington & Concord', '1775: first shots of the Revolution'],
        ['Common Sense', 'Thomas Paine’s pamphlet for independence (1776)'], ['George Washington', 'Commander-in-chief, then first President'],
        ['Declaration of Independence', 'Adopted 4 July 1776'], ['Saratoga', '1777: turning point; France joined the war'],
        ['Baron von Steuben', 'Trained the army at Valley Forge'], ['Yorktown', '1781: Cornwallis surrendered'], ['Treaty of Paris', '1783: recognised US independence']]) }
    },
    quizzes: {
      reformation: { label: 'The Reformation', questions: [
        { q: 'Around 1500, which Church did most people in western Europe belong to?', ans: ['The Catholic Church'], opts: ['The Lutheran Church', 'The Church of England', 'The Orthodox Church'] },
        { q: 'What was the Reformation?', ans: ['A movement to reform the Catholic Church that led to Protestant churches'], opts: ['A war between France and Spain', 'The rebirth of art and learning in Italy', 'A plan to settle Ireland'] },
        { q: 'Which of these was an abuse in the Church?', ans: ['Simony'], opts: ['Chivalry', 'Booleying', 'Patronage'] },
        { q: 'What does “justification by faith alone” mean?', ans: ['Faith in God, not good works, saves you'], opts: ['Only priests can be saved', 'Buying indulgences saves you', 'Going to Mass every day saves you'] },
        { q: 'Why did Luther oppose the sale of indulgences?', ans: ['They suggested forgiveness could be bought'], opts: ['They were too cheap', 'They were written in German', 'They were sold by the King'] },
        { q: 'What were Luther’s 95 Theses?', ans: ['Arguments against indulgences and Church abuses'], opts: ['A German translation of the Bible', 'Rules for the Jesuits', 'A treaty between princes'] },
        { q: 'Who did Luther debate his ideas with at Leipzig?', ans: ['Johann Eck'], opts: ['Johann Tetzel', 'Ignatius of Loyola', 'Frederick the Wise'] },
        { q: 'What is the Pope’s letter warning Luther to recant called?', ans: ['A papal bull'], opts: ['An indulgence', 'An edict', 'A thesis'] },
        { q: 'What did the Edict of Worms say?', ans: ['Luther was an outlaw and his books were banned'], opts: ['Each prince could choose his religion', 'Indulgences were abolished', 'Luther could marry'] },
        { q: 'How did Luther’s ideas spread so quickly?', ans: ['The printing press'], opts: ['Radio broadcasts', 'The Jesuits', 'The Inquisition'] },
        { q: 'What did Luther do at Wartburg Castle?', ans: ['Translated the New Testament into German'], opts: ['Wrote the 95 Theses', 'Met the Pope', 'Founded the Jesuits'] },
        { q: 'Who did Luther marry?', ans: ['Katharina von Bora'], opts: ['Anne Boleyn', 'Catherine of Aragon', 'Mary Tudor'] },
        { q: 'What did the Peace of Augsburg (1555) state?', ans: ['Each prince could choose the religion of his state'], opts: ['Everyone had to become Lutheran', 'The Pope ruled Germany', 'Luther was an outlaw'] },
        { q: 'What was the Catholic response to the Reformation called?', ans: ['The Counter-Reformation'], opts: ['The Renaissance', 'The Plantation', 'The Enlightenment'] },
        { q: 'Who set up the Jesuits?', ans: ['Ignatius of Loyola'], opts: ['Martin Luther', 'John Calvin', 'Johann Eck'] },
        { q: 'What was the Inquisition?', ans: ['Church courts that tried people for heresy'], opts: ['A Protestant church', 'A list of banned books', 'A school run by monks'] }
      ] },
      plantation: { label: 'The Plantation of Ulster', questions: [
        { q: 'What was the area of Ireland loyal to the King called?', ans: ['The Pale'], opts: ['The Diamond', 'The Bawn', 'The Plantation'] },
        { q: 'Where was the first plantation carried out?', ans: ['Laois–Offaly'], opts: ['Ulster', 'Munster', 'Antrim and Down'] },
        { q: 'What was the Flight of the Earls?', ans: ['The earls of Tyrone and Tyrconnell fled to Europe in 1607'], opts: ['English earls arrived in Ulster in 1609', 'A battle in 1601', 'The earls were executed in London'] },
        { q: 'Which monarch carried out the Ulster Plantation?', ans: ['James I'], opts: ['Elizabeth I', 'Mary I', 'Henry VIII'] },
        { q: 'Which of these was NOT one of the six planted counties?', ans: ['Antrim'], opts: ['Tyrone', 'Fermanagh', 'Cavan'] },
        { q: 'Who carried out the private plantation in Antrim and Down?', ans: ['Hamilton and Montgomery'], opts: ['The London companies', 'O’Neill and O’Donnell', 'The servitors'] },
        { q: 'What size were Ulster estates capped at?', ans: ['2,000 acres'], opts: ['500 acres', '10,000 acres', '1,000 acres'] },
        { q: 'Which group received land in the Plantation?', ans: ['Undertakers'], opts: ['Jesuits', 'Sons of Liberty', 'Guild masters'] },
        { q: 'What was a bawn?', ans: ['A walled enclosure around a planter’s house'], opts: ['A central town square', 'A type of cattle', 'A Gaelic chieftain'] },
        { q: 'Who helped with the plantation of Derry?', ans: ['The London companies'], opts: ['The Jesuits', 'The Spanish', 'The deserving Irish'] },
        { q: 'Which town was built during the Ulster Plantation?', ans: ['Enniskillen'], opts: ['Kilkenny', 'Galway', 'Waterford'] },
        { q: 'What was the central square of a plantation town called?', ans: ['The Diamond'], opts: ['The Pale', 'The Bawn', 'The Keep'] },
        { q: 'How did plantation farming differ from Gaelic farming?', ans: ['Planters grew crops in enclosed fields'], opts: ['Planters practised booleying', 'Planters measured wealth in cattle', 'Planters farmed no land'] }
      ] },
      america: { label: 'The American Revolution', questions: [
        { q: 'How many colonies did English settlers set up in North America?', ans: ['13'], opts: ['10', '50', '7'] },
        { q: 'What were the Navigation Acts?', ans: ['Laws forcing colonial trade through Britain'], opts: ['Taxes on tea', 'Rules for sailors’ pay', 'The American constitution'] },
        { q: 'What did the Sons of Liberty do after the Stamp Act?', ans: ['Protested, boycotted British goods and attacked tax collectors'], opts: ['Paid the tax without complaint', 'Joined the British army', 'Moved back to England'] },
        { q: 'Which slogan is linked to colonists’ anger over taxes?', ans: ['No taxation without representation'], opts: ['Liberty, equality, fraternity', 'Gold, glory, God', 'Faith alone'] },
        { q: 'What happened at the Boston Tea Party?', ans: ['Colonists dumped British tea into Boston Harbour'], opts: ['British soldiers shot colonists', 'Washington was made commander', 'The Declaration was signed'] },
        { q: 'What was the Boston Massacre?', ans: ['British soldiers killed five colonists in 1770'], opts: ['A battle in 1781', 'Tea dumped in the harbour', 'Colonists attacked a British fort'] },
        { q: 'Where were the first shots of the Revolution fired?', ans: ['Lexington and Concord'], opts: ['Yorktown', 'Saratoga', 'Bunker Hill'] },
        { q: 'Who wrote Common Sense?', ans: ['Thomas Paine'], opts: ['Thomas Jefferson', 'George Washington', 'Benjamin Franklin'] },
        { q: 'What was George Washington appointed at the Second Continental Congress?', ans: ['Commander-in-chief of the army'], opts: ['First President', 'Governor of Boston', 'Ambassador to France'] },
        { q: 'When was the Declaration of Independence adopted?', ans: ['4 July 1776'], opts: ['4 July 1783', '17 March 1776', '12 October 1775'] },
        { q: 'Which country joined the war on the American side?', ans: ['France'], opts: ['Prussia', 'Portugal', 'Russia'] },
        { q: 'Who trained the American troops at Valley Forge?', ans: ['Baron von Steuben'], opts: ['Lord Cornwallis', 'Marquis de Lafayette', 'Thomas Paine'] },
        { q: 'Which treaty recognised American independence?', ans: ['The Treaty of Paris (1783)'], opts: ['The Treaty of Tordesillas', 'The Peace of Augsburg', 'The Treaty of Versailles'] },
        { q: 'Who was the first President of the United States?', ans: ['George Washington'], opts: ['Thomas Jefferson', 'John Adams', 'Abraham Lincoln'] },
        { q: 'Which battle was the turning point that brought France into the war?', ans: ['Saratoga'], opts: ['Bunker Hill', 'Lexington', 'Yorktown'] }
      ] }
    },
    matches: {
      reformation: { label: 'Reformation', colL: 'Term', colR: 'Meaning', pairs: [
        { left: '95 Theses', right: 'Luther’s arguments, 1517' }, { left: 'Papal bull', right: 'Pope’s letter to recant' }, { left: 'Edict of Worms', right: 'Luther made an outlaw' },
        { left: 'Wartburg Castle', right: 'Bible translated into German' }, { left: 'Peace of Augsburg', right: 'Prince chooses the religion' }, { left: 'Jesuits', right: 'Founded by Ignatius of Loyola' },
        { left: 'Simony', right: 'Buying Church jobs' }] },
      plantation: { label: 'Plantation', colL: 'Term', colR: 'Meaning', pairs: [
        { left: 'The Pale', right: 'Area loyal to the King' }, { left: 'Undertakers', right: 'Brought Protestant tenants' }, { left: 'Servitors', right: 'Had served the Crown' },
        { left: 'Bawn', right: 'Walled enclosure' }, { left: 'The Diamond', right: 'Central town square' }, { left: 'Booleying', right: 'Moving cattle to summer pasture' },
        { left: 'London companies', right: 'Planted Derry' }] },
      battles: { label: 'People & battles', colL: 'Name', colR: 'Known for', pairs: [
        { left: 'Lexington & Concord', right: 'First shots, 1775' }, { left: 'Bunker Hill', right: 'Costly British win' }, { left: 'Saratoga', right: 'Turning point, 1777' },
        { left: 'Yorktown', right: 'British surrender, 1781' }, { left: 'Thomas Paine', right: 'Wrote Common Sense' }, { left: 'Baron von Steuben', right: 'Trained troops at Valley Forge' },
        { left: 'Sons of Liberty', right: 'Boston Tea Party' }] }
    },
    timelines: {
      reformation: { label: 'Reformation', nodes: [
        { year: 1517, event: 'Luther’s 95 Theses' }, { year: 1519, event: 'Leipzig debate with Eck' }, { year: 1521, event: 'Edict of Worms' },
        { year: 1540, event: 'Jesuits approved by the Pope' }, { year: 1545, event: 'Council of Trent opens' }, { year: 1555, event: 'Peace of Augsburg' }] },
      plantation: { label: 'Plantations', nodes: [
        { year: 1556, event: 'Laois–Offaly plantation begins' }, { year: 1586, event: 'Munster Plantation' }, { year: 1601, event: 'Battle of Kinsale' },
        { year: 1607, event: 'Flight of the Earls' }, { year: 1609, event: 'Plantation of Ulster begins' }] },
      america: { label: 'American Revolution', nodes: [
        { year: 1765, event: 'Stamp Act' }, { year: 1770, event: 'Boston Massacre' }, { year: 1773, event: 'Boston Tea Party' }, { year: 1775, event: 'Lexington & Concord' },
        { year: 1776, event: 'Declaration of Independence' }, { year: 1777, event: 'Battle of Saratoga' }, { year: 1781, event: 'Surrender at Yorktown' }, { year: 1783, event: 'Treaty of Paris' }] }
    },
    practice: {
      reformation: { label: 'The Reformation', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Luther believed in justification by ___ alone.', ans: ['faith'] }, { q: 'Luther wrote the ___ Theses in 1517.', ans: ['95'] },
        { q: 'Luther debated ___ Eck at Leipzig.', ans: ['Johann'] }, { q: 'The Pope’s letter to Luther is called a papal ___.', ans: ['bull'] },
        { q: 'The Edict of ___ made Luther an outlaw.', ans: ['Worms'] }, { q: 'At ___ Castle Luther translated the New Testament.', ans: ['Wartburg'] },
        { q: 'Luther married Katharina von ___.', ans: ['Bora'] }, { q: 'The Peace of ___ (1555) let each prince choose his religion.', ans: ['Augsburg'] },
        { q: 'The Council of ___ reformed the Catholic Church.', ans: ['Trent'] }, { q: 'The Jesuits were founded by Ignatius of ___.', ans: ['Loyola'] },
        { q: 'Church courts that tried heretics were called the ___.', ans: ['Inquisition'] }, { q: 'Buying and selling Church jobs was called ___.', ans: ['simony'] }] },
      plantation: { label: 'The Plantation of Ulster', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The area loyal to the King was called the ___.', ans: ['Pale'] }, { q: 'The first plantation was in Laois and ___.', ans: ['Offaly'] },
        { q: 'The Flight of the Earls happened in ___.', ans: ['1607'] }, { q: 'King ___ I carried out the Plantation of Ulster.', ans: ['James'] },
        { q: 'Estates were capped at ___ acres.', ans: ['2,000', '2000'] }, { q: 'A walled enclosure around a planter’s house was a ___.', ans: ['bawn'] },
        { q: 'The London ___ planted Derry.', ans: ['companies'] }, { q: 'The central square of a plantation town was the ___.', ans: ['Diamond'] },
        { q: 'Moving cattle to summer pasture was called ___.', ans: ['booleying'] }, { q: 'Antrim and Down were planted by Hamilton and ___.', ans: ['Montgomery'] }] },
      america: { label: 'The American Revolution', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'There were ___ colonies.', ans: ['13', 'thirteen'] }, { q: 'The ___ Acts made colonial trade go through Britain.', ans: ['Navigation'] },
        { q: '“No taxation without ___”', ans: ['representation'] }, { q: 'The Boston ___ Party took place in 1773.', ans: ['Tea'] },
        { q: 'The first shots were fired at Lexington and ___.', ans: ['Concord'] }, { q: 'Thomas ___ wrote Common Sense.', ans: ['Paine'] },
        { q: 'The Declaration of Independence was adopted on 4 July ___.', ans: ['1776'] }, { q: 'Baron von ___ trained the army at Valley Forge.', ans: ['Steuben'] },
        { q: 'The British surrendered at ___ in 1781.', ans: ['Yorktown'] }, { q: 'The Treaty of ___ (1783) recognised independence.', ans: ['Paris'] }] }
    }
  };

  window.SN_DATA.history = { id: 'history', title: 'History', subtitle: 'History', marking: { spelling: 'lenient', note: 'History: names and terms count if they are recognisable when read aloud. Explanations need a reason, not just a fact.' }, years: { '1': y1, '2': y2 } };
})();
