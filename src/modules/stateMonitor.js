/**
 *
 * stateMonitor
 *
 * Returns a Function that can be used to selectively
 * target specifiy Object tree value changes.
 *
 * A callback will be called when a change is detected
 *
 * usage:
 *
 * First set-up the Object's reference, and the path to watch
 * the reference is an Object literal OR a Function that returns an Object
 * > const monitor = stateMonitor(store.getState, "trunk.branch.stem")
 *
 * Second, define an action to execute if the path changes
 * the callback receives 2 arguments: currentValue, previousValue (as JSON string)
 * > const callback = (currentValue) => alert(`update the UI with ${currentValue}`)
 *
 * Lastly, attach the callback to the monitor, which recives update announcements.
 * > store.subscribe(monitor(callback))
 *
 *
 */

let equals = (a, b) => {
  // crude coersed string evaulation
  // if you can replace this with the Jest.deepEqual
  return JSON.stringify(a) === JSON.stringify(b);
};

const getShallowCopy = value => {
  // ensure immutable values (ie. break Object references)
  if (value && value.constructor === Date) return value;
  if (value && value.constructor === Array) return [...value];
  if (value && value.constructor === Object) return { ...value };

  return value;
};

const stateMonitor = (objectRef, pathStr, compareFn) => {
  let cachedValue;

  // compareFn (optional) the function to use to prove equality
  const isFunction = compareFn && compareFn.constructor === Function;
  equals = isFunction ? compareFn : equals;

  // the Object Reference or method call to retrieve reference object
  const method =
    objectRef.constructor === Function ? objectRef : () => objectRef;

  const getPathValue = () =>
    pathStr.split(".").reduce((acc, value) => acc[value], method());

  const helper = callback => {
    const previousValue = cachedValue || null;
    const currentValue = getShallowCopy(getPathValue());
    cachedValue = currentValue;

    // execute callback if value has changed
    if (equals(previousValue, currentValue)) return;

    return callback(currentValue, previousValue);
  };

  return helper;
};

export default stateMonitor;
