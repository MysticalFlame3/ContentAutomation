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

Route::get('/db-test', function () {
    try {
        \DB::connection()->getPdo();
        return response()->json(['db' => 'connected']);
    } catch (\Exception $e) {
        return response()->json([
            'db' => 'failed',
            'error' => $e->getMessage()
        ], 500);
    }
});


