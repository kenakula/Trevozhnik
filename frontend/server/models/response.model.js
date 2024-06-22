export class ResponseModel {
    constructor(isSuccess, message, data) {
        this.message = message;
        this.isSuccess = isSuccess;
        this.data = data;
    }
}
