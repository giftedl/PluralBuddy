export class FileTooBigException extends Error {
    constructor() {
        super("This file was too big after being compressed.")
    }
}