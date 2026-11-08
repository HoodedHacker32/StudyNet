/* StudyNet — Maths data (2nd Year). Loaded by maths.html after maths.js (uses MX.m for maths display
   and MX.skills for the generated practice). Notes follow the methods taught in class. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  var m = window.MX ? MX.m : function (s) { return s; };
  function cards(pairs) { return pairs.map(function (p) { return { front: p[0], back: p[1] }; }); }
  function sk(ids) { var o = {}; ids.forEach(function (id) { if (window.MX && MX.skills[id]) o[id] = MX.skills[id]; }); return o; }

  var y2 = {
    blurb: 'Maths: algebra',
    exam: '<b>Feeling rusty?</b> Start with <b>Back to basics</b>. <b>In your class notes so far:</b> factorising (all four types), quadratic equations, simultaneous equations, long division in algebra and equations with fractions. Bring your calculator and log tables.',
    store: 'sn_maths_y2',
    score: 'maths_y2',
    topics: [
      { id: 'basics', label: 'Back to basics', icon: 'rewind', desc: 'The 1st Year skills all 2nd Year algebra is built on. Start here if you feel rusty.',
        notes: ['basics'], skills: ['negatives', 'likeTerms', 'expand1', 'subst', 'linear', 'factorPair'] },
      { id: 'factorising', label: 'Factorising', icon: 'grid', desc: 'HCF, grouping, quadratic trinomials, difference of two squares',
        notes: ['factorising', 'fully'], skills: ['expand', 'hcf', 'factHcf', 'group', 'quad1', 'quad2', 'dots', 'fully'], fc: ['factorising'], quiz: ['whichType'] },
      { id: 'quadratics', label: 'Quadratic equations', icon: 'target', desc: 'Solve by factorising or with the −b formula; form from roots',
        notes: ['quadratics', 'formula', 'fromRoots'], skills: ['solveFact', 'formula', 'formulaSurd', 'surd', 'fromRoots'], fc: ['quadratics'], quiz: ['quadratics'] },
      { id: 'simultaneous', label: 'Simultaneous equations', icon: 'link', desc: 'Two equations, two unknowns, and problems in context',
        notes: ['simultaneous'], skills: ['simul', 'simulWord'], quiz: ['simultaneous'] },
      { id: 'longdiv', label: 'Long division in algebra', icon: 'filter', desc: 'Dividing a cubic by a linear factor',
        notes: ['longDiv'], skills: ['longDiv'] },
      { id: 'fractions', label: 'Equations with fractions', icon: 'hash', desc: 'Clear the fractions with the LCM, then solve',
        notes: ['fracEq'], skills: ['fracEq'] }
    ],

    notes: {
      basics: { label: 'Back to basics', sections: [
        { h: 'If maths has slipped', p: ['Most of 2nd Year algebra is the same few 1st Year skills used again and again. If factorising or equations feel impossible, it’s nearly always one of these that has gone rusty. Get them solid and the rest gets much easier.',
          'Work down this page, then do the matching Skills. Use <b>Show me how</b> as often as you like: it walks you through the question you’re on.'] },
        { h: '1. Negative numbers', kv: [['Adding and taking away', 'Picture a number line. Adding moves right (up), taking away moves left (down). ' + m('-3 + 5 = 2') + ', ' + m('2 - 7 = -5') + '.'],
          ['Two minus signs together', 'make a plus: ' + m('4 - (-3) = 4 + 3 = 7') + '.'], ['Multiplying and dividing', 'Same signs give a plus, different signs give a minus: ' + m('(-4) * (-5) = 20') + ', ' + m('(-12) / 3 = -4') + '.']],
          tip: 'Most lost marks in algebra are sign mistakes. Slow down on the minus signs.' },
        { h: '2. Collecting like terms', p: ['Like terms have exactly the same letters and powers. You can only add or take away like terms.'],
          q: 'Simplify ' + m('3x + 5 - x + 2') + '.', steps: [{ h: 'The x terms:', t: m('3x - x = 2x') }, { h: 'The numbers:', t: m('5 + 2 = 7') }, { h: 'Answer:', t: m('2x + 7') }],
          tip: m('x') + ' means ' + m('1x') + '. And ' + m('x') + ' and ' + m('x^2') + ' are not like terms.' },
        { h: '3. Expanding one bracket', p: ['Multiply the number outside by <b>every</b> term inside.'],
          q: 'Expand ' + m('-3(2x - 5)') + '.', steps: [{ h: 'First term:', t: m('(-3) * 2x = -6x') }, { h: 'Second term:', t: m('(-3) * (-5) = +15') + ' (two minus signs make a plus)' }, { h: 'Answer:', t: m('-6x + 15') }] },
        { h: '4. Substitution', p: ['Put the number in place of the letter, <b>in brackets</b>. Then do the powers first, then multiply, then add and take away.'],
          q: 'Find the value of ' + m('x^2 + 4x') + ' when ' + m('x = -3') + '.', steps: [{ h: 'Put it in:', t: m('(-3)^2 + 4(-3)') }, { h: 'Powers first:', t: m('(-3)^2 = 9') + ' (a minus times a minus is a plus)' }, { h: 'Then:', t: m('9 - 12 = -3') }] },
        { h: '5. Solving an equation', p: ['An equation is a balance: whatever you do to one side, do to the other. The quick way: when a term changes side, it changes sign.'],
          q: 'Solve ' + m('3x + 4 = 19') + '.', steps: [{ h: 'Move the 4 across:', t: m('3x = 19 - 4') }, { h: 'Simplify:', t: m('3x = 15') }, { h: 'Divide by 3:', t: m('x = 5') }, { h: 'Check:', t: m('3(5) + 4 = 19') + ' ✓' }] },
        { h: '6. Two numbers that multiply and add', p: ['This is the key step in factorising quadratics like ' + m('x^2 + 10x + 24') + ': find two numbers that multiply to 24 and add to 10.'],
          q: 'Find two numbers that multiply to 24 and add to 10.', steps: [{ h: 'Pairs that multiply to 24:', t: '1 × 24, 2 × 12, 3 × 8, 4 × 6.' }, { h: 'Which pair adds to 10?', t: '4 + 6 = 10.' }, { h: 'Answer:', t: '4 and 6, so ' + m('x^2 + 10x + 24 = (x + 4)(x + 6)') + '.' }],
          tip: 'If the number to multiply to is negative, one number is positive and one is negative.' }
      ] },
      factorising: { label: 'The four types', sections: [
        { h: 'What factorising is', p: ['Factorising is the reverse of expanding brackets. Expanding ' + m('2(3x + 5)') + ' gives ' + m('6x + 10') + '; factorising ' + m('6x + 10') + ' gives ' + m('2(3x + 5)') + '.'],
          tip: 'Always check a factorised answer by multiplying it back out.' },
        { h: 'Which type?', kv: [['Type 1: HCF', 'Every term shares a factor. Always look for this first.'], ['Type 2: grouping', 'Four terms with no factor common to all of them.'],
          ['Type 3: quadratic trinomial', 'Three terms: ' + m('ax^2 + bx + c') + '.'], ['Type 4: difference of two squares', 'Two perfect squares with a minus between them: ' + m('a^2 - b^2') + '.']] },
        { h: 'Type 1: take out the highest common factor', list: ['To factorise completely, the HCF must go outside the bracket.', '1 or −1 is always a common factor (so ' + m('ab - ac + a = a(b - c + 1)') + ').'],
          q: 'Factorise ' + m('15pq + 3q^2') + '.', steps: [{ h: 'Step 1:', t: 'find the HCF of the terms, ' + m('3q') + ', and put it outside the bracket: ' + m('3q(   )') + '.' },
            { h: 'Step 2:', t: 'divide each term by the HCF. That is what goes in the bracket.' }, { h: 'Answer:', t: m('3q(5p + q)') }] },
        { h: 'Type 2: factorising by grouping', p: ['Used when there are four terms with no common factor. Make two pairs that each share a factor.'],
          q: 'Factorise ' + m('4x^2 + 3ay - 2ax - 6xy') + '.', steps: [{ h: 'Rearrange', t: 'so each pair shares a factor: ' + m('4x^2 - 2ax - 6xy + 3ay') + '.' },
            { h: 'HCF of each pair:', t: m('2x(2x - a) - 3y(2x - a)') + '. The two brackets must be the same.' }, { h: 'Answer:', t: m('(2x - 3y)(2x - a)') }],
          tip: 'If the brackets don’t match, swap the middle two terms and try again.' },
        { h: 'Type 3: quadratic trinomials', p: ['An expression ' + m('ax^2 + bx + c') + ' is called a quadratic expression because the highest power of x is 2.'],
          q: 'Factorise ' + m('3x^2 + 10x + 8') + '.', steps: [{ h: 'Step 1:', t: 'multiply the coefficient of ' + m('x^2') + ' by the constant: 3 × 8 = 24. Find two factors of 24 that add to the coefficient of x (10): 6 and 4.' },
            { h: 'Step 2:', t: 'rewrite the x term as the sum of the two: ' + m('3x^2 + 6x + 4x + 8') + '.' },
            { h: 'Step 3:', t: 'take out the HCF of each pair: ' + m('3x(x + 2) + 4(x + 2)') + '.' }, { h: 'Step 4:', t: m('(3x + 4)(x + 2)') }] },
        { q: 'Factorise ' + m('2x^2 - 11x + 12') + '.', steps: [{ h: 'Step 1:', t: '2 × 12 = 24. Factors that add to −11: −3 and −8.' }, { h: 'Step 2:', t: m('2x^2 - 3x - 8x + 12') },
          { h: 'Step 3:', t: m('x(2x - 3) - 4(2x - 3)') }, { h: 'Answer:', t: m('(x - 4)(2x - 3)') }],
          tip: 'Signs: if the constant is positive, both factors have the same sign as the x term. If it’s negative, the factors have different signs.' },
        { h: 'Type 4: the difference of two squares', p: [m('a^2 - b^2 = (a + b)(a - b)') + '. Learn this rule.'],
          q: 'Factorise ' + m('25x^2 - 49y^2') + '.', steps: [{ h: 'Step 1:', t: 'write each term as a perfect square in brackets: ' + m('(5x)^2 - (7y)^2') + '.' },
            { h: 'Step 2:', t: 'use the rule: ' + m('(5x + 7y)(5x - 7y)') }] }
      ] },
      fully: { label: 'Factorising fully', sections: [
        { h: 'Factorise more than once', p: ['“Factorise fully” means keep going until nothing more can be factorised. Take out the HCF first, then look at the bracket.'] },
        { q: 'Find the three factors of ' + m('20a^2 - 45b^2') + '.', steps: [{ h: 'HCF:', t: m('5(4a^2 - 9b^2)') }, { h: 'The bracket is a difference of two squares:', t: m('5((2a)^2 - (3b)^2)') }, { h: 'Answer:', t: m('5(2a + 3b)(2a - 3b)') }] },
        { q: 'Factorise ' + m('3px^2 - 6px - 45p') + '.', steps: [{ h: 'HCF:', t: m('3p(x^2 - 2x - 15)') }, { h: 'The bracket is a trinomial:', t: 'factors of −15 that add to −2 are −5 and 3.' }, { h: 'Answer:', t: m('3p(x - 5)(x + 3)') }] },
        { h: 'Exam tip', p: ['In the class test, “factorise fully” questions gave marks for the HCF step even when the last step was wrong, so always show it.'] }
      ] },
      quadratics: { label: 'Solving by factorising', sections: [
        { h: 'What a quadratic equation is', p: ['A quadratic equation has the form ' + m('ax^2 + bx + c = 0') + ', where a, b and c are constants and a ≠ 0. It usually has two answers (roots).'],
          kv: [['Three terms', m('x^2 - 2x - 3 = 0')], ['No constant', m('x^2 - 5x = 0')], ['No x term', m('x^2 - 16 = 0')]] },
        { h: 'Method 1: factorise', ol: ['Bring everything to the left-hand side so it equals 0.', 'Factorise.', 'Let each factor = 0.', 'Solve each one.'] },
        { q: 'Solve ' + m('3x^2 - 5x = 12') + '.', steps: [{ h: 'Step 1:', t: m('3x^2 - 5x - 12 = 0') }, { h: 'Step 2:', t: '3 × (−12) = −36; factors −9 and 4: ' + m('(3x + 4)(x - 3) = 0') },
          { h: 'Step 3:', t: m('3x + 4 = 0') + ' or ' + m('x - 3 = 0') }, { h: 'Step 4:', t: m('x = -frac(4, 3)') + ' or ' + m('x = 3') }] },
        { q: 'Solve ' + m('x^2 + 5x = 0') + '.', steps: [{ h: 'Factorise:', t: m('x(x + 5) = 0') }, { h: 'Answer:', t: m('x = 0') + ' or ' + m('x = -5') }],
          tip: 'Never divide both sides by x: you would lose the answer x = 0.' },
        { q: 'Solve ' + m('x^2 = 4') + '.', steps: [{ h: 'Bring to the left:', t: m('x^2 - 4 = 0') }, { h: 'Difference of two squares:', t: m('(x + 2)(x - 2) = 0') }, { h: 'Answer:', t: m('x = -2') + ' or ' + m('x = 2') }] }
      ] },
      formula: { label: 'The −b formula', sections: [
        { h: 'Method 2: the formula', p: ['The roots of ' + m('ax^2 + bx + c = 0') + ' are ' + m('x = frac(-b +- sqrt(b^2 - 4ac), 2a)') + '.', 'It’s on page 20 of the log tables. Use it when the question asks for decimals or surds, or when you can’t factorise.'] },
        { q: 'Solve ' + m('3x^2 - 8x - 2 = 0') + ', giving your answers correct to two decimal places.', steps: [{ h: 'Step 1: label', t: 'a = 3, b = −8, c = −2.' },
          { h: 'Step 2: fill in', t: m('x = frac(8 +- sqrt((-8)^2 - 4(3)(-2)), 2(3)) = frac(8 +- sqrt(88), 6)') },
          { h: 'Step 3: each root', t: m('frac(8 + sqrt(88), 6) = 2.90') + ' and ' + m('frac(8 - sqrt(88), 6) = -0.23') }],
          tip: 'Put brackets around negative numbers when you fill them in: (−8)² is +64.' },
        { q: 'Solve ' + m('x^2 - 6x + 1 = 0') + ', giving your answers in surd form.', steps: [{ h: 'Fill in:', t: m('x = frac(6 +- sqrt(36 - 4), 2) = frac(6 +- sqrt(32), 2)') },
          { h: 'Simplify the surd:', t: m('sqrt(32) = sqrt(16 * 2) = 4sqrt(2)') }, { h: 'Divide each term by 2:', t: m('x = 3 +- 2sqrt(2)') }] },
        { h: 'Simplifying surds', p: ['Find the biggest square number that divides in: ' + m('sqrt(32) = sqrt(16) * sqrt(2) = 4sqrt(2)') + '. Square numbers: 4, 9, 16, 25, 36, 49, 64, 81, 100.'] }
      ] },
      fromRoots: { label: 'Forming from roots', sections: [
        { h: 'Working backwards', p: ['Constructing a quadratic from its roots is the reverse of solving by factors.'] },
        { q: 'Find a quadratic equation with roots −2 and 3.', steps: [{ h: 'Roots to factors:', t: m('x = -2') + ' gives ' + m('x + 2 = 0') + '; ' + m('x = 3') + ' gives ' + m('x - 3 = 0') + '.' },
          { h: 'Multiply:', t: m('(x + 2)(x - 3) = 0') }, { h: 'Expand:', t: m('x^2 - x - 6 = 0') }] },
        { q: 'Find a quadratic equation with roots ' + m('frac(2, 3)') + ' and ' + m('-frac(1, 5)') + ', in the form ' + m('ax^2 + bx + c = 0') + ' with whole numbers.',
          steps: [{ h: 'Clear the fractions:', t: m('x = frac(2, 3)') + ' gives ' + m('3x = 2') + ', so ' + m('3x - 2 = 0') + '; ' + m('x = -frac(1, 5)') + ' gives ' + m('5x + 1 = 0') + '.' },
            { h: 'Multiply and expand:', t: m('(3x - 2)(5x + 1) = 15x^2 - 7x - 2 = 0') }] }
      ] },
      simultaneous: { label: 'Simultaneous equations', sections: [
        { h: 'Two equations, two unknowns', p: ['Simultaneous equations are solved together: find the x and y that make both true.'],
          ol: ['Line up the x’s, y’s, = signs and numbers.', 'Multiply one or both equations so the x (or y) terms are the same number.', 'Change the signs of one equation if needed, so one letter cancels.', 'Add, and solve for the letter that is left.', 'Substitute back into one of the original equations to find the other letter.'] },
        { q: 'Solve ' + m('2x - y = 4') + ' and ' + m('5x - 3y = 1') + '.', steps: [{ h: 'Multiply', t: 'the first by 3: ' + m('6x - 3y = 12') + '.' },
          { h: 'Subtract', t: 'the second: ' + m('x = 11') + '.' }, { h: 'Substitute:', t: m('2(11) - y = 4') + ', so ' + m('y = 18') + '.' }] },
        { q: 'Solve ' + m('2x + 3y = -2') + ' and ' + m('3x + 7y = -6') + '.', steps: [{ h: 'Make the x terms match:', t: m('6x + 9y = -6') + ' (×3) and ' + m('6x + 14y = -12') + ' (×2).' },
          { h: 'Subtract:', t: m('-5y = 6') + ', so ' + m('y = -frac(6, 5)') + '.' }, { h: 'Substitute:', t: m('2x + 3(-frac(6, 5)) = -2') + ', so ' + m('x = frac(4, 5)') + '.' }],
          tip: 'Answers can be fractions. Check them in the other equation.' },
        { h: 'Problems in context', p: ['Let x and y stand for the two unknown amounts. One equation usually counts things (units, tickets, heads); the other counts their cost or total.',
          'Example: electricity at 14c a unit by day and 7c by night, 1,100 units costing €129.50. Then ' + m('x + y = 1100') + ' and ' + m('14x + 7y = 12950') + ' (in cent).'] }
      ] },
      longDiv: { label: 'Long division', sections: [
        { h: 'How it works', p: ['Set it out like number long division. Divide the first term, multiply back, subtract, bring down the next term, and repeat.'] },
        { q: 'Divide ' + m('x^3 - x^2 - 11x + 15') + ' by ' + m('x - 3') + '.', steps: [{ h: 'Divide:', t: m('x^3') + ' ÷ ' + m('x = x^2') + '. Multiply: ' + m('x^2(x - 3) = x^3 - 3x^2') + '. Subtract: ' + m('2x^2') + '; bring down ' + m('-11x') + '.' },
          { h: 'Divide:', t: m('2x^2') + ' ÷ ' + m('x = 2x') + '. Multiply: ' + m('2x^2 - 6x') + '. Subtract: ' + m('-5x') + '; bring down ' + m('+15') + '.' },
          { h: 'Divide:', t: m('-5x') + ' ÷ ' + m('x = -5') + '. Multiply: ' + m('-5x + 15') + '. Subtract: 0.' }, { h: 'Answer:', t: m('x^2 + 2x - 5') }],
          tip: 'If a power of x is missing (like ' + m('4x^3 - 7x + 3') + '), write it in as ' + m('0x^2') + ' to keep the columns lined up.' }
      ] },
      fracEq: { label: 'Equations with fractions', sections: [
        { h: 'Get rid of the fractions first', p: ['Multiply every term by the LCM of the denominators. Then solve as usual.'] },
        { q: 'Solve ' + m('frac(2x, 3) + frac(x, 4) = frac(11, 6)') + '.', steps: [{ h: 'LCM of 3, 4 and 6:', t: '12.' }, { h: 'Multiply each term:', t: m('4(2x) + 3(x) = 2(11)') },
          { h: 'Simplify:', t: m('11x = 22') }, { h: 'Answer:', t: m('x = 2') }] },
        { q: 'Solve ' + m('frac(x + 1, 2) = frac(2x + 1, 10) + frac(x + 2, 3)') + '.', steps: [{ h: 'LCM:', t: '30.' }, { h: 'Multiply:', t: m('15(x + 1) = 3(2x + 1) + 10(x + 2)') },
          { h: 'Expand:', t: m('15x + 15 = 16x + 23') }, { h: 'Answer:', t: m('x = -8') }],
          tip: 'Put brackets around each top line before multiplying, so the minus signs stay right.' }
      ] }
    },

    decks: {
      factorising: { label: 'Factorising', cards: cards([['Type 1', 'Take out the HCF'], ['Type 2', 'Factorise by grouping (4 terms)'], ['Type 3', 'Quadratic trinomials: ax² + bx + c'],
        ['Type 4', 'Difference of two squares: a² − b² = (a + b)(a − b)'], ['First thing to check', 'Is there a common factor (HCF)?'], ['ax² + bx + c: step 1', 'Multiply a × c, then find two factors of that which add to b'],
        ['“Factorise fully”', 'Keep factorising until nothing more can be factorised'], ['Check your answer', 'Multiply it back out']]) },
      quadratics: { label: 'Quadratic equations', cards: cards([['Quadratic equation', 'ax² + bx + c = 0, a ≠ 0'], ['The −b formula', 'x = (−b ± √(b² − 4ac)) / 2a'],
        ['Where is the formula?', 'Page 20 of the log tables'], ['Method 1 steps', 'Everything to the left = 0, factorise, each factor = 0, solve'], ['Roots', 'The solutions of the equation'],
        ['Surd form', 'Leave the square root in, e.g. 3 ± 2√2'], ['√32 simplified', '4√2'], ['Roots 2 and −5 give', '(x − 2)(x + 5) = 0']]) }
    },

    quizzes: {
      whichType: { label: 'Which method?', questions: [
        { q: 'Which type of factorising do you use for 9y² − 49?', ans: ['Difference of two squares'], opts: ['Take out the HCF', 'Grouping', 'Quadratic trinomial'] },
        { q: 'Which type of factorising do you use for 2ax + 2bx + ay + by?', ans: ['Grouping'], opts: ['Difference of two squares', 'Quadratic trinomial', 'None: it can’t be factorised'] },
        { q: 'Which type of factorising do you use for x² + 10x + 24?', ans: ['Quadratic trinomial'], opts: ['Grouping', 'Difference of two squares', 'Take out the HCF'] },
        { q: 'What should you always check for first?', ans: ['A common factor (HCF)'], opts: ['A difference of two squares', 'Four terms', 'A minus sign'] },
        { q: 'Factorise 3x² − 15x.', ans: ['3x(x − 5)'], opts: ['x(3x − 15)', '3(x² − 5x)', '3x(x − 15)'] },
        { q: 'Factorise x² − 16.', ans: ['(x + 4)(x − 4)'], opts: ['(x − 4)(x − 4)', '(x + 8)(x − 8)', 'x(x − 16)'] },
        { q: 'Factorise x² − x − 6.', ans: ['(x − 3)(x + 2)'], opts: ['(x + 3)(x − 2)', '(x − 6)(x + 1)', '(x − 3)(x − 2)'] },
        { q: 'For 3x² + 10x + 8, what do you multiply first?', ans: ['3 × 8 = 24'], opts: ['3 × 10 = 30', '10 × 8 = 80', '3 + 8 = 11'] },
        { q: 'Why is 3(9x² − 4) not fully factorised?', ans: ['9x² − 4 is a difference of two squares'], opts: ['3 should be inside the bracket', 'It has a minus sign', 'It is fully factorised'] },
        { q: 'Factorise fully 27x² − 12.', ans: ['3(3x − 2)(3x + 2)'], opts: ['3(9x² − 4)', '(9x − 4)(3x + 3)', '3(3x − 2)²'] }
      ] },
      quadratics: { label: 'Quadratic equations', questions: [
        { q: 'Solve x² + 2x − 15 = 0.', ans: ['x = −5 or x = 3'], opts: ['x = 5 or x = −3', 'x = −15 or x = 1', 'x = 3 or x = 5'] },
        { q: 'Solve x² − 49 = 0.', ans: ['x = 7 or x = −7'], opts: ['x = 7 only', 'x = 49', 'x = 24.5'] },
        { q: 'Solve x² + 5x = 0.', ans: ['x = 0 or x = −5'], opts: ['x = −5 only', 'x = 5 or x = 0', 'x = 5'] },
        { q: 'In 6x² − 7x − 5 = 0, what is b?', ans: ['−7'], opts: ['7', '6', '−5'] },
        { q: 'What is the first step of solving 3x² − 5x = 12?', ans: ['Bring 12 to the left so it equals 0'], opts: ['Divide by x', 'Take the square root', 'Divide by 3'] },
        { q: 'Simplify √32.', ans: ['4√2'], opts: ['2√8', '16√2', '8√2'] },
        { q: 'Roots −2 and 3 give which equation?', ans: ['x² − x − 6 = 0'], opts: ['x² + x − 6 = 0', 'x² − x + 6 = 0', 'x² + 5x − 6 = 0'] },
        { q: 'Solve 6x² − 7x − 5 = 0 to 1 decimal place.', ans: ['x = 1.7 or x = −0.5'], opts: ['x = 1.6 or x = −0.6', 'x = 0.5 or x = −1.7', 'x = 1.7 only'] }
      ] },
      simultaneous: { label: 'Simultaneous equations', questions: [
        { q: 'To cancel x in 2x + 3y = −2 and 3x + 7y = −6, multiply by…', ans: ['3 and 2'], opts: ['2 and 3', '7 and 3', '3 and 7'] },
        { q: 'x + y = 10 and x − y = 4. What is x?', ans: ['7'], opts: ['3', '6', '14'] },
        { q: 'After finding y, what do you do next?', ans: ['Substitute y into one of the original equations'], opts: ['Start again with x', 'Add the two equations', 'Multiply y by x'] },
        { q: 'Hens (x) and sheep (y): 20 heads. Which equation is right?', ans: ['x + y = 20'], opts: ['2x + 4y = 20', 'x − y = 20', 'xy = 20'] }
      ] }
    },

    skills: sk(['negatives', 'likeTerms', 'expand1', 'subst', 'linear', 'factorPair', 'expand', 'hcf', 'factHcf', 'group', 'quad1', 'quad2', 'dots', 'fully', 'solveFact', 'formula', 'formulaSurd', 'surd', 'fromRoots', 'simul', 'simulWord', 'longDiv', 'fracEq']),

    /* Exam bank. Questions follow the class test (F2: factorising and quadratic equations, 80 marks)
       and the Junior Cycle paper style. Maths questions are generated fresh each time from the same pattern. */
    examq: [
      { id: 'm-b-1', topic: 'basics', src: 'Exam style', type: 'group', q: 'Back to basics.', parts: [
        { type: 'gen', gen: 'negatives', marks: 3 }, { type: 'gen', gen: 'likeTerms', marks: 3 }, { type: 'gen', gen: 'expand1', marks: 4 }] },
      { id: 'm-b-2', topic: 'basics', src: 'Exam style', type: 'group', q: 'Substitution and simple equations.', parts: [
        { type: 'gen', gen: 'subst', marks: 4 }, { type: 'gen', gen: 'linear', marks: 5 }, { type: 'gen', gen: 'linear', marks: 5 }] },
      { id: 'm-b-3', topic: 'basics', src: 'Exam style', type: 'group', q: 'Number skills for factorising.', parts: [
        { type: 'gen', gen: 'factorPair', marks: 3 }, { type: 'gen', gen: 'factorPair', marks: 3 }, { type: 'gen', gen: 'likeTerms', marks: 3 }] },
      { id: 'm-b-4', topic: 'basics', src: 'Exam style', type: 'group', q: 'Expand and simplify.', parts: [
        { type: 'gen', gen: 'expand1', marks: 4 }, { type: 'gen', gen: 'expand1', marks: 4 }, { type: 'gen', gen: 'subst', marks: 4 }] },
      { id: 'm-f-6', topic: 'factorising', src: 'Exam style', type: 'group', q: 'Factorise fully. (Grouping comes up on most papers.)', parts: [
        { type: 'gen', gen: 'group', marks: 5 }, { type: 'gen', gen: 'group', marks: 5 }, { type: 'gen', gen: 'quad2', marks: 5 }] },
      { id: 'm-q-ctx1', topic: 'quadratics', src: 'Exam style', type: 'written', marks: 15, lines: 8,
        q: 'A rectangular patio is 3 m longer than it is wide. Its area is 40 m². Let the width be <i>x</i> m.<br>(a) Write the length in terms of <i>x</i>.<br>(b) Show that <i>x</i>² + 3<i>x</i> − 40 = 0.<br>(c) Solve the equation to find the width and the length of the patio.',
        scheme: ['(a) Length = x + 3 (3 marks)', '(b) x(x + 3) = 40, so x² + 3x − 40 = 0 (4 marks)', '(c) (x + 8)(x − 5) = 0, so x = 5 or x = −8 (4 marks)', 'Rejects −8 because a length can’t be negative: width 5 m, length 8 m (4 marks)'],
        model: '(a) x + 3. (b) Area = x(x + 3) = 40, so x² + 3x = 40, so x² + 3x − 40 = 0. (c) (x + 8)(x − 5) = 0, so x = 5 or x = −8. A width can’t be negative, so the width is 5 m and the length is 8 m.' },
      { id: 'm-q-ctx2', topic: 'quadratics', src: 'Exam style', type: 'written', marks: 15, lines: 8,
        q: 'A square photo with sides of 10 cm has a border of width <i>x</i> cm all the way round it. The total area of the photo and border is 196 cm².<br>(a) Write the side length of the photo with its border in terms of <i>x</i>.<br>(b) Show that <i>x</i>² + 10<i>x</i> − 24 = 0.<br>(c) Find the width of the border.',
        scheme: ['(a) 10 + 2x (3 marks)', '(b) (10 + 2x)² = 196 → 100 + 40x + 4x² = 196 → 4x² + 40x − 96 = 0 → x² + 10x − 24 = 0 (5 marks)', '(c) (x + 12)(x − 2) = 0, so x = 2 or x = −12 (4 marks)', 'Border is 2 cm (rejects −12) (3 marks)'],
        model: '(a) 10 + 2x. (b) (10 + 2x)² = 196, so 100 + 40x + 4x² = 196, so 4x² + 40x − 96 = 0; dividing by 4 gives x² + 10x − 24 = 0. (c) (x + 12)(x − 2) = 0, so x = 2 (a width can’t be −12). The border is 2 cm wide.' },
      { id: 'm-sim-4', topic: 'simultaneous', src: 'Exam style', type: 'group', q: 'Solve the simultaneous equations to find <i>x</i> and <i>y</i>.', parts: [
        { type: 'gen', gen: 'simul', marks: 10 }, { type: 'gen', gen: 'simulWord', marks: 10 }] },
      { id: 'm-sim-5', topic: 'simultaneous', src: 'Exam style', type: 'gen', gen: 'simulWord', marks: 10 },
      { id: 'm-ld-2', topic: 'longdiv', src: 'Exam style', type: 'group', q: 'Divide, using long division.', parts: [
        { type: 'gen', gen: 'longDiv', marks: 10 }, { type: 'gen', gen: 'longDiv', marks: 10 }] },
      { id: 'm-ld-3', topic: 'longdiv', src: 'Exam style', type: 'gen', gen: 'longDiv', marks: 10 },
      { id: 'm-ld-4', topic: 'longdiv', src: 'Exam style', type: 'group', q: 'Long division and factors.', parts: [
        { type: 'gen', gen: 'longDiv', marks: 10 }, { type: 'gen', gen: 'quad1', marks: 5 }] },
      { id: 'm-fr-3', topic: 'fractions', src: 'Exam style', type: 'group', q: 'Solve each equation.', parts: [
        { type: 'gen', gen: 'fracEq', marks: 10 }, { type: 'gen', gen: 'fracEq', marks: 10 }] },
      { id: 'm-fr-4', topic: 'fractions', src: 'Exam style', type: 'gen', gen: 'fracEq', marks: 10 },
      { id: 'f2-1', topic: 'factorising', src: 'Class test style', type: 'group', q: 'Factorise fully the following expressions.', parts: [
        { type: 'gen', gen: 'factHcf', marks: 5 }, { type: 'gen', gen: 'group', marks: 5 }, { type: 'gen', gen: 'group', marks: 5 }, { type: 'gen', gen: 'fully', marks: 5 }] },
      { id: 'f2-2', topic: 'factorising', src: 'Class test style', type: 'group', q: 'Factorise the following.', parts: [
        { type: 'gen', gen: 'quad1', marks: 5 }, { type: 'gen', gen: 'quad1', marks: 5 }, { type: 'gen', gen: 'quad2', marks: 5 }] },
      { id: 'f2-3', topic: 'factorising', src: 'Class test style', type: 'group', q: 'Factorise each expression.', parts: [
        { type: 'gen', gen: 'dots', marks: 5 }, { type: 'gen', gen: 'dots', marks: 5 }, { type: 'gen', gen: 'fully', marks: 5 }] },
      { id: 'f2-4', topic: 'quadratics', src: 'Class test style', type: 'group', q: 'Solve the following equations.', parts: [
        { type: 'gen', gen: 'solveFact', marks: 10 }, { type: 'gen', gen: 'solveFact', marks: 10 }, { type: 'gen', gen: 'formula', marks: 10 }] },
      { id: 'q-surd', topic: 'quadratics', src: 'Exam style', type: 'group', q: 'Surds and the −b formula.', parts: [
        { type: 'gen', gen: 'surd', marks: 5 }, { type: 'gen', gen: 'formulaSurd', marks: 10 }] },
      { id: 'q-roots', topic: 'quadratics', src: 'Exam style', type: 'gen', gen: 'fromRoots', marks: 10 },
      { id: 'q-expand', topic: 'factorising', src: 'Exam style', type: 'gen', gen: 'expand', marks: 5 },
      { id: 's-1', topic: 'simultaneous', src: 'Exam style', type: 'gen', gen: 'simul', marks: 10 },
      { id: 's-2', topic: 'simultaneous', src: 'Exam style', type: 'gen', gen: 'simul', marks: 10 },
      { id: 's-3', topic: 'simultaneous', src: 'Exam style', type: 'gen', gen: 'simulWord', marks: 15 },
      { id: 'ld-1', topic: 'longdiv', src: 'Exam style', type: 'gen', gen: 'longDiv', marks: 10 },
      { id: 'fr-1', topic: 'fractions', src: 'Exam style', type: 'gen', gen: 'fracEq', marks: 10 },
      { id: 'fr-2', topic: 'fractions', src: 'Exam style', type: 'gen', gen: 'fracEq', marks: 10 },
      { id: 'w-1', topic: 'quadratics', src: 'Exam style', type: 'written', marks: 5, lines: 3,
        q: 'A student says that x² = 9 has only one answer, x = 3. Explain why they are wrong.',
        scheme: ['States that x = −3 is also an answer (3 marks)', 'Explains why: (−3)² = 9 as well, or solves (x + 3)(x − 3) = 0 (2 marks)'],
        model: 'x = −3 is also a solution, because (−3)² = 9. Solving x² − 9 = 0 gives (x + 3)(x − 3) = 0, so x = 3 or x = −3.' },
      { id: 'w-2', topic: 'factorising', src: 'Exam style', type: 'written', marks: 5, lines: 3,
        q: 'A student factorises 6x² − 24 as 6(x² − 4) and says they are finished. Are they right? Explain.',
        scheme: ['Says no / not fully factorised (2 marks)', 'Identifies x² − 4 as a difference of two squares and gives 6(x + 2)(x − 2) (3 marks)'],
        model: 'No. x² − 4 is a difference of two squares, so it factorises again: 6(x + 2)(x − 2).' }
    ]
  };

  window.SN_DATA.maths = { id: 'maths', title: 'Maths', subtitle: 'Mathematics', calculator: true,
    marking: { spelling: 'lenient', note: 'Maths: method marks for correct working even when the final answer is wrong. Accept any equivalent correct form unless the question asks for a particular form.' },
    years: { '2': y2 } };
})();
