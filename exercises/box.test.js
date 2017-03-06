describe('Box Exercises', () => {
  const Box = x =>
  ({
    map: f => Box(f(x)),
    fold: f => f(x),
    inspect: () => `Box(${x})`,
  });

  // Exercise: Box
  // Goal: Refactor each example using Box
  // Keep these tests passing!
  // Bonus points: no curly braces


  // Ex1: Using Box, refactor moneyToFloat
  // =========================
  // const moneyToFloat = str =>
  //   parseFloat(str.replace(/\$/, ''));

  const moneyToFloat = str =>
    Box(str)
      .map(s => s.replace(/\$/, ''))
      .fold(parseFloat);


  it('ex1', () => {
    expect(moneyToFloat('$5.00')).toBe(5);
  });


  // Ex2: Using Box, refactor percentToFloat
  // =========================
  // const percentToFloat = (str) => {
  //   const float = parseFloat(str.replace(/%/, ''));
  //   return float * 0.0100;
  // };

  const percentToFloat = str =>
    Box(str)
      .map(s => s.replace(/%/, ''))
      .map(s => parseFloat(s))
      .fold(f => f * 0.01);


  it('ex2', () => {
    expect(percentToFloat('20%')).toBe(0.2);
  });


  // Ex3: Using Box, refactor applyDiscount (hint: each variable introduces a new Box)
  // =========================
  const applyDiscount_ = (price, discount) => {
    const cents = moneyToFloat(price);
    const savings = percentToFloat(discount);
    return cents - (cents * savings);
  };

  const applyDiscount = (price, discount) =>
    Box(price)
      .map(moneyToFloat)
      .fold(cents =>
        Box(discount)
          .map(percentToFloat)
          .fold(savings => cents - (cents * savings)))


  it('ex3', () => {
    expect(applyDiscount('$5.00', '20%')).toBe(4);
  });
});
