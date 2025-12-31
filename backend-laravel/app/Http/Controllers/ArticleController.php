<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\BeyondChatsScraperService;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function status()
    {
        return response()->json(['status' => 'backend alive']);
    }

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

        if (array_key_exists('references', $validated)) {
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

    public function improve($id)
    {
        try {
            \Illuminate\Support\Facades\Log::info("Improve called for Article ID: $id");

            $article = Article::findOrFail($id);
            
            
            $article->update([
                'status' => 'PROCESSING',
                'updated_content' => null
            ]);
            $article->references()->delete();
            
            $workerDir = base_path('../node-worker');
            $workerDir = realpath($workerDir); 
            $scriptPath = $workerDir . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'index.js';
            
            if (!$workerDir || !file_exists($scriptPath)) {
                \Illuminate\Support\Facades\Log::error("Node worker script not found at: " . $scriptPath);
                return response()->json(['error' => 'Worker script not found'], 500);
            }

            $logPath = storage_path('logs/node-worker.log');
            
            if (!file_exists(dirname($logPath))) {
                mkdir(dirname($logPath), 0755, true);
            }

           
            $cmd = "start /B cmd /c \"cd /d \"$workerDir\" && node src/index.js $id > \"$logPath\" 2>&1\"";
            
            \Illuminate\Support\Facades\Log::info("Launching worker in $workerDir: $cmd");

            pclose(popen($cmd, "r"));
            
            return response()->json([
                'message' => 'Article improvement started in background.',
                'article_id' => $id
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Improve Error: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
