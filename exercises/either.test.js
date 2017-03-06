const { assert } = require('chai');

describe('Either Exercises', () => {
  // Definitions
  // ====================
  const Right = x =>
  ({
    chain: f => f(x),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    toString: () => `Right(${x})`,
  });

  const Left = x =>
  ({
    chain: f => Left(x),
    map: f => Left(x),
    fold: (f, g) => f(x),
    toString: () => `Left(${x})`,
  });

  const fromNullable = x =>
    x != null ? Right(x) : Left(null);

  const tryCatch = (f) => {
    try {
      return Right(f());
    } catch (e) {
      return Left(e);
    }
  };

  const logIt = (x) => {
    console.log(x);
    return x;
  };

  const DB_REGEX = /postgres:\/\/([^:]+):([^@]+)@.*?\/(.+)$/i;

  // Exercise: Either
  // Goal: Refactor each example using Either
  // Bonus: no curlies
  // =========================


  // Ex1: Refactor streetName to use Either instead of nested if's
  // =========================
  // const street = (user) => {
  //   const address = user.address;
  //
  //   if (address) {
  //     return address.street;
  //   }
  //   return 'no street';
  // };

  const street = user =>
    fromNullable(user.address)
      .fold(
        _ => 'no street',
        a => a.street,
      );

  test('Ex1: street', () => {
    const user = { address: { street: { name: 'Willow' } } };
    assert.deepEqual(street(user), { name: 'Willow' });
    expect(street({})).toBe('no street');
  });

  // Ex1: Refactor streetName to use Either instead of nested if's
  // =========================
  // const streetName = (user) => {
  //   const address = user.address;
  //
  //   if (address) {
  //     const street = address.street;
  //
  //     if (street) {
  //       return street.name;
  //     }
  //   }
  //
  //   return 'no street';
  // };
  const streetName = user =>
    fromNullable(user.address)
      .chain(a => fromNullable(a.street))
      .fold(
        _ => 'no street',
        s => s.name,
      );

  test('Ex1: streetName', () => {
    const user = { address: { street: { name: 'Willow' } } };
    expect(streetName(user)).toBe('Willow');
    expect(streetName({})).toBe('no street');
    expect(streetName({ address: { street: null } })).toBe('no street');
  });


  // Ex2: Refactor parseDbUrl to return an Either instead of try/catch
  // =========================
  // const parseDbUrl = (cfg) => {
  //   try {
  //     const c = JSON.parse(cfg); // throws if it can't parse
  //     return c.url.match(DB_REGEX);
  //   } catch (e) {
  //     return null;
  //   }
  // };
  const parseDbUrl = cfg =>
    tryCatch(() => JSON.parse(cfg))
      .map(c => c.url)
      .fold(
        _ => null,
        url => url.match(DB_REGEX),
      );

  test('Ex1: parseDbUrl', () => {
    const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}';
    expect(parseDbUrl(config)[1]).toBe('sally');
    expect(parseDbUrl()).toBe(null);
  });


  // Ex3: Using Either and the functions above, refactor startApp
  // =========================
  // const startApp = (cfg) => {
  //   const parsed = parseDbUrl(cfg);
  //
  //   if (parsed) {
  //     const [_, user, password, db] = parsed;
  //     return `starting ${db}, ${user}, ${password}`;
  //   }
  //   return "can't get config";
  // };
  const startApp = cfg =>
    fromNullable(parseDbUrl(cfg))
      .fold(
        _ => "can't get config",
        ([_, user, password, db]) => `starting ${db}, ${user}, ${password}`,
      );

  test('Ex3: startApp', () => {
    const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}';
    expect(String(startApp(config))).toBe('starting mydb, sally, muppets');
    expect(String(startApp())).toBe("can't get config");
  });
});
