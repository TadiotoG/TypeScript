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
    function CircleAsPolygon(pos_x, pos_y, radius, color, whole, vel, whole_size, num_points, start_rgb, end_rgb) {
        if (whole === void 0) { whole = true; }
        if (whole_size === void 0) { whole_size = 5; }
        if (num_points === void 0) { num_points = 100; }
        if (start_rgb === void 0) { start_rgb = [0, 0, 255]; }
        if (end_rgb === void 0) { end_rgb = [0, 255, 0]; }
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
    CircleAsPolygon.prototype.rotate = function () {
        if (this.whole) {
            var fix_problem = 0.01;
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
        }
        else {
            for (var i = 0; i < this.thetas_list.length; i++) {
                this.thetas_list[i] += this.velocity;
                this.dots[i].x = this.x_pos + this.rad * Math.cos(this.thetas_list[i]);
                this.dots[i].y = this.y_pos + this.rad * Math.sin(this.thetas_list[i]);
            }
        }
    };
    CircleAsPolygon.prototype.getDots = function () {
        var points = [];
        var fix_problem = 0.01;
        if (this.whole) {
            var x_0 = this.x_pos + (this.rad - fix_problem) * Math.cos(this.thetas_list[0]);
            var y_0 = this.y_pos + (this.rad - fix_problem) * Math.sin(this.thetas_list[0]);
            var x_1 = this.x_pos + (this.rad + fix_problem) * Math.cos(this.thetas_list[0]);
            var y_1 = this.y_pos + (this.rad + fix_problem) * Math.sin(this.thetas_list[0]);
            points.push(new Dot(x_0, y_0));
            points.push(new Dot(x_1, y_1));
        }
        for (var i = 0; i < this.thetas_list.length; i++) {
            var x = this.x_pos + this.rad * Math.cos(this.thetas_list[i]);
            var y = this.y_pos + this.rad * Math.sin(this.thetas_list[i]);
            points.push(new Dot(x, y));
        }
        if (this.whole) {
            var x_last = this.x_pos + (this.rad - fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length - 1]);
            var y_last = this.y_pos + (this.rad - fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length - 1]);
            var x_last_2 = this.x_pos + (this.rad + fix_problem) * Math.cos(this.thetas_list[this.thetas_list.length - 1]);
            var y_last_2 = this.y_pos + (this.rad + fix_problem) * Math.sin(this.thetas_list[this.thetas_list.length - 1]);
            points.push(new Dot(x_last, y_last));
            points.push(new Dot(x_last_2, y_last_2));
        }
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
        var tx_r, tx_g, tx_b;
        // if(this.whole === true){
        tx_r = (this.end_color[0] - this.start_color[0]) / (this.dots.length - 1);
        tx_g = (this.end_color[1] - this.start_color[1]) / (this.dots.length - 1);
        tx_b = (this.end_color[2] - this.start_color[2]) / (this.dots.length - 1);
        // } else {
        //     tx_r = (this.end_color[0] - this.start_color[0])/this.num_points
        //     tx_g = (this.end_color[1] - this.start_color[1])/this.num_points
        //     tx_b = (this.end_color[2] - this.start_color[2])/this.num_points
        // }
        var actual_r = this.start_color[0];
        var actual_g = this.start_color[1];
        var actual_b = this.start_color[2];
        // console.log("Start color = " + actual_r + ", " + actual_g + ", " + actual_b)
        if (this.dots.length < 2) {
            console.warn("Polygon needs at least two points to be drawn.");
            return;
        }
        context.lineWidth = 3;
        for (var i = 1; i < this.dots.length; i++) {
            context.beginPath();
            context.moveTo(this.dots[i - 1].x, this.dots[i - 1].y);
            context.lineTo(this.dots[i].x, this.dots[i].y);
            context.strokeStyle = "rgb(".concat(Math.floor(actual_r), " ").concat(Math.floor(actual_g), " ").concat(Math.floor(actual_b));
            actual_r += tx_r;
            actual_g += tx_g;
            actual_b += tx_b;
            context.stroke();
        }
        if (!this.whole) { // Close the Circle
            context.beginPath();
            context.moveTo(this.dots[this.dots.length - 1].x, this.dots[this.dots.length - 1].y);
            context.lineTo(this.dots[0].x, this.dots[0].y);
            context.strokeStyle = "rgb(".concat(Math.floor(actual_r), " ").concat(Math.floor(actual_g), " ").concat(Math.floor(actual_b));
            context.stroke();
        }
        //   console.log("End color = " + actual_r + ", " + actual_g + ", " + actual_b)
        // Fechar o polígono ligando o último ponto ao primeiro
        if (this.whole === false) {
            context.closePath();
        }
        // Preencher o polígono com a cor definida
        if (this.color !== "void") {
            context.strokeStyle = this.color;
            context.fill();
        }
        // Opcional: adicionar uma borda
        //   context.strokeStyle = "black";
        //   context.stroke();
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
    function Ball(border_col, fill_col, radius, x, y, line_width, x_vector, y_vector, ctx_out, growing_v, how_many_shadows, play_music, gravity) {
        if (growing_v === void 0) { growing_v = 0.5; }
        if (how_many_shadows === void 0) { how_many_shadows = 20; }
        if (play_music === void 0) { play_music = false; }
        if (gravity === void 0) { gravity = 0.02; }
        this.fill_color = fill_col;
        this.border_color = border_col;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.line_width = line_width;
        this.vet_x = x_vector;
        this.vet_y = y_vector;
        this.gravity = gravity;
        this.ctx = ctx_out;
        this.growing_value = growing_v;
        this.shadow_pos_list = [];
        if (how_many_shadows > radius) {
            how_many_shadows = radius;
        }
        this.shadow_num = how_many_shadows;
        this.music = play_music;
        this.create_shadow_list();
    }
    Ball.prototype.create_shadow_list = function () {
        for (var i = 0; i < this.shadow_num; i++) {
            this.shadow_pos_list.push(new Dot(this.x, this.y));
        }
    };
    Ball.prototype.update_shadow_list = function () {
        for (var i = this.shadow_num - 1; i >= 1; i--) { // Acessando os ultimos primeiro
            this.shadow_pos_list[i].x = this.shadow_pos_list[i - 1].x;
            this.shadow_pos_list[i].y = this.shadow_pos_list[i - 1].y;
        }
        this.shadow_pos_list[0].x = this.x;
        this.shadow_pos_list[0].y = this.y;
    };
    Ball.prototype.draw_it = function () {
        this.draw_shadows();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.line_width;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = this.fill_color;
        this.ctx.fill();
        this.ctx.strokeStyle = this.border_color;
        this.ctx.stroke();
    };
    Ball.prototype.draw_shadows = function () {
        for (var i = this.shadow_pos_list.length - 1; i >= 0; i--) { // Acessando os ultimos primeiro
            this.ctx.beginPath();
            this.ctx.lineWidth = this.line_width;
            this.ctx.arc(this.shadow_pos_list[i].x, this.shadow_pos_list[i].y, this.radius - i, 0, Math.PI * 2, true);
            this.ctx.fillStyle = this.border_color;
            this.ctx.fill();
            this.ctx.strokeStyle = this.border_color;
            this.ctx.stroke();
        }
    };
    Ball.prototype.update_position = function () {
        this.update_shadow_list();
        this.vet_y += this.gravity;
        this.x += this.vet_x;
        this.y += this.vet_y;
        this.draw_it();
    };
    Ball.prototype.playSound = function () {
        var sound = new Audio("Sounds/som.mp3");
        sound.play().catch(function (error) { return console.error("Erro ao tocar som:", error); });
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
            if (sound_on === true) {
                play_music();
            }
            else {
                this.playSound();
            }
            if (growing_on == true) {
                this.radius += this.growing_value;
                this.x += Math.ceil(collisionNormals[0].x * (2 * Math.ceil(this.growing_value)));
                this.y += Math.ceil(collisionNormals[0].y * (2 * Math.ceil(this.growing_value)));
            }
            else {
                this.x += Math.ceil(collisionNormals[0].x);
                this.y += Math.ceil(collisionNormals[0].y);
            }
            // Colisão com apenas uma borda (reflexão normal)
            this.reflect_velocity(collisionNormals[0]);
        }
        else if (collisionNormals.length > 1) {
            if (sound_on === true) {
                play_music();
            }
            else {
                this.playSound();
            }
            // Colisão com duas bordas ao mesmo tempo
            var avgNormal = {
                x: collisionNormals.reduce(function (sum, n) { return sum + n.x; }, 0) / collisionNormals.length,
                y: collisionNormals.reduce(function (sum, n) { return sum + n.y; }, 0) / collisionNormals.length,
            };
            var magnitude = Math.sqrt(Math.pow(avgNormal.x, 2) + Math.pow(avgNormal.y, 2));
            avgNormal.x /= magnitude;
            avgNormal.y /= magnitude;
            if (growing_on == true) {
                this.radius += this.growing_value;
                this.x += Math.ceil(avgNormal.x * (2 * Math.ceil(this.growing_value)));
                this.y += Math.ceil(avgNormal.y * (2 * Math.ceil(this.growing_value)));
            }
            else {
                this.x += Math.ceil(avgNormal.x);
                this.y += Math.ceil(avgNormal.y);
            }
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
var Particle = /** @class */ (function () {
    function Particle(x, y, origin_x, origin_y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() * (x - origin_x)) / 10;
        this.vy = (Math.random() * (y - origin_y)) / 10;
        this.alpha = 1;
    }
    Particle.prototype.update = function () {
        this.x += Math.ceil(Math.random() * this.vx);
        this.y += Math.ceil(Math.random() * this.vy);
        this.alpha -= 0.02;
    };
    Particle.prototype.draw = function (context) {
        context.globalAlpha = this.alpha;
        context.fillStyle = "white";
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
    };
    return Particle;
}());
var particles = [];
function explodePolygon(x, y, or_x, or_y) {
    for (var i = 0; i < 1; i++) { // partículas por explosão
        particles.push(new Particle(x, y, or_x, or_y));
    }
}
var Universe = /** @class */ (function () {
    function Universe(ctx_out, width_limit, height_limit, background_color, pop_sound) {
        if (pop_sound === void 0) { pop_sound = "void"; }
        var _this = this;
        this.animate_world = function () {
            _this.ctx.fillStyle = _this.back_color;
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
                    if (dist_MidBigBall2SmallBall > (_this.circles[x].rad - _this.balls[i].radius * 0.9)) {
                        if (_this.pop_sound != "void") {
                            _this.playPopSound();
                        }
                        var orig_x = _this.circles[x].x_pos;
                        var orig_y = _this.circles[x].y_pos;
                        for (var edge = 0; edge < _this.circles[x].dots.length; edge++) {
                            explodePolygon(_this.circles[x].dots[edge].x, _this.circles[x].dots[edge].y, orig_x, orig_y);
                        }
                        _this.circles.pop();
                    }
                }
                _this.balls[i].update_position();
            }
            for (var x = 0; x < _this.polygons.length; x++) {
                _this.polygons[x].draw_it(_this.ctx);
            }
            particles.forEach(function (particle, index) {
                particle.update();
                particle.draw(_this.ctx);
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                }
            });
            if (animation_on == true) {
                requestAnimationFrame(_this.animate_world);
            }
            else {
                create_world();
            }
        };
        this.ctx = ctx_out;
        this.balls = [];
        this.polygons = [];
        this.circles = [];
        this.back_color = background_color;
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
        this.ctx.fillStyle = this.back_color;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.pop_sound = pop_sound;
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
    Universe.prototype.playPopSound = function () {
        var sound = new Audio("Sounds/" + this.pop_sound);
        sound.play().catch(function (error) { return console.error("Erro ao tocar som:", error); });
    };
    return Universe;
}());
function get_color_from_rgb(color) {
    var r_string = "";
    var g_string = "";
    var b_string = "";
    var comma_counter = 0;
    for (var i = 0; i < color.length; i++) {
        if (color[i] != "(" && color[i] != ")" && color[i] != "r" && color[i] != "g" && color[i] != "b" && color[i] != " ") {
            if (color[i] == ",") {
                comma_counter++;
            }
            else if (comma_counter == 0) {
                r_string += color[i];
            }
            else if (comma_counter == 1) {
                g_string += color[i];
            }
            else if (comma_counter == 2) {
                b_string += color[i];
            }
        }
    }
    return [Number(r_string), Number(g_string), Number(b_string)];
}
function get_color_from_hexa(color) {
    var r_string = "";
    var g_string = "";
    var b_string = "";
    r_string += color[1] + color[2];
    g_string += color[3] + color[4];
    b_string += color[5] + color[6];
    return [parseInt(r_string, 16), parseInt(g_string, 16), parseInt(b_string, 16)];
}
function get_hexa_from_list(list) {
    var string = "#";
    for (var i = 0; i < 3; i++) {
        var aux = list[i].toString(16);
        if (aux.length < 2) { // If the number in hexa be smaller than 16, it will be just one digit, what doesn't fits on the "value" on HTML
            aux += "0";
        }
        string += aux;
    }
    console.log("O que temos aqui " + string);
    return string;
}
function begin_animation() {
    animation_on = true;
    uni.animate_world();
}
function reset_world() {
    animation_on = false;
    get_all_configs();
}
var temporizador;
var audio = new Audio("Sounds/Harry_Styles_AsItWas.mp3");
function play_music(duracaoEmSegundos) {
    if (duracaoEmSegundos === void 0) { duracaoEmSegundos = 1; }
    if (audio.paused) {
        audio.currentTime = 0;
        audio.play();
    }
    if (temporizador) {
        clearTimeout(temporizador);
    }
    temporizador = setTimeout(function () {
        audio.pause();
    }, duracaoEmSegundos * 1000);
}
function create_world() {
    uni = new Universe(ctx, canvas.width, canvas.height, background_color);
    ball_1 = new Ball(color_of_shadow, ball_color, ball_size, canvas.width / 2, canvas.height / 2, 3, x_vet, y_vet, ctx, growing_value, 10, sound_on, gravity);
    for (var i = 1; i <= amount_of_circles; i++) {
        var static_ball = new CircleAsPolygon(canvas.width / 2, canvas.height / 2, ball_bigger_size - space_between_circles * i, "void", whole_flag, vel * i / 200, whole_s, num_of_points_for_circle - i * 2, begin_color, end_color);
        uni.append_circle(static_ball);
    }
    ball_1.draw_it();
    uni.append_ball(ball_1);
}
function get_all_configs() {
    var inputElement = document.getElementById("type_amount_of_circles");
    amount_of_circles = parseFloat(inputElement.value);
    inputElement = document.getElementById("type_ball_size");
    ball_size = parseFloat(inputElement.value);
    inputElement = document.getElementById("type_gravity");
    gravity = parseFloat(inputElement.value);
    inputElement = document.getElementById("type_growing_value");
    growing_value = parseFloat(inputElement.value);
    inputElement = document.getElementById("type_circle_size");
    ball_bigger_size = parseFloat(inputElement.value);
    inputElement = document.getElementById("type_circle_speed");
    vel = parseFloat(inputElement.value);
    inputElement = document.getElementById("type_size_of_wholes");
    whole_s = parseFloat(inputElement.value);
    inputElement = document.getElementById("space_between_circles");
    space_between_circles = parseFloat(inputElement.value);
    inputElement = document.getElementById("ball_color");
    ball_color = inputElement.value;
    inputElement = document.getElementById("start_color");
    begin_color = get_color_from_hexa(inputElement.value);
    inputElement = document.getElementById("end_color");
    end_color = get_color_from_hexa(inputElement.value);
    inputElement = document.getElementById("color_of_shadow");
    color_of_shadow = inputElement.value;
    var aux;
    aux = document.getElementById("checkbox_buraco");
    if (aux.checked) {
        whole_flag = true;
    }
    else {
        whole_flag = false;
    }
    ;
    aux = document.getElementById("checkbox_music");
    if (aux.checked) {
        sound_on = true;
    }
    else {
        sound_on = false;
    }
    ;
    aux = document.getElementById("checkbox_growing");
    if (aux.checked) {
        growing_on = true;
    }
    else {
        growing_on = false;
    }
    ;
    create_world();
}
function save_config_as_file() {
    var content = String(amount_of_circles) + "\n" + String(ball_size) + "\n" + String(gravity) + "\n" + String(growing_value) + "\n" + String(ball_bigger_size) + "\n" + String(vel) + "\n" + String(whole_s) + "\n" + String(space_between_circles) + "\n" + String(ball_color) + "\n" + String(begin_color) + "\n" + String(end_color) + "\n" + String(color_of_shadow) + "\n" + String(whole_flag) + "\n" + String(sound_on) + "\n" + String(growing_on);
    var blob = new Blob([content], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Save_' + Math.ceil(100 * Math.random()) + '.txt';
    link.click();
    URL.revokeObjectURL(link.href); // Liberar memória
}
function load_config() {
    var input_file;
    input_file = document.createElement('input');
    input_file.type = 'file';
    input_file.addEventListener('change', load_config_2);
    input_file.click();
}
function load_config_2(event) {
    var _a;
    var input = event.target;
    if (!((_a = input.files) === null || _a === void 0 ? void 0 : _a.length))
        return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var content = reader.result;
        var lines = content.split("\n").map(function (line) { return line.trim(); }); // Separar por linhas e remover espaços extras
        if (lines.length < 15) {
            console.error("Arquivo inválido!");
            return;
        }
        amount_of_circles = parseInt(lines[0]);
        console.log("Amount of circles: " + amount_of_circles);
        ball_size = parseFloat(lines[1]);
        gravity = parseFloat(lines[2]);
        growing_value = parseFloat(lines[3]);
        ball_bigger_size = parseFloat(lines[4]);
        vel = parseFloat(lines[5]);
        whole_s = parseFloat(lines[6]);
        space_between_circles = parseFloat(lines[7]);
        ball_color = lines[8];
        begin_color = get_color_from_rgb(lines[9]);
        end_color = get_color_from_rgb(lines[10]);
        color_of_shadow = lines[11];
        whole_flag = lines[12] === "true"; // Converter para booleano
        sound_on = lines[13] === "true";
        growing_on = lines[14] === "true";
        create_world();
        console.log("Configuração carregada:", {
            amount_of_circles: amount_of_circles,
            ball_size: ball_size,
            gravity: gravity,
            growing_value: growing_value,
            ball_bigger_size: ball_bigger_size,
            vel: vel,
            whole_s: whole_s,
            ball_color: ball_color,
            begin_color: begin_color,
            end_color: end_color,
            color_of_shadow: color_of_shadow,
            whole_flag: whole_flag,
            sound_on: sound_on,
            growing_on: growing_on
        });
        updateUIWithLoadedConfig();
    };
    reader.readAsText(file);
}
function updateUIWithLoadedConfig() {
    // Atualiza os inputs numéricos/textuais
    var inputElement = document.getElementById("type_amount_of_circles");
    inputElement.value = String(amount_of_circles);
    inputElement = document.getElementById("type_ball_size");
    inputElement.value = String(ball_size);
    inputElement = document.getElementById("type_gravity");
    inputElement.value = String(gravity);
    inputElement = document.getElementById("type_growing_value");
    inputElement.value = String(growing_value);
    inputElement = document.getElementById("type_circle_size");
    inputElement.value = String(ball_bigger_size);
    inputElement = document.getElementById("type_circle_speed");
    inputElement.value = String(vel);
    inputElement = document.getElementById("type_size_of_wholes");
    inputElement.value = String(whole_s);
    inputElement = document.getElementById("space_between_circles");
    inputElement.value = String(space_between_circles);
    // Atualiza os inputs de cores
    inputElement = document.getElementById("ball_color");
    inputElement.value = ball_color;
    inputElement = document.getElementById("start_color");
    // Se begin_color não for uma string em formato hexadecimal, faça a conversão necessária
    inputElement.value = String(get_hexa_from_list(begin_color));
    inputElement = document.getElementById("end_color");
    inputElement.value = String(get_hexa_from_list(end_color));
    inputElement = document.getElementById("color_of_shadow");
    inputElement.value = color_of_shadow;
    // Atualiza os checkboxes
    var checkbox = document.getElementById("checkbox_buraco");
    checkbox.checked = whole_flag;
    checkbox = document.getElementById("checkbox_music");
    checkbox.checked = sound_on;
    checkbox = document.getElementById("checkbox_growing");
    checkbox.checked = growing_on;
    // Atualiza o mundo (ou outra função que dependa dessas configurações)
    create_world();
}
var canvas = document.createElement("canvas");
canvas.id = "canvas-giratorio";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.width = "700px";
canvas.style.height = "1000px";
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 1000;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var container = document.getElementById("container");
if (container) {
    container.appendChild(canvas);
}
else {
    console.error("Div container não encontrada!");
}
var growing_on = false;
var animation_on = false;
var background_color = "black";
var sound_on = false;
var x_vet = 0;
var y_vet = -3;
var growing_value = 1.3;
var ball_size = 10;
var gravity = 0.02;
var ball_color = "rgb(255, 0, 255)";
var ball_bigger_size = 280;
var vel = 0.24;
var whole_flag = true;
var whole_s = 14;
var num_of_points_for_circle = 120;
var amount_of_circles = 1;
var begin_color = get_color_from_rgb("rgb(255, 0, 255)");
var end_color = get_color_from_rgb("rgb(255, 0, 255)");
var color_of_shadow = "rgb(255, 255, 255)";
var space_between_circles = 15;
var uni = new Universe(ctx, canvas.width, canvas.height, background_color);
var ball_1 = new Ball(color_of_shadow, ball_color, ball_size, canvas.width / 2, canvas.height / 2, 3, x_vet, y_vet, ctx, growing_value, 10, sound_on, gravity);
get_all_configs();
