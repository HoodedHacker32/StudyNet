/* StudyNet — English data (2nd Year). Loaded by english.html.
   Built from the F2 English November exam post in the class Team: comprehension (short questions, what/how/why,
   parts of speech, sound images), poetry (two Seamus Heaney poems) and descriptive writing from a picture prompt.
   The poems are copyrighted: notes are in StudyNet's own words, with no quoted lines. Students read the poems in their book; Clearances III links to the publisher's own page. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  function cards(p) { return p.map(function (x) { return { front: x[0], back: x[1] }; }); }
  function pairs(p) { return p.map(function (x) { return { left: x[0], right: x[1] }; }); }

  var PASSAGE = '<blockquote class="passage">The storm arrived just after midnight. Wind hammered the old farmhouse, and the windows rattled in their frames like loose teeth. ' +
    'Nora crept slowly down the stairs, one hand gripping the cold banister. Somewhere below, a door banged, then banged again. ' +
    'The kitchen was black. She held her breath and listened: only the hiss of rain and the slow, steady tick of the clock. ' +
    'Then, from the back porch, came a low, scratching sound.</blockquote>';

  var y2 = {
    blurb: 'English — November exam revision',
    exam: '<b>November exam:</b> comprehension (short questions and what / how / why answers; know your parts of speech, e.g. adjective and adverb, and sound images), ' +
      'poetry (revise <i>When all the others were away at Mass</i> and <i>The Early Purges</i>), and descriptive writing from a picture prompt.',
    store: 'sn_english_y2',
    score: 'english_y2',
    /* Exam bank: exam-style questions written for StudyNet (original passage and prompts). */
    examq: [
      { id: 'en-c-1', topic: 'comp', src: 'Exam style', type: 'group', q: 'Read the passage, then answer the questions.' + PASSAGE, parts: [
        { type: 'short', q: 'At what time did the storm arrive?', ans: ['just after midnight', 'after midnight', 'midnight'], marks: 2, spell: 'lenient' },
        { type: 'mcq', q: 'In “Nora crept <b>slowly</b> down the stairs”, what part of speech is <i>slowly</i>?', ans: 'Adverb', opts: ['Adjective', 'Noun', 'Verb'], marks: 2 },
        { type: 'mcq', q: 'In “the <b>cold</b> banister”, what part of speech is <i>cold</i>?', ans: 'Adjective', opts: ['Adverb', 'Verb', 'Pronoun'], marks: 2 },
        { type: 'written', q: 'Find one sound image in the passage and explain how it adds to the atmosphere.', marks: 6, lines: 4,
          scheme: ['A sound image from the passage, e.g. the windows rattled / a door banged / the hiss of rain / the tick of the clock / a scratching sound (2 marks)',
            'How: names the technique, e.g. onomatopoeia or sibilance, or says what we hear (2 marks)', 'Why: the effect, e.g. builds tension / makes it eerie / makes the reader feel they are there (2 marks)'],
          model: 'The “hiss of rain” is a sound image. The word hiss is onomatopoeia and sounds like the rain. It makes the kitchen feel eerie and silent apart from the rain, so we feel as tense as Nora.' }] },
      { id: 'en-c-2', topic: 'comp', src: 'Exam style', type: 'written', marks: 10, lines: 7,
        q: 'Read the passage.' + PASSAGE + 'How does the writer create suspense in this passage? Answer using <b>what</b>, <b>how</b> and <b>why</b>, with a quotation.',
        scheme: ['What: a clear point about suspense, e.g. the setting is dark and stormy / Nora is alone / a strange noise (3 marks)',
          'How: a technique with a short quotation, e.g. simile “like loose teeth”, sound images, short sentences, the ending on a mystery (4 marks)',
          'Why: the effect on the reader, e.g. we want to read on to find out what is scratching (3 marks)'],
        model: 'The writer creates suspense by making Nora alone in the dark at midnight. The writer uses sound images such as “a door banged, then banged again”, and the repetition makes us nervous. The passage ends on “a low, scratching sound”, so we don’t know what it is and we want to read on.' },
      { id: 'en-c-3', topic: 'comp', src: 'Exam style', type: 'group', q: 'Parts of speech and techniques.', parts: [
        { type: 'mcq', q: '“The wind howled.” <i>Howled</i> is a…', ans: 'Verb', opts: ['Noun', 'Adjective', 'Adverb'], marks: 2 },
        { type: 'mcq', q: '“The sea was a hungry wolf.” This is a…', ans: 'Metaphor', opts: ['Simile', 'Onomatopoeia', 'Alliteration'], marks: 2 },
        { type: 'mcq', q: '“Silent snow settled softly.” This is mainly…', ans: 'Sibilance', opts: ['Onomatopoeia', 'Personification', 'A metaphor'], marks: 2 },
        { type: 'short', q: 'Give the technique: “The trees whispered secrets.”', ans: ['personification'], marks: 2 }] },
      { id: 'en-p-1', topic: 'mass', src: 'Exam style', type: 'written', marks: 10, lines: 7,
        q: 'In <i>When all the others were away at Mass</i>, how does Seamus Heaney show the closeness between himself and his mother? Refer to the poem.',
        scheme: ['What: they share a quiet, close moment peeling potatoes alone together (3 marks)', 'How: a technique or detail from the poem, e.g. sound images of the water and potatoes, they work side by side without needing to talk, the memory returns at her deathbed (4 marks)',
          'Why: the effect, e.g. shows love in an everyday task / makes the ending moving and sad (3 marks)'],
        model: 'Heaney remembers peeling potatoes alone with his mother while everyone else was at Mass. The sound images of the water and the potatoes dropping into the bucket make the memory feel real and peaceful. They hardly speak, but they are close. When the priest prays at her deathbed, he remembers this moment, which shows how much it meant to him.' },
      { id: 'en-p-4', topic: 'mass', src: 'Exam style', type: 'group', q: '<i>When all the others were away at Mass</i>.', parts: [
        { type: 'short', q: 'What job are the poet and his mother doing together?', ans: ['peeling potatoes', 'peeling the potatoes', 'peeling spuds'], marks: 2, spell: 'lenient' },
        { type: 'mcq', q: 'Where is the rest of the family?', ans: 'At Mass', opts: ['At school', 'In the fields', 'At a match'], marks: 2 },
        { type: 'written', q: 'Find one sound image in the poem and explain its effect.', marks: 6, lines: 4,
          scheme: ['A sound image from the poem, e.g. the potatoes dropping into the water / the splashes (2 marks)', 'How: what we hear or the technique (2 marks)', 'Why: the effect, e.g. peaceful, homely, makes the memory vivid (2 marks)'],
          model: 'The sound of the peeled potatoes dropping into the bucket of water is a sound image. The small, gentle splashes make the kitchen feel calm and homely, so we understand why this memory is precious to him.' }] },
      { id: 'en-p-5', topic: 'mass', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'The poem is a sonnet that turns from a memory to the mother’s deathbed. Why do you think Heaney puts these two moments side by side?',
        scheme: ['Contrast: the quiet, close memory against the busy, noisy deathbed (3 marks)', 'Reference to the poem for each moment (2 marks)', 'Why: shows that the simple moment meant more to him than the formal prayers / shows his grief (3 marks)'],
        model: 'At the deathbed the priest prays loudly and the family respond, but Heaney’s mind goes back to the quiet morning peeling potatoes. Putting them side by side shows that the simple, shared moment meant more to him than the formal prayers, and it makes his loss feel deeper.' },
      { id: 'en-p-6', topic: 'purges', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'How does Heaney use sound in <i>The Early Purges</i> to make the drowning of the kittens upsetting? Use what / how / why.',
        scheme: ['What: the drowning is made disturbing for the reader (2 marks)', 'How: sound images or onomatopoeia from the poem (3 marks)', 'Why: the effect, e.g. we hear what the six-year-old hears, so we share his shock (3 marks)'],
        model: 'Heaney makes the drowning disturbing by letting us hear it. He uses onomatopoeia and harsh sounds for the kittens in the water, so the scene is vivid. Because we hear what the six-year-old hears, we share his shock and fear.' },
      { id: 'en-p-7', topic: 'mass', src: 'Class plan', type: 'written', marks: 20, lines: 14,
        q: '“A poet can use language and imagery to make the reader feel strong emotions.” Choose one poem you have studied and explain how the poet uses language and imagery to create an emotional response in you as the reader. Support your answer with references to the poem.',
        scheme: ['Introduction that addresses the question, with relevant background (2 marks)', 'Point 1: what / how / why, with a quotation and analysis of its effect (5 marks)',
          'Point 2: what / how / why, with a quotation and analysis (5 marks)', 'Point 3 (or 4): what / how / why, with a quotation and analysis (5 marks)', 'Conclusion and a clear personal emotional response throughout (3 marks)'],
        model: 'In When all the others were away at Mass, Heaney uses moving, domestic imagery to share two very different memories of his mother, and it made me feel reflective and sad. The simile “like solder weeping off the soldering iron” suggests their bond is unbreakable, while the word weeping hints at the tears to come. After the turn, the priest “went hammer and tongs at the prayers for the dying”, a noisy contrast to their quiet morning. The final line, “Never closer the whole rest of our lives”, is heart-breaking because the simple memory meant more than anything else.' },
      { id: 'en-p-2', topic: 'purges', src: 'Exam style', type: 'written', marks: 10, lines: 7,
        q: 'How do the speaker’s feelings change from the start to the end of <i>The Early Purges</i>? Refer to the poem.',
        scheme: ['Start: as a six-year-old he is shocked, frightened and upset by the drowning of the kittens (3 marks)', 'End: as he grows up he becomes hardened and accepts killing pests on a farm as normal (3 marks)',
          'Reference to the poem, e.g. the sounds and images of the kittens, Dan Taggart’s attitude, the shift in the last stanzas (4 marks)'],
        model: 'At the start the young boy is horrified when Dan Taggart drowns the kittens: the sounds of the drowning and the image of their bodies haunt him. Over time he sees more animals killed and stops being upset. By the end he speaks like an adult farmer: pests have to be controlled, and people from the town who object are being soft.' },
      { id: 'en-p-3', topic: 'purges', src: 'Exam style', type: 'group', q: 'The two poems.', parts: [
        { type: 'mcq', q: 'Who wrote both poems?', ans: 'Seamus Heaney', opts: ['Patrick Kavanagh', 'W. B. Yeats', 'Eavan Boland'], marks: 2 },
        { type: 'mcq', q: '<i>When all the others were away at Mass</i> has 14 lines. It is a…', ans: 'Sonnet', opts: ['Ballad', 'Haiku', 'Limerick'], marks: 2 },
        { type: 'mcq', q: 'In <i>The Early Purges</i>, the speaker is how old when he first sees the kittens drowned?', ans: 'Six', opts: ['Twelve', 'Sixteen', 'Three'], marks: 2 },
        { type: 'written', q: 'Which of the two poems did you prefer? Give one reason, with a reference.', marks: 4, lines: 3,
          scheme: ['A clear choice and reason, e.g. the tender memory / the shocking honesty (2 marks)', 'A reference to the poem that backs it up (2 marks)'],
          model: 'I preferred When all the others were away at Mass because it shows love in a simple everyday task, peeling potatoes, and the ending at the deathbed is very moving.' }] },
      { id: 'en-w-1', topic: 'writing', src: 'Exam style', type: 'written', marks: 30, lines: 16,
        q: '<b>Picture prompt:</b> imagine a photograph of an empty seaside funfair at dusk: a still Ferris wheel, rain on the ground, one light flickering above a closed ticket booth. Write a piece of <b>descriptive writing</b> inspired by the picture.',
        scheme: ['Clearly describes the scene in the prompt and keeps to description, not a long story (6 marks)', 'Uses the senses: sight, sound, touch, smell (6 marks)',
          'Uses techniques, e.g. simile, metaphor, personification, onomatopoeia, alliteration (8 marks)', 'Structure and atmosphere, e.g. zooming in on details, time passing, building a mood (6 marks)', 'Accuracy: spelling, punctuation, paragraphs (4 marks)'],
        model: 'The Ferris wheel stood frozen against a bruised purple sky, its empty seats swaying like the last leaves of autumn. Rain needled the tarmac. Somewhere, a loose sign tapped against a pole, tap, tap, tap, a lonely heartbeat. Above the ticket booth a single bulb flickered, blinking awake, then dozing off again…' },
      { id: 'en-w-2', topic: 'writing', src: 'Exam style', type: 'written', marks: 30, lines: 16,
        q: '<b>Picture prompt:</b> imagine a photograph of a busy city street market on a frosty morning: steam rising from a food stall, crowds in scarves, a busker playing in a doorway. Write a piece of <b>descriptive writing</b> inspired by the picture.',
        scheme: ['Clearly describes the scene in the prompt and keeps to description, not a long story (6 marks)', 'Uses the senses: sight, sound, touch, smell, taste (6 marks)',
          'Uses techniques, e.g. simile, metaphor, personification, onomatopoeia, alliteration (8 marks)', 'Structure and atmosphere, e.g. zooming in on details, time passing, building a mood (6 marks)', 'Accuracy: spelling, punctuation, paragraphs (4 marks)'],
        model: 'Frost sugared the cobblestones. Steam curled from the crêpe stall like a lazy grey cat stretching into the cold air, carrying the smell of melting butter. Boots crunched, voices clattered, and from a shadowy doorway a fiddle sang out over the noise…' },
      { id: 'en-w-3', topic: 'writing', src: 'Exam style', type: 'group', q: 'Descriptive writing skills.', parts: [
        { type: 'mcq', q: 'Which is a simile?', ans: 'The fog crept in like a grey ghost.', opts: ['The fog was a grey blanket.', 'The fog crept in.', 'Fog fell fast.'], marks: 2 },
        { type: 'mcq', q: '“Show, don’t tell” means…', ans: 'Describe details so the reader works out the feeling', opts: ['Use lots of dialogue', 'Tell the reader exactly how to feel', 'Write in the present tense'], marks: 2 },
        { type: 'short', q: 'Name the technique: “The bacon sizzled and spat in the pan.”', ans: ['onomatopoeia'], marks: 2 },
        { type: 'written', q: 'Write two sentences describing a beach in winter. Use one sound image and one simile.', marks: 4, lines: 3,
          scheme: ['A sound image, e.g. waves crashing / gulls screeching (2 marks)', 'A correct simile using like or as (2 marks)'],
          model: 'Waves crashed and hissed against the empty shore. The sand was as cold and grey as ash.' }] }
    ],
    topics: [
      { id: 'exam', info: true, label: 'The exam', icon: 'target', desc: 'What’s on the November exam and how to answer', notes: ['exam'] },
      { id: 'comp', label: 'Comprehension', icon: 'text', desc: 'What / how / why answers, parts of speech and sound images',
        notes: ['whw', 'speech', 'images'], fc: ['speech', 'techniques'], quiz: ['speech', 'techniques'], match: ['speech'], prac: ['speech'] },
      { id: 'mass', label: 'When all the others were away at Mass', icon: 'quill', desc: 'Seamus Heaney: a memory of his mother', notes: ['mass'], fc: ['mass'], quiz: ['mass'] },
      { id: 'purges', label: 'The Early Purges', icon: 'quill', desc: 'Seamus Heaney: growing up on the farm', notes: ['purges'], fc: ['purges'], quiz: ['purges'] },
      { id: 'writing', label: 'Descriptive writing', icon: 'pencil', desc: 'Writing from a picture prompt', notes: ['describe'], fc: ['techniques'], quiz: ['describe'], match: ['techniques'], prac: ['describe'] }
    ],
    notes: {
      exam: { label: 'The exam', sections: [
        { h: 'What’s on it', kv: [['Comprehension', 'Short questions on an unseen passage, and longer <b>what / how / why</b> answers. Be able to spot parts of speech (e.g. an <b>adjective</b> or <b>adverb</b>) and <b>sound images</b>.'],
          ['Poetry', 'Two Seamus Heaney poems: <i>When all the others were away at Mass</i> and <i>The Early Purges</i>. Re-read both in your book.'],
          ['Descriptive writing', 'You’re given a <b>picture</b>. Write a piece describing it, using the senses and techniques.']] },
        { h: 'In the exam', list: ['Read each question twice and underline the key words (how, why, describe).', 'Short quotes back up your points: a few words is enough.',
          'Look at the marks: more marks means more points.', 'Leave five minutes to check spelling and punctuation.'] }
      ] },
      whw: { label: 'What, how, why', sections: [
        { h: 'Answer in three steps', kv: [['What', 'Make your point. Answer the question directly.'], ['How', 'Show how the writer does it: name the <b>technique</b> and give a short <b>quote</b>.'],
          ['Why', 'Explain the <b>effect</b>: what it makes the reader see, feel or think.']],
          tip: 'Useful phrases: “The writer creates…”, “This is shown when…”, “The word … suggests…”, “This makes the reader feel…”' },
        { h: 'Example', p: ['<b>Q:</b> How does the writer make the storm frightening?', '<b>What:</b> The writer makes the storm sound violent. <b>How:</b> The writer uses the verb “hammered” and the simile “like loose teeth”. <b>Why:</b> This makes the house seem weak and under attack, so the reader feels Nora’s fear.'] }
      ] },
      speech: { label: 'Parts of speech', sections: [
        { h: 'The main ones', kv: [['Noun', 'A person, place or thing: <i>girl, Cork, clock</i>'], ['Verb', 'An action or state: <i>run, whisper, is</i>'], ['Adjective', 'Describes a noun: <i>a <b>cold</b> wind</i>'],
          ['Adverb', 'Describes a verb (how, when, where): <i>she crept <b>slowly</b></i>. Many end in -ly'], ['Pronoun', 'Takes the place of a noun: <i>he, she, it, they</i>'],
          ['Preposition', 'Shows position: <i>under, behind, on</i>'], ['Conjunction', 'Joins ideas: <i>and, but, because</i>']] },
        { h: 'Spot them quickly', list: ['Adjective: ask “what kind?” about a noun.', 'Adverb: ask “how?” or “when?” about a verb.', 'Verb: can you put “I” or “she” in front of it?'] }
      ] },
      images: { label: 'Images and sound', sections: [
        { h: 'Images', kv: [['Visual image', 'A picture in words: what you can <b>see</b>.'], ['Sound image', 'What you can <b>hear</b>: <i>the rain hissed, the gate creaked</i>.'],
          ['Simile', 'Compares using <b>like</b> or <b>as</b>: <i>as cold as ice</i>.'], ['Metaphor', 'Says something <b>is</b> something else: <i>the classroom was a zoo</i>.'],
          ['Personification', 'Gives a thing human qualities: <i>the wind howled</i>.']] },
        { h: 'Sound techniques', kv: [['Onomatopoeia', 'A word that sounds like its meaning: <i>bang, sizzle, crunch</i>.'], ['Alliteration', 'Words starting with the same sound: <i>big brown bear</i>.'],
          ['Sibilance', 'Repeated <i>s</i> sounds, often soft or sinister: <i>silent sea</i>.'], ['Assonance', 'Repeated vowel sounds: <i>the rain in Spain</i>.']] }
      ] },
      mass: { label: 'When all the others were away at Mass', sections: [
        { h: 'About the poem', p: ['By <b>Seamus Heaney</b>, the third sonnet in <i>Clearances</i> (1987), which he wrote in memory of his mother. In 2015 it was voted Ireland’s favourite poem of the last 100 years.',
          'Read the full poem in your book, or on <a class="link" href="https://fsgworkinprogress.com/2015/03/13/when-all-the-others-were-away-at-mass/" target="_blank" rel="noopener">his publisher’s website</a> (opens in a new tab).'] },
        { h: 'What happens', list: ['Heaney remembers being alone with his mother on a Sunday morning, peeling potatoes, while the rest of the family were at Mass.',
          'The kitchen is quiet: they work side by side, and the only sounds are the potatoes dropping into the water.', 'Years later, at her deathbed, the priest prays and the family respond, but Heaney thinks back to that quiet morning.',
          'He realises that moment was when he felt closest to her in his whole life.'] },
        { h: 'Themes', kv: [['Love', 'Shown in a simple, everyday task rather than in words.'], ['Memory', 'A small moment becomes precious after she has died.'], ['Grief', 'The busy deathbed contrasts with the calm memory.']] },
        { h: 'Techniques', kv: [['Sonnet', '14 lines. The first eight lines are the memory; then it turns (the <b>volta</b>) to her deathbed.'], ['Sound images', 'The water and the potatoes falling into the bucket: gentle, homely sounds.'],
          ['Simile', 'The peeled potatoes dropping into the water are compared to drops of solder falling from a soldering iron: small, bright and precious.'], ['Contrast', 'The noise of prayers at the deathbed against the quiet of the kitchen.']] },
        { h: 'Key quotes to learn', kv: [['“I was all hers”', 'Closeness: for once he has his mother to himself.'], ['“Like solder weeping off the soldering iron”', '<b>Simile</b>: the peeled potatoes dropping into the water. Solder joins two metals, so their bond seems unbreakable. <i>Weeping</i> (personification) foreshadows the crying at the deathbed.'],
          ['“Little pleasant splashes”', '<b>Sound image</b>: gentle, homely sounds of the shared task.'], ['“Went hammer and tongs at the prayers for the dying”', '<b>Contrast</b> (after the volta): the loud, busy deathbed.'],
          ['“our fluent dipping knives”', '<b>Visual image</b>: they work in perfect rhythm together.'], ['“Never closer the whole rest of our lives”', 'The last line: the quiet memory was their closest moment.']] },
        { h: 'Tone', p: ['Tender, nostalgic and sad.'] },
        { h: 'The 20-mark question (class plan)', p: ['<b>Q:</b> “A poet can use language and imagery to make the reader feel strong emotions.” Choose one poem you have studied and explain how the poet uses language and imagery to create an emotional response in you.'],
          list: ['<b>Plan:</b> a short intro, 3 or 4 strong points, a conclusion.', '<b>Intro:</b> answer the question and give one piece of background, e.g. Heaney was the eldest of nine, so quiet time alone with his mother was precious.',
            '<b>Each point:</b> WHAT (your point) → HOW (a quote) → WHY (analyse its effect on you).', '<b>Verbs:</b> uses, creates, illustrates, presents, conveys.',
            '<b>Imagery adjectives:</b> moving, domestic, intimate, heart-breaking, contrasting, evocative.', '<b>How you felt:</b> moved, reflective, pensive, nostalgic, gloomy, content.'] }
      ] },
      purges: { label: 'The Early Purges', sections: [
        { h: 'About the poem', p: ['By <b>Seamus Heaney</b>, from his first collection, <i>Death of a Naturalist</i> (1966), about growing up on a farm. Read the full poem in your book.'] },
        { h: 'What happens', list: ['At six, the boy watches Dan Taggart drown unwanted kittens in a bucket. He is horrified and can’t stop thinking about it.',
          'Dan is hard and practical: he sees the kittens as pests.', 'Over the years the boy sees rats, crows and other animals killed, and the fear fades.',
          'By the end he talks like Dan: on a farm, pests have to be kept down, and people from the town who complain don’t understand.'] },
        { h: 'Themes', kv: [['Growing up', 'Childhood innocence gives way to an adult, hardened view.'], ['Life and death on the farm', 'Killing animals is part of everyday farm life.'],
          ['Town v country', 'He thinks town people’s feelings about animals are unrealistic.']] },
        { h: 'Class quotes to learn', kv: [['“I was six when I first saw kittens drown”', 'Blunt opening: a child’s shocking first experience of death.'],
          ['“scraggy wee shits”', 'Dan Taggart’s callous disregard for the vulnerable animals.'], ['“Soft paws scraping like mad”', '<b>Sound image</b>: the kittens’ desperate struggle.'],
          ['“Like wet gloves they bobbed and shone till he sluiced / Them out on the dunghill, glossy and dead”', '<b>Simile</b>: the dead kittens are now just objects, thrown on the dunghill.'],
          ['“turn mealy and crisp”', 'A horrifying, grotesque, unsettling, disquieting image of the bodies rotting.'],
          ['“I just shrug ‘Bloody pups’. It makes sense”', 'The adult now talks like Dan: he has become hardened.'], ['“But on well-run farms pests have to be kept down”', 'The last line: he accepts the farm’s logic.']] },
        { h: 'More quotes', kv: [['“a frail metal sound”', '<b>Sound image</b>: the kittens hitting the bucket.'], ['“Sure, isn’t it better for them now?”', 'Dan’s hard, practical attitude.'],
          ['“Suddenly frightened, for days I sadly hung / Round the yard”', 'The boy’s fear and sadness.'], ['“living displaces false sentiments”', 'The turn: as he grows up, feelings give way to farm logic.']] },
        { h: 'Techniques', kv: [['Sound images', 'Onomatopoeia and harsh sounds make the drowning vivid and upsetting.'], ['Visual images', 'Detailed, disturbing pictures of the drowned kittens.'],
          ['Tercets', 'Three-line stanzas that move steadily through time.'], ['Change of tone', 'From frightened and upset to blunt and matter-of-fact. Is the adult right, or has he lost something?']] }
      ] },
      describe: { label: 'Descriptive writing', sections: [
        { h: 'From a picture prompt', list: ['Look closely: what is in the front, middle and back of the picture? What time of day, weather, season?',
          'Describe; don’t tell a long story. A small change (light fading, rain starting) is enough to give it movement.', 'Write in the present or past tense, and stay in it.'] },
        { h: 'Use all five senses', kv: [['Sight', 'Colours, light and shadow, movement'], ['Sound', 'Near and far sounds, silence'], ['Touch', 'Temperature, texture, wind'], ['Smell', 'Food, salt air, smoke'], ['Taste', 'If it fits: salt spray, cold air']] },
        { h: 'Techniques', list: ['Simile and metaphor', 'Personification', 'Onomatopoeia, alliteration and sibilance', 'Strong verbs (<i>crept</i>, not <i>went</i>) and precise adjectives', 'Short sentences for tension; longer ones for calm'] },
        { h: 'Sentence patterns from class', kv: [['Comparative: -er, more, more', 'Every lesson, she felt smaller, more useless, more ineffective.'],
          ['Fortunately / Unfortunately', 'Unfortunately, the door was locked. Fortunately, there was a cat flap just big enough to fit through.']] },
        { h: 'Structure', kv: [['Opening', 'A striking image or sound.'], ['Middle', 'Zoom in on details, one paragraph each.'], ['Ending', 'Zoom out, or a change of light or mood.']],
          tip: 'Show, don’t tell: instead of “it was scary”, describe what makes it scary.' }
      ] }
    },
    decks: {
      speech: { label: 'Parts of speech', cards: cards([['Noun', 'A person, place or thing'], ['Verb', 'An action or state'], ['Adjective', 'Describes a noun'], ['Adverb', 'Describes a verb: how, when, where'],
        ['Pronoun', 'Replaces a noun: he, she, it'], ['Preposition', 'Shows position: under, on, behind'], ['Conjunction', 'Joins ideas: and, but, because']]) },
      techniques: { label: 'Techniques', cards: cards([['Simile', 'A comparison using like or as'], ['Metaphor', 'Says one thing is another'], ['Personification', 'Gives a thing human qualities'],
        ['Onomatopoeia', 'A word that sounds like its meaning'], ['Alliteration', 'Words starting with the same sound'], ['Sibilance', 'Repeated s sounds'], ['Assonance', 'Repeated vowel sounds'],
        ['Sound image', 'Something you can hear in the writing'], ['Visual image', 'Something you can see in the writing']]) },
      mass: { label: 'When all the others…', cards: cards([['Poet', 'Seamus Heaney'], ['Form', 'A sonnet: 14 lines'], ['What happens', 'He remembers peeling potatoes alone with his mother; at her deathbed he recalls it'],
        ['Main theme', 'Love and closeness between mother and son'], ['Volta', 'The turn from the memory to her deathbed'], ['Tone', 'Tender, nostalgic, sad']]) },
      purges: { label: 'The Early Purges', cards: cards([['Poet', 'Seamus Heaney'], ['Form', 'Tercets (three-line stanzas)'], ['Opening event', 'At six, he sees Dan Taggart drown kittens'],
        ['Change', 'From horror to accepting killing pests on the farm'], ['Main themes', 'Growing up; life and death on the farm'], ['Tone at the end', 'Blunt, matter-of-fact']]) }
    },
    quizzes: {
      speech: { label: 'Parts of speech', questions: [
        { q: '“She sang <b>beautifully</b>.” <i>beautifully</i> is a…', ans: ['adverb'], opts: ['adjective', 'noun', 'verb'] },
        { q: '“A <b>rusty</b> gate.” <i>rusty</i> is a…', ans: ['adjective'], opts: ['adverb', 'verb', 'noun'] },
        { q: '“The dog <b>barked</b>.” <i>barked</i> is a…', ans: ['verb'], opts: ['noun', 'adjective', 'adverb'] },
        { q: '“The cat hid <b>under</b> the bed.” <i>under</i> is a…', ans: ['preposition'], opts: ['conjunction', 'adverb', 'pronoun'] },
        { q: '“I was tired <b>but</b> happy.” <i>but</i> is a…', ans: ['conjunction'], opts: ['preposition', 'pronoun', 'adverb'] },
        { q: '“<b>They</b> left early.” <i>They</i> is a…', ans: ['pronoun'], opts: ['noun', 'conjunction', 'verb'] },
        { q: '“The <b>clock</b> ticked.” <i>clock</i> is a…', ans: ['noun'], opts: ['verb', 'adjective', 'pronoun'] },
        { q: '“He answered <b>quickly</b>.” <i>quickly</i> is a…', ans: ['adverb'], opts: ['adjective', 'verb', 'conjunction'] }] },
      techniques: { label: 'Name the technique', questions: [
        { q: '“As quiet as a mouse.”', ans: ['simile'], opts: ['metaphor', 'personification', 'onomatopoeia'] },
        { q: '“Her words were daggers.”', ans: ['metaphor'], opts: ['simile', 'alliteration', 'sibilance'] },
        { q: '“The door groaned open.”', ans: ['personification'], opts: ['simile', 'metaphor', 'assonance'] },
        { q: '“Crash! Bang! Thud!”', ans: ['onomatopoeia'], opts: ['alliteration', 'metaphor', 'personification'] },
        { q: '“Peter picked purple plums.”', ans: ['alliteration'], opts: ['assonance', 'sibilance', 'simile'] },
        { q: '“The snake slid silently.”', ans: ['sibilance'], opts: ['onomatopoeia', 'metaphor', 'assonance'] },
        { q: '“The rain hissed on the roof” is mainly a…', ans: ['sound image'], opts: ['visual image', 'simile', 'metaphor'] }] },
      mass: { label: 'When all the others…', questions: [
        { q: 'Who wrote the poem?', ans: ['Seamus Heaney'], opts: ['Patrick Kavanagh', 'W. B. Yeats', 'Eavan Boland'] },
        { q: 'What were the poet and his mother doing?', ans: ['Peeling potatoes'], opts: ['Saying the rosary', 'Baking bread', 'Washing clothes'] },
        { q: 'Where was the rest of the family?', ans: ['At Mass'], opts: ['At school', 'At a funeral', 'In the fields'] },
        { q: 'How many lines does a sonnet have?', ans: ['14'], opts: ['12', '16', '10'] },
        { q: 'What is the main theme?', ans: ['Love between mother and son'], opts: ['Life on a farm', 'Religion and the Church', 'Anger at death'] }] },
      purges: { label: 'The Early Purges', questions: [
        { q: 'How old is the speaker at the start?', ans: ['Six'], opts: ['Ten', 'Twelve', 'Sixteen'] },
        { q: 'Who drowns the kittens?', ans: ['Dan Taggart'], opts: ['His father', 'A neighbour’s son', 'The vet'] },
        { q: 'How does the boy feel at first?', ans: ['Horrified and upset'], opts: ['Excited', 'Bored', 'Proud'] },
        { q: 'How does his view change as he grows up?', ans: ['He accepts killing pests as normal'], opts: ['He refuses to work on the farm', 'He becomes a vet', 'He forgets the kittens'] },
        { q: 'The poem is written in…', ans: ['Tercets'], opts: ['Couplets', 'Quatrains', 'One long stanza'] }] },
      describe: { label: 'Descriptive writing', questions: [
        { q: 'In descriptive writing you should mainly…', ans: ['Describe the scene with the senses'], opts: ['Tell a long story with lots of action', 'Write a letter', 'Give your opinion'] },
        { q: 'Which verb is stronger?', ans: ['crept'], opts: ['went', 'got', 'did'] },
        { q: 'Short sentences usually create…', ans: ['tension'], opts: ['calm', 'humour', 'confusion'] },
        { q: 'A good way to structure a description is to…', ans: ['Zoom in on details, then zoom out'], opts: ['Write one long paragraph', 'Start with the ending', 'List everything in the picture'] }] }
    },
    matches: {
      speech: { label: 'Parts of speech', colL: 'Word type', colR: 'Example', pairs: pairs([['Adjective', 'a dark night'], ['Adverb', 'ran quickly'], ['Verb', 'whispered'], ['Noun', 'lighthouse'], ['Preposition', 'beneath'], ['Conjunction', 'because']]) },
      techniques: { label: 'Techniques', colL: 'Technique', colR: 'Example', pairs: pairs([['Simile', 'as pale as milk'], ['Metaphor', 'the moon was a coin'], ['Personification', 'the stars winked'], ['Onomatopoeia', 'buzz'], ['Alliteration', 'wild windy weather'], ['Sibilance', 'soft sea spray']]) }
    },
    practice: {
      speech: { label: 'Parts of speech', type: 'lines', intro: 'Name the part of speech of the word in brackets.', items: [
        { q: 'The old man walked slowly. (slowly) ___', ans: ['adverb'] }, { q: 'The old man walked slowly. (old) ___', ans: ['adjective'] },
        { q: 'The old man walked slowly. (walked) ___', ans: ['verb'] }, { q: 'She sat beside the fire. (beside) ___', ans: ['preposition'] },
        { q: 'We stayed in because it rained. (because) ___', ans: ['conjunction'] }, { q: 'The wind rattled the windows. (windows) ___', ans: ['noun'] }] },
      describe: { label: 'Name the technique', type: 'lines', intro: 'Name the technique used.', items: [
        { q: 'The fire crackled and popped. ___', ans: ['onomatopoeia'] }, { q: 'The waves were wild white horses. ___', ans: ['metaphor'] },
        { q: 'The streetlight stood guard all night. ___', ans: ['personification'] }, { q: 'The lake was as smooth as glass. ___', ans: ['simile'] },
        { q: 'Seven silver swans swam south. ___', ans: ['sibilance', 'alliteration'] }] }
    }
  };

  window.SN_DATA.english = { id: 'english', title: 'English', subtitle: 'English',
    marking: { spelling: 'lenient', note: 'English: mark for meaning. Reward a clear point, a short quotation or detail, and an explanation of the effect (what / how / why). Spelling counts only where the scheme says accuracy.' },
    years: { '2': y2 } };
})();
