(function(Utility){

    $(document).ready(function(){


        
$('#btn-return'). on('click', function(){

location.replace(document.referrer);

})


    $("button#btn-login").on('click', function(){
    
    var formdata= $("form#form-login").serialize();
    var temp= formdata.replace('&', 'x');

    if(/[A-Za-z0-9]+$/.test(temp)===false){

       Utility.emitAlertMsg(4, 'div#login-status', 'Invalid Character detected!', ' Please use only A-Z and 0-9');
      }

   else{
        $.ajax({
            url: '../php/login/login.php',
            method: 'POST',
            data: formdata
        }).done(function(resp){

             respObj = JSON.parse(resp);
            switch (respObj.state.trim())
            {
               case 'success':
               var count=5;
               Utility.emitAlertMsg(1, 'div#login-status', 'Log in successful!', ' Redirecting...', count, Utility.redirectHttps);
               Utility.authChk = true;
               Utility.ssid = respObj.ssid;

               break;

               case 'wrong username':
               Utility.emitAlertMsg(4, 'div#login-status', 'Log in failed!', ' Username does not exist!');
               Utility.authChk = false;
               Utility.ssid = respObj.ssid;
               break;

               case 'wrong password':
               Utility.emitAlertMsg(4, 'div#login-status', 'Log in failed!', ' Password is wrong!');
               Utility.authChk = false;
               Utility.ssid = respObj.ssid;
               break;
              
               default:
               Utility.emitAlertMsg(4, 'div#login-status', 'Log in failed!', ' Database connection error, please contact Admin!');
               Utility.authChk = false;
               Utility.ssid = '';
               break;

            }

        }).fail(function(xhr, error,status){

              Utility.emitAlertMsg(4, 'div#login-status', 'Log in failed!', ' Web Server connection error, please contact Admin!');

        }).always(function(xhr, error, status){

            console.log(Utility.authChk);
            console.log(Utility.ssid);
            console.log('always....')});
      } 
  })

 });





})(window.Utility);