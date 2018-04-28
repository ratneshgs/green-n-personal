var app = angular.module('myApp', []);
app.constant('CONFIG', {
    'APP_NAME' : 'Green n Personal',
    'APP_VERSION' : '1.0.0',
    'GOOGLE_ANALYTICS_ID' : '',
    'BASE_URL' : 'http://localhost:8080/',
    'SITE_URL' : 'http://localhost/card/',
    'SYSTEM_LANGUAGE' : ''
})
app.filter('trusted', ['$sce', function ($sce) {
   return $sce.trustAsResourceUrl;
}]);
app.directive("footer", function() {
  return {
    restrict: 'A',
    templateUrl: 'include/footer.html',
    scope: true,
    transclude : false,
    controller: 'headerCtrl'
  };
});
app.directive("header", function() {
  return {
    restrict: 'A',
    templateUrl: 'include/header.html',
    scope: true,
    transclude : false,
    controller: 'headerCtrl'
  };
});
app.controller('headerCtrl', function($scope,$rootScope,$http,CONFIG,$location,$window) { 
	$scope.isLogin = false;

	$scope.checkLogin = function(){
		if(localStorage.getItem("user_data")){
			$scope.isLogin = true;
		}else{
			$scope.isLogin = false;
		}
		event.stopPropagation()
	};
	$scope.checkLogin();
	$scope.doregister = function(frmObj){
		$http({
	      method  : 'POST',
	      url     : CONFIG.BASE_URL+'api/signup', 
	      data 	  : $scope.userData 
	    })
	    .success(function(data) {
	      console.log(data);
	      if (data.response == 0) {
	      	alert(data.message)
	      } else {
	      	$scope.items =  data.data;
	      	console.log(data.token)

	      	localStorage.setItem("user_data",JSON.stringify(data));
	      	$scope.isLogin = true;
	      }
	    });
		event.stopPropagation()
	};
	$scope.dologout = function(){
		localStorage.removeItem("user_data")
		window.location = CONFIG.SITE_URL;
	}
	$scope.dologin = function(frmObj){
		$http({
	      method  : 'POST',
	      url     : CONFIG.BASE_URL+'api/login', 
	      data 	  : $scope.userData 
	    })
	    .success(function(data) {
	      
	      if (data.response == 0) {
	      	alert(data.message)
	      } else {
	      	$scope.items =  data.data;
	      	console.log(data.token)
	      	
	      	localStorage.setItem("user_data",JSON.stringify(data));
	      	$scope.isLogin = true;
	      	$window.location.reload();
	      	//$scope.checkLogin();
	      }
	    });
		event.stopPropagation()
	};
})
app.controller('homeCtrl', function($scope,$rootScope,$http,CONFIG,$location) {
    	

	$scope.login = {};
	$scope.signup = {};
	$scope.header = {name: "header.html", url: "include/header.html"};
	$scope.GethomepageData = function(){
	    $http({
	      method  : 'GET',
	      url     : CONFIG.BASE_URL+'api/frontend/category_mang',  
	    })
	    .success(function(data) {
	      //console.log(data);
	      if (data.errors) {

	      } else {
	      	$scope.items =  data.data;
	      }
	    });
	};
	$scope.GethomepageData();

	
	
});

app.controller('accountCtrl', function($scope,$rootScope,$http,CONFIG,$location,$window) {
	$scope.accept = function(order_id){
		$http({
	      method  : 'POST',
	      url     : CONFIG.BASE_URL+'api/accept', 
	      data 	  : {order_id:order_id} 
	    })
	    .success(function(data) {
	      
	      if (data.response == 0) {
	      	alert(data.message)
	      } else {
	      	$window.location.reload();
	 
	      }
	    });
	}
    $scope.getOrder = function(user_id){
    	$http({
	      method  : 'POST',
	      url     : CONFIG.BASE_URL+'api/getorder', 
	      data 	  : {user_id:user_id} 
	    })
	    .success(function(data) {
	      
	      if (data.response == 0) {
	      	alert(data.message)
	      } else {
	      	$scope.orderitems =  data.data;
	      
	      }
	    });
    }

    $scope.getCustomizeCard = function(email){
    	$http({
	      method  : 'POST',
	      url     : CONFIG.BASE_URL+'api/frontend/getcustomizecard', 
	      data 	  : {email:email} 
	    })
	    .success(function(data) {
	      
	      if (data.response == 0) {
	      	//alert(data.message)
	      } else {
	      	$scope.customitems =  data.data;
	      
	      }
	    });
    }

	$scope.isLogin = false;
	$scope.checkLogin = function(){
		if(localStorage.getItem("user_data")){
			$scope.isLogin = true;
		}else{
			window.location=SITE_URL;
			$scope.isLogin = false;
		}
		event.stopPropagation()
	};
	$scope.checkLogin();
	
	var user_data = JSON.parse(localStorage.getItem("user_data"));
	$scope.user_data = user_data.data[0];
	$scope.getOrder($scope.user_data.id)
	$scope.getCustomizeCard($scope.user_data.email);

});

app.controller('categoryCtrl', function($scope, $rootScope, $http, CONFIG,$location){
	$scope.getParameter = function(params){
	    url = window.location.href;
	    var urlArr = url.split("?");
	    let searchParams = new URLSearchParams(urlArr[1]);

	    return searchParams.get(params) // true
	  //searchParams.get("age") === "1337"; // true
	}
	// var searchObject = $location.search();
	// console.log(searchObject);
	var id  = $scope.getParameter('id');
	console.log(id)
	$http({
      method  : 'GET',
      url     : CONFIG.BASE_URL+'api/frontend/category_mang?id='+id,  
    })
    .success(function(data) {
      //console.log(data);
      if (data.errors) {

      } else {
      	$scope.items =  data.data;
      	$scope.breadcrumb = data.breadcrumb;
      }
    });
});
app.controller('invitationCtrl', function($scope, $rootScope, $http, CONFIG,$location){
	var searchObject = $location.search();
	console.log(searchObject);
	$scope.isLogin = false;


	$scope.checkLogin = function(){
		if(localStorage.getItem("user_data")){
			$scope.isLogin = true;
		}else{
			$scope.isLogin = false;
		}
		event.stopPropagation()
	};
	$scope.checkLogin();

	$('body').on('click','.label_check', function(){
		console.log("DAda");
		$scope.getCheckedFilter();
	})


	$scope.getCheckedFilter = function(){
		var checkedarr = [];
		$("[name^='attr']:checked").each(function(){
		    checkedarr.push("'"+$(this).val()+"'");
		});
		checkedarrString = checkedarr.join();
		$http({
	      method  : 'GET',
	      url     : CONFIG.BASE_URL+'api/frontend/invitation_card_filter?id='+searchObject.id+'&filter_id='+checkedarrString,  
	    })
	    .success(function(data) {
	      //console.log(data);
	      if (data.errors) {

	      } else {
	      	$scope.items =  data.data;
	    
	      }
	    });
	}

	$http({
      method  : 'GET',
      url     : CONFIG.BASE_URL+'api/frontend/invitation_card?id='+searchObject.id,  
    })
    .success(function(data) {
      //console.log(data);
      if (data.errors) {

      } else {
      	$scope.items =  data.data;
      	$scope.filter = data.filter;
      	$scope.breadcrumb = data.breadcrumb;
      }
    });
})
app.controller('formsubmitCtrl',function($scope,$rootScope, $window, $http,$location,CONFIG){  
  $scope.submitForm = function(action){

        $http({
          method  : 'POST',
          url     : CONFIG.BASE_URL+action,
          data    : $scope.loginData,
         })
          .success(function(data) {
            if (data.errors) {
              $scope.errorName = data.errors.name;
              $scope.errorUserName = data.errors.username;
              $scope.errorEmail = data.errors.email;
            } else {
              if(data.response==0){
                  alert(data.message);
              }else{
              if(data.response!=0){
                $scope.message = 'Operation Completed success';
                $window.location.href="./thankyou.html"
              }else{
                alert(data.message);
              }
            }
              
            }
          });
  };

})

app.controller('formCtrl', function($scope, $rootScope, $http, CONFIG,$location){
	var searchObject = $location.search();
	$scope.isLogin = false;
	
	$scope.checkLogin = function(){
		if(localStorage.getItem("user_data")){
			$scope.isLogin = true;
		}else{
			window.location=SITE_URL;
			$scope.isLogin = false;
		}
		event.stopPropagation()
	};
	$scope.checkLogin();
	$http({
      method  : 'GET',
      url     : CONFIG.BASE_URL+'api/frontend/form?id='+searchObject.card_id,  
    })
    .success(function(data) {
      if (data.errors) {

      } else {
      	window.sessionStorage.setItem('formData', JSON.stringify(data.data.data));
      	$scope.items =  data.data;
      }
    });
})
app.controller('invoiceCtrl', function($scope, $rootScope, $http, CONFIG,$location){
	$scope.order_id = 122;
})