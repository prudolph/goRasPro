// button is attached to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    led = new GPIO(22, 'out'),
    button = new GPIO(27, 'in', 'both');

var fs = require('fs');
var path = require('path');

var RaspiCam = require("raspicam");
//Video

    var MP4Box = require('mp4box').MP4Box; // Or whatever import method you prefer.

var recording=false;
var recordingIndicator=false;
var directory = "./video/";
var currentVideoFile="";

var cameraSettings = {
	mode: "video",
  output: "",
  v:true,
	w:1920,
	h:1080,
	t:10000,
	vs:true,
	framerate: 60
}
var camera = new RaspiCam(cameraSettings);

// define the callback function
function state(err, state) {

  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    led.writeSync(1);
    console.log("Button Pressed - Start Recording");
    if(!recording){
    //Set Video File Name
    currentVideoFile=generateFilename();
    camera.set( "output", currentVideoFile );

    //Start Recording
    camera.start();
    recording=true;

  }else{
      recording=false;
      camera.stop();
  }

  } else {
    // turn LED off
    console.log("Button Released");
        led.writeSync(0);
  }
}


camera.on("start", function( err, timestamp ){
	console.log("photo started at " + timestamp );
});

camera.on("read", function( err, timestamp, filename ){
  if(err)console.log("error ", err);
	console.log("----------------photo image captured with filename: " + filename );

});

camera.on("exit", function( timestamp ){
	console.log("photo child process has exited at " + timestamp );
    processVideo(currentVideoFile,function(){
      console.log("Video Processing complete: ", currentVideoFile);
    });
});

function processVideo(filePath,callback){
  console.log("Processing Video ...");
  try {
    var outputFilePath = path.basename(filePath)+".mp4";
    console.log("outputFilePath ", outputFilePath);
    var videoFrameRate = camera.get("framerate");

    var exec = require('child_process').exec;
    var cmd = 'MP4Box -add '+ filePath +' '+ outputFilePath;

    exec(cmd, function(error, stdout, stderr) {
      // command output is in stdout
      console.log(stdout);
    });



  } catch (e) {
  	console.log(e.code);
  	console.log(e.msg);
  }

}
function generateFilename(){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year  = date.getFullYear();
  var hour =date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();

  var fullpath = directory+month+"_"+day+"_"+year+"_"+hour+""+min+""+sec;
  if (fs.existsSync(fullpath+".h264")) {
    fullpath+="_1";
  }
  fullpath+=".h264";
  return fullpath;
}

// pass the callback function to the
// as the first argument to watch()
button.watch(state);
console.log("Ready");

 (function(){
   if(recording){
     led.writeSync(1);
   }
     // do some stuff
    setTimeout(arguments.callee, 500);

  })();
