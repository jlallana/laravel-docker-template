<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta name="OAUTH_PROVIDER" content="{{ env('OAUTH_PROVIDER') }}" />
        <meta name="OAUTH_CLIENT_ID" content="{{ env('OAUTH_CLIENT_ID') }}" />    
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Laravel + Vue example application." />
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body>
    </body>
</html>