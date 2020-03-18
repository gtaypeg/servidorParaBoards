import './board.scss';
import React, { Component } from 'react';

import Threads from './threadComponent';
import Form from './form';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            threads: [],
            exist: true,
            loading: true,
            message: 'Loading...'
        };
    }
    componentDidMount() {
        fetch('http://localhost:5000/api/threads/' + this.props.match.params.board)
            .then(res => res.json())
            .then(resJson => {
                if (resJson.status === '-1') {
                    this.setState({ exist: false, loading: false });
                } else {
                    this.setState({
                        exist: true,
                        loading: false,
                        threads: resJson.threads
                    });
                }
            })
            .catch(err => {
                this.setState({
                    message: 'Error. Try again'
                });
            });
        window.scrollTo(0, 0);
    }
    render() {
        if (this.state.loading) {
            return (
                <div>
                    <h1>{this.state.message}</h1>
                </div>
            );
        } else {
            if (this.state.exist) {
                return (
                    <div>
                        <h1>Welcome to {this.props.location.pathname}</h1>

                        <Form type="thread" board={this.props.match.params.board} />
                        <div id="thread-container">
                            {this.state.threads.map((d, i) => {
                                let url = this.props.location.pathname + '/' + d._id;
                                return (
                                    <Threads
                                        key={i}
                                        id={d._id}
                                        url={url}
                                        repliesCount={d.replyCount}
                                        repliesHidden={d.replyHidden || 0}
                                        text={d.text}
                                        date={new Date(d.created_on).toUTCString()}
                                        replies={d.replies}
                                        mode="t"
                                        board={this.props.match.params.board}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h1>Board no exist</h1>
                    </div>
                );
            }
        }
    }
}

export default Board;
