import React from "react";
import SampleLinks from "./SampleLinks";
import FontSettings from "./FontSettings";

const Footer = ({ store }) => {
  return (
    <span className="buttons">
      <SampleLinks store={store} />
      <FontSettings store={store} />{" "}
    </span>
  );
};

export default Footer;
