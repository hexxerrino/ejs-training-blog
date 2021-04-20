//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

mongoose.connect(process.env.mongoDbLink, {useNewUrlParser: true, useUnifiedTopology: true});
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});
const Post = mongoose.model('Post', postSchema);
Post.findOne({ title: 'Welcome' }, function (err, post) {
  if (!err) {
    if (!post) {
      Post.create({ title: 'Welcome', content: 'Some great content!' }, function (err, small) {
        if (err) return handleError(err);
        // saved!
      });
    }
  }
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  Post.find({}, function (err, posts) {
    res.render('home', {postArray: posts});
  });
});

app.get('/about', (req, res) => {
  res.render('about', {});
});

app.get('/contact', (req, res) => {
  res.render('contact', {});
});

app.get('/compose', (req, res) => {
  res.render('compose', {});
});

app.get('/posts/:postId', (req, res) => {
  Post.findOne({_id: req.params.postId}, function(err, post){
    if (err) {
      console.log(err);
    }else {
      res.render('post', {post: post});
    }
  });
 });

app.post('/compose', (req, res) => {
  const postObject = {
    title: req.body.composeTitle,
    content: req.body.composeContent
  }
  Post.create({ title: req.body.composeTitle, content: req.body.composeContent }, function (err, small) {
    if (err) return handleError(err);
    // saved!
  });
  res.redirect('/');
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
