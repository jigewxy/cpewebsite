/* depends on ang-util.js */

 /*various way of inject constant */
/*use app.constant to define the date pattern 
.constant('datePattern', '/[2][0][0-2][0-9][-]([0][1-9]|[1][0-2])[-]([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])/'); 

//use $rootScope to configure constant, not recommended 
.run(function($){
	$rootScope.datePattern = '/[2][0][0-2][0-9][-]([0][1-9]|[1][0-2])[-]([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])/';
}); */
	
  
/*initialize bootstrap tooltip;*/
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
    Utility.hookLoginAnchor();
   // Utility.topNavHover();
});

//use datepick for the project date information in order to standardize the data.
$(document).on('mouseover',function(){

      $( ".date-picker" ).datepicker(
	  
	  {
	  //here we can't use yyyy-mm-dd, instead it will show year number twice.
	   dateFormat:"yy-mm-dd",
	   maxDate:"+10y",
	   minDate:"-10y"
	  }
	  
	  );
}); 

/*initialize the landing page click;*/
/*$(document).one('mouseover', function(){
	$('#tab-list li:nth-child(2)>a').click();
	console.log('active project clicked');

}); */

/*inject routerProvider and reusableSrcs */
var app=angular.module('srtApp', ['ngRoute', 'reuseableMod']);


/*LEARNING - there is a bug in angularjs 1.6.x, the route now has a prefix '!', so need to customize the prefix here*/
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

//configure the route
app.config(function($routeProvider){$routeProvider
  .when("/dashboard", {templateUrl:"srt/dashboard.html", controller:"srtDashCtrl", controllerAs:"dbCtrl"})
  .when("/active", {templateUrl:"srt/active.html", controller:"srtActiveCtrl", controllerAs:"activeCtrl"})
  .when("/completed", {templateUrl:"srt/completed.html", controller:"srtCompletedCtrl", controllerAs:"compCtrl"})
  .otherwise({redirectTo:"/active"})});

//ajax service
app.factory('AjaxPrvService', function($q, $http){

//LEARNING - defer object must be created inside the returning function, can't be created directly in the factory.
//as factory live in the $rootScope, and defer object will always be there once created.
//this will cause the promose been resolved by previous resolver. 

 var xhrPromise = function(obj){
      var deferred = $q.defer();
      var promise = deferred.promise;
      
      var defaultHeaders = {'Content-Type': 'application/x-www-form-urlencoded'}; //or multipart/form-data
      //var defaultHeaders = {'Content-Type': 'multipart/form-data; boundary=gc0p4Jq0M2Yt08jU534c0p'}; //or application/x-www-form-urlencoded

      var transformReq = {
      //$httpTransformRequest for form data 
      formdata: function (data){

      if (data ===undefined){

        return data;
      }
    
        else 
        return $.param(data);

      },

      //$httpTransformRequest for json object -- used in file uploading
      json: function (data){
      console.log('json object');


    //LEARNING - to strip any properties used by Angular (start with $$, for example: $$hashKey)
    //use Angular.toJson instead of JSON.stringify

        return angular.toJson(data);
      
      },

    // for single value  -- used in getPjdata.php
    singleValue: function(data){

    return $.param({'value':data});

    }

    }

      
      $http({
        url: obj.url+new Date().getTime(),
        method:obj.method,
        data: obj.data,
        headers: obj.headers || defaultHeaders,
        transformRequest : transformReq[obj.trans] || transformReq.formdata
      }).then(function(resp){

      //resove promise
        deferred.resolve(resp.data);

        }, function(error){

      //reject promise
        deferred.reject(error);

      });

      return promise;
      };


    //5 parameters - data, url, method, headers, transformRequest;
    //headers and transformRequest are optional, if not set, will use default config.
    var xhrConfig = function (data, method, url, headers, trans){

    var xhrobj = {};
    xhrobj.data = data;
    xhrobj.method = method;
    xhrobj.url = url;
    xhrobj.headers = headers;
    xhrobj.trans = trans;

    return xhrobj;

    };

      return {xhrPromise: xhrPromise,
              xhrConfig: xhrConfig
              };


    });



/*below service is to ensure the right check box status shown up in modify modal */
app.service('presetChkBox', function(){

    this.presetFunc=function(entry,cond){

    if (cond==true)
    {
    var arr_type =[];
    var arr_comp=[];
    var arr_status=[];

    console.log(entry);
    entry.itemlist.forEach(function(elems){

    arr_type.push(elems['type']);
    arr_comp.push(elems['component']);
    arr_status.push(elems['status']);
    });


    arr_type.forEach(function(type, index){

    $(".type-modify-box").eq(index).val(type);

    });


    arr_comp.forEach(function(comp, index){

    $(".component-modify-box").eq(index).val(comp);

    });

    arr_status.forEach(function(status,index){

    $(".status-modify-box").eq(index).val(status);

    });

    /* set region and state checkbox value */
    $('.region-edit-sel').val(entry['region']);
    $('.state-edit-sel').val(entry['state']);
    }

    else 
    {$('.region-edit-sel').val(entry['region']);
    console.log('nothing happens')};

    }

});

app.component('addPjModal',{
      
     templateUrl: "srt/std-add-pj.html",
     bindings: {addPjObj:"<",
                completed:"<"} //one way binding

});

app.component('deletePjModal', {
        templateUrl: "srt/std-del-pj.html",
        bindings: {delPjObj:"<",
                   entries: "<"} //one way binding
});

app.component('addItemModal',  {
        templateUrl: "srt/std-add-item.html",
          bindings: {addItemObj:"<",
            pjid: "<"} //one way binding

  });

  app.component('editItemModal',  {
        templateUrl: "srt/std-edit-item.html",
          bindings: {editItemObj:"<",
            pjdata: "<",
            itemlist: "<"} //one way binding

  });


app.component('componentOptions', {

        templateUrl: "template/compoptions.html",
});

app.component('statusOptions', {

        templateUrl: "template/statusoptions.html",
  });






/*******************************************/
/** main page controller - srtCtrl **/
/*******************************************/
app.controller('srtCtrl', function ($location){
	

/*$scope.currentRoute= $location.url();
 console.log($scope.currentRoute);
 $rootScope.$watch= function(){
  $scope.digestCount++;
 }*/

	/*below $watch is to resolve the #item-status-sel class not updated issue */
	
	/*$scope.$watch('activeOrComp', function(newValue, oldValue){
	if (newValue == true)
	{ $('.item-status-sel').removeClass('ng-hide');}
    else 
	{$('.item-status-sel').removeClass('ng-show');}
	});*/
	
	
});

