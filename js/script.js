var Instagram = {
	// store the application settings 
	config: {},

	BASE_URL: 'https://api.Instagram.com/v1',

	init: function(option){
		option = option || {};
		this.config.client_id = option.client_id;
	},
	// Get a list of popular media
	popular: function(callback){
		var endpoint = this.BASE_URL + '/media/popular?client_id=' + this.config.client_id;
		this.getJSON(endpoint, callback);		
	},
	// Get a list of recently tagged media
	hashtag: function(tag, callback){
		var endpoint = this.BASE_URL + '/tags/' + tag + '/media/recent?client_id=' + this.config.client_id;
		this.getJSON(endpoint, callback);
	},
	// Takes url and callback 
	getJSON: function(url, callback){
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(response){
				if(typeof callback === 'function') callback(response);
			}
		});		
	}

};

Instagram.init({
	client_id: '915efe9fc621402c8000fefcbc087a12'
});

var appendImages = (function(){
	var $instagram = $('#instagram');
	
	return function(response){
		for(var i = 0; i < response.data.length; i++){
			var $img = $('<img>').attr('src', response.data[i].images.low_resolution.url);
			$instagram.append($img);
		}		
	};

})();

Instagram.popular(function(response){
	appendImages(response);
});

var $form = $('#search')
var $inputQuery = $('#query')

$form.submit(function(el){
	el.preventDefault();
	var tagName = $inputQuery.val();
	Instagram.hashtag(tagName, function(response){
		var $instagram = $('#instagram');
		$instagram.empty();
			appendImages(response);
	});
});



