import React, { Component } from "react";
import Game from "./game";

class GamesTable extends Component {
  state = {};

  render() {
    let rows = [];

    for (let i = 0; i < this.props.games.length; i++) {
      rows.push(
        <Game
          key={i}
          game={this.props.games[i]}
          openModalWithItem={this.props.openModalWithItem}
        />
      );
    }

    return (
      <div className="container-xl">
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-12">
                  <div className="float-right m-2">
                    <button
                      type="button"
                      className="btn btn-success m-2"
                      data-toggle="modal"
                      data-target="#addGameModal"
                    >
                      Add New BoardGame
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning m-2"
                      onClick={this.props.onRefresh}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="align-middle">Name</th>
                  <th className="align-middle">Year</th>
                  <th className="align-middle">Player Count</th>
                  <th className="align-middle">Playing Time</th>
                  <th className="align-middle">Minimum Age</th>
                  <th className="align-middle">Complexity</th>
                  <th className="align-middle">Geek Rating</th>
                  <th className="align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default GamesTable;
