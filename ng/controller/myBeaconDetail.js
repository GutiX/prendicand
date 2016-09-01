var app = angular.module('myBeaconDetail',['placesService', 'ngTagsInput']);

app.controller('myBeaconDetailController', ['$scope', '$http', '$window', '$state', '$timeout', '$parse', '$location', 'places', 'beacons', function($scope, $http, $window, $state, $timeout, $parse, $location, places, beacons) {
	
	$scope.textInfoMaxLength = 480;
	$scope.beaconNameMaxLength = 25;
	$scope.linkMaxLength = 160;

	$scope.uuidRegex = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
	$scope.passRegex = '^((?!0123).)*$';

	$scope.helpFrame = {};

	$scope.beacons;
	$scope.places;
	$scope.beaconTags = [];
	$scope.errorPass = 0;
	$scope.errorUuid = false;
	//$scope.contentLength = $scope.contentMaxLength;
	$scope.warning = false;
	$scope.removing = false;
	$scope.error = false;

	var map = null;

	var currentValue = {};
	

	/** Initial load **/
	$scope.beacons = beacons;
	$scope.places = places;

	if(!$scope.beacons.selected.id && $window.sessionStorage.beaconSelected) $scope.beacons.selected.id = $window.sessionStorage.beaconSelected;
	$scope.beacons.loadSelectedBeacon(function(valid){
		if(valid) 
		{
			//$scope.contentLength = $scope.contentMaxLength - $scope.beacons.selected.beacon.content.textInfo.length; 
			var placeId = "none";
			if($scope.beacons.selected.beacon.placeInfo && $scope.beacons.selected.beacon.placeInfo.place) placeId = $scope.beacons.selected.beacon.placeInfo.place;
			$scope.places.selected.id = placeId;
			if($scope.places.selected.id != "none")
			{
				$scope.places.loadSelectedPlaceWithCallback(function(valid){
					if(valid && $location.path() == '/myBeaconTechnicalSettings')
					{
						initOnlyMap('placeMap', $scope.places.selected.place.coordinates.latitude, $scope.places.selected.place.coordinates.longitude, $scope.places.selected.place.name);	
					}
				});
			}
			
			if($scope.beacons.selected.beacon.content && $scope.beacons.selected.beacon.content.linkInfo)
			{
				if(!$scope.beacons.selected.beacon.content.linkInfo.link || $scope.beacons.selected.beacon.content.linkInfo.link == '')
				{
					$scope.beacons.selected.beacon.content.linkInfo.link = "http://";
				}
				else if(!$scope.beacons.selected.beacon.content.linkInfo.link.includes('http://') && !$scope.beacons.selected.beacon.content.linkInfo.link.includes('https://'))
				{
					$scope.beacons.selected.beacon.content.linkInfo.link = 'http://' + $scope.beacons.selected.beacon.content.linkInfo.link;
				}
			}
			else
			{
				if(!$scope.beacons.selected.beacon.content) $scope.beacons.selected.beacon.content = {};
				if(!$scope.beacons.selected.beacon.content.linkInfo) $scope.beacons.selected.beacon.content.linkInfo = {};
				$scope.beacons.selected.beacon.content.linkInfo.link = 'http://';
			}
		}
	});

	if($scope.places.list.length == 0)
	{
		$scope.places.initialLoadComplete();
	}		
	/** Initial load **/

	$scope.logBeaconInfo = function() {
		console.log("Log Beacon Info: " + JSON.stringify($scope.beacons.selected.beacon.tag));
	};

	$scope.saveChanges = function() { 

		if(!checkUuid($scope.beacons.selected.beacon.uuid, $scope.uuidRegex) || ($scope.beacons.changes.uuid && !checkUuid($scope.beacons.changes.uuid, $scope.uuidRegex))) $scope.errorUuid = true;
		else $scope.errorUuid = false;
		
		console.log("saveChanges: " + JSON.stringify($scope.beacons.changes));
		//console.log("tags: " + JSON.stringify($scope.beacons.selected.beacon.tag));
		if(!$scope.errorUuid)
		{
			if($scope.beacons.selected.beacon.tag != $scope.beacons.beaconSelectedTags) $scope.beacons.changes.tag = $scope.beacons.selected.beacon.tag;
			
			if(JSON.stringify($scope.beacons.changes) != "{}")
			{
				if($scope.beacons.selected.beacon.tag)
				{
					$scope.beacons.changes.tag.forEach(function(tag){
						if(!tag.rolAuthor)
						{
							tag.rolAuthor = "owner";
						}			
					});
				}

				$scope.beacons.saveChanges(function(response){
					console.log("REsponse: " + JSON.stringify(response)); 
					if (response.updated) 
					{
						$scope.error = false;
						$scope.warning = true;
						$timeout(function(){
							$scope.warning = false;	
						}, 3000);
					}
					else
					{
			    	alert("aquí");
						$scope.error = true;
					}
				});	
			}
		}
	};

	//Para cambiar entre las interfaces beaconInfo y technical settings
	$scope.goToDetail = function(pageName) {
		$scope.beacons.changes = {};
		$state.go(pageName);
	};

	//Guarda el valor actual de un parametro en currentValue para futuras comprobaciones
	$scope.setCurrentValue = function(param) {
		currentValue = $scope.beacons.selected.beacon[param];
	};	

	//Guarda el valor actual de TextInfo en currentValue para futuras comprobaciones
	$scope.setCurrentTextInfoValue = function() {
		if($scope.beacons.selected.beacon.content && $scope.beacons.selected.beacon.content.textInfo)
			currentValue = $scope.beacons.selected.beacon.content.textInfo;
	};

	//Guarda el valor actual de LinkValue en currentValue para futuras comprobaciones
	$scope.setCurrentLinkValue = function() {
		if($scope.beacons.selected.beacon.content && $scope.beacons.selected.beacon.content.linkInfo && $scope.beacons.selected.beacon.content.linkInfo.link)
			currentValue = $scope.beacons.selected.beacon.content.linkInfo.link;
	};

	//Actualiza en la variable que almacena los cambios en la interfaz el valor del parámetro pasado, en caso de ser necesario.
	$scope.change = function(param) {
		console.log("param: " + param + " - value: " + $scope.beacons.selected.beacon[param]);	
		if($scope.beacons.selected.beacon[param] != currentValue)
		{
			$scope.beacons.changes[param] = $scope.beacons.selected.beacon[param];	
			console.log("changes: " + JSON.stringify($scope.beacons.changes));			
		}		
	};

	$scope.changeTextInfo = function() {
		console.log("currentValue: " + currentValue + " - value: " + $scope.beacons.selected.beacon.content.textInfo);	
		if($scope.beacons.selected.beacon.content.textInfo != currentValue)
		{
			if(!$scope.beacons.changes.content) $scope.beacons.changes.content = {};
			$scope.beacons.changes.content.textInfo = $scope.beacons.selected.beacon.content.textInfo;	
			console.log("changes: " + JSON.stringify($scope.beacons.changes));			
		}		
	};

	$scope.changeLink = function() {
		console.log("currentValue: " + currentValue + " - value: " + $scope.beacons.selected.beacon.content.textInfo);	
		if($scope.beacons.selected.beacon.content.linkInfo.link != currentValue)
		{
			if(!$scope.beacons.changes.content) $scope.beacons.changes.content = {};
			if(!$scope.beacons.changes.content.linkInfo) $scope.beacons.changes.content.linkInfo = {};
			if($scope.beacons.selected.beacon.content.textInfo) $scope.beacons.changes.content.textInfo = $scope.beacons.selected.beacon.content.textInfo;
			if($scope.beacons.selected.beacon.content.linkInfo.link === 'http://' || $scope.beacons.selected.beacon.content.linkInfo.link === 'https://')
			{
				$scope.beacons.changes.content.linkInfo.link = '';	
			}
			else
			{
				$scope.beacons.changes.content.linkInfo.link = $scope.beacons.selected.beacon.content.linkInfo.link;
			}
			
			console.log("changes: " + JSON.stringify($scope.beacons.changes));			
		}		
	};

	$scope.changePlace = function() {
		console.log("Change Place 1: " + JSON.stringify($scope.beacons.changes));
		if($scope.places.selected.id != $scope.beacons.selected.beacon.placeInfo.place)
		{
			if($scope.beacons.selected.beacon.placeInfo.place != "none")
			{
				if(!$scope.beacons.changes.placeInfo) $scope.beacons.changes.placeInfo = {};
				if(!$scope.beacons.changes.placeInfo.floor) $scope.beacons.changes.placeInfo.floor = $scope.beacons.selected.beacon.placeInfo.floor;
				if(!$scope.beacons.changes.placeInfo.stability) $scope.beacons.changes.placeInfo.stability = $scope.beacons.selected.beacon.placeInfo.stability;
				$scope.beacons.changes.placeInfo.place = $scope.beacons.selected.beacon.placeInfo.place;
				$scope.places.selected.id = $scope.beacons.selected.beacon.placeInfo.place;
				$scope.places.loadSelectedPlaceWithCallback(function(valid){
					if(valid && $location.path())
					{
						initOnlyMap('placeMap', $scope.places.selected.place.coordinates.latitude, $scope.places.selected.place.coordinates.longitude, $scope.places.selected.place.name);	
					}
				});
			}		
			else
			{
				console.log("hola")
				$scope.beacons.changes.placeInfo = {};
				$scope.places.selected.id = $scope.beacons.selected.beacon.placeInfo.place;
				$scope.places.loadSelectedPlaceWithCallback(function(valid){
					console.log("hola hola");
					if(valid && $location.path() && $scope.beacons.selected.beacon.placeInfo.place != "none")
					{
						initOnlyMap('placeMap', $scope.places.selected.place.coordinates.latitude, $scope.places.selected.place.coordinates.longitude, $scope.places.selected.place.name);	
					}
					else
					{
						console.log("empty");
						$('#placeMap').replaceWith('<div id="placeMap" class="myBeacons-map-place"></div>');
					}
				});
			}	
		}
		console.log("Change Place 2: " + JSON.stringify($scope.beacons.changes));
	};
	
	$scope.changePlaceFloor = function() {
		
		if(!$scope.beacons.changes.placeInfo) $scope.beacons.changes.placeInfo = {};
		$scope.beacons.changes.placeInfo.floor = $scope.beacons.selected.beacon.placeInfo.floor;
		if(!$scope.beacons.changes.placeInfo.stability) $scope.beacons.changes.placeInfo.stability = $scope.beacons.selected.beacon.placeInfo.stability;
		if(!$scope.beacons.changes.placeInfo.place) $scope.beacons.changes.placeInfo.place = $scope.beacons.selected.beacon.placeInfo.place;
		
	};
	
	$scope.changePlaceStability = function() {
		
		if(!$scope.beacons.changes.placeInfo) $scope.beacons.changes.placeInfo = {};
		if(!$scope.beacons.changes.placeInfo.floor) $scope.beacons.changes.placeInfo.floor = $scope.beacons.selected.beacon.placeInfo.floor;
		$scope.beacons.changes.placeInfo.stability = $scope.beacons.selected.beacon.placeInfo.stability;
		if(!$scope.beacons.changes.placeInfo.place) $scope.beacons.changes.placeInfo.place = $scope.beacons.selected.beacon.placeInfo.place;
		
	};
	
	$scope.changePassword = function(changePassword) {
		if(changePassword.newPassword != changePassword.repeatNewPassword)
		{	
			$scope.errorPass = 1;
		}
		else if(changePassword.newPassword < 4)
		{
			$scope.errorPass = 2;
		}
		else
		{
			if(changePassword.newPassword != $scope.beacons.selected.beacon.password)
			{
				$scope.beacons.changePassword(changePassword.newPassword, function(response){
					console.log("Change password response controller: " + JSON.stringify(response));
					$scope.errorPass = 0;	
					$('#changePassword').modal('toggle');
				});
			}
			else
			{
				$scope.errorPass = 0;	
				$('#changePassword').modal('toggle');
			}
		}
	}

	$scope.checkLength = function(objPaht, maxVarLabel) {
		var model = $parse(objPaht);
		var text = model($scope);
		if(text)
		{
			console.log("Cad antes: " + text);
			while(lengthInUtf8Bytes(text) > $scope[maxVarLabel])
			{
				console.log("Cad después: " +  model($scope).length);
				model.assign($scope, text.substr(0, text.length - 1));
				text = model($scope);
			}
		}
	}

	$scope.getBytesLength = function(str, idElement) {
		/*if(str != null)
		{			
  			return lengthInUtf8Bytes(str);
  		}
  		else
  		{
  			return 0;
  		}*/
  		if(!str)
  		{
  			str = $('#' + idElement).val();
  		}

  		return lengthInUtf8Bytes(str);
	}

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

	$scope.havePlace = function() {
		console.log("havePlace: " + !$scope.places.selected.id);	
		return !$scope.places.selected.id;	
	}

	$scope.removeBeacon = function() {
		$scope.beacons.removeBeacon(function(response){
			if(response.removed)
			{
				$('#removeBeacon').modal('toggle');
				$scope.removing = true;
				$timeout(function(){
					$scope.warning = false;	
					$state.go('myBeacons');
				}, 3000);
				
			}
		});
	}

}]);	

var compareTo = function() {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.compareTo;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
          	//console.log('ERROR Values: ' + elem.val() + " - " + $(firstPassword).val());
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('compareTo', v);
          });
        });
      }
    }
};

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

/*app.directive("mapSettings", function($compile, places) {

	var getTemplate = function(){   
    	
        return "<div id='placeMap' show-only-map></div>";
    }; 

    var linker = function(scope, element, attrs){
        element.html(getTemplate()).show();
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

app.directive("showOnlyMap", function($compile, places) {
	return {
      restrict: 'A',
      link: function (scope, elem, attrs, places) {
      	console.log("showOnlyMap: " + JSON.stringify(places));
      }
    }
});*/

app.directive("clickOutside", clickOutside);
app.directive("compareTo", compareTo);

function lengthInUtf8Bytes(str)
{
	var m = encodeURIComponent(str).match(/%[89ABab]/g);
  	return str.length + (m ? m.length : 0);
}

function checkUuid(uuid, regex)
{
	var patt = new RegExp(regex);
	var res = patt.test(uuid);
	console.log("check UUID: " + res);	
	return res;
}