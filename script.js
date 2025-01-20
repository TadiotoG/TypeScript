var Dot = /** @class */ (function () {
    function Dot(new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
    }
    return Dot;
}());
var Polygon = /** @class */ (function () {
    function Polygon(new_color, dots_array) {
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
    }
    return Polygon;
}());
var Ball = /** @class */ (function () {
    function Ball(radius, x, y, line_width, x_vector, y_vector, ctx_out) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.line_width = line_width;
        this.vet_x = x_vector;
        this.vet_y = y_vector;
        this.ctx = ctx_out;
    }
    Ball.prototype.draw_it = function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.line_width;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
    };
    Ball.prototype.update_position = function () {
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
    Ball.prototype.detect_colision_betwen_objects = function (polygon) {
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
    Ball.prototype.verify_all_walls = function (p) {
        for (var j = 0; j < p.dots.length; j++) {
            if (j === p.dots.length - 1) {
                if (this.detect_colision_with_edge(p.dots[j], p.dots[0])) {
                    this.updateDiagonalCollision(p.dots[j], p.dots[0]);
                }
            }
            else {
                if (this.detect_colision_with_edge(p.dots[j], p.dots[j + 1])) {
                    this.updateDiagonalCollision(p.dots[j], p.dots[j + 1]);
                }
            }
        }
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
                    _this.balls[i].verify_all_walls(_this.polygons[j]);
                }
                _this.balls[i].update_position();
            }
            requestAnimationFrame(_this.animate_world);
            // console.log("x = " + this.balls[0].x + "   y = " + this.balls[0].x)
        };
        this.ctx = ctx_out;
        this.balls = [];
        this.polygons = [];
        var system_dot_0 = new Dot(0, 0);
        var system_dot_1 = new Dot(0, height_limit);
        var system_dot_2 = new Dot(width_limit, height_limit);
        var system_dot_3 = new Dot(width_limit, 0);
        var array_aux = [];
        array_aux.push(system_dot_0);
        array_aux.push(system_dot_1);
        array_aux.push(system_dot_2);
        array_aux.push(system_dot_3);
        var aux = new Polygon("black", array_aux);
        this.polygons.push(aux);
    }
    Universe.prototype.append_ball = function (new_ball) {
        // new_ball.print_info();
        new_ball.draw_it();
        this.balls.push(new_ball);
    };
    return Universe;
}());
var canvas = document.createElement("canvas");
canvas.id = "canvas-giratorio";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.width = "1000px";
canvas.style.height = "800px";
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var ball_1 = new Ball(20, 400, 200, 3, 2, 3, ctx);
// var ball_2 = new Ball(50, 200, 200, 3, 1, 1, ctx);
var uni = new Universe(ctx, canvas.width, canvas.height);
ball_1.draw_it();
uni.append_ball(ball_1);
// uni.append_ball(ball_2);
uni.animate_world();
