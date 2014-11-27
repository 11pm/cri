var cri = {
	templateFolder: 'templates/',
	
	//all details about a user	
	user: {},

	init: function(){
		var local_user = localStorage.getItem('id');
		//User found
		if(local_user){
			cri.user.id = local_user;
		}

		if(cri.isAuth()){
			cri.renderTemplate('main');
			console.log("is auth")
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
			response = JSON.parse(response.data);

			//login worked
			if(response.success === true){

				cri.user.details = response.details;
				cri.user.friends = response.friends;

			}
			else{
				console.log("too bad");
			}
			/*if(response.data != "nope"){
				localStorage.setItem("id", response.data);
				cri.init();
			}*/
		});
	},

	renderTemplate: function(name){

		var templateName = function(name){
			return cri.templateFolder + name + '.html';
		};

		$.ajax({
			url: templateName(name),
			type: "GET",
			success: function(html){
				$('.'+name).html(html);
			} 
		});

	},

	sendMessage: function(text){
		webClient.send({
			message: text
		}, function(response){
			var data = JSON.parse(response.data);
			$('.view').html(data.message);
		});
	}
};

$(document).ready(cri.init);

//Login submited
$('body').on('submit', '.loginForm', cri.login);