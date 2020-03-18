import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "./form";
import MenuButton from "./menuButton";

const Replies = props => (
  <>
    <div id={props.id} className="reply">
      <div className="replyHead">
        <p>{props.text}</p>{" "}
        {props.text !== "[delete]" ? (
          <MenuButton
            idReply={props.id}
            idThread={props.idThread}
            board={props.board}
            deleteReply={props.deleteReply}
          />
        ) : (
          <div className="menu">
            <button className="button" disabled>
              menu
            </button>
          </div>
        )}
      </div>

      <p className="replyDate">{props.date}</p>
    </div>
  </>
);

class Threads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showThread: true,
      replies: [],
      repliesCount: 0,
      repliesHidden: 0,
      redirect: false
    };
    this.delete = this.delete.bind(this);
    this.addReply = this.addReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }
  delete() {
    if (this.props.mode === "a") {
      this.setState({
        redirect: true
      });
    } else if (this.props.mode === "t") {
      this.setState({
        showThread: false
      });
    }
  }
  addReply(newData) {
    let array = [...this.state.replies];

    if (this.props.mode !== "a") {
      if (this.state.replies.length === 4) {
        array.splice(0, 1);

        this.setState({
          replies: [...array, newData],
          repliesCount: this.state.repliesCount + 1,
          repliesHidden: this.state.repliesHidden + 1
        });
      } else if (this.state.replies.length < 4) {
        this.setState({
          replies: [...array, newData],
          repliesCount: this.state.repliesCount + 1
        });
      }
    } else {
      this.setState({
        replies: [...array, newData]
      });
    }
  }
  deleteReply(del) {
    let index = this.state.replies.findIndex(e => e._id === del);
    let array = this.state.replies;
    array[index].text = "[delete]";
    this.setState({
      replies: array
    });
  }
  componentDidMount() {
    this.setState({
      replies: this.props.replies,
      repliesCount: this.props.repliesCount || 0,
      repliesHidden: this.props.repliesHidden || 0
    });
  }
  render() {
    let items = this.state.replies.map((item, i) => (
      <Replies
        key={i}
        id={item._id}
        text={item.text}
        date={new Date(item.created_on).toUTCString()}
        idThread={this.props.id}
        board={this.props.board}
        deleteReply={this.deleteReply}
      />
    ));
    if (this.state.redirect) {
      return <Redirect push to={"/boards/" + this.props.board} />;
    } else {
      return (
        <>
          {this.state.showThread && (
            <div id={this.props.id} className="thread">
              <div className="headThread">
                <MenuButton
                  name="threadMenu"
                  target={this.props.id}
                  board={this.props.board}
                  delete={this.delete}
                />
                <h3>{this.props.text}</h3>
              </div>
              <p className="date">{this.props.date}</p>

              {(this.props.mode === "a" ? false : true) && (
                <>
                  <p className="count">
                    {this.state.repliesCount} replies total (
                    {this.state.repliesHidden} hidden)
                  </p>
                  <Link to={this.props.url}>See the full thread...</Link>
                </>
              )}

              <div className="repliesContainer">
                {items}
                <Form
                  type="quickReply"
                  addReply={this.addReply}
                  target={this.props.id}
                  board={this.props.board}
                />
              </div>
            </div>
          )}
        </>
      );
    }
  }
}

export default Threads;
