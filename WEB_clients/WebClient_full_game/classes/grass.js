class Grass{
    constructor(posX, posY, skin){
        this.x = posX;
        this.y = posY;
        this.w = 40;
        this.h = 64;
        this.skin = skin;
    }

    update_position(){
        image(this.skin, this.x, this.y, this.w, this.h);
    }

    check_overflow_y(){
        return this.y >= cs.h+this.h ? true : false;
    }

    debug(){
        noFill();
        strokeWeight(4);
        stroke("yellow");
        rect(this.x, this.y, this.w, this.h);
        noStroke();
    }
}