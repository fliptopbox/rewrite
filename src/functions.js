export function dispatch(name, message = null, elm = window) {
  const e = new CustomEvent(
    name,
    Object.assign({ bubbles: true }, { detail: message })
  );
  elm.dispatchEvent(e);
}

export function subscribe(name, callback, elm = window) {
  elm.addEventListener(name, callback);
}
