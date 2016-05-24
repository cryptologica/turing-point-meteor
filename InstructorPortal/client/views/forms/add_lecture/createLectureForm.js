// When they click "Add Lecture", show the createLectureForm dialog
Template.createLectureForm.events({                                 
	'click #add-lecture': function (e) {                 
		e.preventDefault();
		$('#createLectureForm').modal('show');      
	}                                                              
});

// When the lectures template is loaded make sure the dialog is initialized
Template.lectures.onRendered(function () {   
	Meteor.defer(function () {                             
		initLectureForm();                           
	});
});

// Initialize the dialog when lecture template loads so it's ready when we want to use it
function initLectureForm() {                                           
	var dialog, form;                                                     
	var name = $("#name");                                                                                          
	var allFields = $([]).add(name);
	
	// Leave this function here so it can access allFields var, etc...
	function addLecture() {                                                
		var valid = true;                                                    
		allFields.removeClass("ui-state-error");                             
		var lectureName = name.val().trim();                                                                           
		// Make sure something was entered                                  
		if (lectureName.length <= 0) {                       
			valid = false;                                                      
			// TODO: Make this an actual dialog at some point                   
			alert("One or more fields are empty!");                            
		}                                                       
		if (valid) {                                                                                                                                                                                   
			var userID = Session.get("userID").toString();
			var courseID = Session.get("courseID").toString();
			
			// If we're in production, use the real url
			if (Session.get("isProduction")) {
				var url = Session.get("baseURL") + "/lecture/create"; 
				HTTP.call("POST", url, {data :{
					  "userId": userID,
					  "courseId": courseID,
					  "name": lectureName
					}}, lectureCreateCallback);
			}
			// Otherwise, use mocky URL
			else {
				var fakeURL = "http://www.mocky.io/v2/565bfccf1000001b218a357b";
				HTTP.call("PUT", fakeURL, reqObj, lectureCreateCallback);
			}
		}
		return valid;                                                        
	} 
                                                                    
	dialog = $("#lecture-dialog-form").dialog({                                   
		autoOpen: false,                                                     
		height: 300,                                                         
		width: 350,
		// modal -> can only interact with dialog
		modal: true,
		// Add "Create" and "Cancel" buttons
		buttons: {
			// Call function 'addLecture' when 'Create' button in dialog is clicked 
			"Create": addLecture,                                              
			Cancel: function () {                                               
				dialog.dialog("close");
				// Fix a bug that doesn't remove hover/focus
				$('#add-lecture').button().blur();
			}                                                                   
		},
		// When you click the "X" button
		close: function () {                                                 
			form[0].reset();                                                    
			allFields.removeClass("ui-state-error");
			$('#add-lecture').button().blur();
		}                                                                   
	});                                                                   
 
	// Add the lecture when they click "Create"
	form = dialog.find("form").on("submit", function (event) {
		// Don't do any submit stuff, just call addlecture()
		event.preventDefault();                                              
		addLecture();                                                         
	});                                                                   
 
	// Add listener to "Add Lecture" button to open dialog on click
	$("#add-lecture").button().on("click", function () {                   
		dialog.dialog("open");                                            
	});                                                                  
}

/**                                                                    
 * This function will be called when we receive                        
 * a response back from the server with the                            
 * lectureId.
 * @error NULL if no error                                             
 * @result Contains response data from server                          
 */                                                                    
function lectureCreateCallback(error, result) {                         
	// If we don't get an error back, then process the data               
	if (!error) {                                                         
		// Extract the lectureId                                             
		var lectureID = result.data.lectureId;
		var lectureName = $("#name").val().trim();
		$("#lecture-dialog-form").dialog("close");                                                                                     
		// TODO: Do we need to sanitize the HTML?
		var lectureHTML = '<button id="' + lectureID + '" class="lectureGroup">' + lectureName + '</button>';
	    // Add the HTML to the page                                          
		$("#lectureGroups").append(lectureHTML);                                                            
	} else {                                                              
		alert("There was an error adding the lecture.");
	}
	// Make sure newly added html buttons are converted to jquery-ui buttons.
	$('button').button();
}