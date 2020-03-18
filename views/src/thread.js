import React, { Component } from "react";
import Threads from "./threadComponent";
class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: [],
      thread: {},
      loaded: false,
      message: ""
    };
  }
  componentDidMount() {
    let url = encodeURI(
      "http://localhost:5000/api/replies/" +
        this.props.match.params.board +
        "?thread_id=" +
        this.props.match.params.thread_id
    );
    fetch(url)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.message) {
          this.setState({
            message: resJson.message,
            loaded: true
          });
        }
        this.setState({
          thread: resJson.thread,
          replies: resJson.replies,
          loaded: true
        });
      })
      .catch(() => {
        this.setState({
          loaded: true,
          message: "Error, try again"
        });
      });
  }
  render() {
    if (!this.state.loaded) {
      return <h1>Loading...</h1>;
    } else if (this.state.message) {
      return <h1>{this.state.message}</h1>;
    } else {
      return (
        <>
          <h1>Welcome to {this.props.location.pathname}</h1>
          <Threads
            id={this.state.thread._id}
            text={this.state.thread.text}
            date={this.state.thread.created_on}
            replies={this.state.replies}
            mode="a"
            board={this.props.match.params.board}
          />
        </>
      );
    }
  }
}

export default Thread;
