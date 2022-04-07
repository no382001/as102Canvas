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
				console.log("sadsad");
			}
        }
    }
    xhr.open('GET', pathtotxt);
    xhr.send();
}

deleteAscii = function(asc){
	data = document.getElementById(asc);
	data.remove(); //remove dom element
}

determineHeight = function(asc){
	return document.getElementById(asc).innerHTML.split("</p>").length-1;}

determineWidth = function(asc){
	return document.getElementById(asc).innerHTML.split("</p>")[1].replace(/\<[^()]*\>/g, '').length;
}

drawWithScatter = async function(buffer,canvas,xpos,ypos,speed){
	await sleep(1000);

	iw = determineWidth(canvas);
	ih = determineHeight(canvas);

	whitespace = "2";

	parent = "body";
	createAsciiCanvas("scatter",iw,ih,parent,whitespace);

	//document.getElementById("scatter").style.display = "none";
	drawFromBuffer(buffer,"scatter",xpos,ypos);

	//cut away all whitespace resulting in the cropped image
	var data = document.getElementById("scatter").innerHTML.split("</p>");
	var h = data[0].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&").length;
	var w = data.length-1;

	const regx = new RegExp(whitespace,'g');

	let n = [];
	for (var i = 0; i < w; i++){
		d = data[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&").replace(regx,"");
		if (d!=""){
			n.push(d);
		}
	}
	

	deleteAscii("scatter");

	new_bh = n.length; //new cropped buffer size
	new_bh % 2 != 0 ? new_bh += 1 : new_bh = new_bh;
	
	new_bw = n[0].length;
	new_bw % 2 != 0 ? new_bw += 1 : new_bw = new_bw;

	//create a new buffer with the name scatter
	buffer = document.createElement('div');
	buffer.id = "scatter";
	//buffer.style.display = 'none';
	parent = document.querySelector(parent);
	parent.appendChild(buffer);
	for (var i = 0; i < new_bh; i++){
		p = document.createElement('p');
		p.id = "row" + i + "" + buffer.id; //set id
		p.innerText = n[i];
		buffer.appendChild(p);
		}

	//create scatter matrix size of buffer and shuffle it for random effect
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

	for (var matrix=[],i=1;i<new_bw*(new_bh-1);++i) matrix[i]=i; //-1 for the last row, undefined
	matrix = shuffle(matrix);

	for (var i = 1; i < (new_bw*(new_bh)); i++) {
		let row = Math.floor(matrix[i] / new_bw) ; //add +1 to shift it by 50% to the right ??????
		let col = matrix[i] - (row*new_bw);

		try{
			let torch = document.getElementById("row"+row+""+"scatter").innerHTML.replace(/&amp;/g,"&")[col];
			
			if(torch == undefined ){console.log(col,row)}
			
			replaceString(canvas,col+xpos-(new_bw/2),row+ypos-(new_bh/2),torch);
		}
		catch{
			continue;
			// console.log(i,row,col);
			// FIX THIS
			// iterates thru the last row which is not ideal as there is nothing there 
			
			//console.log(row,col)
		}
		if (i%speed == 0){await sleep(1);} //stop to show only every 10th replacement, seems fluid enough
	}
	//deleteAscii("scatter");
}

drawFromBuffer = function(buffer,canvas,xpos,ypos,mode=0){
	//revisit and make code clearer

	bh = determineHeight(buffer);
	bw = determineWidth(buffer);//problem here some async thing even tho it shouldnt be

	iw = determineWidth(canvas);

	bwleftedge = xpos - bw/2;
	bwrightedge = xpos + bw/2;
	bhleftedge = ypos - bh/2

	for (var i = 1; i < determineHeight(canvas)-1;i++){
			
			try{
				value = document.getElementById(buffer).innerHTML.split("</p>")[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&");

				if(bwleftedge < 0 && bwrightedge > iw){ //OoB check
				
					value = value.substring(bwleftedge*-1,bw-(bwrightedge-iw));
					replaceString(canvas,0,ypos-(bh/2)+i,value);
				
				}else{

					if(bwleftedge < 0){ //bordercheck left
				
						value = value.substring(bwleftedge*-1);
						replaceString(canvas,0,ypos+i-(bh/2),value);
					
					}else if(bwrightedge > iw){ //bordercheck right
				
						value = value.substring(0,bw-(bwrightedge-iw));
						replaceString(canvas,xpos-(bw/2),ypos-(bh/2)+i,value);
					
					}else{
				
						replaceString(canvas,xpos-(bw/2),ypos-(bh/2)+i,value);
					}
				}
			}catch{
				if (bhleftedge < 0){ //y OoB top
			
					continue;
			
				}else{ //y OoB bottom
			
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

//fillWithScatter = async function()

String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}


replaceString = function(canvas,col,row,value){
	let row_data = document.getElementById("row"+row+""+canvas);
	let text = row_data.innerText.replace(/&amp;/g,"&"); //innerHTML changes every & to &amp; every single time

	if (text[col] != value){ //dont replace if its the same
		try{
			row_data.innerText = text.replaceAt(col,value);
		}
		catch{
			console.log("replaceatfail: ",row,col,value,text[col]);
		}
	}else{
		console.log("identical to bg at:",col,row);
	}
}

getSingleChar = function(buffer,x,y){
	buffer = document.getElementById("row"+y+""+buffer).innerHTML.split("</p>")[0].replace(/\<[^()]*\>/g, '')[x];
	return buffer;
}