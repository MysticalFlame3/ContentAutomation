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

        // Use array_key_exists to check if references key was sent, even if empty array
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
            
            // Update status so frontend knows to wait
            $article->update(['status' => 'PROCESSING']);
            
            // Absolute path to the worker script
            $rawPath = base_path('../node-worker/src/index.js');
            $scriptPath = realpath($rawPath);
            
            if (!$scriptPath || !file_exists($scriptPath)) {
                \Illuminate\Support\Facades\Log::error("Node worker script not found at: " . $rawPath);
                return response()->json(['error' => 'Worker script not found'], 500);
            }

            $logPath = storage_path('logs/node-worker.log');
            
            // Ensure log directory exists
            if (!file_exists(dirname($logPath))) {
                mkdir(dirname($logPath), 0755, true);
            }

            // Command to run node script in background (Windows compatible)
            // wrapped in cmd /c and start /B to ensure it detaches properly
            $cmd = "start /B cmd /c node \"$scriptPath\" $id > \"$logPath\" 2>&1";
            
            \Illuminate\Support\Facades\Log::info("Launching worker: $cmd");

            // Execute
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
