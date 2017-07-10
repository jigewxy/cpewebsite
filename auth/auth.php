<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Expires" content="Tue, 01 Jan 1995 12:12:12 GMT">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-control" content="no-cache">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="../framework/utility.js"></script>
<script src="login.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href ="../style/unified.css">
</head>
<body>
 <div class="col-md-3 col-md-offset-1">
     <br> <br> <br> <br><br>
    <form id="form-login">
    <label class="control-label">Username: </label>
    <input class="form-control" name="username" type="text" required>

    <label class="control-label">Password: </label>
    <input class="form-control" name="password" type="password" required>
    </form>
    <br>
    <button class="btn btn-primary" type="button" id="btn-login">Log in </button>
    <button class="btn btn-success" type="button" id="btn-return">Return </button>
    <br>
    <br>
    <div id="login-status"></div>
    </div>
</div>
</body>
</html>