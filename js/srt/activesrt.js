/*******************************************/
/**controller for the active project page **/
/*******************************************/
app.controller('srtActiveCtrl', function($timeout, $rootScope, $location, AjaxPrvService, reusableSrcs, presetChkBox) {




//this.$parent.activeOrComp = true; 
//this.$parent.currentRoute= $location.url();
this.moveClicked=false;
this.completed = false; //determine whether the firmware link field should be shown or not.
var thisCtrl = this;


$(document).ready(function(){
    //load data
    refreshData();
    //simulate click event
    $timeout(function(){$('button#btn-state').click();}, 200);

    $('li.tab-menu').removeClass('selected-tab');
    $('li#active-tab').addClass('selected-tab');
    
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


//set up filter object with headers and filter functions
this.CustFilterObj = {


    region: function(){

            var temp = {
                header: ['North America','EMEA', 'Asia Pacific', 'China'],
                fn: filterFnConstructor(['North America','EMEA', 'Asia Pacific', 'China'], 'region'),
                headerColor: ['header-first', 'header-second', 'header-third', 'header-fourth'],
                tableColor: ['table-first', 'table-second', 'table-third', 'table-fourth']
            };

           thisCtrl.filterObjArray = _.zip(temp.header, temp.fn, temp.headerColor, temp.tableColor);
            $('button.btn-filter').removeClass('btn-warning');
            $('button#btn-region').addClass('btn-warning');

           },

    state: function() {

          var temp = {
                    header:  ['Projects Ongoing','Project Upcoming', 'Projects On Hold'],
                    fn: filterFnConstructor(['Ongoing','Upcoming', 'On Hold'], 'state'),
                    headerColor: ['header-first', 'header-second', 'header-third'],
                    tableColor: ['table-first', 'table-second', 'table-third']
                };

            thisCtrl.filterObjArray = _.zip(temp.header, temp.fn, temp.headerColor, temp.tableColor);
            $('button.btn-filter').removeClass('btn-warning');
            $('button#btn-state').addClass('btn-warning');

            }



 };


//filter function constructor
//input  arr -> array of strings like ['North America','EMEA', 'Asia Pacific', 'China']
//input prop -> property name like region or state
//output: array of filter functions.        

function filterFnConstructor (arr, prop){
 
  var fnArray = [];
  console.log(prop);

  _.each(arr, function(val){
    
    var fn = function (arg){
        if (arg[prop] === val)
        return true;
        else 
        return false;
    }
   
   fnArray.push(fn);

  })

 return fnArray;


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
    thisCtrl.pjid = thisCtrl.pjdata.id;
    thisCtrl.itemlist = resp.itemlist;
    }

    }, function(resp){
    console.log("something went wrong");
    console.log(resp);
});

}





this.renderModal ={

    display: function(){

        $('#active-srt-modal').modal('show');

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
                        if (resp.trim()==='SUCCESS')
                        {
                        Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Project has been added successfully');
                        refreshData();
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

                            if (resp.trim()==='SUCCESS')
                            {
                            Utility.emitAlertMsg(1, that.alertElems, 'Success! ', 'Project has been deleted');
                            refreshData(function(){that.option = thisCtrl.entries[0].id;
                                                   that.delClicked = false;});
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

                  if (resp.trim()==='SUCCESS')
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
         $('#edit-item-modal').modal('show').find('table#table-summary-edit tr td:first-child').css('font-size', '15px');

    }
            
   };


});
