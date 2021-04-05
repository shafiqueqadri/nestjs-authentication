export interface IParam {
    id: string
}

export interface IPaginate<T> {
    total: number
    pages: number
    page: number
    limit: number
    search: string
    docs: Array<T>
}

export interface IQuery {
    page: string
    limit: string
    search: string
}

export const makeQuery = (q: IQuery) => {
    const limit = parseInt(q.limit) || 10;
    const page = parseInt(q.page);
    return {
        limit: limit,
        skip:  (page - 1) * limit,
        page: page || 1,
        search: q.search
    }
}