import importJSON from "./importJSON";

test("gets a JSON object literal given a string", () => {
  const data = importJSON("a string of text");
  expect(data).toBeDefined();
  expect(Object.keys(data)).toHaveLength(3);
  expect(data).toHaveProperty("id");
  expect(data.id).toMatch(/^[a-z]\w{15}$/i);
  expect(data).toHaveProperty("name", "Untitled Import");
  expect(data).toHaveProperty("data", [{ text: "a string of text" }]);
});

test("gets a JSON object literal given a JSON.string", () => {
  const data = importJSON(`{"id": "a123", "name": "string", "data": [1,2,3]}`);
  expect(data).toBeDefined();
  expect(Object.keys(data)).toHaveLength(3);
  expect(data).toHaveProperty("id", "a123");
  expect(data).toHaveProperty("name", "string");
  expect(data).toHaveProperty("data", [1, 2, 3]);
});

test("given nothing returns null", () => {
  const data = importJSON(null, "name");
  expect(data).toBeNull();
});
