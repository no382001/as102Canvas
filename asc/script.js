String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}

ascWidth = document.getElementById("image").innerHTML.split("\n")[2].replace(/&amp;/g,"&").length;
ascHeight = document.getElementById("image").innerHTML.split("\n").length - 3; //empty,\t\t,empty = 3

replacecounter = 0;

replaceSingleChar = function(row,col,value){
	let row_data = document.getElementById("row"+row+"image");
	let text = row_data.innerText//.replace(/&amp;/g,"&"); //innerHTML changes every & to &amp; every single time
	if (text[col] != value){
		try{
			row_data.innerText = text.replaceAt(col,value);
			replacecounter++;
		}
		catch{
			console.log("replaceatfail: ",row,col,value,text[col]);
		}
	}
}


// create an empty 1d matrix with w*h space
for (var matrix=[],i=0;i<ascWidth*(ascHeight);++i) matrix[i]=i+ascWidth; //plus 100 to skip the first row, and deal with the last too

function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

matrix = shuffle(matrix);

sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}

async function runner(matrix, torch_matrix){
	//recieves a matrix and a torch that he will carry thru the pre defined random positions and change the values according to the result array
	await sleep(1000);

	for (var i = 0; i < (ascWidth*(ascHeight)); i++) {	
		let row = Math.floor(matrix[i] / ascWidth) ; //add +1 to shift it by 50% to the right ??????
		let col = matrix[i] - (row*ascWidth);
		let torch = document.getElementById("row"+row+"buffer").innerText[col];

		replaceSingleChar(row,col,torch);

		if (i%10 == 0){await sleep(1);} //stop to show only every 10th replacement, seems fluid enough
	}
	console.log("the runner has finished torching!");
	console.log("iw:",ascWidth,"ih:",ascHeight,"totalpix:",ascWidth*ascHeight,"same/skipped:",(ascWidth*ascHeight)-replacecounter);
}

//runner(matrix);
