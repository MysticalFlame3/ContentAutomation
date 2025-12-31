<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Models\Article;


Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::put('/articles/{id}', [ArticleController::class, 'update']);
Route::post('/articles/{id}/improve', [ArticleController::class, 'improve']);
Route::post('/scrape', [ArticleController::class, 'triggerScrape']);

//use Illuminate\Support\Facades\Route;

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

Route::get('/__seed', function () {
    try {
        $article = \App\Models\Article::create([
            'title' => 'Test Article',
            'original_content' => 'This is a test article',
            'source_url' => 'https://example.com/test-article-' . time(),
            'status' => 'ORIGINAL',
        ]);

        return response()->json($article);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 500);
    }
});


