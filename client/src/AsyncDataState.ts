export type AsyncDataState<T> =
    | { type: 'INITIAL' }
    | { type: 'LOADING' }
    | { type: 'DATA'; data: T }
    | { type: 'ERROR'; message: string };
