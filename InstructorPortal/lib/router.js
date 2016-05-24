Router.configure({                                                     
    layoutTemplate: 'layout'                                           
});                                                                   
                                                                       
Router.map(function () {                                               
    this.route('home', {                                             
        path: '/'                                                     
    });                                                                
                                                                       
    this.route('lectures', {                                           
        path: '/lectures'                                              
    });                                                                
                                                                       
    this.route('quiz', {                             
        path: '/quiz'                                 
    });
    
    this.route('students', {                             
        path: '/students'                                 
    });
    
    this.route('login', {                             
        path: '/login'                                 
    });       
    
	this.route('register', {                             
	    path: '/register'                                 
	});     
});

// Users not logged in will be redirected to login page
Router.onBeforeAction(function() {
	// See if the user is logged in
	if (!Session.get("userID")) {
		// If they aren't logged in...
		// Then allow them access to register page
		if (this.url == '/register') {
			this.render('register');
			return;
		}
		// Also allow them access to register page
		this.render('login');
	// Otherwise, go to requested page
	} else {
		this.next();
	}
});