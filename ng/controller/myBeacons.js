var app = angular.module('myBeacons',['placesService', 'beaconsService']);

app.controller('myBeaconsController', ['$scope', '$http', '$window', '$state', 'places', 'beacons', function($scope, $http, $window, $state, places, beacons) {
	
	$scope.beacons;
	$scope.places;
	$scope.tags = [];
	$scope.sortedBy = 'beacon.currentContent.creationDate';	
	$scope.sign = '-';
	$scope.placeFilter = '';
	$scope.tagFilter = '';
	$scope.textFilter = '';

	/** Initial load **/
	$scope.beacons = beacons;
	$scope.beacons.initialLoad();

	$scope.places = places;
	
	//if($scope.places.list.length == 0)
	//{
		$scope.places.initialLoadComplete();
	//}	


	/** Initial load **/

	/** Filter **/
	$scope.beaconFilter = function(element) {
		return ((element.beacon.placeInfo && element.beacon.placeInfo.place && element.beacon.placeInfo.place.name == $scope.placeFilter) || $scope.placeFilter == '') &&
			((element.beacon.tag && containTag(element.beacon.tag, $scope.tagFilter)) || $scope.tagFilter == '') &&
			((element.beacon.name && element.beacon.name.toLowerCase().indexOf($scope.textFilter) >= 0) 
				|| (element.beacon.content && element.beacon.content.textInfo && element.beacon.content.textInfo.toLowerCase().indexOf($scope.textFilter) >= 0) 
				|| $scope.textFilter == '')
			 ? true : false;
	};

	$scope.setPlaceFilter = function(place) {
		$scope.placeFilter = place;
	};

	$scope.setTagFilter = function(tag) {
		console.log("Places service: " + JSON.stringify($scope.places));
		$scope.tagFilter = tag;
	};

	$scope.setSearchFilter = function(text) {
		$scope.textFilter = text.toLowerCase();
	};
	/** End filter **/

	$scope.sort = function(attr){
	  	var attrSign = '-' + attr;
	  	if($scope.sortedBy === attr){ $scope.sortedBy = '-' + attr; }
	  	else if($scope.sortedBy === attrSign){ $scope.sortedBy = ''; }
	  	else { $scope.sortedBy = attr; }
  	};

  	$scope.showBeaconDetail = function(beaconId){
  		beacons.selected.id = beaconId;
  		$window.sessionStorage.beaconSelected = beaconId;
  		$state.go('myBeaconContent');
  	};

  	function containTag(tags, tag)
  	{
  		var contained = false;
  		var i = 0;
  		while (!contained && i < tags.length)
  		{
  			contained = tags[i].name == tag;
  			i++;
  		}
  		return contained;
  	}

}]);