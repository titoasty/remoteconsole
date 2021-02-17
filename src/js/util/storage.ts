function get(key: string, defaultValue: any = null) {
    const json = localStorage.getItem(key);
    if (!json) return defaultValue;
    return JSON.parse(json);
}

function set(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function del(key: string) {
    localStorage.removeItem(key);
}

function clear() {
    localStorage.clear();
}

export default {
    get,
    set,
};
