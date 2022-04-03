createAsciiCanvas = function(width,height,parent,bg){
	
	//creates a w*h canvas with parent and selected bg

	canvas = document.createElement('div');
	canvas.id = "image";
	parent = document.querySelector(parent);
	parent.appendChild(canvas);

	for (var i = 0; i <= height; i++){
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
        	for (var i = 1; i < t.length; i++){
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