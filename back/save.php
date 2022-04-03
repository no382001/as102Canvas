function printascii($txt_file,$id){
				$lines = file($txt_file);
				$linenumber = 0;
				foreach ($lines as $line){
					//if the first or last row of the ascii file is not empty, this echo will echo a random amount of \t-s to the front or the back for some reason, messing up the text centering and replacing
					echo '<p id=row'.$linenumber.$id.'>'.$line."</p>";
					$linenumber += 1;
					}
				}