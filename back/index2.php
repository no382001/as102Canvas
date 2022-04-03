<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>something</title>
</head>
<style>
	
	body {
		font-family: "Lucida Console", "Courier New", monospace;
		white-space: pre;
	}
	
	#image {
		text-align: center;
	}
	
	.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
	}
	
	#image_buffer {
		display: none;
	}

</style>

<body>
	<div id="image" class="unselectable">
		<?php
			function printascii($txt_file){
				$lines = file($txt_file);
				foreach ($lines as $line){
					//if the first or last row of the ascii file is not empty, this echo will echo a random amount of \t-s to the front or the back for some reason, messing up the text centering and replacing
					echo $line;
					}
				}
			printascii("1.txt");
		?>
	</div>
	
	<div id="image_buffer">
		<?php
			printascii("2.txt");
		?>
	</div>

</body>

<script src="script.js"></script>


</html>

