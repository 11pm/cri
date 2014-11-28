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
		/*var local_user = JSON.parse(localStorage.getItem("user"));
		//User found
		if(local_user){
			cri.user = local_user;
		}*/

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
			cache: false,
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

	chatMessage: function(msg){
		var html = "";

		//if its from you
		if(cri.user.username == msg.sender)
			html += "<li class='success'>";
		else
			html += "<li class='danger'>";

		html += "<div class='panel'>";
		html += msg.sender;
		html += "<br>";
		html += msg.message;
		html += "</div>";

		html += "</li>";
		return html;
	},

	//send the message server
	sendMessage: function(e){
		
		e.preventDefault();
		var sender = cri.user.username;
		var receiver = $(this).find('.receiver').data("receiver");
		var message = $(this).find('.message').val();
		
		webClient.send({type: "message", 
			data: {
				message: message, 
				sender: sender, 
				receiver: receiver
			}
		}, function(response){
			
			//get json from server
			var fromServer = JSON.parse(response.data);
			console.log(fromServer)
			var chatMsg = cri.chatMessage(fromServer);

			$(".messages").append(chatMsg);

		});

		

	},

};

$(document).ready(cri.init);

//Login submited
$('body').on('submit', '.loginForm', cri.login);

$('body').on('click', '.friend', cri.clickFriend);

$('body').on('submit', '.messageForm', cri.sendMessage);