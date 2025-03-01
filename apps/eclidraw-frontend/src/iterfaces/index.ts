export interface KnownError {
    message: string
    description: string
    code: number | undefined
}

export type ApiHandlerParams = {
    // eslint-disable-next-line
    data?: any;
    endpoint: string;
    token?: string;
}



export * from './auth'
export * from './room'
export  * from './draw'