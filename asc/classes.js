sleep = function(ms){return new Promise(resolve => setTimeout(resolve,ms));}


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

		console.log("buf:",bw,bh);
		console.log("canv",this.height,this.width)

		let bwleftedge = xpos - bw/2;
		let bwrightedge = xpos + bw/2;

		let bhleftedge = ypos - bh/2;
		let bhleftbottom = ypos + bh/2;

		console.log("left:",bwleftedge,bwrightedge)

		for (let i = 1; i < this.height-1; i++){

			if (bhleftedge+i < 0){ //y OoB top
				//console.log(i,"top",bhleftedge-1)
				continue;
			}else if (bhleftbottom > this.height){ //y OoB bottom
				//console.log("bottom",bhleftbottom)
				break;
			}

			let value = buffer.obj.innerHTML.split("</p>")[i].replace(/\<[^()]*\>/g,'').replace(/&amp;/g,"&");
			

			if(bwleftedge < 0 && bwrightedge > this.width){ //OoB check
				value = value.substring(bwleftedge*-1,bw-(bwrightedge-this.width));
				//console.log(i,"oob",0,ypos-(bh/2)+i,value);
				replaceString(this.name,0,ypos-(bh/2)+i,value);
			
			}else if(bwleftedge < 0){
				//bordercheck left
				value = value.substring(bwleftedge*-1);
				//console.log(i,"left",0,ypos+i-(bh/2),value);
				replaceString(this.name,0,ypos+i-(bh/2),value);
		
			}else if(bwrightedge > this.width){ //bordercheck right
				value = value.substring(0,bw-(bwrightedge-this.width));
				//console.log(i,"right",xpos-(bw/2),ypos-(bh/2)+i,value);
				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
		
			}else{
				//console.log(i,"none",xpos-(bw/2),ypos-(bh/2)+i,value);
				replaceString(this.name,xpos-(bw/2),ypos-(bh/2)+i,value);
			}
			}
		}
	}


class ascBuffer {
	constructor (pathtotxt,name,parent){
		this.name = name;
		var buffer = document.createElement('div');
		buffer.id = name;

		//this.buffer.className = "unselectable";
		
		buffer.style.display = 'none';
		this.parent = document.querySelector(parent);
		this.parent.appendChild(buffer); 
		
		this.loaded = 0;
		let xhr = new XMLHttpRequest();
	   	
	   	xhr.onload = function() {
	        if (xhr.readyState == 4 && xhr.status == 200) {
	           let t = xhr.responseText.split('\n');
	        	for (var i = 0; i < t.length; i++){
					let p = document.createElement('p');
					p.id = "row" + i + "" + buffer.id; //set id
					p.innerText = t[i];
					buffer.appendChild(p);
					this.loaded = 1;
				}
			}
	    }
	    //using syncronous HTTP request, that is deprecated !!!
	    xhr.open('GET', pathtotxt,false);
	    xhr.send(null);
	    this.obj = buffer;
	    buffer = 0;

	    this.height = Math.floor(this.obj.innerHTML.split("</p>").length);
	    this.height % 2 != 0 ? this.height -= 1 : this.height = this.height;


	    this.width = this.obj.innerHTML.split("</p>")[1].replace(/\<[^()]*\>/g, '').length;
	    this.width % 2 != 0 ? this.width -= 1 : this.width = this.width;


	    //console.log(this.height,this.width)
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


String.prototype.replaceAt = function(index, replacement){return this.substring(0, index) + replacement + this.substring(index + replacement.length);}


replaceString = function(canvas,col,row,value){
	let row_data = document.getElementById("row"+row+""+canvas);
	
	//console.log(col,row,row_data,value)
	
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
