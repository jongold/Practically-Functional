import { List } from 'immutable-ext';
import { Left, Right, fromNullable } from '../either';

// Definitions
// ====================

const logIt = (x) => {
  console.log(x);
  return x;
};

const Alt = x =>
({
  x,
  concat: o => Alt(x.alt(o.x)),
  fold: f => f(x),
});


// Ex1: Write a fn (using reduce w/ Either) that concats all the
// innerHTML and exits if there's any nulls
// =========================

const ex1 = pages =>
 pages
   .reduce((acc, x) =>
     acc.concat(
       fromNullable(x.body).map(body => body.innerHTML),
     ), Right(''))
   .fold(
     _ => 'missing body',
     body => body,
   );

test('Ex1', () => {
  const pages = [
    { title: 'one', body: { innerHTML: '<div>one</div>' } },
    { title: 'two', body: { innerHTML: '<div>two</div>' } },
    { title: 'three', body: { innerHTML: '<div>three</div>' } },
  ];
  const pages2 = [...pages, { title: 'four' }];

  expect(ex1(pages)).toBe('<div>one</div><div>two</div><div>three</div>');
  expect(ex1(pages2)).toBe('missing body');
});

// Ex1.5: Write ex1 in terms of foldMap instead of reduce
// =========================
const ex1dot5 = pages =>
  List(pages)
    .foldMap(
      page => fromNullable(page.body).map(b => b.innerHTML),
      Right(''),
    ).fold(
      _ => 'missing body',
      body => body,
    );

test('Ex1.5', () => {
  const pages = [
    { title: 'one', body: { innerHTML: '<div>one</div>' } },
    { title: 'two', body: { innerHTML: '<div>two</div>' } },
    { title: 'three', body: { innerHTML: '<div>three</div>' } },
  ];
  const pages2 = [...pages, { title: 'four' }];

  expect(ex1dot5(pages)).toBe('<div>one</div><div>two</div><div>three</div>');
  expect(ex1dot5(pages2)).toBe('missing body');
});

// Ex2: Write the same script as ex1, but this time, ignore nulls and concat whatever it can
// =========================

const ex2 = pages => pages.reduce((acc, val) =>
  acc.concat(
    fromNullable(val.body)
      .map(body => body.innerHTML)
      .fold(
        _ => '',
        res => res,
      ),
  ), '');

test('Ex2', () => {
  const pages = [
    { title: 'one', body: { innerHTML: '<div>one</div>' } },
    { title: 'two', body: { innerHTML: '<div>two</div>' } },
    { title: 'three', body: { innerHTML: '<div>three</div>' } },
  ];
  const pages2 = [...pages, { title: 'four' }];

  expect(ex2(pages)).toBe('<div>one</div><div>two</div><div>three</div>');
  expect(ex2(pages2)).toBe('<div>one</div><div>two</div><div>three</div>');
});


// Ex3: alt() works like concat(), but chooses the first Right.
// Write the same script as ex1, but use .alt() instead of .concat()
// to select the first success.
// *Don't use the Alt type yet
// =========================

const ex3 = pages => pages.reduce((acc, x) =>
  acc.alt(
    fromNullable(x.body)
      .map(body => body.innerHTML),
  )
, Left('')).fold(logIt, x => x);

// Keep the first success with alt instead of concat
test('Ex3', () => {
  const pages = [
    { title: 'one' },
    { title: 'two', body: { innerHTML: '<div>two</div>' } },
    { title: 'three', body: { innerHTML: '<div>three</div>' } },
  ];

  expect(ex3(pages)).toBe('<div>two</div>');
});

// Ex3.5: It's common practice to wrap types in another layer to alter
// functionality. Use the Alt type to rewrite ex3 in terms of foldMap.
// i.e. Alt(Right(x)) instead of just Right/Left
// =========================


// Ex4: Use .alt/reduce or Alt/foldMap to write ex4. It should find the
// first job with goodPay and isClose
// =========================

const goodPay = job =>
  job.pay >= 100000 && job.hours < 50
  ? Right(job)
  : Left('bad pay');

const isClose = job =>
  job.distance < 10
  ? Right(job)
  : Left('is far');

const ex4 = (fns, jobs) =>
  jobs
 .reduce((acc1, x) =>
   fns
   .reduce((acc, f) =>
      acc.alt(f(x)), Left()),
  ).fold(
    _ => 'something went wrong',
    res => res,
  );

// const ex4 = (fns, jobs) =>
//   List(jobs)
//    .foldMap(job =>
//      job,
//      Alt(Left())
//     //  List(fns)
//     //    .foldMap(f => f(x), Alt(Left()))
//     //   , Alt(Left()),
//     ).fold(
//       _ => 'something went wrong',
//       res => res,
//     );

// Keep the first success with alt instead of concat
test('Ex4', () => {
  const jobs = [
    { pay: 100000, distance: 60, hours: 60 },
    { pay: 80000, distance: 20, hours: 35 },
    { pay: 120000, distance: 10, hours: 45 },
  ];

  expect(ex4([goodPay, isClose], jobs)).toBe(jobs[2]);
});
