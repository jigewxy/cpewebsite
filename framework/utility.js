//Jquery extend function to test if 1). input has number 2). input as date

(function (window, document, $){

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


Utility.dateReg = new RegExp('20[0-2]\\d-(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d|3[0-1])');

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

Utility.datePickerValidate =function(event){

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
	
};

//emit alert message
Utility.emitAlertMsg = function(type, elems, msgHeader, msgBody, count, callback){

      var alertType = {1:'success', 2:'info', 3:'warning', 4:'danger'};
      var msgType = alertType[type];  
      
      if (count===undefined)
       {
       $(elems).hide().show('slow').html('<div class="alert alert-'+ msgType+'"><strong>'+msgHeader+'</strong>'+ msgBody+
                    '<button class="close" data-dismiss="alert">&times;</button></div>');
       }

       else 
      { 
       $(elems).hide().show('slow').html('<div class="alert alert-'+ msgType+'"><strong>'+msgHeader+'</strong>'+ msgBody+
                    '<button class="close" data-dismiss="alert">&times;</button></div>');

      var timer = setInterval(function(){ 
                    if(count>0)
                   { count--;
                    $(elems).html('<div class="alert alert-'+ msgType+'"><strong>'+msgHeader+'</strong>'+ msgBody+ 
                    '<button class="close" data-dismiss="alert">'+count+'&times;</button></div>');
                   }
                   else 
                  { clearInterval(timer);
                    if(callback !==undefined)
                      callback();
                  }
            
                 }, 1000);

            }
          };

Utility.hookLoginAnchorHttps = function(){

    $('#anchor-login').attr('href', function(){
    if(location.hostname ==="localhost")
    return "https://localhost/cpewebsite/auth/auth.php"; 
    else 
    return "https://cpse.ijp.sgp.rd.hpicorp.net/auth/auth.php";
    });

    $('#anchor-logout').attr('href', function(){
    if(location.hostname ==="localhost")
    return "https://localhost/cpewebsite/auth/logout.php"; 
    else 
    return "https://cpse.ijp.sgp.rd.hpicorp.net/auth/logout.php";
    });
};



Utility.hookLoginAnchor = function(){

    $('#anchor-login').attr('href', function(){
    if(location.hostname ==="localhost")
    return "http://localhost:8080/cpewebsite/auth/auth.php"; 
    else 
    return "http://cpse.ijp.sgp.rd.hpicorp.net/auth/auth.php";
    });

    $('#anchor-logout').attr('href', function(){
    if(location.hostname ==="localhost")
    return "http://localhost:8080/cpewebsite/auth/logout.php"; 
    else 
    return "http://cpse.ijp.sgp.rd.hpicorp.net/auth/logout.php";
    });
};


Utility.redirectHttps = function(){

             var referer = document.referrer;
             //if the referer is https protocol, just use it
               if (referer.search(/^https/)!==-1)
                   location.replace(referer);
            //if the referer is not https protocol, modify the URL to be secure connection
                else 
                 { referrer = document.referrer.replace(':8080','').replace('http', 'https');
                   location.replace(referrer);}
                };

Utility.redirectHttp = function(){

             var referer = document.referrer;
             location.replace(referer);
}

Utility.getCookie = function (name) {

    var reg = new RegExp('('+name+'=.*?[;]) | (' + name+"=.*)");  //detect cookie in the mid or near the end.
    var result = document.cookie.match(reg);
    
    return result;
  
};


Utility.setCookie = function (name, value, days) {

if (days === undefined)
{
    document.cookie = name + "=" + value + ";path=/";

}
else {

    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));

    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
   }

};

Utility.addAdminClass = function (elems){

    var state = Utility.authState;

    _.each(elems, function(i){

    $(i).addClass('admin-'+state);

    });

};

//manages the admin-only features
Utility.renderAdminFields = function(){

$('.admin-fail').css('opacity', '0.5').off().on('click', function(){
  $('#alert-modal').modal('show');
});  

$('.admin-pass').show();

}


Utility.checkAuth = function(arg){

if (arg===null )
   return 'fail';
else if (arg[0].indexOf('pass') === -1 )
   return 'fail';
else 
   return 'pass';

};

//initialize authState value;
Utility.authState = Utility.checkAuth(Utility.getCookie('auth'));;


window.Utility = Utility;
window.jQuery = $;



})(window, document, jQuery);
