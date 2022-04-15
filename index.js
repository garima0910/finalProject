const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user'); // user schema
const Place = require('./models/place'); // place schema
const session = require('express-session');
const passport = require('passport'); // login authentication
const LocalStrategy = require('passport-local');
const { isLoggedIn, checkUserPlace } = require('./middleware/index');

const app = express();

mongoose.connect('mongodb://localhost/finalProject');



app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({  //express session
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('index', { page: 'loggedIn' });//page variable in ejs and giving it a value
    }
    else {
        res.render('index', { page: 'index' });
    }
})

app.get('/blogs', (req, res) => {
    Place.find({}, (err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            if (req.isAuthenticated()) {
                res.render('blog', { page: 'loggedIn', places: found });
            }
            else {
                res.render('blog', { page: 'index', places: found });
            }
        }
    });
});

// create post
app.post('/place', isLoggedIn, (req, res) => {
    let place = {                
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Place.create(place, (err, createdPlace) => { //Place db
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/blogs');
        }
    });
});
//to edit the posted post
app.post('/place/:id', isLoggedIn, checkUserPlace, (req, res) => {
    Place.findById(req.params.id, (err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            found.name = req.body.name;
            found.image = req.body.image;
            found.description = req.body.description;
            found.save();
            res.redirect('/blogs');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register', { page: 'register' });
});

app.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        });
    });
});

app.get('/place/:id', isLoggedIn, checkUserPlace, (req, res) => {
    Place.findByIdAndDelete(req.params.id, (err, deletePlace) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/blogs');
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login', { page: 'login' });
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), (req, res) => {

});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('server started!');
});