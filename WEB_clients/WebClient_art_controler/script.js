const wsUri = "ws://192.168.4.1/";
const websocket = new WebSocket(wsUri)
let isConnected = false
let counter = 0
let clientID = 9;

// project var
let data;
const digits = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
console.log(digits[2]);
const getRandomHex = (amount = 3) => {
    let hex = "";
    for(let i = 0; i < amount; i++){
        hex += digits[Math.floor( Math.random() * digits.length)];
        console.log(hex, Math.floor( Math.random() * digits.length))
    }
    return hex;
}


websocket.addEventListener("error", e => {
    console.log(`ERROR: ${JSON.stringify(e)}`)
})

websocket.addEventListener("open", () => {
    console.log("CONNECTED")
    isConnected = true
})

websocket.addEventListener("message", e => {
    data = JSON.parse(e.data)
    if(data.button_left){
        rad = random(10, 200);
    }
    if(data.tilt === 0){
        background(0);
    }
    if(data.button_right){
        // gris = random(50, 255);
        col = getRandomHex();
        console.log(col)

    }
    // console.log(data)
})

document.querySelector("#on").addEventListener("click", e => {
    const message = {
        clientID: 1,
        m: "coucou",
    };
    websocket.send(JSON.stringify(message));
});


let rad = 20;
let cx = 2048;
let cy = 2048;
let gris = 127;
let col = "FF0"

function setup() {
  createCanvas(800, 400);
  background(0);
}

function draw() {

    // make sure we receive data from the controler
    if(data !== undefined) {
        cx = lerp(cx, data.joystick_x, 0.1);
        cy = lerp(cy, data.joystick_y, 0.1);

        fill(`#${col}`);
        circle(map(cx, 0, 4096, 0, width), map(cy, 0, 4096, height, 0), rad)
    }
}
