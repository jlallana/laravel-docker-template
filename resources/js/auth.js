import './oauth.js';


document.addEventListener('DOMContentLoaded', async function() {

    var auth = new oauth(getMetaContent('auth_providder'), getMetaContent('client_id'));

    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
        auth.authorize();
        return;
    }

    const token = await auth.token(code);
    localStorage.setItem('token', token);
    window.close();

});

function getMetaContent(name) {
    return document.querySelector(`meta[name="${name}"]`).getAttribute('content');
}