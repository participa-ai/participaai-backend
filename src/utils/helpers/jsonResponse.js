class JsonResponse {
    constructor(data, pagination) {
        this.sucess = true;
        this.metadata = {};
        this.data = data;

        if (Array.isArray(this.data)) {
            this.metadata.type = 'list';
            this.metadata.count = this.data.length;
        } else {
            this.metadata.type = 'object';
        }

        if (pagination) {
            this.metadata.pagination = pagination;
        }
    }
}

module.exports = JsonResponse;
