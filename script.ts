class Dot{
    x: number;
    y: number;

    constructor(new_x: number, new_y: number){
        this.x = new_x;
        this.y = new_y;
    }
}

class Polygon{
    dots: Array<Dot>;
    color: string;

    constructor(new_color: string, dots_array: Array<Dot>){
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
    }
}

class Ball {
    radius: number;
    x: number;
    y: number;
    line_width: number;
    vet_x: number;
    vet_y: number;
    ctx: CanvasRenderingContext2D;

    constructor(radius: number, x: number, y: number, line_width: number, x_vector: number, y_vector: number, ctx_out: CanvasRenderingContext2D){
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.line_width = line_width;
        this.vet_x = x_vector;
        this.vet_y = y_vector;
        this.ctx = ctx_out;
    }

    draw_it() {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.line_width;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
    }

    update_position(x: number, y:number){
        this.x = x;
        this.y = y;
        this.draw_it();
    }

    print_info(){
        console.log("Radius: " + this.radius);
        console.log("X: " + this.x);
        console.log("Y: " + this.y);
        console.log("Line width: " + this.line_width);
    }

    detect_colision_betwen_objects(polygon: Polygon){
        let aux = false;
        for(let j = 0; j < polygon.dots.length; j++){
            if ( j === polygon.dots.length-1){
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[0]);
            } else {
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[j+1]);
            }
            if(aux == true){
                return true;
            }
        }
        return false;
    }

    detect_colision_with_edge(A: Dot, B: Dot){
        let VectorABx = B.x - A.x;
        let VectorABy = B.y - A.y;
    
        let VectorACx = this.x - A.x;
        let VectorACy = this.y - A.y;
    
        let tx = ((VectorABx * VectorACx) + (VectorABy * VectorACy)) / ((VectorABx * VectorABx) + (VectorABy * VectorABy));
    
        if (tx > 1){
            tx = 1;
         } else if (tx < 0) {
            tx = 0;
        }
    
        let Pprojx = (A.x + tx * VectorABx);
        let Pprojy = (A.y + tx * VectorABy);
        let distance = Math.sqrt((Pprojx - this.x) ** 2 + (Pprojy - this.y) ** 2)

        if (distance < this.radius){
            return true;
        } else {
            return false;
        }
    }
}

class Universe {
    balls: Array<Ball>;
    ctx: CanvasRenderingContext2D;
    polygons: Array<Polygon>;

    constructor(ctx_out: CanvasRenderingContext2D, width_limit: number, height_limit: number){
        this.ctx = ctx_out;
        this.balls = [];
        this.polygons = [];
        let system_dot_0 = new Dot(0,0);
        let system_dot_1 = new Dot(width_limit,0);
        let system_dot_2 = new Dot(width_limit,height_limit);
        let system_dot_3 = new Dot(0,height_limit);
        let array_aux = [];
        array_aux.push(system_dot_0)
        array_aux.push(system_dot_1)
        array_aux.push(system_dot_2)
        array_aux.push(system_dot_3)
        let aux = new Polygon("black", array_aux);
        this.polygons.push(aux);
    }
    

    append_ball(new_ball: Ball){
        // new_ball.print_info();
        new_ball.draw_it();
        this.balls.push(new_ball);
    }

    animate_world = () => {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.balls.length; i++){
            let colision_flag = false;
            for(let j = 0; j < this.polygons.length; j++){
                colision_flag = this.balls[i].detect_colision_betwen_objects(this.polygons[j])
                if(colision_flag) {
                    this.balls[i].vet_x = -this.balls[i].vet_x;
                }
            }
            // if(this.balls[i].detect_colision_with_edges)
            let old_x = this.balls[i].x;
            let old_y = this.balls[i].y;
            this.balls[i].update_position(old_x+this.balls[i].vet_x, old_y+this.balls[i].vet_y);
        }
        requestAnimationFrame(this.animate_world);
    }

    // detect_colision2AllObjs(){
    //     let aux = false;
    //     for(let i = 0; i < this.balls.length; i++){
    //         for(let j = 0; j < this.dots.length; j++){
    //             if ( j === this.dots.length-1){
    //                 aux = this.balls[i].detect_colision_with_edge(this.dots[j], this.dots[0]);
    //             } else {
    //                 aux = this.balls[i].detect_colision_with_edge(this.dots[j], this.dots[j+1]);
    //             }
    //             if(aux == true){
    //                 return true
    //             }
    //         }
    //     }
    //     return aux;
    // }
}

const canvas = document.createElement("canvas")
canvas.id = "canvas-giratorio"
canvas.style.backgroundColor = "white"
canvas.style.border = "1px solid black"
canvas.style.width = "1000px"
canvas.style.height = "800px"
var ctx = canvas.getContext("2d")
canvas.width = 1000;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);

var ball_1 = new Ball(100, 200, 200, 3, 1, 0, ctx);
var ball_2 = new Ball(50, 200, 200, 3, 1, 0, ctx);

let uni = new Universe(ctx, canvas.width, canvas.height);

ball_1.draw_it();

uni.append_ball(ball_1);
uni.append_ball(ball_2);

uni.animate_world();