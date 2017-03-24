var RaspiCam = require("raspicam");


// var camera = new RaspiCam({
// 	mode: "timelapse",
// 	output: "./photo/test%04d.jpg",
// 	encoding: "jpg",
// 	timeout: 0, // take the picture immediately
// 	//v:"true",
// 	w:1920,
// 	height:1080,
// 	q:100,
// 	t:30000,
// 	tl:1000
// });

//Video
var camera = new RaspiCam({
	mode: "video",
	output: "./video/test1.h264",
v:true,

	//v:"true",
	w:1920,
	h:1080,
	t:10000,
	vs:true,
	framerate: 60
});



camera.on("start", function( err, timestamp ){
	console.log("photo started at " + timestamp );
});

camera.on("read", function( err, timestamp, filename ){
  if(err)console.log("error ", err);
	console.log("photo image captured with filename: " + filename );

});

camera.on("exit", function( timestamp ){
	console.log("photo child process has exited at " + timestamp );
	  process.exit(0);
});

camera.start();
