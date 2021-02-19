// @ts-ignore
window.test = function () {
    console.log(new Error().stack);
};

// @ts-ignore
window.test2 = function () {
    throw 'TestException';
};

// @ts-ignore
window.testXHR = function (code: number = 200) {
    const req = new XMLHttpRequest();
    req.open('GET', 'https://httpstat.us/' + code, true);
    req.send(null);
};
