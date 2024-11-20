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
    Ball.prototype.update_position = function (x, y) {
        this.x = x;
        this.y = y;
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
        for (var j = 0; j < polygon.dots.length; j++) {
            if (j === polygon.dots.length - 1) {
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[0]);
            }
            else {
                aux = this.detect_colision_with_edge(polygon.dots[j], polygon.dots[j + 1]);
            }
            if (aux == true) {
                return true;
            }
        }
        return false;
    };
    Ball.prototype.detect_colision_with_edge = function (A, B) {
        var VectorABx = B.x - A.x;
        var VectorABy = B.y - A.y;
        var VectorACx = this.x - A.x;
        var VectorACy = this.y - A.y;
        var tx = ((VectorABx * VectorACx) + (VectorABy * VectorACy)) / ((VectorABx * VectorABx) + (VectorABy * VectorABy));
        if (tx > 1) {
            tx = 1;
        }
        else if (tx < 0) {
            tx = 0;
        }
        var Pprojx = (A.x + tx * VectorABx);
        var Pprojy = (A.y + tx * VectorABy);
        var distance = Math.sqrt(Math.pow((Pprojx - this.x), 2) + Math.pow((Pprojy - this.y), 2));
        if (distance < this.radius) {
            return true;
        }
        else {
            return false;
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
                var colision_flag = false;
                for (var j = 0; j < _this.polygons.length; j++) {
                    colision_flag = _this.balls[i].detect_colision_betwen_objects(_this.polygons[j]);
                    if (colision_flag) {
                        _this.balls[i].vet_x = -_this.balls[i].vet_x;
                    }
                }
                // if(this.balls[i].detect_colision_with_edges)
                var old_x = _this.balls[i].x;
                var old_y = _this.balls[i].y;
                _this.balls[i].update_position(old_x + _this.balls[i].vet_x, old_y + _this.balls[i].vet_y);
            }
            requestAnimationFrame(_this.animate_world);
        };
        this.ctx = ctx_out;
        this.balls = [];
        this.polygons = [];
        var system_dot_0 = new Dot(0, 0);
        var system_dot_1 = new Dot(width_limit, 0);
        var system_dot_2 = new Dot(width_limit, height_limit);
        var system_dot_3 = new Dot(0, height_limit);
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
var ball_1 = new Ball(100, 200, 200, 3, 1, 0, ctx);
var ball_2 = new Ball(50, 200, 200, 3, 1, 0, ctx);
var uni = new Universe(ctx, canvas.width, canvas.height);
ball_1.draw_it();
uni.append_ball(ball_1);
uni.append_ball(ball_2);
uni.animate_world();
