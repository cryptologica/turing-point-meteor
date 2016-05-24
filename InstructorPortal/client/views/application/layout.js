// Clear user data and redirect when logout is clicked
Template.layout.events({
	'click #logout': function () {
		clearUser();
		Router.go("/login");
	}
});

// Just hide alert when it is closed
Template.layout.events({                                     
	'click .alert .close': function (e) {                                   
		$('this').parent().hide();           
	}                                                                    
});

/**
 * Used when you want to logout.
 * Deletes current session data.
 */
function clearUser() {
	Session.clearPersistent();
}