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
	.otherwise({redirectTo :"/activeproject"})
});


/*****************************************************************/
/* CompProCtrl - controller for completedproject.html */
/*****************************************************************/
app.controller('CompProCtrl', function ($scope, $http, $window) {


var init= function () {

$("#search-box").hide();
$scope.$parent.currentTab = 'projCompleted';
setTimeout(function(){$('.tab-list').eq(0).find('a').click();}, 200);
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

/*LEARNING viewcontentloaded can be used to set event during initialization */
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
  
init();


function init () {

$("#search-box").show();
$scope.$parent.currentTab = 'projActive';

//at landing page, shows all project in one table by simulating the click on "show all" button
setTimeout(function(){$('li.list-btn').eq(0).find('button').trigger('click');}, 200);

};


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
  
//functions to render modals to add and mofidy

$scope.renderAddModal=function(){

 
$("#add-item-modal").modal("show");
}

// pass correct value for select boxes
$scope.renderModifyModal=function(arg){

$("#modify-item-modal").modal("show");
$("select[name='pjcat']").val(arg);

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

// minor or major release

$scope.selectRightCat =function(arg)
{
console.log('selectrightCat called');
//use .val() to assign the stored status to the select option, alternative is to add attribute 'selected' to the member option.
$("select[name='pjcat']").val(arg);

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


$scope.catToMove= '';

$scope.loadProductList= function(){


$http.get('data/pjcompleted/product_list.json', {headers:{"cache-control":"no-cache"}}).then(function(response){

$scope.productlist=response.data[$scope.catToMove];


}, function(response){

$scope.content="something went wrong";
})


};

$scope.setFilter = function(e){

$('li.list-btn>button').removeClass('btn-warning');
$('#'+e.target.id).addClass('btn-warning');

var today = new Date();
var selFilter= e.target.id;
var tagList = [];
var tagFunc =[];
var tagObj ={};

$scope.projectobjs.forEach(function(obj){

 tagList.push(obj.tag);

})

//remove replicate items in the array 
tagList= $.unique(tagList);

//replace all space in the string and form a new array for the function names
//alternatively we can just use an anonymous function.
/*tagList.forEach(function(val, index){
var newVal = val.replace(/ /g, '');
tagFunc.push(newVal);
newVal = function(arg){
 var tag= $scope.projectinfo[arg.pjname].tag;
if ( tag==val)
return true;
else 
return false;
}

tagObj[val] = newVal;

}); */

tagList.forEach(function(val, index){

tagObj[val] = function(arg){
 var tag= $scope.projectinfo[arg.pjname].tag;
if ( tag==val)
return true;
else 
return false;
}


});




switch (selFilter){


  case 'show-all-btn':
     $scope.filterMap = {
     'All Projects': showAll
    }
    break;

  case 'state-filter-btn':
     $scope.filterMap ={
    'Completed':  vrCompleted,
    'Reaching VR': checkVr,
    'Reaching RC': checkRc,
    'Reaching FC': checkFc,
    'Not Started': checkStart

     }
     break;
  
  case 'cat-filter-btn':
     $scope.filterMap ={
    'Officejet Pro':  checkOjp,
    'Officejet': checkOj,
    'Consumer':checkIcs,
    'Pagewide': checkPws,
     'Mobile':checkMobile
     }
     break;

  case 'tag-filter-btn':
    
     $scope.filterMap =tagObj;

    break;
  

}

//LEARNING -- set delay to wait for the DOM ready, console log is not accurate enough to know if the table is rendered 
  setTimeout(function(){setTableBg()}, 100);

function setTableBg () {
// 10 different colors for tagnames should be more than enough 
var bgColor=['#2a8a85',' #016FB9', '#5299D3', '#7D53DE', '#247BA0', '#2D3047', '#C3EB78', '#040926', '#87BFFF0', '#C65B7C'];
var tableList= document.getElementsByClassName('active-pj-table');
var headerList=document.getElementsByClassName('table-header');
/* LEARNING : how to deal with HTMLCollection Object */
//console.log(Object.getOwnPropertyNames(HTMLCollection.prototype));
//console.log(Object.prototype.toString.call(tableList));
for (var i=0; i<tableList.length; i++)
{
  tableList.item(i).getElementsByTagName('tr')[0].style.backgroundColor = bgColor[i];
  tableList.item(i).getElementsByTagName('tr')[0].style.color = 'white';
  headerList.item(i).style.color = bgColor[i];}
}

function showAll(arg){
  return true;
}

function vrCompleted(arg){
var vrdate= new Date($scope.projectinfo[arg.pjname].datevr);
if (vrdate<=today)
return true;
else 
return false;

}

function checkVr(arg) {
var vrdate= new Date($scope.projectinfo[arg.pjname].datevr);
var rcdate= new Date($scope.projectinfo[arg.pjname].daterc);
if (vrdate>today && rcdate<=today)
return true;
else 
return false;

}
function checkRc(arg) {
var fcdate= new Date($scope.projectinfo[arg.pjname].datefc);
var rcdate= new Date($scope.projectinfo[arg.pjname].daterc);
if (rcdate>today && fcdate<=today)
return true;
else 
return false;

}
function checkFc(arg) {
var fcdate= new Date($scope.projectinfo[arg.pjname].datefc);
var start= new Date($scope.projectinfo[arg.pjname].datestart);
if (fcdate>today && start<=today)
return true;
else 
return false;

}
function checkStart(arg) {
var start= new Date($scope.projectinfo[arg.pjname].datestart);
if ( start>today)
return true;
else 
return false;
}

function checkOjp(arg) {
var cat= $scope.projectinfo[arg.pjname].class;
if ( cat=='Officejet Pro')
return true;
else 
return false;
}

function checkOj(arg) {
var cat= $scope.projectinfo[arg.pjname].class;
if ( cat=='Officejet')
return true;
else 
return false;

}
function checkIcs(arg) {
  var cat= $scope.projectinfo[arg.pjname].class;
if ( cat=='Consumer')
return true;
else 
return false;

}
function checkPws(arg) {
var cat= $scope.projectinfo[arg.pjname].class;
if ( cat=='Pagewide')
return true;
else 
return false;

}
function checkMobile(arg) {
var cat= $scope.projectinfo[arg.pjname].class;
if ( cat=='Mobile')
return true;
else 
return false;

}}

$scope.defectCounter = function(){

var defectNum = 0;
var featureNum = 0;
var itemData = $scope.projectitems;

/*LEARNING - see the problem below? it's dangerous to use the reference type directly, anything wrong it will corrupt the data */ 
//$scope.projectitems.forEach(function(val){
  //   if (val.type ="Defect Fix")
  itemData.forEach(function(val){
   if (val.type =="Defect Fix")
    defectNum++;
    else
    featureNum++;
  });
$scope.pjDefectCount = defectNum;
$scope.pjFeatureCount = featureNum;
console.log(defectNum +' ' + featureNum);

}

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
//$scope.repo= Object.assign($scope.repo, response.data);  doesn't work for IE
    
jQuery.extend($scope.repo, response.data);
    
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
	
 dateFilter();
});

$scope.$watch('enddate', function(newValue, oldValue){
	

	dateFilter();
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

//place the items with higher number first
function sortObject (objA){
  
var objB= {}, 
    temp=[];
//var temp= Object.values(objA); not supported in IE.

for (var prop in objA)
{
     temp.push(objA[prop]);
        
}



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

    
/* polyfil for Object.assign and object values */
    
    

function dateFilter() {

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

for (var x in $scope.repo)
{

var objx = $scope.repo[x]['projectlist'];

for(var y in objx)
 {


var objy = objx[y];

  console.log('objy is');
    console.log(objy);
var vrdate = new Date(objy.datevr);

	if((vrdate > $scope.startdate) && (vrdate < $scope.enddate))
	{
		roi_temp= objy.roi.replace(/\D/g, '');
		$scope.numOfProj++;
		$scope.filteredProj[y]= new filterDbCons( objy.datevr,  objy.livedate, objy.fdudate, 
		 objy.mfgdate,objy.revision, objy.defectcount,  objy.featurecount, objy.cat,  objy.uniquefw);
		$scope.roi+=parseInt(roi_temp);
		$scope.defectcount+=parseInt( objy.defectcount);
		$scope.featurecount+=parseInt( objy.featurecount);
		$scope.uniquefw+=parseInt( objy.uniquefw);
		if ( objy.cat =='Major roll')
		$scope.majorcount++;
	    else
		$scope.minorcount++;
    for (var z in  objy['itemlist']){

     	    $scope.itemType[objy['itemlist'][z].component]++;

    }

   }

 }
}
$scope.itemType=sortObject($scope.itemType);




/*angular.forEach($scope.repo, function(value,key){
	console.log('1 Called');
angular.forEach(value['projectlist'], function(value1,key1){
		console.log('2 Called');
	var temp= new Date(value1.datevr);
  console.log(temp);
  console.log($scope.filterMinDate);
    console.log($scope.filterMaxDate);
	if((temp > $scope.filterMinDate) && (temp < $scope.filterMaxDate))
	{
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
	
		
}) */

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


