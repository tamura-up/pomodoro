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
        clearInterval(this.#intarvalID);
        this.#running = true;
        const startTime = new Date();
        const leftMilliSeconds = this.#miliseconds;
        this.#intarvalID = setInterval(() => {
            let diff = differenceInMilliseconds(new Date(), startTime);
            this.#miliseconds = (leftMilliSeconds - diff < 0) ? 0 : leftMilliSeconds - diff;
            if (this.#miliseconds <= 0) this.finish();
        }, 100);
    }

    finish() {
        this.stop();
        this.handler();
    }
}

const pomodoroStates = ["WORK", "SHORT_BREAK", "LONG_BREAK"] as const
type PomodoroStateType = (typeof pomodoroStates)[number];

// const AllPomodoroState = Object.values(pomodoroStates);


type PomodoroConfigType = {
    workInterval: number;
    shortBreakInterval: number;
    longBreakInterval: number;
    longBreakAfterWork: number;
};
const defaultPomodoroConfig: PomodoroConfigType = {
    workInterval: +(25 * 60),
    shortBreakInterval: +(5 * 60),
    longBreakInterval: +(25 * 60),
    longBreakAfterWork: +(4),
};

type StateConfig = {
    interval: number;
};

export class IterationSet {
    workCount: number = 0;
    state: PomodoroStateType = "WORK";
    iteration: Iteration;
    stateConfig: Map<PomodoroStateType, StateConfig>;
    config: PomodoroConfigType;
    handlers?: Map<PomodoroStateType, Function> | undefined;

    constructor(config?: PomodoroConfigType) {
        if (config == undefined) {
            config = defaultPomodoroConfig;
        }

        this.stateConfig = new Map(
            [
                ["WORK", {interval: config.workInterval}],
                ["SHORT_BREAK", {interval: config.shortBreakInterval}],
                ["LONG_BREAK", {interval: config.longBreakInterval}],
            ]
        );
        this.config = config;
        this.iteration = new Iteration(config.workInterval, () => {
            this.finishEvent()
        });
    }

    finishEvent() {
        if (!!this.handlers) {
            const handler = this.handlers.get(this.state);
            if (!!handler) {
                handler();
            }
        }
        this.changeNextState();
    }

    changeNextState() {
        if (this.state == 'WORK') {
            this.workCount += 1;
            if (this.workCount % this.config.longBreakAfterWork == 0) {
                this.state = 'LONG_BREAK';
            } else {
                this.state = 'SHORT_BREAK';
            }
        } else {
            this.state = 'WORK';
        }
        const {interval} = this.stateConfig.get(this.state)!;
        this.iteration = new Iteration(interval, () => {
            this.finishEvent()
        });
    }

    getCurrentIteration() {
        return this.iteration;
    }

    goToNext() {
        this.iteration.stop();
        this.changeNextState();
    }
}
