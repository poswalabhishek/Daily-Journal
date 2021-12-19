//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Daily Journal aims to keep me motivated towards my learning in the two specific areas i.e. Markets (Trading) and Computer Science. Here, I try to keep track of the markets and express my opinions. This way, I keep track of my progress whilst exploring new feilds of interest. That being said, I am also a true believer in technology. For this reason, I have a natural bias to keep things on the technical end. So, I encourage people from all kinds of expertise to take a look at my analysis since I mostly have a different take at things than usual business and economics majors.";
const aboutContent = "Hi, my name is Abhishek. I am a penultimate year student at HKUST majoring in Computer Science Engineering specializing in Machine Leanring and Software Engineering. People ask why I chose Engineering and here is my take on it. Although some might disagree, unlike businessmen and scientists, engineers are neither too optimistic nor too theoretical with the ideas. Generally, engineers tend to know how where the boundaries between reality and theory lies. Accordingly, they have the tendancy to cultivate real impact in the society by pushing them. Therefore, I chose Engineering.";
const contactContent = "Leave me an email at aposwal@connect.ust.hk";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const uri = 'mongodb+srv://poswalabhishek:Vijendrasingh1@cluster0.t0ve7.mongodb.net/daily_journal?retryWrites=true&w=majority';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
