        <li class="nav-menu dropdown">
            <a href="#" data-toggle="dropdown">More <span class="caret"></span></a>
            <ul class="dropdown-menu">
            <li><a href="cpe_releases.php">CPE Releases</a></li>
            <li><a href="srt_releases.php">SRT Releases</a></li>
            <li><a href="cpe_projects.html">CPE Projects</a></li>
            <li class="divider"></li>
            <li><a href="learnings.html">Learnings</a></li>
            <li><a href="cpe_tools.php">Tools</a></li>
            <li><a href="processes.html">CPE Process</a></li>
            <li class="divider"></li>
            <li><a href="index.php"><span class="glyphicon glyphicon-home"></span> Home</a></li>
            </ul>   
        </li>
         <?php if($_SESSION['auth']=='pass'): ?>
              <li class="nav-menu"><a id="anchor-logout"><span class="glyphicon glyphicon-log-in"></span> Log out</a></li>
               <?php else: ?>
              <li class="nav-menu"><a id="anchor-login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
         <?php endif; ?>
       <li class="nav-menu"><a href="index.php"><span class="glyphicon glyphicon-home"></span> Home</a></li>