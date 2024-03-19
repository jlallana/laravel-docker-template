<!DOCTYPE html>
<html>
    <head>
        <meta name="auth_providder" content="{{ $auth_provider }}"/>
        <meta name="client_id" content="{{ $client_id }}"/>
        @vite(['resources/js/auth.js'])
    </head>
    <body>
    </body>
</html>