import React, { Component } from "react";

class TitleBar extends Component {
  state = {};

  render() {
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#7c4780" }}
      >
        <a className="navbar-brand" href="#">
          Webscraping BoardGameGeek&trade;
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
    );
  }
}

export default TitleBar;
