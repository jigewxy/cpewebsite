/*********************************************/
/**controller for the completed project page**/
/*********************************************/
app.controller('srtCompletedCtrl', function($location, AjaxPrvService, SrtService){

//controller name as compCtrl

this.completed = true; //determine whether the firmware link field should be shown or not.
//initialize the date for the filter
var today = new Date();
this.startDate = new Date(today.setFullYear(today.getFullYear() -1));
this.endDate = new Date();

var thisCtrl = this;

$(document).ready(function(){

    $('li#completed-tab').addClass('selected-tab').siblings().removeClass('selected-tab');
    SrtService.refreshData(thisCtrl, 'COMPLETED');
    //enable admin control access
    Utility.addAdminClass(['li#li-add-pj', 'li#li-del-pj']);
    Utility.renderAdminFields();

    
});


//note that in the ng-repeat= "x in Obj | filter: filterObj.func", it is executing in global context, thus 
// "THIS" is the window Object when it is called. 
this.filterObj = {

	reset: function(){
	//	reset the date for the filter
        var today = new Date();
		thisCtrl.startDate = new Date(today.setFullYear(today.getFullYear() -1));
		thisCtrl.endDate = new Date();
	},
	func: function(arg){
		var pjdate= new Date(arg.datevr);
		if ((pjdate < thisCtrl.startDate)|| (pjdate > thisCtrl.endDate))
		return false;
		else
		return true;
	}

};


this.renderModal ={

    display: function(id){
        SrtService.setPjData(thisCtrl, id);
        $('#display-pj-modal').modal('show');
       Utility.addAdminClass(['button#btn-add-item', 'button#btn-edit-item', 'button#btn-del-item']);
       Utility.renderAdminFields();


     },
    
    dispTooltip: function(){
       SrtService.setPjData(thisCtrl, id);
        $('#tooltip-modal').modal('show');

    },

    addPj: function(){



        $('#add-pj-modal').modal('show').find('input').css('width', '60%').end()
                                        .find('input.full-length').css('width', '100%').end()
                                        .find('input.btn').css('width', '20%').end()
                                        .find('input[type=date]').attr('pattern', Utility.dateReg).val('').end()
                                        .find('input[type=text]').val('').end()
                                        .find('textarea').val('').end()
                                        .find('div#add-pj.status').html('');
    
           thisCtrl.addPjObj={

                alertElems: 'div#add-pj-status',
                submit: function(){

                    var formdata = $('form#form-add-pj').serializeArray();    
                    console.log(formdata);
                    var that = this;
                    var xhrobj = AjaxPrvService.xhrConfig(formdata, 'POST','php/srt/addpj.php?');
                    AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 
                        
                   if(data.trim()==='AUTHERROR'){
                   
                   Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');

                   }  else if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Project has been added successfully');
						
         				 SrtService.refreshData(thisCtrl, 'COMPLETED');
                        }

                    else {
                        Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Database connection error, please contact Admin');
                        }

                    }, function(resp){

                    Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Web Server is down, please contact Admin');
                });
                }
            }

    },

    delPj: function(){
        $('#del-pj-modal').modal('show');
        thisCtrl.delPjObj = {
            alertElems: 'div#del-pj-status',
            delClicked: false,
            option: thisCtrl.entries[0].id, //always default to first project item for options
            click: function(){
                   this.delClicked = true;
                    },
            reset: function(){
                  this.delClicked = false;
                    },
            submit: function(){

                    thisCtrl.delClicked = false;
                    var formdata = $('form#form-del-pj').serializeArray();
                        var pjid = formdata[0].value;
                        var that = this;
                        var xhrobj = AjaxPrvService.xhrConfig(pjid, 'POST','php/srt/delpj.php?', null, 'singleValue');
                        AjaxPrvService.xhrPromise(xhrobj).then(function(resp){ 

                   if(data.trim()==='AUTHERROR'){
                   
                   Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Authentication failure, please log in first');

                    }  else if (resp.trim()==='SUCCESS')
                             {
                            Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Project has been deleted');
							SrtService.refreshData(thisCtrl, 'COMPLETED',function(){that.option = thisCtrl.entries[0].id;
                                                   that.delClicked = false;} );
                            }

                        else {
                            Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Database connection error, please contact Admin');
                            }

                        }, function(resp){

                        Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Web Server is down, please contact Admin');
                    });
                }
                }
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
							SrtService.refreshData(thisCtrl, 'COMPLETED', function(){ SrtService.setPjData(thisCtrl, pjid);} );
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
                                            .find('input[type=date]').attr('pattern', Utility.dateReg);
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

                  } else if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'You changes have been successfully saved.');
						SrtService.refreshData(thisCtrl, 'COMPLETED', function(){SrtService.setPjData(thisCtrl, pjid);} );
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
                 console.log(this.selected);
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

                  }  else  if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Item has been deleted.');
						SrtService.refreshData(thisCtrl, 'COMPLETED', function(){ SrtService.setPjData(thisCtrl, pjid);that.selected="initial";} );
                        }

                    else {
                        Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Database connection error, please contact Admin');
                        }

                    }, function(resp){

                    Utility.emitAlertMsg(4, that.alertElems, 'Failed! ', 'Web Server is down, please contact Admin');
                });

            }
 

        };

        $('#del-item-modal').modal('show');
   

    }
            
   };






});
