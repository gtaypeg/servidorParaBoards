import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./boards.scss";

const TargetBoard = props => {
  let url = encodeURI("/boards/" + props.title);
  return (
    <>
      <Link to={url} title={'Go to "' + props.title + '"'}>
        <div id={props.id} className="targetBoard">
          <h2 className="targetBoard__title">{props.title}</h2>
          <p className="targetBoard__count">Threads: {props.threadsCount}</p>
        </div>
      </Link>
    </>
  );
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      submit: false,
      errM: "",
      err: false,
      redirect: false,
      boardTitle: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      title: e.target.value,
      err: false,
      errM: ""
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let button = document.getElementsByTagName("button")[0];
    button.disabled = true;
    button.classList.add("load");

    this.setState({ submit: true });

    fetch("http://localhost:5000/api/boards", {
      method: "post",
      body: JSON.stringify({
        title: this.state.title
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(resJson => {
        if ((resJson.message || 0) === "-1") {
          this.setState({
            err: true,
            errM: "Board exist!"
          });
        } else {
          this.setState({
            redirect: true,
            boardTitle: resJson.title
          });
        }
        button.classList.remove("load");
        button.disabled = false;
      })
      .catch(err => {
        this.setState({
          err: true,
          errM: "Error to conect server, try again"
        });
        button.classList.remove("load");
        button.disabled = false;
      });
  }

  render() {
    let { redirect, errM, err, title, boardTitle } = this.state;

    if (redirect) {
      return <Redirect push to={"/boards/" + boardTitle} />;
    }

    return (
      <div>
        <div className="submitContainer">
          <h4>Create a new Board:</h4>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="title">
                {err ? <span className="error">{errM}</span> : ""}
              </label>
              <input
                id="title"
                name="title"
                placeholder="Title board"
                value={title}
                onChange={this.handleChange}
                type="text"
                required
                onClick={() => {
                  this.setState({ err: false });
                }}
              />
            </div>
            <button>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

class Boards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: []
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    fetch("http://localhost:5000/api/boards", {
      method: "get"
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          boards: responseJson
        });
      })
      .catch(err => {
        //manejar errores de conexion
      });
  }
  render() {
    return (
      <div>
        <h1>Welcome to /boards</h1>
        <Form />

        <div id="boards-container">
          {this.state.boards.map(data => {
            let tc = data.threads.length;
            let id = data._id;
            let title = data.title;
            return (
              <TargetBoard key={id} id={id} title={title} threadsCount={tc} />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Boards;
