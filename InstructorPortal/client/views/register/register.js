Template.register.events({
	'submit form' : function(event, template) {
		event.preventDefault();

		var FName = event.target.fName.value;
		var LName = event.target.lName.value;
		var Email = event.target.email.value;
		var Pass = event.target.password.value;
		var Role = event.target.role.value;
		var StudentID = event.target.studID.value;
		var url = Session.get("baseURL") + "/users/create";

		if (Role == ("STUDENT")) {
			console.log("student");
			HTTP.call("POST", url, {data :{
				  "email": Email,
				  "password": Pass,
				  "role": Role,
				  "studentId": StudentID,
				  "fname": FName,
				  "lname": LName
				}}, registrationCallback);
		} else {
			console.log("Intsructor");
			HTTP.call("POST", url, {data :{
				  "email": Email,
				  "password": Pass,
				  "role": Role,
				  "fname": FName,
				  "lname": LName
				}}, registrationCallback);
		}
	}
});

//On rendered, make buttons jquery-ui buttons
Template.register.onRendered(function () {
	this.autorun(() => {
		$('#submitRegistration').button();
		$('#cancelButton').button();
	});
});

// Go back to login if they click cancel
Template.register.events({
	'click #cancelButton': function () {
		Router.go("/login");		
	}
});

function registrationCallback(error, result) {
	if (!error) {
		alert("Registration successful! Please login now.");
		Router.go("/login");
	} else {
		alert("An error occured during registration.");
	}
};