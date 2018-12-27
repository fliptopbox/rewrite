import { dispatch, subscribe } from "./functions";
import initialize from "./editor";

import "./styles.scss";

var jsonstring = `["Lorem ipsum 1", "Lorem ipsum 2", "> Lorem ipsum 4", "", "Lorem ipsum 3"]`;
var array = JSON.parse(jsonstring);

const editor = initialize("#sentences", {
  autoTerminate: true,
  prefixToken: "// "
});

editor.onChange((candidate, versions) =>
  dispatch("updateparent", { candidate, versions })
);

// console.log(editor.settings());

subscribe("updateparent", e => {
  console.log("UPDATE-PARENT:", e.detail, e);
  const { candidate, versions } = e.detail;
  document.querySelector("#article").innerHTML = candidate;
  document.querySelector("#versions").innerHTML = JSON.stringify(versions);
});

// document.getElementById("app").innerHTML = ``;


editor.load(array);
