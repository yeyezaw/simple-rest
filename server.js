var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User');
var methodOverride = require('method-override');

//connect database
mongoose.connect('mongodb://localhost/simple-rest');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set('view engine', 'hbs');

app.get('/', function(req,res){
    res.render('home', {title : 'Home Page'});
});

// GET '/users'
app.get('/users', function(req,res){
    res.render('users');
});

// POST '/users'
app.post('/users', function(req,res){
    var user = new User({
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
      phone : req.body.phone
    });

    user.save(function(err){
      if(err){
        res.send(err);
      }
      else{
        res.redirect('/users/all');
      }
    });
});

// GET '/users/all'
//Display all users newly created or updated
app.get('/users/all', function(req,res){
    User.find(function(err,users){
      if(err){
        res.send(err);
      }
      res.render('allusers', { users: users});
    });
});

// GET '/users/all/:user_id'
//Display each user by id
app.get('/users/all/:user_id', function(req,res){
    User.findById(req.params.user_id, function(err, user){
      if(err){
        res.send(err);
      }
      else{
        res.render('update_user', {title: 'Update User', user: user});
      }
    });
});

// PUT '/users/all/:user_id'
//Update each user by id
app.put('/users/all/:user_id', function(req,res){
    User.findById(req.params.user_id, function(err, user){
      if(err){
        res.send(err);
      }
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.phone = req.body.phone;

      //save updated info
      user.save(function(err){
        if(err){
          res.send(err);
        }
        else{
          res.redirect('/users/all');
        }
      });
    });
});

// DELETE '/users/all/:user_id'
//Delete each user by id
app.delete('/users/all/:user_id', function(req,res){
    User.remove({
      _id: req.params.user_id
    }, function(err,user){
          if(err){
            res.send(err);
          }
          else{
            res.redirect('/users/all');
          }
    });
});


app.listen(9090, function(){
    console.log('server is running on port: 9090');
});
