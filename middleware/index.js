const Place = require("../models/place");

module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');//want login if not then redirect login
    },
    checkUserPlace: function(req, res, next) {// check post belongs to owner
        Place.findById(req.params.id, (err, foundPlace) => {
            if (err || !foundPlace) {
                console.log(err);
                res.redirect('/');
            }
            else if (foundPlace.author.id.equals(req.user._id)) {
                req.place = foundPlace;
                next();
            }
            else {
                console.log('not your post');
                res.redirect('/');
            }
        });
    }
}