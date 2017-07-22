/*****************************************************************/
/* CompProCtrl - controller for completedproject.html */
/*****************************************************************/
app.controller('CompProCtrl', function($scope, $http, $window, $timeout, CpePjService, CustomEnums, AjaxPrvService, ImportService) {

 var pool = {
     'Officejet Pro': {},
	 'Officejet':{},
	 'Page Wide':{},
	 'Consumer':{},
	 'Mobile':{}
	};

 init();

 
function init() {


	$("#search-box").hide();
	$scope.$parent.currentTab = 'completed';
    $scope.activePj = false;

	$scope.tabs = [

		{link: '#ojpro-projects', label: 'Officejet Pro', tag: 'ojpro'},
		{link: '#oj-projects', label:'Officejet',tag:'oj'},
		{link: '#pws-projects', label:'Page Wide', tag:'pws'},
		{link: '#ics-projects', label:'Consumer', tag:'ics'},
		{link: '#mobile-projects', label:'Mobile', tag:'mobile'}

    ];

	$(document).ready(function(){

     refreshData(function(){ $timeout(function(){$('.tab-list').eq(0).find('a').click();}, 100);});
       Utility.addAdminClass(['li#li-add-pd', 'li#li-del-pd', 'li#li-add-pj', 'li#li-del-pj']);
       Utility.renderAdminFields();

	});

};



//Note: refreshData() allows multiple callback functions as arguments.
function refreshData (){

//clear the datapool object while refreshing the data everytime
	pool = {
		'Officejet Pro': {},
		'Officejet':{},
		'Page Wide':{},
		'Consumer':{},
		'Mobile':{}
		};

//convert arguments to array of callback functions.
	var callback = _.toArray(arguments);

	// Ajax service with dummy data as input for GET request

	var xhrobj = AjaxPrvService.xhrConfig('', 'GET', 'php/compj/getpjlist.php?');

		AjaxPrvService.xhrPromise(xhrobj).then(function(resp){

           if(resp.state==='SUCCESS')
		   {
				if(resp.pjlist ===undefined)
				{
				$scope.alertcontent= 'Failed to connect to Databse, please contact Admin.';
				$('div#cust-alert-modal').modal('show');
				}
				else{
				$scope.pjlist= resp.pjlist;
				$scope.pjlistArray = _.pluck($scope.pjlist, 'project_name');
				$scope.fullPdList = _.pluck(resp.pdlist, 'product_name');

				_.each(resp.pdlist, function(value, index){

					pool[value.division][value.product_name]={'projectlist':[], 'year':value.year};

				});

				for (var prop in $scope.pjlist)
				{
					pool = processResp($scope.pjlist[prop], pool);
				
				}

				$scope.datapool = pool;

					if(callback.length!==0){
							_.each(callback, function(fn, i){fn();});			
					   if(resp.pjlist ===undefined)
						 {
						$scope.alertcontent= 'Your Database is empty!';
						$('div#cust-alert-modal').modal('show');
						 }
						else{
						$scope.pjlist= resp.pjlist;
						$scope.pjlistArray = _.pluck($scope.pjlist, 'project_name');
						$scope.fullPdList = _.pluck(resp.pdlist, 'product_name');

						_.each(resp.pdlist, function(value, index){

							pool[value.division][value.product_name]={'projectlist':[], 'year':value.year};

						});

						for (var prop in $scope.pjlist)
						{
							pool = processResp($scope.pjlist[prop], pool);
						
						}

						$scope.datapool = pool;

							if(callback.length!==0){
							_.each(callback, function(fn, i){fn();});
					}
					}
		        }
			 }
		   }
           else 
		   {
            $scope.alertcontent= 'Failed to connect to Database, please contact Admin.';
            $('div#cust-alert-modal').modal('show');

		   }
			}, function(resp){

			console.log("something went wrong");
			alert('Webserver not responding');

		});

}



//Function to refresh data, with optional callback function (multiple) as arguments
 

// function to process response data from ajax service and save it in datapool 
function processResp(pj, datapool) {

	var cat = pj.division;
	var pdname = pj.product_name;
	var pjname = pj.project_name;
	var pjid = pj.id;
	var version = pj.revision;

// if product not exist in object, create one;
	if(datapool[cat][pdname] ===undefined)
	{
	datapool[cat][pdname] = { 'year': pj.year, 'projectlist': []};
	}

	datapool[cat][pdname]['projectlist'].push({'name':pjname, 'rev':version, 'id':pjid});
	
	return datapool;

}


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
	if($scope.datapool===undefined){ $scope.productdata = null;} 
	else {$scope.productdata = $scope.datapool[tab.label];}

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

	var xhrobj = AjaxPrvService.xhrConfig(id, 'POST',  'php/compj/getpjdata.php?', null, 'singleValue');

	AjaxPrvService.xhrPromise(xhrobj).then(function(resp){

		if(resp.state===undefined){
			$scope.alertcontent= 'Failed to connect to Database, please contact Admin.';
			$('div#cust-alert-modal').modal('show');
         }
        else if(resp.state.trim()==="SUCCESS")
        {

				$scope.projectdata= resp.pjdata;
				$scope.itemlist = resp.itemlist;
			//LEARNING --pick the 'type' as a individual array

			if ($scope.itemlist.length===0)
			{
				//if itemlist is empty, set defectcount and featurecount to 0 as default;
				_.extend($scope.projectdata,{'defectcount':0, 'featurecount':0});
			}

			else
			{
				var type_arr = _.pluck($scope.itemlist, 'type');

			//get defect fix and feature count
			var cntObj= _.countBy(type_arr, function(df){
			
				return df==='Defect Fix'?'defectcount':'featurecount';

			}); 

			cntObj['featurecount']= type_arr.length - cntObj['defectcount'];


			_.extend($scope.projectdata, cntObj);
		
		//display release modal after database is set
			$scope.renderModal.displayPj();
	      }
		} 
		else 
		{
          $scope.alertcontent= 'Failed to connect to Databse, please contact Admin.';
         $('div#cust-alert-modal').modal('show');

		}


		}, function(resp){

			$scope.alertcontent= 'Failed to connect to Website, please contact Admin.';
             $('div#cust-alert-modal').modal('show');

		});

}





$scope.renderModal = {


	displayPj: function(){
		$('#release-modal').modal('show');


      Utility.addAdminClass(['button#btn-import-item', 'button#btn-add-item','button#btn-edit-item','button#btn-del-item']);
      Utility.renderAdminFields();

		$timeout(function(){ 
			//set tooltip height as the same as the table
				$('div#div-tooltip').height($('div.table-summary').height());
				$('td.rel-date').toArray().forEach(function(elems){
						if ($(elems).text() ==="0000-00-00") 
						$(elems).text('Not Applicable');
				})	
			}, 200);
			var tooltip = $scope.projectdata.tooltip;
			//replace line break with seperate paragraph.
			if(tooltip!==null){
				tooltip = tooltip.replace(/\r\n/g, '</p><p class="p-tooltip">');
				$('div#div-tooltip').html('<p class="p-tooltip">'+ tooltip + '</p>');
			}
			else {
				$('div#div-tooltip').html('');
			}
	
	},

	addPd: function(){
   		 $('#add-pd-modal').modal('show').find('div#add-pd-status').html('');;

//Add product object 

		$scope.addPdObj = {

			alertElems: 'div#add-pd-status',
			submit: function(){

				//serialize form data as name/value pair
				var data= $('#form-add-pd').serializeArray();
				var cat = data[0].value;
				var pname = data[1].value;
				var flag =0;  //
				var found ='';
				var that = this;

				//check if product name already exist in product lists
				_.each($scope.fullPdList, function(elems, index){

				if (elems.toLowerCase()== pname.trim().toLowerCase())   
					{flag=1;}
				})

				if (flag)
				{
				CpePjService.emitAlertMsg(4, that.alertElems, 'Error!', pname+' already exist in database!');
				}
				else
				{
					var xhrobj = AjaxPrvService.xhrConfig(data,'POST','php/compj/addpd.php?');

					AjaxPrvService.xhrPromise(xhrobj).then(function(resp){
            
			     var resp = resp.trim();

                   if(resp==='AUTHERROR'){    
                        CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                   }
				//if successful, add new product to datapool and update the scope.
				 else if (resp==="SUCCESS")
					{
						CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!', name+' has been successfully added!');
						refreshData(function(){	$scope.productdata = $scope.datapool[$scope.selectedTab.label];}) 
					}
					else 
					{  
						CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!', ' Database connection error!');
					}

					},  function(error){
						CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!', 'something is wrong with server! '+error);
					});

				}

			}
	    }
	},
    
	delPd: function(){
			$('#del-pd-modal').modal('show').find('div#del-pd-status').html('');
		//delete product object

			$scope.delPdObj = {


			alertElems: 'div#del-pd-status',

			submit: function(){
			
				var data = $('#form-del-product').serializeArray();
				var that = this;
				var currentDiv = data[0].value;
				var pdname = data[1].value;
				var xhrObj =  AjaxPrvService.xhrConfig(data,'POST','php/compj/delpd.php?');
					AjaxPrvService.xhrPromise(xhrObj).then(function(resp){
                         var resp = resp.trim();
                         if(resp==='AUTHERROR'){    
                          CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                          }
						else if(resp ==="SUCCESS")
							{
								CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!', pdname+' has been removed!');
								refreshData(function(){	
								$scope.productdata = $scope.datapool[$scope.selectedTab.label];
								that.evalProductList(currentDiv); //update productlist in delete modal
							}); 
							}
							else 
							{  
								CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!', ' Database connection error!');
							}

							},  function(error){
								CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!', 'something is wrong with server! '+error);
							});
			},

			//evaluate the product list based on selected category
				evalProductList: function(tabLabel){

					this.pdList = _.keys($scope.datapool[tabLabel]);

			},

				trackDelBoxChange: function () {

					this.delPressed = false;

				}, 


				deleteButtonPressed: function () {

					this.delPressed = true;

				}
			};
 	},

	addPj: function(){
		$('#add-pj-modal').modal('show').find('input.date-picker').attr("pattern","20[0-2]\\d-(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d|3[0-1])").css("width","50%").end()
		                                .find('div#add-pj-comp-status').html('').end()
										.find('input.checkbox-date-na').on('change', function(e){Utility.datePickerValidate(e);});

		//construct addPjObj
		$scope.addPjObj = {

			alertElems: 'div#add-pj-comp-status',

		//evaluate the product list based on selected category
			evalProductList: function(tabLabel){

				this.pdList = _.keys($scope.datapool[tabLabel]);

			},
			submit: function(){
				var data = $('#add-new-pj').serializeArray();
				var pjname = data[2].value.trim();
				var that=this;
				if (_.indexOf($scope.pjlistArray, pjname)!==-1)
				{
						CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', pjname+' already exist in database');
				}
				else 
				{
						var xhrObj =  AjaxPrvService.xhrConfig(data,'POST','php/compj/addPj.php?');
						AjaxPrvService.xhrPromise(xhrObj).then(function(resp){

					 var resp = resp.trim();
                         if(resp==='AUTHERROR'){    
                          CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                          }
						else if(resp ==="SUCCESS")
						{
							CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!  ', pjname+' has been added');
							refreshData(function(){	
							$scope.productdata = $scope.datapool[$scope.selectedTab.label];
						}); 
						}
						else 
						{  
							CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', ' Database connection error!');
						}
						
						},  function(error){
							CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', 'something is wrong with server! '+error);
						}); 
				}
				}

		};

	},
	delPj: function(){

		$('#del-pj-modal').modal('show').find('div#del-pj-comp-status').html('');

		//construct delPjObj
		$scope.delPjObj ={

			alertElems: 'div#del-pj-comp-status',
			evalPdList: function(tabLabel){
					this.delBtnPressed = false;
					this.pj = null;
					this.product =null;
					this.division = tabLabel;
					this.pdList = _.keys($scope.datapool[tabLabel]);
			},
			evalPjList: function(pdname){

				var temp = $scope.datapool[this.division][pdname]['projectlist'];
				this.pjList=_.pluck(temp,'name');	
			},

			pjChange: function () {

				this.delBtnPressed = false;

			},

			preDeletion: function () {

				this.delBtnPressed = true;

			},

			submit: function(){
				var data = $('#form-del-pj').serializeArray();
				var that=this;
				var pdname = data[1].value;
				var pjname = data[2].value;

				var xhrObj =  AjaxPrvService.xhrConfig(data,'POST','php/compj/delPj.php?');
				AjaxPrvService.xhrPromise(xhrObj).then(function(resp){

				   var resp = resp.trim();
                if(resp==='AUTHERROR'){    
                          CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                          }
				else if(resp ==="SUCCESS")
				  {
					CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!  ', pjname+' has been deleted');
					refreshData(function(){	
					//update data for current tab and project list in the modal;
					$scope.productdata = $scope.datapool[$scope.selectedTab.label];
					that.evalPjList(pdname); 
				}); 

				}
				else 
				{  
					CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', ' Database connection error!');
				} 
				
				},  function(error){
					CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', 'something is wrong with server! '+error);
				});
		  	 }
			}


	},

	addItem: function(){

		$('#add-item-modal').modal('show').find('input[type=text]').val('').end()
		                                  .find('#add-item-status').val('');
        //construct addItemObj
		$scope.addItemObj ={
			alertElems: 'div#add-item-status', 
			submit: function(){    
				var data = $('#form-add-item').serializeArray();
				var pjid = data[1].value;
				var that = this;
				var xhrObj =  AjaxPrvService.xhrConfig(data,'POST','php/compj/addItem.php?');
				AjaxPrvService.xhrPromise(xhrObj).then(function(resp){

			       var resp = resp.trim();
                 if(resp==='AUTHERROR'){    
                     CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                          }
				else if(resp ==="SUCCESS")
				{
					CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!  ', 'Item has been added!');
					refreshData(function(){	
					//update data for current tab and project list in the modal;
					$scope.setDatabase(pjid);
				    }); 
					//clear input field after successful submission
					$('#add-item-modal').find('input[type=text]').val('');
				}
				else 
				{  
					CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', ' Database connection error!');
				} 
				
				},  function(error){
					CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', 'something is wrong with server! '+error);
				});


			}
		};

		// Add property 'pj' with specified __get function to addItemObj, just in case it read undefined values;
		Object.defineProperty($scope.addItemObj, 'pj', {
		get: function(){
			if($scope.projectdata===undefined)
						return {'id':null, 'project_name':null};
			else 
						return {'id':$scope.projectdata['id'], 'name':$scope.projectdata['project_name']};
		}});

	},

// edititem modal show and object setup
    editItem: function(){
  
       $('#edit-item-modal').modal('show').find('input.date-picker').attr("pattern","20[0-2]\\d-(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d|3[0-1])").attr('placeholder',"Leave it empty if not applicable").end()
	   									  .find('div#edit-item-status').html('');
        //LEARNING - alternative of for loop. converting 0000-00-00 to empty.
		[0,1,2].forEach(function(i){
			if($('input.date-publish').eq(i).val() ==="0000-00-00") {
             $('input.date-publish').val('');}
		});

               //construct addItemObj
		$scope.editItemObj ={
			alertElems: 'div#edit-item-status', 
			pj: {'id': $scope.projectdata['id'], 'name':$scope.projectdata['project_name']},
			submit: function(){    
				var data = $('#form-edit-item').serializeArray();
				var that = this;
				var xhrObj =  AjaxPrvService.xhrConfig(data,'POST','php/compj/editItem.php?');
				AjaxPrvService.xhrPromise(xhrObj).then(function(resp){

			     var resp = resp.trim();
              if(resp==='AUTHERROR'){    
                          CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                          }
			  else if(resp ==="SUCCESS")
				{
					CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!  ', 'Changes has been saved!');
					refreshData(function(){	
					//update data for current tab and project list in the modal;
					$scope.setDatabase(that.pj.id);
				    }); 
				}
				else 
				{  
					CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', ' Database connection error!');
				} 
				
				
				},  function(error){
					CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!  ', 'something is wrong with server! '+error);
				});


			},
          };

		},

    //deleteitem modal and object setup
    deleteItem:function(){

		$('#remove-item-modal').modal('show').find('div#del-item-comp-status').html('');

		$scope.delItemObj ={
		alertElems: 'div#del-item-comp-status',
		pjid: $scope.projectdata['id'],
		ckbox:[],
		ckboxCheck: function(){

			if(_.indexOf(this.ckbox,true) === -1)
			 return false;
			 else
			 return true;
		},
		submit: function(){
			var data= $("form#form-del-item").serializeArray();
			var that=this;
			var xhrobj = AjaxPrvService.xhrConfig(data, 'POST', 'php/compj/deleteitem.php?');
			AjaxPrvService.xhrPromise(xhrobj).then(
				function(resp){

				  var resp = resp.trim();
                     if(resp==='AUTHERROR'){    
                          CpePjService.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');
                          }
					else if(resp ==="SUCCESS")
					{ 
						CpePjService.emitAlertMsg(1, that.alertElems, 'Successful!', ' Items have been deleted.');

						refreshData(function(){
						//update project data
						$scope.setDatabase(that.pjid);
						//reset checkbox value
						that.ckbox=[]; 
						});
					}
					else { CpePjService.emitAlertMsg(4, that.alertElems, 'Failed!', ' Database connection error!');}
					
					}, 
				function(status){
					CpePjService.emitAlertMsg(4, that.alertElems, 'Error!', ' Web server connection error!'+status);
				});

		}
		}
	},

	importItem: function(){

	$("#import-item-modal").modal("show");

	 $scope.projectid = $scope.projectdata['id'];

	  //LEARNING: it is not a good practice to pass $scope as a parameter to service/factory, hence rewrite this portion of code.
    $scope.importItemObj = {
            
            previewlist:[],
            uploadCallback: function(){ 
                 return    $scope.setDatabase($scope.projectid); 
				}, 
            previewModalShow: function(list){
              $scope.importItemObj.previewlist = list;
                $scope.$digest($('div#preview-modal').modal('show'));
            },
            preValidate:ImportService.preValidate,
            validateFile: function(){ImportService.validateFile('#import-item-status', 'spreadsheet', $scope.importItemObj.previewModalShow);},
            uploadItem: function(){ImportService.uploadItem ('#import-item-status', '#spreadsheet', $scope.projectid, $scope.importItemObj.uploadCallback);}, //note that the last argument is Jquery selector
            resetValidator: function(){ImportService.resetValidator('#import-item-status');},
   
         };


	},
	
   selectRight: {

		type: CpePjService.currySelectRight(".type-modify-box"),
		component: CpePjService.currySelectRight(".component-modify-box"),

		category: function(arg)
		{
			$("select[name='pjcat']").val(arg);
		}
	}

}

});
