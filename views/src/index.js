import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Boards from "./boards";
import Board from "./board";
import Thread from "./thread";

const App = () => (
  <Router>
    <Switch>
      <Route path="/boards" component={Boards} exact />
      <Route path="/boards/:board" component={Board} exact />
      <Route path="/boards/:board/:thread_id" component={Thread} exact></Route>
    </Switch>
  </Router>
);

ReactDOM.render(<App />, document.querySelector("main"));
