import u from "./";

test("inflate", () => {
  let A;
  let B;

  expect(u.inflate('"Officia ex cillum."')).toEqual('"Officia ex cillum."');
  expect(u.inflate('_"Officia ex cillum."_')).toEqual('_"Officia ex cillum."_');

  A =
    "Ipsum dolor exercitationi. " +
    "Dr. Amet cupidatat pariatur qui ex ... cillum quis voluptate. " +
    "Nostrud minim.";

  B =
    "Ipsum dolor exercitationi.\n" +
    "Dr. Amet cupidatat pariatur qui ex ... cillum quis voluptate.\n" +
    "Nostrud minim.";

  expect(u.inflate(A)).toEqual(B);
});
