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
    return `#${hex}`;
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

    if(data.joystick_x < 1500){
        direction.x = -10;
    }else if(data.joystick_x > 3000){
        direction.x = 10;
    }else{
        direction.x = 0;        
    }
    if(data.joystick_y < 1500){
        direction.y = -10;
    }else if(data.joystick_y > 3000){
        direction.y = 10;
    }else{
        direction.y = 0;        
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
let col = "FF0";

let direction = {
    x: 0,
    y: 0
}

class Player {
    constructor(x=400, y=200, color="#F0F"){
        this.x = x;
        this.y = y;
        this.color = color;
    }

    display(){
        fill(this.color);
        circle(this.x, this.y, 40);
    }

    overflow(cw, ch){
        if(this.x < 0)this.x = cw;        
        if(this.x > cw)this.x = 0;
        if(this.y < 0)this.y = ch;
        if(this.y > ch)this.y = 0;
    }
}

class Coin {
    constructor(x=100, y=100, rad = 20){
        this.x = x;
        this.y = y;
        this.rad = rad;
    }

    isOverlapped(x, y){
        if(this.x - rad < x && this.x + rad > x && this.y - rad < y && this.y + rad > y){
            return true
        }else{
            return false
        }
    }

    display(){
        fill("#FF0");
        rect(this.x, this.y, this.rad);
    }
    
}

const player = new Player();

const coins = [];
for(let i = 0; i <= 5; i++){
    coins.push(new Coin(Math.floor(Math.random() * 750), Math.floor(Math.random() * 350)));
}


function setup() {
  createCanvas(800, 400);
  background(0);
}

function draw() {

    // make sure we receive data from the controler
    if(data !== undefined) {
        // cx = lerp(cx, data.joystick_x, 0.1);
        // cy = lerp(cy, data.joystick_y, 0.1);

        // fill(`#${col}`);
        // circle()
  background(0);
  
coins.forEach((coin, i) => {
            if(!coin.isOverlapped(player.x, player.y)){
    
                coin.display();
            }else{
                player.color = getRandomHex();
                coins.splice(i, 1);
            }
        })

        player.x += direction.x;
        player.y += direction.y; 
        player.overflow(width, height);     
        player.display();

        
            console.log();
        // console.log(player)
        // player.display(map(cx, 0, 4096, 0, width), map(cy, 0, 4096, height, 0))
    }
}
