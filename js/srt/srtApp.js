

 /*various way of inject constant */
/*use app.constant to define the date pattern 
.constant('datePattern', '/[2][0][0-2][0-9][-]([0][1-9]|[1][0-2])[-]([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])/'); 

//use $rootScope to configure constant, not recommended 
.run(function($){
	$rootScope.datePattern = '/[2][0][0-2][0-9][-]([0][1-9]|[1][0-2])[-]([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])/';
}); */


/*inject routerProvider and reusableSrcs */
var app=angular.module('srtApp', ['ngRoute']);


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

        var defaultCacheOption =  true;

      
      $http({
          url: obj.url+new Date().getTime(),
          method:obj.method,
          data: obj.data,
          headers: obj.headers || defaultHeaders,
          transformRequest : transformReq[obj.trans] || transformReq.formdata,
          cache: obj.cache || defaultCacheOption
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
    var xhrConfig = function (data, method, url, headers, trans, cache){

        var xhrobj = {};
        xhrobj.data = data;
        xhrobj.method = method;
        xhrobj.url = url;
        xhrobj.headers = headers;
        xhrobj.trans = trans;
        xhrobj.cache = cache;
        return xhrobj;

      };

        return {xhrPromise: xhrPromise,
                xhrConfig: xhrConfig
                };


    });


  app.service('SrtService', function(AjaxPrvService){

      //type= 'ACTIVE' or 'COMPLETED'
      function refreshData (ctrller, type, callback) {

            var xhrobj = AjaxPrvService.xhrConfig(type, 'POST','php/srt/getpjlist.php?', null, 'singleValue');

            AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 
          //note that .then() create another promise, to avoid confusion, we use callback() here to deal with this aychronization

          if(resp.state.trim() === 'ERROR')
          {
            alert('Database connection error');
            return;
          }

          else {
          ctrller.entries = resp.entries;
          
          if(callback!==undefined)
          callback();
        
          }}, function(resp){
          console.log("something went wrong");
          console.log(resp);
          });

          }


  function setPjData (ctrller, id){

          var xhrobj = AjaxPrvService.xhrConfig(id, 'POST','php/srt/getpj.php?', null, 'singleValue');
          AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 
          //note that .then() create another promise, to avoid confusion, we use callback() here to deal with this aychronization
          if (resp.state.trim()==='ERROR'){
              alert('Database connection error');
          }

          else {
          ctrller.pjdata = resp.pjdata[0];
          ctrller.pjid = ctrller.pjdata.id;
          ctrller.itemlist = resp.itemlist;
          }

          }, function(resp){
          console.log("something went wrong");
          console.log(resp);
        });

      }


          return {
            refreshData: refreshData,
            setPjData: setPjData
          }

          })

    //import-item-modal directive
/*
 app.directive('contextMenu', function($timeout){

  return {
    restrict: 'A',
    scope:{
    contextMenu: '&'
      },
  pirority: 1000,

 link: $timeout(function(scope, ele, attrs){
     return { function(){

        console.log('post-link');
        var target = angular.element(iElement);
        target.on('contextmenu', function(event){
          event.preventDefault();
          console.log(iAttr);
       });
       }

     }


  }, 0)
}
});
*/

app.component('dispPjModal',{
      
     templateUrl: "srt/std-disp-modal.html",
     bindings: {pjdata:"<",
                itemlist:"<",
                renderModal: "<"} //one way binding

});

app.component('addPjModal',{
      
     templateUrl: "srt/std-add-pj.php",
     bindings: {addPjObj:"<",
                completed:"<"} //one way binding

});

app.component('deletePjModal', {
        templateUrl: "srt/std-del-pj.html",
        bindings: {delPjObj:"<",
                   entries: "<"} //one way binding
});

app.component('addItemModal',  {
        templateUrl: "srt/std-add-item.php",
          bindings: {addItemObj:"<",
            pjid: "<"} //one way binding

  });

  app.component('editItemModal',  {
        templateUrl: "srt/std-edit-item.php",
          bindings: {editItemObj:"<",
            pjdata: "<",
            itemlist: "<",
            completed:"<"} //one way binding

  });

 app.component('deleteItemModal',  {
        templateUrl: "srt/std-delete-item.html",
          bindings: {delItemObj:"<",
            itemlist: "<"} //one way binding

  });

app.component('alertModal', {

        templateUrl: "template/alertmodal.html",
  });





/*******************************************/
/** main page controller - srtCtrl **/
/*******************************************/
app.controller('srtCtrl', function ($location){
	


/*initialize bootstrap tooltip;*/
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
    Utility.hookLoginAnchor();

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
	
	
});

