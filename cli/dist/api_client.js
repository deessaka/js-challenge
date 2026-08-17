export class ApiError extends Error {
    status;
    payload;
    constructor(message, status, payload) {
        super(message);
        this.status = status;
        this.payload = payload;
        this.name = 'ApiError';
    }
}
export class ApiClient {
    baseUrl;
    getToken;
    constructor(baseUrl, getToken) {
        this.baseUrl = baseUrl;
        this.getToken = getToken;
    }
    async getMe() {
        return this.request('/api/v1/me').then((response) => response.data);
    }
    async listChallenges(page = 1, perPage = 200) {
        return this.request(`/api/v1/challenges?page=${page}&perPage=${perPage}`);
    }
    async getChallenge(slug) {
        return this.request(`/api/v1/challenges/${encodeURIComponent(slug)}`).then((response) => response.data);
    }
    async getNextChallenge() {
        return this.request('/api/v1/recommendations/next').then((response) => response.data);
    }
    async createSubmission(input) {
        return this.request('/api/v1/submissions', {
            method: 'POST',
            body: JSON.stringify({
                ...input,
                language: 'javascript',
                client: 'terminal',
                clientVersion: '0.1.0',
            }),
        }).then((response) => response.data);
    }
    async request(path, init = {}) {
        const headers = new Headers(init.headers);
        headers.set('Accept', 'application/json');
        if (init.body)
            headers.set('Content-Type', 'application/json');
        const token = await this.getToken();
        if (token)
            headers.set('Authorization', `Bearer ${token}`);
        let response;
        try {
            response = await fetch(`${this.baseUrl.replace(/\/$/, '')}${path}`, { ...init, headers });
        }
        catch (error) {
            throw new ApiError('Impossible de joindre Codojo. Vérifiez l’URL de l’API et votre connexion.', 0, error);
        }
        const text = await response.text();
        let payload = null;
        if (text) {
            try {
                payload = JSON.parse(text);
            }
            catch {
                payload = text;
            }
        }
        if (!response.ok) {
            const message = typeof payload === 'object' && payload !== null && 'error' in payload
                ? String(payload.error)
                : `La requête API a échoué (${response.status}).`;
            throw new ApiError(message, response.status, payload);
        }
        return payload;
    }
}
//# sourceMappingURL=api_client.js.map