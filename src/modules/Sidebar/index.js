import React from "react";
import Parse from "../../utilities/Parse";

class Sidebar extends React.Component {
  constructor(props) {
    super();
    const { store } = props;
    this.state = {
      articles: store.list(),
      update: 0
    };
  }

  getArticles() {
    const { store } = this.props;
    const files = this.state.articles.map((obj, n) => {
      return this.getFileRow(obj);
    });

    return <ul>{files}</ul>;
  }

  handleDelete(guid) {
    const { store } = this.props;
    const msg = "You are about to delete this file.\nAre you sure?";
    if (!window.confirm(msg)) return false;

    store.delete(guid);
    const articles = store.list();
    this.setState({ articles });
  }

  getFileRow(object) {
    const { guid, name, words = 1234, opened } = object;
    return (
      <li
        key={guid}
        onClick={() => {
          const { store, article } = this.props;
          const fileObj = store.read(guid);
          const { data } = fileObj;

          return article.init(data);
        }}
      >
        <span className="file-name" data-guid="${guid}">
          <input
            type="text"
            defaultValue={name}
            onKeyPress={e => {
              if (/enter/i.test(e.key)) {
                console.log(e.target.value);
                e.target.blur();
                this.props.store.rename(guid, e.target.value);
              }
              return true;
            }}
          />
        </span>
        <div className="file-meta">
          <a href="#delete" onClick={() => this.handleDelete(guid)}>
            del
          </a>
          <i className="file-words">{words} words </i>
          <i className="file-modified">{opened}</i>
          <i className="file-exports">
            <a href="#">txt</a>
            <a href="#">json</a>
          </i>
        </div>
      </li>
    );
  }
  handleImport(e) {
    const { store, article } = this.props;
    const { setState } = this;
    const update = new Date().valueOf();
    store.open(e, function(name, text) {
      const p = new Parse(text);
      const current = store.create(null, name, p.toCollection());
      article.init(current.data);
    });
    setTimeout(() => {
      setState({ update: update });
    }, 250);
  }

  render() {
    const articleList = this.getArticles();
    return (
      <div>
        <ul>
          <li
            onClick={() => {
              this.props.store.create(null, "Untitled", [{}]);
              this.props.article.init([{}]);
              return;
            }}
          >
            New
          </li>
          <li>
            <label htmlFor="uploadInput">
              <span>Open</span>
              <input
                id="uploadInput"
                className="hidden"
                onChange={this.handleImport.bind(this)}
                type="file"
                accept="text/*"
              />
            </label>
          </li>
          <li>Save</li>
        </ul>
        <hr />
        {articleList}
        <hr />
        <ul>
          <li>Toggle dark theme</li>
          <li>Collapse lines</li>
          <li>Strike through</li>
          <li>Typewiter mode</li>
          <li>Font size</li>
          <li>Read paragraph</li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
