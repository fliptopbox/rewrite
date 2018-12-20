import nodesToCollection from "./nodesToCollection";

const node = (text = "", versions) => ({
  innerText: text,
  dataset: {
    versions
  }
});
test("nodes to collection", () => {
  const nodes = [
    node("Hello"),
    node("World", "World\n> Mundo\n> Planet"),
    node("World", "Kilroy was here")
  ];

  const check = nodesToCollection(nodes);

  expect(check).toHaveLength(nodes.length);

  expect(check[0].text).toBe("Hello");
  expect(check[0].versions).toBeUndefined();

  expect(check[1].text).toBe("World");
  expect(check[1].versions).toBe("World\n> Mundo\n> Planet");

  expect(check[2].text).toBe("Kilroy was here");
  expect(check[2].versions).toBe("Kilroy was here");
});
