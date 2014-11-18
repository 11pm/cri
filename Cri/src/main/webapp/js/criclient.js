$(document).ready(function(){
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

			webClient.sendJson({
				login: {
					username: 'ayy',
					password: 'lmao'
				}
			});
			
			if(this.isAuth()){
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
	};

	cri.init();
});