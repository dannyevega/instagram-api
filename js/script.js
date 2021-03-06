var $igForm = $('#ig-search');
var $igInputQuery = $('#ig-query');
var $googleForm = $('#google-search');
var $googleInputQuery = $('#google-query');
var $instagram = $('#instagram');
var $googleMap = $('#map-canvas');
var $igHeading = $('#ig-heading');
var $locIgPost = $('#location-ig-posts');
var latitude;
var longitude;

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
	igLocation: function(lat, lng, callback){
		var endpoint = this.BASE_URL + '/media/search?&lat=' + lat + '&lng=' + lng + '&distance=1000&client_id=' + this.config.client_id;
		this.getJSON(endpoint, callback);
	},
	getMediaId: function(){
		// var endpoint = this.BASE_URL + '/media/' + mediaId + '?client_id=' + this.config.client_id;	
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
	
	return function(response, element){
		var elements = [];
		for(var i = 0; i < response.data.length; i++){
			var $img = $('<img class="photo">').attr('src', response.data[i].images.low_resolution.url);
			var $igLink = $("<a target='_blank'>").attr("href", response.data[i].link).append($img);	
			var $avatar = $('<img class="avatar">').attr('src', response.data[i].user.profile_picture);
			var $div = $('<div class="photo-item">').append($igLink, $avatar);		
			elements.push($div);						
		}		
		element.append(elements);
	};

})();

Instagram.popular(function(response){
	$googleMap.hide();
	$igHeading.text("Currently popular on Instagram");
	appendImages(response, $instagram);
});


$igForm.submit(function(el){
	el.preventDefault();
	$googleMap.hide();
	$locIgPost.hide();
	var tagName = $igInputQuery.val();
	Instagram.hashtag(tagName, function(response){
		$igHeading.text("Results for #" + tagName);	
		$instagram.empty();
		appendImages(response, $instagram);
		$igInputQuery.val('');
	});
});

/** ***************************************************************************** **/


function initializeMap(response){ 

	var currentLocation = new google.maps.LatLng(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);

	latitude = response.results[0].geometry.location.lat;
	longitude = response.results[0].geometry.location.lng;

	var mapOptions = {
	  center: currentLocation,
	  zoom: 12,
	  mapTypeId: google.maps.MapTypeId.ROADMAP  	
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var marker = new google.maps.Marker({
		position: currentLocation,
		map: map,		
	});

	service = new google.maps.places.PlacesService(map);	

	var input = document.getElementById('google-query');

	var autocomplete = new google.maps.places.Autocomplete(input);

}

var Google = {	

	getLocation: function(callback){
		this.getJSON(callback);		
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
	el.preventDefault();
	$googleMap.show();
	Google.getJSON(function(response){
		initializeMap(response);	
		var tagName = $googleInputQuery.val();
		$googleInputQuery.val('');
		if(tagName.length > 70){
			tagName = tagName.substr(0, 70) + "...";
			}	
		$igHeading.text('Instagram posts around ' + tagName);
		
		Instagram.igLocation(latitude, longitude, function(response){	
			$instagram.empty();
			$locIgPost.empty();
			$locIgPost.show();
			appendImages(response, $locIgPost);	
		});
	});	
});


