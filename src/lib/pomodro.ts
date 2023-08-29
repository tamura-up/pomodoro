import {differenceInMilliseconds} from "date-fns";

export class Iteration {
    private handler: Function;

    get running(): boolean {
        return this.#running;
    }

    get seconds(): number {
        return Math.floor(this.#miliseconds / 1000);
    }

    #miliseconds: number;
    #running: boolean = false;
    #intarvalID: any;

    constructor(seconds: number, handler: Function) {
        this.#miliseconds = seconds * 1000;
        this.handler = handler;
    }

    stop() {
        this.#running = false;
        clearInterval(this.#intarvalID);
    }

    start() {
        this.#running = true;
        const startTime = new Date();
        const leftMilliSeconds = this.#miliseconds;
        this.#intarvalID = setInterval(() => {
            let diff = differenceInMilliseconds(new Date(), startTime);
            this.#miliseconds = (leftMilliSeconds - diff < 0) ? 0 : leftMilliSeconds - diff;
            if (this.#miliseconds <= 0) this.finish();
        }, 300);
    }

    finish() {
        this.stop();
        this.handler();
    }
}