String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}

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

/*// create an empty 1d matrix with w*h space
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

matrix = shuffle(matrix);*/



async function runner(canvas,buffer, torch_matrix){
	//recieves a matrix and a torch that he will carry thru the pre defined random positions and change the values according to the result array
	
	//canvas = matrix


	sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}
	
	await sleep(1000);

	for (var i = 0; i < (ascWidth*(ascHeight)); i++) {
		
		let row = Math.floor(matrix[i] / ascWidth);
		let col = matrix[i] - (row*ascWidth);
		
		
		let torch = document.getElementById("row"+row+"buffer").innerText[col];

		replaceSingleChar(row,col,torch);

		//stop to show only every 10th replacement, seems fluid enough
		if (i%10 == 0){await sleep(1);}}

	console.log("the runner has finished torching!");
	console.log("iw:",ascWidth,"ih:",ascHeight,"totalpix:",ascWidth*ascHeight,"same/skipped:",(ascWidth*ascHeight)-replacecounter);
}

//runner(matrix);
