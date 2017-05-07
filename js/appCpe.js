/*initialize bootstrap tooltip;
must use dynamic initialization instead of static, (document).ready function does't work well with angular route
in which view is partially rendered.*/

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

/*below function make sure the default OJ pro content (completedproject route)are shown when first time load*/
$(document).one('mouseover',function(){
	
setTimeout("$('.tab-list').first().find('a').click()", 200);

});

/*below jquery function doesn't work, so rewrite the loadOjpro() function */
/*$("#completed-proj").on('click', function(){
	console.log("completed project clicked");
setTimeout("$('.tab-list').first().find('a').click()", 200);
});*/

/*below function make sure the default OJ pro content (completedproject route) is shown when page reloaded. delay is needed for the DOM loading.*/
var loadOjpro = function () {

setTimeout("$('.tab-list').first().find('a').click()", 200);	
	
};


/*validate the date picker, need to disable the input if dates is not applicable. */

function inputBoxValidate(event){

 var id = event.target.id;

 
 /* begin and end position can be both negative and positive, position mattters here */
var temp = '#'+ id.slice(0,-6)+ '-input';

if ($("#"+id).prop("checked")==true) {

//set to readonly will not work for datepicker - need to turn off the eventlistener and add it back.
$(temp).prop("value", "N/A");
$(temp).prop("disabled", true);
//$(temp).off("focus");
}

else 
{
$(temp).prop("value", null);
$(temp).prop("disabled", false);
//$(temp).on("focus",datepicker());

}


if ($(temp).prop("value") == "N/A")
{
	$("#"+id).prop("checked", true);
}
	

}

var app = angular.module("myApp", ["ngRoute"]);

app.config(['$locationProvider', function($locationProvider){
    
  $locationProvider.hashPrefix('');    
}]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/dashboard", {
         templateUrl: "cpeprojects/dashboard.html",
		 controller: "dbCtrl"
    })
    .when("/activeproject", {
        templateUrl: "cpeprojects/activeproject.html",
		controller:"activeProCtrl"
    })
    .when("/completedproject", {
        templateUrl: "cpeprojects/completedproject.html",
		controller:"CompProCtrl"
    })
	.when("/cpereport", {
        templateUrl: "cpeprojects/cpereport.html",
		controller:"reportCtrl"
    })
	.otherwise({redirectTo :"/dashboard"})
});


/*****************************************************************/
/* CompProCtrl - controller for completedproject.html */
/*****************************************************************/
app.controller('CompProCtrl', function ($scope, $http, $window) {


var init= function () {

$("#search-box").hide();
$scope.$parent.currentTab = 'projCompleted';

};

init();

$scope.database= 'data/pjcompleted/ojpro_completed.json';

$scope.tabs = [

{link: '#ojpro-projects', label: 'Officejet Pro'},
{link: '#oj-projects', label:'Officejet'},
{link: '#pws-projects', label:'Page Wide'},
{link: '#ics-projects', label:'Consumer'},
{link: '#mobile-projects', label:'Mobile'}

];

/*viewcontentloaded can be used to set event during initialization */
/*$scope.$on('$viewContentLoaded', function(event){

console.log("ojpro initialized");
$(".tab-list").first().find('a').click();

});*/

$scope.selectedTab= $scope.tabs[0];

$scope.setSelectedTab= function(tab){
$scope.selectedTab=tab;
/*reset delPressed variable in delete modal */
$scope.delPressed = false;
switch (tab.label)
{
 case 'Officejet Pro':
 $scope.database= 'data/pjcompleted/ojpro_completed.json';
 break;
  case 'Officejet':
 $scope.database= 'data/pjcompleted/oj_completed.json';
 break;
  case 'Page Wide':
 $scope.database= 'data/pjcompleted/pws_completed.json';
 break;
  case 'Consumer':
 $scope.database= 'data/pjcompleted/ics_completed.json';
 break;
   case 'Mobile':
 $scope.database= 'data/pjcompleted/mobile_completed.json';
 break;

}

$http.get($scope.database, {headers:{"cache-control":"no-cache"}}).then(function(response){

$scope.productdata=response.data;
}, function(response){

$scope.content="something went wrong";
})
}

$scope.tabClass=function(tab){
if ($scope.selectedTab==tab)
{return "active";}
else {
return "";
}
}

//set the database for different buttons
$scope.setDatabase=function(product,project,item){

$scope.projectdata= item;
$scope.projectname= project;
$scope.productname= product;

}


$scope.trackDelBoxChange = function () {

$scope.delPressed = false;

}

$scope.deleteButtonPressed = function () {

$scope.delPressed = true;

}


$scope.setProjStore = function (selProduct) {

product= selProduct.trim();
$scope.projStore=$scope.productdata[product]['projectlist'];
$scope.projectDelPressed = false;
$scope.selProject = null;

}

$scope.projDelPressed = function () {

$scope.projectDelPressed = true;

}

$scope.trackProjectSelChange = function () {

$scope.projectDelPressed = false;

}

//below function determine the display of the DELETE button in delete-item-modal
$scope.checkboxValue = [];
$scope.checkboxChecked = function() {

var sum=0;
var arr_length = $scope.checkboxValue.length;

for (var i=0; i<arr_length; i++)
{
if ($scope.checkboxValue[i]=== undefined)
{
$scope.checkboxValue[i]=0;
}

sum += $scope.checkboxValue[i];

}


if (sum >0)
return true;
else
return false;

}

//function to display the type for each item

$scope.selectRightType =function(type, index)
{

//use .val() to assign the stored type to the select option, alternative is to add attribute 'selected' to the member option.
$(".type-modify-box").eq(index).val(type);

//add VALUE attribute in order to submit the table data through AJAX call, because innerHTML of select box return all options hence not useful.
//$(".type-modify-box").eq(index).attr("value", type);
}

//function to display the right component for each item 

$scope.selectRightcomponent =function(comp, index)
{

//use .val() to assign the stored status to the select option, alternative is to add attribute 'selected' to the member option.
$(".component-modify-box").eq(index).val(comp);

//add VALUE attribute in order to submit the table data through AJAX call, because innerHTML of select box return all options hence not useful.
//$(".component-modify-box").eq(index).attr("value", comp);
}

/* no longer needed as a new route is used */
/*$scope.genReport= function () {
$window.open('cpe_projects.html#/cpereport', '_blank');
} */

});


/*****************************************************************/
/*activeProCtrl - controller for activeproject.html
/*****************************************************************/
app.controller('activeProCtrl', function($scope, $http, $window, $timeout) {

	$scope.projectobjs =[];

var init= function () {

$("#search-box").show();
$scope.$parent.currentTab = 'projActive';

};

init();

//Prevent cache while reading the json file, as the "Last-Modified" response header always have latency, so browser doesn't load the updated data.
  $http.get("data/dashboard.json", { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response){
	//$http.get("data/dashboard.json", {cache:false}).then(function(response){
	$scope.statuscode=response.status;
	$scope.projectinfo=response.data;

	var i;
	for (i=0; i<$scope.projectinfo.dates.length;i++)
		{
		// use eval() to convert the string Date.UTC() to a date value;
		$scope.projectinfo.dates[i].low = moment(eval($scope.projectinfo.dates[i].low)).format("YYYY-MM-DD");
		$scope.projectinfo.dates[i].high = moment(eval($scope.projectinfo.dates[i].high)).format("YYYY-MM-DD");

		} 

	

	$scope.projectlist=response.data.category;  //read active project list
    
    /*get project objects only for keyword filter use */
    angular.forEach($scope.projectlist, function(value){

    	var temp_obj ={};

    	temp_obj=response.data[value];
    	temp_obj.pjname= value;

    $scope.projectobjs.push(temp_obj);


    
  })

                    
	}, function(response)
	{
	$scope.content="something went wrong";
	})



$scope.selDatabase = function(pname) {

  $scope.startdate=$scope.projectinfo[pname].datestart;
  $scope.fcdate=$scope.projectinfo[pname].datefc;
  $scope.rcdate=$scope.projectinfo[pname].daterc;
  $scope.vrdate=$scope.projectinfo[pname].datevr;
	  
  $scope.projectname=pname;
  $scope.projectnameindex=$scope.projectlist.indexOf(pname);

  //check if the project data is available or not, if not available, reset the scope variable to NULL;
  if (angular.isUndefined($scope.projectinfo[pname]))
  {$scope.projectdata=null;
   $scope.projectitems=null;
   return;}
  else
  {
  $scope.projectdata=$scope.projectinfo[pname];
  $scope.projectitems=$scope.projectinfo[pname].itemlist;
}

//now identify the current project cycle
}


//function to display the different milstones for each project 
$scope.currentMilestone =function(pname,index) {
 
 //need a multiplier (x3) to browse the array
  //$scope.startdate=$scope.projectinfo[project].datestart;
  $scope.startdate=$scope.projectinfo.dates[index*3].low;
  $scope.fcdate=$scope.projectinfo.dates[index*3].high;
  $scope.rcdate=$scope.projectinfo.dates[index*3+1].high;
  $scope.vrdate=$scope.projectinfo.dates[index*3+2].high;
  
  
  var currentdate= moment().format("YYYY-MM-DD");
   
if (currentdate > $scope.vrdate)
  { 
  $(".vr-date").eq(index).addClass("project-completed"); 
  } 
 else if (currentdate > $scope.rcdate && currentdate <=$scope.vrdate)
  {  
  $(".vr-date").eq(index).addClass("active-milestone"); 
  }
	 
	else if (currentdate >= $scope.fcdate && currentdate <=$scope.rcdate )
  {  
  $(".rc-date").eq(index).addClass("active-milestone"); 
  }
 	 
	else if (currentdate >= $scope.startdate && currentdate <=$scope.fcdate)
  { 
   $(".fc-date").eq(index).addClass("active-milestone"); 
// $('.fc-date:nth-child(4)').addClass("active-milestone"); 
// nth-child() is not working here, need to figure out why.
  }
  else 
  {
     $(".start-date").eq(index).addClass("project-not-started"); 
  }
  
  //piggy-bag the function to display different colors for major/minor roll
  
  if ($scope.projectinfo[pname]['cat']=='Minor roll')
  { $(".project-panel").eq(index).removeClass("panel-primary"); 
   $(".project-panel").eq(index).addClass("panel-info");}
  

  }
  
  
//functions to render modals to add and mofidy

$scope.renderAddModal=function(){

 
$("#add-item-modal").modal("show");
}

$scope.renderModifyModal=function(){

$("#modify-item-modal").modal("show");
}

$scope.renderDeleteModal=function(){

//below is to make sure the "Delete" Button is shown instead of "Confirm" after user close the modal without confirm
$("#delete-item-modal").modal("show");
}

$scope.renderProjDeleteModal=function(){

$scope.deletePressed=false;
//below is to make sure the "Delete" Button is shown instead of "Confirm" after user close the modal without confirm
$("#delete-project-modal").modal("show");
}

//functions to display the colors for different project status
  
$scope.setColor=function(status){

// colors are defined in cpe_projects.css for different classes.
switch (status)

{
case "In Progress":
    return "iteminprogress";
	
case "Fixed":
    return "itemfixed";
	
case "Verified":
    return "itemverified";
	
default:

return "bg-default";

}}


//function to display the status for each item 

$scope.selectRightStatus =function(currentstatus, index)
{

//use .val() to assign the stored status to the select option, alternative is to add attribute 'selected' to the member option.
$(".status-modify-box").eq(index).val(currentstatus);

//add VALUE attribute in order to submit the table data through AJAX call, because innerHTML of select box return all options hence not useful.
//$(".status-modify-box").eq(index).attr("value", currentstatus);
}



//function to display the type for each item

$scope.selectRightType =function(type, index)
{

//use .val() to assign the stored type to the select option, alternative is to add attribute 'selected' to the member option.
$(".type-modify-box").eq(index).val(type);

//add VALUE attribute in order to submit the table data through AJAX call, because innerHTML of select box return all options hence not useful.
//$(".type-modify-box").eq(index).attr("value", type);
}

//function to display the right component for each item 

$scope.selectRightcomponent =function(comp, index)
{

//use .val() to assign the stored status to the select option, alternative is to add attribute 'selected' to the member option.
$(".component-modify-box").eq(index).val(comp);

//add VALUE attribute in order to submit the table data through AJAX call, because innerHTML of select box return all options hence not useful.
//$(".component-modify-box").eq(index).attr("value", comp);
}


//below function determine the display of the DELETE button in delete-item-modal
$scope.checkboxValue = [];
$scope.checkboxChecked = function() {

var sum=0;
var arr_length = $scope.checkboxValue.length;

for (var i=0; i<arr_length; i++)
{
if ($scope.checkboxValue[i]=== undefined)
{
$scope.checkboxValue[i]=0;
}

sum += $scope.checkboxValue[i];

}


if (sum >0)
return true;
else
return false;

}

//below function is to track the change of Select options and display "Delete" instead of "Confirm"
$scope.trackSelectChange = function() {

$scope.deletePressed=false;

}

$scope.confirmDelProject= function() {

$scope.deletePressed=true;



}

$scope.deleteProject=function() {
$scope.deletePressed = false;
$http.post('php/active_cpe_project_delete.php', $scope.deletedProj).success(function (){$window.alert('deleting...')});



}


$scope.showMajor=function(){

$(".panel-primary").show();
$(".panel-info").hide();

}

$scope.showMinor=function(){

$(".panel-primary").hide();
$(".panel-info").show();

}

$scope.showAll=function(){

$(".panel-primary").show();
$(".panel-info").show();

}

$scope.catToMove= '';

$scope.loadProductList= function(){


$http.get('data/pjcompleted/product_list.json', {headers:{"cache-control":"no-cache"}}).then(function(response){

$scope.productlist=response.data[$scope.catToMove];


}, function(response){

$scope.content="something went wrong";
})


};

});

/*****************************************************************/
/*reportCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('reportCtrl', function($scope, $http, $window, $timeout) {

    
$scope.$parent.currentTab = 'reportPage';
	/* combine all db and save it in $scope.repo */
var dbCombine= function(){
	
$scope.repo = {};

var dblist = [
'data/pjcompleted/ojpro_completed.json',
'data/pjcompleted/oj_completed.json',
'data/pjcompleted/pws_completed.json',
'data/pjcompleted/ics_completed.json',
'data/pjcompleted/mobile_completed.json',
];

angular.forEach(dblist, function(value) {

$http.get(value, {headers:{"cache-control":"no-cache"}}).then(function(response){

/**LEARNING** merge the individual databse into one */ 
$scope.repo=Object.assign($scope.repo, response.data);
}, function(response){

$scope.content="something went wrong";
})
	
});

};

var init = function (){

$scope.enddate=	new Date();
//$scope.startdate=moment().subtract(1, 'years')._d;

$scope.listshow=false;


dbCombine();
//$scope.totalproduct= Object.keys($scope.repo);


};

init();


$scope.reportShow = function () {
	
	$scope.listshow=true;
	
	//console.log($scope.filteredProj);
}

$scope.reportHide = function () {
	
	$scope.listshow=false;

	
}


$scope.$watch('startdate', function(newValue, oldValue){
	

	 $scope.dateFilter();
});

$scope.$watch('enddate', function(newValue, oldValue){
	

	 $scope.dateFilter();
});

/*constructor function for the filtered Project Data */
function filterDbCons(datevr, livedate, fdudate, mfgdate, revision, defectcount,featurecount,cat,uniquefw){
	
	this.datevr =datevr;
	this.livedate=livedate;
	this.fdudate=fdudate;
	this.mfgdate=mfgdate;
	this.revision=revision;
	this.defectcount=defectcount;
	this.featurecount=featurecount;	
	this.cat =cat;
	this.uniquefw=uniquefw;
}

function sortObject (objA){
  
var objB= {};
var temp= Object.values(objA);

temp.sort(function(a,b){
  
  return b-a;
  
  
});


temp.forEach(function(value){
  

 for (var prop in objA) {
  if(!objB.hasOwnProperty(prop))
   {
   if (objA[prop]==value)
      objB[prop]=value;
   
   }
   
 }
  
  
  
});
  
  return objB;
}


$scope.dateFilter= function() {
	
$scope.filteredProj={};
$scope.numOfProj=0;
$scope.roi=0;
$scope.defectcount=0;
$scope.featurecount=0;
$scope.majorcount=0;
$scope.minorcount=0;
$scope.uniquefw=0;

$scope.itemType ={'UI':0, 'EWS':0,'Fax':0,'Scan':0,'Mech':0,'ADF':0, 'Copy':0, 'IDS':0, 'Acumen':0,'Ink Sub':0, 'Ink Security':0, 'Connectivity':0, 'SIPs':0, 'OXPD':0,
'Digital Send':0, 'LEDM':0, 'General Security':0, 'Mobility':0, 'Paperpath':0, 'Board Config':0, 'ASIC':0, 'Power':0, 'Boot Loader':0, 'OS Related':0, 'Others':0};

var i=0;

angular.forEach($scope.repo, function(value,key){
	
angular.forEach(value['projectlist'], function(value1,key1){
	
	var temp= new Date(value1.datevr);
	if((temp > $scope.startdate) && (temp < $scope.enddate))
	{
		/*remove non-digit characters */
		roi_temp= value1.roi.replace(/\D/g, '');
		
		$scope.numOfProj++;
		$scope.filteredProj[key1]= new filterDbCons(value1.datevr, value1.livedate, value1.fdudate, 
		value1.mfgdate,value1.revision, value1.defectcount, value1.featurecount,value1.cat, value1.uniquefw);
		$scope.roi+=parseInt(roi_temp);
		$scope.defectcount+=parseInt(value1.defectcount);
		$scope.featurecount+=parseInt(value1.featurecount);
		$scope.uniquefw+=parseInt(value1.uniquefw);
		if (value1.cat =='Major roll')
		$scope.majorcount++;
	    else
		$scope.minorcount++;
	    angular.forEach(value1['itemlist'], function(value2){
		    $scope.itemType[value2.component]++;
			
		});
	
	}
	
});
	
		
})

$scope.itemType=sortObject($scope.itemType);

};



$scope.hideZeroItem = function(count) {
	
if (count==0)
return true;
	
	
}


});

/*****************************************************************/
/*dbCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('dbCtrl', function($scope) {

$("#search-box").hide();
console.log('dbCtrl entry');

$scope.$parent.currentTab = 'dashboardPage';
    


});


/*****************************************************************/
/*cpeCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('cpeCtrl', function($scope) {

$("#search-box").hide();

$scope.currentTab = '';
    

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


