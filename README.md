



# as102Canvas


### a demo (using the first animated function):

![proto gif](https://user-images.githubusercontent.com/102482527/164079380-a459ec84-c0bc-443b-80ca-e104295a3f48.gif)

# The Library

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
