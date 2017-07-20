/*initialize bootstrap tooltip;
must use dynamic initialization instead of static, (document).ready function does't work well with angular route
in which view is partially rendered.*/



var app = angular.module("myApp", ["ngRoute"]);

app.config(['$locationProvider', function($locationProvider){
    
  $locationProvider.hashPrefix('');    
}]);


/******************************************************************/
/*                      ROUTE CONFIG                              */
/*****************************************************************/
app.config(function($routeProvider) {
    $routeProvider
    .when("/dashboard", {
         templateUrl: "cpepj/dashboard.html",
		 controller: "dbCtrl"
    })
    .when("/active", {
        templateUrl: "cpepj/active.html",
		controller:"activeProCtrl"
    })
    .when("/completed", {
        templateUrl: "cpepj/completed.html",
		controller:"CompProCtrl"
    })
	.when("/statistics", {
        templateUrl: "cpepj/statistics.html",
		controller:"reportCtrl"
    })
	.otherwise({redirectTo :"/active"})
});



//LEARNING -- Angular $http POST always convert data to JSON format before send, it doesn't matter 
//which data format you are trying to send, due to the transformRequest() function, so in order to 
//utilize the $.serialize() function, it is a must to overwrite the default transformRequest() function,
//and redefine the content-type in request headers.
//note that there is a transformResponse() function as well;
/*app.config(['$httpProvider', function($httpProvider){

  $httpProvider.defaults.headers.post['Content-Type'] ="application/x-www-form-urlencoded";
  $httpProvider.defaults.transformRequest = function(data){
  if (data ===undefined){

    return data;

  }
 
 else 
 return $.param(data);

  }

}]); */



app.constant('CustomEnums', {
  colName: ['itemnumber','crid','type','summary','requestor','fixer','testteam','products', 'sha', 'component', 'status'],
  itemType: ['Defect Fix', 'New Feature'],
  itemStatus: ['In Progress', 'Fixed', 'Verified', 'Reopen'],
  itemComp: ['UI','EWS','Fax','Scan','Mech','ADF','Copy','IDS','Acumen','Ink Sub','Ink Security','Connectivity','SIPs','OXPD', 
  'Digital Send','LEDM','General Security','Mobility','Datapath','Board Config','ASIC','Power','Boot Loader','OS Related','Others'],
  alertType: {1:'success', 2:'info', 3:'warning', 4:'danger'},
});


app.service('CpePjService', function($interval, CustomEnums){

  //constructor for Item Object
    function ItemProto (arg) {

      this.itemnumber = arg[0],
      this.crid=arg[1],
      this.type = arg[2],
      this.summary = arg[3],
      this.requestor = arg[4],
      this.fixer = arg[5],
      this.testteam = arg[6],
      this.products = arg[7],
      this.sha = arg[8],
      this.component = arg[9],
      this.status = arg[10]
  }



  var ItemObj = function(arg){

    return new ItemProto(arg);

  }

  //function to check the column name for itemlist
  var checkFirstRow = function(r){

    var result=[];
    
    r.forEach(function(v,i){
                if(v.toLowerCase().trim()!== CustomEnums.colName[i])
                  { 
                  result.push(i);
                }
                });

    return result;
  }


  //currying function for $scope.preValidate()
  var curryPreValidate = function (enums){

    return function(input){

    if (input===undefined) {return "";}
    else {
        input = input.trim();
        if(enums.indexOf(input) == -1)
        {
          if (enums == CustomEnums.itemComp)
            return "cell-warning";
          else
            return "cell-error";
        }
        else 
        return "";

        }
        }
  }

  //curring function for $scope.selectRight

  var currySelectRight = function(selector){

    return function(input, index)
            {
            $(selector).eq(index).val(input);
            }

  }

//set table background and header style for different filters
//input is the classname for table and header
  var setTableBg = function (tbl, header) {

        // 10 different colors for tagnames should be more than enough 
            var bgColor=['#2a8a85',' #016FB9', '#5299D3', '#7D53DE', '#247BA0', '#2D3047', '#C3EB78', '#040926', '#87BFFF0', '#C65B7C'];
            var tableList = document.getElementsByClassName(tbl);
            var headerList = document.getElementsByClassName(header);
        /* LEARNING : how to deal with HTMLCollection Object */
        //console.log(Object.getOwnPropertyNames(HTMLCollection.prototype));
        //console.log(Object.prototype.toString.call(tableList));
            for (var i=0; i<tableList.length; i++)
            { 
            tableList.item(i).getElementsByTagName('tr')[0].style.backgroundColor = bgColor[i];
            tableList.item(i).getElementsByTagName('tr')[0].style.color = 'white';
            headerList.item(i).style.color = bgColor[i];
            }
        }


  //alert message emitter -> 4 types: 
  //1. success -> postive response, green
  //2. info->  neutral response, light blue
  //3. warning -> non-critical error, yellow
  //4 .danger -> critical error, red
  /*var emitAlertMsg = function (type, elems, msgHeader, msgBody, count) {
   
   var msgType = CustomEnums.alertType[type];
   var countdown= count || 10;
   var stop = $interval(function(){
    countdown--;
    if(countdown!==0)
    $(elems).html('<div class="alert alert-'+ msgType+'"><strong>'+msgHeader+'</strong>'+ msgBody+
                  '<button class="close"><span>'+countdown+'</span></button></div>');
    else
    $(elems).html('');
   }, 1000, countdown);
   
   $interval.cancel(stop);
  
  }*/

  var emitAlertMsg = function (type, elems, msgHeader, msgBody) {
   
    var msgType = CustomEnums.alertType[type];
    
      $(elems).hide().show('slow').html('<div class="alert alert-'+ msgType+'"><strong>'+msgHeader+'</strong>'+ msgBody+
                    '<button class="close" data-dismiss="alert">&times;</button></div>');
                  
  }

  //check if the fields with enumeration type are correct:
  var checkEnumFields = function (row){

  if (CustomEnums.itemType.indexOf(row[2].trim()) == -1 || CustomEnums.itemStatus.indexOf(row[10].trim()) == -1)
    return false;
  else 
    return true;

  }

    

return {ItemObj: ItemObj,
       checkFirstRow: checkFirstRow,
       curryPreValidate: curryPreValidate,
       currySelectRight: currySelectRight,
       setTableBg: setTableBg,
       emitAlertMsg: emitAlertMsg,
       checkEnumFields: checkEnumFields};

})

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

//ImportService defined here
app.service('ImportService', function(CpePjService,AjaxPrvService, CustomEnums){

//validate function: use FileReader object
//    var alertElems = '#import-item-status';
//    InputId="spreadsheet"
  var uploadValid =0;
  var previewlist = [];

  var validateFile = function(alertElems, inputId, validateCallback){

    var file = document.getElementById(inputId).files[0];
    var itemlist = [];
    var reader = new FileReader();
    var fieldChk = true;
//LEARNING : Note that for IE, if the file is not selected, it will return NULL,
//on all other browsers, it will return UNDEFINED, use  console.log(file); 
//IE: Object.prototype.toString(file) == [object Null];
//Other browsers: Object.prototype.toString(file) == [object Undefined];
   var regFileName = new RegExp(/(.txt)$/);
   console.log(this);
    if (!file)
        {
         CpePjService.emitAlertMsg(4, alertElems, 'Error!',' No file detected');
         return;
        }
    else if(!regFileName.test(file.name))
        {
        CpePjService.emitAlertMsg(4, alertElems, 'Error!',' File is not of .txt format');
        return;
        }
    else {
        reader.readAsText(file);

        reader.onload = function(e){
        var result = e.target.result;
        var rows = result.split('\n');
        //remove the last empty row which is redundant;
        rows.length--;

        try {

           //start the  check on the first row which are column names
           var firstrow = rows[0].split(/\s*\t\s*/);  //ignore the spaces between TAB
           var diff = CpePjService.checkFirstRow(firstrow);

           if (diff.length)
                {
                    throw "Wrong Column name detected, please check column number ="+ (diff[0]+1);
                }
            else {
                //remove the first row which is the column name;
                rows.splice(0, 1);
                rows.forEach(function(value, index){

                var tabs = value.match(/\t/g);

                //code to detect line breaks in item details, line breaks are not allowed 
                //because it will affect row calculation
                if(tabs ===null || tabs.length<10)
                    {

                    throw "Illegal Line Break detected in row"+(index+1);
                    }
                    //code to detect tab, tabs are not allowed as we are using tab-deliminated csv file.
                else if (tabs.length>10){

                    throw "Illegal Tabs detected in row"+(index+1);
                    }

                else {

                    var row = value.split('\t');
                    fieldChk &= CpePjService.checkEnumFields(row);
                    itemlist.push(CpePjService.ItemObj(row));

                     }

                });

                if (fieldChk){

                    CpePjService.emitAlertMsg(1, alertElems, 'Validation Successful!', ' ');
                    uploadvalid = 1;
                  }
                else 
                 {

                    CpePjService.emitAlertMsg(4, alertElems, 'Validation Failed!', ' Wrong values detected in Enumerable fields');
                    uploadvalid = 0;
                 }
            
                previewlist = itemlist;
                //LEARNING -- use $digest instead of $apply here, as we only need to update the child scope not the $rootscope.
                validateCallback(previewlist);

                }
            }
            catch (err){
                 uploadvalid = 0;
                CpePjService.emitAlertMsg(4, alertElems, 'Validation Failed!', err);
            }

           };
         return;

        } 
    };


//reset validate status
var resetValidator = function(alertElems){

      console.log('validatator reset');
      previewlist = null;
      uploadvalid = 0;
      $(alertElems).html('');

      };

      //import item start
var uploadItem = function(alertElems, inputId_jq, pjid, uploadCallback){

          if(uploadvalid ===0){
          //warning(3) message
              CpePjService.emitAlertMsg(3, alertElems, 'Warning!', '  Please Select and Validate input file first');
              return;
          }
          else
          {

          var data = previewlist;
          data.push(pjid);

          var xhrobj = AjaxPrvService.xhrConfig(data, 'POST', '  php/cpepj/ImportItem.php?', {"Content-Type": "application/json"}, 'json');

          AjaxPrvService.xhrPromise(xhrobj).then(function(resp){
      
            if(resp.trim()==='AUTHERROR')
            {    
                CpePjService.emitAlertMsg(4, alertElems, 'Failed! ', 'Authentication failure, please log in first');
            }
          else if(resp.trim()==="SUCCESS")
          {
                  //success(1) message
                CpePjService.emitAlertMsg(1, alertElems, 'Successful!', '  Files uploaded successfully');
                //refresh data and update $scope.
                uploadCallback(); 

            }
            else
            {
                CpePjService.emitAlertMsg(4, alertElems, 'Failed!', '  Database connection error!');
            }

          }, function(status){
        console.log(status);
        CpePjService.emitAlertMsg(4, alertElems, 'Failed!', '  Website connection error!');

        }).finally(function(){

      //reset some parameters regardless of promise status
            previewlist = null;
            uploadvalid = 0;
            $(inputId_jq).val('');

            //alternative -> clone an input box first (without data)
            //$('#spreadsheet').replaceWith($('#spreadsheet').clone(false));
            //$('#spreadsheet').replaceWith($('#spreadsheet').clone(true));
        })

        return;
        }

        };



//function to check if component, type and status are valid values.
//LEARNING : use Curry function to simplify
var preValidate = {

  comp: CpePjService.curryPreValidate(CustomEnums.itemComp),
  type: CpePjService.curryPreValidate(CustomEnums.itemType),
  status: CpePjService.curryPreValidate(CustomEnums.itemStatus),

  empty: function(arg){
      if (arg===undefined) {return "";}
      else if (arg=='' || arg.trim() == '') {return "cell-warning";}
      else {return ""};
      }
  };


  return {preValidate:preValidate,
          uploadItem:uploadItem,
          validateFile:validateFile,
          resetValidator:resetValidator,
          previewlist: previewlist
         };
})


/* Ajax request service */
/* xhrPromise : return a deferred promise to the requestor */
/* xhrConfig: return object with xhrrequest config (data, method, url) */



app.directive('custAlertModal', function(){


       return { restrict: "EA",
                templateUrl: "cpepj/directives/std-alert-modal.html",
                replace: false
              };
  });

app.component('alertModal', {

        templateUrl: "template/alertmodal.html",
  });

  //add-item-modal directive
app.directive('addItemModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-add-new-item.html",
  scope: {
     'addItemSubmit': "&addItemSubmit",
     activePj: "<",
     pjName: "<",
     pjId: "<"
  },
  replace:false

  };

});

app.directive('modifyItemModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-edit-item.html",
  replace:false

  };

});

/*directive definition for add-new-product */

app.directive("stdAddProject", function(){
	
	return {
		
		restrict: "EA",
		templateUrl: "cpepj/directives/std-add-project.html",
		
			
	};
	
});


//import-item-modal directive
app.directive('importItemModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-import-itemlist.html",
  replace:false

  };

});


//display project list for completed project html
app.directive('dispPjList', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-disp-pj-list.html",
  replace:false

  };

});


//display project modal for completed project html;
app.directive('dispPjModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-disp-pj-modal.html",
  replace:false

  };

});

//modify item modal directive for completedproject.html
app.directive('compAddPdModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-comp-add-product.html",
  replace:false

  };

});

//modify item modal directive for completedproject.html
app.directive('compDelPdModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-comp-del-product.html",
  replace:false

  };

});


//display project modal
app.directive('compAddPjModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-comp-add-pj.html",
  replace:false

  };

});

//display project modal
app.directive('compDelPjModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-comp-del-pj.html",
  replace:false

  };

});

//add item modal directive for completedproject.html
app.directive('compAddItemModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-comp-add-item.html",
  replace:false

  };

});

//modify item modal directive for completedproject.html
app.directive('compEditItemModal', function(){

  return {
  restrict: "EA",
  templateUrl: "cpepj/directives/std-comp-edit-item.html",
  replace:false

  };

});




/*****************************************************************/
/*cpeCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('cpeCtrl', function($scope) {

    var today = new Date();
    $scope.dateModel = {enddate: new Date(),   startdate:  new Date( today.setFullYear(today.getFullYear()-1)) };


function init() {
    $("#search-box").hide();


    $(document).on('mouseover','[data-hover="tooltip"]',function(){
      $(this).tooltip('show');
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

    Utility.hookLoginAnchor();

    $scope.currentTab = '';
}


init();
    

$scope.$watch ('currentTab', function(newValue, oldValue){
    
switch (newValue){
        
    case 'dashboardPage': 
          $('#li-db').siblings().removeClass('selected-tab');
        $('#li-db').addClass('selected-tab');
 
       break;
        
      case 'projActive': 
        $('#li-ap').siblings().removeClass('selected-tab');
        $('#li-ap').addClass('selected-tab');
 
       break;
        
       case 'projCompleted': 
        $('#li-cp').siblings().removeClass('selected-tab');
        $('#li-cp').addClass('selected-tab');
 
       break;
      case 'reportPage': 
        $('#li-cr').siblings().removeClass('selected-tab');
        $('#li-cr').addClass('selected-tab');
       break;
   
}}); 
    


    

});



