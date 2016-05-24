// When the lectures page is rendered, populate lecture list
Template.lectures.onRendered(function() {
	Meteor.defer(function() {
		$('button').button();
		initLectures();
	});
});

//When they click "Manage Students"...
Template.lectures.events({
	'click .lectureGroup' : function(event) {
		// Set the courseID by getting it from the div of the clicked button
		var lectureID = ($(event.currentTarget)).attr('id');
		Session.setPersistent("lectureID", lectureID);
		console.log("lectureID = "+lectureID);
		Router.go('/quiz');
	}
});

/**                                                                    
 * When the page loads, this is called.                                
 * It asks the server for the list of lectures available to current user.                        
 * lectureListCallback is called upon response and populates them.     
 */
function initLectures() {
	// If in production use the real URL
	if (Session.get("isProduction")) {
		var courseID = Session.get("courseID");
		if (courseID.length <= 0) {
			alert("ERROR: Could not get valid courseID");
			return;
		}
		var url = Session.get("baseURL") + "/courses/" + courseID + "/lectures";
		HTTP.call("GET", url, lectureListCallback);
	}
	// Otherwise use fake mocky URL
	else {
		var fakeURL = "http://www.mocky.io/v2/5655469e0f00005d0c282b9a";
		HTTP.call("PUT", fakeURL, lectureListCallback);
	}
}

/**                                                                    
 * This function will be called when we receive                        
 * a response back from the server about getting                       
 * a list of the lectures available for a course.                      
 * @error NULL if no error                                             
 * @result Contains response data from server                          
 */
function lectureListCallback(error, result) {
	// If we don't get an error back, then process the data
	if (!error) {
		var lectures = result.data.Lectures;
		// Extract info for each course                         
		for (var i = 0; i < lectures.length; i++) {
			var lectureID = lectures[i].lectureId;
			var lectureName = lectures[i].name;
			// Generate and add the HTML to the page  
			var lectureHTML = '<button id="' + lectureID + '" class="lectureGroup">' + lectureName + '</button>';
			$("#lectureGroups").append(lectureHTML);
			// This makes all the buttons jquery-ui buttons so they follow theme
			$('button').button();
		}
	} else {
		alert("There was an error retrieving the lecture list from the server.");
	}
}