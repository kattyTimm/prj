<!DOCTYPE html>
	<html>
	   <head>
	      <title>play game</title>
	      <meta name="viewport" content="width=device-width, initial-scale=1.0">
	      <meta charset="UTF-8">
		  <link rel="stylesheet" href="css/main.css">
		  <!-- <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script> -->
		  
		</head>
	  
	  <body>
	  <?php mb_internal_encoding("UTF-8");?>
	     <div id="wrapper">
		   <header>
		     <h1>Игра "Пять точек"</h1>
		   </header>
		   
		  <div id="content">  
		   <div id="sidebar"> 
		     <ul>
			   <li class="active"><a href="?file=1">играть вдвоем</a></li>
			   <li><a href="?file=2">играть с компьютером</a></li>
			   <li><a href="?file=3">играть онлайн</a></li>
			 </ul>
		   </div>
		  
		     <div id="field">
		    	 <div id="game">
				 <p hidden>
				 <?php
                  $str = '1.php';			  
				  include $_REQUEST['file'].$str;
					 
					 if(isset ($_REQUEST['file'])){
						 $str = '';
						include $_REQUEST['file'].'.php';
				 }
				 ?>
				 </p>
				 </div>
			 </div>
		   </div>
		   
		   <footer>
	         <h1>Игра "Пять точек"</h1>
		   </footer>
		 </div>

	  </body>
	<html>