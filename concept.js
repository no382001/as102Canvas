
main = async () =>	{


	c = new ascCanvas("image",100,50,"body","x");

	//temp = new ascBuffer("img/1.txt","tempbuffer","body");
	//c.copyToBuffer(temp);

	b = new ascBuffer("img/1.txt","firstbuffer","body");

	await sleep(1000);

	await c.drawFromBuffer(b,100,30,2);

	await c.drawWithScatter(b,90,30,2);

	await c.drawWithDown(b,80,20,2);

}

main()

/*c.copyToBuffer(temp);

fixing asc.js:406 probably solves this, see notes

   Uncaught (in promise) TypeError: buffer.obj.innerHTML.split(...)[i] is undefined
    drawWithScatter http://0.0.0.0:8000/asc/asc.js:377
    main http://0.0.0.0:8000/concept.js:21
    async* http://0.0.0.0:8000/concept.js:25
*/