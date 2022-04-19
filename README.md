

# as102Canvas
my ASCII HTML canvas implementation using javascript, plus an included python script to convert any image to ASCII text
## What it is capable of:

 1. create a new ascii canvas object

***class ascCanvas(name,width,height,parent,bg)***


	  let c = new ascCanvas("image",200,80,"body","x");
        
2. draw n,m sized rectangle

***ascCanvas.fillRect(xpos,ypos,w,h,value)***
      
      c.fillRect(15,30,40,10," ");
	
4. print text to the desired location 

***ascCanvas.addTextLine(xpos,ypos,value)***
  
      c.addTextLine(20,20,"Anithin is Possible");
	
6. push and pop coordinates to the coordinate stack that will affect any drawing in scope

  
		c.cstack.push(50,50);
	
7. load an image into a buffer object, either from a variable (loadmode=1) or a txt file (loadmode=0)

***class ascBuffer(pathtotxt,name,parent,loadmode=0,bh=0)***
  
      let b = new ascBuffer("img/1.txt","buffer_one","body");

9. using the buffer you can now draw images on the canvas 
  
***ascCanvas.drawFromBuffer(buffer,xpos,ypos)***
  
      c.drawFromBuffer(b,0,0);
	
11. you can also draw with this cool animation 

***ascCanvas.drawWithScatter(buffer,xpos,ypos,speed=10)***
  
      c.drawWithScatter(b,120,70);

## Recommendations:
if you try this without any CSS on your website you will quickly notice that it isn't as pretty as it should be. <br>
wherever you want to place the canvas, make sure that the section uses the **monospace** font types like this:

	font-family: "Lucida Console", "Courier New", monospace;

i also recommend: 
			
	white-space: pre;

although i forgot what it did exactly and removing it makes no noticable difference. <br>
but perhaps the most important is setting the **line-height** to **zero** if you want your ASCII canvas to look like a real canvas.

	line-height : 0px;
one last addition is a code to make the text **unselectable** to users, i think this improves the whole concept a lot, because with this little snippet of CSS, yeah, the text will be unselectable

	.unselectable {
	    -webkit-touch-callout: none;
	    -webkit-user-select: none;
	    -khtml-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    user-select: none;
	}
