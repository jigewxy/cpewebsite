/*********************************************/
/**controller for the completed project page**/
/*********************************************/
app.controller('srtCompletedCtrl', function($scope, $http, $location,reusableSrcs, presetChkBox){
	
	$scope.delClicked = false;
/*regular expression for the date picker */
$scope.itemDelClicked = false;
$scope.$parent.currentRoute= $location.url();
$scope.$parent.activeOrComp = false; 
$scope.enddate= new Date();
/* http request to get the data */
$http({method: "GET", url: "data/srt/srt_release_completed.json", headers:{"cache-control":"no-cache"}}).then(function(response){
$scope.statuscode=response.status;
$scope.entries=response.data.releases;}, function(response){

console.log($scope.statuscode);
console.log("Something went wrong");
})


/*set database for different table rows, as well as initialize various paras */
$scope.setDb=function(rootindex) {

$scope.selectedEntry= $scope.entries[rootindex-1];
$scope.numOfItems=$scope.selectedEntry['itemlist'].length;
/*initialization of various variables*/
$scope.delClicked = false;	
$scope.itemDelClicked = false;		
/*display the EDIT and DELETE button only when there is at least one entry */
if ($scope.selectedEntry['itemlist'][0] != undefined )
{$scope.itemToDel= 'item1. '+$scope.selectedEntry['itemlist'][0]['crid']+'['+$scope.selectedEntry['itemlist'][0]['summary']+']';
$('#item-del-button').show();
$('#item-edit-button').show();
}
else
{$('#item-del-button').hide();
 $('#item-edit-button').hide();
}
}

$scope.dateFilterFn = function(arg)
{

  var pjdate= new Date(arg.vrdate);

 if ((pjdate < $scope.startdate)|| (pjdate > $scope.enddate))
  return false;
 else
  return true;

}

$scope.resetDateFilter = function(){

$scope.enddate= new Date();
$scope.startdate= new Date("October 10, 2007");

}


$scope.setStatusColor = function(args) {

return reusableSrcs.statusColor(args);

}

$scope.resetDelClicked =function () {
	
	$scope.delClicked = false;	
}


$scope.setDelClicked =function () {
	
	$scope.delClicked = true;	
}


$scope.resetItemDelClicked =function () {
	
	$scope.itemDelClicked = false;	
}


$scope.setItemDelClicked =function () {
	
	$scope.itemDelClicked = true;	
}

$scope.evalCkBox = function(arg1, arg2) { 
	presetChkBox.presetFunc(arg1,arg2);}


});
