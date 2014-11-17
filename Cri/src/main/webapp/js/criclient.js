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

		if(this.isAuth()){
			console.log('logged in')
		}
		else{
			console.log('not logged in')
		}
	},

	isAuth: function(){
		if(this.userId > 0)
			return true;
		return false;
	},

	renderTemplate: function(name){

		$.ajax({
			url: cri.templateFolder + name,
			type: "GET",
			success: function(html){
				$('.view').html(html);
			} 
		});

	}

};

cri.init();