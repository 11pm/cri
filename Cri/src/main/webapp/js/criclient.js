var cri = {
	templateFolder: 'templates/',
	//user not logged in
	userId: -1,

	init: function(){
		var local_user = localStorage.getItem('id');
		//User found
		if(local_user){
			cri.userId = local_user;
		}

		if(cri.isAuth()){
			cri.renderTemplate('main');
			webClient.send({type: "friends"}, function(response){
				console.log(response)
			});
		}
		else{
			cri.renderTemplate('login');
		}
	},

	isAuth: function(){
		return this.userId > 0;
	},

	login: function(e){
		e.preventDefault();
		var that = $(this);
		var username = that.find('.username').val();
		var password = that.find('.password').val();
		

		webClient.send({
			type: "login",
			data: {
				username: username,
				password: password
			}
		}, function(response){
			//worked MAn
			if(response.data != "nope"){
				localStorage.setItem("id", response.data);
				cri.init();
			}
		});
	},

	renderTemplate: function(name){

		var templateName = function(name){
			return cri.templateFolder + name + '.handlebars';
		}

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