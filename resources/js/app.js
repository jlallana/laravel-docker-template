import axios from 'axios';
import './bootstrap';


addEventListener('load', function() {

    var code = new URLSearchParams(window.location.search).get('code');

    if(code) {
        var data = new URLSearchParams();
        data.append('client_id', 'localhost');
        data.append('grant_type', 'authorization_code');
        data.append('code', code);
        data.append('redirect_uri', 'http://localhost:8000');

        fetch('http://localhost:8080/realms/localhost/protocol/openid-connect/token', {
            method: 'POST',
            body: data,
            credentials: 'omit'
        }).then(response => response.text())
        .then(result => {
          localStorage.setItem('token', result);
          window.location.replace(window.location.pathname);
        });      
    }
});


axios.interceptors.request.use(async (config) => {

    var token = localStorage.getItem('token');

    if(!token) {
        window.location.href = "http://localhost:8080/realms/localhost/protocol/openid-connect/auth?client_id=localhost&redirect_uri=http://localhost:8000&response_type=code&scope=openid";
    }

    let token2 = JSON.parse(token);
    config.headers['Authorization'] = `Bearer ${token2.access_token}`;
    return config;
}, error => {
    console.error('Error al enviar la solicitud:', error);
    return Promise.reject(error);
});


window.hello = async() =>alert((await axios.get('/api/hello')).data)