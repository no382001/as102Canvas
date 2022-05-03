



# as102Canvas

|my ASCII HTML "canvas" implementation using javascript, the "canvas" is only a canvas in the practical sense.|  |
|-------------------------------------------------------------------------------------------------------------|--|
<br>
my code creates his own DOM element on the page in which it later operates, the DOM element consist of n paragraphs that contain ASCII characters of m size <br><br>
the replacing algorithm simply finds the row to be modified and swaps the old text with the corrected one, the interactions are almost seemless 


i have also included python script to convert any image to ASCII text.
<br>
### a demo (using the first animated function):

![proto gif](https://user-images.githubusercontent.com/102482527/164079380-a459ec84-c0bc-443b-80ca-e104295a3f48.gif)

# How to use:

 - to be able to do anything, you first have to create an **ascCanvas** object
	 - give it a ***name***, this is its identifier and also the name of the DOM element (you can easily apply CSS styles to it)
	 - choose a **width** and **height** that complies with the use case
	 - choose a ***parent*** DOM element (the created canvas has to be assigned under a DOM element, e.g body)
	 - finally choose a background "color" that will fill the canvas

***class ascCanvas(name,width,height,parent,bg)***


	  let c = new ascCanvas("image",200,80,"body","x");
        


 3. now that we have a canvas lets start with an n * m sized rectangle

***ascCanvas.fillRect(xpos,ypos,w,h,value)***
      
      c.fillRect(15,30,40,10," ");
	
4. add some text to it 

***ascCanvas.addTextLine(xpos,ypos,value)***
  
      c.addTextLine(20,20,"Anithin is Possible");
	
6. push and pop coordinates to the coordinate stack that will affect any drawing in scope. its a really useful tool that makes everyone's life easier

  
		c.cstack.push(50,50);
	
7. we have reached the main feature, you can load an image into a buffer object, either from a variable (loadmode=1) or a txt file (loadmode=0)

***class ascBuffer(pathtotxt,name,parent,loadmode=0,bh=0)***
  
      let b = new ascBuffer("img/1.txt","buffer_one","body");

9. using this buffer you can now draw images on the canvas 
  
***ascCanvas.drawFromBuffer(buffer,xpos,ypos)***
  
      c.drawFromBuffer(b,0,0);
	
11. you can also draw with this cool animation *(just be careful its an async function, wait for it to finish)* 

***ascCanvas.drawWithScatter(buffer,xpos,ypos,speed=10)***
  
      c.drawWithScatter(b,120,70);

# Recommendations:
if you try this without any CSS on your website you will quickly notice that it isn't as pretty as it should be. <br>
wherever you want to place the canvas, make sure that the section uses the **monospace** font types like this:

	font-family: "Lucida Console", "Courier New", monospace;

i also recommend using: 
			
	white-space: pre;

although i forgot what it did exactly and removing it makes no noticable difference. but to make this work and look exactly like in the presentation above  you should also have this in your css <br>
the heart and soul of the whole gig is setting the **line-height** to **zero** if you want your ASCII canvas to look like a real canvas, instead a stack of paragraphs (which it really is).

	line-height : 0px;
a last addition is a code to make the text **unselectable** to users, i think this improves the whole concept a lot, because with this little snippet of CSS, yeah, the text will be unselectable

	.unselectable {
	    -webkit-touch-callout: none;
	    -webkit-user-select: none;
	    -khtml-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    user-select: none;
	}
