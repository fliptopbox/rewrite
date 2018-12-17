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
  const { type, id } = actions;

  if (type === "CONTENT-LOAD") {
  }
  if (type === "CONTENT-LOCK") {
    state[id] = true;
  }
  if (type === "CONTENT-UNLOCK") {
    delete state[id];
  }
  if (type === "CONTENT-CHANGE") {
  }

  return { ...state };
};

const editor = (state = {}, actions) => {
  const { type, id = null, text = null } = actions;

  switch (type) {
    case "EDITOR-LOAD":
      state[id] = text || state[id];
      state.current = id;
      break;

    case "EDITOR-DELETE":
      delete state[id];
      state.current = null;
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
