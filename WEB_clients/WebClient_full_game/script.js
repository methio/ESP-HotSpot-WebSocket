// // ### CLIENT VARIABLES ####
// const wsUri = "ws://192.168.4.1/";
// const websocket = new WebSocket(wsUri);
// let isConnected = false;
// let clientID = 9;
// let data;

// websocket.addEventListener("error", e => {
//     console.log(`ERROR: ${JSON.stringify(e)}`);
// })

// websocket.addEventListener("open", () => {
//     console.log("CONNECTED");
//     isConnected = true;
// })

// websocket.addEventListener("message", e => {
//     data = JSON.parse(e.data);    
// })


// #### GAMES VARIABLES ####
const cs = {
    w: 1920,
    h: 600
};
const scenes = ["menu", "game", "lose", "win"];
let currentScene = scenes[0];
let speed = 5;
let treeSpawnSpeed = 3000; // (ms)
// entities
let grasses = [];
let grassesSkin;
let trees = [];
let treesSkin;
let enemies = [];
let enemiesSkin = {};
let player;
let playerSkins = [];
let currentFrame = 0;
let light;
let font;
let step = 0;

async function setup() {
    createCanvas(cs.w, 600);
    frameRate(12);
    noStroke();
    rectMode(CENTER);
    imageMode(CENTER);

    font = await loadFont('assets/DepartureMono-Regular.otf');

    // load skins
    for(let i = 0; i <= 6; i++){
        playerSkins[i] = await loadImage(`assets/walk_${i+1}.png`);
        if(i === 6){
            player = new Player(cs.w/2, cs.h - 200);
            light  = new Light(player.x, player.y);
        }
    }
    await loadEnemySkins(); 
    treesSkin   = await loadImage(`assets/tree.png`);
    grassesSkin = await loadImage("assets/grass.png");

    // welcome screen
    generateLandscape();
}

function draw() {

    background("#15170C");

    if(player){
        if(currentScene === "game"){
            // LIGHT STATES
            if (keyIsDown(LEFT_ARROW) === true) {
                light.size = 5;
                light.color = "rgb(233, 156, 40)";
                light.area = 100;
                player.zoneW = player.w *1;
                player.zoneH = player.h *1;
            }else{
                light.size = 10;
                light.color = "rgb(240, 226, 34)";
                light.area = 200;
                player.zoneW = player.w *2.5;
                player.zoneH = player.h *2.5;
            }
            
            enemies.forEach((enemy, index) => {
                enemy.y = enemy.y + speed;
                enemy.update_position();
                let collision = enemy.detect_collision(player); //, true, index);
                if(collision === "direct_collision"){
                    enemy.display(isEven(currentFrame), "b");
                    currentScene = "lose"
                }else if(collision === "imminent_collision"){
                    enemy.display(isEven(currentFrame), "b");
                }else{
                    enemy.display(isEven(currentFrame), "a");
                }
                if(enemy.check_overflow_y()){
                    enemies.splice(index, 1);
                }
            });

            light.update_position(player);
            light.draw_light(player);
            player.update_position(mouseX, currentFrame);
            currentFrame+=1;
            if(currentFrame === 6){
                currentFrame = 0;
            }
            
            trees.forEach((tree, index)=>{
                tree.y = tree.y + speed;
                tree.update_position();
                if(tree.check_overflow_y()){
                    trees.splice(index, 1);
                }
            });

            grasses.forEach((grass, index)=>{
                grass.y = grass.y + speed;
                grass.update_position();
                if(grass.check_overflow_y()){
                    grasses.splice(index, 1);
                }
            });

            light.draw_light_glow(player);
        }else{
            // idle screen
            player.update_position(width/2, 0);
            trees.forEach(tree=>tree.update_position());
            grasses.forEach(grass=>grass.update_position());

            if(currentScene === "lose"){
                step+=0.05;
                fill(`rgba(0, 0, 0, ${step})`);
                rect(cs.w/2, cs.h/2,cs.w, cs.h);
                fill(`rgba(154, 39, 39, ${step})`);
                textSize(100);
                textFont(font);
                text("lost in the woods", 450, height/2);
                if(step === 0.05){
                    setTimeout( ()=>{
                        resetAll();
                        generateLandscape();
                        currentScene = "menu";
                    }, 3000);
                }
            }
        }    
    }
}


setInterval(()=>{
    if(currentScene === "game"){
        // unshift instead of push so when rendering layers are displayed correctly
        trees.unshift(new Tree(randomizeSpawnX(), -400, treesSkin))
        grasses.push(new Grass(randomizeSpawnX(), 100, grassesSkin))
    }
}, treeSpawnSpeed);

setInterval(()=>{
    if(currentScene === "game"){
        enemies.push(new Enemy(random(100, cs.w-100), -10, enemiesSkin))
    }    
}, treeSpawnSpeed/10);



document.querySelector("#start_game").addEventListener("click", (e)=>{
    currentScene = "game";
})

document.querySelector("#stop_game").addEventListener("click", (e)=>{
    resetAll();
    generateLandscape();
    currentScene = "menu";
})

const randomizeSpawnX = (centerChance = 0.15, margin = 0) => {
    if (random() < centerChance) {
        return random(cs.w/3, 2*(cs.w/3));
    }
    return random() < 0.5
        ? random(margin, cs.w/3)
        : random(2*(cs.w/3), cs.w - margin);
}

const windowResized = () => {
    cs = {
        w: windowWidth,
        h: cs.h
    };
  resizeCanvas(cs.w, cs.h);
}

const generateLandscape = (density = 7) => {
    for(let i = 0; i <= density; i++){
            trees.unshift(new Tree(randomizeSpawnX(0.01), random(-100, cs.h+200), treesSkin))
            grasses.unshift(new Grass(randomizeSpawnX(0.4), random(100, cs.h-100), grassesSkin))
            grasses.unshift(new Grass(randomizeSpawnX(0.4), random(100, cs.h-100), grassesSkin))
    }
}

const resetAll = () => {
    trees = [];
    enemies = [];
    grasses = [];
}

const loadEnemySkins = async() => {
    enemiesSkin = {
        halo: {
            a: await loadImage("assets/enemy/halo_1.png"),
            b: await loadImage("assets/enemy/halo_2.png")
        },
        base: {
            a: await loadImage("assets/enemy/base_1.png"),
            b: await loadImage("assets/enemy/base_2.png")
        },
        eye: {
            a: await loadImage("assets/enemy/eye_1.png"),
            b: await loadImage("assets/enemy/eye_2.png"),
            c: await loadImage("assets/enemy/eye_2.png")
        }
    };
}

const isEven = (n) => {
   return n % 2 == 0 ? "a" : "b";
}