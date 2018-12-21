const settings = (state = {}, action) => {
  const { type, value } = action;

  if (type === "font-family") {
    // return { ...state, fontFamily: value };
    state.fontFamily = Number(value);
  }

  if (type === "font-size") {
    state.fontSize = Number(value);
    // return { ...state, fontSize: Number(value) };
  }

  if (type === "panel-width") {
    state.panelWidth = Number(value);
    // return { ...state, panelWidth: Number(value) };
  }

  return { ...state };
};

const content = (state = [], actions) => {
  const { type, value } = actions;
  switch (type) {
    case "CONTENT-WORD-COUNT":
      state.wordCount = Number(value);
      break;

    case "CONTENT-CLEAR":
      state.string = null;
      break;

    case "CONTENT-LOAD":
      state.string = String(value);
      break;

    case "CONTENT-SAVE":
      state.collection = [...value];
      break;

    case "CONTENT-TIMESTAMP":
      state.timestamp = new Date().valueOf();
      break;

    default:
      break;
  }

  return { ...state };
};

const editor = (state = {}, actions) => {
  const { type, id = null, text = null } = actions;

  switch (type) {
    case "EDITOR-BIND":
      state.current = id;
      state.value = text;
      break;

    case "EDITOR-RESET":
      state.current = null;
      state.value = "";
      break;

    default:
      break;
  }

  return { ...state };
};

export default {
  settings,
  content,
  editor
};
