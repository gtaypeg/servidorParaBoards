import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      text: "",
      submit: false,
      textarea: {
        className: "",
        name: "",
        placeholder: ""
      },
      redirect: false,
      redirectTo: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    switch (this.props.type) {
      case "thread":
        this.setState({
          textarea: {
            className: "threadText",
            name: "text",
            placeholder: "Thread text..."
          }
        });
        break;
      case "quickReply":
        this.setState({
          textarea: {
            className: "quickReply",
            name: "reply",
            placeholder: "Quick reply..."
          }
        });
        break;
      default:
        break;
    }
  }
  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let button = e.target.getElementsByTagName("button")[0];
    let input = e.target.getElementsByTagName("input")[0];
    button.disabled = true;
    button.classList.add("load");
    this.setState({ submit: true, err: false });
    const data = new FormData(e.target);
    let body;
    if (this.props.type === "thread") {
      body = JSON.stringify({
        text: this.state.text,
        pass: data.get("pass")
      });
    } else {
      body = JSON.stringify({
        text: this.state.text,
        pass: data.get("pass"),
        id: this.props.target
      });
    }

    let url = encodeURI(
      "http://localhost:5000/api/" +
        (this.props.type === "thread" ? "threads/" : "replies/") +
        this.props.board
    );
    fetch(url, {
      method: "post",
      body,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(resJson => {
        if (this.props.type === "thread") {
          this.setState({
            redirect: true,
            redirectTo: "/boards/" + this.props.board + "/" + resJson.id
          });
        } else if (this.props.type === "quickReply") {
          this.props.addReply(resJson);
          this.setState({ text: "" });
          input.value = "";
        }
        button.classList.remove("load");

        button.disabled = false;
      })
      .catch(err => {
        console.log(err);
        this.setState({
          err: true
        });
        button.classList.remove("load");
        button.disabled = false;
      });
  }

  render() {
    let { redirect, redirectTo } = this.state;
    if (redirect) {
      return <Redirect push to={redirectTo} />;
    } else {
      return (
        <div>
          <div
            className={
              this.props.type === "thread"
                ? "submitContainer"
                : "quickReplyContainer"
            }
          >
            {this.props.type === "thread" && <h4>Submit a new thread:</h4>}
            <form onSubmit={this.handleSubmit}>
              <div>
                <div>
                  <label htmlFor="threadText">
                    {this.state.err ? (
                      <span className="error">
                        Error to conect server, try again
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                  <textarea
                    required
                    className={this.state.textarea.className}
                    name={this.state.textarea.name}
                    placeholder={this.state.textarea.placeholder}
                    value={this.state.text}
                    onChange={this.handleChange}
                    onClick={() => {
                      this.setState({ err: false });
                    }}
                  />
                </div>
                <input
                  required
                  className="pass"
                  name="pass"
                  placeholder="password to delete"
                  type="password"
                  onClick={() => {
                    this.setState({ err: false });
                  }}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default Form;
