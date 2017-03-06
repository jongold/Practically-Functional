const { List, Map } = require('immutable-ext');

describe('Monoid Exercises', () => {
  const Sum = x =>
  ({
    x,
    concat: o => Sum(x + o.x),
    toString: () => `Sum(${x})`,
  });
  Sum.empty = () => Sum(0);

  const Product = x =>
  ({
    x,
    concat: o => Product(x * o.x),
    toString: () => `Product(${x})`,
  });
  Product.empty = () => Product(1);

  const Any = x =>
  ({
    x,
    concat: o => Any(x || o.x),
    toString: () => `Any(${x})`,
  });
  Any.empty = () => Any(false);


  // Ex1: reimplement sum using foldMap and the Sum Monoid
  // =========================

  // const sum = xs => List(xs).reduce((acc, x) => acc + x, 0);
  const sum = xs =>
    List(xs).foldMap(Sum, Sum.empty());

  it('Ex1: sum', () => {
    expect(sum([1, 2, 3]).toString()).toBe('Sum(6)');
  });


  // Ex2: reimplement lessThanZero using foldMap and the Any Monoid
  // =========================

  // const anyLessThanZero = xs =>
  //   List(xs).reduce((acc, x) => acc < 0, false);
  const anyLessThanZero = xs =>
    List(xs).foldMap(x => Any(x < 0), Any.empty());

  it('Ex2: anyLessThanZero', () => {
    expect(anyLessThanZero([-2, 0, 4]).toString()).toBe('Any(true)');
    expect(anyLessThanZero([2, 0, 4]).toString()).toBe('Any(false)');
  });


  // Ex3: Rewrite the reduce with a Max monoid (see Sum/Product/Any templates above)
  // =========================

  // const max = xs =>
  //   List(xs).reduce((acc, x) => acc > x ? acc : x, -Infinity);

  const Max = x => ({
    x,
    concat: o => Max(Math.max(x, o.x)),
    toString: () => `Max(${x})`,
  });
  Max.empty = () => Max(0);

  const max = xs =>
    List(xs).foldMap(x => Max(x), Max.empty());

  it('Ex3: max', () => {
    expect(max([-2, 0, 4]).toString()).toBe('Max(4)');
    expect(max([12, 0, 4]).toString()).toBe('Max(12)');
  });

  // Ex4 (Bonus): Write concat for Tuple
  // =========================

  const Tuple = (_1, _2) =>
  ({
    _1,
    _2,
    concat: o => Tuple(_1.concat(o._1), _2.concat(o._2)),
  });

  it('Ex4: tuple', () => {
    const t1 = Tuple(Sum(1), Product(2));
    const t2 = Tuple(Sum(5), Product(2));
    const t3 = t1.concat(t2);
    expect(t3._1.toString()).toBe('Sum(6)');
    expect(t3._2.toString()).toBe('Product(4)');
  });
});
