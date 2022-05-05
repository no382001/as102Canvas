c = new ascCanvas("image",200,80,"body"," ");

b = new ascBuffer("img/1.txt","egy","body");



c.drawFromBuffer(b,100,40);

c.fillRect(50,30,100,100,"c");

c.copyToBuffer(b);

c.clear()

c.drawFromBuffer(b,100,40);
//c.drawWithScroll(b,100,30,2);

