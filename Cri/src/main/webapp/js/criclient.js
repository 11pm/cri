/*
@name: Cri
@author: 11pm, halldor32
@role: Client that handles user actions
*/

var cri = {
	templateFolder: 'templates/',
	
	//all details about a user	
	user: {
		id: -1, 
		username: null,
		password: null, 
		user_created: null,
		friends: [],
		groups: []
	},

	onChat: "",

	/*
	pm: object of private message 
	keys: message, receiver, sender
	------
	group: object of group message
	keys: message, sender, group{name, id}
	*/
	chat: {
		pm: [],
		group: []
	},

	notification: null,

	init: function(){
		//if user has notification api in browser
		if (window.Notification) {
			Notification.requestPermission();

			//check ur persmissions m8
			if(window.Notification.permission !== "granted"){
				Notification.requestPermission();
			}

		}


		//if user has correct credentials
		if(cri.isAuth()){
			cri.renderTemplate('main', $('.view'), cri.user);
		}
		else{
			if(localStorage.getItem("username")){
				cri.renderTemplate('login', $('.view'), {username: localStorage.getItem("username")});				
			}
			else{
				cri.renderTemplate('login', $('.view'), {username: null});			
			}
		}

	},

	//handle responses from server
	onmessage: function(response){
		console.log(response)
		//convert response to JSON
		response = JSON.parse(response.data);
		var type = response.type;
		//the type of response
		switch(type){
			case "login":
				handler.login(response);
				break;
			case "PM":
				handler.message(response);
				break;
			case "group":
				handler.groupmessage(response);
				break;
			default:
				console.log(response)
				break;
		}

	},

	isAuth: function(){
		return this.user.id > 0;
	},

	loginClick: function(e){
		e.preventDefault();
		var that = $(this);
		var username = that.find('.username').val();
		var password = that.find('.password').val();

		//set user on login
		localStorage.setItem("username", username);


		webClient.send({type: "login", data: { username: username, password: password }});
	},

	clickFriend: function(e){

		e.preventDefault();

		var username;
		//if we call from notification
		if(arguments[1]){
			username = arguments[1];
			window.focus();
		}
		else{
			username = $(this).data("username");
		}

		cri.onChat = username;
		
		//get chat message from the user
		var messages = cri.getChatMessages(username);
		console.log(username)
		
		var context = {
			user: username,
			messages: messages
		};

		cri.renderTemplate('chat', $('.chat'), context);

	},

	notify: function(e){
		var notification = $(this)[0];
		cri.clickFriend(e, notification.title);
	},

	clickGroup: function(e){
		e.preventDefault();
		var data = $(this).data();
		console.log(data)

		cri.onChat = data.name;

		var messages = cri.getGroupChatMessages(data.name);
		/*
		users: all the users in the group
		*/
		var context = {
			group: data,
			messages: messages
		};

		cri.renderTemplate('group', $('.chat'), context);
	},

	//change menu items
	changeMenu: function(e){
		var item = $(this).html();

		//remove active class of every
		$('.side-nav li').each(function(){
			$(this).removeClass('active');
		});

		//add active class to selected
		$(this).addClass("active");
		//update menu with content
		$('.list-header').html(item);

		//hide all items
		$('.list ul').each(function(){
			$(this).hide();
		});
		
		//show relevant details
		$('.list').find("."+item).show();
	},

	renderTemplate: function(name, dom, context){

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
					dom.html(template(context));
				else
					dom.html(html);
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

	//Get messages from history for a certain user
	getChatMessages: function(from){
		var you = cri.user.username;
		//a collection of messages to return
		var messages = [];

		cri.chat.pm.forEach(function(obj, index) {

			//get message from the user to you
			var sender = obj.sender == from || obj.sender == you;
			console.log(sender)
			var receiver = obj.receiver == you || obj.receiver == from;
			console.log(receiver)


			if(sender && receiver){
				messages.push(obj);
			}

		});
		return messages;
	},

	//Get messages from history for a certain user
	getGroupChatMessages: function(from){
		var you = cri.user.username;
		//a collection of messages to return
		var messages = [];

		cri.chat.group.forEach(function(obj, index) {
			console.log(obj);
			//get message from the user to you
			// var sender = obj.sender == from || obj.sender == you;
			// console.log(sender)
			var receiver = obj.group.name == cri.onChat || obj.group.name == from;
			console.log(receiver)


			if(receiver){
				messages.push(obj);
			}

		});
		return messages;
	},

	//append message if on correct user
	appendpmChatMessage: function(response){
		var you = cri.user.username;
		console.log(cri.onChat);
		var sender = response.sender == cri.onChat || response.sender == you;
		console.log(sender)
		var receiver = response.receiver == you || response.receiver == cri.onChat;
		console.log(receiver)


		if(sender && receiver){
			var chatMsg = cri.chatMessage(response);
			$(".messages").append(chatMsg);
		}

	},

	//append message if on correct user
	appendGroupChatMessage: function(response){
		var you = cri.user.username;

		var isOpen = response.group.group == cri.onChat;
	
		if(isOpen){
			var chatMsg = cri.chatMessage(response);
			$(".messages").append(chatMsg);
		}

	},

	//send the message server
	sendMessage: function(e){
		
		e.preventDefault();
		var sender = cri.user.username;
		var receiver = $(this).find('.receiver').data("receiver");
		var message = $(this).find('.message');
		
		//Send message to server
		webClient.send({type: "private", 
			data: {
				message: message.val(), 
				sender: sender, 
				receiver: receiver
			}
		});
		//Clear the box
		message.text("");
	},

	sendGroup: function(e){

		e.preventDefault();
		var sender  = cri.user.username;
		var group   = $(this).find('.groupReceiver').data();
		var message = $(this).find('.message');
		
		webClient.send({type: "groupmessage", 
			data: {
				message: message.val(),
				sender: sender,
				group: group
			}
		});

	},

	getFriends: function(){
		var names = [];
		$('.Contacts li').each(function(e){
			console.log($(this).data("username"))
		})

	},

	searchFriends: function(e){

		var searchString = $('#search').val();
		
		//go through
		$('.Contacts')

	}

};

$(document).ready(cri.init);

var body = $('body');
//Login submited
body.on('submit', '.loginForm', cri.loginClick);

//Click on friend in sidebar to open chat window
body.on('click', '.friend', cri.clickFriend);

//Private message
body.on('submit', '.messageForm', cri.sendMessage);

//sidebar menu
body.on('click', '.options .side-nav li', cri.changeMenu);

body.on('click', '.group', cri.clickGroup);

//Group message
body.on('submit', '.groupForm', cri.sendGroup);

//search friends
body.on('keyup', '#search', cri.searchFriends);

//make a custom handler for ws onmessage
websocket.onmessage = cri.onmessage;