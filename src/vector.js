/**
 * A class for 2D vectors.
 */
export class Vector {
    /**
     * Initialize a vector.
     *
     * @param {Number} x the horizontal component of the vector
     * @param {Number} y the vertical component of the vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Computes the length of the vector.
     *
     * @returns the length of the vector
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Randomly rotate the vector counterclockwise.
     *
     * @param {Number} min minimum angle to rotate by, in radians
     * @param {Number} max the maximum angle to rotate by, in radians.
     */
    randomRotate(min, max) {
        const angle = Math.random() * (max - min) + min;
        this.rotate(angle);
    }

    /**
     * Rotate the vector counterclockwise.
     *
     * @param {Number} rad the angle to rotate by, in radians
     */
    rotate(rad) {
        const x = this.x;
        const y = this.y;

        this.x = x * Math.cos(rad) - y * Math.sin(rad);
        this.y = x * Math.sin(rad) + y * Math.cos(rad);
    }

    /**
     * Normalizes the vector.
     */
    normalize() {
        this.x /= this.length();
        this.y /= this.length();
    }

    /**
     * Scales the vector.
     *
     * @param {Number} k
     */
    scale(k) {
        this.x *= k;
        this.y *= k;
    }

    /**
     * Copies the current vector.
     *
     * @returns a copy of the current vector
     */
    copy() {
        return new Vector(this.x, this.y);
    }
}
