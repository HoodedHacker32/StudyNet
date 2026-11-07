/* StudyNet — Français data (1st and 2nd Year). Loaded by french.html. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';

  function vocab(pairs) { return pairs.map(function (p) { return { front: p[0], back: p[1] }; }); }
  function toQuiz(pairs, dir) { // dir 'fr': show French, answer English
    return pairs.map(function (p) { return dir === 'fr' ? { q: p[0], ans: [p[1]] } : { q: p[1], ans: [p[0]] }; });
  }
  function toMatch(pairs) { return pairs.map(function (p) { return { left: p[0], right: p[1] }; }); }

  /* ════════════════════════════════════════════════════════════
     1st YEAR (storage keys unchanged from the original page)
  ════════════════════════════════════════════════════════════ */
  var conj = function (verb, items) {
    return { label: verb.charAt(0).toUpperCase() + verb.slice(1) + ' (conjugation)', type: 'table', intro: 'Type the correct form of ' + verb + '.',
      cols: ['Pronoun', 'English', verb], rows: items.map(function (it, i) { return [it[0], { dim: it[1] }, { k: String(i), ans: it[2] }]; }) };
  };
  var y1 = {
    blurb: 'French — greetings, school, family, weather and verbs',
    store: 'sn_french_v1',
    score: 'french',
    topics: [
      { id: 'salutations', label: 'Salutations', icon: 'chat', desc: 'Greetings and common phrases', fc: ['salutations'] },
      { id: 'matieres', label: 'Les matières', icon: 'books', desc: 'School subjects', fc: ['matieres'] },
      { id: 'famille', label: 'La famille', icon: 'users', desc: 'Family members', fc: ['famille'] },
      { id: 'temps', label: 'Le temps', icon: 'cloud', desc: 'Weather expressions', fc: ['temps'] },
      { id: 'verbes', label: 'Les verbes', icon: 'pencil', desc: 'Être, avoir, aimer, possessives and endings',
        quiz: ['etre', 'avoir'], prac: ['etre', 'avoir', 'aimer', 'possessif', 'endings'] },
      { id: 'calendrier', label: 'Le calendrier', icon: 'calendar', desc: 'Days and months', quiz: ['jours'], match: ['jours', 'mois1', 'mois2'] },
      { id: 'vocabulaire', label: 'Vocabulaire', icon: 'text', desc: 'Animals, home, weather and opinions', quiz: ['vocab', 'opinions'], match: ['animaux'] }
    ],
    decks: {
      salutations: { label: 'Salutations', cards: vocab([['Bonjour', 'Hello'], ['Bonsoir', 'Good evening'], ['Bonne nuit', 'Good night'], ['Au revoir', 'Goodbye'],
        ['Ça va ?', 'How are you? (informal)'], ['Je vais bien', 'I am fine'], ['Ça va bien', 'I am well'], ['Ça va mal', 'Things are not going well'],
        ['Merci', 'Thank you'], ['De rien', 'You’re welcome'], ['À demain', 'See you tomorrow'], ['Comment allez-vous ?', 'How are you? (formal)']]) },
      matieres: { label: 'Les matières', cards: vocab([['Le français', 'French'], ['Les maths', 'Maths'], ["L'anglais", 'English'], ["L'histoire", 'History'],
        ['La géographie', 'Geography'], ['La biologie', 'Biology'], ['La musique', 'Music'], ['La physique', 'Physics'], ['La chimie', 'Chemistry'],
        ["L'éducation physique", 'PE / Sport'], ['Le dessin', 'Art'], ['La religion', 'Religion']]) },
      famille: { label: 'La famille', cards: vocab([['Le père', 'Father'], ['La mère', 'Mother'], ['Le frère', 'Brother'], ['La sœur', 'Sister'],
        ['Le grand-père', 'Grandfather'], ['La grand-mère', 'Grandmother'], ["L'oncle", 'Uncle'], ['La tante', 'Aunt'], ['Le fils', 'Son'],
        ['La fille', 'Daughter'], ['Le mari', 'Husband'], ['La femme', 'Wife']]) },
      temps: { label: 'Le temps', cards: vocab([['Il fait beau', 'The weather is nice'], ['Il fait mauvais', 'The weather is bad'], ['Il fait chaud', 'It is hot'],
        ['Il fait froid', 'It is cold'], ['Il pleut', 'It is raining'], ['Il neige', 'It is snowing'], ['Il gèle', 'It is freezing'],
        ['Il y a du vent', 'It is windy'], ['Il y a du soleil', 'It is sunny'], ['Il y a des nuages', 'It is cloudy'], ['Il y a du brouillard', 'It is foggy']]) }
    },
    quizzes: {
      etre: { label: 'Être (to be)', questions: [
        { q: 'Je ___ (I am)', ans: ['suis'] }, { q: 'Tu ___ (you are, informal)', ans: ['es'] }, { q: 'Il ___ (he is)', ans: ['est'] },
        { q: 'Elle ___ (she is)', ans: ['est'] }, { q: 'On ___ (we are / one is)', ans: ['est'] }, { q: 'Nous ___ (we are)', ans: ['sommes'] },
        { q: 'Vous ___ (you are, formal / plural)', ans: ['êtes'] }, { q: 'Ils ___ (they are, masc.)', ans: ['sont'] }, { q: 'Elles ___ (they are, fem.)', ans: ['sont'] }
      ] },
      avoir: { label: 'Avoir (to have)', questions: [
        { q: "J'___ (I have)", ans: ['ai'] }, { q: 'Tu ___ (you have)', ans: ['as'] }, { q: 'Il ___ (he has)', ans: ['a'] },
        { q: 'Elle ___ (she has)', ans: ['a'] }, { q: 'On ___ (we have / one has)', ans: ['a'] }, { q: 'Nous ___ (we have)', ans: ['avons'] },
        { q: 'Vous ___ (you have)', ans: ['avez'] }, { q: 'Ils ___ (they have, masc.)', ans: ['ont'] }, { q: 'Elles ___ (they have, fem.)', ans: ['ont'] }
      ] },
      jours: { label: 'Jours et mois', questions: toQuiz([['lundi', 'Monday'], ['mardi', 'Tuesday'], ['mercredi', 'Wednesday'], ['jeudi', 'Thursday'],
        ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday'], ['janvier', 'January'], ['février', 'February'], ['mars', 'March'],
        ['avril', 'April'], ['juin', 'June'], ['septembre', 'September'], ['décembre', 'December']], 'en') },
      vocab: { label: 'Vocabulaire', questions: toQuiz([['un chat', 'a cat'], ['un chien', 'a dog'], ['un lapin', 'a rabbit'], ['un cheval', 'a horse'],
        ['un poisson rouge', 'a goldfish'], ['le salon', 'the living room'], ['la cuisine', 'the kitchen'], ['la chambre', 'the bedroom'],
        ['la salle de bains', 'the bathroom'], ['le jardin', 'the garden'], ['il fait beau', 'the weather is nice'], ['il pleut', 'it is raining']], 'fr') },
      opinions: { label: 'Opinions', questions: toQuiz([["j'aime", 'I like'], ["j'adore", 'I love'], ['je déteste', 'I hate'], ["je n'aime pas", 'I don’t like'],
        ['facile', 'easy'], ['difficile', 'difficult'], ['intéressant', 'interesting'], ['barbant', 'boring'], ['sympa', 'friendly'], ['drôle', 'funny'],
        ['parce que', 'because'], ['utile', 'useful']], 'en') }
    },
    matches: {
      jours: { label: 'Les jours', colL: 'Français', colR: 'English', pairs: toMatch([['lundi', 'Monday'], ['mardi', 'Tuesday'], ['mercredi', 'Wednesday'],
        ['jeudi', 'Thursday'], ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday']]) },
      mois1: { label: 'Mois 1–6', colL: 'Français', colR: 'English', pairs: toMatch([['janvier', 'January'], ['février', 'February'], ['mars', 'March'],
        ['avril', 'April'], ['mai', 'May'], ['juin', 'June']]) },
      mois2: { label: 'Mois 7–12', colL: 'Français', colR: 'English', pairs: toMatch([['juillet', 'July'], ['août', 'August'], ['septembre', 'September'],
        ['octobre', 'October'], ['novembre', 'November'], ['décembre', 'December']]) },
      animaux: { label: 'Les animaux', colL: 'Français', colR: 'English', pairs: toMatch([['un chat', 'cat'], ['un chien', 'dog'], ['un lapin', 'rabbit'],
        ['un cheval', 'horse'], ['un hamster', 'hamster'], ['un poisson rouge', 'goldfish'], ['une tortue', 'tortoise'], ['une souris', 'mouse']]) }
    },
    practice: {
      etre: conj('être', [['je', 'I am', ['suis']], ['tu', 'you are (informal)', ['es']], ['il / elle / on', 'he / she / one is', ['est']],
        ['nous', 'we are', ['sommes']], ['vous', 'you are (formal)', ['êtes']], ['ils / elles', 'they are', ['sont']]]),
      avoir: conj('avoir', [["j'", 'I have', ['ai']], ['tu', 'you have', ['as']], ['il / elle / on', 'he / she / one has', ['a']],
        ['nous', 'we have', ['avons']], ['vous', 'you have (formal)', ['avez']], ['ils / elles', 'they have', ['ont']]]),
      aimer: conj('aimer', [["j'", 'I like', ['aime']], ['tu', 'you like', ['aimes']], ['il / elle / on', 'he / she likes', ['aime']],
        ['nous', 'we like', ['aimons']], ['vous', 'you like (pl.)', ['aimez']], ['ils / elles', 'they like', ['aiment']]]),
      possessif: { label: 'Adjectifs possessifs', type: 'table', intro: 'Fill in the possessive adjectives.', cols: ['Meaning', 'Masculine', 'Feminine', 'Plural'],
        rows: [['my', 'mon', 'ma', 'mes'], ['your (informal)', 'ton', 'ta', 'tes'], ['his / her', 'son', 'sa', 'ses'], ['our', 'notre', 'notre', 'nos'],
          ['your (formal / pl.)', 'votre', 'votre', 'vos'], ['their', 'leur', 'leur', 'leurs']].map(function (r, i) {
          return [r[0], { k: i + '_m', ans: [r[1]] }, { k: i + '_f', ans: [r[2]] }, { k: i + '_p', ans: [r[3]] }];
        }) },
      endings: { label: 'Terminaisons des verbes', type: 'table', intro: 'Fill in the regular present-tense endings.',
        rule: 'Remove the infinitive ending (<b>-er</b>, <b>-ir</b>, <b>-re</b>), then add the correct ending.',
        cols: ['Pronoun', '-ER (jouer)', '-IR (finir)', '-RE (vendre)'],
        rows: [["je / j'", 'e', 'is', 's'], ['tu', 'es', 'is', 's'], ['il / elle / on', 'e', 'it', null], ['nous', 'ons', 'issons', 'ons'],
          ['vous', 'ez', 'issez', 'ez'], ['ils / elles', 'ent', 'issent', 'ent']].map(function (r, i) {
          return [r[0], { k: i + '_er', ans: [r[1]] }, { k: i + '_ir', ans: [r[2]] },
            r[3] ? { k: i + '_re', ans: [r[3]] } : { na: 'no ending (il vend)', title: 'No ending: il vend' }];
        }) }
    }
  };

  /* ════════════════════════════════════════════════════════════
     2nd YEAR — November exam
     Reading & vocab: town buildings, hobbies, numbers 1–100, clothes, weather.
     Grammar: jouer à + sport, jouer de + instrument, faire de + sport, aller à.
     Writing: age, date of birth, family, town, hobbies.
  ════════════════════════════════════════════════════════════ */
  var sportsJouer = [['le football', 'football'], ['le rugby', 'rugby'], ['le tennis', 'tennis'], ['le basket', 'basketball'], ['le hockey', 'hockey'],
    ['le golf', 'golf'], ['le badminton', 'badminton'], ['le volley', 'volleyball'], ['le hurling', 'hurling']];
  var sportsFaire = [['faire du vélo', 'to cycle'], ['faire du patinage', 'to ice-skate'], ["faire de l'athlétisme", 'to do athletics'],
    ["faire de l'équitation", 'to go horse riding'], ['faire de la natation', 'to swim'], ['faire de la gymnastique', 'to do gymnastics'],
    ['faire de la danse', 'to dance'], ['faire du ski', 'to ski'], ['faire de la voile', 'to go sailing'], ['faire du judo', 'to do judo'],
    ['faire de la randonnée', 'to go hiking'], ["faire de l'escalade", 'to go climbing']];
  var instruments = [['le piano', 'piano'], ['la guitare', 'guitar'], ['le violon', 'violin'], ['la batterie', 'drums'], ['la flûte', 'flute'],
    ['la trompette', 'trumpet'], ['le saxophone', 'saxophone'], ['la clarinette', 'clarinet'], ['le violoncelle', 'cello']];
  var musique = [['le rock', 'rock'], ['la pop', 'pop'], ['le rap', 'rap'], ['le jazz', 'jazz'], ['la musique classique', 'classical music'],
    ['le hip-hop', 'hip hop'], ['la musique traditionnelle', 'traditional music'], ['mon chanteur préféré', 'my favourite singer (m)'],
    ['ma chanteuse préférée', 'my favourite singer (f)'], ['un groupe', 'a band'], ['une chanson', 'a song'], ['écouter de la musique', 'to listen to music']];
  var ville = [['un cinéma', 'a cinema'], ['une piscine', 'a swimming pool'], ['une gare', 'a train station'], ['un centre commercial', 'a shopping centre'],
    ['une bibliothèque', 'a library'], ['une église', 'a church'], ['une boulangerie', 'a bakery'], ['une boucherie', 'a butcher’s'],
    ['une pharmacie', 'a pharmacy'], ['un supermarché', 'a supermarket'], ['un parc', 'a park'], ['un stade', 'a stadium'], ['un hôpital', 'a hospital'],
    ['un musée', 'a museum'], ['une banque', 'a bank'], ['un hôtel', 'a hotel'], ['un restaurant', 'a restaurant'], ['une patinoire', 'an ice rink'],
    ['un marché', 'a market'], ['une librairie', 'a bookshop'], ['une école', 'a school'], ['un château', 'a castle'], ['une plage', 'a beach'], ['un magasin', 'a shop']];
  var nombres = [['onze', '11'], ['douze', '12'], ['quinze', '15'], ['seize', '16'], ['vingt', '20'], ['vingt et un', '21'], ['trente', '30'],
    ['quarante', '40'], ['cinquante', '50'], ['soixante', '60'], ['soixante-dix', '70'], ['soixante et onze', '71'], ['quatre-vingts', '80'],
    ['quatre-vingt-un', '81'], ['quatre-vingt-dix', '90'], ['quatre-vingt-onze', '91'], ['quatre-vingt-dix-neuf', '99'], ['cent', '100']];
  var vetements = [['un pantalon', 'trousers'], ['un jean', 'jeans'], ['un short', 'shorts'], ['une jupe', 'a skirt'], ['une robe', 'a dress'],
    ['une chemise', 'a shirt'], ['un t-shirt', 'a T-shirt'], ['un pull', 'a jumper'], ['un sweat', 'a sweatshirt'], ['une veste', 'a jacket'],
    ['un manteau', 'a coat'], ['une cravate', 'a tie'], ['des chaussures', 'shoes'], ['des baskets', 'trainers'], ['des chaussettes', 'socks'],
    ['des bottes', 'boots'], ['un chapeau', 'a hat'], ['une casquette', 'a cap'], ['une écharpe', 'a scarf'], ['des gants', 'gloves']];
  var meteo = [['Il fait beau.', 'The weather is nice.'], ['Il fait mauvais.', 'The weather is bad.'], ['Il fait chaud.', 'It’s hot.'],
    ['Il fait froid.', 'It’s cold.'], ['Il fait doux.', 'It’s mild.'], ['Il pleut.', 'It’s raining.'], ['Il neige.', 'It’s snowing.'],
    ['Il gèle.', 'It’s freezing.'], ['Il y a du vent.', 'It’s windy.'], ['Il y a du soleil.', 'It’s sunny.'],
    ['Il y a des nuages.', 'It’s cloudy.'], ['Il y a du brouillard.', 'It’s foggy.'], ['Il y a un orage.', 'There’s a storm.'],
    ['Il fait quinze degrés.', 'It’s 15 degrees.']];
  var loisirs = [['les loisirs', 'hobbies'], ['le temps libre', 'free time'], ['lire', 'to read'], ['regarder la télé', 'to watch TV'],
    ['jouer aux jeux vidéo', 'to play video games'], ['sortir avec mes amis', 'to go out with my friends'], ['faire du shopping', 'to go shopping'],
    ['aller au cinéma', 'to go to the cinema'], ['le matin', 'the morning'], ['le soir', 'the evening'], ['le week-end', 'at the weekend'], ['tous les jours', 'every day']];

  var y2 = {
    blurb: 'French — November exam revision',
    exam: '<b>November exam:</b> town buildings, hobbies, numbers 1–100, clothes and weather; <i>jouer à / jouer de / faire de</i> and <i>aller à</i>; writing about your age, birthday, family, town and hobbies.',
    store: 'sn_french_y2',
    score: 'french_y2',
    /* Exam bank: Junior Cycle style questions with marking schemes. French answers: spelling and accents count. */
    examq: [
      { id: 'fr-w-1', topic: 'ville', src: 'Exam style', type: 'written', marks: 15, lines: 8,
        q: 'Write an email (about 50 words) to your French penfriend about your town. Say: what there is in your town (il y a…), where you go at the weekend (je vais au / à la…), and what you think of your town.',
        scheme: ['Greeting and sign-off (e.g. Salut ! / À bientôt) (2 marks)', 'Says what there is: il y a + at least two places (4 marks)', 'Where they go: je vais au / à la / à l’ + place, correctly (4 marks)', 'An opinion, e.g. j’aime ma ville car… (3 marks)', 'Overall accuracy of French (2 marks)'],
        model: 'Salut Marc ! J’habite à Cork. Dans ma ville, il y a un cinéma, une piscine et beaucoup de magasins. Le samedi, je vais au cinéma avec mes amis et le dimanche je vais à la piscine. J’adore ma ville parce qu’elle est animée. À bientôt !' },
      { id: 'fr-w-2', topic: 'loisirs', src: 'Exam style', type: 'written', marks: 10, lines: 6,
        q: 'Write four sentences in French about your hobbies. Use jouer à, jouer de and faire de at least once each.',
        scheme: ['Correct use of jouer à + sport (e.g. je joue au foot) (3 marks)', 'Correct use of jouer de + instrument (e.g. je joue du piano) (3 marks)', 'Correct use of faire de + activity (e.g. je fais de la natation) (3 marks)', 'A fourth sentence with an opinion or how often (1 mark)'],
        model: 'Je joue au football le samedi. Je joue de la guitare. Je fais de la natation deux fois par semaine. J’adore le sport parce que c’est amusant.' },
      { id: 'fr-s-1', topic: 'aller', src: 'Exam style', type: 'fill', marks: 4, q: 'Fill in au, à la, à l’ or aux: Je vais ___ cinéma, ___ piscine, ___ hôpital et ___ magasins.',
        ans: [['au'], ['à la', 'a la'], ['à l’', "à l'", "a l'", 'a l’'], ['aux']] },
      { id: 'fr-s-2', topic: 'sports', src: 'Exam style', type: 'group', q: 'How would you say these in French?', parts: [
        { type: 'short', q: 'I play football.', ans: ['Je joue au football', 'Je joue au foot'], marks: 2 },
        { type: 'short', q: 'I play the piano.', ans: ['Je joue du piano'], marks: 2 },
        { type: 'short', q: 'I go swimming (I do swimming).', ans: ['Je fais de la natation'], marks: 2 },
        { type: 'short', q: 'It’s sunny.', ans: ['Il fait du soleil', 'Il y a du soleil', 'Il fait soleil'], marks: 2 }] },
      { id: 'fr-r-1', topic: 'meteo', src: 'Exam style', type: 'group', spell: 'lenient',
        q: 'Read the forecast and answer in English: « Demain, à Paris, il fera froid et il pleuvra le matin. L’après-midi, il y aura du vent. »', parts: [
        { type: 'short', q: 'What will the weather be like in the morning? (two details)', ans: ['cold and rainy', 'cold and raining', 'cold and rain', 'it will be cold and it will rain', 'rainy and cold'], marks: 2, spell: 'lenient' },
        { type: 'short', q: 'What will the weather be like in the afternoon?', ans: ['windy', 'it will be windy', 'wind'], marks: 2, spell: 'lenient' }] }
    ],
    topics: [
      { id: 'examen', info: true, label: 'L’examen', icon: 'target', desc: 'What’s on the November exam and how to write your paragraphs', notes: ['examen', 'ecrire'], prac: ['moi'] },
      { id: 'sports', label: 'Les sports', icon: 'activity', desc: 'Jouer à + sport and faire de + activity',
        notes: ['jouerFaire'], fc: ['sportsJouer', 'sportsFaire'], quiz: ['jouerFaire'], match: ['sportsFaire'], prac: ['jouerFaire'] },
      { id: 'musique', label: 'La musique', icon: 'music', desc: 'Instruments (jouer de) and music you like',
        notes: ['jouerFaire'], fc: ['instruments', 'musique'], quiz: ['instruments', 'musique'], match: ['instruments'] },
      { id: 'ville', label: 'En ville', icon: 'map', desc: 'Buildings in town, il y a / il n’y a pas de',
        notes: ['ville'], fc: ['ville'], quiz: ['ville'], match: ['ville1', 'ville2'], prac: ['ilya'] },
      { id: 'aller', label: 'Aller + à', icon: 'compass', desc: 'Je vais au / à la / à l’ / aux', notes: ['aller'], quiz: ['aller'], prac: ['allerConj', 'allerA'] },
      { id: 'nombres', label: 'Les nombres 1–100', icon: 'hash', desc: 'Recognising numbers', notes: ['nombres'], fc: ['nombres'], quiz: ['nombres'], match: ['nombres'] },
      { id: 'vetements', label: 'Les vêtements', icon: 'shirt', desc: 'Clothes', fc: ['vetements'], quiz: ['vetements'], match: ['vetements'] },
      { id: 'meteo', label: 'La météo', icon: 'cloud', desc: 'Quel temps fait-il ?', fc: ['meteo'], quiz: ['meteo'], match: ['meteo'] },
      { id: 'loisirs', label: 'Mes loisirs', icon: 'heart', desc: 'Free time and how often', fc: ['loisirs'], quiz: ['loisirs'] }
    ],
    notes: {
      examen: { label: 'The exam', sections: [
        { h: 'Reading and vocabulary', list: ['Buildings in town (<i>en ville</i>)', 'Hobbies (<i>les loisirs</i>), sports and music', 'Recognising numbers 1–100',
          'Clothes (<i>les vêtements</i>)', 'Weather (<i>la météo</i>)'] },
        { h: 'Grammar', list: ['<b>jouer à</b> + a sport or game: <i>je joue au tennis</i>', '<b>jouer de</b> + an instrument: <i>je joue du piano</i>',
          '<b>faire de</b> + a sport or activity: <i>je fais de la natation</i>', '<b>aller à</b>: <i>je vais au cinéma, à la piscine, à l’église, aux magasins</i>'] },
        { h: 'Writing', p: ['Learn your paragraphs about: your <b>age</b>, your <b>date of birth</b>, your <b>family</b>, your <b>town</b> and your <b>hobbies</b>.'],
          tip: 'Check every verb matches its subject (<i>je joue, il joue, nous jouons</i>) and every adjective matches its noun (<i>un grand village, une grande ville</i>).' }
      ] },
      ecrire: { label: 'Model paragraphs', sections: [
        { h: 'Moi', list: ['Je m’appelle …', 'J’ai treize ans. (I am 13.)', 'Mon anniversaire, c’est le cinq mars. (My birthday is on 5 March.)',
          'Je suis né(e) le cinq mars deux mille treize. (I was born on 5 March 2013.)'] },
        { h: 'Ma famille', list: ['Il y a quatre personnes dans ma famille : mon père, ma mère, mon frère et moi.', 'J’ai un frère et une sœur.',
          'Je n’ai pas de frères ou de sœurs. Je suis fils unique / fille unique.', 'Mon frère s’appelle … Il a dix ans. Il est grand et drôle.',
          'Ma mère est gentille et mon père est sportif.'] },
        { h: 'Ma ville', list: ['J’habite à … C’est une petite ville calme dans le sud de l’Irlande.', 'C’est un joli village dans l’ouest du comté de Cork.',
          'Dans ma ville, il y a un cinéma, une piscine et beaucoup de magasins.', 'Il n’y a pas de gare. Il n’y a ni centre commercial ni patinoire.',
          'Il y a beaucoup de choses à faire. / Il n’y a rien à faire.', 'J’adore ma ville parce qu’elle est très animée.'] },
        { h: 'Mes loisirs', list: ['Pendant mon temps libre, j’aime jouer au football et écouter de la musique.', 'Le week-end, je fais du vélo avec mes amis.',
          'Je joue de la guitare depuis trois ans. (I have been playing guitar for three years.)', 'Mon genre de musique préféré, c’est la pop.'] }
      ] },
      jouerFaire: { label: 'Jouer à, jouer de, faire de', sections: [
        { h: 'Jouer à + sport or game', kv: [['à + le', '<b>au</b>: je joue au foot'], ['à + la', '<b>à la</b>: je joue à la pétanque'], ['à + les', '<b>aux</b>: je joue aux cartes']] },
        { h: 'Jouer de + instrument', kv: [['de + le', '<b>du</b>: je joue du piano'], ['de + la', '<b>de la</b>: je joue de la guitare'], ['de + l’', '<b>de l’</b>: je joue de l’accordéon']],
          tip: 'Sport = <b>à</b> (au / à la / aux). Instrument = <b>de</b> (du / de la / de l’).' },
        { h: 'Faire de + sport or activity', kv: [['de + le', '<b>du</b>: je fais du vélo'], ['de + la', '<b>de la</b>: je fais de la natation'],
          ['de + l’', '<b>de l’</b>: je fais de l’équitation'], ['de + les', '<b>des</b>: je fais des randonnées']] },
        { h: 'Jouer and faire in the present', kv: [['jouer', 'je joue, tu joues, il/elle/on joue, nous jouons, vous jouez, ils/elles jouent'],
          ['faire', 'je fais, tu fais, il/elle/on fait, nous faisons, vous faites, ils/elles font']] }
      ] },
      ville: { label: 'En ville', sections: [
        { h: 'Saying what there is', kv: [['Il y a un / une …', 'There is a …'], ['Il n’y a pas de …', 'There is no … (un/une become <b>de</b>)'],
          ['Il n’y a ni … ni …', 'There is neither … nor …'], ['Il y a beaucoup de choses à faire.', 'There are lots of things to do.'],
          ['Il n’y a rien à faire.', 'There is nothing to do.']] },
        { h: 'Describing your town', list: ['C’est une petite ville calme. / C’est une grande ville animée.', 'C’est un joli village dans l’ouest de l’Irlande.',
          'J’adore ma ville parce qu’elle est très animée.'], tip: '<i>ville</i> is feminine: <b>une</b> petit<b>e</b> ville. <i>village</i> is masculine: <b>un</b> petit village.' }
      ] },
      aller: { label: 'Aller + à', sections: [
        { h: 'Aller (to go): irregular', kv: [['je', 'vais'], ['tu', 'vas'], ['il / elle / on', 'va'], ['nous', 'allons'], ['vous', 'allez'], ['ils / elles', 'vont']] },
        { h: 'à + the', kv: [['à + le = <b>au</b>', 'je vais au cinéma'], ['à + la = <b>à la</b>', 'je vais à la piscine'],
          ['à + l’ = <b>à l’</b>', 'je vais à l’église (before a vowel or silent h)'], ['à + les = <b>aux</b>', 'je vais aux magasins']] }
      ] },
      nombres: { label: 'Les nombres', sections: [
        { h: 'Tens', kv: [['10', 'dix'], ['20', 'vingt'], ['30', 'trente'], ['40', 'quarante'], ['50', 'cinquante'], ['60', 'soixante'],
          ['70', 'soixante-dix (60 + 10)'], ['80', 'quatre-vingts (4 × 20)'], ['90', 'quatre-vingt-dix (4 × 20 + 10)'], ['100', 'cent']] },
        { h: 'Patterns', list: ['21, 31, 41, 51, 61 use <b>et un</b>: vingt et un, trente et un', '71 = soixante <b>et onze</b>; 72 = soixante-douze',
          '81 = quatre-vingt-un (no <i>et</i>, no <i>s</i>); 91 = quatre-vingt-onze', '99 = quatre-vingt-dix-neuf'] }
      ] }
    },
    decks: {
      sportsJouer: { label: 'Jouer au …', cards: sportsJouer.map(function (s) { return { front: 'jouer au ' + s[0].replace(/^le /, ''), back: 'to play ' + s[1] }; }) },
      sportsFaire: { label: 'Faire de …', cards: vocab(sportsFaire) },
      instruments: { label: 'Instruments', cards: instruments.map(function (s) {
        var de = s[0].indexOf('le ') === 0 ? 'du ' + s[0].slice(3) : 'de ' + s[0];
        return { front: 'jouer ' + de, back: 'to play the ' + s[1] };
      }) },
      musique: { label: 'La musique', cards: vocab(musique) },
      ville: { label: 'En ville', cards: vocab(ville) },
      nombres: { label: 'Les nombres', cards: nombres.map(function (n) { return { front: n[0], back: n[1] }; }) },
      vetements: { label: 'Les vêtements', cards: vocab(vetements) },
      meteo: { label: 'La météo', cards: vocab(meteo) },
      loisirs: { label: 'Mes loisirs', cards: vocab(loisirs) }
    },
    quizzes: {
      jouerFaire: { label: 'Jouer à or faire de?', questions: [
        { q: 'Je joue ___ tennis.', ans: ['au'], opts: ['du', 'de la', 'à la'] },
        { q: 'Elle fait ___ natation.', ans: ['de la'], opts: ['à la', 'du', 'au'] },
        { q: 'Nous faisons ___ vélo.', ans: ['du'], opts: ['au', 'de la', 'des'] },
        { q: 'Ils jouent ___ rugby.', ans: ['au'], opts: ['du', 'à la', 'aux'] },
        { q: 'Je fais ___ équitation.', ans: ['de l’'], opts: ['du', 'de la', 'à l’'] },
        { q: 'Tu joues ___ cartes ?', ans: ['aux'], opts: ['des', 'au', 'du'] },
        { q: 'I go cycling.', ans: ['Je fais du vélo.'], opts: ['Je joue au vélo.', 'Je fais de vélo.', 'Je joue du vélo.'] },
        { q: 'He plays football.', ans: ['Il joue au foot.'], opts: ['Il fait au foot.', 'Il joue du foot.', 'Il joue le foot.'] },
        { q: 'We do athletics.', ans: ['Nous faisons de l’athlétisme.'], opts: ['Nous jouons à l’athlétisme.', 'Nous faisons du athlétisme.', 'Nous faites de l’athlétisme.'] },
        { q: 'faire (vous)', ans: ['vous faites'], opts: ['vous faisez', 'vous fais', 'vous font'] },
        { q: 'faire (ils)', ans: ['ils font'], opts: ['ils faisent', 'ils fait', 'ils faites'] },
        { q: 'jouer (nous)', ans: ['nous jouons'], opts: ['nous jouez', 'nous joue', 'nous jouent'] }
      ] },
      instruments: { label: 'Jouer de', questions: [
        { q: 'Je joue ___ piano.', ans: ['du'], opts: ['au', 'de la', 'le'] },
        { q: 'Elle joue ___ guitare.', ans: ['de la'], opts: ['à la', 'du', 'la'] },
        { q: 'Il joue ___ violon.', ans: ['du'], opts: ['au', 'de la', 'des'] },
        { q: 'Tu joues ___ batterie ?', ans: ['de la'], opts: ['du', 'à la', 'au'] },
        { q: 'I play the trumpet.', ans: ['Je joue de la trompette.'], opts: ['Je joue à la trompette.', 'Je fais de la trompette.', 'Je joue la trompette.'] },
        { q: 'He plays the saxophone.', ans: ['Il joue du saxophone.'], opts: ['Il joue au saxophone.', 'Il joue de le saxophone.', 'Il fait du saxophone.'] }
      ] },
      musique: { label: 'La musique', questions: toQuiz(musique, 'fr') },
      ville: { label: 'En ville', questions: toQuiz(ville, 'fr').concat([
        { q: 'There is no station.', ans: ['Il n’y a pas de gare.'], opts: ['Il n’y a pas une gare.', 'Il y a pas de gare.', 'Il n’y a de gare.'] },
        { q: 'There is neither a cinema nor a pool.', ans: ['Il n’y a ni cinéma ni piscine.'], opts: ['Il n’y a pas cinéma pas piscine.', 'Il y a ni cinéma ni piscine.', 'Il n’y a ni un cinéma ou une piscine.'] },
        { q: 'There’s nothing to do.', ans: ['Il n’y a rien à faire.'], opts: ['Il y a rien faire.', 'Il n’y a pas à faire.', 'Il y a beaucoup à faire.'] }
      ]) },
      aller: { label: 'Aller + à', questions: [
        { q: 'Je ___ au cinéma. (aller)', ans: ['vais'], opts: ['va', 'vas', 'allons'] },
        { q: 'Nous ___ à la piscine.', ans: ['allons'], opts: ['allez', 'vont', 'vais'] },
        { q: 'Ils ___ au parc.', ans: ['vont'], opts: ['vais', 'allent', 'va'] },
        { q: 'Vous ___ à l’école ?', ans: ['allez'], opts: ['allons', 'vont', 'va'] },
        { q: 'Je vais ___ supermarché.', ans: ['au'], opts: ['à la', 'à le', 'aux'] },
        { q: 'Elle va ___ bibliothèque.', ans: ['à la'], opts: ['au', 'à l’', 'aux'] },
        { q: 'On va ___ hôpital.', ans: ['à l’'], opts: ['au', 'à la', 'à le'] },
        { q: 'Je vais ___ magasins.', ans: ['aux'], opts: ['au', 'à les', 'à la'] },
        { q: 'Tu vas ___ gare ?', ans: ['à la'], opts: ['au', 'à l’', 'aux'] },
        { q: 'Il va ___ stade.', ans: ['au'], opts: ['à la', 'à le', 'aux'] }
      ] },
      nombres: { label: 'Les nombres', questions: toQuiz(nombres, 'fr') },
      vetements: { label: 'Les vêtements', questions: toQuiz(vetements, 'fr') },
      meteo: { label: 'La météo', questions: toQuiz(meteo, 'fr') },
      loisirs: { label: 'Mes loisirs', questions: toQuiz(loisirs, 'fr') }
    },
    matches: {
      sportsFaire: { label: 'Faire de', colL: 'Français', colR: 'English', pairs: toMatch(sportsFaire.slice(0, 7)) },
      instruments: { label: 'Instruments', colL: 'Français', colR: 'English', pairs: toMatch(instruments.slice(0, 7)) },
      ville1: { label: 'En ville 1', colL: 'Français', colR: 'English', pairs: toMatch(ville.slice(0, 8)) },
      ville2: { label: 'En ville 2', colL: 'Français', colR: 'English', pairs: toMatch(ville.slice(8, 16)) },
      nombres: { label: 'Les nombres', colL: 'Français', colR: 'Number', pairs: toMatch([['vingt et un', '21'], ['trente-cinq', '35'], ['quarante-huit', '48'],
        ['soixante-dix', '70'], ['soixante-seize', '76'], ['quatre-vingts', '80'], ['quatre-vingt-treize', '93'], ['cent', '100']]) },
      vetements: { label: 'Les vêtements', colL: 'Français', colR: 'English', pairs: toMatch(vetements.slice(0, 8)) },
      meteo: { label: 'La météo', colL: 'Français', colR: 'English', pairs: toMatch(meteo.slice(0, 8)) }
    },
    practice: {
      moi: { label: 'Moi et ma famille', type: 'lines', intro: 'Complete the sentences for your writing paragraphs.', items: [
        { q: 'J’___ treize ans.', h: '(I am 13)', ans: ['ai'] },
        { q: 'Mon anniversaire, c’est le cinq ___.', h: '(March)', ans: ['mars'] },
        { q: 'Il y a quatre ___ dans ma famille.', h: '(people)', ans: ['personnes'] },
        { q: 'J’ai un frère et une ___.', h: '(sister)', ans: ['sœur', 'soeur'] },
        { q: 'Je suis fille ___.', h: '(only child)', ans: ['unique'] },
        { q: 'Ma mère est ___.', h: '(kind, feminine)', ans: ['gentille'] },
        { q: 'J’habite ___ Cork.', h: '(in)', ans: ['à'] },
        { q: 'C’est une ___ ville calme.', h: '(small)', ans: ['petite'] },
        { q: 'Il n’y a pas ___ gare.', ans: ['de'] },
        { q: 'Pendant mon temps ___, j’aime lire.', h: '(free)', ans: ['libre'] }
      ] },
      jouerFaire: { label: 'Au, du, de la, de l’', type: 'lines', intro: 'Fill in au, aux, du, de la or de l’.', items: [
        { q: 'Je joue ___ hockey.', ans: ['au'] }, { q: 'Il fait ___ ski.', ans: ['du'] }, { q: 'Nous jouons ___ guitare.', tip: '(instrument)', ans: ['de la'] },
        { q: 'Elle fait ___ gymnastique.', ans: ['de la'] }, { q: 'Ils jouent ___ golf.', ans: ['au'] }, { q: 'Tu fais ___ escalade ?', ans: ['de l’', "de l'"] },
        { q: 'Je joue ___ violon.', tip: '(instrument)', ans: ['du'] }, { q: 'On joue ___ cartes.', ans: ['aux'] }, { q: 'Vous faites ___ patinage ?', ans: ['du'] },
        { q: 'Mon frère joue ___ batterie.', tip: '(instrument)', ans: ['de la'] }
      ] },
      ilya: { label: 'Il y a → il n’y a pas de', type: 'lines', intro: 'Make each sentence negative.', items: [
        { q: 'Il y a un cinéma. → Il n’y a pas ___ cinéma.', ans: ['de'] },
        { q: 'Il y a une piscine. → Il n’y a pas ___ piscine.', ans: ['de'] },
        { q: 'Il y a une église. → Il n’y a pas ___ église.', ans: ['d’', "d'"] },
        { q: 'Il y a un stade. → Il n’y a ___ de stade.', ans: ['pas'] },
        { q: 'Il y a une gare et un musée. → Il n’y a ___ gare ni musée.', ans: ['ni'] }
      ] },
      allerConj: { label: 'Aller', type: 'table', intro: 'Conjugate aller (to go).', cols: ['Pronoun', 'English', 'aller'],
        rows: [['je', 'I go', 'vais'], ['tu', 'you go', 'vas'], ['il / elle / on', 'he / she / we go', 'va'], ['nous', 'we go', 'allons'],
          ['vous', 'you go (pl. / formal)', 'allez'], ['ils / elles', 'they go', 'vont']].map(function (r, i) { return [r[0], { dim: r[1] }, { k: String(i), ans: [r[2]] }]; }) },
      allerA: { label: 'Au, à la, à l’, aux', type: 'lines', intro: 'Fill in au, à la, à l’ or aux.', items: [
        { q: 'Je vais ___ parc.', ans: ['au'] }, { q: 'Nous allons ___ plage.', ans: ['à la'] }, { q: 'Elle va ___ école.', ans: ['à l’', "à l'"] },
        { q: 'Ils vont ___ magasins.', ans: ['aux'] }, { q: 'Tu vas ___ boulangerie ?', ans: ['à la'] }, { q: 'On va ___ musée.', ans: ['au'] },
        { q: 'Je vais ___ hôtel.', ans: ['à l’', "à l'"] }, { q: 'Vous allez ___ marché ?', ans: ['au'] }
      ] }
    }
  };

  window.SN_DATA.french = {
    id: 'french',
    title: 'Français',
    subtitle: 'French',
    lang: 'fr',
    marking: { spelling: 'strict', note: 'French: in grammar and writing questions the French spelling and accents count. Comprehension answers written in English are marked for meaning only.' },
    years: { '1': y1, '2': y2 }
  };
})();
