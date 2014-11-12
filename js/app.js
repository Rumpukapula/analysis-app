var analysisApp = angular.module('analysisApp', []);

analysisApp.controller('body', function($scope) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var canvas_left = canvas.offsetLeft;
	var canvas_top = canvas.offsetTop;
	
	$scope.selectedService = {};
	
	$scope.constants = {
		'outerWorld':{
			'start_y':0,
			'max_height':100
		},
		'services': {
			'start_y':100,
			'max_height':window.innerHeight-100-200 // = canvas.height - outerWorld.height - ownSystems.height
		},
		'ownSystems': {
			'start_y':window.innerHeight-200,
			'max_height':200
		},
		'timeLevels':[
			{
				'value':-1,
				'name':'> 3 h'
			},
			{
				'value':180,
				'name':'< 3 h'
			},
			{
				'value':30,
				'name':'< 30 min'
			}
		]
	};
	
	$scope.contacts = [
		{
			'name':'Rudi Belli',
			'phone':'0400 123456',
			'email':'rudi.belli@teknik.fi'
		},
		{
			'name':'Ruokala Täti',
			'phone':'0700 123123',
			'email':'ruokaka@safkaa.fi'
		},
		{
			'name':'Sähkömies',
			'phone':'555-123-456',
			'email':'sahko@energiaa.fi'
		}
	];
	
	$scope.services = [
		{
			'location':'Helsinki',
			'description':'Energiayhtiö',
			'contact': $scope.contacts[2],
			'requirements':[],
			'headerPosition': {
				'left':0,
				'top':0,
				'width':0,
				'height':0
			}
		}
	];
	
	$scope.services.push(
		{
			'location':'Helsinki',
			'description':'Catering-yritys',
			'contact': $scope.contacts[1],
			'requirements':[$scope.services[0]],
			'headerPosition': {
				'left':0,
				'top':0,
				'width':0,
				'height':0
			}
		}
	);
	
	$scope.ownSystems = [
		{
			'location': 'Helsinki',
			'description': 'Tekniikan laitos',
			'contact': $scope.contacts[0],
			'requirements': [$scope.services[0],$scope.services[1]] // add service & system requirements here (list of services)
		}
	];
	
	$scope.incidents = [
		{
			'description':'Powerline destruction',
			'occurred': new Date(2014,11,5,8,30,0,0),
			'affectedSystem': $scope.services[0],
			//'magnitude':5,	// this could be a value between 0-9 or something
			//'duration':72, 	// in hours
			//'trend':0, 		// value from [-1,0,1]
			//'effect':'', 		// descriptive or numeral?
			'contact':$scope.services[0].contact,
			'icon':'img/icon_power_outage'
		}
	];
	$scope.incidents.push(
		{
			'description':'Power outage',
			'occurred': new Date(2014,11,5,9,0,0,0),
			'affectedSystem': $scope.ownSystems[0],
			//'magnitude':5,	// this could be a value between 0-9 or something
			//'duration':72, 	// in hours
			//'trend':0, 		// value from [-1,0,1]
			//'effect':'', 		// descriptive or numeral?
			'contact':$scope.ownSystems[0].contact,
			'icon':'img/icon_power_outage'
		}
	);
	
	function updateServices() {
		// create demo services
		/*
		var el = {
			'x':Math.floor(Math.random()*(canvas.width+1)),
			'y':Math.floor(Math.random()*($scope.constants.services.max_height)+$scope.constants.services.start_y),
			'vx':(Math.random()*0.4 - 0.2),
			'vy':(Math.random()*0.4 - 0.2),
			'r':10,
			'destroy':false
		};
		
		$scope.services.push(el);
		*/
		
		// this is basically demo shit
		/*
		for(var i = 0; i < $scope.services.length; i++) {
			$scope.services[i].x += $scope.services[i].vx;
			$scope.services[i].y += $scope.services[i].vy;
		
			// check view limits
			var middle_x = (canvas.width/2);
			var middle_y = ($scope.constants.services.max_height/2)+$scope.constants.services.start_y;
			if(Math.abs(middle_x - $scope.services[i].x) > middle_x || Math.abs(middle_y - $scope.services[i].y) > ($scope.constants.services.max_height/2)) {
				$scope.services[i].destroy = true;
			}
		}
		*/
		
		// remove services that were marked to be destroyed
		for(var i = $scope.services.length; i > 0; i--) {
			if($scope.services[i-1].destroy) {
				$scope.services.splice(i-1,1);
			}
		}
	}
	
	function drawOuterWorld() {
		var current_x = 0;
		var current_y = $scope.constants.outerWorld.start_y;
		var screen_height_per_system = $scope.constants.outerWorld.max_height;
		// outer world
		ctx.fillStyle = '#0000FF';
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#FF00FF';
		ctx.beginPath();
		ctx.rect(current_x,current_y,canvas.width,screen_height_per_system);
		ctx.fill();
		ctx.stroke();
	}
	
	function drawOwnSystems() {
		var screen_width_per_system = canvas.width / $scope.ownSystems.length;
		var screen_height_per_system = $scope.constants.ownSystems.max_height;
		var current_x = 0;
		var current_y = $scope.constants.ownSystems.start_y; 
		
		// system styling
		ctx.fillStyle = '#FF0000';
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#00FF00';
		
		for(var i = 0; i < $scope.ownSystems.length; i++) {
			ctx.beginPath();
			ctx.rect(current_x,current_y,screen_width_per_system,screen_height_per_system);
			ctx.fill();
			ctx.stroke();
			
			current_x += screen_width_per_system;
		}
	}
	
	function drawServiceDescription(service,text_x,text_y) {
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
			
		if($scope.selectedService==service) {
			ctx.strokeStyle = '#00FF00';
		} else {
			ctx.strokeStyle = '#666666';
		}
		
		// write description
		ctx.font='20px Arial';
		ctx.fillText(service.description, text_x, text_y);
		
		// draw selectbox
		var select_width = ctx.measureText(service.description).width+10;
		var select_height = 40;
		var select_x = text_x-(select_width/2);
		var select_y = text_y-20;
		ctx.beginPath();
		ctx.rect(select_x, select_y, select_width, select_height);
		service.headerPosition.left=select_x;
		service.headerPosition.top=select_y;
		service.headerPosition.width=select_width;
		service.headerPosition.height=select_height;
		ctx.stroke();
		
		// write location
		text_y += 12;
		ctx.font='12px Arial';
		ctx.fillText("("+service.location+")", text_x, text_y);
	}
	
	function drawServices() {
		var screen_width_per_service = canvas.width / $scope.services.length;
		var screen_height_per_service = $scope.constants.services.max_height;
		var height_per_timelevel = screen_height_per_service / $scope.constants.timeLevels.length;
		var current_x = 0;
		var current_y = $scope.constants.services.start_y; 
		
		// system styling
		ctx.lineWidth = 3;
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		
		for(var i = 0; i < $scope.services.length; i++) {
			// draw service borders
			ctx.beginPath();
			ctx.rect(current_x,current_y,screen_width_per_service,screen_height_per_service);
			ctx.stroke();
			
			// write service description
			var text_x = (current_x+(screen_width_per_service/2));
			var text_y = current_y+30;
			drawServiceDescription($scope.services[i],text_x,text_y);
			
			// draw time levels
			ctx.strokeStyle = '#999999';
			for(var j = 0; j < $scope.constants.timeLevels.length; j++) {
				ctx.beginPath();
				ctx.rect(current_x,current_y+j*height_per_timelevel,screen_width_per_service,height_per_timelevel);
				ctx.stroke();
				
				// timelevel texts
				ctx.textAlign = 'start';
				ctx.font='12px Arial';
				ctx.fillText($scope.constants.timeLevels[j].name, current_x+10, current_y+j*height_per_timelevel+24);
				
			}
			
			current_x += screen_width_per_service;
		}
		
		/*
		// demo bullshit
		if($scope.serviceAmount != undefined) {
		if($scope.serviceAmount != null) {
			// draw services
			for(var i = 0; i < $scope.services.length; i++) {		
				var el = $scope.services[i];
				ctx.beginPath();
				ctx.arc(el.x,el.y,el.r,0,2*Math.PI);
				ctx.fillStyle = "#ccddff";
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "#666666";
				ctx.closePath();
				ctx.stroke();
			}
		}
		}
		*/
	}
	
	function drawIncidents() {
		
	}
	
	function mainLoop() {
		var beginTime = new Date().getTime();
		
		// reset identity matrix
		ctx.setTransform(1,0,0,1,0,0);
		// clear canvas
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		
		// update services and incidents
		updateServices();
		
		// draw elements
		drawOuterWorld();
		drawOwnSystems();
		drawServices();
		drawIncidents();
		
		/*
		* Calculate frame execution time and calculate
		* required additional delay to keep fps at 30
		*/
		var endTime = new Date().getTime();
		var delay = 33 - (endTime - beginTime);
		if(delay < 0) delay = 0;
		
		// draw debug
		ctx.textAlign='start';
		ctx.fillStyle = "red";
		ctx.font = "10pt Arial";
		ctx.fillText  ("FPS : "+1000/(endTime - beginTime)+" (Limited to 30)", 10, 20);
		ctx.fillText  ("FPS Delay : "+delay, 10, 35);
		ctx.fillText  ("Items : "+$scope.services.length, 10, 65);
		
		setTimeout(mainLoop, delay);
	}
	
	// setup
	// resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
		canvas.width = window.innerWidth - $('#sidepanel').outerWidth();
		canvas.height = window.innerHeight;

		/*
		* Your drawings need to be inside this function otherwise they will be reset when 
		* you resize the browser window and the canvas goes will be cleared.
		*/
		mainLoop(); 
    }
    resizeCanvas();
	
	// canvas event listeners (e.g. clicks)
	canvas.addEventListener('click', function(event) {
		var x = event.pageX - canvas_left;
		var y = event.pageY - canvas_top;
		
		var clickedServiceElement = false;
		for(var i = 0; i < $scope.services.length; i++) {
			var service = $scope.services[i];
			if(y > service.headerPosition.top && y < service.headerPosition.top + service.headerPosition.height && x > service.headerPosition.left && x < service.headerPosition.left + service.headerPosition.width) {
				clickedServiceElement = true;
				$scope.selectedService = service;
				$scope.$apply();
				break;
			}
		}
		
		if(!clickedServiceElement) {
			$scope.selectedService = {};
			$scope.$apply();
		}
	}, false);
});