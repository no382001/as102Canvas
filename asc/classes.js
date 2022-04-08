sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}

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


String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}


replaceString = function(canvas,col,row,value){
	let row_data = document.getElementById("row"+row+""+canvas);
	
	//console.log(row,col,row_data.innerText.replace(/&amp;/g,"&")[col]);
	try{
		let text = row_data.innerText.replace(/&amp;/g,"&"); //innerHTML changes every & to &amp; every single time
		if (text[col] != value){ //dont replace if its the same
			//try{
				row_data.innerText = text.replaceAt(col,value);
				//console.log(col,row,row_data,value)
			}
		}catch{
		}//	console.log("replaceatfail: ",row,col,value,text[col]);
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
		
		this.parent = document.querySelector(parent);
		this.parent.appendChild(this.canvas);

		for (var i = 0; i < height; i++){
			let p = document.createElement('p');
			p.id = "row" + i + "" + this.canvas.id; //set id
			p.innerText = new Array(width + 1).join(bg); //fill row with bg
			this.canvas.appendChild(p);
		}

	}

	delete(){
		document.getElementById(this.name).remove();
	}


	drawFromBuffer(buffer,xpos,ypos){
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
				console.log(i,"top",bhleftedge+i)
				continue;
			}else if (bhleftbottom*-1+i > this.height){ //y OoB bottom
				console.log("bottom",bhleftbottom)
				break;
			}

			let value = buffer.obj.innerHTML.split("</p>")[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&");
			//console.log(i)

			if(bwleftedge < 0 && bwrightedge > this.width){ //OoB check
				value = value.substring(bwleftedge*-1,bw-(bwrightedge-this.width));
				
				buffer.setoffset("oob");
				//console.log(i,"oob",0,ypos-(bh/2)+i,value);
				
				replaceString(this.name,0,ypos-(bh/2)+i,value);
			
			}else if(bwleftedge < 0){
				//bordercheck left
				value = value.substring(bwleftedge*-1);
				//console.log(i,"left",0,ypos+i-(bh/2),value);
				
				buffer.setoffset("left");

				replaceString(this.name,0,ypos+i-(bh/2),value);
		
			}else if(bwrightedge > this.width){ //bordercheck right
				value = value.substring(0,bw-(bwrightedge-this.width));
				//console.log(i,"right",xpos-(bw/2),ypos-(bh/2)+i,value);
				
				buffer.setoffset("right");

				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
		
			}else{
				//console.log(i,"none",xpos-(bw/2),ypos-(bh/2)+i,value);
				buffer.setoffset("none");

				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
			}
		}
	}
	
	drawWithScatter = async function(buffer,xpos,ypos,speed=10){

		let whitespace = "2";

		// create an empty canvas with pre deifined whitespace all over it, and draw the buffer on
		let temp = new ascCanvas("scatter",this.width,this.height,this.parent.localName,whitespace);
		//temp.style.display = "none";
		
		temp.drawFromBuffer(buffer,xpos,ypos);

		//console.log(temp.canvas.innerHTML);

		//cut away the all whitespace
		let data = temp.canvas.innerHTML.split("</p>");
		let h = data[1].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&").length;
		let w = data.length-1;

		speed = speed * (h/w) *10;

		//console.log(h,w);

		const regx = new RegExp(whitespace,'g');

		let n = [];
		for (var i = 0; i < w; i++){
			//console.log(data[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&"));
			let d = data[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&").replace(regx,"");
			if (d!=""){
				n.push(d);
			}
		}

		console.log(buffer.getoffset());

		temp.delete()

		let new_bh = n.length; //new cropped buffer size
		new_bh % 2 != 0 ? new_bh += 1 : new_bh = new_bh;
		let new_bw = n[1].length;
		new_bw % 2 != 0 ? new_bw += 1 : new_bw = new_bw;


		temp = new ascBuffer(n,"scatter","body",	1,new_bh); //load from n*{row} variable

		let matrix = [];
		for (i=1;i<new_bw*(new_bh-1);++i) matrix[i]=i; //-1 for the last row, undefined
		matrix = shuffle(matrix);

		

		for (var i = 1; i < (new_bw*(new_bh)); i++) {
			
			let row = Math.floor(matrix[i] / new_bw) ; //add +1 to shift it by 50% to the right ??????
			let col = matrix[i] - (row*new_bw);



			try{
				if (row != NaN || col != NaN){
					let torch = document.getElementById("row"+row+""+"scatter").innerHTML.replace(/&amp;/g,"&")[col];
					
					if(torch == undefined ){console.log("und:",col,row)}
					
					replaceString(this.name,col,row,torch);
				}else{
					continue;
				}
			}catch(e){
				//console.log(row,col,e);	
			}
			
			if (i%(speed)== 0){await sleep(2);}//stop to show only every 10th replacement, seems fluid enough
		}

		temp.delete();

		//its workin it just is in the bottom left corner
		//need definitions for not OoB

		//buffer.getoffset() returns the offset that i can work with 
		//but multiple sets are inefficient !!!!!!!!!!!!!!
		
		//plus too big pic cannot be drawn for some reason
	}


}


class ascBuffer {
	constructor (pathtotxt,name,parent,		loadmode=0,bh=0){
		this.name = name;
		var buffer = document.createElement('div');
		buffer.id = name;

		//this.buffer.className = "unselectable";
		
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

		    //using syncronous HTTP request, that is deprecated !!!
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

	    this.width = this.obj.innerHTML.split("</p>")[1].replace(/\<[^()]*\>/g, '').length;
	    this.width % 2 != 0 ? this.width -= 1 : this.width = this.width;
	    //console.log(this.height,this.width)

	    this.offset = "";
	}

	setoffset(o){
		this.offset = o;
	}
	getoffset(){
		return this.offset;
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

