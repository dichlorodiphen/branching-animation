class Line {
    constructor(startX, startY, endX, endY, decay = 1) {
        for (const x of [startX, startY, endX, endY]) {
            if (isNaN(x)) {
                throw new Error("invalid value in constructor");
            }
        }

        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.progress = 0;
        this.delta = 0.01;

        // Decay factor for branching.
        this.decay = decay;

        // Is the line being erased?
        this.erasing = false;

        // Has the line branched already?
        this.branched = false;
    }

    // Begin erasing line from end.
    erase() {
        this.reverse();
        this.progress = this.progress - this.delta;
        this.delta *= -1;
        this.erasing = true;
    }

    // Reverse the start and end of the line.
    reverse() {
        const startX = this.startX;
        const startY = this.startY;

        this.startX = this.endX;
        this.startY = this.endY;
        this.endX = startX;
        this.endY = startY;
    }
}

class Animation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.lines = [];

        // Styling
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "purple";
        this.ctx.strokeStyle = "purple";
    }

    // Start animation.
    start() {
        this.intervalID = setInterval(() => {
            this.lines.push(this.getInitialLine());
            this.draw();
        }, 4000);
    }

    // Stop animation.
    stop() {
        clearInterval(this.intervalID);
    }

    // Draw next frame.
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const l of this.lines) {
            this.ctx.beginPath();
            this.ctx.moveTo(l.startX, l.startY);
            this.ctx.lineTo(
                l.startX + (l.endX - l.startX) * l.progress,
                l.startY + (l.endY - l.startY) * l.progress
            );
            this.ctx.stroke();

            if (l.progress < 0.1 && l.erasing && !l.branched) {
                this.branch(l);
            } else if (l.progress < 1 && l.progress >= 0) {
                l.progress += l.delta;
            } else if (l.progress >= 1) {
                l.erase();
            } else if (l.progress < 0 && l.erasing) {
                this.remove(l);
            }
        }
        window.requestAnimationFrame(this.draw.bind(this));
    }

    // Remove a line from the animation.
    remove(l) {
        const i = this.lines.indexOf(l);
        if (i < 0) {
            throw new Error("line not found for removal");
        }
        this.lines.splice(i, 1);
    }

    // Divide into branches from the original endpoint of the given line
    // (assuming the line has already been reversed).
    branch(l) {
        // Get original vector and branching point.
        const originalVector = this.getVectorFromLine(l);
        let [startX, startY] = [l.endX, l.endY];
        if (l.erasing) {
            [startX, startY] = [l.startX, l.startY];
        }

        // Create branches.
        const branchProbability = 0.8 / l.decay;
        while (Math.random() < branchProbability) {
            let v = this.normalizeVector(originalVector);
            v = this.skewVector(v, 0.7);

            // TODO: Refactor this too?
            const length = Math.random() * 100 + 50;
            v = this.scaleVector(v, length);

            const [endX, endY] = [startX + v[0], startY + v[1]];
            if (
                startX >= 0 &&
                startY >= 0 &&
                endX < this.canvas.width &&
                endY < this.canvas.height
            ) {
                this.lines.push(
                    new Line(startX, startY, endX, endY, l.decay * 3)
                );
            }
        }
        l.branched = true;
    }

    // Get vector from line.
    getVectorFromLine(l) {
        if (l.erasing) {
            return [l.startX - l.endX, l.startY - l.endY];
        }

        return [l.endX - l.startX, l.endY - l.startY];
    }

    // Randomly generate a line directed from the edge of the canvas to the
    // center.
    getInitialLine() {
        const [x, y] = this.getBorderPoint();
        let v = this.getVectorToCenter(x, y);

        // TODO: Refactor to global skew factor or make random.
        // TODO: While at it, probably create a Vector class to hold all this logic.
        v = this.normalizeVector(v);
        v = this.skewVector(v, 0.7);

        // TODO: Refactor this too?
        const length = Math.random() * 100 + 50;
        v = this.scaleVector(v, length);

        return new Line(x, y, x + v[0], y + v[1]);
    }

    // Get a random point on the border of the canvas with uniform distribution.
    getBorderPoint() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const x = Math.floor(Math.random() * (2 * w + 2 * h));

        // Top
        if (x < w) {
            return [0, x];
        }

        // Right
        if (x < w + h) {
            return [w, x - w];
        }

        // Bottom
        if (x < 2 * w + h) {
            return [x - (w + h), h];
        }

        // Left
        return [0, x - (2 * w + h)];
    }

    // Get vector from given point to center of canvas.
    getVectorToCenter(x, y) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        return [cx - x, cy - y];
    }

    // Randomly skew a given vector v by a factor k ([0, 1]).
    skewVector(v, k) {
        if (k < 0 || k > 1) {
            throw new Error("invalid skew factor");
        }

        const skewX = Math.random() * k;
        const skewY = Math.random() * k;

        return [v[0] + skewX, v[1] + skewY];
    }

    // Normalize the given vector.
    normalizeVector(v) {
        const [x, y] = v;
        const length = Math.sqrt(x * x + y * y);

        return [x / length, y / length];
    }

    // Scale the given vector.
    scaleVector(v, k) {
        return [v[0] * k, v[1] * k];
    }
}

const canvas = document.getElementById("background");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const animation = new Animation(canvas);
// animation.start();
