import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";

// helper functions and modules
import u from "./utilities/";
import initialState from "./modules/initialState";

// React components
import Editor from "./modules/Editor";
import Article from "./modules/Article";
import allReducers from "./modules/allReducers";

import "./styles.scss";

window.RE = window.RE || {};

const localState = u.storage();
const state = localState.read() || initialState;
// localState.write(state);

const store = createStore(combineReducers(allReducers), state);

// const tiggerDict = {
//   ALTenter: e => {
//     const el = window.getSelection().focusNode.parentNode;
//     const { id } = el;

//     el.classList.add("locked");

//     const text = u.inflate(el.innerText);

//     store.dispatch({ type: "CONTENT-LOCK", id: id });
//     store.dispatch({ type: "EDITOR-LOAD", id: id, text: text });

//     return false;
//   }
// };

const App = () => {
  return (
    <div className="pg">
      <Article store={store} />
      <Editor store={store} />
    </div>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

function updateIO(value = null) {
  const el = document.getElementById("io");
  el.value = value;
  el.focus();
}

document.querySelector("article").onclick = e => {
  const { id } = e.target;
  const { editor } = store.getState();

  // if (id && state.locked[id]) editor(id);
  if (editor[id]) {
    store.dispatch({ type: "EDITOR-LOAD", id: id, text: null });
    updateIO(editor[id]);
  }
};

document.querySelector("article").ondblclick = e => {
  const el = e.target;
  el.id = el.id || u.uuid();

  const { id } = el;
  const { editor } = store.getState();

  if (editor[id] && window.confirm("Are you sure?")) {
    store.dispatch({ type: "EDITOR-DELETE", id: id });
    store.dispatch({ type: "CONTENT-UNLOCK", id: id });
    el.classList.remove("locked");
    console.log(3, "render the candidate", store.getState());
    updateIO();
    return;
  }

  if (!editor[id]) {
    store.dispatch({
      type: "EDITOR-LOAD",
      id: id,
      text: u.inflate(el.innerText)
    });
    store.dispatch({ type: "CONTENT-LOCK", id: id });
    el.classList.add("locked");

    console.log(3, "lock the element", store.getState());
    updateIO(editor[id]);
    return;
  }
};
