<script>

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

/*below function make sure the default OJ pro content (completedproject route) is shown when page reloaded. delay is needed for the DOM loading.*/
$("#completed-proj").on('click', function(){
setTimeout("$('.tab-list').first().find('a').click()", 200);
});


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

}


var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/dashboard", {
         templateUrl: "cpeprojects/dashboard.html",
		 controller: "cpeCtrl"
    })
    .when("/activeproject", {
        templateUrl: "cpeprojects/activeproject.html",
		controller:"activeProCtrl"
    })
    .when("/completedproject", {
        templateUrl: "cpeprojects/completedproject.html",
		controller:"tabsCtrl"
    })
	.otherwise({redirectTo :"/dashboard"})
});


/*****************************************************************/
/* tabsctrl - controller for completedproject.html */
/*****************************************************************/
app.controller('tabsCtrl', function ($scope, $http, $window) {


var init= function () {

$("#search-box").hide();

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
  console.log("ojpro db selected");
 break;
  case 'Officejet':
 $scope.database= 'data/pjcompleted/oj_completed.json';
  console.log("oj db selected");
 break;
  case 'Page Wide':
 $scope.database= 'data/pjcompleted/pws_completed.json';
 console.log("page wide db selected");
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

console.log($scope.statuscode);
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
});


/*****************************************************************/
/*activeProCtrl - controller for completedproject.html
/*****************************************************************/
app.controller('activeProCtrl', function($scope, $http, $window, $timeout) {

var init= function () {

$("#search-box").show();

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
	}, function(response)
	{
	console.log($scope.statuscode);
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
$(".status-modify-box").eq(index).attr("value", currentstatus);
}



//function to display the type for each item

$scope.selectRightType =function(type, index)
{

//use .val() to assign the stored type to the select option, alternative is to add attribute 'selected' to the member option.
$(".type-modify-box").eq(index).val(type);

//add VALUE attribute in order to submit the table data through AJAX call, because innerHTML of select box return all options hence not useful.
$(".type-modify-box").eq(index).attr("value", type);
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

console.log($scope.catToMove);

$http.get('data/pjcompleted/product_list.json', {headers:{"cache-control":"no-cache"}}).then(function(response){

$scope.productlist=response.data[$scope.catToMove];

console.log($scope.productlist);

}, function(response){

console.log($scope.statuscode);
$scope.content="something went wrong";
})


};

});

/*****************************************************************/
/*cpeCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('cpeCtrl', function($scope, $http, $window, $timeout) {
var init= function () {

$("#search-box").hide();

};

init();

});


