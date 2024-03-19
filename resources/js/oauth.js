

window.oauth =  class {
    constructor(provider_url, client_id) {
        this.provider_url = provider_url;
        this.client_id = client_id;
        this.redirectURI = window.location.origin + window.location.pathname;
    }
    authorize() {
        const authEndpoint = `${this.provider_url}/protocol/openid-connect/auth`;

        var query = new URLSearchParams();
        query.append('client_id', this.client_id);
        query.append('redirect_uri', this.redirectURI);
        query.append('response_type', 'code');
        query.append('scope', 'openid');

        window.location.href = `${authEndpoint}?${query}`;
    }

    async token(code) {
        const tokenEndpoint = `${this.provider_url}/protocol/openid-connect/token`;

        const data = new URLSearchParams();
        data.append('client_id', this.client_id);
        data.append('grant_type', 'authorization_code');
        data.append('code', code);
        data.append('redirect_uri', this.redirectURI);

        const response = await fetch(tokenEndpoint, { method: 'POST', body: data, credentials: 'omit' });
        return response.text();
    }
};