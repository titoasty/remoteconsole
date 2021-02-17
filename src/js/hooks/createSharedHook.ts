import { useReducer, useEffect } from 'preact/hooks';

const useForceUpdate = () => useReducer((state) => !state, false)[1];

function createSharedState<T>(reducer, initialState: T): () => [T, (action: T) => void] {
    const subscribers: any[] = [];
    let state: T = initialState;

    const dispatch = (action: T) => {
        state = reducer(state, action);
        subscribers.forEach((callback) => callback());
    };

    const useSharedState = (): [T, (action: T) => void] => {
        const forceUpdate = useForceUpdate();
        useEffect(() => {
            // @ts-ignore
            const callback = () => forceUpdate();
            subscribers.push(callback);
            callback(); // in case it's already updated

            const cleanup = () => {
                const index = subscribers.indexOf(callback);
                subscribers.splice(index, 1);
            };

            return cleanup;
        }, []);

        return [state, dispatch];
    };

    return useSharedState;
}

export default function createSharedHook<T>(initialState: T) {
    const reducer = (state: T, action) => action;
    const hook = createSharedState<T>(reducer, initialState);

    return hook;
}
