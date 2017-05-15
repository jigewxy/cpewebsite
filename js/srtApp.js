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


/*LEARNING - there is a bug in angularjs 1.6.x, the route now has a prefix '!', so need to customize the prefix here*/
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(function($routeProvider){$routeProvider
.when("/dashboard", {templateUrl:"srt/dashboard.html", controller:"srtDashCtrl"})
.when("/activeproject", {templateUrl:"srt/activesrtproj.html", controller:"srtActiveCtrl"})
.when("/completedproject", {templateUrl:"srt/completedsrtproj.html", controller:"srtCompletedCtrl"})
.otherwise({redirectTo:"/activeproject"})});


/*******************************************/
/**controller for the active project page **/
/*******************************************/
app.controller('srtActiveCtrl', function($scope, $http, $log, $rootScope, $location,reusableSrcs, presetChkBox) {


$scope.delClicked = false;
$scope.itemDelClicked = false;
$scope.$parent.activeOrComp = true; 
$scope.$parent.currentRoute= $location.url();
$scope.moveClicked=false;


$scope.selectRightType = function (arg1, arg2){
	
reusableSrcs.selectRightType(arg1, arg2);
	
}
$scope.selectRightComp = function (arg1, arg2) {

$log.debug('sel func called');
reusableSrcs.selectRightComp(arg1, arg2);
	
}

/* http request to get the data */
$http({method: "GET", url: "data/srt/srt_release_active.json", headers: {"cache-control": "no-cache"}}).then(function(response){
$scope.statuscode=response.status;
$scope.entries=response.data.releases;}, function(response){

$log.error($scope.statuscode);
$log.error("Something went wrong");
})

/*set database for different modals, as well as initialize various paras */
$scope.setEntryDb=function(rootindex) {
	
$scope.$parent.activeOrComp = true; 
$scope.selectedEntry= $scope.entries[rootindex-1];
$scope.numOfItems=$scope.selectedEntry['itemlist'].length;
/*initialization of various variables*/
$scope.delClicked = false;	
$scope.itemDelClicked = false;		
$scope.moveClicked=false;
$log.debug($scope.datePattern);
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

$scope.showRemark = function(e, rootindex){

var x = e.clientX -200;
var y  = e.clientY-200;
$scope.ttEntry= $scope.entries[rootindex-1];

var newTooltip = $scope.ttEntry.tooltip.replace('\r\n', '<br>');
newTooltip = '<p>' + newTooltip+ '</p>';
$('div.tooltip-item').css({'position':'absolute', 'top':y, 'left':x, 'opacity':'0.9'}).show();

/* LEARNING - can't use $().text(), because it will not show line break, and other format */
$('div.tooltip-item').html(newTooltip);


/* LEARNING -- below is wrong code, because it will new mouseleave event every time , unless clear the mouseleave event first */
$(e.target).off('mouseleave').off('contextmenu');
$(e.target).on({'mouseleave': function(event){
    $('div.tooltip-item').hide();
    
}, 'contextmenu': function(event){

event.preventDefault();
$('#tooltip-modal').modal('show').find('textarea').val($scope.ttEntry.tooltip);

}}) 

}

$scope.insertDate = function(){

var today = new Date();

today = moment(today).format('MMM-DD-YYYY');
console.log (today);
console.log(typeof(today));
$('#tooltip-form textarea').val($('#tooltip-form textarea').val().concat(today+" : "));

}

$scope.submitTooltip = function(){

var formdata = $('#tooltip-form').serialize();
var newTt  = $('#tooltip-form textarea').val();
var successMsg = '<div class="alert alert-success"><strong>Success! </strong>'
var errorMsg = '<div class="alert alert-danger"><strong>Failed! </strong>'
console.log(formdata);

$.ajax({

url: 'php/srt/active_srt_tooltip_edit.php',
method: 'POST',
data: formdata
}).done(function(resp){

console.log(resp);
successMsg +=resp +'</div>';
$('#tooltip-edit-status').html(successMsg);
$scope.ttEntry.tooltip = newTt;
}).fail(function(xhr,status, error){

console.log(status + error);
errorMsg +=status +error +'</div>';
$('#tooltip-edit-status').html(errorMsg);
}).always(function(xhr, status, error){

$(document).on('click', function(){

$('#tooltip-edit-status').html('');

});
    
});


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


$scope.dblConfirm =function(){

console.log('dblConfirm called');
$scope.moveClicked=true;

}


    

/* filter functions for project status */
    
var filterOngoing = function (arg){
    

if (arg.state == 'Ongoing')
return true;
else 
return false; 
       
}
    
var filterUpcoming = function(arg){
    
if (arg.state == 'Upcoming')
return true;
else 
return false; 
    
}

var filterOnhold= function(arg){
    
if (arg.state == 'On Hold')
return true;
else 
return false; 
    
}

var filterCompleted= function(arg){
    
if (arg.state == 'Completed')
return true;
else 
return false; 
    
}
    
    
    
/* Below function add number of days to current day */

var addDays= function(nums){
  

var currenttime = new Date();
var currentdate= currenttime.getDate();
    /*LEARNING -- must declare newtime as a Date Object, or else it will be default to a number type */
var newtime= new Date(currenttime.setDate(currentdate+nums));
  
  return newtime;
};
    
    

/* filter functions to filter the delivery days */
var filterSevenDays = function(arg){
 
    var pjdate= new Date(arg.vrdate);
    var today= new Date();
if ((pjdate <= addDays(7)) && (pjdate >= today))
    return true;
    
else 
 return false;

    
}


var filterFourteenDays = function(arg){
 
    var pjdate= new Date(arg.vrdate);
    var today= new Date();

if ((pjdate <= addDays(14)) && (pjdate > addDays(7)))
return true;
else 
return false;
    
}


 var filterLongerDays = function(arg){
 
    var pjdate= new Date(arg.vrdate);
    var today= new Date();

if (pjdate >addDays(14))
return true;
else 
return false;

}

var filterParked = function(arg){
 
    var pjdate= new Date(arg.vrdate);
    var today= new Date();

if (pjdate < today)
return true;
else 
return false;
    
}

/* filter functions to filter the regions */
    
var filterNa = function (arg){
    

if (arg.region == 'North America')
return true;
else 
return false; 
       
}
    
var filterEmea = function(arg){
    
if (arg.region == 'EMEA')
return true;
else 
return false; 
    
}

var filterApj= function(arg){
    
if (arg.region == 'Asia Pacific')
return true;
else 
return false; 
    
}

var filterChina= function(arg){
    
if (arg.region == 'China')
return true;
else 
return false; 
    
}
    



/* predefined strings for headers */
var headersSch= ['Deliverables in 7 Days', 'Deliverables in 14 Days', 'Deliverables > 14 Days', 'Project Delivered'];
var headersState = ['Projects Ongoing','Project Upcoming', 'Projects On Hold', 'Projects Pending Feedback' ];
var headersRegion = ['North America','EMEA', 'Asia Pacific', 'China'];
    
var filtersSch = [filterSevenDays, filterFourteenDays, filterLongerDays,filterParked];
var filtersState= [filterOngoing, filterUpcoming, filterOnhold, filterCompleted];
var filtersRegion= [filterNa, filterEmea, filterApj, filterChina];
    
$scope.filterCust = {'headers':headersState, 'filters':filtersState};

    
/*setFilter functions */
$scope.setFilter =function(arg){
    
var btnId= arg.target.id;
    
    switch (btnId)
{ case 'state-filter-btn':
            
$scope.filterCust.headers = headersState;
$scope.filterCust.filters = filtersState; 
$('#state-filter-btn').addClass('btn-warning');
$('#sch-filter-btn').removeClass('btn-warning');
$('#region-filter-btn').removeClass('btn-warning');
    break;
case 'sch-filter-btn':
            
$scope.filterCust.headers = headersSch;
$scope.filterCust.filters = filtersSch;
$('#state-filter-btn').removeClass('btn-warning');
$('#sch-filter-btn').addClass('btn-warning');
$('#region-filter-btn').removeClass('btn-warning');
        break;
        case 'region-filter-btn':
            
$scope.filterCust.headers = headersRegion;
$scope.filterCust.filters = filtersRegion;
$('#state-filter-btn').removeClass('btn-warning');
$('#sch-filter-btn').removeClass('btn-warning');
$('#region-filter-btn').addClass('btn-warning');
            break;

        default:
            break;
            
}
   
}

/* watch function place holder 
$scope.$watch('filterCust.headers', function(newValue, oldValue){

}) */

});



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

/*******************************************/
/**controller for the dash board page     **/
/*******************************************/

app.controller('srtDashCtrl', function($scope, $http, reusableSrcs,$location){

$scope.$parent.activeOrComp = true; 
$scope.$parent.currentRoute= $location.url();


$http({method: "GET", url: "data/srt/srt_release_active.json", headers:{"cache-control":"no-cache"}}).then(function(response){

$scope.statuscode=response.status;
$scope.entries=response.data.releases;

renderChart();

}, function(response){

console.log($scope.statuscode);
console.log("Something went wrong");
})

$scope.setDatabase= function(arg){

var index = $scope.categories.indexOf(arg.innerHTML);

$scope.selectedEntry = $scope.entries[index];
console.log($scope.selectedEntry);

/*$apply is required here to update the bindings */
$scope.$apply(function(){$('#srt-proj-modal').modal('show')});

}



var renderChart = function(){

 var now= new Date();
 
var band_start= new Date();
var onequarter= new Date();
//determine where to start the quarter band plot
band_start = Date.UTC(2016, 10, 1);
//quarter duration -91days
onequarter= Date.UTC(2017, 5, 31) - Date.UTC(2017, 3, 1);
//quarter duration -92days 
onequarter_92= Date.UTC(2017, 6, 1) - Date.UTC(2017, 3, 1);

Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },

    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }   
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

var optionSchedule=
{

        chart: {
            renderTo: 'containerone',
			type: 'columnrange',
			inverted: true
        },

	xAxis: {
		/*project name data injected here */
		    categories: [],
			crosshair: {
            width: 2,
            color: 'green',
			dashStyle:'dashdot',
        },
		
		labels: {
		useHTML: true,
		style: {"color":"#666666",
		        "font-weight":"bold",
				},
		formatter: function(){
		/*LEARNING - ng-click doesn't work on dynamic generated HTML, it need to be recompiled, use below shorthand funcion instead*/
			return '<p onclick="angular.element(this).scope().setDatabase(this)">'+ this.value + '</p>';


		}

		}
		  },

		
    yAxis: {
		
		  type: 'datetime',
		  title: 'Date',
		  tickInterval:  7 * 24 * 36e5, // one week
	      labels: {
          formatter:function(){
              //  return Highcharts.dateFormat('%d:%m:%Y', this.value);
			  return moment(this.value).format("MMM-DD");
            }
          },
		  
  
  plotBands: [
  {
     borderColor: 'indigo', 
	borderWidth: '1px', //Color value
	label:{text: 'FY17-Q1',
		 style: {
				 "font-size":"10px",
				 "opacity":"0.5"
				            }
				            },
    from: band_start, // Start of the plot band
    to: band_start+onequarter// End of the plot band
  },
   {
    borderColor: 'indigo', 
	borderWidth: '1px',	//Color value
	label:{text: 'FY17-Q2',
		 style: {
				 "font-size":"10px",
				 "opacity":"0.5"
				            }
				            },
    from: band_start+onequarter, // Start of the plot band
    to: band_start+onequarter*2// End of the plot band
  },
  {
    borderColor: 'indigo', 
	borderWidth: '1px', //Color value
	label:{text: 'FY17-Q3',
		 style: {
				 "font-size":"10px",
				 "opacity":"0.5"
				            }
				            },
    from: band_start+onequarter*2, // Start of the plot band
    to: band_start+onequarter*3// End of the plot band
  },
    {
     borderColor: 'indigo', 
	 borderWidth: '1px', //Color value
	 label:{text: 'FY17-Q4',
		 style: {
				 "font-size":"10px",
				 "opacity":"0.5"
				            }
				            },
    from: band_start+onequarter*3, // Start of the plot band
    to: band_start+onequarter*3+onequarter_92// End of the plot band
  },
  ], 
  
  plotLines: [{
                     color: 'red', // Color value
                     dashStyle: 'solid', // Style of the plot line. Default to solid
				     value: Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()), 
					label:{text: 'Today',
						   style: {
				           "font-size":"12px"
				            }
				            },
				    id: 'current-time',
							// Value of where the line will appear
    width: 4 // Width of the line    
  }]
		  
		  },
     
		
    tooltip: {
			 // 	need to use point.key instead of point.name
      headerFormat: '<b>{point.key}</b><br>',
	  pointFormat: '<i>{point.low: %b %e, %Y} </i> To <i>{point.high: %b %e, %Y}</i>'
	  //need to use point.low and point.high for columnrange type, can't use point.x and point.y as both value are on the same axies.
    },

	
    plotOptions: {
        series: {
            pointWidth: 20
        }
    },
	
	title:{
	text:'Active Project Overview'
	
	},
	
	/*date information injected here*/
	series:[{}]

};


// need to add the error status check to the AJAX call, or the response is silent with no error shown
	 /*below function convert the 2017-02-02 to Date.UTC(2017,1,2) */    
var dateProcess= function(arg1)
{
  
 var x= new Date(arg1);
  
  var day= x.getDate();
  var year=x.getFullYear();
  var month=x.getMonth();
  
 return 'Date.UTC('+year+','+month+','+day+')';
  
}

       
  var scheduleData= {
            'category':[],
            'dates':[],  /*array of object */
            'name':'Project Duration',
       }


      var pjtitles=[];
      var temp=[]; /* to store the formated dates */

/*constructor function for the appropriate data structure for highchart usage */
      function DatesCons(requestdate, fcdate, rcdate, vrdate, index){

        return [{
            "x": index,
            "low": eval(dateProcess(requestdate)),
            "high": eval(dateProcess(fcdate)),
            "name": "FC cycle",
            "color": "deepskyblue"
        },
        {
            "x": index,
            "low": eval(dateProcess(fcdate)),
            "high": eval(dateProcess(rcdate)),
            "name": "RC cycle",
            "color": "lemonchiffon"
        },
        {
            "x": index,
            "low": eval(dateProcess(rcdate)),
            "high": eval(dateProcess(vrdate)),
            "name": "VR cycle",
            "color": "pink"
        }];

      }


/* loop through the database and process the date */
       $scope.entries.forEach(function(elems,index){
          
          var title= '['+elems.customer+'] '+elems.feature;
        
         pjtitles.push(title.slice(0,40));
         
        temp=temp.concat(DatesCons(elems.requestdate, elems.fcdate, elems.rcdate, elems.vrdate, index));
     
       });

     scheduleData.category= pjtitles;
     scheduleData.dates=temp;

     $scope.categories=scheduleData.category;


    optionSchedule.series[0].data =  scheduleData.dates;
	optionSchedule.series[0].name =  scheduleData.name;
	optionSchedule.xAxis.categories =  scheduleData.category;


  var chart1 = new Highcharts.Chart(optionSchedule);


};



});


/*******************************************/
/** main page controller - srtCtrl **/
/*******************************************/
app.controller('srtCtrl', function ($scope, $rootScope, $location){
	


 $scope.currentRoute= $location.url();
 console.log($scope.currentRoute);
$scope.digestCount=0;
    
   /* $rootScope.$watch= function(){
    
  $scope.digestCount++;
    
    
 }*/

/* Below function set the selected tab color depending on URL */
 $scope.$watch('currentRoute', function(newValue, oldValue){
  switch (newValue)
 {
   case '/dashboard':
   console.log('dashboard clicked');
    $('#dash-tab').addClass('selected-tab');
    $('#active-tab').removeClass('selected-tab');
    $('#completed-tab').removeClass('selected-tab');
   break;
    case '/activeproject':
    $('#dash-tab').removeClass('selected-tab');
    $('#active-tab').addClass('selected-tab');
    $('#completed-tab').removeClass('selected-tab');
   break;

   case '/completedproject':
    console.log('completedpj clicked');
    $('#dash-tab').removeClass('selected-tab');
    $('#active-tab').removeClass('selected-tab');
    $('#completed-tab').addClass('selected-tab');
   break;

 }

 });

	
	/*below $watch is to resolve the #item-status-sel class not updated issue */
	
	$scope.$watch('activeOrComp', function(newValue, oldValue){
	if (newValue == true)
	{ $('.item-status-sel').removeClass('ng-hide');}
    else 
	{$('.item-status-sel').removeClass('ng-show');}
	});
	
	
});

