sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}

createAsciiCanvas = function(name,width,height,parent,bg){
	//creates a w*h canvas with parent and selected bg
	//fillcanvas essentially does the same maybe merge?
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
	return document.getElementById(asc).innerHTML.split("</p>")[1].replace(/\<[^()]*\>/g, '').length;
}

drawFromBuffer = function(buffer,canvas,xpos,ypos,mode=0){
	//revisit and make code clearer

	drawWithScatter = async function(xpos,ypos,value){
		await sleep(1000);

		//createAsciiCanvas("image",0,0,"body","x"); //size of the resized

		for (var i = 0; i < (ascWidth*(ascHeight)); i++) {
			
			let row = Math.floor(matrix[i] / ascWidth);
			let col = matrix[i] - (row*ascWidth);
				
			let torch = document.getElementById("row"+row+"buffer").innerText[col];

			replaceString(row,col,torch);

		
			//stop to show only every 10th replacement, seems fluid enough
			if (i%10 == 0){await sleep(1);}
		}
	}

	bh = determineHeight(buffer);
	bw = determineWidth(buffer);

	iw = determineWidth(canvas);

	bwleftedge = xpos - bw/2;
	bhleftedge = ypos - bh/2
	bwrightedge = xpos + bw/2;

	for (var i = 1; i < determineHeight(canvas)-1;i++){
			try{
				value = document.getElementById(buffer).innerHTML.split("</p>")[i].replace(/\<[^()]*\>/g,'');
				
				if(bwleftedge < 0){ //bordercheck left
					value = value.substring(bwleftedge*-1);
					replaceString(canvas,0,ypos+i-(bh/2),value);
				}else if(bwrightedge > iw){ //bordercheck right
					value = value.substring(0,bw-(bwrightedge-iw));
					replaceString(canvas,xpos-(bw/2),ypos-(bh/2)+i,value);
				}else{
					replaceString(canvas,xpos-(bw/2),ypos-(bh/2)+i,value);
					}
			}catch{
				if (bhleftedge < 0){
					//console.log("drawFromBuffer: top out of bounds");
					continue;
				}else{
					//console.log("drawFromBuffer: bottom out of bounds");
					break;
				}
			}
		}
	}
fillCanvas = function(canvas,bg = " "){
	width = determineWidth(canvas);
	height = determineHeight(canvas);
	for(var i = 0; i < height;i++){
		paragraph = document.getElementById("row"+i+""+canvas);
		paragraph.innerText = new Array(width + 1).join(bg);
	}
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