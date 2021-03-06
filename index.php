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
  <body id="page-top" ng-app="homeRouter">
    <div class="main-container">

      <!-- HEADER -->
      <header class="main-header" ui-view="header"></header>
      
      <!-- FIN HEADER -->

      <!-- HOME CONTENT -->
      <div class="main-content">
        
        <div class="content" ui-view="body">

        </div>

      </div>
      <!-- FIN HOME CONTENT -->

      <!-- FOOTER -->
      <!-- <footer class="footer-home" ng-include="'templates/commonComponents/footer.html'"></footer> -->
      <!-- FIN FOOTER -->
      
    </div>
  </body>
</html>
