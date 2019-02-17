import React from "react";

class Sidebar extends React.Component {
  constructor(props) {
    super();
    const { store } = props;
    this.state = {
      articles: store.list()
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
      <li key={guid}>
        <span className="file-name" data-guid="${guid}">
          <span contentEditable="true">{name}</span>
          <a href="#">edit</a>
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
  render() {
    return this.getArticles();
  }
}

export default Sidebar;
