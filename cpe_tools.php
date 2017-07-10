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
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="framework/utility.js"></script>
<script src="js/cpe_tools.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel = "stylesheet" href = "style/cpe_tools.css">
</head>
<body>

<div class="container-fluid">
<div id="nav-top">
    <nav class="navbar navbar-default container-fluid">
    <ul class="nav navbar-nav navbar-right">
        <?php include 'template/navlist.php'; ?>
    </ul>
    </nav>
 </div>

<div class="col-md-2">
<ul class="editor-btn">
    <li class="btn btn-success admin-<?php echo $_SESSION['auth'] ?>" id="btn-add">Add</li>
    <li class="btn btn-primary admin-<?php echo $_SESSION['auth'] ?>" id="btn-edit">Edit</li>
    <li class="btn btn-danger  admin-<?php echo $_SESSION['auth'] ?>" id="btn-delete">Delete</li>
</ul>

</div>


<div class="col-md-7 col-md-offset-3" id="main-content">

    <!--placeholder for the main content-->
</div>


<div class="modal fade" id="add-modal">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button data-dismiss="modal" class="close"> &times;</button>
    <h4 class="text-primary"><center>Add New Entry </center> </h4> 

    </div> 
    <div class="modal-body">
    <form id="form-new-entry">

    <label class="control-label">Name of Tool: </label>
    <input class="form-control" name="title" type="text">

    <br>

    <label class="control-label">Link: </label>
    <textarea class="form-control" rows=4 name="link" type="text"></textarea>

    <br>

    <label class="control-label">Brief Description: </label> 
    <textarea class="form-control" rows=5 name="description" type="text" maxlength="200"></textarea>
    <p class="intro-count"><span id="char-count">200</span> Characters left.</p>
    </form>
    <div id="add-status-update">

    </div>

    </div>

    <div class="modal-footer">
    <button class="btn btn-success" type="button" id="btn-add-entry">ADD </button>
    </div>
    </div> 

    </div>
</div>


<div class="modal fade" id="edit-modal">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button data-dismiss="modal" class="close"> &times;</button>
    <h4 class="text-primary"><center>Edit An Entry </center> </h4> 

    </div> 
    <div class="modal-body">

    <label class="control-label">Select An Entry: </label>
    <div id="select-edit"></div>
    <div id="entry-to-edit"></div>
    <div id="edit-status-update"></div>
    </div>

    <div class="modal-footer">
    <button class="btn btn-primary" type="button" id="btn-edit-submit">SUBMIT </button>
    </div>
    </div> 

    </div>
</div>



<div class="modal fade" id="delete-modal">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button data-dismiss="modal" class="close"> &times;</button>
    <h4 class="text-primary"><center>Delete An Entry  </center> </h4> 

    </div> 
    <div class="modal-body">

    <label class="control-label">Select An Entry to Delete: </label>
    <div id="select-delete"></div>
    <div id="delete-status-update"></div>
    </div>

    <div class="modal-footer">
    <button class="btn btn-danger" type="button" id="btn-delete-submit">DELETE </button>
    </div>
    </div> 

</div>
</div>

<div class="modal fade" id="login-modal">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button data-dismiss="modal" class="close"> &times;</button>
    <h4 class="text-primary"><center>User Login  </center> </h4> 

    </div> 
    <div class="modal-body">

    <form id="form-login">
    <label class="control-label">Username: </label>
    <input class="form-control" name="username" type="text">

    <label class="control-label">Password: </label>
    <input class="form-control" name="Password" type="password">
    </form>

    <div class="modal-footer">
    <button class="btn btn-primary" type="button" id="btn-login-submit">Log in </button>
    <div id="login-status"></div>
    </div>
    </div> 

    </div>
</div>
</div>


<?php $message ="This feature is for Admin only, please log in first!"; include "template/alertmodal.php" ?>

</body>
</html>


