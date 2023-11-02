export class Line {
    // NOTE: Duration is in ms.
    constructor(startX, startY, endX, endY, decay = 1, duration = 500) {
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

        // Percentage completion per ms.
        this.delta = 1 / duration;

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