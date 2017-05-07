
/* utility functions & directives which are reusable in different modules */

var utilApp= angular.module('reuseableMod', []);

utilApp.factory('reusableSrcs', function(){

/*set the regular expression for date picker */
/*set the status color in itemlist */
var statusColor= function(args) 

{
  switch (args)
  
{
case "In Progress":
    return "iteminprogress";
	
case "Fixed":
    return "itemfixed";
	
case "Verified":
    return "itemverified";
	
default:

return "bg-default";

}};




return {statusColor:statusColor};
	
	
});



/* directive definition for std-modal-footer */
utilApp.directive("stdModalFooter", function() {
	
	return {
		
	restrict: "EA",
    template: "<div class='modal-footer'><button id='item-add-button' class='btn btn-success admin' data-toggle='modal' data-target='#add-item-modal''> Add </button>\
	<button class='btn btn-primary admin' id='item-edit-button' data-toggle='modal' data-target='#modify-item-modal' ng-click='evalCkBox(selectedEntry, activeOrComp)'> Edit </button>\
	<button type='button' id='item-del-button' class='btn btn-danger admin' data-toggle='modal' data-target='#delete-item-modal''>Delete </button>\
	<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div>"	
	
	};
	
	
	
});

/* directive definition for std-region-select */
utilApp.directive("stdRegionSelect", function() {
	
	return {
		
	restrict: "EA",
    template: "<select class='srt-region-select form-control' name='region'>\
               <option>North America</option>\
               <option>EMEA</option>\
               <option>Asia Pacific</option>\
               <option>China</option>\
               </select>"	
	
	};
	
	
	
});

/*directive definition for std-add-entry */

utilApp.directive("stdAddEntry", function(){
	
	
	return {
		
		scope:{

			activeOrComp:"@",
		},
		restrict: "EA",
		templateUrl: "srt/std-add-project-form.html",
		
			
	};
	
});


/*directive definition for std-show-entry */

utilApp.directive("stdShowEntry", function(){
	
	
	return {
		
		scope:{
			selectedEntry : "=",
		},
		restrict: "EA",
		templateUrl: "srt/std-show-entry.html",
		
			
	};
	
});




/*directive definition for std-add-item-form */


utilApp.directive("stdAddItemForm", function(){
	
	
	return {
/*need to define isolated scope in order to reuse it in other controller*/		
		scope: {
		 	newItemNum : "@newItemNum",   /* left side binds to attribute name,  right side binds to directive */
            rootIndex : "@rootIndex",
            activeOrComp: "@activeOrComp"			
		},
		restrict: "EA",
		templateUrl: "srt/std-add-item-form.html",
		replace: false

				
	};
	
});


/*directive definition for std-add-entry */

utilApp.directive("stdModifyItemForm", function(){
	
	
	return {
		
		scope:{
			activeOrComp: "@activeOrComp",	
			selectedEntry: "=selectedEntry"
			
		},
		restrict: "EA",
		templateUrl: "srt/std-modify-item-form.html",
		replace: false
		
			
	};
	
});





