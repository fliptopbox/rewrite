// const locked = {}; // a dictionary of DOM Elements
// const variants = {}; // a dictionary of raw text refs
export default {
  settings: {
    fontFamily: 0,
    fontSize: 1,
    panelWidth: 70
  },
  editor: {
    current: null // DOM id
  },
  content: {
    timestamp: null,
    string: null,
    collection: [
      {
        text: "Re:writing",
        className: "heading"
      },
      {
        text: null
      },
      {
        text: "_Writing is rewriting_"
      },
      {
        text: null
      },
      {
        text:
          "Tempor dolore exercitation est in id esse ullamco mollit labore. Ad anim consequat esse commodo. Veniam amet aute velit laboris aute ea deserunt. Occaecat cillum ad anim voluptate pariatur dolor aute adipisicing.",
        locked: true,
        versions: [
          "Tempor dolore exercitation est in id esse ullamco mollit labore.",
          "",
          "Ad anim consequat esse commodo.",
          "",
          "> Ad anim consequat esse commodo.",
          "> Ad anim consequat esse commodo.",
          "> Ad anim consequat esse commodo.",
          "",
          "Veniam amet aute velit laboris aute ea deserunt.",
          "",
          "Occaecat cillum ad anim voluptate pariatur dolor aute adipisicing."
        ].join("\n")
      }
    ]
  }
};
