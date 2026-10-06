class Light{
    constructor(posX, posY){
        this.x = posX;
        this.y = posY;
        this.size = 10;
        this.color = "rgb(233, 156, 40)"
        this.area = 200;
    }

    update_position(p){
        this.x = p.x;
        this.y = p.y;
    }

    draw_light(p = player){
        fill(this.color)
        circle(p.x+8, p.y-15, this.size);
    }

    draw_light_glow(p = player, darkness = 0.65){
        const ctx = drawingContext;
        const r = this.area / 2;
        const g = ctx.createRadialGradient(p.x, p.y, r, p.x, p.y, r*1.5);
        g.addColorStop(0, "rgba(0, 0, 0, 0)");         // center
        g.addColorStop(1, `rgba(0, 0, 0, ${darkness})`); // border

        ctx.save();
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

}