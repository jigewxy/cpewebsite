<?php 

include 'template/setcookie.php';

?>

<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Expires" content="Tue, 01 Jan 1995 12:12:12 GMT">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-control" content="no-cache">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src ="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="framework/underscore-min.js"></script>
<script src="framework/utility.js"></script>
<script type ="text/javascript" src="js/cpe_release.js"></script>
<script src="framework/utility.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" >
<link rel = "stylesheet" href = "style/cpe_release_style.css">
</head>
<body>

<div class="container-fluid">

<nav class="navbar navbar-default">
<div class="container-fluid">
  <ul class="nav navbar-nav" id="list-cat">
  <li class="nav-menu ojpro-link"><a id="ojpro-link">Officejet Pro</a></li>
  <li class="nav-menu oj-link"><a id="oj-link">Officejet</a></li>
  <li class="nav-menu pws-link"><a id="pws-link">Pagewide</a></li>
  <li class="nav-menu ics-link"><a id="ics-link">Consumer</a></li>
  <li class="nav-menu mobile-link"><a id="mobile-link">Mobile</a></li>
  </ul>
  <ul class="nav navbar-nav navbar-right">
        <?php include 'template/navlist.php'; ?>
  </ul>
</div>
</nav>

</div>

<div class="container-fluid">
<div class="col-md-2">
<div class="tool-menu">
  <ul class="list-group"> 
  <li class="list-group-item tool-box admin-<?php echo $_SESSION['auth'] ?>" id="li-add-product"><center><img src="images/add_project.png"></center> <span class="overlay-add overlay"><div class="overlay-text">Add Product</div></span></li>
  <li class="list-group-item tool-box admin-<?php echo $_SESSION['auth'] ?>" id="li-del-product"><center><img src="images/project_delete.png"></center> <span class="overlay-del overlay"><div class="overlay-text">Delete Product</div></span></li>
 </ul>
 </div>
<div id="product-group" class="panel-group">
<!--place holder for product list, load from cpe_release.js -->
</div>

</div>




<div class="col-md-9">
<div id="release-content">
<!--place holder for release table, load from cpe_release.js -->

</div> 
</div>

</div>

<!-- Add-product-modal begins here -->
<div class="modal fade" id="add-product-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                    <h4 class="modal-title text-primary"><center>Add New Product</center></h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
            <form id="add-product-form">
            <label class="control-label"><small>Fiscal Year :</small><span id="show-year" class="text-primary">Use slider below</span></label>
            <input type="range" min="2000" max="2030" class="form-control input-sm" name="year" onchange="cpeRelModule.displayYear(this.value)">

            <label class="control-label"><small>Category</small></label>
                <select class="form-control cat-sel" name="cat">
                <option>Officejet Pro</option>
                <option>Officejet</option>
                <option>Pagewide</option>
                <option>Consumer</option>
                <option>Mobile</option>
                </select>

            <br>
            <label class="control-label"><small>Product Name</small></label>
                <input type="text" class="form-control input-sm" name="product"  required>
            <hr>
            <div id='add-product-status'></div>
            </form>
            </div>

            <div class="modal-footer">
            <button id="btn-add-product" class="btn btn-success"> ADD </button>
            </div>
        </div>
    </div>
</div>

<!-- Add-product-modal ends here -->


<!-- Delete-product-modal begins here -->
<div class="modal fade" id="delete-product-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                    <h4 class="modal-title text-primary"><center>Delete a Product</center></h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
            <div class="form-group">
            <form id="del-product-form">

            <div class="form">
                <label class="control-label"><small>Select Category:</small></label>
                <select class="form-control cat-sel" name="cat" onchange="cpeRelModule.loadDynList(this.value)">
                    <option>--Please Select--</option>
                    <option>Officejet Pro</option>
                    <option>Officejet</option>
                    <option>Pagewide</option>
                    <option>Consumer</option>
                    <option>Mobile</option>
                </select>
            </div>

            <div class="form">
            <label class="control-label"><small>Select Product:</small></label>
            <select id="dyn-product-sel" class="form-control cat-sel" name="product">
            <!--load product list from loadDynList() -->
            </select>
                
            </div>
            </form>
                
            </div>
            <hr>

            <div id='del-product-status'></div>
                
            </div>

            <div class="modal-footer">
                <button id="btn-del-product" class="btn btn-danger">DELETE </button>
            </div>
        </div>
    </div>
</div>

<!-- delete-product-modal ends here -->


<!-- Add release begins here -->
<div class="modal fade" id="add-entry-modal">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
            <h4 class="modal-title text-primary"><center>Add New Release</center></h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>

    <div class="modal-body">
    <form id="form-add-release">
    <div class="form-group">
    <label class="control-label"><small>VR#</small></label>
    <input type="text" class="form-control" name="version" required>
    <label class="control-label"><small>Firmware Version</small></label>
    <input type="text" class="form-control" name="fwversion" required>
    <label class="control-label"><small>VR Date</small></label>
    <input type="text" class="form-control date-picker" name="date" pattern="[2][0][0-2][0-9][-]([0][1-9]|[1][0-2])[-]([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])" required>
    <hr>
    <label class="control-label"><small>AREL Link</small></label>
    <textarea type="text" row='2' class="form-control" name="arel" required></textarea>
    <label class="control-label"><small>SAREL Link <em> -- leave it blank or "NA" if not applicable</em></small></label>
    <textarea type="text" row='2' class="form-control" name="sarel"></textarea>
    <label class="control-label"><small>NAREL Link</small></label>
    <textarea type="text" row='2' class="form-control" name="narel" required></textarea>
    <hr>
    <label class="control-label"><small>Branch</small></label>
    <input type="text" class="form-control" name="branch" required>
    <label class="control-label"><small>Update Type</small></label>
    <input type="text" class="form-control" name="type" required>
    <label class="control-label"><small>Released By</small></label>
    <select class="form-control owner-sel" name="owner"> 
    <option>NPI</option>
    <option>CPE</option>
    </select>
    </div>
    </div>
    </form>
        <hr>
    <div id="add-release-status"></div>
 </div>

 <div class="modal-footer">
 <button class="btn btn-primary" id="btn-add-entry"> ADD </button>
 </div>
</div>
</div>
</div>

<!-- Add-product-modal ends here -->
    
<!--Modify-release-modal begins here -->

<div class="modal  fade" id="modify-entry-modal">
    <div class="modal-dialog modal-lg">
    <div class="modal-content">
    <div class="modal-header">
         <h4 class="modal-title text-primary"><center>Modify Releases</center></h4>
       	<button type="button" class="close" data-dismiss="modal">&times;</button>
        
    </div>
        
    <div id="modify-modal-body" class="modal-body">
    <form id="form-edit-entry">
    <div id="select-box"></div>
    <div id="edit-form"></div>
    <div id="edit-release-status"></div>
        <!--editable table place holder --> 
    </form>
    </div>
    
 <div class="modal-footer">
 </div>
        
    
        
    </div>
    </div>

</div>
<!-- Modify release modal ends -->
    
    
<!--Delete-release-modal begins here -->

<div class="modal  fade" id="delete-entry-modal">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
         <h4 class="modal-title text-primary"><center>Delete Releases</center></h4>
       	<button type="button" class="close" data-dismiss="modal">&times;</button>
        
    </div>
        
    <div class="modal-body">
    <div id="delete-modal-body"></div>
    <div id="del-release-alert"></div>
        <!--editable table place holder -->  
    <div id="del-release-status"></div>
    </div>
    
 <div class="modal-footer">
 <button  class="btn btn-danger" id="btn-del-entry">Delete </button>
 </div>
        
    
        
    </div>
    </div>

</div>
<!-- delete release modal ends -->

<?php $message ="This feature is for Admin only, please log in first!"; include "template/alertmodal.php" ?>
  
  
    
</body>



</html>