
(function(window, document, $){
var g_numberoftools =0;
var g_successmsg ='<div class="alert alert-success"><strong>Successful! </strong>';
var g_errmsg = '<div class="alert alert-danger"><strong>Failed! </strong>';
var g_alltools ={};

$(document).ready(function(){

loadContent();

Utility.hookLoginAnchor();

//add event listener for add button
$('#btn-add').on('click', function(){

        $("#add-modal").modal('show');

        //framwork function in utility.js, to add input character counter 
        Utility.inputCharCounter("textarea[name=description]", "span#char-count", 200);

            $("#btn-add-entry").click(function(){

            var d='entryid='+(g_numberoftools+1)+'&'+ $("#form-new-entry").serialize();

    $.ajax({
    url:'php/cpetools/addnewtool.php',
    method: 'POST',
    data: d

        }).done(function(resp){

        //resp= JSON.parse(resp);

        resp = resp.trim();
        if (resp ==="AUTHERROR")
            { Utility.emitAlertMsg(4, 'div#add-status-update', 'Failed! ', ' Authentication failure.');  }
        else if (resp === "SUCCESS")
        {
            Utility.emitAlertMsg(1, 'div#add-status-update', 'Success! ', ' New Entry has been added!');
            loadContent();
        }
        else 
           Utility.emitAlertMsg(4, 'div#add-status-update', 'Failed! ', ' Database connection error!');
    
        }).fail(function(xhr, error,status){

        console.log('failed');

        Utility.emitAlertMsg(4, 'div#add-status-update', 'Failed! ', error);

        }).always(function(xhr, error,status){

        $(document).on('click', function(){
        $('div#add-status-update').html('');
        })
        });
        })
    });


    //add event listener for edit button

    $('#btn-edit').on('click', function(){

    $("#edit-modal").modal('show');


    loadEditList();


    $('#select-edit').on('change', function(e){

    var i=e.target.value-1;
    if(i<0){

    $("#entry-to-edit").html('');

    }

    else{
    var title='<form id="form-edit-entry"><label class="control-label">Name of Tool: </label><input class="form-control"  \
    name ="title" type="text" value="'+g_alltools[i].title +'"><br>';

    var link = '<label class="control-label">Link: </label> \
    <textarea class="form-control" rows=4 name="link" type="text">'+g_alltools[i].link+'</textarea><br>';

    var desc = '<label class="control-label">Description: </label> \
    <textarea class="form-control" rows=4 name="description" type="text">'+g_alltools[i].description+'</textarea></form>';

    $("#entry-to-edit").html(title+link+desc);
    }


})

//add event listener for edit submit button
$("#btn-edit-submit").on('click', function(){

    //LEARNING psudo selector return a nodelist; and querySelector() doesn't accept pesudo selector
    //var index= document.querySelector("select#select-edit option:selected");
    // for unknown reason .val() can't read the value :
    //console.log($("#select-edit").val());
    var index=$("#select-edit option:selected")[0].value;

    if(index == 0){

    alert('No entry selected!');

    } else

    {
    var d= 'entryid='+index+'&'+$("#form-edit-entry").serialize();
    
    $.ajax({
    url:'php/cpetools/edittool.php',
    method: 'POST',
    data: d
    
    }).done(function(resp){

    resp= JSON.parse(resp);
    successmsg = g_successmsg + resp.title + ' has been Modified </div>'
    $('div#edit-status-update').html(successmsg);
    loadContent();


    }).fail(function(xhr, error,status){

    errmsg= g_errmsg +error + status + '</div>';

    }).always(function(xhr,error,status){

    $(document).on('click', function(){

    $('div#edit-status-update').html('');
    })

    });
}})});


$("#btn-delete").click(function(){

    $("#delete-modal").modal('show');

    loadDeleteList();

    $("button#btn-delete-submit").click(function(e){
    //learning index can also be used in the selected option

    var hook = $("#select-delete option:selected")[0];
    var d= hook.value;
    var i = hook.index;
    var content= hook.text;
    d= 'entryid='+d;

    $.ajax({
    url: './php/cpetools/deletetool.php',
    method: 'POST',
    data: d
    }).done(function(resp){

    // resp=JSON.parse(resp);
    console.log(resp);
    successmsg = g_successmsg +'['+content + '] has been deleted </div>';
    $("div#delete-status-update").html(successmsg);

    //learning - alternative is to get a deferred object from the ajax call in loadContent(), however unset the entry 
    //in the array is easier and faster; note that, after delete, the array length won't be affected, it will add a "undefined" entry
    //we can use it here because forEach() will skip the undefined member;
    delete g_alltools[i];
    loadContent();
    console.log(g_alltools);
    loadDeleteList();

    }) 



    })


});

//disable the admin buttons when the authentication fails
Utility.renderAdminFields();


});


function loadContent(){
    //add timestamp into the URL to prevent cache loading
    $.get('php/cpetools/gettools.php?'+new Date().getTime(), function(resp){
    // $.get('php/cpetools/gettools.php', function(resp){

    console.log('Successful!');
    resp = JSON.parse(resp);
    g_alltools = resp;
    var temp = '';

    g_numberoftools = resp.length;
    resp.forEach(function(value){

    temp+='<div><h3>'+ value.title+'</h3>' + '<hr><a href='+ value.link +' target="_blank">'+ value.link + "</a><blockquote><pre>"
    + value.description + "</pre></blockquote></div><br>";
    });

    $('div#main-content').html(temp);


    }).fail(function(xhr, error,status){

        console.log(error+status);

    });



}


function loadEditList(){

    var list = '<select class="form-control" name="entry" id="select-edit"><option value="0">--Please Select An Entry --</option>';

    g_alltools.forEach(function(entry){

    list+='<option value="'+ entry.entryid+'">' + entry.entryid + '. ' + entry.title + '</option>';

    })

    list+='</select><hr>';

    $('#select-edit').html(list);

}


function loadDeleteList(){

    var selbox = '<select class="form-control" name="entrytodel" id="select-delete">';

    g_alltools.forEach(function(value){

    selbox+= '<option value="' + value.entryid+ '">' + value.title + '</option>';


    })

    selbox += '</select>';

    $("div#select-delete").html(selbox);

    }


})(window, document, jQuery);



