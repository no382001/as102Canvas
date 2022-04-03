String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}

ascWidth = document.getElementById("image").innerHTML.split("\n")[2].replace(/&amp;/g,"&").length;
ascHeight = document.getElementById("image").innerHTML.split("\n").length - 3; //empty,\t\t,empty = 3


replaceSingleChar = function(row,col,value){
	let image = document.getElementById("image")
	let inner = image.innerHTML; /* access the text */
	let text = inner.split('\n');		
	text[row] = text[row].replace(/&amp;/g,"&") //innerHTML changes every & to &amp; every single time
	
	//should i check if it is the same value, thus skipping the replacement?
	
	text[row] = text[row].replaceAt(col,value);
	image.innerHTML = text.join("\n");

	image = null;
	inner = null;
	text = null;
	delete(image);
	delete(inner);
	delete(text);

}

var buffermatrix = [];
init_buffermatrix = function(){
	let buffer = document.getElementById("image_buffer");
	let inner = buffer.innerHTML; /* access the text */
	let text = inner.split('\n');
	
	//first row \t \t
	//last row undefined

	for (i=1; i < 58; i++) {
		let temp = text[i].replace(/&amp;/g,"&");
		for (j=0;j <= 100;j++) {
			buffermatrix[((i-1)*100)+j] = temp[j];
		}
	}

	buffer = null;
	inner = null;
	text = null;
	delete(buffer);
	delete(inner);
	delete(text);
	
	//console.log(buffermatrix);
}

// create an empty 1d matrix with 100*57 space
for (var matrix=[],i=0;i<ascWidth*(ascHeight+1);++i) matrix[i]=i+100; //plus 100 to skip the first row, and deal with the last too

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
	for (var i = 0; i < (ascWidth*(ascHeight+1)); i++) {
		
		let row = Math.floor(matrix[i] / 100) ; //add +1 to shift it by 50% to the right ??????
		let col = matrix[i] - (row*100);
		
		let torch = buffermatrix[((row-1)*100)+col];

		try{replaceSingleChar(row,col,torch);}
		catch{console.log(row,col)}
		

		if (i%10 == 0){await sleep(1);} //stop to show only every 10th replacement, seems fluid enough
	}
	console.log("the runner has finished torching!");
}

init_buffermatrix();
runner(matrix);

console.log(ascWidth,ascHeight);