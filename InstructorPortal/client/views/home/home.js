// When the home page is rendered, populate course list        
Template.home.onRendered(function() {
	Meteor.defer(function() {
		initCourses();
	});
});

// When they click "Manage Polls", direct to lectures page
Template.home.events({
	'click #managePollsBtn' : function(event) {
		// Set the courseID by getting it from the div of the clicked button
		var courseID = ($(event.currentTarget).parent()).attr('id');
		Session.setPersistent("courseID", courseID);
		Router.go('/lectures');
	}
});

//When they click "Manage Students"...
Template.home.events({
	'click #mngStudentsBtn' : function(event) {
		// Set the courseID by getting it from the div of the clicked button
		var courseID = ($(event.currentTarget).parent()).attr('id');
		Session.setPersistent("courseID", courseID);
		Router.go('/students');
	}
});

//When they click "Delete Course"...
Template.home.events({
	'click #deleteCourseBtn' : function(event) {
		// Find the courseID by getting it from the div of the clicked button
		var courseID = ($(event.currentTarget).parent()).attr('id');
		if (confirm("Are you sure you want to delete this course?")) {
			$('#'+courseID).parent().remove();
			// TODO: Only deletes on client side, discuss backend options
		}
		$('#deleteCourseBtn').button().blur();
	}
});

//On rendered, make buttons jquery-ui buttons
Template.login.onRendered(function () {
	this.autorun(() => {
		$('#add-course').button();
	});
});



// HELPER FUNCTIONS:                               

/**                                                                    
 * When the home page loads, this is called.                           
 * It asks the server for the list of courses.                         
 * courseListCallback is called upon response and populates them.      
 */
function initCourses() {
	// If in production use real URL
	if (Session.get("isProduction")) {
		// Ask the server for a list of courses available for current user
		var url = Session.get("baseURL") + "/users/" + Session.get("userID") + "/courses";
		HTTP.call("GET", url, courseListCallback);   
	}
	// Otherwise use fake mocky URL
	else {
		var url = "http://www.mocky.io/v2/5658f3b20f0000773b2b838e";
		HTTP.call("PUT", url, courseListCallback);
	}
}

/**                                                                    
 * This function will be called when we receive                        
 * a response back from the server about creating a                    
 * course. It will send back the courseId.                             
 * @error NULL if no error                                             
 * @result Contains response data from server                          
 */
function courseListCallback(error, result) {
	// If we don't get an error back, then process the data      
	if (!error) {
		var courses = result.data.Courses;
		// Extract info for each course                   
		for (var i = 0; i < courses.length; i++) {
			var courseID = courses[i].courseId;
			var courseName = courses[i].name;
			var instructorName = courses[i].instFName + " " + courses[i].instLName;
			var courseDescr = courses[i].description
			// Generate and add the HTML to the page             
			var courseHTML = '<fieldset class="courseFieldset"><legend>' + courseName + ' - ' + courseDescr + '</legend><div class="oneCourse" id="' + courseID + '"> <button id="managePollsBtn">Manage Lectures</button><div class="divider"></div><button>Manage Results</button><div class="divider"></div><button id="mngStudentsBtn">Manage Students</button><div class="divider"></div><button id="deleteCourseBtn">Delete Course</button></div></fieldset>';
			$("#coursesID").append(courseHTML);
		}
	} else {
		alert("There was an error retrieving the course list from the server.");
	}
	$('.oneCourse').buttonset();
}