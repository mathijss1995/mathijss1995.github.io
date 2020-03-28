var recordedChunks = [];
var constraints = { audio: false, video: true };
var options = {mimeType: 'video/webm; codecs=vp9'};
let data = "Test";

//Comment for Github


function startExperiment(){
  // console.log("haha")
  var x = document.getElementById("container");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  setTimeout(function(){ download(); }, 30000);
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	console.log("satisfied")
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		mediaRecorder = new MediaRecorder(stream, options);
		mediaRecorder.ondataavailable = handleDataAvailable;
		mediaRecorder.start(2000);
		webcamTime = Date.now() + 2000;
	})
}

function handleDataAvailable(event) {
  // console.log(event)
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}



if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      console.log(stream)
      var video = document.getElementById("videoElement");
      video.srcObject = stream
      console.log(video)
    })
    .catch(function (err0r) {
      console.log(err0r);
    });
}

function download() {
	mediaRecorder.stop()
	var blob = new Blob(recordedChunks, {
	type: 'video/webm'
	});
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	document.body.appendChild(a);
	

	a.style = 'display: none';
	a.href = url;
	a.download = str(webcamTime)+'.webm';
	a.click();
	window.URL.revokeObjectURL(url);

	var textDoc = document.createElement('a');

	  textDoc.href = 'data:attachment/text,' + encodeURI(texts.join('\n'));
	  textDoc.target = '_blank';
	  textDoc.download = str(webcamTime)+'.txt';
	  textDoc.click();
}

var bird;
var pipes = [];
var texts = [];

function setup() {
	
  document.getElementById("startExperiment").addEventListener("click", startExperiment);
  //createCanvas(1200, 700);
  console.log('width: ' + innerWidth + 'height: ' + innerHeight);
  createCanvas(window.innerWidth, window.innerHeight);
  bird = new Bird();
  this.score = 0;
  //document.getElementById('timer').innerHTML = 000 + ":" + 20; //set lenght
	//startTimer();
  var el = document.getElementById('finished');
	if(el){
		console.log(" haha")
	  el.addEventListener('click', download);
	}
}

function draw() {
	var str = "newFrame" + ";" + Date.now() + ';BirdStatus; ' + bird.dead + ';Score; ' + score + ';bird.y; ' + bird.y + ';EndLine' + ';';
    texts.push(str);

  background(135,206,235);

  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(32);
  text(this.score, width / 2, 50);

  if (bird.dead == 'no') {
  	console.log('bird is not dead')
    noStroke();
    fill(205,133,63);
    rect(0, height - 32, width, height - 32);

    fill(255, 255, 0);
    ellipse(0, 0, 256, 256);

    
    bird.update();
    bird.show();
    bird.checkBorder();

    if (frameCount % 60 == 0) {
      pipes.push(new Pipe());
    }

    for (var p of pipes) {
      p.show();
      p.update();
      console.log('Piller x: ' + p.x + 'piller y: ' + p.y);
      if (p.hit(bird) == 'yes') {
      	console.log("I'm dead");
        bird.dead = 'yes';
        //var str = Date.now() + "," + "DEAD" + "," + score;
    	//texts.push(str)
      }

      if (p.scored(bird)) {
        this.score++;
        console.log(score + " Timestamp: " + Date.now())
      }
    }

    for (var i = 0; i < pipes.length; i++) {
      if (pipes[i].checkBorder()) {
        pipes.splice(i, 1);
      }
    }

  } else if (bird.dead == 'yes') {

    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(25);
    text("Press ENTER to play again.", width / 2, height / 2 + 10);

    noStroke();
    textSize(32);
    fill(0);
    text("DEAD!", width / 2, 200);


    //text(sec, width / 2, 100);

  } else if (bird.dead == 'notStarted'){
  	text("Welcome", width/2, height/2);
  	text('Press ENTER to start', width/2, height*.75);

  	
  	
  }
}

function mousePressed() {
  if(bird.dead == 'no'){
    bird.jump();
    var str = "JUMP;" + Date.now() + ";EndLineJump" + ';';
    texts.push(str);
  }
}

function keyPressed() {
  if (key == ' ') {
    bird.jump();
    var str = "JUMP;" + Date.now() + ";EndLineJump" + ';';
    texts.push(str);
  } else if((keyCode === RETURN || keyCode === ENTER) && (bird.dead == 'yes' || bird.dead == 'notStarted')){
    pipes = [];
    bird = new Bird();
    this.score = 0;
    bird.dead = 'no';
    //var str = Date.now() + "," + "RESET" + "," + score +'\n';
    //texts.push(str)
  } else if(key == 'a'){ 
  	bird.dead = 'no';
  }
}

function startTimer() {
  var presentTime = document.getElementById('timer').innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  if(s==59){m=m-1}
  //if(m<0){alert('timer completed')}
  
  document.getElementById('timer').innerHTML =
    m + ":" + s;
  console.log(m)
  setTimeout(startTimer, 1000);

  if (s == 0 && m == 0){
  	//download()
  }
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}

