/*
				MIT License

			Copyright (c) 2022 no382001

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

sleep = function(ms){
	return new Promise(resolve => setTimeout(resolve,ms));
}

String.prototype.replaceAt = function(index, replacement){
	return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

shuffle = function(array) {
	  var tmp, current, top = array.length;
	  if(top) while(--top) {
	    current = Math.floor(Math.random() * (top + 1));
	    tmp = array[current];
	    array[current] = array[top];
	    array[top] = tmp;
	  }
	  return array;
	}

class coordstack{
	constructor(){
		this.stack = [];
	}
	top(){
		return this.stack[this.stack.length-1];
	}
	translate(a,b){
		if(this.top()){
			let t = this.top();
			this.stack.push([a+t[0],b+t[1]]);
		}else{
			this.stack.push([a,b]);
		}
	}
	pop(){
		this.stack.pop();
	}	
}

replaceString = function(canvasname,col,row,value){

	let row_data = document.getElementById("row"+row+""+canvasname);
	
	//console.log(row,col,row_data.innerText.replace(/&amp;/g,"&")[col]);
	try{
		let text = row_data.innerText.replace(/&amp;/g,"&"); //innerHTML changes every & to &amp; every single time
		if (text[col] != value){ //dont replace if its the same
			//try{
				row_data.innerText = text.replaceAt(col,value);
				//console.log(col,row,row_data,value)
			}
		}catch{
			}
		//console.log("replaceatfail: ",row,col,value,text[col]);
		//}
	//}else{
	//	console.log("identical to bg at:",col,row);
	//}
}

class ascCanvas {
	
	constructor (name,width,height,parent,bg){
		
		this.name = name;
		this.width = width;
		this.height = height;
	
		this.canvas = document.createElement('div');
		this.canvas.id = name;
		this.canvas.className = "unselectable";
		
		this.parent = document.querySelector(parent);
		this.parent.appendChild(this.canvas);
		
		for (var i = 0; i < height; i++){
			let p = document.createElement('p');
			p.id = "row" + i + "" + this.canvas.id; //set id
			p.innerText = new Array(width + 1).join(bg); //fill row with bg
			this.canvas.appendChild(p);
		}

		this.cstack = new coordstack;
		this.page;

	}

	getwidth(){
		return this.width;
	}
	
	getheight(){
		return this.height;
	}

	delete(){
		document.getElementById(this.name).remove();
	}

	checkOoB(buffer,xpos,ypos){
		
		let bw = buffer.getwidth();
		let bh = buffer.getheight();
		let bwleftedge = xpos - bw/2;
		let bwrightedge = xpos + bw/2;
		let bhleftedge = ypos - bh/2;
		let bhleftbottom = ypos + bh/2;

		//find the two possible property combinations
		let ret = new Set();
		let i = 0;
		
		for (i = 1; i<bh-1 && ret.size<2 && !ret.has("none"); i++){

			if (bhleftedge + i < 0){
				ret.add("top");
			}

			if(bhleftbottom+i > this.height){ //y OoB bottom
				ret.add("bottom");
			}

			if(bwleftedge < 0 && bwrightedge > this.width){ //OoB check both sides
				ret.add("oob");

			}else if(bwleftedge < 0){ //bordercheck left
				ret.add("left");

			}else if(bwrightedge > this.width){ //bordercheck right
				ret.add("right");

			}else{
				ret.add("none");
				break;
			}
			//console.log(i,ret);
		}
		console.log(ret,bwleftedge,bhleftedge);
		return [ret,bwleftedge,bhleftedge];
	}

	drawFromBuffer(buffer,xpos,ypos){
		
		if(this.cstack.top()){
			let t = this.cstack.top();
			xpos += t[0];
			ypos += t[1];
		}	

		let bw = buffer.getwidth();
		let bh = buffer.getheight();
		//console.log("buf:",bw,bh);
		//console.log("canv",this.height,this.width)
		let bwleftedge = xpos - bw/2;
		let bwrightedge = xpos + bw/2;
		let bhleftedge = ypos - bh/2;
		let bhleftbottom = ypos + bh/2;
		//console.log("left:",bwleftedge,bwrightedge)
		
		for (let i = 1; i < bh-1; i++){
			if (bhleftedge+i < 0){ //y OoB top
				//console.log(i,"top",bhleftedge+i)
				continue;
			}else if (bhleftbottom*-1+i > this.height){ //y OoB bottom
				//console.log("bottom",bhleftbottom)
				break;
			}
			
			let value = document.getElementById("row"+i+buffer.name).innerText;
			//console.log(i)
			
			if(bwleftedge < 0 && bwrightedge > this.width){ //OoB check
				value = value.substring(bwleftedge*-1,bw-(bwrightedge-this.width));
				//console.log(i,"oob",0,ypos-(bh/2)+i,value);
				replaceString(this.name,0,ypos-(bh/2)+i,value);
				continue;
			}else if(bwleftedge < 0){
				//bordercheck left
				value = value.substring(bwleftedge*-1);
				//console.log(i,"left",0,ypos+i-(bh/2),value);
				replaceString(this.name,0,ypos+i-(bh/2),value);
				continue;
			}else if(bwrightedge > this.width){ //bordercheck right
				value = value.substring(0,bw-(bwrightedge-this.width));
				//console.log(i,"right",xpos-(bw/2),ypos-(bh/2)+i,value);
				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
				continue;
			}else{
				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
				continue;
			}
		}
	}
	
	fillRect(xpos,ypos,w,h,value){
		if(this.cstack.top()){
			let t = this.cstack.top();
			xpos += t[0];
			ypos += t[1];
		}
		value = value.repeat(w);
		for(let i = 0; i < h;i++){
			replaceString(this.name,xpos-(w/2),ypos-(h/2)+i,value);
		}
	}

	clear(value = this.bg){

		if(value != this.bg){
			this.bg = value;
		}

		for (var i = 0; i < this.height; i++){
			let p = document.getElementById("row" + i + "" + this.canvas.id);
			p.innerText = new Array(this.width + 1).join(value);
		}
	}

	addTextLine(xpos,ypos,value){
		if(this.cstack.top()){
			let t = this.cstack.top();
			xpos += t[0];
			ypos += t[1];
		}
		replaceString(this.name,xpos-Math.floor(value.length/2),ypos,value);
	}

	drawWithScatter = async function(buffer,xpos,ypos,speed=10){

		let whitespace = "2";

		// create an empty canvas with pre deifined whitespace all over it, and draw the buffer on
		let temp = new ascCanvas("scatter",this.width,this.height,this.parent.localName,whitespace);

		document.getElementById("scatter").style.display = "none";

		temp.drawFromBuffer(buffer,xpos,ypos);

		//cut away the all whitespace
		let data = temp.canvas.innerHTML.split("</p>");
		//let h = data[1].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&").length;
		let h = document.getElementById("row1scatter").innerText.length
		let w = data.length-1;

		//calculate the "speed" of the animation
		speed = speed * (h/w) *10;

		//we need to apply regex when the image is no OOB
		//but we can apply it every time, it wont interfere with anything
		const regx = new RegExp(whitespace,'g');

		//FIXME this could be replaced with a list comprenehsion
		let n = [];
		for (var i = 0; i < w; i++){
			let d = document.getElementById("row"+i+"scatter").innerText.replace(regx,"");
			n.push(d);
		}

		let OoB = temp.checkOoB(buffer,xpos,ypos);

		temp.delete();


		//FIXME this is working but i have the suspicion that this is why sometimes certan numbers dont work
		let new_bh = n.length; //new cropped buffer size
		new_bh % 2 != 0 ? new_bh += 1 : new_bh = new_bh;
		let new_bw = n[1].length;
		new_bw % 2 != 0 ? new_bw += 1 : new_bw = new_bw;


		//load from n*{row} variable
		temp = new ascBuffer(n,"scatter","body",	1,new_bh); 

		document.getElementById("scatter").style.display = "none";

		let scatter2w = temp.getwidth();
		let scatter2h = temp.getheight();

		let matrix = [];
		for (i=0;i<new_bw*(new_bh);++i) matrix[i]=i;

		matrix = shuffle(matrix);

		w = temp.getwidth()
		h = temp.getheight()

		let xoffset = 0;
		let yoffset = 0;

		//console.log(OoB)

		let leftedge = OoB;

		//FIXME!! LOOKS DISGUSTING
		// and probably does not cover all cases
		OoB = OoB[0];
		if (OoB.has("right")){
			xoffset =  this.width - scatter2w;
		}
		if (OoB.has("bottom")){
			yoffset = this.height - scatter2h; 
		}
		if(OoB.has("top")){
			xoffset = 0;
			yoffset = 0;
		}
		if(OoB.has("none")){
			xoffset = leftedge[1];
			yoffset = leftedge[2];
		}

		console.log(xoffset,yoffset)

		for (var i = 0; i < (new_bw*(new_bh)); i++) {

			let row = Math.floor(matrix[i] / new_bw); //add +1 to shift it by 50% to the right
			let col = matrix[i] - (row*new_bw);

					let torch = document.getElementById("row"+row+""+"scatter").innerText[col];
					
					if(torch == undefined ){break;}

					replaceString(this.name,col+xoffset,(row)+yoffset,torch); //h-row inverts
	
			if (i%(speed) == 0){await sleep(2);}
		}
		temp.delete();
	}


	drawWithDown = async function(buffer,xpos,ypos,speed=2){
		
		//FIXME This has to reconciled somehow with drawFromBuffer
		//a shameless copy of drawFromBuffer with the only
		//addition being the async function sleep, as i dont want to make drawFromBuffer async at all
		
		//sleep and draw speed needs to be adjusted

		if(this.cstack.top()){
			let t = this.cstack.top();
			xpos += t[0];
			ypos += t[1];
		}	

		let bw = buffer.getwidth();
		let bh = buffer.getheight();
		let bwleftedge = xpos - bw/2;
		let bwrightedge = xpos + bw/2;
		let bhleftedge = ypos - bh/2;
		let bhleftbottom = ypos + bh/2;
		for (let i = 1; i < bh-1; i++){
			if (bhleftedge+i < 0){ //y OoB top
				continue;
			}else if (bhleftbottom*-1+i > this.height){ //y OoB bottom
				break;
			}
			let value = buffer.obj.innerHTML.split("</p>")[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&");
			
			//drawWithScroll
			if (i % (speed) == 0){await sleep(24);}
			
			if(bwleftedge < 0 && bwrightedge > this.width){ //OoB check
				value = value.substring(bwleftedge*-1,bw-(bwrightedge-this.width));
				replaceString(this.name,0,ypos-(bh/2)+i,value);
				continue;
			}else if(bwleftedge < 0){
				value = value.substring(bwleftedge*-1);
				replaceString(this.name,0,ypos+i-(bh/2),value);
				continue;
			}else if(bwrightedge > this.width){ //bordercheck right
				value = value.substring(0,bw-(bwrightedge-this.width));
				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
				continue;
			}else{
				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
				continue;
			}
		}
	}

	copyToBuffer(buffer){
		//first row will get corrupted probably some index mixed up or bad buffer implementation
		//that is some problem with the file loaded into the buffer

		//FIXTHIS EASY
		//also if i mirror the innerHTML, the canvas basically loses its rows, as the buffer rows have different ids
		//this has to be the problem

		document.getElementById(buffer.name).innerHTML = document.getElementById(this.name).innerHTML;
	}

}

class ascBuffer {
	constructor (pathtotxt,name,parent,
				loadmode=0,bh=0){ //FIXME there has to be a better way to this

		this.name = name;
		var buffer = document.createElement('div');
		buffer.id = name;

		buffer.className = "unselectable";
		
		buffer.style.display = 'none';
		this.parent = document.querySelector(parent);
		this.parent.appendChild(buffer); 

		if(loadmode == 0){ //load from file
			let xhr = new XMLHttpRequest();

		   	xhr.onload = function() {
		        if (xhr.readyState == 4 && xhr.status == 200) {
		           let t = xhr.responseText.split('\n');
		        	for (var i = 0; i < t.length; i++){
						let p = document.createElement('p');
						p.id = "row" + i + "" + buffer.id; //set id
						p.innerText = t[i];
						buffer.appendChild(p);
					}
				}
		    }

		    //using syncronous HTTP request, that is deprecated but gets the job done right now
		    xhr.open('GET', pathtotxt,false);
		    xhr.send(null);
		    this.obj = buffer;
		    buffer = 0;

		}else if(loadmode == 1){ //load from n*{row} variable
			
			let n = pathtotxt;

			for (var i = 0; i < bh; i++){
				let p = document.createElement('p');
				p.id = "row" + i + "" + buffer.id; //set id
				p.innerText = n[i];
				buffer.appendChild(p);
			}
			this.obj = buffer;
			buffer = 0;

		}

	    this.height = Math.floor(this.obj.innerHTML.split("</p>").length);
	    this.height % 2 != 0 ? this.height -= 1 : this.height = this.height;

	    //FIXME this is also not efficient
	    this.width = this.obj.innerHTML.split("</p>")[1].replace(/\<[^()]*\>/g,'').length;
	    this.width % 2 != 0 ? this.width -= 1 : this.width = this.width;
	}

	delete(){
		document.getElementById(this.name).remove();
	}

	getheight(){
		return this.height;
	}
	getwidth(){
		return this.width;
	}

}