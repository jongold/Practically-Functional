import { Left, Right } from '../either';
// Extend + Extract = Comonad

// Definitions
// ====================
const Tuple = (_1, _2) =>
({
  _1,
  _2,
  map: f => Tuple(_1, f(_2)),
  extend: f => Tuple(_1, f(Tuple(_1, _2))),
  extract: () => _2,
});


// Tuple Tutorial
// ====================

// Tuples act on the second (_2) value when mapping.
Tuple('hi', 2).map(two => two + 1); // Tuple('hi', 3)

// This allows you to carry information along in the _1 position.
// But how do we access it?

// Tuples have an extend method. This passes the entire Tuple in.
// Let's see it in action:

const addRoutes = app =>
  Object.assign({ routes: ['fake add routes'] }, app);

const cfg = { port: 3000 };
const app = { listen: port => `listening on ${port}` };

Tuple(cfg, app)
  .map(addRoutes)
  .extend(t => t._2.listen(t._1.port))
  // Tuple(cfg, 'listening on 3000')
  // We have access to the whole tuple, though it only alters position _2
  .extract();
  // 'listening on 3000'
  // Extract removes our value like fold() but with no function passed in

// Ex1:
// =========================

const makeTodo = (projectId, name, priority) =>
  ({ projectId, name, priority });

const ex1 = tpl =>
  tpl
  .map(ts =>
    ts.concat(makeTodo('?', 'Learn Extend', 1))) // add the project id in place of ?
  .map(ts =>
    ts.sort((a, b) => a.priority > b.priority));

xtest('Ex1: extend tuple', () => {
  const project = { id: 1, name: 'Learn Comonads' };
  const todos = [makeTodo(project.id, 'Learn Extract', 2)];
  const result = ex1(Tuple(project, todos)).extract();
  const expected = [{ projectId: 1, name: 'Learn Extend', priority: 1 }, { projectId: 1, name: 'Learn Extract', priority: 2 }];
  expect(result).toEqual(expected);
});


// Ex2: Either also has extend, but not extract (because extract must always return a good value and Left breaks that law)
// Using the intuition of extend (it passes the full type in, but only alters what map would), rewrite testSuite to remove chain/map in favor of extend
// =========================

const runTest = x =>
  x.a && x.b && x.c
  ? Right([x])
  : Left(x);

// We would like to short circuit when a test fails, but concat the results if not.
const testSuite = (one, two) =>
  runTest(one)
  .chain(passed1 =>
    runTest(two)
    .map(passed2 => passed1.concat(passed2))) // hint: Right(x).concat(Right(y)) === Right(x.concat(y))
    .fold(x => `failed ${JSON.stringify(x)}`,
      xs => `${xs.length} passed`);


xtest('Ex2: extend tuple', () => {
  const one = { a: true, b: true, c: true };
  const two = { a: true, b: true, c: true };
  assert.deepEqual(testSuite(one, two), '2 passed');
  const two_ = { a: true, b: false, c: true };
  assert.deepEqual(testSuite(one, two_), 'failed {\"a\":true,\"b\":false,\"c\":true}');
});
