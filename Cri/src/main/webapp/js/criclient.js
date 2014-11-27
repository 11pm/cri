var cri = {
	templateFolder: 'templates/',
	
	//all details about a user	
	user: {
		id: -1, 
		username: null,
		password: null, 
		user_created: null,
		friends: []
	},

	init: function(){
		var local_user = JSON.parse(localStorage.getItem("user"));
		//User found
		if(local_user){
			cri.user = local_user;
		}

		if(cri.isAuth()){
			cri.renderTemplate('main', cri.user);
		}
		else{
			cri.renderTemplate('login');
		}
	},

	isAuth: function(){
		return this.user.id > 0;
	},

	login: function(e){
		e.preventDefault();
		var that = $(this);
		var username = that.find('.username').val();
		var password = that.find('.password').val();
		
		webClient.send({type: "login", data: { username: username, password: password }}, function(response){
			//worked MA
			console.log(response)
			response = JSON.parse(response.data);

			//login worked
			if(response.success === true){

				cri.user = response.details;
				cri.user.friends = response.friends;

				localStorage.setItem("user", JSON.stringify(cri.user));
				cri.init();

			}
			else{
				console.log("too bad");
			}
		});
	},

	clickFriend: function(e){

		e.preventDefault();
		var that = $(this);
		var data = that.data();

		var chat = $('.chat');
		cri.renderTemplate('chat', data);

	},

	renderTemplate: function(name, context){

		var templateName = function(name){
			return cri.templateFolder + name + '.html';
		};

		$.ajax({
			url: templateName(name),
			type: "GET",
			success: function(html){
				var template = Handlebars.compile(html);

				//if we have hsb var, use them
				if(typeof context !== "undefined")
					$('.'+name).html(template(context));
				else
					$('.'+name).html(html);
			} 
		});

	},

	//send the message server
	sendMessage: function(e){
		
		e.preventDefault();

		var message = $(this).find('.message').val();

		webClient.send({type: "message", data: {content: message}}, function(response){
			console.log(response);
		});

		$(".messages .message").append(message);

	},

};

$(document).ready(cri.init);

//Login submited
$('body').on('submit', '.loginForm', cri.login);

$('body').on('click', '.friend', cri.clickFriend);

$('body').on('submit', '.messageForm', cri.sendMessage);