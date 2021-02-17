import { useReducer } from 'preact/hooks';

export default function useForceUpdate(): (action: unknown) => void {
    const [, forceUpdate] = useReducer((x) => Object.create(null), null);

    return forceUpdate;
}
