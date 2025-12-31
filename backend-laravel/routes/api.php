<?php

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\ArticleController;

// Route::get('/articles', [ArticleController::class, 'index']);
// Route::get('/articles/{id}', [ArticleController::class, 'show']);
// Route::put('/articles/{id}', [ArticleController::class, 'update']);
// Route::post('/articles/{id}/improve', [ArticleController::class, 'improve']);
// Route::post('/scrape', [ArticleController::class, 'triggerScrape']);

use Illuminate\Support\Facades\Route;

// Route::get('/health', function () {
//     return response()->json(['ok' => true]);
// });/

Route::get('/tables', function () {
    return \DB::select("
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    ");
});

Route::get('/__migrate', function () {
    Artisan::call('migrate', ['--force' => true]);
    return response()->json([
        'status' => 'migrations executed',
        'output' => Artisan::output(),
    ]);
});

