/*******************************************/
/**controller for the dash board page     **/
/*******************************************/

app.controller('srtDashCtrl', function($scope, $location, AjaxPrvService, SrtService){


this.completed = false;
var thisCtrl = this;
thisCtrl.entries = [];
thisCtrl.pjids = [];
thisCtrl.categories = [];

$(document).ready(function(){

    $('li#dash-tab').addClass('selected-tab').siblings().removeClass('selected-tab');
    refreshData(thisCtrl.renderChart);

});


function refreshData (callback) {

    var xhrobj = AjaxPrvService.xhrConfig('ACTIVE', 'POST','php/srt/getpjlist.php?', null, 'singleValue');

    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 
    //note that .then() create another promise, to avoid confusion, we use callback() here to deal with this aychronization

    if(resp.state.trim() === 'ERROR')
    {
      alert('Database connection error');
      return;
    }

    else {
    thisCtrl.entries = resp.entries;
    if(callback!==undefined)
    callback();
  
    }}, function(resp){
    console.log("something went wrong");
    console.log(resp);
 });

}

this.setPjData = function(id){

    var xhrobj = AjaxPrvService.xhrConfig(id, 'POST','php/srt/getpj.php?', null, 'singleValue');
    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 
    //note that .then() create another promise, to avoid confusion, we use callback() here to deal with this aychronization
    if (resp.state.trim()==='ERROR'){
         alert('Database connection error');
    }

    else {
    thisCtrl.pjdata = resp.pjdata[0];
    thisCtrl.itemlist = resp.itemlist;
    }

    }, function(resp){
    console.log("something went wrong");
    console.log(resp);
});



}

this.setDatabase= function(e){

    var pj = e.target.innerHTML;

   var pjid = thisCtrl.pjids[_.indexOf(thisCtrl.categories, pj)];

   thisCtrl.pjid = pjid;
   thisCtrl.setPjData(pjid);
   thisCtrl.renderModal.display();

};

//this.renderModal = new SrtService.renderModal(thisCtrl);



this.renderModal ={

    display: function(id){

        $('#display-pj-modal').modal('show');
       Utility.addAdminClass(['button#btn-add-item', 'button#btn-edit-item', 'button#btn-del-item']);
       Utility.renderAdminFields();

     },
      
    addItem: function(){

            $('#add-item-modal').modal('show').find('input[name=crid]').css('width', '50%').end()
                                              .find('input[type=text]').val('').end()
                                              .find('textarea').val('').end()
                                              .find('div#add-item-status').html('');

            var pjid = thisCtrl.pjid;
            thisCtrl.addItemObj = {

                alertElems: 'div#add-item-status',
                submit: function(){
                var formdata = $('form#form-add-item').serializeArray();
                var that = this;
                var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST','php/srt/additem.php?');
                    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 

                if(data.trim()==='AUTHERROR'){
                   
                   Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');

                  }

                 else if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Item has been added successfully');
                        refreshData(function(){thisCtrl.setPjData(pjid);});
                        }

                 else {
                        Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Database connection error, please contact Admin');
                        }

                    }, function(resp){

                    Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Web Server is down, please contact Admin');
                });
                }
             };
            },

    editItem: function(){
         $('#edit-item-modal').modal('show').find('table#table-summary-edit tr td:first-child').css('font-size', '15px').end()
                                            .find('input[type=date]').attr('pattern', Utility.dateReg)
                                            .find('div#edit-item-status').html('');
         var pjid = thisCtrl.pjid;
         thisCtrl.editItemObj = {

                alertElems: 'div#edit-item-status',
                submit: function(){
                var formdata = $('form#form-edit-item').serializeArray();
                var that = this;
                var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST','php/srt/edititem.php?');
                    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 

                  if(data.trim()==='AUTHERROR'){
                   
                   Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');

                  }

                 else if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'You changes have been successfully saved.');
                        refreshData(function(){thisCtrl.setPjData(pjid);});
                        }

                    else {
                        Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Database connection error, please contact Admin');
                        }

                    }, function(resp){

                    Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Web Server is down, please contact Admin');
                });
                }
             };
       
            },
    delItem: function(){

        var pjid= thisCtrl.pjid;
        thisCtrl.delItemObj = {
            alertElems: 'div#del-item-status',
            delClicked: false,
            selected: "initial",//hardcode the initial state
            click: function(){
                 if (this.selected === 'initial')
                 {
                  return;
                 }
                 else 
                 {this.delClicked = true;
                 }
            },
            reset: function(){
                this.delClicked = false;
                },
            submit: function(){
                var formdata = $('form#form-del-item').serializeArray();
                var that = this;
                var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST','php/srt/deleteitem.php?');
                    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 

                if(data.trim()==='AUTHERROR'){
                   
                   Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');

                  }

                 else if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Item has been deleted.');
                        refreshData(function(){ thisCtrl.setPjData(pjid);that.selected="initial";});
                        }

                    else {
                        Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Database connection error, please contact Admin');
                        }

                    }, function(resp){

                    Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Web Server is down, please contact Admin');
                });

            }
 

        };

        $('#del-item-modal').modal('show').find('div#del-item-status').html('');;
   

    }
            
   };



this.renderChart = function(){

        var now= new Date();
        
        var band_start= new Date();
        var onequarter= new Date();
        var scheduleData= {
                        'category':[],
                        'dates':[],  
                        'name':'Project Duration',
                };


        var pjtitles = [],
            pjids = [],
            temp=[]; // to store the formated dates 

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

                 //  return elems;
                /*LEARNING - ng-click doesn't work on dynamic generated HTML, it need to be recompiled, use below shorthand funcion instead*/
                //	return '<p onclick="angular.element(this).scope().setDatabase(this)">'+ this.value + '</p>';
                    return '<p class="pj-title">'+ this.value + '</p>';
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
        /* loop through the database and process the date */
        thisCtrl.entries.forEach(function(elems,index){
                
            var title= '['+elems.customer+'] '+elems.feature;
            var id = elems.id;
            pjtitles.push(title.slice(0,40));
            pjids.push(id);    
            temp=temp.concat(Utility.datesCons(elems.datestart, elems.datefc, elems.daterc, elems.datevr, index));
            
            });

       optionSchedule.xAxis.categories= thisCtrl.categories = scheduleData.category= pjtitles;

       // thisCtrl.categories=scheduleData.category;


        optionSchedule.series[0].data =  scheduleData.dates = temp;
        optionSchedule.series[0].name =  scheduleData.name;
               thisCtrl.pjids = pjids;
      //  optionSchedule.xAxis.categories =  scheduleData.category;


    var chart1 = new Highcharts.Chart(optionSchedule);

    angular.element('p.pj-title').on('click', function(event){
        
        thisCtrl.setDatabase(event);
    });

}
});
