class Tree{
    constructor(posX, posY, skin){
        this.x = posX;
        this.y = posY;
        this.skin = skin;
        this.w = 200;
        this.h = 900;
    }

    update_position(){
        image(this.skin, this.x, this.y)
    }

    detect_collision(p){
        if( p.x + p.w /2 > this.x - this.w/2 &&
            p.x - p.w /2 < this.x + this.w/2 &&
            p.y + p.h /2 > this.y - this.h/2 &&
            p.y - p.h /2 < this.y + this.h/2   ){
                return true;
            }else{
                return false;
            }
    }

    check_overflow_y(){
        return this.y >= cs.h + this.h/2 ? true : false;
    }

    debug(){
        noFill();
        strokeWeight(4);
        stroke("yellow");
        rect(this.x, this.y, this.w, this.h);
        noStroke();
    }
}