export class LatestExerciseCodeRequest {
    requestId = 0;
    cancel() {
        this.requestId += 1;
    }
    async load(exercise, loadValue, applyValue, applyError = () => undefined) {
        const currentRequestId = ++this.requestId;
        let value;
        try {
            value = await loadValue(exercise);
        }
        catch (error) {
            if (currentRequestId !== this.requestId)
                return false;
            applyError(error);
            return true;
        }
        if (currentRequestId !== this.requestId)
            return false;
        applyValue(value);
        return true;
    }
}
//# sourceMappingURL=exercise_code_request.js.map