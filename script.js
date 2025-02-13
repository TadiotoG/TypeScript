var Dot = /** @class */ (function () {
    function Dot(new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
    }
    return Dot;
}());
function distance(A, B) {
    return Math.sqrt(Math.pow((A.x - B.x), 2) + Math.pow((A.y - B.y), 2));
}
var Polygon = /** @class */ (function () {
    function Polygon(new_color, dots_array, closed) {
        if (closed === void 0) { closed = true; }
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
        this.closed = closed;
    }
    Polygon.prototype.draw_it = function (context) {
        if (this.dots.length < 2) {
            console.warn("Polygon needs at least two points to be drawn.");
            return;
        }
        context.beginPath();
        // Mover para o primeiro ponto
        context.moveTo(this.dots[0].x, this.dots[0].y);
        // Criar linhas para os outros pontos
        for (var i = 1; i < this.dots.length; i++) {
            context.lineTo(this.dots[i].x, this.dots[i].y);
        }
        // Fechar o polígono ligando o último ponto ao primeiro
        if (this.closed === true) {
            context.closePath();
        }
        // Preencher o polígono com a cor definida
        if (this.color !== "void") {
            context.fillStyle = this.color;
            context.fill();
        }
        // Opcional: adicionar uma borda
        context.strokeStyle = "black";
        context.stroke();
    };
    return Polygon;
}());
var CircleAsPolygon = /** @class */ (function () {
    function CircleAsPolygon(pos_x, pos_y, radius, color, whole, vel, whole_size, num_points) {
        if (whole === void 0) { whole = true; }
        if (whole_size === void 0) { whole_size = 5; }
        if (num_points === void 0) { num_points = 100; }
        this.whole = whole;
        this.x_pos = pos_x;
        this.y_pos = pos_y;
        this.rad = radius;
        this.velocity = vel;
        this.color = color;
        this.num_points = num_points;
        this.whole_size = whole_size;
        this.thetas_list = [];
        this.getTheta();
        this.getDots();
    }
    CircleAsPolygon.prototype.rotate = function () {
        var fix_problem = 0.3;
        this.dots[this.dots.length - 2].x = this.x_pos + (this.rad - fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length - 1] + this.velocity);
        this.dots[this.dots.length - 2].y = this.y_pos + (this.rad - fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length - 1] + this.velocity);
        this.dots[this.dots.length - 1].x = this.x_pos + (this.rad + fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length - 1] + this.velocity);
        this.dots[this.dots.length - 1].y = this.y_pos + (this.rad + fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length - 1] + this.velocity);
        this.dots[0].x = this.x_pos + (this.rad - fix_problem) * Math.cos(this.thetas_list[0] + this.velocity);
        this.dots[0].y = this.y_pos + (this.rad - fix_problem) * Math.sin(this.thetas_list[0] + this.velocity);
        this.dots[1].x = this.x_pos + (this.rad + fix_problem) * Math.cos(this.thetas_list[0] + this.velocity);
        this.dots[1].y = this.y_pos + (this.rad + fix_problem) * Math.sin(this.thetas_list[0] + this.velocity);
        for (var i = 0; i < this.thetas_list.length; i++) {
            this.thetas_list[i] += this.velocity;
            this.dots[i + 2].x = this.x_pos + this.rad * Math.cos(this.thetas_list[i]);
            this.dots[i + 2].y = this.y_pos + this.rad * Math.sin(this.thetas_list[i]);
        }
    };
    CircleAsPolygon.prototype.getDots = function () {
        var points = [];
        var fix_problem = 0.3;
        var x_0 = this.x_pos + (this.rad - fix_problem) * Math.cos(this.thetas_list[0]);
        var y_0 = this.y_pos + (this.rad - fix_problem) * Math.sin(this.thetas_list[0]);
        var x_1 = this.x_pos + (this.rad + fix_problem) * Math.cos(this.thetas_list[0]);
        var y_1 = this.y_pos + (this.rad + fix_problem) * Math.sin(this.thetas_list[0]);
        points.push(new Dot(x_0, y_0));
        points.push(new Dot(x_1, y_1));
        for (var i = 0; i < this.thetas_list.length; i++) {
            // let theta = (i / this.thetas_list.length) * 2 * Math.PI;
            var x = this.x_pos + this.rad * Math.cos(this.thetas_list[i]);
            var y = this.y_pos + this.rad * Math.sin(this.thetas_list[i]);
            points.push(new Dot(x, y));
        }
        var x_last = this.x_pos + (this.rad - fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length - 1]);
        var y_last = this.y_pos + (this.rad - fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length - 1]);
        var x_last_2 = this.x_pos + (this.rad + fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length - 1]);
        var y_last_2 = this.y_pos + (this.rad + fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length - 1]);
        points.push(new Dot(x_last, y_last));
        points.push(new Dot(x_last_2, y_last_2));
        this.dots = points;
    };
    CircleAsPolygon.prototype.getTheta = function () {
        if (this.whole === true) {
            for (var i = 0; i < this.num_points - this.whole_size; i++) {
                this.thetas_list.push((i / this.num_points) * 2 * Math.PI);
            }
        }
        else {
            for (var i = 0; i < this.num_points; i++) {
                this.thetas_list.push((i / this.num_points) * 2 * Math.PI);
            }
        }
    };
    CircleAsPolygon.prototype.draw_it = function (context) {
        if (this.dots.length < 2) {
            console.warn("Polygon needs at least two points to be drawn.");
            return;
        }
        context.beginPath();
        context.lineWidth = 3;
        // Mover para o primeiro ponto
        context.moveTo(this.dots[0].x, this.dots[0].y);
        // Criar linhas para os outros pontos
        for (var i = 1; i < this.dots.length; i++) {
            context.lineTo(this.dots[i].x, this.dots[i].y);
        }
        // Fechar o polígono ligando o último ponto ao primeiro
        if (this.whole === false) {
            context.closePath();
        }
        // Preencher o polígono com a cor definida
        if (this.color !== "void") {
            context.fillStyle = this.color;
            context.fill();
        }
        // Opcional: adicionar uma borda
        context.strokeStyle = "black";
        context.stroke();
    };
    return CircleAsPolygon;
}());
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
var Ball = /** @class */ (function () {
    function Ball(radius, x, y, line_width, x_vector, y_vector, ctx_out, growing_v) {
        if (growing_v === void 0) { growing_v = 0.5; }
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.line_width = line_width;
        this.vet_x = x_vector;
        this.vet_y = y_vector;
        this.gravity = 0.02;
        this.ctx = ctx_out;
        this.growing_value = growing_v;
    }
    Ball.prototype.draw_it = function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.line_width;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
    };
    Ball.prototype.update_position = function () {
        this.vet_y += this.gravity;
        this.x += this.vet_x;
        this.y += this.vet_y;
        this.draw_it();
    };
    Ball.prototype.print_info = function () {
        console.log("Radius: " + this.radius);
        console.log("X: " + this.x);
        console.log("Y: " + this.y);
        console.log("Line width: " + this.line_width);
    };
    Ball.prototype.detect_colision_edges = function (polygon) {
        var aux = false;
        var angle = -1;
        for (var j = 0; j < polygon.dots.length; j++) {
            if (j === polygon.dots.length - 1) {
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[0]);
            }
            else {
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[j + 1]);
            }
            if (aux == true) {
                if (j === polygon.dots.length - 1) {
                    angle = this.calculate_angle(polygon.dots[j], polygon.dots[0]);
                }
                else {
                    angle = this.calculate_angle(polygon.dots[j], polygon.dots[j + 1]);
                }
                return angle;
            }
        }
        return angle;
    };
    Ball.prototype.get_normal_vector = function (A, B) {
        var AB_x = B.x - A.x;
        var AB_y = B.y - A.y;
        // Vetor normal (perpendicular)
        var normal_x = -AB_y;
        var normal_y = AB_x;
        // Normalizar o vetor
        var magnitude = Math.sqrt(Math.pow(normal_x, 2) + Math.pow(normal_y, 2));
        return { x: normal_x / magnitude, y: normal_y / magnitude };
    };
    Ball.prototype.calculate_angle = function (A, B) {
        var AB_x = B.x - A.x;
        var AB_y = B.y - A.y;
        // Produto escalar
        var prod_escalar = this.vet_x * AB_x + (-this.vet_y) * AB_y;
        // Normas dos vetores
        var norma_AB = Math.sqrt(Math.pow(AB_x, 2) + Math.pow(AB_y, 2));
        var norma_vet_class = Math.sqrt(Math.pow(this.vet_x, 2) + Math.pow((-this.vet_y), 2));
        // Ângulo (cos)
        var result = prod_escalar / (norma_AB * norma_vet_class);
        // Produto vetorial para determinar o sinal
        var prod_vetorial = this.vet_x * AB_y - (-this.vet_y) * AB_x;
        var angle = Math.acos(result) * 180 / Math.PI;
        // Ajustar para ângulos no intervalo [0, 360)
        return prod_vetorial >= 0 ? angle : 360 - angle;
    };
    Ball.prototype.detect_colision_with_edge = function (A, B) {
        var VectorABx = B.x - A.x;
        var VectorABy = B.y - A.y;
        var VectorACx = this.x - A.x;
        var VectorACy = this.y - A.y;
        var tx = ((VectorABx * VectorACx) + (VectorABy * VectorACy)) / ((Math.pow(VectorABx, 2)) + (Math.pow(VectorABy, 2)));
        tx = Math.max(0, Math.min(1, tx)); // Garantir que tx esteja no intervalo [0, 1]
        var Pprojx = A.x + tx * VectorABx;
        var Pprojy = A.y + tx * VectorABy;
        var distance = Math.sqrt(Math.pow((Pprojx - this.x), 2) + Math.pow((Pprojy - this.y), 2));
        // let distance_vet = Math.sqrt((0 - this.vet_x) ** 2 + (0 - this.vet_y) ** 2)
        return distance < this.radius + this.line_width / 2;
    };
    Ball.prototype.updateDiagonalCollision = function (wallStart, wallEnd) {
        // Vetor da parede
        var wallVector = {
            x: wallEnd.x - wallStart.x,
            y: wallEnd.y - wallStart.y,
        };
        // Vetor normal à parede
        var normal = {
            x: -wallVector.y,
            y: wallVector.x,
        };
        // Normalizando o vetor normal
        var normalLength = Math.sqrt(Math.pow(normal.x, 2) + Math.pow(normal.y, 2));
        var normalUnit = {
            x: normal.x / normalLength,
            y: normal.y / normalLength,
        };
        // Produto escalar entre velocidade e normal
        var dotProduct = this.vet_x * normalUnit.x + this.vet_y * normalUnit.y;
        // Calculando nova velocidade
        this.vet_x = this.vet_x - 2 * dotProduct * normalUnit.x;
        this.vet_y = this.vet_y - 2 * dotProduct * normalUnit.y;
    };
    Ball.prototype.verify_all_walls = function (dots, whole) {
        if (whole === void 0) { whole = false; }
        var collisionNormals = [];
        for (var j = 0; j < dots.length; j++) {
            if (j === dots.length - 1) {
                if (this.detect_colision_with_edge(dots[j], dots[0]) && whole === false) {
                    // alert("Olha o vet y " + this.vet_y)
                    var normal = this.get_normal_vector(dots[j], dots[0]);
                    collisionNormals.push(normal);
                }
            }
            else {
                if (this.detect_colision_with_edge(dots[j], dots[j + 1])) {
                    // alert("Olha o vet y " + this.vet_y)
                    var normal = this.get_normal_vector(dots[j], dots[j + 1]);
                    collisionNormals.push(normal);
                }
            }
        }
        if (collisionNormals.length === 1) {
            if (GROWING.checked) {
                this.radius += this.growing_value;
            }
            this.x -= this.vet_x;
            this.y -= this.vet_y;
            // Colisão com apenas uma borda (reflexão normal)
            this.reflect_velocity(collisionNormals[0]);
        }
        else if (collisionNormals.length > 1) {
            if (GROWING.checked) {
                this.radius += this.growing_value;
            }
            this.x -= this.vet_x;
            this.y -= this.vet_y;
            // Colisão com duas bordas ao mesmo tempo
            var avgNormal = {
                x: collisionNormals.reduce(function (sum, n) { return sum + n.x; }, 0) / collisionNormals.length,
                y: collisionNormals.reduce(function (sum, n) { return sum + n.y; }, 0) / collisionNormals.length,
            };
            var magnitude = Math.sqrt(Math.pow(avgNormal.x, 2) + Math.pow(avgNormal.y, 2));
            avgNormal.x /= magnitude;
            avgNormal.y /= magnitude;
            this.reflect_velocity(avgNormal);
        }
    };
    // Função para refletir a velocidade da bola
    Ball.prototype.reflect_velocity = function (normal) {
        var dotProduct = this.vet_x * normal.x + this.vet_y * normal.y;
        this.vet_x = this.vet_x - 2 * dotProduct * normal.x;
        this.vet_y = this.vet_y - 2 * dotProduct * normal.y;
    };
    return Ball;
}());
var Universe = /** @class */ (function () {
    function Universe(ctx_out, width_limit, height_limit) {
        var _this = this;
        this.animate_world = function () {
            _this.ctx.fillStyle = "white";
            _this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < _this.balls.length; i++) {
                for (var j = 0; j < _this.polygons.length; j++) {
                    _this.balls[i].verify_all_walls(_this.polygons[j].dots);
                }
                for (var x = 0; x < _this.circles.length; x++) {
                    _this.balls[i].verify_all_walls(_this.circles[x].dots, _this.circles[x].whole);
                    _this.circles[x].draw_it(_this.ctx);
                    _this.circles[x].rotate();
                    var dist_MidBigBall2SmallBall = distance(new Dot(_this.circles[x].x_pos, _this.circles[x].y_pos), new Dot(_this.balls[i].x, _this.balls[i].y));
                    if (dist_MidBigBall2SmallBall > (_this.circles[x].rad - _this.balls[i].radius + 2)) {
                        _this.circles.pop();
                    }
                    // Se a distancia do centro da bola maior, até a bolinha for maior do que seu raio + o raio da bolinha, ela esta fora
                }
                _this.balls[i].update_position();
            }
            for (var x = 0; x < _this.polygons.length; x++) {
                _this.polygons[x].draw_it(_this.ctx);
            }
            requestAnimationFrame(_this.animate_world);
            // console.log("x = " + this.balls[0].x + "   y = " + this.balls[0].x)
        };
        this.ctx = ctx_out;
        this.balls = [];
        this.polygons = [];
        this.circles = [];
        var system_dot_0 = new Dot(0, 0);
        var system_dot_1 = new Dot(0, height_limit);
        var system_dot_2 = new Dot(width_limit, height_limit);
        var system_dot_3 = new Dot(width_limit, 0);
        var array_aux = [];
        array_aux.push(system_dot_0);
        array_aux.push(system_dot_1);
        array_aux.push(system_dot_2);
        array_aux.push(system_dot_3);
        var aux = new Polygon("void", array_aux);
        this.polygons.push(aux);
    }
    Universe.prototype.append_ball = function (new_ball) {
        // new_ball.print_info();
        new_ball.draw_it();
        this.balls.push(new_ball);
    };
    Universe.prototype.append_polygon = function (new_polygon) {
        // new_polygon.print_info();
        new_polygon.draw_it(this.ctx);
        this.polygons.push(new_polygon);
    };
    Universe.prototype.append_circle = function (circle) {
        // circle.print_info();
        circle.draw_it(this.ctx);
        this.circles.push(circle);
    };
    return Universe;
}());
function begin_animation() {
    animation_on = true;
    GROWING = document.getElementById("checkbox_growing");
    uni.animate_world();
}
function create_polygon() {
    var new_p = new Polygon("red", dots_new_polygon);
    uni.append_polygon(new_p);
    dots_new_polygon = [];
}
var canvas = document.createElement("canvas");
canvas.id = "canvas-giratorio";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.width = "1000px";
canvas.style.height = "1000px";
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var el = document.querySelector("canvas");
var dots_new_polygon = [];
el.addEventListener("click", function (e) {
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = Math.floor(e.clientX - rect.left);
    var y = Math.floor(e.clientY - rect.top);
    var dot = new Dot(x, y);
    dots_new_polygon.push(dot);
});
var GROWING;
var animation_on = false;
var ball_1 = new Ball(20, canvas.width / 2, canvas.height / 2, 3, -2, 2, ctx, 0.4);
var uni = new Universe(ctx, canvas.width, canvas.height);
var ball_bigger_size = 300;
var vel = 0.008;
var whole_s = 7;
var num_of_points_for_circle = 100;
var num_of_ball = 13;
for (var i = 1; i <= num_of_ball; i++) {
    var static_ball = new CircleAsPolygon(canvas.width / 2, canvas.height / 2, ball_bigger_size - 15 * i, "void", true, vel * i / 100, whole_s, num_of_points_for_circle - i * 2);
    uni.append_circle(static_ball);
}
ball_1.draw_it();
// uni.append_polygon(static_ball_2)
uni.append_ball(ball_1);
// uni.append_ball(ball_2);z
