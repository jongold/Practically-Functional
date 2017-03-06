export const Right = x =>
({
  chain: f => f(x),
  ap: other => other.map(x),
  alt: other => Right(x),
  extend: f => f(Right(x)),
  concat: other =>
    other.fold(x => other,
               y => Right(x.concat(y))),
  traverse: (of, f) => f(x).map(Right),
  map: f => Right(f(x)),
  fold: (_, g) => g(x),
  inspect: () => `Right(${x})`
})

export const Left = x =>
({
  chain: _ => Left(x),
  ap: _ => Left(x),
  extend: _ => Left(x),
  alt: other => other,
  concat: _ => Left(x),
  traverse: (of, _) => of(Left(x)),
  map: _ => Left(x),
  fold: (f, _) => f(x),
  inspect: () => `Left(${x})`
})

export const fromNullable = x =>
  x != null ? Right(x) : Left(null)

export const tryCatch = f => {
  try {
    return Right(f())
  } catch(e) {
    return Left(e)
  }
}
