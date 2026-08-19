export class LatestExerciseCodeRequest {
    requestId = 0;
    cancel() {
        this.requestId += 1;
    }
    async load(exercise, loadCode, applyCode, applyError = () => undefined) {
        const currentRequestId = ++this.requestId;
        let code;
        try {
            code = await loadCode(exercise);
        }
        catch (error) {
            if (currentRequestId !== this.requestId)
                return false;
            applyError(error);
            return true;
        }
        if (currentRequestId !== this.requestId)
            return false;
        applyCode(code);
        return true;
    }
}
//# sourceMappingURL=exercise_code_request.js.map