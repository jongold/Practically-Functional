// Contravariant and Profunctors
// ================================

// Wrapping certain kinds of functions in a type is useful.
const Fn = g =>
({
  // compose
  map: f =>
    Fn(x => f(g(x))),
  // reverse compose
  contramap: f =>
    Fn(x => g(f(x))),
  // sandwich compose
  dimap: (f, h) =>
    Fn(x => h(g(f(x)))),
  fold: g,
});

// We start by wrapping our normal function in Fn()
const upper = Fn(x => x.toUpperCase());

// We can compose via map
const loud = upper.map(x => `${x}!`);

test('We can run the function using fold()', () => {
  expect(loud.fold('yo')).toBe('YO!');
});

test('We now have superpowers. We can "precompose" with contramap', () => {
  const b = upper.contramap(x => x.join(''));
  expect(b.fold(['h', 'i'])).toBe('HI');
});

// Ex1: model a predicate function :: a -> Bool and give it contraMap(). e.g. make the test work
// =========================
// const Pred :: a -> Bool
const Pred = g => ({
  contramap: f =>
    Pred(x => g(f(x))),
  fold: g,
});

test('Ex1: pred', () => {
  const p = Pred(x => x > 4).contramap(x => x.length);
  const result = ['hello', 'good', 'world'].filter(p.fold);
  expect(result).toEqual(['hello', 'world']);
});


// Ex2: Write a contramap/map that turns a string into an array using to/from so we can reverse it
// =========================

// to :: String -> Array
const to = x => x.split('');
// from :: Array -> String
const from = x => x.join('');

// stringReverse :: String -> String
const stringReverse = Fn(x => x.reverse()).contramap(to).map(from); // contramap/map here

test('Ex2: isomorphisms', () => {
  expect(stringReverse.fold('hi')).toBe('ih');
});

// Ex2.5: dimap(f, g) is just contramap(f).map(g) rewrite ex2 in terms of dimap
// =========================
const stringReverse2 = Fn(x => x.reverse()).dimap(to, from); // contramap/map here

test('Ex2.5: isomorphisms', () => {
  expect(stringReverse2.fold('hi')).toBe('ih');
});


// Ex3: model a Reducer function. Give it contramap, map, fold
// =========================

const Reducer = g => ({
  map: f =>
    Reducer((acc, x) => f(g(acc, x))),
  contramap: f =>
    Reducer((acc, x) => g(acc, f(x))),
  fold: g,
});

const users = [{ name: 'Mo' }, { name: 'Curly' }, { name: 'Larry' }];


test('Ex3: reducers', () => {
  const r = Reducer((acc, x) => acc + x).contramap(x => x.name).map(x => `${x}!`);
  expect(users.reduce(r.fold, '')).toBe('Mo!Curly!Larry!');
});
