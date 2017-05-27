$.fn.extend({
 inputHasNumber : function(){
  return  /\d/.test(this.val());
     
 },
    
inputAsDate: function(){
    
    //console.log(this); return r.fn.init {}  which is the constructor function in Jquery
    return /\d|-/.test(this.val());
}
      
})


//Prevent Number Input
function preventNumberInput(){
    
    
if($('#name').inputHasNumber())
    $('#name').val(function(){
      var x= $('#name').val();
        
        return x.substring(0, x.length-1);
        //return Array.prototype.pop.call(x);
        /*can't use pop on string */
        //return Array.prototype.pop(x);
        
        
    });}


function validateDateInput(){
    
 if(!$('#name').inputAsDate()){
    $('#name').val(function(){
      var x= $('#name').val();
        
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
function inputCharCounter(a,b,c){

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
function G_navTabColor(id){

console.log('g_navtabcolor called');
$('li.nav-menu').css('background-color','#f8f8f8');
$('li.nav-menu a').css('color','#777');
$('li.'+id).css('background-color','#337ab7');
$('a#'+id).css('color','white');

$('li.'+id).off('mouseenter mouseleave');

}


//function to change the hover color of top navigation bar

function G_topNavHover (){

$("li.nav-menu").on({'mouseenter': function(){$(this).css({"background-color":"#337ab7","cursor":"pointer"}).children("a").css({"color":"white"});

}, 'mouseleave': function(){$(this).css({"background-color":"#f8f8f8"}).children("a").css({"color":"#777"}); }})

}