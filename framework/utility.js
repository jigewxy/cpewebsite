//Jquery extend function to test if 1). input has number 2). input as date
$.fn.extend({
 inputHasNumber : function(){
  return  /\d/.test(this.val());
     
 },
    
inputAsDate: function(){
    
    //console.log(this); return r.fn.init {}  which is the constructor function in Jquery
    return /\d|-/.test(this.val());
}
      
})


//global Utility Object
var Utility = Utility || {};

//Utility function to prevent number input
//input : CSS selector of the input
//Output: Remove any keyed-in numbers.
//usage: As callback function with keypress or keyup  
Utility.preventNumberInput = function(elems){


if($(elems).inputHasNumber())
    $(elems).val(function(){
      var x= $(elems).val();
        
        return x.substring(0, x.length-1);
        //return Array.prototype.pop.call(x);
        /*can't use pop on string */
        //return Array.prototype.pop(x);
        
        
    });}

//Utility function to validate input for the date-picker:
//input : CSS selector of the input
//Output: Remove any keyed-in characters other than "0-9" and '-'
//usage: As callback function with keypress or keyup  

Utility.validateDateInput = function(elems){
    
 if(!$(elems).inputAsDate()){
    $(elems).val(function(){
      var x= $(elems).val();
        
        return x.substring(0, x.length-1);
        
        
    })
    
    
    
    }
       
}

//Below function add input character counter to either <input> or <textarea> field,
//a is the CSS selector for the input field, b is the css selector for the counter display field
//c is the maximum character allowed for a. This function has dependency on Jquery.
/* LEARNING 1. CUT and PASTE event triggers before content change, so must put delay
2. setTimeout() will evaluate the expression instantly, so first para can't be a function call.
for example: setTimeout(charCounter(), 100) won't work, but setTimeout(charCounter, 100) will work */
Utility.inputCharCounter=function(a,b,c){

var cnt = c;
$(a).on({'keyup': function(){ charCounter();}, 
'cut': function(){setTimeout(charCounter, 100);},
'paste': function(){setTimeout(charCounter, 100);}
})

var charCounter = function (){
    
/* LEARNING - note that this here is not the Jquery object, must convert it to Jquery object first */
var len= $(a).val().length;
$(b).html(cnt-len);


}


}


/*function to change the nav tab color when click */
Utility.navTabColor =function(id){

console.log('Utility.navTabColor called');
$('li.nav-menu').css('background-color','#f8f8f8');
$('li.nav-menu a').css('color','#777');
$('li.'+id).css('background-color','#337ab7');
$('a#'+id).css('color','white');

$('li.'+id).off('mouseenter mouseleave');

}


//function to change the hover color of top navigation bar

Utility.topNavHover =function(){

$("li.nav-menu").on({'mouseenter': function(){$(this).css({"background-color":"#337ab7","cursor":"pointer"}).children("a").css({"color":"white"});

}, 'mouseleave': function(){$(this).css({"background-color":"#f8f8f8"}).children("a").css({"color":"#777"}); }})

}





// Process dates to use in highchart object
 Utility.dateProcess=function(arg)
{
  
 var x= new Date(arg);
  
  var day= x.getDate();
  var year=x.getFullYear();
  var month=x.getMonth();
  
 return 'Date.UTC('+year+','+month+','+day+')';
  
}


/*constructor function for the appropriate data structure for highchart usage */
Utility.datesCons=function(requestdate, fcdate, rcdate, vrdate, index){

        return [{
            "x": index,
            "low": eval(this.dateProcess(requestdate)),
            "high": eval(this.dateProcess(fcdate)),
            "name": "FC cycle",
            "color": "deepskyblue"
        },
        {
            "x": index,
            "low": eval(this.dateProcess(fcdate)),
            "high": eval(this.dateProcess(rcdate)),
            "name": "RC cycle",
            "color": "lemonchiffon"
        },
        {
            "x": index,
            "low": eval(this.dateProcess(rcdate)),
            "high": eval(this.dateProcess(vrdate)),
            "name": "VR cycle",
            "color": "pink"
        }];

      }


//validate the input field with datepicker, need to disable the input if dates is not applicable. 

function inputBoxValidate(event){

 var id = event.target.id;

 /* begin and end position can be both negative and positive, position mattters here */
var temp = '#'+ id.slice(0,-6)+ '-input';

if ($("#"+id).prop("checked")==true) {

// LEARNING - set to readonly will not work for datepicker - need to turn off the eventlistener and add it back.
$(temp).prop("value", "N/A");
$(temp).prop("disabled", true);
//$(temp).off("focus");
}

else 
{
$(temp).prop("value", null);
$(temp).prop("disabled", false);
//$(temp).on("focus",datepicker());

}


if ($(temp).prop("value") == "N/A")
{
	$("#"+id).prop("checked", true);
}
	
}

