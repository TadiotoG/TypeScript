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
        let angle = -1;
        for(let j = 0; j < polygon.dots.length; j++){
            if (j === polygon.dots.length-1){
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[0]);
            } else {
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[j+1]);
            }
            if(aux == true){
                if (j === polygon.dots.length-1){
                    angle = this.calculate_angle(polygon.dots[j], polygon.dots[0]);
                } else {
                    angle = this.calculate_angle(polygon.dots[j], polygon.dots[j+1]);
                }
                return angle;
            }
        }
        return angle;
    }

    get_normal_vector(A, B) {
        let AB_x = B.x - A.x;
        let AB_y = B.y - A.y;
    
        // Vetor normal (perpendicular)
        let normal_x = -AB_y;
        let normal_y = AB_x;
    
        // Normalizar o vetor
        let magnitude = Math.sqrt(normal_x ** 2 + normal_y ** 2);
        return { x: normal_x / magnitude, y: normal_y / magnitude };
    }

    calculate_angle(A, B) {
        let AB_x = B.x - A.x;
        let AB_y = B.y - A.y;
    
        // Produto escalar
        let prod_escalar = this.vet_x * AB_x + (-this.vet_y) * AB_y;
    
        // Normas dos vetores
        let norma_AB = Math.sqrt(AB_x ** 2 + AB_y ** 2);
        let norma_vet_class = Math.sqrt(this.vet_x ** 2 + (-this.vet_y) ** 2);
    
        // Ângulo (cos)
        let result = prod_escalar / (norma_AB * norma_vet_class);
    
        // Produto vetorial para determinar o sinal
        let prod_vetorial = this.vet_x * AB_y - (-this.vet_y) * AB_x;
    
        let angle = Math.acos(result) * 180 / Math.PI;
    
        // Ajustar para ângulos no intervalo [0, 360)
        return prod_vetorial >= 0 ? angle : 360 - angle;
    }

    detect_colision_with_edge(A, B) {
        let VectorABx = B.x - A.x;
        let VectorABy = B.y - A.y;
    
        let VectorACx = this.x - A.x;
        let VectorACy = this.y - A.y;
    
        let tx = ((VectorABx * VectorACx) + (VectorABy * VectorACy)) / ((VectorABx ** 2) + (VectorABy ** 2));
    
        tx = Math.max(0, Math.min(1, tx)); // Garantir que tx esteja no intervalo [0, 1]
    
        let Pprojx = A.x + tx * VectorABx;
        let Pprojy = A.y + tx * VectorABy;
        let distance = Math.sqrt((Pprojx - this.x) ** 2 + (Pprojy - this.y) ** 2);
    
        return distance < this.radius + this.line_width / 2;
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
        let system_dot_1 = new Dot(0,height_limit);
        let system_dot_2 = new Dot(width_limit,height_limit);
        let system_dot_3 = new Dot(width_limit,0);
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
            let colision_flag = -1;
            for(let j = 0; j < this.polygons.length; j++){
                colision_flag = this.balls[i].detect_colision_betwen_objects(this.polygons[j])
                if (colision_flag != -1) {
                    console.log("Olha aí: " + colision_flag)
                    if (colision_flag !== -1) {
                        if ((colision_flag >= 0 && colision_flag <= 90) || (colision_flag > 270 && colision_flag < 360)) {
                            // Rebate vertical
                            this.balls[i].vet_y = -this.balls[i].vet_y;
                        } else {
                            // Rebate horizontal
                            this.balls[i].vet_x = -this.balls[i].vet_x;
                        }
                    }
                    
                }
            }
            // if(this.balls[i].detect_colision_with_edges)
            let old_x = this.balls[i].x;
            let old_y = this.balls[i].y;
            this.balls[i].update_position(old_x+this.balls[i].vet_x, old_y+this.balls[i].vet_y);
        }
        requestAnimationFrame(this.animate_world);
    }
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

var ball_1 = new Ball(20, 400, 200, 3, -1, -1, ctx);
// var ball_2 = new Ball(50, 200, 200, 3, 1, 1, ctx);

let uni = new Universe(ctx, canvas.width, canvas.height);

ball_1.draw_it();

uni.append_ball(ball_1);
// uni.append_ball(ball_2);

uni.animate_world();

function print_something(){
    console.log("Something!")
}