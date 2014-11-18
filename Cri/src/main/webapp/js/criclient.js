var cri = {
	templateFolder: 'templates/',
	//user not logged in
	userId: -1,

	init: function(){

		var local_user = localStorage.getItem('id');
		//User found
		if(local_user != null){
			this.userId = local_user;
		}
			
		if(cri.isAuth()){
			console.log('logged in')
		}
		else{
			console.log('not logged in')
		}
	},

	isAuth: function(){
		return this.userId > 0;
	},

	renderTemplate: function(name){

		$.ajax({
			url: cri.templateFolder + name,
			type: "GET",
			success: function(html){
				$('.view').html(html);
			} 
		});

	},
	sendMessage: function(text){
		webClient.send({
			message: text
		}, function(){

			console.log('sent to server')
		});
	}
};

$(document).ready(cri.init);

$('.send').on('click', function(e){
	cri.sendMessage($('.test').val());
});
