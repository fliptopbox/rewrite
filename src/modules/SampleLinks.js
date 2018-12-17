import React from "react";
import samples from "../samples/";

const getSampleText = id => {
  window.RE.article.load(samples[id]);
};

const Link = ({ id, text }) => (
  <a href={"#" + id} title={id} onClick={() => getSampleText(id)}>
    {text}
  </a>
);

const sampleList = Object.keys({ ...samples }).map((id, n) => ({
  id: id,
  text: `[${n}]`
}));

const SampleLinks = () => {
  return (
    <span className="button">
      <strong>Samples: </strong>
      {sampleList.map(obj => {
        const { id, text } = obj;
        return <Link key={id} id={id} text={text} />;
      })}
    </span>
  );
};

export default SampleLinks;
