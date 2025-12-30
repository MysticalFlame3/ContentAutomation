<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\BeyondChatsScraperService;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        return response()->json(Article::with('references')->get());
    }

    public function show($id)
    {
        return response()->json(Article::with('references')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'updated_content' => 'required|string',
            'references' => 'array',
            'status' => 'required|in:UPDATED',
        ]);

        $article->update([
            'updated_content' => $validated['updated_content'],
            'status' => $validated['status'],
        ]);

        if (!empty($validated['references'])) {
            $article->references()->delete();
            foreach ($validated['references'] as $url) {
                $article->references()->create(['reference_url' => $url]);
            }
        }

        return response()->json($article->load('references'));
    }

    public function triggerScrape(BeyondChatsScraperService $scraper)
    {
        $count = $scraper->scrapeOldest();
        return response()->json(['message' => "Scraped $count articles."]);
    }
}
