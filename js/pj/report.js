/*****************************************************************/
/*reportCtrl - controller for dashboard.html
/*****************************************************************/
app.controller('reportCtrl', function($scope, $http, $window, $timeout, CpePjService, CustomEnums, AjaxPrvService) {


	/* combine all db and save it in $scope.repo */
function init (){
    
    $scope.$parent.currentTab = 'reportPage';
    $scope.alertcontent = "";

};

init();

//counter function for the defect fix, new feature, major roll, minor roll;
function iterCount (arr, prop, value){

    var memo =0;
    var temp = _.pluck(arr, prop);

    if(value ===undefined)
    return _.reduce(temp, function(memo,b){ return parseInt(memo)+ parseInt(b);});
    else 
    return  _.countBy(temp, function(elems){ return elems===value?'yes':'no';});

}


$scope.filterObj ={

    pjdata: null,
    pjsummary: {num: null, uniquefw: null, roi:null, defect:null, feature:null, major:null, minor:null },
    itemcount: null,
    reset: function(){
        var today= new Date();
        $scope.dateModel.enddate = new Date();
        $scope.dateModel.startdate = new Date(today.setFullYear(today.getFullYear()-1));

    },

    //precheck if the input dates are valid or not
    onSubmitCheck: function(){
    

        var errdates = ['0000-00-00', null, undefined, 0, ''];

        if (_.indexOf(errdates, $scope.dateModel.startdate) !== -1 || _.indexOf(errdates, $scope.dateModel.enddate) !== -1)

        {	
            $scope.alertcontent = "Your Start date or end date format is not correct, please modify it and re-submit.";
            $("div#cust-alert-modal").modal('show'); 
            return false;
        }
        else if( $scope.dateModel.startdate > $scope.dateModel.enddate)
        {     
            $scope.alertcontent = "Start date must be earlier than end date, please modify it and re-submit.";
            $("div#cust-alert-modal").modal('show'); 
            return false;
        }

    else 
            return true;


    },

    submit: function(){

                    var data = $('#form-filter-date').serializeArray();
                    var that= this;
                    var memo =0;

                    if (this.onSubmitCheck() === false)
                    {return; }

                    else {
                    var xhrObj =  AjaxPrvService.xhrConfig(data,'POST','php/compj/datefilter.php?');
                        AjaxPrvService.xhrPromise(xhrObj).then(function(resp){

                            if(resp.status === 'success')
                            {
                            var tcount = resp.typecount;
                            that.pjdata = resp.pjdata;
                            that.pjsummary = { num: resp.pjdata.length,
                                                uniquefw: iterCount(resp.pjdata, 'uniquefw') ||0,
                                                // roi: iterCount(resp.data, 'roi'),
                                                feature: tcount[0]===undefined? 0 : tcount[0].count,                                            
                                                defect: tcount[1]===undefined? 0 : tcount[1].count,
                                                major: iterCount(resp.pjdata, 'cat', 'Major roll')['yes'] || 0,
                                                minor: iterCount(resp.pjdata, 'cat', 'Minor roll')['yes'] || 0
                                                }
                            that.itemcount = resp.itemcount;
                        
                            }
                
                                else 
                                {  
                                    $scope.alertcontent = "Data base connection error, please contact admin!";
                                    $("div#cust-alert-modal").modal('show');
                                }
                                

                                },  function(error){
                                {  
                                    $scope.alertcontent = "Web server connection error, please contact admin!";
                                    $("div#cust-alert-modal").modal('show');
                                }
                                });



                            }


                    }
                }


});