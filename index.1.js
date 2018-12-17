import React, { Component } from "react";
import ReactDOM from "react-dom";
// import styled from "styled-components";

import volume from "./document";
import "./styles.css";
/**
 * given a collection return
 * HTML rows of sentences
 */
const Paragraphs = () => {
  const paragraphs = volume.chapters[0].paragraphs;

  return (
    <article>
      {paragraphs.map((obj, i) => {
        return <Paragraph key={"p" + i} sentences={obj.sentences} />;
      })}
    </article>
  );
};

const Paragraph = ({ sentences }) => {
  const showAll = false;
  return <Sentenses showAll={showAll} sentences={sentences} />;
};

const Sentenses = props => {
  const { sentences, showAll } = props;
  const classname = showAll ? "block" : "inline";
  return (
    <p className={classname}>
      {sentences.map(sentence => {
        const { current, text } = sentence;
        return text.map((value, i) => {
          return (
            <Sentence
              key={i}
              text={value}
              showAll={showAll}
              current={current === i}
            />
          );
        });
      })}
    </p>
  );
};

const Sentence = ({ text, current, showAll }) => {
  const visible = showAll || current;
  return !visible ? null : <span onclick={eventHandler}>{text}</span>;
};

const App = () => {
  return <Paragraphs />;
};

const eventHandler = e => {
  /**
      which event fired determines what happens next
      
      Click:
      select the nearest span

      Keypress:
      Arrow key: navigate to next/previous span

  */

  // remove previous highlight
  state.current && state.current.classList.remove("selected");

  // update active sentence and toggle hightlight
  state.current = e.target;
  getSentence();
};

const getSentence = () => {
  state.current.classList.add("selected");
  state.current.id = state.current.id || getSerialId();
  console.log(3, state.current.classList);
};

const getSerialId = (prefix = "a") => {
  const ts = new Date().valueOf().toString(36);
  const rnd = Math.floor(Math.random() * 9).toString(16);
  return `${prefix}${ts}${rnd}`;
};

const state = {
  current: null
};

// window.onkeydown = eventHandler;
//window.onclick = eventHandler;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// const p = document.querySelectorAll("p");

// p.onclick = e => {
//   console.log(1, e);
//   const el = e.target;
//   //console.log(el.setAttribute("m-selected", ""))
// };

// p.onfocus = e => {
//   console.log(1, e);
//   const el = e.target;
//   //console.log(el.setAttribute("m-selected", ""))
// };

// p.onblur = e => {
//   const el = e.target;
//   console.log(2, el.removeAttribute("m-selected", ""));
// };
