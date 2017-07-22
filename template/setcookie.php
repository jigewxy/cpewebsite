<?php
    session_start();
    if (!isset($_SESSION['auth']))
    {
        $_SESSION['auth'] = 'fail';
    }

    setcookie('auth', $_SESSION['auth']);

?>