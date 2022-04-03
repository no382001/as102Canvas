sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}

createAsciiCanvas = function(name,width,height,parent,bg){
	//creates a w*h canvas with parent and selected bg
	canvas = document.createElement('div');
	canvas.id = name;
	parent = document.querySelector(parent);
	parent.appendChild(canvas);
	for (var i = 0; i < height; i++){
		p = document.createElement('p');
		p.id = "row" + i + "" + canvas.id; //set id
		p.innerText = new Array(width + 1).join(bg); //fill row with bg
		canvas.appendChild(p);
	}
}

createAsciiBuffer = function(pathtotxt,buffername,parent){
	//creates a buffer for the content to be displayed
	//buffer is needed for the image to be shown on screen
	buffer = document.createElement('div');
	buffer.id = buffername;
	//buffer.className = "unselectable";
	buffer.style.display = 'none';
	parent = document.querySelector(parent);
	parent.appendChild(buffer);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            t = xhr.responseText.split('\n');
        	for (var i = 0; i < t.length; i++){
				p = document.createElement('p');
				p.id = "row" + i + "" + buffer.id; //set id
				p.innerText = t[i];
				buffer.appendChild(p);
			}
        }
    }
    xhr.open('GET', pathtotxt);
    xhr.send();
}

determineHeight = function(asc){
	return document.getElementById(asc).innerHTML.split("</p>").length-1;}

determineWidth = function(asc){
	return document.getElementById(asc).innerHTML.split("</p>")[0].replace(/\<[^()]*\>/g, '').length;
}

drawFromBuffer = function(buffer,canvas,xpos,ypos,CENTER=0){
	//draws from buffer to a specified canvas
	//to centered x,y positions
	//or just to the center


	//from buffer to image
	im_W = determineWidth(canvas);
	im_H = determineHeight(canvas);
	
	bu_w = determineWidth(buffer);
	bu_h = determineHeight(buffer);

	leftcorner_x_bu = xpos-Math.floor(bu_w/2); //0,0 of bu
	rightcorner_x_bu = xpos+Math.floor(bu_w/2);

	for (var i = 0; i < bu_h-1;i++){
		try{
			value = document.getElementById("buff").innerHTML.split("</p>")[i].replace(/\<[^()]*\>/g,'');
			replaceString(canvas,xpos,ypos+i,value);
		}catch{
			console.log("drawFromBuffer",i,value);
			0}
		}
	/*async function runner(canvas,buffer, torch_matrix){
	//recieves a matrix and a torch that he will carry thru the pre defined random positions and change the values according to the result array
	
	//canvas = matrix

	sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}
	await sleep(1000);

	for (var i = 0; i < (ascWidth*(ascHeight)); i++) {
		
		let row = Math.floor(matrix[i] / ascWidth);
		let col = matrix[i] - (row*ascWidth);
		
		
		let torch = document.getElementById("row"+row+"buffer").innerText[col];

		replaceString(row,col,torch);

		//stop to show only every 10th replacement, seems fluid enough
		if (i%10 == 0){await sleep(1);}}

	console.log("the runner has finished torching!");
	console.log("iw:",ascWidth,"ih:",ascHeight,"totalpix:",ascWidth*ascHeight,"same/skipped:",(ascWidth*ascHeight)-replacecounter);
}

*/

	//

}

String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}

replaceString = function(canvas,col,row,value){
	let row_data = document.getElementById("row"+row+""+canvas);
	let text = row_data.innerText //.replace(/&amp;/g,"&"); //innerHTML changes every & to &amp; every single time
	if (text[col] != value){ //dont replace if its the same
		try{
			row_data.innerText = text.replaceAt(col,value);
		}
		catch{
			console.log("replaceatfail: ",row,col,value,text[col]);
		}
	}
}


getSingleChar = function(buffer,x,y){
	buffer = document.getElementById("row"+y+""+buffer).innerHTML.split("</p>")[0].replace(/\<[^()]*\>/g, '')[x];
	return buffer;
}

//choose animation