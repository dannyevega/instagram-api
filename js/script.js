var $igForm = $('#ig-search');
var $igInputQuery = $('#ig-query');
var $instagram = $('#instagram');
var $igHeading = $('#ig-heading');
var $googleForm = $('#google-search');
var $googleInputQuery = $('#google-query')

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
		var endpoint = this.BASE_URL + '/media/popular?client_id=' + this.config.client_id + '&count=50';
		this.getJSON(endpoint, callback);		
	},
	// Get a list of recently tagged media
	hashtag: function(tag, callback){
		var endpoint = this.BASE_URL + '/tags/' + tag + '/media/recent?client_id=' + this.config.client_id + '&count=50';
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
	
	return function(response){
		for(var i = 0; i < response.data.length; i++){
			var $img = $('<img>').attr('src', response.data[i].images.low_resolution.url);
			$instagram.append($img);
		}		
	};

})();

// Instagram.popular(function(response){
// 	$igHeading.text("Currently popular on Instagram");
// 	appendImages(response);
// 	console.log(response)
// });


// $igForm.submit(function(el){
// 	el.preventDefault();
// 	var tagName = $igInputQuery.val();
// 	Instagram.hashtag(tagName, function(response){
// 		$igHeading.text("Results for #" + tagName);	
// 		$instagram.empty();
// 		appendImages(response);
// 		$igInputQuery.val('');
// 		console.log(response);
// 	});
// });



/** ***************************************************************************** **/




// function searchResults(results, status){
// 	console.log(results); 

// 	for(var i = 0; i < results.length; i++){
// 		var marker = new google.maps.Marker({
// 			position: results[i].geometry.location,
// 			map: map,
// 			icon: results[i].icon
// 		});	
// 	}
// }

// MAYBE USE TO SHOW NEAR IG POSTS WITH BOUNDS 

// function performSearch(){

//  var request = {
//  		bounds: map.getBounds(),
//  		name: "McDonald's"
//   };

// 	service.nearbySearch(request, searchResults);
// }

function initialize(response){ 

	var currentLocation = new google.maps.LatLng(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng)

	var mapOptions = {
	  center: currentLocation,
	  zoom: 12,
	  mapTypeId: google.maps.MapTypeId.ROADMAP  	
	}

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var marker = new google.maps.Marker({
		position: currentLocation,
		map: map,		
	});

	service = new google.maps.places.PlacesService(map);	

	// google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);

	// $('#refresh').click(performSearch);

}


var Google = {	

	getLocation: function(callback){
		this.getJSON(callback)		
	},

	getJSON: function(callback){
		var BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json?address=';		
		var googleUserInput = $googleInputQuery.val();		
		$.ajax({
			type: 'GET',
			url: BASE_URL + googleUserInput,
			dataType: 'json',
			success: function(response){
				if(typeof callback === 'function') callback(response);
			}
		});		
	}
};

$googleForm.submit(function(el){
	el.preventDefault()
	Google.getJSON(function(response){
		initialize(response);
	});	
});


