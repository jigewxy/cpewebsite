
//use module reveal design pattern

(function(window, document, $){
    var cpeRelModule = (function(){

        var g_xmlResource='',
            g_productlist={},
            g_productInScope='',
            g_scopeProductData={},
            g_currentCat={},
            g_currentProductCtx={},/*current product context = li element*/    
            g_alertMsg = '<div class="alert alert-warning"><strong> No entry is selected</strong></div>',
            g_successMsg ='<div class="alert alert-success"><strong>Successful! </strong>',
            g_errMsg = '<div class="alert alert-danger"><strong>Failed! </strong>';

         function getEntity(elems, tag){
            
            return elems.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
            
            }


        /*LEARNING -- define a $.ajax returning function to create a deferred object later */
        function getPdListDefer(){
            
            return $.ajax({
                url: 'data/cpereleases/product_list.xml',
                method: 'GET',   
            });
            
            
        }

        function initDatePicker(){
            
            $( ".date-picker" ).datepicker(
            
            {
            //here we can't use yyyy-mm-dd, instead it will show year number twice.
            dateFormat:"yy-mm-dd",
            maxDate:"+10y",
            minDate:"-10y"});
            }


        function updateProductList(){



            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange= function(){

                if (this.readyState==4 && this.status==200){

                    var resp = this.responseXML;

                /*before update, reset the product list */
                    g_productlist={'ojpro':[], 'oj':[], 'pws':[], 'consumer':[], 'mobile':[] };

                for (var prop in g_productlist)
                {
                    var list= resp.getElementsByTagName(prop)[0].getElementsByTagName('product');

                for (var i =0; i<list.length;i++)
                {
                    g_productlist[prop].push(list[i].childNodes[0].nodeValue);

                }

                }
                
                }
            }

            xhttp.open("GET", "data/cpereleases/product_list.xml");
            xhttp.setRequestHeader("cache-control", "no-cache");
            xhttp.send();
                
            
        }

        /*function to determine xml Database */
        function xmlUrl (arg){
        switch (arg)

            {
                case 'Officejet Pro':
                g_xmlResource= "data/cpereleases/ojpro_release.xml";
                break;

                case 'Officejet':
                g_xmlResource= "data/cpereleases/oj_release.xml";
                break;

                case 'Pagewide':
                g_xmlResource= "data/cpereleases/pws_release.xml";
                break;

                case 'Consumer':
                g_xmlResource= "data/cpereleases/ics_release.xml";
                break;

                case 'Mobile':
                g_xmlResource= "data/cpereleases/mobile_release.xml";
                break;

                default: 
                g_xmlResource= "data/cpereleases/ojpro_release.xml";
                break;
            }

        return g_xmlResource;

        }




        /* reset the list when press Delete Product Again*/
        function resetList (){

            $('.cat-sel').val('--Please Select--');
            document.getElementById('dyn-product-sel').innerHTML = '';
        }

        /* Display the fiscal year when slide bar moves */
        function displayYear (value){
            $('#add-product-status').html('');
            document.getElementById('show-year').innerHTML = value;

        }

        /* load dynamic product list used in delete product modal */

        function loadDynList (sel){


            var list= [];
            var selhtml='';
            sel=sel.trim();
                
                
            switch (sel)

            {

            case 'Officejet Pro':
            list=g_productlist['ojpro'];
            break;

            case 'Officejet':
            list=g_productlist['oj'];
            break;

            case 'Pagewide':
            list=g_productlist['pws'];
            break;

            case 'Consumer':
            list=g_productlist['consumer'];
            break;

            case 'Mobile':
            list=g_productlist['mobile'];
            break;

            default:
            list=[];
            break;
            }


            list.forEach(function(elems){

            selhtml+= '<option>' + elems +'</option>';


            })

            document.getElementById('dyn-product-sel').innerHTML = selhtml;


        }


        /*load category */
        function loadCat (arg){
            
            loadPartial(arg);
            //setTimeout(function(){$('div.panel-primary:first-child >div.panel-heading').click();}, 100); 
            setTimeout(function(){$('div.panel-primary:first-child li:first-child').click();}, 200);    
            
        }

        /*function to change the nav tab color */
        /*currentRel.navTabColor = function(id){

        $('li.nav-menu').css('background-color','#f8f8f8');
        $('li.nav-menu a').css('color','#777');
        $('li.'+id).css('background-color','#337ab7');
        $('a#'+id).css('color','white');

        }*/

        /*render the left navigation panel when product category selected */
        function loadPartial(arg){

        var cat = arg.innerHTML.trim();
        var xhttp = new XMLHttpRequest();
        var obj_list={};
        var arr_years=[];
        g_currentCat=arg;

        Utility.navTabColor(arg.id);
        /*wipe out existing release table - but why? */
        //document.getElementById('release-content').innerHTML = '';


        xhttp.onreadystatechange= function(){

        if (this.readyState==4 && this.status==200){
        
            var xmlDoc=this.responseXML.getElementsByTagName('productlist')[0];

            var years = xmlDoc.getElementsByTagName('year');
            var products= xmlDoc.getElementsByTagName('product');
        //loop year
            for (var i=0; i <years.length; i++)
            {
            var temp= years[i].childNodes[0].nodeValue;;
            obj_list[temp]=[];
            //loop product
            for (var j=0; j <products.length; j++)
            {
                if (products[j].getAttribute('year')==temp)
                {
                    obj_list[temp].push(products[j].childNodes[0].nodeValue);

                }

            }

            //sort product name in alphabetical order
            obj_list[temp].sort();

            }
            
                var panelgroup = '';

                var arr_years=Object.keys(obj_list);

            /* sort the arr_years to display the latest year first */
            /* for example: [2016, 2017, 2015] becomes [2017,2016,2015] */

                arr_years=arr_years.sort(function(a,b){
                    return b-a;
                })
                
            /* render the product list according to year */
                arr_years.forEach(function(year){
                var id= arg.id+ year;
                panelgroup+= '<div class="panel panel-primary"> <div class="panel panel-heading" data-toggle="collapse" data-target="#'+id+'"><center><h4>' +  year + '</h4></center></div> <div class="panel panel-body collapse in" id="'+id+'"><ul class="list-group">';
            
            obj_list[year].forEach(function(elems){

                panelgroup+= '<li class="list-group-item" onclick="cpeRelModule.loadTable(this)">'+ elems + '</li>';

            })

            panelgroup+='</ul></div></div>';


            });

            document.getElementById('product-group').innerHTML = panelgroup;

            /*select the first li element in the product list */
        

            
        }
        }

        xhttp.open("GET", xmlUrl(cat));
        xhttp.setRequestHeader("cache-control", "no-cache");
        xhttp.send();
        }


        /* load the release table for specific product */
        function loadTable(arg){


            var name = arg.innerHTML;
            g_currentProductCtx = arg;
                
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange= function(){

            if (this.readyState==4 && this.status==200){

                renderTable(this.responseXML, name);
            
            }
            }

            xhttp.open("GET", g_xmlResource);
            xhttp.setRequestHeader("cache-control", "no-cache");
            xhttp.send();
        }

        /* function to form up the release table */
        function renderTable (response, pname){

            /*parse the product name, example: ' Muscatel Lite ' become 'muscatelliteroot'*/
            /*LEARNING -- need to use regex to replace all occurence, or else it will just replace the first occurence. */
            //var tagname= pname.trim().replace(' ','').toLowerCase().concat('root');
            var tagname= pname.trim().replace(/ /g,'').toLowerCase().concat('root');
            g_productInScope=tagname;
            var xmlDoc= response.getElementsByTagName(tagname)[0];
            g_scopeProductData= xmlDoc;
            /* store 'release' nodes in array */
            var arr=xmlDoc.getElementsByTagName('release');


            var tbl_header = '<h3>'+pname+'</h3><hr>'+'<table class="table table-stripped table-hover table-bordered">'+'<tr><th>VR#</th><th>Version</th><th>VR Date</th><th>AREL</th><th class="cell-sarel">SAREL</th><th>NAREL</th><th>Branch</th><th>Update Type</th><th>Released By</th></tr>';
            var tbl_footer ='</table><input class="btn btn-success" value="Add" onclick="cpeRelModule.addEntry()">'+
                            ' <input class="btn btn-primary" value="Edit" onclick="cpeRelModule.editEntry()">'+
                            '<input class="btn btn-danger" value="Delete" onclick="cpeRelModule.deleteEntry()">';

            var tbl_body = '';


            for(var i=0; i<arr.length; i++){


            //x[i].getElementsByTagName("version")[0].childNodes[0].nodeValue
            tbl_body+= '<tr><td>'+ getEntity(arr[i], 'version')+'</td><td>'+getEntity(arr[i], 'fwversion')+'</td><td>'+
                        getEntity(arr[i], 'date')+'</td><td><a href='+getEntity(arr[i], 'arel')+' target="_blank">Link</a></td><td class="cell-sarel"><a href='+
                        getEntity(arr[i], 'sarel')+' target="_blank">Link</a></td><td><a href='+
                        getEntity(arr[i], 'narel')+' target="_blank">Link</a></td><td>'+getEntity(arr[i], 'branch')+'</td><td>'+
                        getEntity(arr[i], 'type')+'</td><td>'+getEntity(arr[i], 'owner')+'</td><tr>';
            };

            var table= tbl_header+ tbl_body+ tbl_footer;


            document.getElementById('release-content').innerHTML = table;

            /* check if the first .cell-sarel element is 'NA', if yes, hide the sarel cell */
            if($('td.cell-sarel a').eq(0).attr('href') == 'NA')
                $('.cell-sarel').hide();

        }


        function addEntry(){
            /*LEARNI=functionNG - $() and element itself has different properties */
        /* $() is a Jquery object which has all Jquery properties */
        //console.log($(g_currentCat).html());
        //  console.log(g_currentCat.textContent);
        $('#add-entry-modal').modal('show');
        $('input[name=date]').on({'keypress': Utility.validateDateInput.bind(this, 'input[name=date]'), 
                    'keyup': Utility.validateDateInput.bind(this, 'input[name=date]')});  
            /*pass values to hidden input - product and category */

        }

        function editEntry() {
            
        var category = g_currentCat.textContent;
        var sel_list ='';
        var sel_header ='<label> Choose a release to modify: </label> <select class="form-control" name="index" onchange="cpeRelModule.loadModifyTable(value)">';
        var sel_footer = '</select><hr>';
        var sel_body ='<option value="unset"> -- Select An Entry -- </option>';
                
        var arr = g_scopeProductData.getElementsByTagName('release');

            
        /* get select list */
            

        var selectlist = [];
            
            /*clear the input form while entering */
        $('#edit-form').html(''); 
            
        for(var i=0; i<arr.length; i++){

        selectlist.push(getEntity(arr[i], 'version'));

        sel_body +=  '<option value="'+i+'">'+ getEntity(arr[i], 'version') + '</option>';
            
        };
            

        sel_list = sel_header + sel_body + sel_footer;
            
        //var tbl_content =  tbl_body ;

        $('#select-box').html(sel_list);
            
        $('#modify-entry-modal').modal('show');
            
        /*LEARNING - $() and element itself has different properties */
        /* $() is a Jquery object which has all Jquery properties */
        //console.log($(g_currentCat).html());
        //  console.log(g_currentCat.textContent);
        $('input[name=date]').on({'keypress': Utility.validateDateInput.bind(this, 'input[name=date]'), 
                    'keyup': Utility.validateDateInput.bind(this, 'input[name=date]')});  
            
        }


        /*Render the modify box */

        function loadModifyTable (index){

            if (index=='unset')
                $('#edit-form').html(''); 
                
            else {
                
                var data= g_scopeProductData.getElementsByTagName('release')[index];
                var arr_label = ['VR#', 'Version', 'VR Date', 'AREL', 'SAREL','NAREL', 'Branch', 'Update Type', 'Released By'];
                var form_header = '<div class="form-group">';
                var form_footer= '<hr><input type="submit" class="btn btn-primary" value="Submit" onclick="cpeRelModule.entryChangeSubmit(event)"></div>';
                var form_body='';
                var i=0;
                    
                data.childNodes.forEach(function(prop){

                /*LEARNING -- filter only those element node , or else it will also loop those text nodes created by XML formatting (the line break) */
                /* the structure: element '<version>VR1</version> /n' contains 2 nodes: (1). #text -line break (2).element
                */
                if (prop.nodeType ==1)
                {

                    var x='';
                    var y='';
                        
                    if(i==2)
                        y=' date-picker';
                        
                    if (i==4)
                        x='<small><em>--Leave it as "NA" or blank if not applicable</em></small>';
                        
                    form_body += '<label>'+ arr_label[i] + x +'</label>'+'<input type="text" class="form-control modify-form'+y+'" name="'+ prop.nodeName
                        + '" value="'+ prop.textContent+'">';
                        i++;
                    }

                })
                    
                $('#edit-form').html(form_header+ form_body+form_footer);
                initDatePicker();
                }

        }


        /* Delete release entry function */

        function deleteEntry (){
            
            var ckbox ='';
            var ckbox_header='<select class="form-control" id="select-del-entry" name="deletion">';
            var options ='<option value="unset"> --Please select an entry --</option>';
            var ckbox_footer= '</select><br>'

        var data= g_scopeProductData.getElementsByTagName('release');
        /*LEARNING --data will be a HTMLcollection in this case,
        alternative is to use g_scopeProductData.childNodes, which will create a nodelist --- this is a better way 

        [] is the syntax sugar for Array.prototype
        [].forEach.call(data, function(child){  */
            
            [].forEach.call(data, function(child,index){ 
                /* Childnode is [1,3] not [0,2], because XML file is formated with line-break */
                var version = child.childNodes[1].innerHTML;
                var fwversion = child.childNodes[3].innerHTML;
                options += '<option value="'+index +'">'+version + ' -- [' + fwversion +']';
                
            })
            
            var ckbox = ckbox_header + options + ckbox_footer;
            
            $('#delete-modal-body').html(ckbox);
            $('#delete-entry-modal').modal('show');
            
        }

        function addProductSubmit (){
            
            var form_data = $('#add-product-form').serialize();;
            var successMsg= g_successMsg;
            var errMsg = g_errMsg;
            
            /*LEARNING -- be careful with dataType (expected response format) and contentType (data sending format)*/
            /*.success() and .error() are deprecated after Jquery 1.8, so use .fail() and .done() instead */
            /*clear the feedback message when add another product */

            
            
                $.ajax({
                    url: 'php/rel/add_product.php',
                    data: form_data,
                    method: 'POST',
                    //dataType: 'string', /* return data type: no need to define it as client will detect automatically */
                    contentType: 'application/x-www-form-urlencoded'
                    
                }).done(function(data){
                
                // loadPartial();
                    var fb = JSON.parse(data);
                    successMsg += fb.product +' has been added to ['+fb.cat+'] successfully!</div>';
                loadPartial(g_currentCat);
                    $('#add-product-status').html(successMsg);
                    /*don't forget to update product list */
                updateProductList();
                
                    
                }).fail(function(xhr,status, err){

                    errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
                    
                $('#add-product-status').html(errMsg);
                    
                }).always(function(xhr,status,err){
                    
                    
                    document.addEventListener('click', function(){
                        
                        $('#add-product-status').html(''); 
                        
                    })
                    
                
            });
            
            
        }


        /*submit delete product job */
            

        function delProductSubmit(){
            
            var formdata = $('#del-product-form').serialize();
                
                var successMsg= g_successMsg;
                var errMsg = g_errMsg;
            

            $.ajax({

                url: 'php/rel/delete_product.php',
                method: 'POST',
                data: formdata,
                contentType: 'application/x-www-form-urlencoded'
                })
                .done(function(data){
                
                /*load updated product list */
                loadPartial(g_currentCat);
                
                /*delete the current table if this product is deleted */
                if(g_currentProductCtx.innerHTML == $('#dyn-product-sel').val() )
                    document.getElementById('release-content').innerHTML = '';
                    
                
                var fb= JSON.parse(data);
                successMsg += fb.product +' has been removed from ['+fb.cat+'] successfully!</div>';
                
                $('#del-product-status').html(successMsg);
                
                /*don't forget to update product list */

                /*LEARNING -- reload the product delete list after the list been updated,need to use deferred promise here, while $.when() create a Deferred object, and when it is resolved, then reload the product list */
                
                $.when(getPdListDefer()).then( function(resp){
                        
                /*before update, reset the product list */
                        g_productlist={'ojpro':[], 'oj':[], 'pws':[], 'consumer':[], 'mobile':[] };
                            
                        for (var prop in g_productlist)
                        {
                        var list= resp.getElementsByTagName(prop)[0].getElementsByTagName('product');

                        for (var i =0; i<list.length;i++)
                        {
                            g_productlist[prop].push(list[i].childNodes[0].nodeValue);

                        }

                        } 
                    
                            loadDynList(fb.cat);
                        } );
                        

                    }).fail(function(xhr, status, err){
                        
                        errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
                            
                        $('#del-product-status').html(errMsg);
                        
                        
                    }).always(function(xhr, status,err){
                        
                        document.addEventListener('click', function(){
                            
                            $('#del-product-status').html('');   
                            
                        })
                
            
        })
            
            
            /*ajax call end */

        }

        function submitNewEntry (){
            
            var formdata= $('#form-add-release').serialize()+'&product='+g_productInScope+'&cat='+g_currentCat.innerHTML;

            var successMsg= g_successMsg;
            var errMsg = g_errMsg;
                
            $.ajax({
                url: 'php/rel/add_release.php',
                method:'POST',
                data: formdata,
                contentType: 'application/x-www-form-urlencoded'
                
            }).done(function(resp){
                var fb= JSON.parse(resp);
                successMsg += '['+fb.version+']'+fb.fwversion+' has been added! </div>';
            loadTable(g_currentProductCtx);
                $('#add-release-status').html(successMsg);
                document.addEventListener('click', function(){
                    
                $('#add-release-status').html('');
                    
                });
                
                
            }).fail(function(xhr,status, err){
                
                errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
                
                $('#add-release-status').html(errMsg);
                document.addEventListener('click', function(){
                    
                $('#add-release-status').html('');
                    
                });
            
        });
            
            
            
        }

        function entryChangeSubmit (e){

        /* prevent default action to close the modal */
            e.preventDefault();

            var successMsg= g_successMsg;
            var errMsg = g_errMsg;
                
            
            /* LEARNING.serialize() only works on certain type of DOM, such as <form> */
            var formdata= $('#form-edit-entry').serialize() + '&product='+g_productInScope +'&cat='+g_currentCat.innerHTML;
            
            $.ajax({
                url:'php/rel/edit_release.php',
                method: 'POST',
                data: formdata
            
            }).done(function(fb){

            successMsg += fb+ ' has been modified! </div>';
            loadTable(g_currentProductCtx);
            $('#edit-release-status').html(successMsg);
                    
            }).fail(function(xhr,status, err){
                
                errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
                
                $('#edit-release-status').html(errMsg);

                
            }).always(function(xhr,status,err){
                    
                $('#select-box select').val('unset');
                $('#select-box select').trigger('onchange');
                document.addEventListener('click', function(){
                
                $('#edit-release-status').html('');  
                    
                    
                })
                    
                
            });
            
        }

        function entryDeleteSubmit (){
            
                var formdata= $('#select-del-entry').serialize() + '&product='+g_productInScope +'&cat='+g_currentCat.innerHTML;
                var successMsg= g_successMsg;
                var errMsg = g_errMsg;
                if ($('#select-del-entry').val() =="unset")
                {
                    $('#del-release-alert').html(g_alertMsg);
                    /*add Jquery event listener to clear the alert message once new input given in select box */
                    $('#select-del-entry').change(function(){
                        $('#del-release-alert').html('');    
                    
                })
                
                
                }
                
                else{
                    
                    $('#del-release-alert').html('');
                    
                    $.ajax({
                        url: 'php/rel/delete_release.php',
                        method:'POST',
                        data:formdata   
                    }).done(function(resp){
                        
                        var fb = JSON.parse(resp);
                        successMsg += fb.version+' has been removed!';
                        loadTable(g_currentProductCtx);
                        /*LEARNING - instead of AJAX call, can remove the option from the DOM in the modal, which is more efficient */
                        $('#select-del-entry option').get(Number(fb.index)+1).remove();
                        $('#del-release-status').html(successMsg);
                        
                    }).fail(function(xhr, status, err){
                        
                        errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
                        
                        $('#edit-release-status').html(errMsg);
                        
                    }).always(function(xhr,status,err){
                        
                            
                        $('#select-del-entry').val('unset');
                        $('#select-del-entry').trigger('onchange');
                        document.addEventListener('click', function(){
                        $('#del-release-status').html('');  
                    
                    
                })   
                    
                    
                });
                    
                }  
            }

            //return function that needed externally
            return {initDatePicker: initDatePicker,
                    updateProductList: updateProductList,
                    loadCat:loadCat,
                    loadTable:loadTable,
                    addEntry:addEntry,
                    editEntry:editEntry,
                    deleteEntry:deleteEntry,
                    resetList:resetList,
                    loadModifyTable:loadModifyTable,
                    entryDeleteSubmit:entryDeleteSubmit,
                    displayYear:displayYear,
                    addProductSubmit:addProductSubmit,
                    delProductSubmit:delProductSubmit,
                    loadDynList:loadDynList,
                    submitNewEntry:submitNewEntry,
                    entryChangeSubmit:entryChangeSubmit };
        })();
/*some initializations are required */
    $(document).ready(function(){

//set up hover behavior
//Utility.topNavHover();
/*trigger a click on first menu */
        $('ul#list-cat li:first-child>a').click();

        /*initialize date-picker */
        cpeRelModule.initDatePicker();

        /*preload product list for later use */
        cpeRelModule.updateProductList();
        //setTimeout(function(){$('div.panel-primary:first-child >div.panel-heading').click();}, 100); 
        setTimeout(function(){$('div.panel-primary:first-child li:first-child').click();}, 100); 


    });
    
 if (!window.cpeRelModule) window.cpeRelModule=cpeRelModule;

})(window, document, jQuery);


    
		
	
	
	