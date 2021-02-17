export default class CmdHistory {
    history: string[] = [''];
    index: number = 0;

    constructor() {}

    update(text: string) {
        this.history[0] = text;
    }

    push() {
        this.history[0] = this.current();
        this.history.unshift('');
        this.index = 0;
    }

    up() {
        if (this.index >= this.history.length - 1) return false;
        this.index = this.index + 1;
        return true;
    }

    down() {
        if (this.index <= 0) return false;
        this.index = this.index - 1;
        return true;
    }

    current() {
        return this.history[this.index];
    }
}
