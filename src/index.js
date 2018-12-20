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
import stateMonitor from "./modules/stateMonitor";

window.RE = window.RE || {};

const localState = u.storage();
const state = localState.read() || initialState;

const store = createStore(combineReducers(allReducers), state);

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

const watchArticle = stateMonitor(store.getState, "content.collection");
const announceArticle = current => {
  console.log("state watch article", current);
  u.storage().write(store.getState());
};

store.subscribe(() => watchArticle(announceArticle));
