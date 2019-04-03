function focusOn($el, selector, callback) {
  // ensure there are no others
  var els = document.querySelectorAll(`.${selector}`);
  [...els].forEach(el => el.classList.remove(selector));

  $el.setAttribute("tabindex", "-1");
  $el.classList.add(selector);
  $el.focus();

  return callback && callback();
}

export default focusOn;
