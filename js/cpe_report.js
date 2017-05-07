
$(function() {

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


var optionStatus =
{

        chart: {
            renderTo: 'containerx',
			type: 'bar'
        },

	xAxis: {
	
	categories: [], // projectname, read from function
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
            dataLabels: {
                enabled: true,
				allowOverlap: true,
            
			style: {
			"font-size": "7px",
			"textOutline": "1px 1px contrast",
			"font-weight": "bold"
			}
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
		{name: 'Verified',data: [], color: 'mediumseagreen'}]
};


// need to add the error status check to the AJAX call, or the response is silent with no error shown
$.getJSON('data/dashboard.json', function(data) {
		var countone=[], counttwo=[],countthree=[];//to store the occurrence of the 'in progress', 'fixed' and 'verified'
		for (i=0; i<data.dates.length;i++)
		{
		// use eval() to convert the string Date.UTC() to a date value;
		data.dates[i].low = eval(data.dates[i].low);
		data.dates[i].high = eval(data.dates[i].high);
		} 
		
        optionSchedule.series[0].data = data.dates;
		optionSchedule.series[0].name = data.name;
		optionSchedule.xAxis.categories = data.category;
		
//forEach() to loop each item in each project	
	data.category.forEach(function(pname){
	
	     var itemlist= data[pname]['itemlist'];
		 var tempone=0, temptwo=0, tempthree=0;  //temp variable to count
	    
		itemlist.forEach(function(item){
		
			if (item['status']=='In Progress')
			  tempone++;
			else if (item['status']=='Fixed')
			  temptwo++;
			else // =='verified'
			  tempthree++;
			  
	});
		 //push the count to array
		 countone.push(tempone);
		 counttwo.push(temptwo);	 
		 countthree.push(tempthree);
	});
	
	
		optionStatus.xAxis.categories = data.category;
		optionStatus.series[0].data = countone; 
		optionStatus.series[1].data = counttwo; 
		optionStatus.series[2].data = countthree; 

		//draw the graph
        var chart1 = new Highcharts.Chart(optionSchedule);
		var chart2 = new Highcharts.Chart(optionStatus);
		});
    });
