// Send login request when loginButton is clicked
Template.login.events({
	'submit form': function (event, template) {
		event.preventDefault();
		var userID = event.target.userID.value;
		var password = event.target.password.value;
		var url = Session.get("baseURL") + "/login";
		
		// Clear the values
		event.target.userID.value = "";
		event.target.password.value = "";
		$('#loginButton').button().blur();
		
		HTTP.call("POST", url, {data :{
			  "email": userID,
			  "password": password
			}}, loginCallback);
	}
});

// Go to register page when register button is clicked
Template.login.events({
	'click #registerButton': function () {
		Router.go("/register");
	}
});

// On rendered, make buttons jquery-ui buttons
Template.login.onRendered(function () {
	this.autorun(() => {
		$('#loginButton').button();
		$('#registerButton').button();
	});
});


/**
 * This is called when a response from the
 * server is received about logging in.
 * @param error
 * @param result
 */
function loginCallback(error, result) {
	if (!error) {
		console.log("Login successful");
		var userID = result.data.userId;
		var name = result.data.fname + " " + result.data.lname;
		Session.setPersistent("currUser", name);
		Session.setPersistent("userID", userID);
		Router.go("/");
	} else {
		alert("Error logging in.");
	}
};