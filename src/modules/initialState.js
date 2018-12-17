// const locked = {}; // a dictionary of DOM Elements
// const variants = {}; // a dictionary of raw text refs
export default {
  settings: {
    fontFamily: 0,
    fontSize: 0,
    panelWidth: 70
  },
  editor: {
    current: null // DOM id
  },
  content: {
    defaultMsg: [{ key: 0, text: "Type your message here ..." }],
    collection: []
  }
};
