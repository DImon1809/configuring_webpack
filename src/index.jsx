import asyncFn from "./asyncModule";

import Post from "@models/Post";
import json from "./assets/json.json";
import insole from "./assets/insole.png";
import * as $ from "jquery";

import React from "react";
import { render } from "react-dom";

import "./styles/style.css";
import "./styles/less.less";
import "./styles/scss.scss";

const post = new Post("webpack post title", insole);

asyncFn().then((result) => console.log(result));

console.log("Post to string " + post);

// *Работа с jquery
$(".box").html(post.toString());
console.log("JSON ", json);

const App = () => (
  <>
    <div class="container">
      <h1>WebPack</h1>
    </div>
    <div class="logo"></div>
    <div class="box"></div>
  </>
);

render(<App />, document.getElementById("app"));
