
/*****************************************************************/
/*activeProCtrl - controller for activeproject.html and dashboard.html
/*****************************************************************/
app.controller('activeProCtrl', function($scope, $http, $window, $timeout, CpePjService, CustomEnums, AjaxPrvService, ImportService) {


//some initialization required
function init() {
    $("#search-box").show();
    $scope.$parent.currentTab = 'projActive';
    $scope.prodcat=0;
    $scope.projectobjs =[];
    $scope.uploadvalid = 0;
    //at landing page, shows all project in one table by simulating the click on "show all" button
    $timeout(function(){$('li.list-btn').eq(0).find('button').trigger('click');}, 200);
};

function dummycallback(){
    //do nothing;
}

//refresh the page content by ajax call
//LEARNING: in order to sychronise the data, instead of using nested deferred promise in the response function,
//a callback function is cleaner solution here, we can use a dummy callback when the callback is not needed.

 $scope.refreshData= function (callback){

//need a dummy data for GET service
var dummy= '';

var xhrobj = AjaxPrvService.xhrConfig(dummy, 'GET','php/cpepj/getdata.php?');

AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 
    //note that .then() create another promise, to avoid confusion, we use callback() here to deal with this aychronization
    $scope.projectobjs =[]; //Need to reinitialize the array when data is refreshed.
    $scope.projectinfo = resp.pj;
    $scope.projectlist = Object.keys(resp.pj);
    $scope.pdlist = resp.pdlist;

        angular.forEach($scope.projectlist, function(value){

            var temp_obj ={};

            temp_obj=resp.pj[value];
            temp_obj.pjname= value;

        $scope.projectobjs.push(temp_obj);}
        )
    //user defined callback() function to update the $scope data, if not needed, just use dummycallback.
    callback();

    }, function(resp){
    console.log("something went wrong");
    console.log(resp);
});

}

  
init();
$scope.refreshData(dummycallback);

//set database when entry is selected, including projectinfo, projectname, projectitems, projectid..etc
$scope.selDatabase = function(pname) {
 
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
    $scope.projectid= $scope.projectdata.id;
    $scope.projectitems=$scope.projectinfo[pname].itemlist;
    $scope.renderModal.displayPj();
    }

}


//function factory to render modals 
$scope.renderModal ={

    addItem: function(){

    
    $("#add-item-modal").modal("show");
    },
    
    importItem: function(){

    $("#import-item-modal").modal("show");

    },

    editItem: function(arg){

        $("#modify-item-modal").modal("show");
        $("select[name='pjcat']").val(arg);

    },

    delItem:function(){

        //below is to make sure the "Delete" Button is shown instead of "Confirm" after user close the modal without confirm
        $("#delete-item-modal").modal("show");
    },

    delPj: function(){

        $scope.deletePressed=false;
        $scope.deletedProj = $scope.projectlist[0]; //initialize the ngoption
        //below is to make sure the "Delete" Button is shown instead of "Confirm" after user close the modal without confirm
        $("#delete-project-modal").modal("show");
    },

    displayPj:function(){
        $("#active-project-modal").modal("show");
        //set tooltip height references to summary table
        $timeout(function(){ $('div#div-tooltip').height($('div.table-summary').height());}, 200);
        var tooltip = $scope.projectdata.tooltip;
        //replace line break with seperate paragraph.
        if(tooltip!==null){
            tooltip = tooltip.replace(/\r\n/g, '</p><p class="p-tooltip">');
            $('div#div-tooltip').html('<p class="p-tooltip">'+ tooltip + '</p>');
          }
         else {
             $('div#div-tooltip').html('');
         }
    }

};

//function factory to select right value for modify modal
$scope.selectRight ={


    status: CpePjService.currySelectRight(".status-modify-box"),
    type: CpePjService.currySelectRight(".type-modify-box"),
    component: CpePjService.currySelectRight(".component-modify-box"),

    category: function(arg)
    {
    $("select[name='pjcat']").val(arg);
    },
    statusColor: function(status){

    // colors are defined in cpe_projects.css for different classes.
    switch (status)

    {
    case "In Progress":
        return "iteminprogress";
        
    case "Fixed":
        return "itemfixed";
        
    case "Verified":
        return "itemverified";
    
    case "Reopen":
        return "itemreopen";
        
    default:
         return "bg-default";

    }}



};

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


$scope.catToMove= '';

$scope.loadProductList= function(){


    $http.get('data/pjcompleted/product_list.json', {headers:{"cache-control":"no-cache"}}).then(function(response){

    $scope.productlist=response.data[$scope.catToMove];


    }, function(response){

    $scope.content="something went wrong";
    })


};

$scope.setFilterFn = function(e){

    $('li.list-btn>button').removeClass('btn-warning');
    $('#'+e.target.id).addClass('btn-warning');

    var today = new Date();
    var selFilter= e.target.id;
    var tagList = [];
    var tagFnList ={};

    $scope.projectobjs.forEach(function(obj){

    tagList.push(obj.tag);});

//Learning, Native JS: Array.forEach(function(val, index){})
//while in Jquery.each(), the call back function is function(index,val)
//which is the opposite order.

//here need to filter out the replicate values in taglist
    $.each($.unique(tagList), function(index, val){

            tagFnList[val] = function(arg){
            var tag= $scope.projectinfo[arg.pjname].tag;
            if ( tag==val)
            return true;
            else 
            return false;
            }

            });

            //filter function factory
            var filterFn = {

            showAll : function (arg){
            return true;
            },

            vrCompleted: function (arg){
            var vrdate= new Date($scope.projectinfo[arg.pjname].datevr);
            if (vrdate<=today)
            return true;
            else 
            return false;
            },

            checkVr: function (arg) {
            var vrdate= new Date($scope.projectinfo[arg.pjname].datevr);
            var rcdate= new Date($scope.projectinfo[arg.pjname].daterc);
            if (vrdate>today && rcdate<=today)
            return true;
            else 
            return false;
            },

            checkRc: function (arg) {
            var fcdate= new Date($scope.projectinfo[arg.pjname].datefc);
            var rcdate= new Date($scope.projectinfo[arg.pjname].daterc);
            if (rcdate>today && fcdate<=today)
            return true;
            else 
            return false;
            },

            checkFc: function (arg) {
            var fcdate= new Date($scope.projectinfo[arg.pjname].datefc);
            var start= new Date($scope.projectinfo[arg.pjname].datestart);
            if (fcdate>today && start<=today)
            return true;
            else 
            return false;
            },


            checkStart: function (arg) {
            var start= new Date($scope.projectinfo[arg.pjname].datestart);
            if ( start>today)
            return true;
            else 
            return false;
            },

            checkCategory: function(div){
            return function(arg) 
            {var cat= $scope.projectinfo[arg.pjname].division;
            if ( cat==div)
            return true;
            else 
            return false;}
            }

            };

            switch (selFilter){


            case 'show-all-btn':
                $scope.filterMap = {
                'All Projects': filterFn.showAll
                }
                break;

            case 'state-filter-btn':
                $scope.filterMap ={
                'Completed':  filterFn.vrCompleted,
                'Reaching VR': filterFn.checkVr,
                'Reaching RC': filterFn.checkRc,
                'Reaching FC': filterFn.checkFc,
                'Not Started': filterFn.checkStart

                }
                break;
            
            case 'cat-filter-btn':
                $scope.filterMap ={
                'Officejet Pro':  filterFn.checkCategory('Officejet Pro'),
                'Officejet': filterFn.checkCategory('Officejet'),
                'Consumer':filterFn.checkCategory('Consumer'),
                'Pagewide': filterFn.checkCategory('PageWide'),
                'Mobile':filterFn.checkCategory('Mobile')
                }
                break;

            case 'tag-filter-btn':
                
                $scope.filterMap =tagFnList;

                break;
            

            }

          //   console.log(this===$scope); //return true
        //     $timeout(function(){console.log(this)}, 100);  //return '$window'
//LEARNING -- set delay to wait for the DOM ready, so the table can be rendered.
//LEARNING -- bind controller $scope as the context for the service function
             $timeout(CpePjService.setTableBg.bind($scope, 'active-pj-table', 'table-header'), 100);  //return controller

}



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

}



// get product list when the category changes
// category selection binds to $scope.prodcat

$scope.getPdList = function(arg){

    var list =[];
    var options ='';

    switch(arg){

    case 'Officejet Pro':
        list = $scope.pdlist.ojpro;
        break;
    case 'Officejet':
        list = $scope.pdlist.oj;
        break;
    case 'Page Wide':
        list = $scope.pdlist.pws;
        break;
    case 'Consumer':
        list = $scope.pdlist.ics;
        break;
    case 'Mobile':
        list = $scope.pdlist.mobile;
        break;

    }

    for (var prop in list){ options+='<option>'+ prop+'.'+list[prop] + '</option>'; }

    $('select#select-product').html(options);

}

//add project submit function
$scope.addPjSubmit =  function(){

    var alertElems = '#add-pj-status';
    //$.serialize() will conflict with the $.param() in $httpProvider, hence use $serializeArray();
    var formdata = $('form#add-project-form').serializeArray(); 

    var xhrobj = AjaxPrvService.xhrConfig(formdata,'POST','php/cpepj/addpj.php?');

    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){

    if (resp.state =="success")
    {
        CpePjService.emitAlertMsg(1, alertElems, 'Successful!', resp.pjname+' has been successfully added!');
    }
    //$('#add-pj-status').html('<div class="alert alert-success"><strong>Successful! </strong>'+resp.pjname+' has been successfully added! <button class="close" data-dismiss="alert">&times;</button></div>');
    else 
    {  
        $scope.alertcontent= 'Failed to update database, please double check if the project name duplicates with any existing projects.';
        $('div#alert-modal').modal('show');
    }

    },  function(error){
        CpePjService.emitAlertMsg(4, alertElems, 'Failed!', 'something is wrong with server! '+error);
    //$('#add-pj-status').html('<div class="alert alert-danger"><strong>Failed! </strong>something is wrong with server!'+error +'<button class="close" data-dismiss="alert">&times;</button></div>');
    });


    $scope.refreshData(dummycallback);
}


//delete project submit function

$scope.delPjSubmit = function (arg){

    var alertElems = '#del-pj-status';
    var tempobj ={};
    tempobj['pj'] = arg;

    var xhrobj = AjaxPrvService.xhrConfig(tempobj, 'POST','php/cpepj/deletepj.php?');

    AjaxPrvService.xhrPromise(xhrobj).then(
        function(resp){
            var pjname = resp;
            CpePjService.emitAlertMsg(1, alertElems, 'Successful!', pjname+' has been deleted!');
            //$('#del-pj-status').html('<div class="alert alert-success"><strong>Successful! </strong>'+pjname+' has been deleted! <button class="close" data-dismiss="alert">&times;</button></div>');
            var i = $scope.projectlist.findIndex(function(val){ return val==pjname;});
            //LEARNING -- don't use delete as it will replace the element with undefined; use splice() instead;
            //delete $scope.projectlist[i];
            $scope.projectlist.splice(i,1);
            $scope.deletedProj = $scope.projectlist[0];
            $scope.deletePressed = false;
            $scope.refreshData(dummycallback);}, 
        function(status){
            console.log('delete failed');
            CpePjService.emitAlertMsg(4, alertElems, 'Failed!', ' Web server connection error! '+status);
    //$('#del-pj-status').html('<div class="alert alert-danger"><strong>Failed! </strong>web server connection error! error code ='+status +'<button class="close" data-dismiss="alert">&times;</button></div>');
    });

}


//add item submit

$scope.addItemSubmit = function () {

    var alertElems = '#add-item-status';
    var formdata = $("form#form-add-item").serializeArray();
    formdata.push({'name':'project_name', 'value':$scope.projectname});

    var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST', 'php/cpepj/additem.php?');

    AjaxPrvService.xhrPromise(xhrobj).then(
        function(resp){
            if (resp.trim() =="success")
            { 
                CpePjService.emitAlertMsg(1, alertElems, 'Successful!', ' New item has been added successfully');
                $scope.refreshData(function(){console.log("call back go");$scope.projectitems=$scope.projectinfo[$scope.projectname].itemlist;});
                //refresh projectitems data
                //$scope.$evalAsync($scope.projectitems=$scope.projectinfo[$scope.projectname].itemlist);
            }
            else {
                CpePjService.emitAlertMsg(4, alertElems, 'Failed!', ' Database connection error!');
            }}, 
        function(status){   
            console.log('Add failed');
            CpePjService.emitAlertMsg(4, alertElems, 'Error!', ' Web server connection error! '+status);
        });
}


//edit item submit

$scope.editItemSubmit = function(){

var alertElems = '#edit-item-status';
var formdata= $("form#form-edit-item").serializeArray();
var result = $.param(formdata);
var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST', 'php/cpepj/editpj.php?');
AjaxPrvService.xhrPromise(xhrobj).then(
    function(resp)
       {

        if (resp.trim() =="success")
            {   
                CpePjService.emitAlertMsg(1, alertElems, 'Successful!', ' Project data has been updated.');
                $scope.refreshData(function(){
                    //update project data
                    $scope.projectitems=$scope.projectinfo[$scope.projectname].itemlist;
                    $scope.projectdata=$scope.projectinfo[$scope.projectname];
                    $scope.renderModal.displayPj(); });
            }
        else 
           { CpePjService.emitAlertMsg(4, alertElems, 'Failed!', ' Database connection error.');}
        }, 
     function(status){ 
        CpePjService.emitAlertMsg(4, alertElems, 'Error!', ' Web server connection error!'+status);

            });

}


//delete item submit

$scope.deleteItemSubmit = function(){

var alertElems = '#del-item-status';
var formdata= $("form#form-del-item").serializeArray();
var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST', 'php/cpepj/deleteitem.php?');
AjaxPrvService.xhrPromise(xhrobj).then(
    function(resp){
            if (resp.trim() =="success")
            { 
                CpePjService.emitAlertMsg(1, alertElems, 'Successful!', ' Items have been deleted.');

                $scope.refreshData(function(){
                console.log("call back go");
                //update project data
                $scope.projectitems=$scope.projectinfo[$scope.projectname].itemlist;
                });
            }
            else { CpePjService.emitAlertMsg(4, alertElems, 'Failed!', ' Database connection error!');}
       }, 
    function(status){
        CpePjService.emitAlertMsg(4, alertElems, 'Error!', ' Web server connection error!'+status);
            });


}


$scope.importCallback = function(){

          $scope.projectdata=$scope.projectinfo[$scope.projectname];
        $scope.projectitems=$scope.projectdata.itemlist;
                             }

//importitem Object -- everything about import items modal are inside.
$scope.importItemObj = {

validateFile: ImportService.validateFile.bind(this, $scope, '#import-item-status', 'spreadsheet'),
uploadItem: ImportService.uploadItem.bind(this, $scope,'#import-item-status', '#spreadsheet'), //note that the last argument is Jquery selector
resetValidator: ImportService.resetValidator.bind(this,$scope,'#import-item-status'),
preValidate:ImportService.preValidate

};



});




/*****************************************************************/
/*dbCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('dbCtrl', function($scope, $http, $window) {

$("#search-box").hide();

$scope.$parent.currentTab = 'dashboardPage';

$(function() {

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
            linearGradient: [0, 0, 800, 800],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(200, 200, 255)']
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
		    categories: [],
			crosshair: {
            width: 2,
            color: 'green',
			dashStyle:'dashdot',
        },
		
		labels: {
		style: {"color":"#666666",
		        "font-style": "oblique",
		        "font-weight":"bold"
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
            pointWidth: 20,
         animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            }
        
        }
    },
	
	title:{
	text:'Active Project Overview'
	
	},
	
	series:[{}]

};


var optionStatus =
{

        chart: {
            renderTo: 'containertwo',
			type: 'bar'
        },

	xAxis: {
	
	categories: [], // categories, read from function
		labels: {
		style: {"color":"#666666",
		        "font-style": "oblique",
		        "font-weight":"bold"
				}
		}
		  },

		
    yAxis: {
		
          min:0,
		  max:null, //auto-scale enabled
		  minTickInterval:5,
		  title: 'Number of Requests',
		  },
 
  
    plotOptions: {
        bar: {

            groupPadding: 0.1,
            dataLabels: {
                enabled: true,
				allowOverlap: true,
            
			style: {
			"font-size": "7px",
			"textOutline": "1px 1px contrast",
			"font-weight": "bold"
			}
            },

        animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            }
        
          }
    },
		
	
	
	title:{
	text:'Requests Status Tracking'
	
	},
	
	
	
//data is read from function
	series: [
		{name: 'In Progress', data: [], color: 'khaki'},
		{name: 'Fixed', data: [],  color: 'lightskyblue'},
		{name: 'Verified',data: [], color: 'mediumseagreen'},
        {name: 'Reopen',data: [], color: 'crimson'}]
};



$http({
method:'GET',
url:'php/cpepj/getdata.php?'+new Date().getTime(),
//data: {s: 'active'},
//header: {"Content-Type": "application/x-www-form-urlencoded"},

}).then (function(resp){


    var data = resp.data.pj;
    var pjlist = Object.keys(data);
	var countone=[], counttwo=[],countthree=[], countfour=[];//to store the occurrence of the 'in progress', 'fixed' and 'verified'
    var temp=[];
    var i=0;

    for (var prop in data){
    
    temp=temp.concat($window.Utility.datesCons(data[prop].datestart, data[prop].datefc, data[prop].daterc, data[prop].datevr, i));
    i++;

    }
		
        optionSchedule.series[0].data = temp;
		optionSchedule.series[0].name = 'Project Duration';
		optionSchedule.xAxis.categories = pjlist;
		

     
//forEach() to loop each item in each project	
	pjlist.forEach(function(pname){
	
	     var itemlist= data[pname]['itemlist'];
		 var tempone=0, temptwo=0, tempthree=0, tempfour=0;  //temp variable to count
	    
		itemlist.forEach(function(item){
		
			if (item['status']=='In Progress')
			  tempone++;
			else if (item['status']=='Fixed')
			  temptwo++;
			else if (item['status']=='Verified') 
			  tempthree++;
            else 
              tempfour++;   // =='Reopen'
			  
	});
		 //push the count to array
		 countone.push(tempone);
		 counttwo.push(temptwo);	 
		 countthree.push(tempthree);
         countfour.push(tempfour);
	});
	
	
		optionStatus.xAxis.categories =pjlist;
		optionStatus.series[0].data = countone; 
		optionStatus.series[1].data = counttwo; 
		optionStatus.series[2].data = countthree; 
        optionStatus.series[3].data = countfour; 
		//draw the graph
        var chart1 = new Highcharts.Chart(optionSchedule);
		var chart2 = new Highcharts.Chart(optionStatus);
		});


}, function(resp){
  console.log("something went wrong");
  console.log(resp);
});


    

});
