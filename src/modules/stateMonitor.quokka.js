import { createStore, combineReducers } from "redux";
import stateMonitor from "./stateMonitor";
import deepEqual from "deep-is";

var initialObject = {
  array: [1, 2, 3, 4, 5],
  collection: [
    { id: 1, value: "a" },
    { id: 2, value: "b" },
    { id: 3, value: "c" },
    { id: 4, value: "d" }
  ],
  dictionary: {
    a: 1111,
    b: 2222,
    c: 3333
  },
  string: "-base-",
  number: 100
};

const array = (state = [], action) => {
  if (action.type === "insert") {
    state.push(action.value);
  }
  return state;
};

const collection = (state = [], action) => {
  const { type, value } = action;

  if (type === "remove") {
    state.splice(value, 1);
  }
  if (type === "inject") {
    state.push({ id: value, value: 0 });
  }

  return [...state];
};

const dictionary = (state = {}, action) => {
  const { type, value, id } = action;

  if (type === "update") {
    state[id] = value; //?
  }

  if (type === "delete") {
    delete state[id];
  }

  if (type === "add") {
    state[id] = value;
  }

  return Object.assign({}, state);
};

const string = (state = "", action) => {
  const { type, value } = action;

  if (type === "sufix") {
    state = `${state}${value}`;
  }
  if (type === "prefix") {
    state = `${value}${state}`;
  }
  if (type === "replace") {
    state = `${value}`;
  }

  return state;
};

const number = (state = 0, action) => {
  const { type, value } = action;

  if (type === "plus") state += value;
  if (type === "minus") state -= value;

  return state;
};

const allReducers = combineReducers({
  collection,
  array,
  dictionary,
  string,
  number
});

const store = createStore(allReducers, initialObject);

const watchCollection = stateMonitor(store.getState, "collection", deepEqual);
const announceCollection = current => {
  if (current.length === 3) {
    console.log("COLLECTION: [%s]", current.length);
  }
};

const watchNumber = stateMonitor(store.getState, "number");
const announceNumber = current => {
  if (current <= 102) return;
  console.log("NUMBER: [%s]", current);
};

const watchDictionary = stateMonitor(store.getState, "dictionary.b");
const announceDictionary = current => {
  if (current !== 4444) return;
  console.log("DICTIONARY: [%s]", current);
};

const watchString = stateMonitor(store.getState, "string");
const announceString = current => {
  if (current !== "new") return;
  console.log("STRING: [%s]", current);
};

const watchArray = stateMonitor(store.getState, "array");
const announceArray = current => {
  if (current.length !== 6) return;
  console.log("ARRAY: [%s]", current);
};

store.subscribe(() => watchCollection(announceCollection));
store.subscribe(() => watchDictionary(announceDictionary));
store.subscribe(() => watchNumber(announceNumber));
store.subscribe(() => watchString(announceString));
store.subscribe(() => watchArray(announceArray));

/**/

store.dispatch({ type: "plus", value: 1 });
store.dispatch({ type: "plus", value: 2 });
store.dispatch({ type: "plus", value: 3 });
store.dispatch({ type: "minus", value: 2 });
store.dispatch({ type: "minus", value: 1 });
store.dispatch({ type: "minus", value: 2 });
store.getState().number; //?

store.dispatch({ type: "prefix", value: "pp1" });
store.dispatch({ type: "prefix", value: "pp2" });
store.dispatch({ type: "sufix", value: "ss1" });
store.dispatch({ type: "sufix", value: "ss2" });
store.getState().string; //?

store.dispatch({ type: "replace", value: "new" });
store.getState().string; //?

store.dispatch({ type: "insert", value: 6 });
store.dispatch({ type: "insert", value: 7 });
store.getState().array; //?

store.dispatch({ type: "remove", value: 0 });
store.dispatch({ type: "inject", value: 11 });
store.dispatch({ type: "inject", value: 22 });
store.dispatch({ type: "remove", value: 0 });
store.dispatch({ type: "remove", value: 0 });
store.getState().collection; //?

store.dispatch({ type: "update", value: 4444, id: "b" });
store.dispatch({ type: "update", value: 5555, id: "b" });
store.dispatch({ type: "update", value: 4444, id: "b" });
store.dispatch({ type: "add", value: 6666, id: "d" });
store.dispatch({ type: "delete", value: 6666, id: "a" });
store.getState().dictionary; //?

/**/
