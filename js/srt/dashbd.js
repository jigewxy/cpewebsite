/*******************************************/
/**controller for the dash board page     **/
/*******************************************/

app.controller('srtDashCtrl', function($scope, $window, $http, reusableSrcs,$location){

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
//below function convert the 2017-02-02 to Date.UTC(2017,1,2) */         
  var scheduleData= {
            'category':[],
            'dates':[],  /*array of object */
            'name':'Project Duration',
       }


      var pjtitles=[];
      var temp=[]; // to store the formated dates 

/* loop through the database and process the date */
       $scope.entries.forEach(function(elems,index){
          
          var title= '['+elems.customer+'] '+elems.feature;
        
         pjtitles.push(title.slice(0,40));
         
        temp=temp.concat($window.Utility.datesCons(elems.requestdate, elems.fcdate, elems.rcdate, elems.vrdate, index));
     
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
