var Window = /** @class */ (function () {
    function Window(title, width, height) {
        // 20px for the size of each cell
        this.CELL_SIZE = 20;
        this.title = title;
        this.width = width;
        this.height = height;
        this.createCanvas();
    }
    Window.prototype.createCanvas = function () {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 500;
        this.canvas.height = 500;
        document.body.appendChild(this.canvas);
    };
    Window.prototype.drawWorld = function () {
        this.ctx.beginPath();
        // first draw rows
        for (var x = 0; x < this.width + 1; x++) {
            this.ctx.moveTo(this.CELL_SIZE * x, 0);
            // this will draw the line
            this.ctx.lineTo(this.CELL_SIZE * x, this.width * this.CELL_SIZE);
        }
        for (var y = 0; y < this.width + 1; y++) {
            this.ctx.moveTo(0, this.CELL_SIZE * y);
            this.ctx.lineTo(this.width * this.CELL_SIZE, this.CELL_SIZE * y);
        }
        this.ctx.stroke();
    };
    return Window;
}());
export { Window };
var w = new Window("canvas", 12, 12);
w.drawWorld();
//# sourceMappingURL=blablabla.js.map