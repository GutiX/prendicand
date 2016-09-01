var app = angular.module('places', ['placesService', 'beaconsService']);

app.controller('placesController', ['$scope', '$http', '$window', '$state', '$timeout', 'places', 'beacons', function($scope, $http, $window, $state, $timeout, places, beacons) {

	$scope.places = places;
	$scope.firstFloor = 0;
	$scope.lastFloor = 0;
	$scope.searchMap;
	$scope.create = false;
	$scope.warningUpdated = false;
	$scope.warningCreated = false;
	$scope.error = false;
	$scope.errorCreate = false;
	$scope.helpFrame = {};
	
	/*if($scope.places.list.length == 0)
	{*/
		$scope.places.initialLoadComplete();
	//}

	$scope.restore = function() {
		//console.log('setPlaceInfo');
		$scope.error = false;
		$scope.errorCreate = false;
	};

	$scope.showEditPlace = function(index) {
		$scope.places.selected.index = index;
		//places.selected.place = places.list[index];
		$scope.places.loadSelectedPlaceFromList(index);
		$scope.firstFloor = parseInt($scope.places.selected.place.floors[0]);
		var size = $scope.places.selected.place.floors.length - 1;
		$scope.lastFloor = parseInt($scope.places.selected.place.floors[size]);

		//$scope.searchMap = searchMap("mapSearch", $scope.places.selected.coordinates.latitude, $scope.places.selected.coordinates.longitude, $scope.places.selected.name);

		$("#editPlace").modal();
	};

	$scope.showNewPlace = function() {
		$scope.places.newPlaceSelected();
		$scope.firstFloor = 0;
		$scope.lastFloor = 0;
		$scope.create = true;

		$("#editPlace").modal();
	};

	$scope.setPlaceInfo = function(placeInfo) {
		$scope.places.setPlacesFromMap(placeInfo);
		$('#placeAddress').text($scope.places.selected.place.address);
		$('#placeLat').text($scope.places.selected.place.coordinates.latitude);
		$('#placeLong').text($scope.places.selected.place.coordinates.longitude);
		$('#placeId').text($scope.places.selected.place.placeId);
		
	};

	$scope.change = function(param) {
		$scope.places.setParam(param);		
	};

	$scope.changeFloors = function() {
		var from = parseInt($scope.firstFloor);
		var to = parseInt($scope.lastFloor);
		var floors = [];
		for(var i = from; i <= to; i++)
		{
			/*var num = "";
			if(i >= 0 && i < 10) num = '0' + i;
			else if(i > -10 && i < 0) num = '-0' + (i * -1);
			else num = num + i;*/
			var num = i.toString();
			floors.push(num);
		}
		$scope.places.selected.place.floors = floors;
		$scope.places.setParam('floors');
		//console.log("Change: " + JSON.stringify($scope.places.changes));
	};

	$scope.saveChanges = function() {
		if(JSON.stringify($scope.places.changes) != "{}")
		{
			$scope.places.saveChanges(function(response){
				if(response.updated)
			    {
			    	$scope.places.list[$scope.places.selected.index] = $scope.places.selected.place;
			    	$scope.error = false;
			    	$scope.warningUpdated = true;
			    	$timeout(function(){
						$scope.warningUpdated = false;	
						$('#editPlace').modal('toggle');    
					}, 3000);					
			    }
			    else
			    {
			    	$scope.error = true;
			    }  
			});				
		}
		else
		{
			$scope.places.cancelSaveChanges(function(response){			
				$('#editPlace').modal('toggle');
			});
		}
	};

	$scope.cancelSaveChanges = function() {
		$scope.places.cancelSaveChanges(function(response){			
			$('#editPlace').modal('toggle');
		});		
	};

	$scope.createPlace = function() {
		if($scope.places.selected.place.name != "")
		{
			$scope.places.create(function(response){				
				$scope.create = false;
				$scope.errorCreate = false;
				if (response.created) 
				{
					$scope.error = false;
					$scope.warningCreated = true;
			    	$timeout(function(){
						$scope.warningCreated = false;	
						$('#editPlace').modal('toggle');    
					}, 3000);
				}
				else
				{
					$scope.error = true;
				}
			});				
		}
		else
		{
			$scope.errorCreate = true;
		}
	};

	$scope.showHelp = function(help) {
		console.log("showHelp: " + JSON.stringify($scope.helpFrame[help]));
		if(!$scope.helpFrame[help])
		{
			$scope.helpFrame = {};
			$scope.helpFrame[help] = {};
			$scope.helpFrame[help].show = true;
			$scope.helpFrame[help].style = {color: '#ffffff'};	
		}
		else
		{
			$scope.helpFrame = {};
		}
	}

	$scope.removeBeacon = function(beaconId) {
		//console.log("removeBeacon: " + beaconId);
		$scope.places.removeBeacon(beaconId, function(response){
			console.log("removeBeacon response: " + JSON.stringify(response));
		});
	}

	$scope.showConfirmRemovePlace = function(index) {
		$scope.places.selected.index = index;
		$("#removePlace").modal();
	}

	$scope.removePlace = function() {
		//console.log("removeBeacon: " + beaconId);
		//var idPlace = $scope.places.list[$scope.places.selected.index]._id;
		$scope.places.removePlace(function(response){
			console.log("removeBeacon response: " + JSON.stringify(response));
			$('#removePlace').modal('toggle'); 
		});
	}

}]);

app.directive("mapFrame", function($compile, places) {
    
    var getTemplate = function(index){   
    	var place = places.list[index];
        return "<div id='" + place._id + "' class='places-map-display' show-static-map='"+ place._id + "#" + place.coordinates.latitude + "#" + place.coordinates.longitude + "#" + place.name + "'></div>";
    }; 

    var linker = function(scope, element, attrs){
        element.html(getTemplate(attrs.contentAttr)).show();
        $compile(element.contents())(scope);
    };

    return {
        restrict : "E",
        replace: true,
        link: linker,
        scope: {
            content:'='
        }
    };
});

app.directive("showStaticMap", function($compile, places) {
	return {
      restrict: 'A',
      link: function (scope, elem, attrs, places) {
      	var params = attrs.showStaticMap.split('#');
      	staticMap(params[0], parseFloat(params[1]), parseFloat(params[2]), params[3]);                  
      }
    }
});

var clickOutside = function($document, $timeout){
  return {
    restrict: 'A',
    link: function($scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        e.stopPropagation();
      });
      $document.bind('click', function() {
        // magic here.
        if($scope.helpFrame[attr.clickOutside])
        {
        	console.log("Fuera: " + JSON.stringify($scope.helpFrame[attr.clickOutside]));
        	$timeout(function(){ $scope.helpFrame = {} });
        }         
        //console.log("Fuera: " + displayed);
      })
    }
  }
};

app.directive("clickOutside", clickOutside);

function staticMap(divId, latitude, longitude, ptitle) {
  	var myLatLng = new google.maps.LatLng(latitude, longitude);
	var map = new google.maps.Map(document.getElementById(divId), {
		center: myLatLng,
	    zoom: 15,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    draggable: false,
	    scrollwheel: false
	});
	map.setTilt(45);

	var marker = new google.maps.Marker({
	    position: myLatLng,
	    map: map,
	    title: ptitle
	});

	return map;
}
