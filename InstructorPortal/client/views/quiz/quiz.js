// When the quiz page is rendered       
Template.quiz.onRendered(function() {
	Meteor.defer(function() {
		this.autorun(() => {
			$('button').button();
		});
	});
});


// When they click "Add Answer" button
Template.quiz.events({
	'click #addAnswerBtn' : function(event) {
		var newAnswer = '<div class="questionAnswerBlock"><button type="button" class="deleteAnswerBtn">Delete Answer</button> <input placeholder="Answer" type="text" name="answer"> <span class="correctRadioBtn"><input type="radio" name="ans" value="0">Correct</span></div>';
		$('#questionOptionBox').append(newAnswer);
		console.log("answer deleted.");
	}
});

//When they click "Add Answer" button
Template.quiz.events({
	'click .deleteAnswerBtn' : function(event) {
		$(event.currentTarget).closest('.questionAnswerBlock').remove();
	}
});

//When they toggle the "Show Answer" checkbox
Template.quiz.events({
	'click #showAnswerCheckbox' : function(event) {
		showQuestions();
	}
});

/**
 * This checks if the "Show Answers" checkbox
 * is checked. If it isn't, then it hides the questions.
 */
function showQuestions() {
	$('.correctRadioBtn').toggle("slide");
}