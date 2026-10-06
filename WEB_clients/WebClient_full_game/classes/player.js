class Player{
    constructor(posX = cs.w/2, posY = cs.h - 200, colliderWidth = 64, colliderHeight = 64){
        this.x = posX;
        this.y = posY;
        this.w = colliderWidth;
        this.h = colliderHeight;
        this.zoneW = colliderWidth*2.5;
        this.zoneH = colliderHeight*2.5;
    }

    update_position(posX, skinIndex){
        this.x = posX;
        image(playerSkins[skinIndex], this.x, this.y)        
    }

    debug(){
        noFill();
        strokeWeight(2);
        stroke("yellow");
        rect(this.x, this.y, this.w, this.h);
        stroke("orange");
        rect(this.x, this.y, this.zoneW, this.zoneH);
        noStroke();
    }
}