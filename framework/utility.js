$.fn.extend({

 inputHasNumber : function(){
  return  /\d/.test(this.val());
     
 },
    
inputAsDate: function(){
    
    //console.log(this); return r.fn.init {}  which is the constructor function in Jquery
    return /\d|-/.test(this.val());
}
    
    
})


function preventNumberInput(){
    
    
if($('#name').inputHasNumber())
    $('#name').val(function(){
      var x= $('#name').val();
        
        return x.substring(0, x.length-1);
        //return Array.prototype.pop.call(x);
        /*can't use pop on string */
        //return Array.prototype.pop(x);
        
        
    })
    ;}


function validateDateInput(){
    
 if(!$('#name').inputAsDate()){
    $('#name').val(function(){
      var x= $('#name').val();
        
        return x.substring(0, x.length-1);
        
        
    })
    
    
    
    }
    
    
    
}