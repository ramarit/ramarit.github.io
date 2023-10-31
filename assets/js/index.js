<script>
const canvas = document.getElementById('canvas'),
      c = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

function noise(c) {
    
    let w = c.canvas.width,
        h = c.canvas.height,
        imageData = c.createImageData(w, h),
        l = imageData.data.length,
        i = 0;

    for(; i < l;)
		// randomly choose colors from range
        imageData.data[i++] = (155 * Math.random()) + 70 | 20;
    
    c.putImageData(imageData, 0, 0);
}

// slow down static background
var toggle = true;
(function loop() {
    toggle = !toggle;
    if (toggle) {
		setTimeout( function()  {
        	requestAnimationFrame(loop);
		}, 20);   	
		return;
    }
    noise(c);
    requestAnimationFrame(loop);
})();

// separate letters to flicker individually
const headline = new SplitText('.overlay__headline', {
	type: 'chars',
});
headline.chars.forEach( (e) => {
	// access individual letter in pseudo selector
	const letter = e.innerHTML;
	e.dataset.headline = letter;
});

function getRandomInt(max, min) {
  return Math.floor(Math.random() * Math.floor(max - min) + min);
};

setInterval (function() {
	const l = headline.chars.length;
	const rand = Math.floor(Math.random() * l);
	const e = headline.chars[rand];
	console.log(e);
	e.style.opacity = Math.random();
	setTimeout(function() {
		e.style.opacity = 1;
	}, getRandomInt(300, 100));
}, getRandomInt(900, 400))
</script>