const settings = (state = {}, action) => {
  const { type, value } = action;

  if (type === "font-family") {
    return { ...state, fontFamily: value };
  }

  if (type === "font-size") {
    return { ...state, fontSize: Number(value) };
  }

  if (type === "panel-width") {
    return { ...state, panelWidth: Number(value) };
  }

  return state;
};

const content = (state = [], actions) => {
  const { type, value } = actions;
  if (type === "CONTENT-CLEAR") {
    state.string = null;
  }
  if (type === "CONTENT-LOAD") {
    state.string = String(value);
  }
  if (type === "CONTENT-SAVE") {
    state.collection = [...value];
  }
  if (type === "CONTENT-TIMESTAMP") {
    state.timestamp = new Date().valueOf();
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
