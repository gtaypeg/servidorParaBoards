import React, { Component } from "react";
import useComponentVisible from "./services";

const DropDown = props => {
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible
  } = useComponentVisible(false);

  let style = isComponentVisible ? "button active" : "button";

  return (
    <div>
      <div className="menu">
        {//Button hidden
        isComponentVisible && (
          <button
            className={style}
            name="showMenu"
            onClick={() => {
              setIsComponentVisible(false);
              props.handleClick();
            }}
          >
            menu
          </button>
        )}
        {//Button Show
        !isComponentVisible && (
          <button
            className="button"
            name="showMenu"
            onClick={() => {
              setIsComponentVisible(true);
              props.handleClick();
            }}
          >
            menu
          </button>
        )}

        {isComponentVisible && (
          <ul className="menu-items" ref={ref}>
            <li className="item">
              <button
                onClick={e => props.handleReport(e)}
                className="buttonReport"
                name="report"
              >
                {props.report}
              </button>
            </li>
            <li className="item">
              <form onSubmit={e => props.handleDelete(e)}>
                <label htmlFor="menuDelete">
                  {props.err && <span className="error">{props.message}</span>}
                </label>
                <input
                  className="password"
                  type="password"
                  name="pass"
                  placeholder="password to delete"
                  required
                  id="menuDelete"
                  onClick={() => props.handleClick()}
                />
                <button type="submit" className="deleteButton" name="delete">
                  {props.delete}
                </button>
              </form>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

class MenuButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      err: false,
      report: false
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.err) {
      this.setState({
        err: false
      });
    }
  }

  handleDelete(e) {
    e.preventDefault();
    let button = e.target.getElementsByTagName("button")[0];
    button.classList.add("load");
    button.disabled = true;
    let board = this.props.board;
    let url = encodeURI(
      "http://localhost:5000/api/" +
        (this.props.name === "threadMenu" ? "threads/" : "replies/") +
        board
    );
    let data = new FormData(e.target);
    let body;
    if (this.props.name === "threadMenu") {
      body = JSON.stringify({
        id: this.props.target,
        pass: data.get("pass")
      });
    } else {
      body = JSON.stringify({
        idReply: this.props.idReply,
        idThread: this.props.idThread,
        pass: data.get("pass")
      });
    }
    fetch(url, {
      method: "delete",
      body,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(resJson => {
        if (this.props.name === "threadMenu") {
          if (resJson.message === "delete") {
            this.props.delete();
          } else {
            this.setState({
              message: resJson.message,
              err: true
            });
          }
        } else {
          if (resJson.status === "1") {
            this.props.deleteReply(resJson.id);
          } else {
            this.setState({
              message: resJson.message,
              err: true
            });
          }
        }
        button.classList.remove("load");
        button.disabled = false;
      })
      .catch(() => {
        this.setState({
          err: true,
          message: "server error"
        });
        button.classList.remove("load");
        button.disabled = false;
      });
  }
  handleReport(e) {
    let board = this.props.board;
    let button = e.target;
    button.disabled = true;
    button.classList.add("load");
    let url = encodeURI(
      "http://localhost:5000/api/" +
        (this.props.name === "threadMenu" ? "threads/" : "replies/") +
        board
    );
    let body;

    if (this.props.name === "threadMenu") {
      body = JSON.stringify({
        id: this.props.target
      });
    } else {
      body = JSON.stringify({
        idReply: this.props.idReply,
        idThread: this.props.idThread
      });
    }

    fetch(url, {
      method: "put",
      body,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.message === "1") {
          this.setState({
            report: true,
            message:
              (this.props.name === "threadMenu" ? "Thread" : "Reply") +
              " Reported",
            err: true
          });
        }
        button.classList.remove("load");
        button.disabled = false;
      })
      .catch(() => {
        this.setState({
          report: true,
          message: "Server error",
          err: true
        });
        button.classList.remove("load");
        button.disabled = false;
      });
  }

  render() {
    return (
      <div>
        <DropDown
          handleDelete={this.handleDelete}
          handleReport={this.handleReport}
          handleClick={this.handleClick}
          close={this.close}
          report={
            this.props.name === "threadMenu" ? "Report Thread" : "Report Reply"
          }
          delete={
            this.props.name === "threadMenu" ? "Delete Thread" : "Delete Reply"
          }
          message={this.state.message}
          err={this.state.err}
        />
      </div>
    );
  }
}

export default MenuButton;
