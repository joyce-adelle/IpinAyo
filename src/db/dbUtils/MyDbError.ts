export class MyDbError extends Error {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, MyDbError.prototype);
    }
}
