// On startup...
if (Meteor.startup) {
	// Set the session variables.
	Session.set("baseURL", "http://student-145.coe.utah.edu:8110/TuringPoint/rest");
	// If set to true then it will use real URLs instead of mocky ones
	Session.set("isProduction", true);
	
	/* 
	List of Session variables:
		currUser: the first/last name of the user currently logged in
		userID: the ID of the user currently logged in
		baseURL: the base url used when making HTTP requests
		isProduction: determines if test url or production url should be used (set false for pure testing)
	*/
}

/**
 * Whenever {{session "currUser"}} is called in the HTML it will
 * look up the currUser variable in Session and return its value.
 * Use same syntax to lookup any Session variable using this helper.
 */
Handlebars.registerHelper('session', function(name) {
    return Session.get(name);
});

/**
 * Whenever {{{isLogout}}} is called in the HTML it will
 * check if a user is logged in. If they are then it will
 * show the Logout link. Otherwise it will tell them to login.
 */
Handlebars.registerHelper('isLogout', function() {
	if (Session.get("userID")) {
		return ' | <a id="logout" href="/login">Logout</a>';
	} else {
		return 'Welcome! Please login.';
	}
});

/**
 * Whenever {{{navBar}}} is called in the HTML it will
 * check what page we're on and update the navBar.
 */
Handlebars.registerHelper('navBar', function() {
	// If we're not logged in the navBar should be empty
	if (!Session.get("userID")) {
		$('.navBarClass').empty();
		return '<p></p>';
	}
	var page = Router.current().route.path();
	if (page == '/') {
		return '<a href="/">Home</a>';
	}
	if (page == '/students') {
		return '<a href="/">Home </a>&gt;<a href="/students"> Students</a>';
	}
	if (page == '/lectures') {
		return '<a href="/">Home </a>&gt;<a href="/lectures"> Lectures</a>';
	}
	if (page == '/quiz') {
		return '<a href="/">Home </a>&gt;<a href="/lectures"> Lectures</a>&gt;<a href="/quiz"> Play/Edit</a>';
	}

	// If we aren't on any specific page just clear navBar
	$('.navBarClass').empty();
	return '<p></p>';
});

/**
 * Whenever {{alert}} is called in the HTML or
 * when the session 'alert' variable changes
 * it will update the alert.
 */
Handlebars.registerHelper('alert', function() {
	return Session.get("alert");
});