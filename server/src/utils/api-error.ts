export class ApiError extends Error{
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message:string, statusCode:number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
    }
}

export const getErrorMessage = (err: unknown): string => {
    return err instanceof Error ? err.message : String(err);
}
