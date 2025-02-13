class Dot{
    x: number;
    y: number;

    constructor(new_x: number, new_y: number){
        this.x = new_x;
        this.y = new_y;
    }
}

function distance(A: Dot, B: Dot){
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}

class Polygon{
    dots: Array<Dot>;
    color: string;
    closed: boolean;

    constructor(new_color: string, dots_array: Array<Dot>, closed: boolean = true){
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
        this.closed = closed;
    }

    draw_it(context: CanvasRenderingContext2D) {
        if (this.dots.length < 2) {
            console.warn("Polygon needs at least two points to be drawn.");
            return;
          }
      
          context.beginPath();
          // Mover para o primeiro ponto
          context.moveTo(this.dots[0].x, this.dots[0].y);
      
          // Criar linhas para os outros pontos
          for (let i = 1; i < this.dots.length; i++) {
            context.lineTo(this.dots[i].x, this.dots[i].y);
          }
      
          // Fechar o polígono ligando o último ponto ao primeiro
          if(this.closed === true){
            context.closePath();
          }
      
          // Preencher o polígono com a cor definida
          if(this.color !== "void"){
            context.fillStyle = this.color;
            context.fill();
          }
      
          // Opcional: adicionar uma borda
          context.strokeStyle = "black";
          context.stroke();
    }
}

class CircleAsPolygon{
    thetas_list: number[];
    dots: Array<Dot>;
    x_pos: number;
    y_pos: number;
    rad: number;
    whole: boolean;
    color: string;
    velocity: number;
    num_points: number;
    whole_size: number;
    start_color: number[]; // rgb
    end_color: number[]; // rgb `rgb(0, 255, 0)`

    constructor(pos_x: number, pos_y: number, radius:number, color: string, whole: boolean = true, vel: number, whole_size: number=5, num_points: number=100, start_rgb: number[]=[0,0,255], end_rgb: number[]=[0,255,0],){
        this.whole = whole;
        this.x_pos = pos_x;
        this.y_pos = pos_y;
        this.rad = radius;
        this.velocity = vel;
        this.color = color;
        this.num_points = num_points;
        this.whole_size = whole_size;
        this.thetas_list = [];
        this.start_color = start_rgb;
        this.end_color = end_rgb;
        this.getTheta();
        this.getDots();
    }

    rotate(){
        let fix_problem = 0.3;

        this.dots[this.dots.length-2].x = this.x_pos + (this.rad-fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length-1] + this.velocity);
        this.dots[this.dots.length-2].y = this.y_pos + (this.rad-fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length-1] + this.velocity);

        this.dots[this.dots.length-1].x = this.x_pos + (this.rad+fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length-1] + this.velocity);
        this.dots[this.dots.length-1].y = this.y_pos + (this.rad+fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length-1] + this.velocity);

        this.dots[0].x = this.x_pos + (this.rad-fix_problem) * Math.cos(this.thetas_list[0] + this.velocity);
        this.dots[0].y = this.y_pos + (this.rad-fix_problem) * Math.sin(this.thetas_list[0] + this.velocity);

        this.dots[1].x = this.x_pos + (this.rad+fix_problem) * Math.cos(this.thetas_list[0] + this.velocity);
        this.dots[1].y = this.y_pos + (this.rad+fix_problem) * Math.sin(this.thetas_list[0] + this.velocity);

        for(let i=0; i<this.thetas_list.length; i++){
            this.thetas_list[i] += this.velocity;
            this.dots[i+2].x = this.x_pos + this.rad * Math.cos(this.thetas_list[i]);
            this.dots[i+2].y = this.y_pos + this.rad * Math.sin(this.thetas_list[i]);
        }
}

    getDots(){
        let points = []; 
        let fix_problem = 0.3;

        let x_0 = this.x_pos + (this.rad-fix_problem) * Math.cos(this.thetas_list[0]);
        let y_0 = this.y_pos + (this.rad-fix_problem) * Math.sin(this.thetas_list[0]);
        
        let x_1 = this.x_pos + (this.rad+fix_problem) * Math.cos(this.thetas_list[0]);
        let y_1 = this.y_pos + (this.rad+fix_problem) * Math.sin(this.thetas_list[0]);
        points.push(new Dot(x_0, y_0));
        points.push(new Dot(x_1, y_1));

        for (let i = 0; i < this.thetas_list.length; i++) {
            let x = this.x_pos + this.rad * Math.cos(this.thetas_list[i]);
            let y = this.y_pos + this.rad * Math.sin(this.thetas_list[i]);
            
            points.push(new Dot(x, y));
        }
        
        let x_last = this.x_pos + (this.rad-fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length-1]);
        let y_last = this.y_pos + (this.rad-fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length-1]);

        let x_last_2 = this.x_pos + (this.rad+fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length-1]);
        let y_last_2 = this.y_pos + (this.rad+fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length-1]);
        
        points.push(new Dot(x_last, y_last));
        points.push(new Dot(x_last_2, y_last_2));
        this.dots = points;
    }

    getTheta(){
        if(this.whole === true){
            for (let i = 0; i < this.num_points-this.whole_size; i++) {
                this.thetas_list.push((i / this.num_points) * 2 * Math.PI);
            }
        } else {
            for (let i = 0; i < this.num_points; i++) {
                this.thetas_list.push((i / this.num_points) * 2 * Math.PI);
            }
        }
    }
    

    draw_it(context: CanvasRenderingContext2D) {
        let tx_r:number, tx_g:number, tx_b: number;
        // if(this.whole === true){
        tx_r = (this.end_color[0] - this.start_color[0])/(this.dots.length-1)
        tx_g = (this.end_color[1] - this.start_color[1])/(this.dots.length-1)
        tx_b = (this.end_color[2] - this.start_color[2])/(this.dots.length-1)
        // } else {
        //     tx_r = (this.end_color[0] - this.start_color[0])/this.num_points
        //     tx_g = (this.end_color[1] - this.start_color[1])/this.num_points
        //     tx_b = (this.end_color[2] - this.start_color[2])/this.num_points
        // }

        let actual_r = this.start_color[0];
        let actual_g = this.start_color[1];
        let actual_b = this.start_color[2];

        console.log("Start color = " + actual_r + ", " + actual_g + ", " + actual_b)

        if (this.dots.length < 2) {
            console.warn("Polygon needs at least two points to be drawn.");
            return;
          }
          
          context.lineWidth = 3;
          // Mover para o primeiro ponto
      
          // Criar linhas para os outros pontos
          for (let i = 1; i < this.dots.length; i++) {
            context.beginPath();
            context.moveTo(this.dots[i-1].x, this.dots[i-1].y)
            context.lineTo(this.dots[i].x, this.dots[i].y);
            context.strokeStyle = `rgb(${Math.floor(actual_r)} ${Math.floor(actual_g)} ${Math.floor(actual_b)}`;
            
            actual_r += tx_r;
            actual_g += tx_g;
            actual_b += tx_b;

            context.stroke();
          }
          console.log("End color = " + actual_r + ", " + actual_g + ", " + actual_b)
      
          // Fechar o polígono ligando o último ponto ao primeiro
          if(this.whole === false){
            context.closePath();
          }
      
          // Preencher o polígono com a cor definida
          if(this.color !== "void"){
            context.strokeStyle = this.color;
            context.fill();
          }
      
          // Opcional: adicionar uma borda
        //   context.strokeStyle = "black";
        //   context.stroke();
    }
}

// function getCircleBorderPoints(xc: number, yc: number, radius: number, numPoints: number = 100, whole: boolean = false){
//     let points = [];
//     if(whole === true){
        
//         for (let i = 0; i < numPoints-3; i++) {
//             let theta = (i / numPoints) * 2 * Math.PI;  
//             let x = xc + radius * Math.cos(theta);
//             let y = yc + radius * Math.sin(theta);
            
//             points.push(new Dot(x, y));
//         }
//         let theta_last = (0 / numPoints) * 2 * Math.PI;  
//         let x_last = xc + radius-3 * Math.cos(theta_last);
//         let y_last = yc + radius-3 * Math.sin(theta_last);
//         points.push(new Dot(x_last, y_last));

//     } else {
//         for (let i = 0; i < numPoints; i++) {
//             let theta = (i / numPoints) * 2 * Math.PI;
//             let x = xc + radius * Math.cos(theta);
//             let y = yc + radius * Math.sin(theta);
            
//             points.push(new Dot(x, y));
//         }
//     }
//     return points;
// }

class Ball {
    fill_color: string;
    border_color: string;
    radius: number;
    x: number;
    y: number;
    line_width: number;
    vet_x: number;
    vet_y: number;
    ctx: CanvasRenderingContext2D;
    gravity: number;
    growing_value: number;
    shadow_pos_list: Array<Dot>;
    shadow_num: number;

    constructor(border_col: string, fill_col:string, radius: number, x: number, y: number, line_width: number, x_vector: number, y_vector: number, ctx_out: CanvasRenderingContext2D, growing_v: number = 0.5, how_many_shadows: number=20){
        this.fill_color = fill_col;
        this.border_color = border_col;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.line_width = line_width;
        this.vet_x = x_vector;
        this.vet_y = y_vector;
        this.gravity = 0.02;
        this.ctx = ctx_out;
        this.growing_value = growing_v;
        this.shadow_pos_list = []
        this.shadow_num = how_many_shadows;
        this.create_shadow_list();

    }

    create_shadow_list(){
        for(let i=0; i < this.shadow_num; i++){
            this.shadow_pos_list.push(new Dot(this.x, this.y));
        }
    }

    update_shadow_list(){
        for(let i=this.shadow_num-1; i >= 1; i--){// Acessando os ultimos primeiro
            this.shadow_pos_list[i].x = this.shadow_pos_list[i-1].x;
            this.shadow_pos_list[i].y = this.shadow_pos_list[i-1].y;
        }
        
        this.shadow_pos_list[0].x = this.x;
        this.shadow_pos_list[0].y = this.y;
    }

    draw_it() {
        this.draw_shadows();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.line_width;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = this.fill_color;
        this.ctx.fill();
        this.ctx.strokeStyle = this.border_color;
        this.ctx.stroke();
    }

    draw_shadows(){
        for(let i=this.shadow_pos_list.length-1; i>=0; i--){// Acessando os ultimos primeiro
            this.ctx.beginPath();
            this.ctx.lineWidth = this.line_width;
            this.ctx.arc(this.shadow_pos_list[i].x, this.shadow_pos_list[i].y, this.radius-i, 0, Math.PI * 2, true);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.strokeStyle = this.border_color;
            this.ctx.stroke();
        }
    }

    update_position(){
        this.update_shadow_list();
        this.vet_y += this.gravity;
        this.x += this.vet_x;
        this.y += this.vet_y;
        this.draw_it();
    }

    print_info(){
        console.log("Radius: " + this.radius);
        console.log("X: " + this.x);
        console.log("Y: " + this.y);
        console.log("Line width: " + this.line_width);
    }

    detect_colision_edges(polygon: Polygon){
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

    detect_colision_with_edge(A: Dot, B: Dot) {
        let VectorABx = B.x - A.x;
        let VectorABy = B.y - A.y;
    
        let VectorACx = this.x - A.x;
        let VectorACy = this.y - A.y;
    
        let tx = ((VectorABx * VectorACx) + (VectorABy * VectorACy)) / ((VectorABx ** 2) + (VectorABy ** 2));
    
        tx = Math.max(0, Math.min(1, tx)); // Garantir que tx esteja no intervalo [0, 1]
    
        let Pprojx = A.x + tx * VectorABx;
        let Pprojy = A.y + tx * VectorABy;
        let distance = Math.sqrt((Pprojx - this.x) ** 2 + (Pprojy - this.y) ** 2);
        // let distance_vet = Math.sqrt((0 - this.vet_x) ** 2 + (0 - this.vet_y) ** 2)
        return distance < this.radius + this.line_width / 2;
    }
    
    updateDiagonalCollision(wallStart: Dot, wallEnd: Dot){
        // Vetor da parede
        const wallVector = {
          x: wallEnd.x - wallStart.x,
          y: wallEnd.y - wallStart.y,
        };
    
        // Vetor normal à parede
        const normal = {
          x: -wallVector.y,
          y: wallVector.x,
        };
    
        // Normalizando o vetor normal
        const normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2);
        const normalUnit = {
          x: normal.x / normalLength,
          y: normal.y / normalLength,
        };
    
        // Produto escalar entre velocidade e normal
        const dotProduct = this.vet_x * normalUnit.x + this.vet_y * normalUnit.y;
    
        // Calculando nova velocidade
        this.vet_x = this.vet_x - 2 * dotProduct * normalUnit.x;
        this.vet_y = this.vet_y - 2 * dotProduct * normalUnit.y;
      }

      verify_all_walls(dots: Array<Dot>, whole: boolean = false){
        let collisionNormals = [];
        for(let j = 0; j < dots.length; j++){
            if (j === dots.length-1){
                if(this.detect_colision_with_edge(dots[j], dots[0]) && whole === false){
                    // alert("Olha o vet y " + this.vet_y)
                    let normal = this.get_normal_vector(dots[j], dots[0]);
                    collisionNormals.push(normal);
                }
            } else {
                if(this.detect_colision_with_edge(dots[j], dots[j+1])){
                    // alert("Olha o vet y " + this.vet_y)
                    let normal = this.get_normal_vector(dots[j], dots[j+1]);
                    collisionNormals.push(normal);
                }
            }
        }
        if (collisionNormals.length === 1) {
            if (GROWING.checked){
                this.radius += this.growing_value;
            } 
            this.x -= this.vet_x
            this.y -= this.vet_y

            // Colisão com apenas uma borda (reflexão normal)
            this.reflect_velocity(collisionNormals[0]);
        } else if (collisionNormals.length > 1) {
            if (GROWING.checked){
                this.radius += this.growing_value;
            } 
            this.x -= this.vet_x
            this.y -= this.vet_y

            // Colisão com duas bordas ao mesmo tempo
            let avgNormal = {
                x: collisionNormals.reduce((sum, n) => sum + n.x, 0) / collisionNormals.length,
                y: collisionNormals.reduce((sum, n) => sum + n.y, 0) / collisionNormals.length,
            };
    
            let magnitude = Math.sqrt(avgNormal.x ** 2 + avgNormal.y ** 2);
            avgNormal.x /= magnitude;
            avgNormal.y /= magnitude;
    
            this.reflect_velocity(avgNormal);
        }
    }

    // Função para refletir a velocidade da bola
    reflect_velocity(normal: {x: number, y: number}) {
        let dotProduct = this.vet_x * normal.x + this.vet_y * normal.y;
        this.vet_x = this.vet_x - 2 * dotProduct * normal.x;
        this.vet_y = this.vet_y - 2 * dotProduct * normal.y;
    }
}

class Universe {
    balls: Array<Ball>;
    ctx: CanvasRenderingContext2D;
    polygons: Array<Polygon>;
    circles: Array<CircleAsPolygon>;
    back_color: string;

    constructor(ctx_out: CanvasRenderingContext2D, width_limit: number, height_limit: number, background_color: string){
        this.ctx = ctx_out;
        this.balls = [];
        this.polygons = [];
        this.circles = [];
        this.back_color = background_color;
        let system_dot_0 = new Dot(0,0);
        let system_dot_1 = new Dot(0,height_limit);
        let system_dot_2 = new Dot(width_limit,height_limit);
        let system_dot_3 = new Dot(width_limit,0);
        let array_aux = [];
        array_aux.push(system_dot_0)
        array_aux.push(system_dot_1)
        array_aux.push(system_dot_2)
        array_aux.push(system_dot_3)
        let aux = new Polygon("void", array_aux);
        this.polygons.push(aux);
        this.ctx.fillStyle = this.back_color;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    append_ball(new_ball: Ball){
        // new_ball.print_info();
        new_ball.draw_it();
        this.balls.push(new_ball);
    }

    append_polygon(new_polygon: Polygon){
        // new_polygon.print_info();
        new_polygon.draw_it(this.ctx);
        this.polygons.push(new_polygon);
    }

    append_circle(circle: CircleAsPolygon){
        // circle.print_info();
        circle.draw_it(this.ctx);
        this.circles.push(circle);
    }

    animate_world = () => {
        this.ctx.fillStyle = this.back_color;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.balls.length; i++){
            for(let j = 0; j < this.polygons.length; j++){
                this.balls[i].verify_all_walls(this.polygons[j].dots)   
                }

            for(let x = 0; x < this.circles.length; x++){
                
                this.balls[i].verify_all_walls(this.circles[x].dots, this.circles[x].whole)
                this.circles[x].draw_it(this.ctx);
                this.circles[x].rotate();
                let dist_MidBigBall2SmallBall = distance(new Dot(this.circles[x].x_pos, this.circles[x].y_pos), new Dot(this.balls[i].x, this.balls[i].y))
                if(dist_MidBigBall2SmallBall > (this.circles[x].rad - this.balls[i].radius + 2)){
                    this.circles.pop();
                }
                
// Se a distancia do centro da bola maior, até a bolinha for maior do que seu raio + o raio da bolinha, ela esta fora

            }
                this.balls[i].update_position()
            }
        for(let x = 0; x < this.polygons.length; x++){
            this.polygons[x].draw_it(this.ctx);
            }

        requestAnimationFrame(this.animate_world);
        // console.log("x = " + this.balls[0].x + "   y = " + this.balls[0].x)
    }
}

function get_color_from_rgb(color: string){
    let r_string: string = "";
    let g_string: string = "";
    let b_string: string = "";
    let comma_counter = 0;
    for(let i = 0; i < color.length; i++){
        if(color[i] != "(" && color[i] != ")" && color[i] != "r" && color[i] != "g" && color[i] != "b" && color[i] != " "){
            if(color[i] == ","){
                comma_counter++;
            } else if(comma_counter == 0){
                r_string += color[i];
            } else if(comma_counter == 1){
                g_string += color[i];
            } else if(comma_counter == 2){
                b_string += color[i];
            }
        }
    }
    return [Number(r_string), Number(g_string), Number(b_string)]
}

function begin_animation(){
    animation_on = true;
    GROWING = document.getElementById("checkbox_growing");
    uni.animate_world();
}

function create_polygon(){
    let new_p = new Polygon("red", dots_new_polygon)
    uni.append_polygon(new_p)
    dots_new_polygon = []
}

const canvas = document.createElement("canvas")
canvas.id = "canvas-giratorio"
canvas.style.backgroundColor = "white"
canvas.style.border = "1px solid black"
canvas.style.width = "1000px"
canvas.style.height = "1000px"
var ctx = canvas.getContext("2d")
canvas.width = 1000;
canvas.height = 1000;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);

const el = document.querySelector("canvas") as HTMLCanvasElement;

var dots_new_polygon = [];

el.addEventListener("click", (e) => {
  const target = e.target as HTMLCanvasElement;

  const rect = target.getBoundingClientRect();

  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);

  let dot = new Dot(x, y);

  dots_new_polygon.push(dot);
});

var GROWING;
var animation_on = false;
var background_color = "black";

var ball_1 = new Ball(`rgb(255, 255, 255)`, `rgb(248, 50, 255)`, 20, canvas.width/2, canvas.height/2, 3, -2, 2, ctx, 0.4);

let uni = new Universe(ctx, canvas.width, canvas.height, background_color);

let ball_bigger_size = 300
let vel = 0.008;
let whole_s = 7;
let num_of_points_for_circle = 100;
let num_of_ball = 13;
let begin_color = get_color_from_rgb("rgb(255, 0, 234)");
let end_color = get_color_from_rgb("rgb(251, 255, 0)");

for(let i=1; i <= num_of_ball; i++){
    let static_ball = new CircleAsPolygon(canvas.width/2, canvas.height/2, ball_bigger_size-15*i, "void", true, vel*i/80, whole_s, num_of_points_for_circle-i*2, begin_color, end_color)
    uni.append_circle(static_ball);
}

ball_1.draw_it();
// uni.append_polygon(static_ball_2)
uni.append_ball(ball_1);
// uni.append_ball(ball_2);z