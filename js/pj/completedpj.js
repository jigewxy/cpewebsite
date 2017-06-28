/*****************************************************************/
/* CompProCtrl - controller for completedproject.html */
/*****************************************************************/
app.controller('CompProCtrl', function ($scope, $http, $window, $timeout, CpePjService, CustomEnums, ajaxService) {


	var pool = {
     'Officejet Pro': {},
	 'Officejet':{},
	 'Page Wide':{},
	 'Consumer':{},
	 'Mobile':{}
	};

/*	var map ={
    'Officejet Pro': 'ojpro',
	'Officejet': 'oj',
	'Page Wide': 'pws',
	'Consumer': 'ics',
	'Mobile':'mobile'
	}*/


var init= function () {

$("#search-box").hide();
$scope.$parent.currentTab = 'projCompleted';

refreshData(dummyCallback);

setTimeout(function(){$('.tab-list').eq(0).find('a').click();}, 100);


};

init();


function refreshData(callback){

// Ajax service, dummy data
var xhrobj = ajaxService.xhrConfig('', 'GET', 'php/compj/getpjlist.php?');

ajaxService.xhrPromise(xhrobj).then(function(resp){

$scope.pjlist= resp.pjlist;
$scope.fullPdList = _.pluck(resp.pdlist, 'product_name');

_.each(resp.pdlist, function(value, index){

pool[value.division][value.product_name]={'projectlist':[], 'year':value.year};

});


for (var prop in $scope.pjlist)
{
 pool = processResp($scope.pjlist[prop], pool);
 
}

$scope.datapool = pool;
console.log(pool);
callback();

}, function(resp){

console.log("something went wrong");

});

}


// function to process response data from ajax service
function processResp(pj, pool) {

	var cat = pj.division;
	var pdname = pj.product_name;
	var pjname = pj.project_name;
	var pjid = pj.id;
	var version = pj.revision;

// if product not exist in object, create one;
	if(pool[cat][pdname] ===undefined)
	{
	pool[cat][pdname] = { 'year': pj.year, 'projectlist': []};
	}

	pool[cat][pdname]['projectlist'].push({'name':pjname, 'rev':version, 'id':pjid});
	
	return pool;

}

//dummy call back

function dummyCallback(){

	//do nothing;
}


$scope.tabs = [

	{link: '#ojpro-projects', label: 'Officejet Pro', tag: 'ojpro'},
	{link: '#oj-projects', label:'Officejet',tag:'oj'},
	{link: '#pws-projects', label:'Page Wide', tag:'pws'},
	{link: '#ics-projects', label:'Consumer', tag:'ics'},
	{link: '#mobile-projects', label:'Mobile', tag:'mobile'}

];
/*LEARNING viewcontentloaded can be used to set event during initialization */
/*$scope.$on('$viewContentLoaded', function(event){

console.log("ojpro initialized");
$(".tab-list").first().find('a').click();

});*/

//$scope.selectedTab= $scope.tabs[0];

$scope.setSelectedTab= function(tab){
	$scope.selectedTab=tab;
	/*reset delPressed variable in delete modal */
	$scope.delPressed = false;
	$scope.productdata = $scope.datapool[tab.label];

}

$scope.tabClass=function(tab){
if ($scope.selectedTab==tab)
{return "active";}
else {
return "";
}
}

//set the database for different buttons
$scope.setDatabase=function(id){

var xhrobj = ajaxService.xhrConfig(id, 'POST', 'php/compj/getpjData.php?');

ajaxService.xhrPromise(xhrobj).then(function(resp){

//console.log(resp);
$scope.projectdata= resp.pjdata;
$scope.itemlist = resp.itemlist;

//LEARNING --pick the 'type' as a individual array
var type_arr = _.pluck($scope.itemlist, 'type');

//get defect fix and feature count
var cntObj= _.countBy(type_arr, function(df){
   
   return df==='Defect Fix'?'defectcount':'featurecount';

 }); 

cntObj['featurecount']= type_arr.length - cntObj['defectcount'];

_.extend($scope.projectdata, cntObj);

}, function(resp){

console.log("something went wrong");

});
/*$scope.projectdata= item;
$scope.projectname= project;
$scope.productname= product;*/

}

$scope.addPdSubmit = function(){

var data= $('#form-add-pd').serializeArray();
var alertElems = 'div#add-pd-status';
var cat = data[0].value;
var name = data[1].value;
var flag =0;
var found ='';

//check if product name already exist
_.each($scope.fullPdList, function(elems, index){

if (elems.toLowerCase()== name.trim().toLowerCase())   
	{flag=1;}
})

if (flag)
{
 console.log(name + ' already exist in database');
CpePjService.emitAlertMsg(4, alertElems, 'Error!', name+' already exist in database!');
}
else
{
console.log('okay, will add');

    var xhrobj = ajaxService.xhrConfig(data,'POST','php/compj/addpd.php?');

    ajaxService.xhrPromise(xhrobj).then(function(resp){

    console.log(resp);

   if (resp.trim() =="success")
    {
        CpePjService.emitAlertMsg(1, alertElems, 'Successful!', name+' has been successfully added!');
		refreshData(function(){	$scope.productdata = $scope.datapool[$scope.selectedTab.label];})
    }
    else 
    {  
        CpePjService.emitAlertMsg(4, alertElems, 'Failed!', ' Database connection error!');
    }

    },  function(error){
        CpePjService.emitAlertMsg(4, alertElems, 'Failed!', 'something is wrong with server! '+error);
    });


  //  refreshData(dummycallback);
}


};


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
'Digital Send':0, 'LEDM':0, 'General Security':0, 'Mobility':0, 'Datapath':0, 'Board Config':0, 'ASIC':0, 'Power':0, 'Boot Loader':0, 'OS Related':0, 'Others':0};

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