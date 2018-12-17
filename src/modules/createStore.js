const createStore = (reducer, initialState) => {
  let state = { ...initialState };
  let listeners = [];

  const getState = () => state;

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};

const combineReducer = reducers => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};

const monitor = (object, path) => {
  let jsonCurrentValue;

  path = path.split("."); // convert to array

  const method = object.constructor === Function ? object : () => object;
  const select = state => path.reduce((acc, value) => acc[value], method());

  const helper = callback => {
    const previousValue = jsonCurrentValue || null;

    currentValue = select();
    jsonCurrentValue = JSON.stringify(currentValue);

    const different = previousValue !== jsonCurrentValue;

    return different ? callback(currentValue, previousValue) : undefined;
  };

  return helper;
};

const counter = (state = 0, action) => {
  const { type } = action;
  const value = type === "inc" ? 1 : type === "dec" ? -1 : 0;
  return state + value;
};

const activity = (state = 0, action) => {
  return state + 1;
};

const collection = (state = [], action) => {
  const { type, value = null } = action;

  if (type === "add") state.push({ value: value });

  return [...state];
};

const allReducers = combineReducer({
  counter,
  activity,
  collection
});

const store = createStore(allReducers, { counter: 11 });

let nth = 0;

const actionPlus = { type: "inc" };
const actionMinus = { type: "dec" };
const collect = value => {
  return { type: "add", value: Number(value) };
};

const watch = monitor(store.getState, "collection");
const announce = (a, b) => {
  if (a.some(val => val.value === 456)) console.log("-----%s", a.length);
};

store.subscribe(() => watch(announce));

store.dispatch(actionPlus);
store.dispatch(actionPlus);
store.dispatch(actionMinus);
store.dispatch(collect(123));
store.dispatch(actionPlus);
store.dispatch(collect(456));
store.dispatch(actionMinus);
store.dispatch(collect(789));
store.dispatch(actionPlus);

store.getState(); //?
