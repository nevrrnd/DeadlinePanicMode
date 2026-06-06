<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Frontend origins allowed to call the API.
    'allowed_origins' => array_values(array_filter(array_unique(array_merge(
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')),
        [env('FRONTEND_URL')]
    )))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // We use bearer-token auth, so credentials (cookies) are not required.
    'supports_credentials' => false,

];
