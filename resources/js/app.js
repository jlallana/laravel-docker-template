import './bootstrap';
import {createApp} from 'vue';
import App from './App.vue';

class Session {
    constructor(token) {
        this.token = token;
        this.payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

        if(this.payload.exp < Math.floor(Date.now() / 1000)) {
            throw new Error('Token has expired');
        }
    }
}

class OIDC {
    constructor(privderUrl, clientId) {
        this.providerUrl = privderUrl;
        this.clientId = clientId;
    }

    isAuthRequest() {
        if(window.location.hash) {
            if(window.parent) {
                window.parent.postMessage(Object.fromEntries(new URLSearchParams(location.hash.substring(1))));
            }

            if(window.opener) {
                window.opener.postMessage(Object.fromEntries(new URLSearchParams(location.hash.substring(1))));
            }
            window.close();
            return true;
        } 
    }

    getRedirectUrl() {
        return window.location.origin + window.location.pathname;
    }

    async fetchConfiguration(){
        const response = await fetch(`${this.providerUrl}/.well-known/openid-configuration`);
        return await response.json();
    }

    async getConfiguration()
    {
        if(!this.configuration){
            this.configuration = await this.fetchConfiguration();
        }
        return this.configuration;
    }


    async silentAuthentication() {
        var configuration = await this.getConfiguration();
        var authorizationUrl = configuration.authorization_endpoint;
        var redirectUri = this.getRedirectUrl();
        var state = Math.random();

        var parameters = new URLSearchParams({
            response_type: 'id_token',
            client_id: this.clientId,
            redirect_uri: redirectUri,
            scope: 'openid email',
            state: state,
            nonce: Math.random(),
            prompt: 'none'
        });

        var url = `${authorizationUrl}?${parameters.toString()}`;

        var iframe = document.createElement('iframe');
        iframe.src =  url;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        try {
            return await this.getIdTokenMessage(state);
        } finally {
            document.body.removeChild(iframe);
        }
    }

    async loginWindowAuthentication()
    {
        var configuration = await this.getConfiguration();
        var authorizationUrl = configuration.authorization_endpoint;
        var redirectUri = this.getRedirectUrl();
        var state = Math.random();

        var parameters = new URLSearchParams({
            response_type: 'id_token',
            client_id: this.clientId,
            redirect_uri: redirectUri,
            scope: 'openid email',
            state: state,
            nonce: Math.random(),
            prompt: 'consent'
        });

        var url = `${authorizationUrl}?${parameters.toString()}`;

        window.open(url);
        return await this.getIdTokenMessage(state);
    }

    async getTokenFromLocalStorage() {
        return new Session(localStorage.getItem('id_token'));
    }


    async fetchIdToken() {
        try {
            return await this.silentAuthentication();
        } catch(e) {
            return await this.loginWindowAuthentication();
        }
    }

    async fetchSession() {
        try {
            return await this.getTokenFromLocalStorage();
        } catch {
            var newIdToken = await this.fetchIdToken();
            localStorage.setItem('id_token', newIdToken);
            return new Session(newIdToken);
        }    
    }

    getIdTokenMessage(state) {
        return new Promise((resolve, reject) => {
            window.addEventListener('message', (event) => {
                if(event.data.state == state) {
                    if(event.data.error) {
                        reject(event.data.error);
                    } else {
                        resolve(event.data.id_token);
                    }
                }
            });
        });
    }
}

var oidc = new OIDC(
    document.querySelector('meta[name="OAUTH_PROVIDER"]').getAttribute('content'), 
    document.querySelector('meta[name="OAUTH_CLIENT_ID"]').getAttribute('content')
);

if(!oidc.isAuthRequest()) {
    createApp(App).mount('body');
}

window.callService = async function() {
    var session = await oidc.fetchSession();
    var response = await fetch('/demo', {
        headers: {
            'Authorization': `Bearer ${session.token}`
        }
    });    

    alert(await response.json());
}