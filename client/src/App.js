import React, { Component } from "react";
import TitleBar from "./components/titleBar";
import GamesTable from "./components/gamesTable";
import "./App.css";

class App extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      games: "",
      activeGame: null,
    };
  }

  openModalWithItem = (item) => {
    this.setState({
      activeGame: item,
    });
  };

  handleGameAdd = () => {
    //TODO: Post request
  };

  handleGameEdit = () => {
    //TODO: Put request
  };

  handleGameDelete = () => {
    //TODO: Delete request
  };

  handleRefresh = () => {
    this.callApi()
      .then((res) =>
        this.setState({ games: res.express, activeGame: res.express[0] })
      )
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.callApi()
      .then((res) =>
        this.setState({ games: res.express, activeGame: res.express[0] })
      )
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const games = await fetch("/api/boardgames");
    const body = await games.json();
    if (games.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    if (!this.state.games.length) {
      return null;
    }

    return (
      <div className="App">
        <TitleBar />
        <GamesTable
          games={this.state.games}
          openModalWithItem={this.openModalWithItem}
          onRefresh={this.handleRefresh}
        />
        <div id="viewGameModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{this.state.activeGame.name}</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p className="text-left">
                  <span className="font-weight-bold">Name: </span>
                  {this.state.activeGame.name}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Year: </span>
                  {this.state.activeGame.year}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Description: </span>
                  {this.state.activeGame.description}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Player Count: </span>
                  {this.state.activeGame.player_count}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Playing Time: </span>
                  {this.state.activeGame.playing_time}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Minimum Age: </span>
                  {this.state.activeGame.minimum_age}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Complexity: </span>
                  {this.state.activeGame.complexity}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Geek Rating: </span>
                  {this.state.activeGame.geek_rating}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Average Rating: </span>
                  {this.state.activeGame.average_rating}
                </p>
                <p className="text-left">
                  <span className="font-weight-bold">Number of Voters: </span>
                  {this.state.activeGame.number_voters}
                </p>
              </div>
              <div className="modal-footer">
                <input
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  value="Close"
                />
              </div>
            </div>
          </div>
        </div>
        <div id="addGameModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h4 className="modal-title">Add BoardGame</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" required></textarea>
                  </div>
                  <div className="form-group">
                    <label>Player Count</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Playing Time</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Minimum Age</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Complexity</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Geek Rating</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Average Rating</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Number of Voters</label>
                    <input type="text" className="form-control" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <input
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Add"
                    onClick={this.handleGameAdd}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="editGameModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h4 className="modal-title">Edit BoardGame</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.year}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={this.state.activeGame.description}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Player Count</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.player_count}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Playing Time</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.playing_time}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Minimum Age</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.minimum_age}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Complexity</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.complexity}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Geek Rating</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.geek_rating}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Average Rating</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.average_rating}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of Voters</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.activeGame.number_voters}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <input
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input
                    type="submit"
                    className="btn btn-info"
                    value="Save"
                    onClick={this.handleGameEdit}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="deleteGameModal" class="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h4 className="modal-title">Delete BoardGame</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this entry?</p>
                  <p className="text-warning">
                    <small>This action cannot be undone.</small>
                  </p>
                </div>
                <div className="modal-footer">
                  <input
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input
                    type="submit"
                    className="btn btn-danger"
                    value="Delete"
                    onClick={this.handleGameDelete}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
