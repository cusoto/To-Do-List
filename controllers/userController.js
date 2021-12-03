const User = require('../models/user');
const Passport = require('passport');

//Express validator
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');


exports.signupGet = (req, res) => {
    res.render('signup', { title: 'signup' });
}

exports.signupPost = [
    //Validate data
    check('user_name').isLength({ min: 1 }).withMessage('User name must be specified')
    .isAlphanumeric().withMessage('User name must be alphanumeric'),

    check('email').isEmail().withMessage('Invalid email address'),

    check('confirm_email')
    .custom(( value, { req } ) => value === req.body.email )
    .withMessage('Email addresses do not match'),

    check('password')
    .isLength({ min: 6})
    .withMessage('Invalid passwords. Passwords must be a minimum of 6 characters'),

    check('confirm_password')
    .custom(( value, { req } ) => value === req.body.password )
    .withMessage('Passwords do not match'),

    sanitize('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            //There are errors
            res.render('signup', { title: 'Please fix the following errors:', errors: errors.array() });
            return;
        } else {
            // No errors
            const newUser = new User(req.body);
            User.register(newUser, req.body.password, function(err) {
                if(err) {
                    console.log('error while registering!', err);
                    return next(err);
                }
                next(); // Move onto loginPost after registering
            });
        }
    }
];

exports.loginGet = (req, res) => {
    res.render('login', { title: 'Log In to continue' });
}

exports.loginPost = Passport.authenticate('local', {
    successRedirect: '/dashboard',
    successFlash: 'You are now logged in',
    failureRedirect: '/login',
    failureFlash: 'Login failed, please try again'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('info', 'You are now logged out');
    res.redirect('/');
}