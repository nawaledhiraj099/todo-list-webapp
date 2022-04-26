const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dateModule = require(__dirname + "/date.js");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose Integration
mongoose.connect("mongodb+srv://admin-lakshay:adminpassword@cluster0.y8ask.mongodb.net/todoListDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to today1",
});
const item2 = new Item({
  name: "Welcome to today2",
});
const item3 = new Item({
  name: "Welcome to today3",
});

const defaultItems = [item1, item2, item3];

// const list = []; // just to store the todos in our local memory
app.get("/", (req, res) => {
  const day = dateModule.getDate();
  Item.find({}, (e, data) => {
    if (data.length === 0) {
      Item.insertMany(defaultItems, (e) => {
        if (e) console.log(e);
      });
      res.redirect("/");
    } else {
      res.render("list", { date: day, todos: data });
    }
  });
});

app.post("/", (req, res) => {
  const item = new Item({
    name: req.body.newItem,
  });
  item.save();
  res.redirect("/");
});
app.post("/delete", (req, res) => {
  Item.findOneAndRemove(req.body.checkbox, (e) => {
    console.log(e);
  });
  res.redirect("/");
});

let port = process.env.PORT;
if(port == null || port == "")
  port = 8000;
app.listen(port, () => {
  console.log("Server has started");
});
