var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var FB = require("fb");

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
		clientID: process.env.APP_ID,
		clientSecret: process.env.APP_SECRET,
		callbackURL: 'http://localhost:5000/auth/facebook/cb'
	},
	function(accessToken, refreshToken, profile, cb) {
		// In this example, the user's Facebook profile is supplied as the user
		// record.  In a production-quality application, the Facebook profile should
		// be associated with a user record in the application's database, which
		// allows for account linking and authentication with other identity
		// providers.


		var getAlbums = function() {
			var endpoint = `/${process.env.PAGE_ID}/albums`;
			return FB.api(endpoint);
		};

		var createAlbum = function(name) {
			var endpoint = `/${process.env.PAGE_ID}/albums`;
			return FB.api(endpoint, "post", {
				access_token: process.env.ACCESS_TOKEN,
				location: "Test from Localhost",
				message: "An album created with NodeJs & Passport",
				name: name
			});
		};

		createAlbum("Are you ready?")
			.then((data) => { console.log(data) })
			.catch((err) => { console.log(err) });

		getAlbums().then((data) => { console.log(data) });
		return cb(null, profile);
	}));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
	function(req, res) {
		res.render('home', { user: req.user });
	});

app.get('/login',
	function(req, res) {
		res.render('login');
	});

app.get('/login/facebook',
	passport.authenticate('facebook', { scope: ['public_profile','manage_pages', 'publish_pages', 'pages_show_list', 'publish_actions'] }));

app.get('/auth/facebook/cb',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
		// console.log(req.user);

	});

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.render('profile', { user: req.user });
	});


app.listen(process.env.PORT || 5000, function() {
	console.log(`Server is listening on port ${process.env.PORT || 5000}...`);
});
