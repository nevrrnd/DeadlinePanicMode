<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => config('app.name'),
        'message' => 'Deadline Panic Mode API is running. See /api endpoints.',
    ]);
});
