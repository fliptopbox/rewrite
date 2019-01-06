import textToArray from "../editor/textToArray";
import uuid from "../utilities/uuid";

function importJSON(payload, filename) {
  let object;
  let collection;

  if (!payload || typeof payload !== "string") return null;

  try {
    object = JSON.parse(payload);
  } catch (e) {
    console.error("JSON import error: [%s]", e.name);
  }

  // payload is plainText
  if (!object) {
    collection = textToArray(payload);
    collection = collection.map(row => ({ text: row || "" }));

    object = {
      id: uuid(),
      name: filename || "Untitled Import",
      data: [...collection]
    };
  }

  return { ...object };
}

export default importJSON;
