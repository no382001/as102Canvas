



# as102Canvas (under reconstruction)
some procedures have changed name and functionality, so some parts of this document does not apply

### a demo (using the first animated function):

![proto gif](https://user-images.githubusercontent.com/102482527/164079380-a459ec84-c0bc-443b-80ca-e104295a3f48.gif)

my code creates his own DOM element on the page in which it later operates, the DOM element consist of n paragraphs that each contain an ASCII array of m size <br>

<i>to create such beauty, link the *asc.js* script to your html, link your own script and lets get to typing</i>
<br>

	c = new ascCanvas("ascanvas",200,80,"body","x");
	
	c.fillRect(50,30,30,10," ");
	c.fillRect(55,35,30,10," ");

	c.addTextLine(50,30,"sapere aude!")
	c.addTextLine(60,35,"puer sum in paradiso dei")
what we have done so far:
 - given the canvas  a ***name***, this is its identifier and also the name of the DOM element (you can easily apply CSS styles to it)
 - choose a ***width*** and ***height*** that complies with the use case
 - choose a ***parent*** DOM element (the created canvas has to be assigned under a DOM element, *(e.g body)*)
 - finally choose a background "color" (**value**) that will fill the canvas

i wont explain here how **fillRect**, **addTextLine** , **clear**, **translate**, and **pop** works as they are the most basic operations, check the function table <br> 

here is the result:

![2](https://user-images.githubusercontent.com/102482527/167012905-eb974da9-993a-410e-bfe7-9cce0107dac1.png)

I will now present to you the main functions of the library (*the reason i made this whole thing*)

 take any text converted with the python script under the *img* folder and you can draw it on the canvas, easy as that<br>
 even if it fits or not, the buffer will load the text from your folder and the canvas can draw it on itself even if the picture is bigger than itself.

	c = new ascCanvas("image",100,50,"body","x");
	b = new ascBuffer("img/1.txt","firstbuffer","body");
	c.drawFromBuffer(b,100,40);

![3](https://user-images.githubusercontent.com/102482527/167014224-f78a8d29-d6ef-4d64-bd38-6310158d479a.png)

more to be added...



# The Library
each draw function draws from the center
| Canvas Object Functions     | Description |
| ----------- | ----------- |
|***translate(xpos,ypos)***| stores the translation on the coordinate stack|
|***pop()***| pops the coordinate stack|
| ***fillRect(xpos,ypos,w,h,value)***    | draw a rectangle at given position       |
| ***addTextLine(xpos,ypos,value)***   | draw text at given position        |
|***clear(value = bg)***| clear canvas, resetting it to the original background color, or filling the entire canvas with a different color|
|***drawFromBuffer(buffer,xpos,ypos)***| draw the content of the buffer selected to the canvas |
| ***drawWithScatter(buffer,xpos,ypos,speed=10)***| draw the content of the buffer with a random scatter animation |
| ***drawWithScroll(buffer,xpos,ypos,speed=2)*** | draw the content of the buffer with scrolling animation |
| ***copyToBuffer(buffer)*** | copy the contents of the canvas to a selected buffer|
<br>

  |Common Object Functions| Description|
  |-----------|-----------|
  |***delete()***| deletes the object along with the DOM element|
  |***getHeight()*** | returns the objects height |
  |***getWidth()***|returns the objects width|





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
