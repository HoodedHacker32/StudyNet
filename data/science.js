/* StudyNet — Science data (2nd Year). Loaded by science.html. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  function cards(pairs) { return pairs.map(function (p) { return { front: p[0], back: p[1] }; }); }
  function pairs(list) { return list.map(function (p) { return { left: p[0], right: p[1] }; }); }

  // First 20 elements: [number, name, symbol, mass number]
  var ELEMENTS = [[1, 'Hydrogen', 'H', 1], [2, 'Helium', 'He', 4], [3, 'Lithium', 'Li', 7], [4, 'Beryllium', 'Be', 9], [5, 'Boron', 'B', 11],
    [6, 'Carbon', 'C', 12], [7, 'Nitrogen', 'N', 14], [8, 'Oxygen', 'O', 16], [9, 'Fluorine', 'F', 19], [10, 'Neon', 'Ne', 20],
    [11, 'Sodium', 'Na', 23], [12, 'Magnesium', 'Mg', 24], [13, 'Aluminium', 'Al', 27], [14, 'Silicon', 'Si', 28], [15, 'Phosphorus', 'P', 31],
    [16, 'Sulfur', 'S', 32], [17, 'Chlorine', 'Cl', 35], [18, 'Argon', 'Ar', 40], [19, 'Potassium', 'K', 39], [20, 'Calcium', 'Ca', 40]];

  var y2 = {
    blurb: 'Science — November exam revision',
    exam: '<b>November exam:</b> food and digestion; elements, compounds and mixtures; solutions; separating mixtures; force; the structure of the atom; the breathing system. <b>Learn the formulas</b>: they won’t be given in the exam.',
    store: 'sn_science_y2',
    score: 'science_y2',
    /* Exam bank: Junior Cycle style questions with marking schemes. MCQs and short answers from the quizzes
       and practice are added automatically by exam.js. */
    examq: [
      { id: 'sc-br-3', topic: 'breathing', src: 'Exam style', type: 'group', q: 'The breathing system.', parts: [
        { type: 'mcq', q: 'Which tube carries air from the throat down to the lungs?', ans: 'Trachea', opts: ['Bronchus', 'Alveolus', 'Diaphragm'], marks: 2 },
        { type: 'short', q: 'Name the tiny air sacs where gas exchange happens.', ans: ['alveoli', 'alveolus', 'air sacs'], marks: 2 },
        { type: 'short', q: 'Name the dome-shaped muscle below the lungs that helps us breathe.', ans: ['diaphragm', 'the diaphragm'], marks: 2 },
        { type: 'written', q: 'Explain two ways the alveoli are suited to gas exchange.', marks: 4, lines: 3,
          scheme: ['Any two: walls one cell thick / large surface area / moist / rich blood supply (capillaries) (2 marks each)'],
          model: 'Their walls are only one cell thick, so gases pass through quickly, and they are surrounded by capillaries with a rich blood supply.' }] },
      { id: 'sc-br-4', topic: 'breathing', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'A student measured her breathing rate at rest and straight after running. Explain why her breathing rate went up, and name one lifestyle choice that keeps the lungs healthy.',
        scheme: ['Muscles need more energy, so respiration speeds up (2 marks)', 'More oxygen is needed and more carbon dioxide must be removed (2 marks)', 'Lifestyle choice, e.g. not smoking / regular exercise / avoiding polluted air (2 marks)'],
        model: 'Her muscles needed more energy, so respiration speeded up. She breathed faster to take in more oxygen and get rid of the extra carbon dioxide. Not smoking keeps the lungs healthy.' },
      { id: 'sc-f-5', topic: 'force', src: 'Exam style', type: 'group', q: 'Mass and weight. (Take g = 9.8 N/kg.)', parts: [
        { type: 'short', q: 'A ball has a mass of 0.5 kg. Calculate its weight in newtons.', ans: ['4.9', '4.9 N', '4.9N', '4.9 newtons'], marks: 3 },
        { type: 'mcq', q: 'What is the unit of force?', ans: 'Newton (N)', opts: ['Kilogram (kg)', 'Joule (J)', 'Watt (W)'], marks: 2 },
        { type: 'written', q: 'Explain the difference between mass and weight.', marks: 4, lines: 3,
          scheme: ['Mass: the amount of matter in an object, in kg; it doesn’t change (2 marks)', 'Weight: the force of gravity on the mass, in newtons; it changes with gravity, e.g. on the Moon (2 marks)'],
          model: 'Mass is the amount of matter in an object, measured in kilograms, and it is the same everywhere. Weight is the pull of gravity on that mass, measured in newtons, so it would be less on the Moon.' }] },
      { id: 'sc-f-6', topic: 'force', src: 'Exam style', type: 'group', q: 'Motion graphs and speed.', parts: [
        { type: 'mcq', q: 'On a distance–time graph, a flat horizontal line shows an object that…', ans: 'Is not moving', opts: ['Moves at a constant speed', 'Is accelerating'], marks: 2 },
        { type: 'mcq', q: 'A straight line sloping upwards on a distance–time graph shows…', ans: 'Constant speed', opts: ['No movement', 'Slowing down'], marks: 2 },
        { type: 'short', q: 'A cyclist travels 120 m in 8 s. Calculate her average speed in m/s.', ans: ['15', '15 m/s', '15m/s'], marks: 3 }] },
      { id: 'sc-atom-6', topic: 'atom', src: 'Exam style', type: 'group', q: 'Bohr’s model of the atom.', parts: [
        { type: 'mcq', q: 'Which particle orbits the nucleus and has a negative charge?', ans: 'Electron', opts: ['Proton', 'Neutron'], marks: 2 },
        { type: 'short', q: 'Name the particle in the nucleus that has no charge.', ans: ['neutron', 'the neutron', 'neutrons'], marks: 2 },
        { type: 'written', q: 'Bohr’s model is sometimes called a ‘planetary model’. Suggest why.', marks: 3, lines: 2,
          scheme: ['Electrons orbit the nucleus in fixed paths (shells), like planets orbiting the Sun (3 marks)'],
          model: 'Because the electrons move in fixed orbits around the nucleus, like planets orbiting the Sun.' }] },
      { id: 'sc-ecm-4', topic: 'ecm', src: 'Exam style', type: 'group', q: 'Physical and chemical change.', parts: [
        { type: 'mcq', q: 'Melting ice is a physical change. Burning paper is a…', ans: 'Chemical change', opts: ['Physical change'], marks: 2 },
        { type: 'short', q: 'Write the chemical formula for water.', ans: ['H2O', 'H₂O'], marks: 2 },
        { type: 'written', q: 'Give two differences between a physical change and a chemical change.', marks: 4, lines: 3,
          scheme: ['Chemical change makes a new substance; a physical change doesn’t (2 marks)', 'A physical change is usually easy to reverse; a chemical change usually isn’t / chemical changes often give out heat, light or gas (2 marks)'],
          model: 'A chemical change makes a new substance, but a physical change doesn’t. A physical change like melting is easy to reverse, while burning can’t be undone.' }] },
      { id: 'sc-ecm-5', topic: 'ecm', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain the difference between an element, a compound and a mixture. Give an example of each.',
        scheme: ['Element: one type of atom, e.g. oxygen / iron (2 marks)', 'Compound: two or more elements chemically combined in a fixed ratio, e.g. water / carbon dioxide (2 marks)', 'Mixture: two or more substances mixed but not chemically joined, e.g. air / salt water (2 marks)'],
        model: 'An element is made of only one type of atom, such as iron. A compound is two or more elements chemically joined in a fixed ratio, such as water (H₂O). A mixture is substances mixed but not joined, such as air.' },
      { id: 'sc-sol-4', topic: 'solutions', src: 'Exam style', type: 'group', q: 'A student investigates how temperature affects how much sugar dissolves in 100 cm³ of water.', parts: [
        { type: 'short', q: 'Name the variable the student changes.', ans: ['temperature', 'the temperature', 'temperature of the water'], marks: 2 },
        { type: 'written', q: 'Name two variables that must be kept the same for a fair test.', marks: 4, lines: 2,
          scheme: ['Any two: volume of water / type of sugar / amount of stirring / size of sugar grains (2 marks each)'],
          model: 'The volume of water and the type of sugar.' },
        { type: 'written', q: 'Write a hypothesis for this investigation.', marks: 3, lines: 2,
          scheme: ['A testable prediction linking the two variables, e.g. the higher the temperature, the more sugar will dissolve (3 marks)'],
          model: 'The hotter the water, the more sugar will dissolve in it.' },
        { type: 'written', q: 'Why should the student repeat the experiment?', marks: 2, lines: 2,
          scheme: ['To check results are reliable / reduce the effect of errors / get an average (2 marks)'],
          model: 'To make sure the results are reliable and not caused by a mistake.' }] },
      { id: 'sc-sol-5', topic: 'solutions', src: 'Exam style', type: 'group', q: 'Solutions.', parts: [
        { type: 'short', q: 'What is a substance that dissolves in a liquid called?', ans: ['solute', 'a solute', 'soluble'], marks: 2 },
        { type: 'short', q: 'What is the liquid that does the dissolving called?', ans: ['solvent', 'a solvent', 'the solvent'], marks: 2 },
        { type: 'short', q: 'What is a solution that can’t dissolve any more solute at that temperature called?', ans: ['saturated', 'saturated solution', 'a saturated solution'], marks: 2 }] },
      { id: 'sc-sep-3', topic: 'separating', src: 'Exam style', type: 'group', q: 'A beaker contains water, cooking oil and sand. The oil floats on top and the sand settles at the bottom.', parts: [
        { type: 'written', q: 'Which is more dense than water: the oil or the sand? Explain how you know.', marks: 3, lines: 2,
          scheme: ['Sand (1 mark)', 'It sinks below the water; the oil floats so it is less dense (2 marks)'],
          model: 'The sand, because it sinks to the bottom while the oil floats on top.' },
        { type: 'short', q: 'Name a method to separate the oil from the water.', ans: ['separating funnel', 'a separating funnel', 'decanting', 'pouring off'], marks: 2 },
        { type: 'short', q: 'Name a method to separate the sand from the water.', ans: ['filtration', 'filtering', 'filter', 'decanting'], marks: 2 },
        { type: 'written', q: 'Describe how to get salt back from salt water.', marks: 3, lines: 2,
          scheme: ['Heat the solution in an evaporating dish so the water evaporates, leaving salt crystals (3 marks)'],
          model: 'Pour the salt water into an evaporating dish and heat it. The water evaporates and the salt is left behind.' }] },
      { id: 'sc-sep-4', topic: 'separating', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Describe, with a labelled diagram, how distillation is used to get pure water from salty water.',
        scheme: ['Salty water is heated in a flask; the water boils and turns to steam (2 marks)', 'The steam passes through a condenser, which cools it back into liquid water (2 marks)', 'Pure water (the distillate) is collected; the salt stays in the flask; diagram labelled: flask, heat, condenser, cold water in/out, beaker (2 marks)'],
        model: 'The salty water is heated in a round-bottomed flask. The water boils and the steam travels into a condenser, where cold water cools it back into liquid. The pure water drips into a beaker and the salt stays behind in the flask.' },
      { id: 'sc-food-4', topic: 'food', src: 'Exam style', type: 'group', q: 'Digestion.', parts: [
        { type: 'short', q: 'Where does most absorption of digested food into the blood take place?', ans: ['small intestine', 'the small intestine', 'ileum'], marks: 2 },
        { type: 'mcq', q: 'Which enzyme breaks down starch?', ans: 'Amylase', opts: ['Lipase', 'Protease', 'Pepsin'], marks: 2 },
        { type: 'written', q: 'Describe how to test a food for starch, and give the result if starch is present.', marks: 4, lines: 3,
          scheme: ['Add a few drops of iodine solution to the food (2 marks)', 'Turns from yellow/brown to blue-black if starch is present (2 marks)'],
          model: 'Add a few drops of iodine solution. If starch is present it changes from yellow-brown to blue-black.' }] },
      { id: 'sc-atom-1', topic: 'atom', src: 'Exam style', type: 'group', q: 'Magnesium has atomic number 12 and mass number 24.', parts: [
        { type: 'short', q: 'How many protons are in a magnesium atom?', ans: ['12'], marks: 2 },
        { type: 'short', q: 'How many neutrons are in a magnesium atom?', ans: ['12'], marks: 2 },
        { type: 'short', q: 'Write the electron arrangement of magnesium.', ans: ['2, 8, 2', '2,8,2', '2 8 2'], marks: 3 },
        { type: 'written', q: 'Magnesium is in group 2 of the periodic table. Use its electron arrangement to explain why.', marks: 3, lines: 2,
          scheme: ['It has 2 electrons in its outer shell (2 marks)', 'The number of outer electrons gives the group (1 mark)'],
          model: 'Magnesium (2, 8, 2) has 2 electrons in its outer shell, and the number of outer-shell electrons matches the group number.' }] },
      { id: 'sc-atom-2', topic: 'atom', src: 'Exam style', type: 'written', marks: 6, lines: 4, photo: true,
        q: 'Describe how to draw a Bohr diagram of a sodium atom (atomic number 11, mass number 23). Say what goes in the nucleus and on each shell.',
        scheme: ['Nucleus has 11 protons (P11) (1 mark)', 'Nucleus has 12 neutrons (N12) (1 mark)', 'Three shells drawn / used (1 mark)', 'Electrons 2 on the first shell (1 mark)', 'Electrons 8 on the second shell (1 mark)', 'Electron 1 on the third shell (1 mark)'],
        model: 'In the nucleus write P11 and N12 (23 − 11). Draw three shells: 2 electrons on the first, 8 on the second and 1 on the third (2, 8, 1).' },
      { id: 'sc-atom-3', topic: 'atom', src: 'Exam style', type: 'written', marks: 4, lines: 3,
        q: 'What are isotopes? Use carbon-12 and carbon-14 as an example.',
        scheme: ['Atoms of the same element / same number of protons (2 marks)', 'Different numbers of neutrons, e.g. carbon-12 has 6 and carbon-14 has 8 (2 marks)'],
        model: 'Isotopes are atoms of the same element (same number of protons) with different numbers of neutrons. Carbon-12 has 6 neutrons and carbon-14 has 8.' },
      { id: 'sc-atom-4', topic: 'atom', src: 'Exam style', type: 'written', marks: 4, lines: 3,
        q: 'Rutherford fired alpha particles at thin gold foil. Most went straight through but a few bounced back. What did this tell him about the atom?',
        scheme: ['Most of the atom is empty space (2 marks)', 'There is a small, dense, positive nucleus (2 marks)'],
        model: 'Most went through, so the atom is mostly empty space. A few bounced back, so there is a tiny, dense, positively charged nucleus.' },
      { id: 'sc-force-1', topic: 'force', src: 'Exam style', type: 'group', q: 'A car of mass 1,200 kg accelerates at 3 m/s².', parts: [
        { type: 'short', q: 'Calculate the force needed (F = ma). Give the unit.', ans: ['3600 N', '3600N', '3600 newtons', '3,600 N', '3600 newton'], marks: 4 },
        { type: 'written', q: 'Name one force that acts against the car as it moves.', marks: 2, lines: 1, scheme: ['Friction or air resistance (drag) (2 marks)'], model: 'Friction (or air resistance).' }] },
      { id: 'sc-force-2', topic: 'force', src: 'Exam style', type: 'group', q: 'A spring stretches 4 cm when a 2 N weight hangs from it.', parts: [
        { type: 'short', q: 'How far will it stretch with a 6 N weight (within its elastic limit)? Give the unit.', ans: ['12 cm', '12cm', '12 centimetres'], marks: 3 },
        { type: 'short', q: 'Name the law this follows.', ans: ['Hooke’s law', "Hooke's law", 'Hookes law', 'Hooke law'], marks: 2 }] },
      { id: 'sc-force-3', topic: 'force', src: 'Exam style', type: 'written', marks: 5, lines: 3,
        q: 'A box weighs 600 N and its base has an area of 2 m². Calculate the pressure it puts on the floor. Show your working and give the unit.',
        scheme: ['Uses pressure = force ÷ area (2 marks)', 'Correct answer 300 (2 marks)', 'Correct unit N/m² or Pa (1 mark)'], model: 'Pressure = force ÷ area = 600 ÷ 2 = 300 N/m² (300 Pa).' },
      { id: 'sc-food-1', topic: 'food', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Describe how to test a food for starch. Include the chemical used and the positive result.',
        scheme: ['Uses iodine solution (2 marks)', 'Adds a few drops to the food (1 mark)', 'Colour changes from orange/brown/yellow (1 mark)', 'to blue-black (2 marks)'],
        model: 'Add a few drops of iodine solution to the food. If starch is present the colour changes from orange-brown to blue-black.' },
      { id: 'sc-food-2', topic: 'food', src: 'Exam style', type: 'written', marks: 4, lines: 3,
        q: 'What is the function of the small intestine in digestion?',
        scheme: ['Digestion is completed there (2 marks)', 'Digested food is absorbed into the blood (through villi) (2 marks)'], model: 'Digestion is finished in the small intestine, and the digested food is absorbed into the bloodstream through the villi.' },
      { id: 'sc-sep-1', topic: 'separating', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'How would you get pure water from salty water? Name the method and describe it.',
        scheme: ['Names distillation (2 marks)', 'Heat the salty water so the water boils / evaporates (2 marks)', 'Steam is cooled in a condenser and collected as pure water; salt is left behind (2 marks)'],
        model: 'Distillation: heat the salty water until the water boils. The steam passes through a condenser, cools and turns back to liquid water, which is collected. The salt stays in the flask.' },
      { id: 'sc-sol-1', topic: 'solutions', src: 'Exam style', type: 'group', q: 'Sugar dissolves in tea.', parts: [
        { type: 'short', q: 'Name the solute.', ans: ['sugar'], marks: 2 }, { type: 'short', q: 'Name the solvent.', ans: ['tea', 'water'], marks: 2 },
        { type: 'written', q: 'What is a saturated solution?', marks: 3, lines: 2, scheme: ['A solution in which no more solute will dissolve (3 marks)'], model: 'A solution that can’t dissolve any more solute at that temperature.' }] },
      { id: 'sc-ecm-1', topic: 'ecm', src: 'Exam style', type: 'written', marks: 4, lines: 3,
        q: 'Give two differences between a compound and a mixture.',
        scheme: ['A compound is chemically combined / a mixture is not (2 marks)', 'A mixture can be separated by physical means / a compound cannot; or a compound has different properties from its elements (2 marks)'],
        model: 'In a compound the elements are chemically combined in a fixed ratio; in a mixture they are not. A mixture can be separated by physical methods, but a compound can’t.' },
      { id: 'sc-ecm-2', topic: 'ecm', src: 'Exam style', type: 'group', q: 'Elements, compounds and mixtures.', parts: [
        { type: 'short', q: 'Give the chemical symbol for sodium.', ans: ['Na'], marks: 2 },
        { type: 'short', q: 'Give the chemical formula for water.', ans: ['H₂O', 'H2O'], marks: 2 },
        { type: 'short', q: 'Is air an element, a compound or a mixture?', ans: ['mixture', 'a mixture'], marks: 2 },
        { type: 'written', q: 'Iron and sulfur are heated together to make iron sulfide. Give one way iron sulfide is different from a mixture of iron and sulfur.', marks: 4, lines: 2,
          scheme: ['A correct difference, e.g. it is not attracted to a magnet / it has different properties from iron and sulfur / it cannot be separated by physical means / it has a fixed ratio (4 marks)'],
          model: 'The iron in iron sulfide is not attracted to a magnet, because it is chemically combined; in the mixture, a magnet pulls the iron out.' }] },
      { id: 'sc-ecm-3', topic: 'ecm', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Classify each of these as an element, a compound or a mixture: oxygen, salt water, carbon dioxide. Give a reason for one of them.',
        scheme: ['Oxygen: element (1 mark)', 'Salt water: mixture (1 mark)', 'Carbon dioxide: compound (1 mark)', 'A correct reason, e.g. carbon dioxide is two elements chemically combined (3 marks)'],
        model: 'Oxygen is an element, salt water is a mixture and carbon dioxide is a compound. Carbon dioxide is a compound because carbon and oxygen are chemically combined.' },
      { id: 'sc-sol-2', topic: 'solutions', src: 'Exam style', type: 'written', marks: 6, lines: 4, photo: true,
        q: 'Describe an experiment to show how temperature affects how much salt dissolves in water. Say what you would keep the same to make it a fair test.',
        scheme: ['Add salt to a fixed volume of water at different temperatures until no more dissolves (2 marks)', 'Measure / record how much dissolves at each temperature (2 marks)', 'Fair test: same volume of water / same type of salt / stir the same (2 marks)'],
        model: 'Heat 100 cm³ of water to 20 °C, 40 °C and 60 °C. At each temperature add salt a spatula at a time, stirring, until no more dissolves, and record the mass added. Keep the volume of water and the stirring the same.' },
      { id: 'sc-sol-3', topic: 'solutions', src: 'Exam style', type: 'group', q: 'Solubility.', parts: [
        { type: 'short', q: 'What name is given to a liquid that dissolves a substance?', ans: ['solvent', 'a solvent'], marks: 2 },
        { type: 'short', q: 'What is a substance that does not dissolve called?', ans: ['insoluble', 'insoluble substance'], marks: 2 },
        { type: 'written', q: 'Give one way to make sugar dissolve faster.', marks: 3, lines: 2, scheme: ['Stir it / heat the water / use smaller crystals (3 marks)'], model: 'Stir it, use hotter water, or crush the sugar into smaller pieces.' }] },
      { id: 'sc-sep-2', topic: 'separating', src: 'Exam style', type: 'group', q: 'Separating mixtures.', parts: [
        { type: 'short', q: 'Name the method used to separate sand from water.', ans: ['filtration', 'filtering'], marks: 2 },
        { type: 'short', q: 'Name the method used to separate the dyes in ink.', ans: ['chromatography', 'paper chromatography'], marks: 2 },
        { type: 'written', q: 'In filtration, what is the liquid that passes through the filter paper called, and what is the solid left behind called?', marks: 4, lines: 2,
          scheme: ['Filtrate (2 marks)', 'Residue (2 marks)'], model: 'The liquid is the filtrate; the solid left behind is the residue.' }] },
      { id: 'sc-food-3', topic: 'food', src: 'Exam style', type: 'group', q: 'Food and digestion.', parts: [
        { type: 'short', q: 'Name the food group that gives energy quickly.', ans: ['carbohydrates', 'carbohydrate'], marks: 2 },
        { type: 'short', q: 'Name the food group needed for growth and repair.', ans: ['protein', 'proteins'], marks: 2 },
        { type: 'written', q: 'What is the job of an enzyme in digestion? Name one enzyme.', marks: 4, lines: 2,
          scheme: ['Speeds up the breakdown of food / a biological catalyst (2 marks)', 'Named enzyme, e.g. amylase, protease, lipase (2 marks)'],
          model: 'An enzyme is a biological catalyst that speeds up the breakdown of food. Amylase breaks down starch into sugar.' }] },
      { id: 'sc-force-4', topic: 'force', src: 'Exam style', type: 'written', marks: 6, lines: 3,
        q: 'An astronaut has a mass of 70 kg. Calculate her weight on Earth (g = 10 N/kg). Explain why her mass would be the same on the Moon but her weight would be less.',
        scheme: ['Weight = mass × g = 70 × 10 (1 mark)', '700 N with the unit (2 marks)', 'Mass is the amount of matter, which does not change (1 mark)', 'The Moon’s gravity is weaker, so weight is less (2 marks)'],
        model: 'Weight = 70 × 10 = 700 N. Her mass stays 70 kg because the amount of matter in her doesn’t change, but gravity on the Moon is weaker, so her weight is less.' },
      { id: 'sc-atom-5', topic: 'atom', src: 'Exam style', type: 'group', q: 'Use the periodic table to answer these.', parts: [
        { type: 'short', q: 'How many electrons does a chlorine atom (atomic number 17) have?', ans: ['17'], marks: 2 },
        { type: 'short', q: 'Write the electron arrangement of chlorine.', ans: ['2, 8, 7', '2,8,7', '2 8 7'], marks: 3 },
        { type: 'short', q: 'Name the group that chlorine is in.', ans: ['halogens', 'the halogens', 'group 17', 'group seventeen'], marks: 2 },
        { type: 'written', q: 'Why are the noble gases very unreactive?', marks: 3, lines: 2, scheme: ['They have a full outer shell of electrons (3 marks)'], model: 'Their outer shell of electrons is full, so they don’t need to gain or lose electrons.' }] },
      { id: 'sc-br-1', topic: 'breathing', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain how the alveoli are suited to gas exchange. Give three features.',
        scheme: ['Thin walls (one cell thick) (2 marks)', 'Large surface area / many alveoli (2 marks)', 'Good blood supply (capillaries) or moist lining (2 marks)'],
        model: 'They have very thin walls, one cell thick; there are millions of them, giving a huge surface area; and they are surrounded by capillaries (and are moist) so gases dissolve and pass quickly.' },
      { id: 'sc-br-2', topic: 'breathing', src: 'Exam style', type: 'written', marks: 4, lines: 3,
        q: 'Describe what happens to the diaphragm and the ribs when you breathe in.',
        scheme: ['Diaphragm contracts and moves down / flattens (2 marks)', 'Intercostal muscles contract and the ribs move up and out (2 marks)'],
        model: 'The diaphragm contracts and flattens (moves down), and the intercostal muscles pull the ribs up and out, so the chest gets bigger and air rushes in.' }
    ],
    topics: [
      { id: 'food', label: 'Food & digestion', icon: 'apple', desc: 'Food groups, food tests and the digestive system',
        notes: ['food', 'digestion'], fc: ['food', 'digestion'], quiz: ['food', 'digestion'], match: ['foodTests', 'digestion'], prac: ['foodTests', 'digestion'] },
      { id: 'ecm', label: 'Elements, compounds & mixtures', icon: 'grid', desc: 'What each is, with examples and symbols',
        notes: ['ecm'], fc: ['ecm'], quiz: ['ecm'], match: ['symbols'], prac: ['ecm'] },
      { id: 'solutions', label: 'Solutions', icon: 'droplet', desc: 'Solute, solvent, solubility and saturation',
        notes: ['solutions'], fc: ['solutions'], quiz: ['solutions'], prac: ['solutions'] },
      { id: 'separating', label: 'Separating mixtures', icon: 'filter', desc: 'Filtration, evaporation, distillation, chromatography',
        notes: ['separating'], fc: ['separating'], quiz: ['separating'], match: ['separating'], prac: ['separating'] },
      { id: 'force', label: 'Force', icon: 'bolt', desc: 'Weight, F = ma, Hooke’s law, pressure, resultant force',
        notes: ['force', 'formulas'], fc: ['force', 'formulas'], quiz: ['force', 'calc'], match: ['units'], prac: ['force', 'calc'] },
      { id: 'atom', label: 'Structure of the atom', icon: 'atom', desc: 'Particles, shells, Bohr diagrams, isotopes and the periodic table',
        notes: ['atom', 'bohr', 'periodic'], fc: ['atom', 'elements'], quiz: ['atom', 'shells', 'elements'], match: ['particles', 'symbols'], prac: ['atom', 'elements', 'shells'] },
      { id: 'breathing', label: 'The breathing system', icon: 'wind', desc: 'Lungs, alveoli, breathing in and out, respiration',
        notes: ['breathing'], fc: ['breathing'], quiz: ['breathing'], match: ['breathing'], prac: ['breathing'] }
    ],

    notes: {
      food: { label: 'Food', sections: [
        { h: 'The food groups', kv: [['Carbohydrates', 'Energy. Sugars and starch, e.g. bread, pasta, rice.'], ['Fats', 'Stored energy and insulation, e.g. butter, oil.'],
          ['Proteins', 'Growth and repair, e.g. meat, fish, eggs, beans.'], ['Vitamins', 'Keep you healthy, e.g. vitamin C (fruit) prevents scurvy.'],
          ['Minerals', 'e.g. calcium for bones and teeth, iron for blood.'], ['Fibre', 'Helps food move through the gut and prevents constipation.'], ['Water', 'Needed by every cell.']],
          tip: 'A <b>balanced diet</b> has the right amount of each food group. Energy in food is measured in <b>kilojoules (kJ)</b>.' },
        { h: 'Food tests', kv: [['Starch', 'Add <b>iodine</b>: yellow-brown turns <b>blue-black</b>.'],
          ['Glucose (reducing sugar)', 'Add <b>Benedict’s solution</b> and <b>heat</b> in a water bath: blue turns <b>brick red</b>.'],
          ['Protein', 'Add <b>biuret</b> reagent: blue turns <b>purple / violet</b>.'],
          ['Fat', 'Rub on <b>brown paper</b>: leaves a <b>translucent</b> (see-through) spot.']],
          tip: 'Always do a <b>control</b> (the same test with water) to compare colours.' }
      ] },
      digestion: { label: 'Digestion', sections: [
        { h: 'Digestion', p: ['<b>Digestion</b> is breaking food down into small, soluble pieces that can be absorbed into the blood.'],
          kv: [['Physical digestion', 'Breaking food into smaller pieces, e.g. chewing.'], ['Chemical digestion', 'Enzymes break food down into simpler substances.'],
            ['Enzyme', 'A biological catalyst that speeds up a reaction. <b>Amylase</b> in saliva breaks starch into maltose (a sugar).']] },
        { h: 'Path through the digestive system', ol: ['<b>Mouth</b>: teeth chew; saliva with amylase starts digesting starch.',
          '<b>Oesophagus</b> (food pipe): moves food down by <b>peristalsis</b> (waves of muscle).',
          '<b>Stomach</b>: churns food with acid, which also kills bacteria.', '<b>Small intestine</b>: digestion finishes and food is <b>absorbed</b> into the blood through <b>villi</b>.',
          '<b>Large intestine</b>: water is absorbed.', '<b>Rectum</b> stores faeces, which leave through the <b>anus</b>.'],
          tip: 'The <b>liver</b> makes bile (stored in the gall bladder) and the <b>pancreas</b> makes enzymes; both help digestion in the small intestine.' },
        { h: 'Teeth', kv: [['Incisors', 'Cut and bite.'], ['Canines', 'Tear.'], ['Premolars', 'Crush and grind.'], ['Molars', 'Crush and grind.']] }
      ] },
      ecm: { label: 'Elements, compounds & mixtures', sections: [
        { h: 'Definitions', kv: [['Element', 'A substance made of only one type of atom. It can’t be broken down into anything simpler, e.g. oxygen (O), iron (Fe).'],
          ['Compound', 'Two or more elements <b>chemically combined</b>, e.g. water (H₂O), carbon dioxide (CO₂), salt (NaCl).'],
          ['Mixture', 'Two or more substances <b>mixed but not chemically combined</b>, e.g. air, sea water, muesli.']] },
        { h: 'Compound vs mixture', list: ['A compound has properties different from its elements; a mixture keeps the properties of its parts.',
          'A compound is in a fixed ratio; a mixture can be in any proportions.', 'A mixture can be separated by physical methods; a compound needs a chemical reaction.'] },
        { h: 'Metals and non-metals', kv: [['Metals', 'Shiny, good conductors of heat and electricity, malleable, e.g. iron, copper.'],
          ['Non-metals', 'Dull, poor conductors (except carbon as graphite), brittle if solid, e.g. sulfur, oxygen.']] }
      ] },
      solutions: { label: 'Solutions', sections: [
        { h: 'Key words', kv: [['Solute', 'The substance that dissolves, e.g. sugar.'], ['Solvent', 'The liquid it dissolves in, e.g. water.'],
          ['Solution', 'Solute + solvent, e.g. sugar water.'], ['Soluble', 'Can dissolve, e.g. salt.'], ['Insoluble', 'Cannot dissolve, e.g. sand.'],
          ['Saturated solution', 'A solution that can’t dissolve any more solute at that temperature.'], ['Solubility', 'How much solute dissolves in a solvent at a given temperature.'],
          ['Crystallisation', 'Crystals form as a saturated solution cools or evaporates.']] },
        { h: 'Faster dissolving', list: ['Heat the solvent.', 'Stir.', 'Use smaller pieces (crush the solute).'], tip: 'Most solids are more soluble at higher temperatures.' }
      ] },
      separating: { label: 'Separating mixtures', sections: [
        { h: 'Methods', kv: [['Filtration', 'Separates an <b>insoluble solid</b> from a liquid, e.g. sand and water. Filtrate passes through; residue stays on the filter paper.'],
          ['Evaporation', 'Gets a <b>soluble solid</b> from a solution, e.g. salt from salt water. The water is boiled off.'],
          ['Distillation', 'Gets the <b>liquid</b> back from a solution, e.g. pure water from sea water. The vapour is cooled in a <b>Liebig condenser</b> and collected as the distillate.'],
          ['Chromatography', 'Separates the <b>dyes</b> in ink or food colouring on chromatography paper.'], ['Magnet', 'Separates magnetic metals, e.g. iron filings from sulfur.'],
          ['Decanting', 'Pouring off a liquid and leaving a settled solid behind.']] }
      ] },
      force: { label: 'Force', sections: [
        { h: 'What is a force?', p: ['A <b>force</b> is anything that changes the shape, speed or direction of an object. It is a push or a pull, measured in <b>newtons (N)</b> with a <b>newton meter</b> (spring balance).'],
          kv: [['Balanced forces', 'Equal and opposite: no change in motion (stays still or keeps moving at the same speed).'],
            ['Unbalanced forces', 'The object speeds up, slows down or changes direction.'], ['Resultant force', 'The overall force: add forces in the same direction, subtract opposite ones.'],
            ['Friction', 'A force that opposes motion between surfaces.']] },
        { h: 'Weight and mass', kv: [['Mass', 'The amount of matter in an object (kg). It is the same everywhere.'],
          ['Weight', 'The force of gravity on an object (N). It changes with gravity, e.g. less on the Moon.'], ['Gravity on Earth', 'About 10 N/kg']] },
        { h: 'Hooke’s law', p: ['The <b>extension</b> of a spring is <b>directly proportional</b> to the force applied (until the elastic limit).'],
          list: ['The graph of extension against force is a <b>straight line through the origin</b>.', '<b>Independent variable</b> (what you change): the force / weight added. <b>Dependent variable</b> (what you measure): the extension.'] },
        { h: 'Forces on a plane', kv: [['Lift', 'Upwards, from the wings.'], ['Weight', 'Downwards.'], ['Thrust', 'Forwards, from the engines.'], ['Drag', 'Backwards (air resistance).']],
          tip: 'To take off, lift must be bigger than weight; to speed up, thrust must be bigger than drag.' }
      ] },
      formulas: { label: 'Formulas', sections: [
        { h: 'Learn these: they won’t be given', kv: [['Weight', '<b>W = m × g</b>: weight (N) = mass (kg) × gravity (N/kg)'],
          ['Newton’s second law', '<b>F = m × a</b>: force (N) = mass (kg) × acceleration (m/s²)'],
          ['Pressure', '<b>P = F ÷ A</b>: pressure (N/m² or Pa) = force (N) ÷ area (m²)'],
          ['Density (1st Year)', '<b>D = m ÷ V</b>: density (g/cm³) = mass (g) ÷ volume (cm³)'],
          ['Neutrons', 'neutrons = mass number − atomic number']] },
        { h: 'Worked examples', list: ['A 50 kg student on Earth: W = 50 × 10 = <b>500 N</b>.', 'A 2 kg ball accelerating at 3 m/s²: F = 2 × 3 = <b>6 N</b>.',
          'A 600 N box on 2 m²: P = 600 ÷ 2 = <b>300 Pa</b>.'] }
      ] },
      atom: { label: 'The atom', sections: [
        { h: 'What an atom is', p: ['An <b>atom</b> is the smallest particle of an element that still has the properties of that element. Everything is made of atoms.',
          'An atom has a tiny, heavy <b>nucleus</b> in the centre, with <b>electrons</b> moving around it in <b>shells</b> (energy levels). Most of an atom is empty space.'] },
        { h: 'The three particles', html: '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Particle</th><th scope="col">Charge</th><th scope="col">Relative mass</th><th scope="col">Where</th></tr></thead><tbody>' +
            '<tr><th scope="row">Proton</th><td>+1</td><td>1</td><td>Nucleus</td></tr><tr><th scope="row">Neutron</th><td>0</td><td>1</td><td>Nucleus</td></tr>' +
            '<tr><th scope="row">Electron</th><td>−1</td><td>1/1840 (almost 0)</td><td>Shells around the nucleus</td></tr></tbody></table></div>',
          tip: 'Learn this table exactly: it comes up every year.' },
        { h: 'Atomic number and mass number', kv: [['Atomic number (Z)', 'The number of <b>protons</b> in the nucleus. Each element has its own atomic number: every carbon atom has 6 protons.'],
          ['Mass number (A)', 'The number of <b>protons + neutrons</b>.'], ['Neutrons', '<b>Mass number − atomic number</b>.'], ['Electrons', 'In a neutral atom, electrons = protons, so the charges cancel.']],
          q: 'Sodium has atomic number 11 and mass number 23. How many of each particle?', steps: [{ h: 'Protons', t: '= atomic number = 11.' }, { h: 'Electrons', t: '= protons = 11 (neutral atom).' }, { h: 'Neutrons', t: '= 23 − 11 = 12.' }] },
        { h: 'Why atoms are neutral', p: ['Each proton has a charge of +1 and each electron −1. An atom has equal numbers of each, so the overall charge is zero. Neutrons have no charge, so they don’t change this.'] },
        { h: 'Isotopes', p: ['<b>Isotopes</b> are atoms of the same element (same number of protons) with different numbers of <b>neutrons</b>, so different mass numbers.',
          'Example: carbon-12 has 6 neutrons and carbon-14 has 8. Both have 6 protons, so both are carbon. Chlorine has two common isotopes, chlorine-35 and chlorine-37, which is why some tables give its mass as 35.5.'] },
        { h: 'Models of the atom', kv: [['John Dalton (1803)', 'Atoms are tiny solid spheres that can’t be split.'], ['J. J. Thomson (1897)', 'Discovered the electron. “Plum pudding” model: electrons dotted through a ball of positive charge.'],
          ['Ernest Rutherford (1911)', 'Fired alpha particles at gold foil. Most went straight through, a few bounced back: the atom is mostly empty space with a small, dense, positive nucleus.'],
          ['Niels Bohr (1913)', 'Electrons move in fixed shells (energy levels) around the nucleus.'], ['James Chadwick (1932)', 'Discovered the neutron.']] }
      ] },
      bohr: { label: 'Electron shells', sections: [
        { h: 'Filling the shells', p: ['Electrons fill the shells closest to the nucleus first. For the first 20 elements:'],
          kv: [['1st shell', 'holds up to <b>2</b> electrons'], ['2nd shell', 'holds up to <b>8</b>'], ['3rd shell', 'holds up to <b>8</b> (for the first 20 elements)'], ['4th shell', 'the rest (potassium 1, calcium 2)']],
          tip: 'Write the arrangement as numbers with commas: sodium (11 electrons) is <b>2, 8, 1</b>.' },
        { h: 'Drawing a Bohr diagram', ol: ['Draw a circle for the nucleus. Write the protons (P) and neutrons (N) inside it.', 'Draw one circle (shell) for each energy level that has electrons.',
          'Put the electrons on the shells: 2 in the first, then up to 8 in the next.', 'Place electrons singly at the top, bottom, left and right of a shell before pairing them up.'],
          q: 'Draw the Bohr diagram of chlorine (atomic number 17, mass number 35).', steps: [{ h: 'Nucleus:', t: 'P17, N18 (35 − 17).' }, { h: 'Electrons:', t: '17, so three shells.' },
            { h: 'Arrangement:', t: '2, 8, 7.' }, { h: 'Outer shell:', t: '7 electrons: three pairs and one single.' }] },
        { h: 'Shells and the periodic table', list: ['The <b>number of shells</b> is the element’s <b>period</b> (row). Sodium has 3 shells, so it is in period 3.',
          'The <b>number of outer electrons</b> matches the <b>group</b>: 1 for group 1, 2 for group 2, then 3 to 8 for groups 13 to 18.',
          'Elements in the same group have the same number of outer electrons, so they react in similar ways.',
          'Noble gases (group 18) have a full outer shell, so they are very unreactive.'] },
        { h: 'Ions', p: ['Atoms can gain or lose electrons to get a full outer shell. They then have a charge and are called <b>ions</b>. Sodium loses 1 electron to become Na⁺ (2, 8). Chlorine gains 1 to become Cl⁻ (2, 8, 8).'] }
      ] },
      periodic: { label: 'Periodic table', sections: [
        { h: 'The periodic table', p: ['Elements are arranged in order of <b>atomic number</b>. Rows are <b>periods</b>; columns are <b>groups</b>. Elements in the same group have similar properties.',
          'Choose an element to see its particles, electron arrangement and Bohr diagram. Use the arrow keys to move around the table.'], widget: 'periodic' },
        { h: 'Groups to know', kv: [['Group 1: alkali metals', 'Soft, very reactive metals (lithium, sodium, potassium). React with water to make hydrogen.'],
          ['Group 2: alkaline earth metals', 'Reactive metals (magnesium, calcium), less reactive than group 1.'], ['Group 17: halogens', 'Reactive non-metals (fluorine, chlorine).'],
          ['Group 18: noble gases', 'Unreactive gases with a full outer shell (helium, neon, argon). Used in lights and balloons.']] },
        { h: 'Dmitri Mendeleev', p: ['In 1869 Mendeleev arranged the elements known at the time by atomic mass and grouped elements with similar properties. He left gaps for elements not yet discovered and predicted their properties correctly. Today’s table is ordered by atomic number.'] },
        { h: 'Metals and non-metals', p: ['Metals are on the left and in the middle; non-metals are on the right. Metals are shiny, conduct heat and electricity, and can be hammered into shape. Most non-metals are dull and don’t conduct.'] }
      ] },
      breathing: { label: 'The breathing system', sections: [
        { h: 'Path of air', ol: ['Nose or mouth (the nose warms, moistens and filters the air).', '<b>Trachea</b> (windpipe), held open by rings of <b>cartilage</b>.',
          'Two <b>bronchi</b> (one to each lung).', 'Smaller <b>bronchioles</b>.', '<b>Alveoli</b>: tiny air sacs where gas exchange happens.'] },
        { h: 'Gas exchange in the alveoli', list: ['Oxygen passes from the alveoli into the blood; carbon dioxide passes from the blood into the alveoli.',
          'Alveoli are good at this because they have <b>thin walls</b> (one cell thick), are <b>moist</b>, have a <b>large surface area</b> and a <b>good blood supply</b> (capillaries).'] },
        { h: 'Breathing in and out', kv: [['Breathing in (inhaling)', 'Diaphragm contracts and moves <b>down</b>; intercostal muscles move the ribs <b>up and out</b>; chest volume increases, pressure falls and air rushes in.'],
          ['Breathing out (exhaling)', 'Diaphragm relaxes and moves <b>up</b>; ribs move <b>down and in</b>; volume decreases and air is pushed out.']] },
        { h: 'Inhaled vs exhaled air', kv: [['Oxygen', '21% in → about 16% out'], ['Carbon dioxide', '0.04% in → about 4% out'], ['Water vapour', 'More in exhaled air']],
          tip: 'Test for carbon dioxide: it turns <b>limewater milky</b>. Respiration: glucose + oxygen → carbon dioxide + water + energy.' },
        { h: 'Smoking', list: ['Tar damages the alveoli and can cause lung cancer.', 'Nicotine is addictive.', 'Carbon monoxide reduces the oxygen the blood can carry.'] }
      ] }
    },

    decks: {
      food: { label: 'Food', cards: cards([['Carbohydrates', 'Energy (sugars and starch)'], ['Fats', 'Stored energy and insulation'], ['Proteins', 'Growth and repair'],
        ['Fibre', 'Keeps food moving through the gut'], ['Calcium', 'Mineral for strong bones and teeth'], ['Iron', 'Mineral needed for blood'],
        ['Starch test', 'Iodine: yellow-brown to blue-black'], ['Glucose test', 'Benedict’s + heat: blue to brick red'], ['Protein test', 'Biuret: blue to purple'],
        ['Fat test', 'Brown paper: translucent spot'], ['Energy in food', 'Measured in kilojoules (kJ)']]) },
      digestion: { label: 'Digestion', cards: cards([['Digestion', 'Breaking food into small soluble pieces that can be absorbed'], ['Enzyme', 'A biological catalyst'],
        ['Amylase', 'Enzyme in saliva: starch to maltose'], ['Peristalsis', 'Waves of muscle that push food along'], ['Small intestine', 'Where food is absorbed into the blood'],
        ['Villi', 'Finger-like folds that increase surface area for absorption'], ['Large intestine', 'Absorbs water'], ['Liver', 'Makes bile'],
        ['Incisors', 'Cut and bite'], ['Canines', 'Tear'], ['Molars', 'Crush and grind']]) },
      ecm: { label: 'Elements, compounds, mixtures', cards: cards([['Element', 'One type of atom only'], ['Compound', 'Elements chemically combined in a fixed ratio'],
        ['Mixture', 'Substances mixed but not chemically combined'], ['Water', 'Compound, H₂O'], ['Carbon dioxide', 'Compound, CO₂'], ['Salt', 'Compound, NaCl (sodium chloride)'],
        ['Air', 'Mixture of gases'], ['Metal', 'Shiny, conducts heat and electricity, malleable'], ['Non-metal', 'Dull, poor conductor, brittle']]) },
      solutions: { label: 'Solutions', cards: cards([['Solute', 'The substance that dissolves'], ['Solvent', 'The liquid that does the dissolving'], ['Solution', 'Solute dissolved in a solvent'],
        ['Soluble', 'Able to dissolve'], ['Insoluble', 'Unable to dissolve'], ['Saturated solution', 'Can’t dissolve any more solute at that temperature'],
        ['Solubility', 'How much solute dissolves at a given temperature'], ['Crystallisation', 'Forming crystals from a saturated solution']]) },
      separating: { label: 'Separating mixtures', cards: cards([['Filtration', 'Insoluble solid from a liquid (sand and water)'], ['Filtrate', 'Liquid that passes through the filter'],
        ['Residue', 'Solid left on the filter paper'], ['Evaporation', 'Soluble solid from a solution (salt from salt water)'], ['Distillation', 'Liquid from a solution (pure water from sea water)'],
        ['Liebig condenser', 'Cools vapour back into a liquid'], ['Distillate', 'Liquid collected after distillation'], ['Chromatography', 'Separates dyes in ink']]) },
      force: { label: 'Force', cards: cards([['Force', 'A push or pull that changes shape, speed or direction'], ['Newton (N)', 'Unit of force'], ['Newton meter', 'Measures force'],
        ['Mass', 'Amount of matter (kg); same everywhere'], ['Weight', 'Force of gravity on a mass (N)'], ['Balanced forces', 'No change in motion'],
        ['Unbalanced forces', 'Change in speed or direction'], ['Resultant force', 'The overall force on an object'],
        ['Hooke’s law', 'Extension is proportional to force'], ['Friction', 'Force that opposes motion'], ['Lift / thrust / drag', 'Forces on a plane: up, forward, backward']]) },
      formulas: { label: 'Formulas', cards: cards([['Weight', 'W = m × g'], ['Force', 'F = m × a'], ['Pressure', 'P = F ÷ A'], ['Density', 'D = m ÷ V'],
        ['Unit of pressure', 'N/m² = pascal (Pa)'], ['Gravity on Earth', 'about 10 N/kg'], ['Neutrons', 'mass number − atomic number']]) },
      atom: { label: 'The atom', cards: cards([['Proton', '+1 charge, in the nucleus'], ['Neutron', 'No charge, in the nucleus'], ['Electron', '−1 charge, in shells'],
        ['Nucleus', 'Centre of the atom: protons and neutrons'], ['Atomic number', 'Number of protons'], ['Mass number', 'Protons + neutrons'],
        ['Period', 'A row of the periodic table'], ['Group', 'A column of the periodic table']]) },
      elements: { label: 'First 20 elements', cards: ELEMENTS.map(function (e) { return { front: e[1], back: e[2] + '\natomic number ' + e[0] + ' · mass number ' + e[3] }; }) },
      breathing: { label: 'Breathing system', cards: cards([['Trachea', 'Windpipe, held open by cartilage rings'], ['Bronchi', 'Two tubes from the trachea to the lungs'],
        ['Bronchioles', 'Small branches inside the lungs'], ['Alveoli', 'Air sacs where gas exchange happens'], ['Diaphragm', 'Sheet of muscle under the lungs'],
        ['Intercostal muscles', 'Muscles between the ribs'], ['Breathing in', 'Diaphragm down, ribs up and out'], ['Breathing out', 'Diaphragm up, ribs down and in'],
        ['Limewater', 'Turns milky with carbon dioxide'], ['Respiration', 'glucose + oxygen → carbon dioxide + water + energy']]) }
    },

    quizzes: {
      food: { label: 'Food', questions: [
        { q: 'Which food group is mainly for growth and repair?', ans: ['Protein'], opts: ['Carbohydrate', 'Fat', 'Fibre'] },
        { q: 'Which chemical tests for starch?', ans: ['Iodine'], opts: ['Benedict’s solution', 'Biuret', 'Limewater'] },
        { q: 'What colour does iodine turn with starch?', ans: ['Blue-black'], opts: ['Brick red', 'Purple', 'Milky'] },
        { q: 'What colour shows glucose in the Benedict’s test?', ans: ['Brick red'], opts: ['Blue-black', 'Purple', 'Green'] },
        { q: 'What else does the Benedict’s test need?', ans: ['Heat'], opts: ['Ice', 'A magnet', 'Brown paper'] },
        { q: 'What colour shows protein with biuret?', ans: ['Purple'], opts: ['Brick red', 'Blue-black', 'Yellow'] },
        { q: 'How do you test for fat?', ans: ['Rub it on brown paper'], opts: ['Add iodine', 'Add limewater', 'Heat with Benedict’s'] },
        { q: 'What unit is the energy in food measured in?', ans: ['Kilojoules (kJ)'], opts: ['Newtons (N)', 'Pascals (Pa)', 'Kilograms (kg)'] },
        { q: 'Which mineral is needed for strong bones?', ans: ['Calcium'], opts: ['Iron', 'Sodium', 'Iodine'] }
      ] },
      digestion: { label: 'Digestion', questions: [
        { q: 'What is digestion?', ans: ['Breaking food into small soluble pieces'], opts: ['Absorbing water', 'Breathing out carbon dioxide', 'Pumping blood'] },
        { q: 'Which enzyme in saliva digests starch?', ans: ['Amylase'], opts: ['Bile', 'Biuret', 'Glucose'] },
        { q: 'What moves food down the oesophagus?', ans: ['Peristalsis'], opts: ['Gravity only', 'Bile', 'Villi'] },
        { q: 'Where is most food absorbed into the blood?', ans: ['The small intestine'], opts: ['The stomach', 'The large intestine', 'The mouth'] },
        { q: 'What does the large intestine absorb?', ans: ['Water'], opts: ['Protein', 'Starch', 'Oxygen'] },
        { q: 'Which teeth are used for tearing?', ans: ['Canines'], opts: ['Incisors', 'Molars', 'Premolars'] },
        { q: 'Which organ makes bile?', ans: ['The liver'], opts: ['The pancreas', 'The stomach', 'The kidney'] },
        { q: 'Chewing is an example of…', ans: ['Physical digestion'], opts: ['Chemical digestion', 'Absorption', 'Respiration'] }
      ] },
      ecm: { label: 'Elements, compounds & mixtures', questions: [
        { q: 'A substance made of only one type of atom is…', ans: ['An element'], opts: ['A compound', 'A mixture', 'A solution'] },
        { q: 'Water (H₂O) is…', ans: ['A compound'], opts: ['An element', 'A mixture', 'A metal'] },
        { q: 'Air is…', ans: ['A mixture'], opts: ['An element', 'A compound', 'A metal'] },
        { q: 'What is the chemical symbol for iron?', ans: ['Fe'], opts: ['Ir', 'I', 'Fr'] },
        { q: 'Which is a property of metals?', ans: ['They conduct electricity'], opts: ['They are brittle', 'They are dull', 'They are poor conductors of heat'] },
        { q: 'Which can be separated by physical methods?', ans: ['A mixture'], opts: ['A compound', 'An element', 'An atom'] },
        { q: 'What is the chemical formula for carbon dioxide?', ans: ['CO₂'], opts: ['CO', 'C₂O', 'H₂O'] }
      ] },
      solutions: { label: 'Solutions', questions: [
        { q: 'In sugar water, the sugar is the…', ans: ['Solute'], opts: ['Solvent', 'Solution', 'Residue'] },
        { q: 'In sugar water, the water is the…', ans: ['Solvent'], opts: ['Solute', 'Filtrate', 'Crystal'] },
        { q: 'A substance that can’t dissolve is…', ans: ['Insoluble'], opts: ['Soluble', 'Saturated', 'Dilute'] },
        { q: 'A solution that can’t dissolve any more solute is…', ans: ['Saturated'], opts: ['Insoluble', 'Diluted', 'Distilled'] },
        { q: 'Which makes a solid dissolve faster?', ans: ['Heating the solvent'], opts: ['Cooling the solvent', 'Using bigger lumps', 'Not stirring'] },
        { q: 'What happens to the solubility of most solids as temperature rises?', ans: ['It increases'], opts: ['It decreases', 'It stays the same', 'It falls to zero'] }
      ] },
      separating: { label: 'Separating mixtures', questions: [
        { q: 'How would you separate sand from water?', ans: ['Filtration'], opts: ['Distillation', 'Chromatography', 'Evaporation'] },
        { q: 'How would you get salt from salt water?', ans: ['Evaporation'], opts: ['Filtration', 'Chromatography', 'A magnet'] },
        { q: 'How would you get pure water from sea water?', ans: ['Distillation'], opts: ['Filtration', 'Chromatography', 'Decanting'] },
        { q: 'How would you separate the dyes in ink?', ans: ['Chromatography'], opts: ['Distillation', 'Filtration', 'Evaporation'] },
        { q: 'What is the solid left on the filter paper called?', ans: ['The residue'], opts: ['The filtrate', 'The distillate', 'The solvent'] },
        { q: 'Which piece of equipment cools the vapour in distillation?', ans: ['A Liebig condenser'], opts: ['A Bunsen burner', 'A filter funnel', 'An evaporating dish'] },
        { q: 'How could you separate iron filings from sulfur?', ans: ['With a magnet'], opts: ['By distillation', 'By chromatography', 'By evaporation'] }
      ] },
      force: { label: 'Force', questions: [
        { q: 'What is the unit of force?', ans: ['The newton (N)'], opts: ['The kilogram (kg)', 'The pascal (Pa)', 'The joule (J)'] },
        { q: 'What do we measure force with?', ans: ['A newton meter'], opts: ['A barometer', 'A thermometer', 'A ruler only'] },
        { q: 'Mass is measured in…', ans: ['Kilograms (kg)'], opts: ['Newtons (N)', 'Metres (m)', 'Pascals (Pa)'] },
        { q: 'What happens when the forces on an object are balanced?', ans: ['Its motion doesn’t change'], opts: ['It speeds up', 'It slows down', 'It changes direction'] },
        { q: 'On the Moon, your mass…', ans: ['Stays the same'], opts: ['Gets smaller', 'Gets bigger', 'Becomes zero'] },
        { q: 'Hooke’s law says the extension of a spring is…', ans: ['Proportional to the force'], opts: ['Proportional to its colour', 'Always the same', 'Opposite to the force'] },
        { q: 'In the Hooke’s law experiment, the independent variable is…', ans: ['The force (weight) added'], opts: ['The extension', 'The spring', 'The time'] },
        { q: 'Which force pushes a plane upwards?', ans: ['Lift'], opts: ['Thrust', 'Drag', 'Weight'] },
        { q: 'A push of 10 N right and 4 N left. What is the resultant force?', ans: ['6 N to the right'], opts: ['14 N to the right', '6 N to the left', '40 N'] }
      ] },
      calc: { label: 'Calculations', questions: [
        { q: 'Weight of a 40 kg person (g = 10 N/kg)?', ans: ['400 N'], opts: ['4 N', '40 N', '50 N'] },
        { q: 'Force to accelerate 5 kg at 2 m/s²?', ans: ['10 N'], opts: ['2.5 N', '7 N', '3 N'] },
        { q: 'Pressure of 200 N on an area of 4 m²?', ans: ['50 Pa'], opts: ['800 Pa', '204 Pa', '196 Pa'] },
        { q: 'Which formula gives pressure?', ans: ['P = F ÷ A'], opts: ['P = F × A', 'P = m × g', 'P = A ÷ F'] },
        { q: 'Which formula gives weight?', ans: ['W = m × g'], opts: ['W = m ÷ g', 'W = F ÷ A', 'W = m × a × g'] },
        { q: 'Mass of an object with weight 30 N on Earth?', ans: ['3 kg'], opts: ['300 kg', '30 kg', '0.3 kg'] }
      ] },
      atom: { label: 'The atom', questions: [
        { q: 'What is the charge on a proton?', ans: ['+1'], opts: ['−1', '0', '+2'] },
        { q: 'Where are electrons found?', ans: ['In shells around the nucleus'], opts: ['In the nucleus', 'Inside protons', 'Nowhere'] },
        { q: 'Which particle has no charge?', ans: ['The neutron'], opts: ['The proton', 'The electron', 'The nucleus'] },
        { q: 'The atomic number is the number of…', ans: ['Protons'], opts: ['Neutrons', 'Protons + neutrons', 'Shells'] },
        { q: 'The mass number is…', ans: ['Protons + neutrons'], opts: ['Protons only', 'Electrons + neutrons', 'Neutrons only'] },
        { q: 'Carbon: atomic number 6, mass number 12. How many neutrons?', ans: ['6'], opts: ['12', '18', '0'] },
        { q: 'Sodium: atomic number 11, mass number 23. How many neutrons?', ans: ['12'], opts: ['11', '23', '34'] },
        { q: 'A row of the periodic table is called a…', ans: ['Period'], opts: ['Group', 'Family', 'Shell'] }
      ] },
      shells: { label: 'Shells and groups', questions: [
        { q: 'How many electrons can the first shell hold?', ans: ['2'], opts: ['8', '1', '18'] },
        { q: 'Electron arrangement of sodium (11)?', ans: ['2, 8, 1'], opts: ['2, 9', '8, 2, 1', '2, 8, 2'] },
        { q: 'Electron arrangement of chlorine (17)?', ans: ['2, 8, 7'], opts: ['2, 7, 8', '2, 8, 8', '8, 8, 1'] },
        { q: 'Electron arrangement of calcium (20)?', ans: ['2, 8, 8, 2'], opts: ['2, 8, 10', '2, 8, 2, 8', '2, 18'] },
        { q: 'An element has 3 shells. Which period is it in?', ans: ['Period 3'], opts: ['Period 1', 'Group 3', 'Period 8'] },
        { q: 'Why are noble gases unreactive?', ans: ['They have a full outer shell'], opts: ['They have no electrons', 'They are metals', 'They have no neutrons'] },
        { q: 'Atoms of the same element with different numbers of neutrons are…', ans: ['Isotopes'], opts: ['Ions', 'Compounds', 'Molecules'] },
        { q: 'Who discovered the nucleus with the gold foil experiment?', ans: ['Rutherford'], opts: ['Dalton', 'Mendeleev', 'Chadwick'] },
        { q: 'Who discovered the neutron?', ans: ['Chadwick'], opts: ['Thomson', 'Bohr', 'Rutherford'] },
        { q: 'Sodium loses one electron. What does it become?', ans: ['A positive ion, Na⁺'], opts: ['A negative ion, Na⁻', 'An isotope', 'A neutron'] }
      ] },
      elements: { label: 'Symbols', questions: ELEMENTS.map(function (e) { return { q: 'Symbol for ' + e[1].toLowerCase() + '?', ans: [e[2]] }; }) },
      breathing: { label: 'Breathing system', questions: [
        { q: 'Where does gas exchange happen?', ans: ['In the alveoli'], opts: ['In the trachea', 'In the bronchi', 'In the diaphragm'] },
        { q: 'What keeps the trachea open?', ans: ['Rings of cartilage'], opts: ['The ribs', 'The diaphragm', 'Bone'] },
        { q: 'When you breathe in, the diaphragm…', ans: ['Contracts and moves down'], opts: ['Relaxes and moves up', 'Doesn’t move', 'Moves sideways'] },
        { q: 'When you breathe out, the ribs move…', ans: ['Down and in'], opts: ['Up and out', 'Forward', 'They don’t move'] },
        { q: 'Why are alveoli good at gas exchange?', ans: ['Thin walls and a large surface area'], opts: ['Thick walls', 'They are dry', 'They have no blood supply'] },
        { q: 'What turns limewater milky?', ans: ['Carbon dioxide'], opts: ['Oxygen', 'Nitrogen', 'Water vapour'] },
        { q: 'About how much oxygen is in exhaled air?', ans: ['16%'], opts: ['21%', '4%', '0.04%'] },
        { q: 'Which is the word equation for respiration?', ans: ['glucose + oxygen → carbon dioxide + water + energy'], opts: ['carbon dioxide + water → glucose + oxygen', 'glucose → oxygen + water', 'oxygen + water → glucose + energy'] }
      ] }
    },

    matches: {
      foodTests: { label: 'Food tests', colL: 'Food', colR: 'Test and result', pairs: pairs([['Starch', 'Iodine: blue-black'], ['Glucose', 'Benedict’s: brick red'],
        ['Protein', 'Biuret: purple'], ['Fat', 'Brown paper: translucent spot']]) },
      digestion: { label: 'Digestive system', colL: 'Part', colR: 'Job', pairs: pairs([['Mouth', 'Chewing and saliva'], ['Oesophagus', 'Peristalsis to the stomach'],
        ['Stomach', 'Churns food with acid'], ['Small intestine', 'Absorbs food'], ['Large intestine', 'Absorbs water'], ['Liver', 'Makes bile']]) },
      symbols: { label: 'Symbols', colL: 'Element', colR: 'Symbol', pairs: pairs([['Sodium', 'Na'], ['Potassium', 'K'], ['Iron', 'Fe'], ['Chlorine', 'Cl'],
        ['Magnesium', 'Mg'], ['Calcium', 'Ca'], ['Sulfur', 'S']]) },
      separating: { label: 'Separating', colL: 'Mixture', colR: 'Method', pairs: pairs([['Sand and water', 'Filtration'], ['Salt from salt water', 'Evaporation'],
        ['Pure water from sea water', 'Distillation'], ['Dyes in ink', 'Chromatography'], ['Iron and sulfur', 'Magnet']]) },
      units: { label: 'Quantities & units', colL: 'Quantity', colR: 'Unit', pairs: pairs([['Force', 'newton (N)'], ['Mass', 'kilogram (kg)'], ['Pressure', 'pascal (Pa)'],
        ['Acceleration', 'm/s²'], ['Area', 'm²'], ['Energy in food', 'kilojoule (kJ)']]) },
      particles: { label: 'Particles', colL: 'Particle', colR: 'Charge and place', pairs: pairs([['Proton', '+1, nucleus'], ['Neutron', '0, nucleus'], ['Electron', '−1, shells']]) },
      breathing: { label: 'Breathing system', colL: 'Part', colR: 'Job', pairs: pairs([['Trachea', 'Windpipe'], ['Bronchi', 'Tubes into each lung'], ['Alveoli', 'Gas exchange'],
        ['Diaphragm', 'Muscle under the lungs'], ['Intercostal muscles', 'Move the ribs'], ['Nose', 'Warms and filters air']]) }
    },

    practice: {
      foodTests: { label: 'Food tests', type: 'table', intro: 'Fill in the reagent and the positive result for each test.', cols: ['Food', 'Reagent', 'Positive result'],
        rows: [['Starch', { k: 's_r', ans: ['iodine'] }, { k: 's_c', ans: ['blue-black', 'blue black', 'black'] }],
          ['Glucose', { k: 'g_r', ans: ['Benedict’s', 'Benedicts', 'Benedict’s solution', 'Benedicts solution'] }, { k: 'g_c', ans: ['brick red', 'brick-red', 'red', 'orange'] }],
          ['Protein', { k: 'p_r', ans: ['biuret', 'biuret reagent'] }, { k: 'p_c', ans: ['purple', 'violet', 'lilac'] }],
          ['Fat', { k: 'f_r', ans: ['brown paper'] }, { k: 'f_c', ans: ['translucent spot', 'translucent', 'see-through spot', 'grease spot'] }]] },
      digestion: { label: 'Digestion', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The enzyme in saliva is ___.', ans: ['amylase'] }, { q: 'Waves of muscle that push food along are called ___.', ans: ['peristalsis'] },
        { q: 'Food is absorbed in the ___ intestine.', ans: ['small'] }, { q: 'Water is absorbed in the ___ intestine.', ans: ['large'] },
        { q: 'Finger-like folds in the small intestine are called ___.', ans: ['villi'] }, { q: 'The ___ makes bile.', ans: ['liver'] }] },
      ecm: { label: 'Elements, compounds, mixtures', type: 'table', intro: 'Is each one an element, a compound or a mixture?', cols: ['Substance', 'Element, compound or mixture?'],
        rows: [['Oxygen', { k: '0', ans: ['element'] }], ['Water', { k: '1', ans: ['compound'] }], ['Air', { k: '2', ans: ['mixture'] }], ['Iron', { k: '3', ans: ['element'] }],
          ['Salt (sodium chloride)', { k: '4', ans: ['compound'] }], ['Sea water', { k: '5', ans: ['mixture'] }], ['Carbon dioxide', { k: '6', ans: ['compound'] }], ['Copper', { k: '7', ans: ['element'] }]] },
      solutions: { label: 'Solutions', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The substance that dissolves is the ___.', ans: ['solute'] }, { q: 'The liquid it dissolves in is the ___.', ans: ['solvent'] },
        { q: 'Sand does not dissolve: it is ___.', ans: ['insoluble'] }, { q: 'A solution that can hold no more solute is ___.', ans: ['saturated'] },
        { q: 'Forming crystals from a solution is called ___.', ans: ['crystallisation', 'crystallization'] }] },
      separating: { label: 'Separating mixtures', type: 'lines', intro: 'Name the method.', items: [
        { q: 'Sand from water: ___', ans: ['filtration', 'filtering'] }, { q: 'Salt from salt water: ___', ans: ['evaporation'] },
        { q: 'Pure water from sea water: ___', ans: ['distillation'] }, { q: 'Dyes in a felt-tip pen: ___', ans: ['chromatography'] },
        { q: 'Iron filings from sulfur: use a ___', ans: ['magnet'] }] },
      force: { label: 'Force', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Force is measured in ___.', ans: ['newtons', 'newton', 'N'] }, { q: 'Weight = mass × ___.', ans: ['gravity', 'g'] },
        { q: 'Force = mass × ___.', ans: ['acceleration', 'a'] }, { q: 'Pressure = force ÷ ___.', ans: ['area', 'A'] },
        { q: 'The unit of pressure is the ___.', ans: ['pascal', 'Pa'] }, { q: 'Hooke’s law: extension is proportional to ___.', ans: ['force', 'the force'] },
        { q: 'The force opposing motion between surfaces is ___.', ans: ['friction'] }, { q: 'The force from a plane’s engines is ___.', ans: ['thrust'] }] },
      calc: { label: 'Calculations', type: 'lines', intro: 'Work it out (g = 10 N/kg). Type the number only.', items: [
        { q: 'Weight of a 60 kg person: ___ N', ans: ['600'] }, { q: 'Weight of a 2.5 kg bag: ___ N', ans: ['25'] },
        { q: 'F = 4 kg × 5 m/s² = ___ N', ans: ['20'] }, { q: 'Pressure of 900 N on 3 m²: ___ Pa', ans: ['300'] },
        { q: 'A 20 N force on 0.5 m²: ___ Pa', ans: ['40'] }, { q: 'Mass of an object weighing 150 N: ___ kg', ans: ['15'] }] },
      atom: { label: 'The atom', type: 'table', intro: 'Fill in the charge and where each particle is found.', cols: ['Particle', 'Charge', 'Where'],
        rows: [['Proton', { k: 'p_c', ans: ['+1', '1', 'positive', '+'] }, { k: 'p_w', ans: ['nucleus', 'in the nucleus'] }],
          ['Neutron', { k: 'n_c', ans: ['0', 'none', 'neutral', 'no charge'] }, { k: 'n_w', ans: ['nucleus', 'in the nucleus'] }],
          ['Electron', { k: 'e_c', ans: ['-1', '−1', 'negative', '-'] }, { k: 'e_w', ans: ['shells', 'in shells', 'orbits', 'shells around the nucleus'] }]] },
      elements: { label: 'First 20 elements', type: 'table', intro: 'Fill in the symbol, protons, electrons and neutrons (use whole-number mass numbers).',
        cols: ['Element', 'Symbol', 'Protons', 'Electrons', 'Neutrons'],
        rows: ELEMENTS.map(function (e) {
          return [e[0] + '. ' + e[1] + ' (mass ' + e[3] + ')', { k: e[0] + '_s', ans: [e[2]] }, { k: e[0] + '_p', ans: [String(e[0])] },
            { k: e[0] + '_e', ans: [String(e[0])] }, { k: e[0] + '_n', ans: [String(e[3] - e[0])] }];
        }) },
      shells: { label: 'Electron arrangement', type: 'table', intro: 'Write the electron arrangement with commas, e.g. 2, 8, 1.',
        cols: ['Element', 'Electron arrangement'],
        rows: ELEMENTS.map(function (e) {
          var n = e[0], sh = [], caps = [2, 8, 8, 2];
          for (var i = 0; i < 4 && n > 0; i++) { var k = Math.min(caps[i], n); sh.push(k); n -= k; }
          return [e[0] + '. ' + e[1], { k: 'sh' + e[0], ans: [sh.join(', '), sh.join(','), sh.join(' ')] }];
        }) },
      breathing: { label: 'Breathing system', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The windpipe is also called the ___.', ans: ['trachea'] }, { q: 'Gas exchange happens in the ___.', ans: ['alveoli'] },
        { q: 'When breathing in, the diaphragm moves ___.', ans: ['down', 'downwards'] }, { q: 'The muscles between the ribs are the ___ muscles.', ans: ['intercostal'] },
        { q: 'Carbon dioxide turns limewater ___.', ans: ['milky', 'cloudy'] }, { q: 'Exhaled air has about ___% carbon dioxide.', ans: ['4'] }] }
    }
  };

  window.SN_DATA.science = { id: 'science', title: 'Science', subtitle: 'Science', calculator: true, marking: { spelling: 'lenient', note: 'Science: units must be given where the scheme asks. Chemical symbols and formulas must be exact (case matters: Co is not CO).' }, years: { '2': y2 } };
})();
