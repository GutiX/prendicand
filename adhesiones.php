<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Candidatura Salvador Pozo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/styles.css">    
    <link rel="stylesheet" href="css/accessibility.css">

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/angular/angular.min.js"></script>
    <script type="text/javascript" src="js/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="ng/routing/homeRouter.js"></script>
    <!-- <script src="/ng/controller/authentication.js"></script>
    <script src="/ng/interceptor/tokenInterceptor.js"></script>
    <script src="/ng/service/userService.js"></script>
    <script src="/ng/controller/userController.js"></script> -->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
      ga('create', 'UA-84143018-1', 'auto');
      ga('send', 'pageview');
    
    </script>
  </head>
  <body id="page-top">
    <div class="main-container">

      <!-- HEADER -->
      <header class="main-header"></header>
      
      <!-- FIN HEADER -->

      <!-- HOME CONTENT -->
      <div class="main-content">
        
        <?php  

        $name = $_POST['nameHer'];
        $apellidos = $_POST['apellidos'];
        if($name != null && $name != "" && $apellidos != null && $apellidos != "") {
          
    			 $dbhost = 'mysql.hostinger.es';
    			 $dbuser = 'u369206828_guti';
    			 $dbpass = 'prendi2016';
    			 $conn = mysql_connect($dbhost, $dbuser, $dbpass);
    
    			 if(! $conn ) {
    				die('Could not connect: ' . mysql_error());
    			 }
    			 
    			 $sql = 'INSERT INTO adhesiones (nombre, apellidos, numHermano) VALUES ($name, $apellidos, 2)';
    				
    			 mysql_select_db('u369206828_pcand');
    			 $retval = mysql_query( $sql, $conn );
    			 
    			 if(! $retval ) {
    				die('Could not enter data: ' . mysql_error());
    			 }
    			 
    			 echo "Entered data successfully\n";
    			 
    			 mysql_close($conn);
		  
        }
        			 
        ?>
        
        <?php echo "<h1>nombre:  " . $name . "</h1>" ?>
        
      </div>
      <!-- FIN HOME CONTENT -->

      <!-- FOOTER -->
      <!-- <footer class="footer-home" ng-include="'templates/commonComponents/footer.html'"></footer> -->
      <!-- FIN FOOTER -->
      
    </div>
  </body>
</html>
