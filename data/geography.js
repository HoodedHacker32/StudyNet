/* StudyNet — Geography data (2nd Year). Loaded by geography.html. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  function cards(pairs) { return pairs.map(function (p) { return { front: p[0], back: p[1] }; }); }
  function pairs(list) { return list.map(function (p) { return { left: p[0], right: p[1] }; }); }

  var y2 = {
    blurb: 'Geography — November assessment revision',
    exam: '<b>November assessment:</b> Ch 1 Dynamic Earth, Ch 2 Volcanic activity, Ch 3 Earthquakes, Ch 4 Fold mountains, Ch 12 Glaciation and Ch 13 Measuring and forecasting weather. For glaciation, know plucking and abrasion, recognise landforms in a diagram, and be able to explain <b>one</b> erosion or deposition feature.',
    store: 'sn_geography_y2',
    score: 'geography_y2',
    /* Exam bank: Junior Cycle style questions with marking schemes. */
    examq: [
      { id: 'ge-earth-3', topic: 'earth', src: 'Exam style', type: 'group', q: 'Plates and boundaries.', parts: [
        { type: 'mcq', q: 'Ireland sits on which plate?', ans: 'Eurasian plate', opts: ['North American plate', 'African plate', 'Pacific plate'], marks: 2 },
        { type: 'short', q: 'Name the outer layer of the Earth.', ans: ['crust', 'the crust'], marks: 2 },
        { type: 'short', q: 'Name the underwater mountain range where the Eurasian and North American plates move apart.', ans: ['Mid-Atlantic Ridge', 'the Mid-Atlantic Ridge', 'Mid Atlantic Ridge'], marks: 2 },
        { type: 'mcq', q: 'At that ridge, the plates are…', ans: 'Separating', opts: ['Colliding', 'Sliding past each other'], marks: 2 }] },
      { id: 'ge-earth-4', topic: 'earth', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain what happens at a constructive (separating) plate boundary. Name an example.',
        scheme: ['Plates move apart, driven by convection currents (2 marks)', 'Magma rises to fill the gap and cools to form new crust / volcanoes / ridges (2 marks)', 'Named example, e.g. Mid-Atlantic Ridge / Iceland (2 marks)'],
        model: 'Convection currents pull two plates apart. Magma rises into the gap, cools and forms new crust, building an underwater ridge such as the Mid-Atlantic Ridge.' },
      { id: 'ge-vol-2', topic: 'volcanoes', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'Name a volcano you have studied. Explain one economic and one social impact of volcanic activity.',
        scheme: ['Named volcano, e.g. Eyjafjallajökull / Mount Etna (2 marks)', 'Economic impact, e.g. fertile soil for farming / tourism / geothermal energy / flights grounded / crops destroyed (3 marks)', 'Social impact, e.g. people evacuated / homes destroyed / deaths and injuries / health problems from ash (3 marks)'],
        model: 'Eyjafjallajökull, Iceland, 2010. Economic: its ash cloud grounded flights across Europe, costing airlines millions. Social: nearby farms were evacuated and people suffered from breathing in ash.' },
      { id: 'ge-vol-3', topic: 'volcanoes', src: 'Exam style', type: 'group', q: 'Volcanoes.', parts: [
        { type: 'short', q: 'Name the pipe that magma travels up through.', ans: ['vent', 'the vent', 'main vent'], marks: 2 },
        { type: 'short', q: 'Name the opening at the top of a volcano.', ans: ['crater', 'the crater'], marks: 2 },
        { type: 'mcq', q: 'A volcano that hasn’t erupted for a long time but could erupt again is…', ans: 'Dormant', opts: ['Active', 'Extinct'], marks: 2 },
        { type: 'written', q: 'Explain one way scientists try to predict volcanic eruptions.', marks: 3, lines: 2,
          scheme: ['A method, e.g. seismometers detect small earthquakes / tiltmeters measure the ground swelling / measuring gas given off / satellites measure heat (3 marks)'],
          model: 'Seismometers pick up the small earthquakes that happen as magma rises inside the volcano.' }] },
      { id: 'ge-eq-2', topic: 'earthquakes', src: 'Exam style', type: 'written', marks: 6, lines: 5,
        q: 'Explain how an earthquake happens. You may use a labelled diagram.',
        scheme: ['Plates move and get stuck along a fault; pressure builds up (2 marks)', 'The rocks suddenly slip, releasing energy (2 marks)', 'Seismic waves spread out from the focus; the shaking is strongest at the epicentre (2 marks)'],
        model: 'Two plates try to move past each other but get stuck, so pressure builds up. When the rocks suddenly slip, energy is released as seismic waves that spread out from the focus. The shaking is strongest at the epicentre on the surface above.' },
      { id: 'ge-eq-3', topic: 'earthquakes', src: 'Exam style', type: 'group', q: 'Measuring earthquakes.', parts: [
        { type: 'short', q: 'What are the smaller tremors after the main earthquake called?', ans: ['aftershocks', 'aftershock'], marks: 2 },
        { type: 'short', q: 'Name one scale used to measure earthquakes.', ans: ['Richter scale', 'Richter', 'Mercalli scale', 'Mercalli', 'moment magnitude scale'], marks: 2 },
        { type: 'mcq', q: 'At the San Andreas Fault, the plates are…', ans: 'Sliding past each other', opts: ['Separating', 'Colliding'], marks: 2 },
        { type: 'written', q: 'Briefly explain the term epicentre.', marks: 2, lines: 2,
          scheme: ['The point on the Earth’s surface directly above the focus (2 marks)'],
          model: 'The epicentre is the point on the surface directly above the focus, where the shaking is strongest.' }] },
      { id: 'ge-eq-4', topic: 'earthquakes', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Describe one short-term and one long-term way people respond to earthquakes.',
        scheme: ['Short-term, e.g. search and rescue teams / emergency shelters, food and water / medical aid (3 marks)', 'Long-term, e.g. earthquake-proof buildings / drills and education / tsunami walls and warning systems (3 marks)'],
        model: 'Short-term: rescue teams search the rubble for survivors and people are given tents, food and water. Long-term: buildings are designed with deep foundations and shock absorbers so they don’t collapse.' },
      { id: 'ge-fold-3', topic: 'fold', src: 'Exam style', type: 'group', q: 'Folding periods.', parts: [
        { type: 'mcq', q: 'The Wicklow Mountains were formed in which folding period?', ans: 'Caledonian', opts: ['Armorican', 'Alpine'], marks: 2 },
        { type: 'mcq', q: 'Which is the youngest folding period, which formed the Alps and Himalayas?', ans: 'Alpine', opts: ['Caledonian', 'Armorican'], marks: 2 },
        { type: 'written', q: 'Explain why fold mountains are usually found near the edges of plates.', marks: 4, lines: 3,
          scheme: ['Fold mountains form where plates collide (destructive boundaries) (2 marks)', 'The colliding plates squeeze and buckle the rock layers between them, pushing them up (2 marks)'],
          model: 'They form at destructive boundaries, where two plates push into each other and the rock layers between them are squeezed, buckled and forced upwards.' }] },
      { id: 'ge-fold-2', topic: 'fold', src: 'Exam style', type: 'group', q: 'Fold mountains.', parts: [
        { type: 'short', q: 'What is an upfold called?', ans: ['anticline', 'an anticline'], marks: 2 },
        { type: 'short', q: 'What is a downfold called?', ans: ['syncline', 'a syncline'], marks: 2 },
        { type: 'mcq', q: 'Which Irish mountains were formed in the Armorican folding period?', ans: 'MacGillycuddy’s Reeks', opts: ['Wicklow Mountains', 'The Alps', 'The Himalayas'], marks: 2 },
        { type: 'written', q: 'Describe one way people use fold mountain areas.', marks: 3, lines: 2,
          scheme: ['A use, e.g. tourism and skiing / forestry / hydroelectric power / sheep farming (3 marks)'],
          model: 'They attract tourists for hill-walking and skiing, which brings money and jobs to the area.' }] },
      { id: 'ge-gl-3', topic: 'glaciation', src: 'Exam style', type: 'group', q: 'Glacial features.', parts: [
        { type: 'short', q: 'What is the lake in a corrie called?', ans: ['tarn', 'a tarn'], marks: 2 },
        { type: 'short', q: 'Name the knife-edged ridge between two corries.', ans: ['arête', 'arete', 'an arête'], marks: 2 },
        { type: 'short', q: 'Name the egg-shaped hill of boulder clay.', ans: ['drumlin', 'a drumlin'], marks: 2 },
        { type: 'mcq', q: 'Which of these is a feature of glacial <b>deposition</b>?', ans: 'Esker', opts: ['Corrie', 'Arête', 'Pyramidal peak'], marks: 2 }] },
      { id: 'ge-gl-4', topic: 'glaciation', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Glaciers around the world are melting quickly. Explain one cause and one effect of this.',
        scheme: ['Cause: global warming / climate change caused by greenhouse gases from burning fossil fuels (3 marks)', 'Effect, e.g. sea levels rise and coasts flood / loss of fresh water supply / habitats lost (3 marks)'],
        model: 'Burning fossil fuels releases greenhouse gases that warm the planet, so glaciers melt faster than snow can replace them. The meltwater raises sea levels, which floods low-lying coasts.' },
      { id: 'ge-we-2', topic: 'weather', src: 'Exam style', type: 'group', q: 'Reading a weather chart.', parts: [
        { type: 'mcq', q: 'An area of high pressure is called…', ans: 'An anticyclone', opts: ['A depression', 'A front', 'An isobar'], marks: 2 },
        { type: 'short', q: 'In what unit is atmospheric pressure measured on a weather chart?', ans: ['hectopascals', 'hPa', 'millibars', 'mb'], marks: 2 },
        { type: 'mcq', q: 'Rainfall is measured in…', ans: 'Millimetres (mm)', opts: ['Hectopascals (hPa)', 'Degrees Celsius (°C)', 'Kilometres per hour'], marks: 2 },
        { type: 'written', q: 'Contrast the weather you would expect under high pressure with the weather under low pressure.', marks: 4, lines: 3,
          scheme: ['High pressure: dry, settled, clear skies (warm in summer, cold and frosty in winter) (2 marks)', 'Low pressure: cloudy, wet and windy, unsettled (2 marks)'],
          model: 'High pressure brings dry, calm weather with clear skies. Low pressure brings cloud, rain and strong winds.' }] },
      { id: 'ge-we-3', topic: 'weather', src: 'Exam style', type: 'group', q: 'Ireland’s climate.', parts: [
        { type: 'short', q: 'Name Ireland’s climate.', ans: ['cool temperate oceanic', 'temperate oceanic', 'cool temperate maritime', 'temperate maritime', 'maritime', 'oceanic'], marks: 2 },
        { type: 'written', q: 'Explain why places further north in Europe are usually colder.', marks: 3, lines: 2,
          scheme: ['Latitude: the sun’s rays hit at a lower angle, spreading heat over a larger area / passing through more atmosphere (3 marks)'],
          model: 'Further north the sun is lower in the sky, so its rays are spread over a bigger area and give less heat.' },
        { type: 'written', q: 'Explain how the North Atlantic Drift affects Ireland’s climate.', marks: 3, lines: 2,
          scheme: ['Warm ocean current from the Gulf of Mexico keeps winters mild / ports ice-free / westerly winds bring mild, moist air (3 marks)'],
          model: 'This warm ocean current keeps Ireland’s winters mild, so it rarely gets very cold for our latitude.' }] },
      { id: 'ge-we-4', topic: 'weather', src: 'Exam style', type: 'written', marks: 8, lines: 6,
        q: 'Name a significant weather event you have studied (e.g. a storm or hurricane) and a place it affected. Explain how it formed.',
        scheme: ['Named event (2 marks)', 'Named place affected (2 marks)', 'Formation, e.g. warm moist air rises over warm sea / low pressure forms / air spirals in / strong winds and heavy rain (4 marks)'],
        model: 'Storm Ophelia, 2017, hit Cork and the south coast. It formed over warm Atlantic water: warm, moist air rose quickly, creating very low pressure, and air rushed in and spiralled, causing violent winds and heavy rain.' },
      { id: 'ge-map-1', topic: 'maps', src: 'Exam style', type: 'group', q: 'Ordnance Survey map skills.', parts: [
        { type: 'short', q: 'In a grid reference, which comes first: the easting or the northing?', ans: ['easting', 'the easting'], marks: 2 },
        { type: 'mcq', q: 'A six-figure grid reference gives a position to the nearest…', ans: '100 metres', opts: ['1 kilometre', '10 metres', '1 metre'], marks: 2 },
        { type: 'short', q: 'On a 1:50 000 map, how many kilometres do 2 cm represent?', ans: ['1', '1 km', 'one kilometre', '1km'], marks: 2 },
        { type: 'written', q: 'Name two ways height (relief) is shown on an Ordnance Survey map.', marks: 4, lines: 2,
          scheme: ['Any two: contour lines / spot heights / triangulation pillars / colour layering (2 marks each)'],
          model: 'Contour lines and spot heights.' }] },
      { id: 'ge-map-2', topic: 'maps', src: 'Exam style', type: 'group', q: 'Scale and direction.', parts: [
        { type: 'short', q: 'On a 1:50 000 map, how many metres does 1 cm represent?', ans: ['500', '500 m', '500 metres', '500m'], marks: 2 },
        { type: 'mcq', q: 'On an Ordnance Survey map, which direction is towards the right-hand edge?', ans: 'East', opts: ['West', 'North', 'South'], marks: 2 },
        { type: 'short', q: 'On a 1:50 000 map, each grid square covers how many square kilometres?', ans: ['1', '1 km²', '1 square kilometre', 'one'], marks: 2 }] },
      { id: 'ge-map-3', topic: 'maps', src: 'Exam style', type: 'group', q: 'Settlement on maps.', parts: [
        { type: 'mcq', q: 'Houses built in a line along a road form which settlement pattern?', ans: 'Linear', opts: ['Nucleated', 'Dispersed', 'Isolated'], marks: 2 },
        { type: 'written', q: 'Explain briefly why linear settlement patterns develop.', marks: 3, lines: 2,
          scheme: ['Houses are built along roads, rivers or the coast for easy access / services such as water and electricity run along the road (3 marks)'],
          model: 'People build along roads because it gives easy access to transport, and electricity and water pipes already run along the road.' }] },
      { id: 'ge-earth-1', topic: 'earth', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Name the three layers of the Earth and describe one of them.',
        scheme: ['Crust (1 mark)', 'Mantle (1 mark)', 'Core (1 mark)', 'A correct description, e.g. the mantle is molten rock (magma) with convection currents (3 marks)'],
        model: 'The crust, the mantle and the core. The mantle is made of hot, semi-molten rock (magma) where convection currents move the plates.' },
      { id: 'ge-earth-2', topic: 'earth', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain what happens at a destructive (converging) plate boundary.',
        scheme: ['Plates move towards each other (2 marks)', 'The heavier oceanic plate is subducted / sinks under the other plate (2 marks)', 'It melts, causing volcanoes / earthquakes / fold mountains (2 marks)'],
        model: 'Two plates move towards each other. The denser oceanic plate sinks (is subducted) beneath the other and melts in the mantle, which causes earthquakes and volcanoes.' },
      { id: 'ge-vol-1', topic: 'volcanoes', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain how a volcano forms.',
        scheme: ['Magma rises from the mantle through a crack/weakness in the crust (2 marks)', 'It erupts through the vent as lava, ash and gases (2 marks)', 'Layers of lava/ash build up to form a cone (2 marks)'],
        model: 'Magma rises from the mantle through cracks in the crust and erupts through the vent as lava, ash and gas. Over time the layers build up to form a cone.' },
      { id: 'ge-eq-1', topic: 'earthquakes', src: 'Exam style', type: 'group', q: 'Earthquakes.', parts: [
        { type: 'short', q: 'What is the point inside the Earth where an earthquake starts called?', ans: ['the focus', 'focus'], marks: 2 },
        { type: 'short', q: 'What is the point on the surface directly above it called?', ans: ['the epicentre', 'epicentre', 'epicenter'], marks: 2 },
        { type: 'short', q: 'Name the instrument used to measure earthquakes.', ans: ['seismometer', 'a seismometer', 'seismograph', 'a seismograph'], marks: 2 },
        { type: 'written', q: 'Describe two effects of an earthquake you have studied. Name the earthquake.', marks: 6, lines: 4,
          scheme: ['Named example (place and/or year) (2 marks)', 'First effect, e.g. buildings collapsed / deaths (2 marks)', 'Second effect, e.g. tsunami, fires, damage to roads or water supply (2 marks)'],
          model: 'Japan, 2011: buildings collapsed and thousands died; a huge tsunami flooded the coast and damaged the Fukushima nuclear plant.' }] },
      { id: 'ge-fold-1', topic: 'fold', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain how fold mountains are formed. Name an example.',
        scheme: ['Two plates collide / push together (2 marks)', 'Layers of rock are squeezed and folded up into upfolds and downfolds (2 marks)', 'Named example, e.g. the Alps, Himalayas, Rockies, or the Macgillycuddy’s Reeks in Ireland (2 marks)'],
        model: 'When two plates collide, the layers of sedimentary rock between them are squeezed and buckled into folds (anticlines and synclines). Example: the Alps.' },
      { id: 'ge-gl-1', topic: 'glaciation', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain the difference between plucking and abrasion.',
        scheme: ['Plucking: ice freezes onto loose rock and pulls it away as the glacier moves (3 marks)', 'Abrasion: rocks carried in the ice scrape and smooth the rock below, like sandpaper (3 marks)'],
        model: 'Plucking is when meltwater freezes onto loose rocks and the moving glacier pulls them away. Abrasion is when rocks frozen into the base of the glacier scrape and polish the rock beneath.' },
      { id: 'ge-gl-2', topic: 'glaciation', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Explain how a corrie (cirque) is formed.',
        scheme: ['Snow collects in a hollow and turns to ice (2 marks)', 'Plucking steepens the back wall; abrasion deepens the floor (2 marks)', 'When the ice melts, a lake (tarn) may form behind a lip (2 marks)'],
        model: 'Snow builds up in a hollow on a mountain and turns to ice. Plucking makes the back wall steep and abrasion deepens the hollow. When the ice melts, a lake called a tarn may fill it, held in by the lip.' },
      { id: 'ge-we-1', topic: 'weather', src: 'Exam style', type: 'group', q: 'Measuring weather.', parts: [
        { type: 'short', q: 'Which instrument measures air pressure?', ans: ['barometer', 'a barometer'], marks: 2 },
        { type: 'short', q: 'Which instrument measures wind speed?', ans: ['anemometer', 'an anemometer'], marks: 2 },
        { type: 'short', q: 'Which instrument measures rainfall?', ans: ['rain gauge', 'a rain gauge'], marks: 2 },
        { type: 'written', q: 'Explain why a Stevenson screen is painted white and has slatted sides.', marks: 4, lines: 3,
          scheme: ['White reflects the sun’s heat, so readings are not too high (2 marks)', 'Slats let air flow freely through it (2 marks)'],
          model: 'It is white to reflect sunlight so the thermometers aren’t heated directly, and the slatted sides let air circulate freely so the readings show the true air temperature.' }] }
    ],
    topics: [
      { id: 'earth', label: 'Dynamic Earth', icon: 'globe', desc: 'Ch 1: the Earth’s layers, plates and plate boundaries',
        notes: ['earth'], fc: ['earth'], quiz: ['earth'], match: ['earth'], prac: ['earth'] },
      { id: 'volcanoes', label: 'Volcanic activity', icon: 'volcano', desc: 'Ch 2: how volcanoes form, their parts and effects',
        notes: ['volcanoes'], fc: ['volcanoes'], quiz: ['volcanoes'], match: ['volcanoes'], prac: ['volcanoes'] },
      { id: 'earthquakes', label: 'Earthquakes', icon: 'activity', desc: 'Ch 3: focus, epicentre, measuring and case studies',
        notes: ['earthquakes'], fc: ['earthquakes'], quiz: ['earthquakes'], match: ['earthquakes'], prac: ['earthquakes'] },
      { id: 'fold', label: 'Fold mountains', icon: 'mountain', desc: 'Ch 4: how they form, folding periods, people and mountains',
        notes: ['fold'], fc: ['fold'], quiz: ['fold'], match: ['fold'], prac: ['fold'] },
      { id: 'glaciation', label: 'Glaciation', icon: 'snow', desc: 'Ch 12: plucking, abrasion, erosion and deposition landforms',
        notes: ['glacProcesses', 'cirque', 'esker'], fc: ['glaciation'], quiz: ['glaciation'], match: ['glacErosion', 'glacDeposition'], prac: ['cirque', 'glaciation'] },
      { id: 'weather', label: 'Weather', icon: 'thermometer', desc: 'Ch 13: instruments, measuring and forecasting',
        notes: ['weather'], fc: ['weather'], quiz: ['weather'], match: ['weather'], prac: ['weather'] },
      { id: 'maps', label: 'OS map skills', icon: 'map', desc: 'Four-figure grid references', notes: ['maps'], quiz: ['maps'] }
    ],

    notes: {
      earth: { label: 'Dynamic Earth', sections: [
        { h: 'Structure of the Earth', kv: [['Crust', 'The thin, solid outer layer. <b>Continental</b> crust is thicker and lighter; <b>oceanic</b> crust is thinner and denser.'],
          ['Mantle', 'The thickest layer, made of semi-molten rock called <b>magma</b>.'], ['Outer core', 'Liquid iron and nickel.'],
          ['Inner core', 'Solid iron and nickel; the hottest part (about 5,500°C).']] },
        { h: 'Plates and plate tectonics', list: ['The crust is broken into huge pieces called <b>plates</b> (e.g. Eurasian, North American, Pacific, African).',
          '<b>Convection currents</b> in the mantle move the plates a few centimetres a year.',
          'About 200 million years ago all the land was one supercontinent, <b>Pangaea</b>. Alfred Wegener called the movement <b>continental drift</b>.'] },
        { h: 'Plate boundaries', kv: [['Constructive (separating)', 'Plates move apart; magma rises to form new crust, e.g. the <b>Mid-Atlantic Ridge</b> and Iceland.'],
          ['Destructive (colliding)', 'Plates collide; the denser oceanic plate sinks (<b>subduction</b>) and melts, causing volcanoes, earthquakes and fold mountains, e.g. the Andes.'],
          ['Passive (sliding)', 'Plates slide past each other; crust is neither made nor destroyed, causing earthquakes, e.g. the <b>San Andreas Fault</b>, California.']] }
      ] },
      volcanoes: { label: 'Volcanic activity', sections: [
        { h: 'Key words', kv: [['Magma', 'Molten rock under the surface.'], ['Lava', 'Magma that has reached the surface.'], ['Magma chamber', 'Store of magma below the volcano.'],
          ['Vent', 'The pipe magma travels up.'], ['Crater', 'The opening at the top.'], ['Cone', 'The mountain built from layers of lava and ash.']] },
        { h: 'Types', kv: [['Active', 'Has erupted recently and may erupt again, e.g. Mount Etna (Italy).'], ['Dormant', 'Has not erupted for a long time but could, e.g. Mount Vesuvius.'],
          ['Extinct', 'Will not erupt again, e.g. Slemish (Co. Antrim).']] },
        { h: 'How a volcano forms', ol: ['At a plate boundary, magma is forced up from the mantle through cracks in the crust.', 'It erupts through the vent as lava, ash and gases.',
          'Layers of lava and ash cool and build up into a cone.', 'Over many eruptions the cone grows into a volcanic mountain.'] },
        { h: 'Other volcanic landforms', list: ['<b>Lava plateau</b>: runny basalt lava spreads over a wide area, e.g. the <b>Antrim Plateau</b> and the Giant’s Causeway.',
          '<b>Geysers</b> and <b>hot springs</b>: water heated by magma, e.g. in Iceland.'] },
        { h: 'Effects', kv: [['Positive', 'Fertile soil, tourism, geothermal energy, new land.'], ['Negative', 'Loss of life, destroyed homes and crops, ash clouds that stop flights (e.g. Eyjafjallajökull, Iceland, 2010).']] }
      ] },
      earthquakes: { label: 'Earthquakes', sections: [
        { h: 'Key words', kv: [['Earthquake', 'A sudden shaking of the crust when plates slip.'], ['Focus', 'The point underground where the earthquake starts.'],
          ['Epicentre', 'The point on the surface directly above the focus, where it is strongest.'], ['Seismic waves', 'Shock waves that spread out from the focus.'],
          ['Aftershocks', 'Smaller tremors after the main earthquake.'], ['Tsunami', 'A huge sea wave caused by an earthquake under the sea.']] },
        { h: 'Measuring earthquakes', kv: [['Seismograph', 'The instrument that records earthquakes.'], ['Richter scale', 'Measures the <b>magnitude</b> (strength). Each step is 10 times stronger.'],
          ['Mercalli scale', 'Measures the damage caused (I to XII).']] },
        { h: 'Case studies', kv: [['Nepal, 2015', 'Magnitude 7.8 where the Indian and Eurasian plates collide. About 9,000 people died; avalanches on Everest.'],
          ['Japan, 2011', 'Magnitude 9.0 under the sea caused a tsunami and the Fukushima nuclear accident.'],
          ['Chile, 2010', 'Magnitude 8.8 at a destructive boundary; strict building codes reduced deaths.']] },
        { h: 'Reducing damage', list: ['Earthquake-proof buildings (deep foundations, steel frames, rubber shock absorbers).', 'Earthquake drills and emergency kits.', 'Monitoring and tsunami warning systems.'] }
      ] },
      fold: { label: 'Fold mountains', sections: [
        { h: 'How fold mountains form', ol: ['Two plates move towards each other (a destructive boundary).', 'Layers of sedimentary rock between them are squeezed and crumpled.',
          'The rocks buckle into upfolds called <b>anticlines</b> and downfolds called <b>synclines</b>.', 'Over millions of years they are pushed up to form fold mountains.'],
          tip: 'Draw and label a diagram: plates, arrows showing compression, anticline, syncline.' },
        { h: 'Folding periods', kv: [['Caledonian (about 400 million years ago)', 'Donegal, Mayo and Wicklow mountains.'],
          ['Armorican (about 250 million years ago)', 'Munster ridges, e.g. MacGillycuddy’s Reeks and the Galtees.'],
          ['Alpine (about 30 million years ago)', 'The Alps, Himalayas, Andes and Rockies.']] },
        { h: 'People and fold mountains', list: ['<b>Tourism</b>: skiing and hiking (e.g. the Alps).', '<b>Farming</b>: grazing sheep and cattle on lower slopes.',
          '<b>Hydroelectric power</b> from fast mountain rivers.', '<b>Forestry</b> and <b>mining</b>.'] }
      ] },
      glacProcesses: { label: 'Glaciation: processes', sections: [
        { h: 'Key words', kv: [['Glacier', 'A slow-moving river of ice.'], ['Ice age', 'A long cold period when ice sheets covered much of the land; the last one in Ireland ended about 10,000 years ago.'],
          ['Névé (firn)', 'Compressed snow on its way to becoming glacier ice.']] },
        { h: 'Processes of glacial erosion', kv: [['Plucking', 'Meltwater freezes onto rock at the base and sides of the glacier. As the glacier moves it pulls (plucks) loose pieces of rock away, leaving a jagged surface.'],
          ['Abrasion', 'Rocks frozen into the bottom of the glacier scrape and grind the land like sandpaper, leaving it smooth with scratches called <b>striations</b>.']] },
        { h: 'Landforms to recognise', kv: [['Erosion', 'Cirque (corrie), arête, pyramidal peak, U-shaped valley, hanging valley, ribbon lake, truncated spur.'],
          ['Deposition', 'Moraine (lateral, medial, terminal), drumlin, esker, erratic, boulder clay, outwash plain.']] }
      ] },
      cirque: { label: 'Cirque (erosion)', sections: [
        { h: 'Cirque (corrie): a feature of glacial erosion', p: ['A cirque is an armchair-shaped hollow with a steep back wall, found high on a mountain side. Example: <b>Coumshingaun</b>, Comeragh Mountains, Co. Waterford.'],
          ol: ['Snow gathered in a hollow on a north-facing slope, where it was shaded from the sun.', 'Over time the snow was compressed into <b>névé</b> and then glacier ice.',
            '<b>Plucking</b> tore rock from the back wall, making it steep and jagged.', '<b>Abrasion</b> by rocks in the base of the glacier deepened the floor of the hollow.',
            'The ice moved with a rotational (circular) movement, deepening the hollow further.', 'A rock lip formed at the front where erosion was less.',
            'When the ice melted, water filled the hollow to form a lake called a <b>tarn</b>, e.g. Coumshingaun Lough.'],
          tip: 'Exam answer: name the feature, give an Irish example, draw a labelled diagram, and explain the formation in 4–5 points using plucking and abrasion.' }
      ] },
      esker: { label: 'Esker (deposition)', sections: [
        { h: 'Esker: a feature of glacial deposition', p: ['An esker is a long, narrow, winding ridge of <b>sorted</b> sand and gravel. Example: the <b>Esker Riada</b>, which runs across the midlands from Dublin to Galway.'],
          ol: ['As the ice age ended, the glacier began to melt.', 'Meltwater streams flowed in tunnels under the glacier, carrying sand and gravel.',
            'The streams deposited this material on the beds of the tunnels.', 'The material was sorted: heavier gravel dropped first and finer sand was carried further.',
            'When the glacier retreated, the deposits were left behind as a long winding ridge.'],
          tip: 'Eskers are used for sand and gravel quarries and were used as routeways (the Esker Riada was an ancient road).' }
      ] },
      weather: { label: 'Weather', sections: [
        { h: 'Weather instruments', kv: [['Thermometer', 'Temperature (°C). A maximum–minimum thermometer records the highest and lowest temperatures.'],
          ['Barometer', 'Air pressure (hectopascals / millibars).'], ['Anemometer', 'Wind speed (km/h or knots).'], ['Wind vane', 'Wind direction.'],
          ['Rain gauge', 'Rainfall (mm).'], ['Hygrometer', 'Humidity (moisture in the air).'], ['Sunshine recorder', 'Hours of sunshine (Campbell–Stokes recorder).'],
          ['Stevenson screen', 'A white wooden box on legs with slatted sides that holds thermometers in the shade.']] },
        { h: 'Pressure and forecasting', kv: [['Anticyclone (high pressure)', 'Dry, settled weather: warm in summer, cold and frosty in winter.'],
          ['Depression (low pressure)', 'Cloudy, wet and windy weather.'], ['Isobars', 'Lines on a weather map joining places of equal pressure. Close isobars mean strong wind.'],
          ['Forecasting', 'Met Éireann uses weather stations, satellites, weather balloons, radar and computer models.']] },
        { h: 'Clouds', kv: [['Cumulus', 'Fluffy, heaped clouds; fair weather.'], ['Stratus', 'Grey layer clouds; dull, drizzly weather.'],
          ['Cirrus', 'High, wispy clouds made of ice crystals.'], ['Cumulonimbus', 'Tall, dark storm clouds: thunder, lightning and heavy rain.']] }
      ] },
      maps: { label: 'OS map skills', sections: [
        { h: 'Four-figure grid reference', ol: ['Find the square the feature is in.', 'Read the <b>easting</b> first: the number of the line on the <b>left</b> side of the square (along the bottom).',
          'Then the <b>northing</b>: the number of the line along the <b>bottom</b> of the square (up the side).', 'Write the sub-zone letter, then the easting, then the northing, e.g. <b>T 05 12</b>.'],
          tip: 'Remember: “along the corridor, then up the stairs”.' }
      ] }
    },

    decks: {
      earth: { label: 'Dynamic Earth', cards: cards([['Crust', 'Thin solid outer layer'], ['Mantle', 'Thickest layer of semi-molten rock (magma)'],
        ['Outer core', 'Liquid iron and nickel'], ['Inner core', 'Solid iron and nickel, the hottest part'], ['Plate', 'A large piece of the Earth’s crust'],
        ['Convection currents', 'Currents in the mantle that move the plates'], ['Pangaea', 'The supercontinent that existed about 200 million years ago'],
        ['Continental drift', 'Wegener’s idea that continents move'], ['Constructive boundary', 'Plates separate; new crust forms (Mid-Atlantic Ridge)'],
        ['Destructive boundary', 'Plates collide; crust is destroyed (subduction)'], ['Passive boundary', 'Plates slide past each other (San Andreas Fault)'],
        ['Subduction', 'The denser plate sinks beneath the other and melts']]) },
      volcanoes: { label: 'Volcanoes', cards: cards([['Magma', 'Molten rock below the surface'], ['Lava', 'Magma that reaches the surface'], ['Vent', 'The pipe magma rises through'],
        ['Crater', 'The opening at the top of a volcano'], ['Magma chamber', 'Store of magma under a volcano'], ['Active volcano', 'Erupted recently, e.g. Etna'],
        ['Dormant volcano', 'Not erupted for a long time, e.g. Vesuvius'], ['Extinct volcano', 'Will not erupt again, e.g. Slemish'],
        ['Lava plateau', 'Flat area of basalt lava, e.g. Antrim Plateau'], ['Geyser', 'Hot water and steam shooting out of the ground']]) },
      earthquakes: { label: 'Earthquakes', cards: cards([['Focus', 'Point underground where an earthquake starts'], ['Epicentre', 'Point on the surface above the focus'],
        ['Seismic waves', 'Shock waves from the focus'], ['Seismograph', 'Instrument that records earthquakes'], ['Richter scale', 'Measures magnitude (strength)'],
        ['Mercalli scale', 'Measures the damage caused'], ['Aftershock', 'Smaller tremor after an earthquake'], ['Tsunami', 'Huge wave caused by an undersea earthquake'],
        ['Nepal 2015', 'Magnitude 7.8; about 9,000 deaths'], ['Japan 2011', 'Magnitude 9.0; tsunami and Fukushima']]) },
      fold: { label: 'Fold mountains', cards: cards([['Fold mountains', 'Mountains formed when plates collide and rock layers buckle'], ['Anticline', 'An upfold'], ['Syncline', 'A downfold'],
        ['Caledonian folding', 'About 400 million years ago: Donegal, Mayo, Wicklow'], ['Armorican folding', 'About 250 million years ago: Munster ridges, e.g. MacGillycuddy’s Reeks'],
        ['Alpine folding', 'About 30 million years ago: Alps, Himalayas, Andes, Rockies'], ['Compression', 'Squeezing of rock layers by colliding plates']]) },
      glaciation: { label: 'Glaciation', cards: cards([['Plucking', 'Meltwater freezes onto rock and the moving ice pulls pieces away'],
        ['Abrasion', 'Rocks in the ice scrape and smooth the land like sandpaper'], ['Striations', 'Scratches on rock caused by abrasion'],
        ['Cirque (corrie)', 'Armchair-shaped hollow with a steep back wall, e.g. Coumshingaun'], ['Tarn', 'Lake in a cirque'],
        ['Arête', 'Knife-edge ridge between two cirques'], ['Pyramidal peak', 'Pointed peak formed by three or more cirques, e.g. Carrauntoohil'],
        ['U-shaped valley', 'Steep-sided, flat-floored valley carved by a glacier, e.g. Glendalough'], ['Hanging valley', 'Small valley left high above a U-shaped valley'],
        ['Ribbon lake', 'Long narrow lake on the floor of a U-shaped valley'], ['Moraine', 'Material deposited by a glacier'], ['Drumlin', 'Egg-shaped hill of boulder clay, e.g. Clew Bay'],
        ['Esker', 'Long winding ridge of sorted sand and gravel, e.g. Esker Riada'], ['Erratic', 'A large boulder carried by ice and dropped far from where it came from'],
        ['Boulder clay', 'Unsorted mix of clay, sand and rocks dropped by ice'], ['Outwash plain', 'Flat area of sorted sand and gravel spread by meltwater']]) },
      weather: { label: 'Weather', cards: cards([['Thermometer', 'Measures temperature (°C)'], ['Barometer', 'Measures air pressure (hPa)'], ['Anemometer', 'Measures wind speed'],
        ['Wind vane', 'Shows wind direction'], ['Rain gauge', 'Measures rainfall (mm)'], ['Hygrometer', 'Measures humidity'], ['Stevenson screen', 'White slatted box that shades thermometers'],
        ['Anticyclone', 'High pressure: dry, settled weather'], ['Depression', 'Low pressure: wet, windy weather'], ['Isobars', 'Lines joining places of equal pressure'],
        ['Cumulonimbus', 'Tall storm cloud'], ['Cirrus', 'High wispy ice-crystal cloud']]) }
    },

    quizzes: {
      earth: { label: 'Dynamic Earth', questions: [
        { q: 'Which is the thickest layer of the Earth?', ans: ['The mantle'], opts: ['The crust', 'The inner core', 'The outer core'] },
        { q: 'What is the inner core made of?', ans: ['Solid iron and nickel'], opts: ['Liquid iron and nickel', 'Semi-molten rock', 'Granite'] },
        { q: 'What moves the Earth’s plates?', ans: ['Convection currents in the mantle'], opts: ['The moon’s gravity', 'Ocean tides', 'Wind'] },
        { q: 'What was Pangaea?', ans: ['A supercontinent'], opts: ['A volcano', 'A plate boundary', 'An ocean'] },
        { q: 'At which boundary do plates move apart?', ans: ['Constructive'], opts: ['Destructive', 'Passive', 'Subduction'] },
        { q: 'The San Andreas Fault is an example of which boundary?', ans: ['Passive'], opts: ['Constructive', 'Destructive', 'Volcanic'] },
        { q: 'What is subduction?', ans: ['A denser plate sinking beneath another'], opts: ['Plates sliding past each other', 'New crust forming', 'Lava cooling'] },
        { q: 'The Mid-Atlantic Ridge is at which type of boundary?', ans: ['Constructive'], opts: ['Destructive', 'Passive', 'Fold'] }
      ] },
      volcanoes: { label: 'Volcanic activity', questions: [
        { q: 'What is magma called once it reaches the surface?', ans: ['Lava'], opts: ['Ash', 'Basalt', 'Pumice'] },
        { q: 'A volcano that has not erupted for a long time but could is…', ans: ['Dormant'], opts: ['Active', 'Extinct', 'Passive'] },
        { q: 'Which is an Irish example of a lava plateau?', ans: ['The Antrim Plateau'], opts: ['The Burren', 'Coumshingaun', 'The Galtees'] },
        { q: 'Where is magma stored under a volcano?', ans: ['The magma chamber'], opts: ['The crater', 'The vent', 'The cone'] },
        { q: 'Which is a positive effect of volcanoes?', ans: ['Fertile soil'], opts: ['Ash clouds', 'Loss of life', 'Destroyed crops'] },
        { q: 'Which volcano stopped flights across Europe in 2010?', ans: ['Eyjafjallajökull'], opts: ['Vesuvius', 'Etna', 'Mount St Helens'] }
      ] },
      earthquakes: { label: 'Earthquakes', questions: [
        { q: 'Where does an earthquake start underground?', ans: ['The focus'], opts: ['The epicentre', 'The fault line', 'The crater'] },
        { q: 'What is the point on the surface directly above the focus?', ans: ['The epicentre'], opts: ['The focus', 'The magma chamber', 'The aftershock'] },
        { q: 'Which instrument records earthquakes?', ans: ['A seismograph'], opts: ['A barometer', 'An anemometer', 'A hygrometer'] },
        { q: 'Which scale measures the strength (magnitude) of an earthquake?', ans: ['The Richter scale'], opts: ['The Mercalli scale', 'The Beaufort scale', 'The Celsius scale'] },
        { q: 'What can an earthquake under the sea cause?', ans: ['A tsunami'], opts: ['A drumlin', 'A geyser', 'An esker'] },
        { q: 'What magnitude was the 2015 Nepal earthquake?', ans: ['7.8'], opts: ['5.2', '9.5', '6.1'] },
        { q: 'Which is a way to reduce earthquake damage?', ans: ['Earthquake-proof buildings'], opts: ['Building on soft sand', 'Taller chimneys', 'Glass-fronted buildings'] }
      ] },
      fold: { label: 'Fold mountains', questions: [
        { q: 'An upfold in rock is called…', ans: ['An anticline'], opts: ['A syncline', 'A fault', 'A ridge'] },
        { q: 'A downfold in rock is called…', ans: ['A syncline'], opts: ['An anticline', 'A cirque', 'A plateau'] },
        { q: 'Which folding period formed the Munster ridges?', ans: ['Armorican'], opts: ['Caledonian', 'Alpine', 'Atlantic'] },
        { q: 'Which folding period formed the Alps and Himalayas?', ans: ['Alpine'], opts: ['Armorican', 'Caledonian', 'Andean'] },
        { q: 'Which folding period formed the Donegal and Wicklow mountains?', ans: ['Caledonian'], opts: ['Alpine', 'Armorican', 'Pacific'] },
        { q: 'At what kind of boundary do fold mountains form?', ans: ['Destructive (colliding plates)'], opts: ['Constructive', 'Passive', 'Anywhere in the middle of a plate'] },
        { q: 'Which is a way humans use fold mountains?', ans: ['Hydroelectric power'], opts: ['Rice growing', 'Building airports', 'Deep-sea fishing'] }
      ] },
      glaciation: { label: 'Glaciation', questions: [
        { q: 'Which process happens when meltwater freezes onto rock and the ice pulls it away?', ans: ['Plucking'], opts: ['Abrasion', 'Deposition', 'Weathering'] },
        { q: 'Which process scrapes and smooths rock like sandpaper?', ans: ['Abrasion'], opts: ['Plucking', 'Freeze-thaw', 'Subduction'] },
        { q: 'What is the lake in a cirque called?', ans: ['A tarn'], opts: ['A ribbon lake', 'An oxbow lake', 'A lagoon'] },
        { q: 'Which is an Irish example of a cirque?', ans: ['Coumshingaun'], opts: ['Esker Riada', 'Clew Bay', 'Glendalough'] },
        { q: 'A knife-edge ridge between two cirques is…', ans: ['An arête'], opts: ['A drumlin', 'An esker', 'A moraine'] },
        { q: 'Which is a feature of glacial deposition?', ans: ['A drumlin'], opts: ['A cirque', 'An arête', 'A pyramidal peak'] },
        { q: 'An esker is made of…', ans: ['Sorted sand and gravel'], opts: ['Unsorted boulder clay', 'Solid granite', 'Volcanic ash'] },
        { q: 'Where is the Esker Riada?', ans: ['Across the midlands from Dublin to Galway'], opts: ['In Clew Bay', 'In the Comeragh Mountains', 'On the Antrim coast'] },
        { q: 'What shape is a valley carved by a glacier?', ans: ['U-shaped'], opts: ['V-shaped', 'W-shaped', 'S-shaped'] },
        { q: 'Which side of a mountain do cirques usually form on in Ireland?', ans: ['North-facing'], opts: ['South-facing', 'West-facing', 'Any side equally'] }
      ] },
      weather: { label: 'Weather', questions: [
        { q: 'Which instrument measures air pressure?', ans: ['A barometer'], opts: ['An anemometer', 'A hygrometer', 'A rain gauge'] },
        { q: 'Which instrument measures wind speed?', ans: ['An anemometer'], opts: ['A wind vane', 'A barometer', 'A thermometer'] },
        { q: 'What does a hygrometer measure?', ans: ['Humidity'], opts: ['Rainfall', 'Wind direction', 'Sunshine'] },
        { q: 'What is a Stevenson screen for?', ans: ['Keeping thermometers in the shade'], opts: ['Catching rain', 'Measuring wind', 'Recording sunshine'] },
        { q: 'High pressure is also called…', ans: ['An anticyclone'], opts: ['A depression', 'A front', 'An isobar'] },
        { q: 'What weather does a depression bring?', ans: ['Wet and windy'], opts: ['Dry and settled', 'Frosty and clear', 'Calm and sunny'] },
        { q: 'Lines joining places of equal pressure are…', ans: ['Isobars'], opts: ['Isotherms', 'Contours', 'Eastings'] },
        { q: 'Which cloud brings thunderstorms?', ans: ['Cumulonimbus'], opts: ['Cirrus', 'Stratus', 'Cumulus'] }
      ] },
      maps: { label: 'Grid references', questions: [
        { q: 'In a grid reference, which number do you read first?', ans: ['The easting'], opts: ['The northing', 'The height', 'Either one'] },
        { q: 'Eastings are the lines that run…', ans: ['Up and down (read along the bottom)'], opts: ['Across (read up the side)', 'Diagonally', 'Along rivers'] },
        { q: 'What does a four-figure grid reference identify?', ans: ['A whole grid square'], opts: ['An exact point', 'A height', 'A direction'] },
        { q: 'Which comes first in an Irish grid reference?', ans: ['The sub-zone letter'], opts: ['The northing', 'The scale', 'The legend'] },
        { q: 'A memory trick for grid references is…', ans: ['Along the corridor, then up the stairs'], opts: ['Up the stairs, then along the corridor', 'North before east', 'Right then left'] }
      ] }
    },

    matches: {
      earth: { label: 'Layers & boundaries', colL: 'Term', colR: 'Meaning', pairs: pairs([['Crust', 'Thin outer layer'], ['Mantle', 'Semi-molten rock'], ['Inner core', 'Solid iron and nickel'],
        ['Constructive', 'Plates move apart'], ['Destructive', 'Plates collide'], ['Passive', 'Plates slide past'], ['Pangaea', 'Ancient supercontinent']]) },
      volcanoes: { label: 'Volcanoes', colL: 'Term', colR: 'Meaning', pairs: pairs([['Magma', 'Molten rock underground'], ['Lava', 'Molten rock on the surface'], ['Vent', 'Pipe magma rises through'],
        ['Crater', 'Opening at the top'], ['Dormant', 'Could erupt again'], ['Extinct', 'Will not erupt again']]) },
      earthquakes: { label: 'Earthquakes', colL: 'Term', colR: 'Meaning', pairs: pairs([['Focus', 'Where it starts underground'], ['Epicentre', 'Surface point above the focus'],
        ['Seismograph', 'Records earthquakes'], ['Richter scale', 'Measures magnitude'], ['Mercalli scale', 'Measures damage'], ['Tsunami', 'Giant sea wave']]) },
      fold: { label: 'Folding periods', colL: 'Period', colR: 'Example', pairs: pairs([['Caledonian', 'Wicklow Mountains'], ['Armorican', 'MacGillycuddy’s Reeks'],
        ['Alpine', 'The Himalayas'], ['Anticline', 'Upfold'], ['Syncline', 'Downfold']]) },
      glacErosion: { label: 'Erosion features', colL: 'Feature', colR: 'Description', pairs: pairs([['Cirque', 'Armchair-shaped hollow'], ['Arête', 'Knife-edge ridge'],
        ['Pyramidal peak', 'Pointed mountain top'], ['U-shaped valley', 'Steep sides, flat floor'], ['Hanging valley', 'Small valley high above the main one'], ['Ribbon lake', 'Long narrow lake']]) },
      glacDeposition: { label: 'Deposition features', colL: 'Feature', colR: 'Description', pairs: pairs([['Drumlin', 'Egg-shaped hill of boulder clay'], ['Esker', 'Winding ridge of sand and gravel'],
        ['Erratic', 'Boulder carried far from home'], ['Moraine', 'Material dropped by a glacier'], ['Outwash plain', 'Sorted material spread by meltwater'], ['Boulder clay', 'Unsorted mix dropped by ice']]) },
      weather: { label: 'Instruments', colL: 'Instrument', colR: 'Measures', pairs: pairs([['Thermometer', 'Temperature'], ['Barometer', 'Air pressure'], ['Anemometer', 'Wind speed'],
        ['Wind vane', 'Wind direction'], ['Rain gauge', 'Rainfall'], ['Hygrometer', 'Humidity']]) }
    },

    practice: {
      earth: { label: 'Dynamic Earth', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'The outer layer of the Earth is the ___.', ans: ['crust'] }, { q: 'The thickest layer is the ___.', ans: ['mantle'] },
        { q: '___ currents in the mantle move the plates.', ans: ['Convection'] }, { q: 'The ancient supercontinent was called ___.', ans: ['Pangaea'] },
        { q: 'At a ___ boundary plates move apart.', ans: ['constructive'] }, { q: 'When one plate sinks under another it is called ___.', ans: ['subduction'] }] },
      volcanoes: { label: 'Volcanoes', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'Molten rock under the ground is called ___.', ans: ['magma'] }, { q: 'Magma that reaches the surface is called ___.', ans: ['lava'] },
        { q: 'A volcano that will never erupt again is ___.', ans: ['extinct'] }, { q: 'The Antrim ___ is an Irish lava plateau.', ans: ['Plateau'] },
        { q: 'Magma rises up through the ___.', ans: ['vent'] }] },
      earthquakes: { label: 'Earthquakes', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'An earthquake starts at the ___.', ans: ['focus'] }, { q: 'The point on the surface above it is the ___.', ans: ['epicentre', 'epicenter'] },
        { q: 'A ___ records earthquakes.', ans: ['seismograph'] }, { q: 'The ___ scale measures magnitude.', ans: ['Richter'] },
        { q: 'A huge wave caused by an undersea earthquake is a ___.', ans: ['tsunami'] }] },
      fold: { label: 'Fold mountains', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'An upfold is called an ___.', ans: ['anticline'] }, { q: 'A downfold is called a ___.', ans: ['syncline'] },
        { q: 'The Munster ridges were formed in the ___ folding period.', ans: ['Armorican'] }, { q: 'The Alps were formed in the ___ folding period.', ans: ['Alpine'] },
        { q: 'Fold mountains form at ___ plate boundaries.', ans: ['destructive', 'colliding'] }] },
      cirque: { label: 'Explain a cirque', type: 'lines', intro: 'Complete the explanation of how a cirque forms.', items: [
        { q: 'Snow gathered in a hollow on a ___-facing slope.', ans: ['north'] }, { q: 'The snow was compressed into ___ and then ice.', ans: ['névé', 'neve', 'firn'] },
        { q: '___ made the back wall steep and jagged.', ans: ['Plucking'] }, { q: '___ deepened the floor of the hollow.', ans: ['Abrasion'] },
        { q: 'The ice moved with a ___ movement.', ans: ['rotational', 'circular'] }, { q: 'When the ice melted, a lake called a ___ formed.', ans: ['tarn'] },
        { q: 'An Irish example is ___ in Co. Waterford.', ans: ['Coumshingaun'] }] },
      glaciation: { label: 'Glaciation terms', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'A long winding ridge of sorted sand and gravel is an ___.', ans: ['esker'] }, { q: 'An egg-shaped hill of boulder clay is a ___.', ans: ['drumlin'] },
        { q: 'A knife-edge ridge is an ___.', ans: ['arête', 'arete'] }, { q: 'Scratches left on rock by abrasion are called ___.', ans: ['striations'] },
        { q: 'A boulder carried far by ice is an ___.', ans: ['erratic'] }] },
      weather: { label: 'Weather', type: 'lines', intro: 'Fill in the blanks.', items: [
        { q: 'A ___ measures air pressure.', ans: ['barometer'] }, { q: 'An ___ measures wind speed.', ans: ['anemometer'] },
        { q: 'A rain gauge measures rainfall in ___.', ans: ['mm', 'millimetres', 'millimeters'] }, { q: 'High pressure is called an ___.', ans: ['anticyclone'] },
        { q: 'Lines of equal pressure are called ___.', ans: ['isobars'] }] }
    }
  };

  window.SN_DATA.geography = { id: 'geography', title: 'Geography', subtitle: 'Geography', marking: { spelling: 'lenient', note: 'Geography: accept any correctly explained point; a named example (place) earns marks where the scheme asks for one.' }, years: { '2': y2 } };
})();
