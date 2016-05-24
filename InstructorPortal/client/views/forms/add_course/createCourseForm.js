// When they click "Add Course", show the createCourseForm dialog
Template.createCourseForm.events({                                     
	'click #add-course': function (e) {                                   
		e.preventDefault();
		$('#createCourseForm').modal('show');              
	}                                                                    
});
                                                                       
// When the home template is loaded make sure the dialog is initialized
// This is in here instead of home.js because it needs to access initCreateForm()
Template.home.onRendered(function () {       
	Meteor.defer(function () {                                  
		initCreateForm();                                   
	});        
});

// Initialize the dialog when home template loads so it's ready when we want to use it
function initCreateForm() {                                           
	var dialog, form;                                                     
	var name = $("#name");                                               
	var descr = $("#descr");                                              
	var allFields = $([]).add(name).add(descr);
	
	// Leave this function here so it can access allFields var, etc...
	function addCourse() {                                                
		var valid = true;                                                    
		allFields.removeClass("ui-state-error");                             
		var courseName = name.val().trim();                                       
		var courseDescr = descr.val().trim();                                     
		// Make sure something was entered                                  
		if (courseName.length <= 0 || courseDescr.length <= 0) {                       
			valid = false;                                                      
			$("<div title='Error' class='ui-state-error'>One or more fields are empty!</div>").dialog();
			$('button').button().blur();
		}                                                                    
		if (valid) {                                                                            
			// If in production use real url
			if (Session.get("isProduction")) {
				var userID = Session.get("userID").toString();
				var url = Session.get("baseURL") + "/courses/create";
				HTTP.call("POST", url, {data :{
					  "name": courseName,
					  "description": courseDescr,
					  "userId": userID
					}}, courseCreateCallback);
			}
			// Otherwise use mocky url
			else {
				var fakeURL = "http://www.mocky.io/v2/5653cf370f0000560760c0e7";    
				HTTP.call("PUT", fakeURL, reqObj, courseCreateCallback);
			}
		}
		return valid;                                                        
	} 
                                                                       
	dialog = $("#dialog-form").dialog({                                   
		autoOpen: false,                                                     
		height: 300,                                                         
		width: 350,
		// modal -> can only interact with dialog
		modal: true,
		// Add "Create" and "Cancel" buttons
		buttons: {                                                           
			"Create": addCourse,                                                
			Cancel: function () {                                               
				dialog.dialog("close");
				// Fix a bug that doesn't remove hover/focus
				$('#add-course').button().blur();
			}                                                                   
		},
		// When you click the "X" button
		close: function () {                                                 
			form[0].reset();                                                    
			allFields.removeClass("ui-state-error");
			$('#add-course').button().blur();
		}                                                                   
	});                                                                   
    
	// Add the course when they click "Create"
	form = dialog.find("form").on("submit", function (event) {
		// Don't do any submit stuff, just call addCourse()
		event.preventDefault();                                              
		addCourse();                                                         
	});                                                                   
    
	// Add listener to "Add Course" button to open dialog on click
	$("#add-course").button().on("click", function () {                   
		dialog.dialog("open");                                            
	});                                                                  
}
                                                                       
/**                                                                    
 * This function will be called when we receive                        
 * a response back from the server with the                            
 * courseId for the newly created course.                                                  
 * @error NULL if no error                                             
 * @result Contains response data from server                          
 */                                                                    
function courseCreateCallback(error, result) {                         
	// If we don't get an error back, then process the data               
	if (!error) {                                                         
		// Extract the courseId                                             
		var courseID = result.data.courseId;                                 
		var courseName = $("#name").val().trim();
		var courseDescr = $("#descr").val().trim();           
		$("#dialog-form").dialog("close");                                                                                     
		// TODO: Do we need to sanitize the HTML?                            
		var courseHTML = '<fieldset class="courseFieldset"><legend>' + courseName + ' - ' + courseDescr + '</legend><div class="oneCourse" id="' + courseID + '"> <button id="managePollsBtn">Manage Lectures</button><div class="divider"></div><button>Manage Results</button><div class="divider"></div><button id="mngStudentsBtn">Manage Students</button><div class="divider"></div><button id="deleteCourseBtn">Delete Course</button></div></fieldset>';
		// Add the HTML to the page                                          
		$("#coursesID").append(courseHTML);                                                        
	} else {                                                              
		alert("There was an error adding the course.");
	}
	$('.oneCourse').buttonset();
}                                                                      
                                                                                                                                    