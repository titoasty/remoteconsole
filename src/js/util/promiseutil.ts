export function wait(duration: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, duration);
    });
}
