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
	isMobile: false,
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

	// notification event listeners
	notification: null,

	init: function(){
		cri.handleResize();
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
		
		//remove unread messages
		cri.removePill(username);

		//get chat message from the user
		var messages = cri.getChatMessages(username);
		
		//create context for template
		var context = {
			user: username
		};

		cri.renderTemplate('chat', $('.chat'), context);

		//show messages to user
		messages.forEach(function(obj) {
			$('.messages').append(cri.pmChatMessage(obj));
		});

		//create the canvas in the chat
		cri.createImage(username, $('.profileImage'));

	},

	//do something when user clicks the notification
	notifypm: function(e){
		var notification = $(this)[0];
		//open a chat window with the user you click from the notification
		cri.clickFriend(e, notification.title);

		notification.close();
	},

	//Shows pm notification
	showpmNotification: function(response){
		
		cri.notification = new Notification(response.sender, {
			body: response.message
		});	
		
		//create notification evt listener dynamicly
		cri.notification.onclick = cri.notifypm;

		//play audio
		$('.notification-sound')[0].play();

	},

	//when a client clicks a group, open it 
	clickGroup: function(e){
		e.preventDefault();

		var data;
		// console.log(arguments)
		//if we call from notification
		if(arguments[1]){
			console.log(arguments);
			data = arguments[1];
			//focus the window when we click the notification
			window.focus();
		}
		else{
			//get the group of clicked user from dataset
			data = $(this).data("name");
		}

		//set the current chat
		cri.onChat = data;

		//get the messages from the history
		var messages = cri.getGroupChatMessages(data);
		
		var context = {
			group: data
		};

		cri.renderTemplate('group', $('.chat'), context);

		//show messages to user
		messages.forEach(function(obj) {
			$('.messages').append(cri.groupChatMessage(obj));
		});

	},

	notifyGroup: function(e){
		var notification = $(this)[0];

		console.log(notification);
		var groupNotification = {
			name: notification.title
		};

		//open a chat window with the user you click from the notification
		cri.clickGroup(e, notification.title);
	},

	//Shows notification
	showGroupNotification: function(response){
		console.log(response);
		cri.notification = new Notification(response.group, {
			body: response.message
		});	
		
		// console.log(noti)
		//create notification evt listener dynamicly
		cri.notification.onclick = cri.notifyGroup;

		//play audio
		$('.notification-sound')[0].play();

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
			async: false,
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

	//create a chat message to add to any pm window
	pmChatMessage: function(msg){
		var html = "<li>";
		var you  = cri.user.username;

		//if you send the message
		if(msg.sender == you){
			html += "<div class='panel fromYou small-8 columns small-push-1'>";	
		}
		else{
			html += "<div class='panel toYou small-8 columns'>";
		}

		html += "<p>" + msg.message + "</p>"; 
		html += "</div>";

		html += "<div class='small-3 columns'>";
		html += "<span class='timestamp'>" + msg.timestamp + "</span>";

		html += "</div>";
		html += "</li>";
		return html;
	},

	groupChatMessage: function(msg){
		var html = "<li>";
		var you  = cri.user.username;
		
		//if you send the message
		if(msg.sender == you){
			html += "<div class='panel fromYou small-8 columns small-push-1'>";	
		}
		else{
			html += "<div class='panel toYou small-8 columns'>";
		}
		html += "<h5>" + msg.sender + "</h5>";
		html += "<p>" + msg.message + "</p>"; 
		html += "</div>";

		html += "<div class='small-3 columns'>";
		html += "<span class='timestamp'>" + msg.timestamp + "</span>";

		html += "</div>";
		html += "</li>";
		return html;
	},

	addUnreadPm: function(response){
		var unreadFromUser = cri.getChatMessages(response.sender);

		//find the person in the sidebar 
		$('.side-nav.Contacts li').each(function(obj){
			var username = $(this).data("username");
			var unread = response.sender == username;
			
			if (unread){
				//send the value of span.pill
				cri.createPill($(this).find(".pill"));
			}
			
		});

	},

	//create the unread pill
	createPill: function(dom){
		dom.fadeIn(400);
		var totalUnread = dom.html();
		//if there is no pill, create one with 1 as value
		if(totalUnread.length === 0){
			dom.html("1");
		}
		//if there is a pill, increment it by one
		else{
			//get the last number
			var newNumber = parseInt(totalUnread);
			//increment by one
			newNumber+=1;
			//display the new number
			dom.html(newNumber).fadeIn(300);
		}
	},

	//when user opens chat from somebody, we remove the pill notification
	removePill: function(username){

		$('.side-nav.Contacts li').each(function(obj){
			var loopUser = $(this).data("username");
			
			//if the pill is from the user, remove it
			if(loopUser == username){
				var pill = $(this).find(".pill");
				pill.html("");
				pill.hide();
			}
		});

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
			var receiver = obj.group == cri.onChat || obj.group == from;
			
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
			var chatMsg = cri.pmChatMessage(response);
			$(".messages").append(chatMsg).fadeIn(400);
		}

	},

	//append message if on correct group
	appendGroupChatMessage: function(response){
		var you = cri.user.username;

		//if the correct group is open
		var isOpen = response.group == cri.onChat;
	
		//add the messages
		if(isOpen){
			var chatMsg = cri.groupChatMessage(response);
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
		
		//check if the message is empty
		if(message.val().length === 0){
			return false;
		}

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
		var group   = $(this).find('.groupReceiver').data("group");
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

	//create a canvas picture with user letter
	createImage: function(username, dom){

		var colors = ["red", "green", "blue"];

		var dimensions = [50, 50]; //X,Y
		var x = dimensions[0],
		    y = dimensions[1];
		var letter 	   = username.charAt(0).toUpperCase();

		var canvas     = document.createElement('canvas');
		canvas.width   = x;
		canvas.height  = y;

		//get a random color for bg
		canvas.getContext("2d").font = "35px Open Sans";
		//add a color to the rect
		canvas.getContext("2d").fillStyle = colors[Math.floor(Math.random()*colors.length)];
		//create the rect
		canvas.getContext("2d").fillRect(0,0,x,y);
		//add text color
		canvas.getContext("2d").fillStyle = "white";
		//show the text
		canvas.getContext("2d").fillText(letter, 11, 34);
		
		$(dom).html(canvas);
	},

	handleResize: function(){
		var isMobile = $(window).width() < 640;
		cri.isMobile = isMobile;

		if(isMobile){
			//if user in mobile click a user or a group take him there
			$('body').on('click', '.side-nav li', function(e){
				body.animate({
					scrollTop: 0
				}, 300);
			});
		}

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

//make a custom handler for ws onmessage
websocket.onmessage = cri.onmessage;

$(window).resize(function(){
	cri.isMobile = $(window).width() < 640;
	cri.handleResize();
});