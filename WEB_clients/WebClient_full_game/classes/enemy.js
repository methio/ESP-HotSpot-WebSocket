class Enemy{
    constructor(posX, posY, skin){
        this.x = posX;
        this.refX = posX;
        this.y = posY;
        this.w = 30;
        this.h = 30;
        this.speed = 2;
        this.skin = skin;
        this.stroke = "#FFF";
        this.periode = random(4, 6); // 1 back and forth in seconds
        this.amplitude = random(80, 120); // amplitude in pixels
        this.phase = random(TWO_PI);
    }

    update_balancier(){
        this.x = this.refX + sin(TWO_PI * millis() / (this.periode * 1000) + this.phase) * this.amplitude;
    }

    update_position(){
        // balancier smooth du méchant en X
        this.update_balancier(); 
        image(this.skin, this.x, this.y, this.w, this.h)
    }

    detect_collision(p, debug = false, index = 0){
        if(debug){
            noFill();
            strokeWeight(4);
            stroke(this.stroke);
            rect(p.x, p.y, p.zoneW, p.zoneH);
            rect(p.x, p.y, p.w, p.h);
            rect(this.x, this.y, this.w, this.h);
            noStroke();
        }        

        if( p.x + p.w/2 > this.x - this.w/2 &&
            p.x - p.w/2 < this.x + this.w/2 &&
            p.y + p.h/2 > this.y - this.h/2 &&
            p.y - p.h/2 < this.y + this.h/2   ){
                
                if(debug){
                    console.log(`Enemy : ${index} -> direct_collision`);
                    this.stroke = "#f00";
                }
                return "direct_collision";
        }else if( 
            p.x + p.zoneW /2 > this.x - this.w /2 &&
            p.x - p.zoneW /2 < this.x + this.w /2 &&
            p.y + p.zoneH /2 > this.y - this.h /2 &&
            p.y - p.zoneH /2 < this.y + this.h /2   
        ){  
                if(debug){
                    this.stroke = "rgb(255, 187, 0)";
                    console.log(`Enemy : ${index} -> imminent_collision`) 
                }             
                return "imminent_collision";
        }else{
                if(debug){
                    this.stroke = "#FFF";
                console.log(`Enemy : ${index} -> no_collision`)
                }               
                return "no_collision";
        }        
    }

    check_overflow_y(){
        return this.y >= cs.h + this.h ? true : false;
    }

    debug(){
        noFill();
        strokeWeight(4);
        stroke(this.stroke);
        rect(this.x, this.y, this.w, this.h);
        noStroke();
    }
}