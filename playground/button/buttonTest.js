// button is attached to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    button = new GPIO(17, 'in', 'both');

// define the callback function
function state(err, state) {

  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    console.log("Button Pressed");
  } else {
    // turn LED off
    console.log("Button Released");
  }

}

// pass the callback function to the
// as the first argument to watch()
button.watch(state);
