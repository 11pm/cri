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

		//check ur permissions m8
		if(window.Notification.permission !== "granted"){
			Notification.requestPermission();
		}

		//convert response to JSON
	    response = JSON.parse(response.data);
		//the type of response
		switch(response.type){
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

		//send data to server
		webClient.send({type: "login", data: { username: username, password: password }});
	},

	//interaction from client to open chat window, can also be called from notification
	clickFriend: function(e){

		e.preventDefault();

		var username;

		//if we call from notification
		if(arguments[1]){
			username = arguments[1];
			//focus the window when we click the notification
			window.focus();
		}
		else{
			//get the username of clicked user from dataset
			username = $(this).data("username");
		}

		//set the user
		cri.onChat = username;
		
		//get chat message from the user
		var messages = cri.getChatMessages(username);
		
		//create context for template
		var context = {
			user: username,
			messages: messages
		};

		cri.renderTemplate('chat', $('.chat'), context);

	},

	notify: function(e){
		var notification = $(this)[0];
		//open a chat window with the user you click from the notification
		cri.clickFriend(e, notification.title);
	},

	//when a client clicks a group, open it 
	clickGroup: function(e){
		e.preventDefault();
		//get dataset from the group
		var data = $(this).data();

		//set the current chat
		cri.onChat = data.name;

		//get the messages from the history
		var messages = cri.getGroupChatMessages(data.name);
		
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

	//show templates in html
	renderTemplate: function(name, dom, context){

		//create root path filename
		var templateName = function(name){
			return cri.templateFolder + name + '.html';
		};

		//call the template file, and add it to the html
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

	//create a chat message to add to any chat window
	chatMessage: function(msg){
		var html = "<li>";

		html += "<div class='panel'>";
		html += "<h3>" + msg.sender + " - <span class='subheader'>" + msg.timestamp + "</span></h3>";
		html += "<hr>";
		html += "<p>" + msg.message + "</p>";
		html += "</div>";

		html += "</li>";
		return html;
	},

	//Get messages from history for a certain user
	getChatMessages: function(from){
		//the username of the logged in user
		var you = cri.user.username;
		//a collection of messages to return
		var messages = [];

		//go through pm's and filter them
		cri.chat.pm.forEach(function(obj, index) {

			//if the messages are from the certain user || you sent them
			var sender = obj.sender == from || obj.sender == you;
			
			//if the message is to you or the certain user 
			var receiver = obj.receiver == you || obj.receiver == from;
			
			//only add if it went through the filter
			if(sender && receiver){
				messages.push(obj);
			}

		});
		return messages;
	},

	//Get messages from history for a certain chat group
	getGroupChatMessages: function(from){
		
		//a collection of messages to return
		var messages = [];

		//filter groups
		cri.chat.group.forEach(function(obj, index) {
			
			//if the group chat window is the correct group || the group is the certain group
			var receiver = obj.group.group == cri.onChat || obj.group.group == from;
			
			//if it went through the filter
			if(receiver){
				messages.push(obj);
			}

		});
		return messages;
	},

	//append message if on correct user
	appendpmChatMessage: function(response){
		var you = cri.user.username;
		
		//if the sender is the selected chat window or you are the sender
		var sender = response.sender == cri.onChat || response.sender == you;
		
		//if you are the receiver or the receiver is the selected chat window
		var receiver = response.receiver == you || response.receiver == cri.onChat;

		//if it passes filtering, add it to the chat window
		if(sender && receiver){
			var chatMsg = cri.chatMessage(response);
			$(".messages").append(chatMsg);
		}

	},

	//append message if on correct group
	appendGroupChatMessage: function(response){
		var you = cri.user.username;

		//if the correct group is open
		var isOpen = response.group.group == cri.onChat;
	
		//add the messages
		if(isOpen){
			var chatMsg = cri.chatMessage(response);
			$(".messages").append(chatMsg);
		}

	},

	//send the message server
	sendMessage: function(e){
		
		e.preventDefault();

		//data we want to send
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
		message.val("");
	},

	sendGroup: function(e){

		e.preventDefault();

		//data we want to send
		var sender  = cri.user.username;
		var group   = $(this).find('.groupReceiver').data();
		var message = $(this).find('.message');
		
		//send a group messages to the server, the server send to the correct users
		webClient.send({type: "groupmessage", 
			data: {
				message: message.val(),
				sender: sender,
				group: group
			}
		});

	},

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