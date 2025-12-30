<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::put('/articles/{id}', [ArticleController::class, 'update']);
Route::post('/articles/{id}/improve', [ArticleController::class, 'improve']);
Route::post('/scrape', [ArticleController::class, 'triggerScrape']);
