<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

class BeyondChatsScraperService
{
    private $baseUrl = 'https://beyondchats.com/blogs/';

    public function scrapeOldest()
    {
        // 1. Fetch main page
        try {
            \Log::info("Scraping main page for articles: " . $this->baseUrl);
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ])->withoutVerifying()->get($this->baseUrl);

            if (!$response->successful()) {
                \Log::error("Failed to fetch main page: " . $response->status());
                return 0;
            }

            $html = $response->body();
            $crawler = new Crawler($html);

            // 2. Find links to articles
            $articleLinks = $crawler->filter('a')->each(function (Crawler $node) {
                $href = $node->attr('href');
                if (str_starts_with($href, '/')) {
                    return 'https://beyondchats.com' . $href;
                }
                return $href;
            });

            // Filter for blog posts
            $blogLinks = array_filter($articleLinks, function ($link) {
                return (str_contains($link, '/blog/') || str_contains($link, '/blogs/')) 
                       && !str_ends_with($link, '/blog/')
                       && !str_ends_with($link, '/blogs/');
            });

            $blogLinks = array_unique($blogLinks);
            
            $blogLinks = array_slice($blogLinks, 0, 5);

            \Log::info("Found links: " . implode(', ', $blogLinks));

            $count = 0;
            foreach ($blogLinks as $url) {
                if (Article::where('source_url', $url)->exists()) continue;

                $this->scrapeSingleArticle($url);
                $count++;
            }

            return $count;

        } catch (\Exception $e) {
            \Log::error("Scraping error: " . $e->getMessage());
            throw $e;
        }
    }

    private function scrapeSingleArticle($url)
    {
        \Log::info("Scraping article: $url");
        $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ])->withoutVerifying()->get($url);
        
        if (!$response->successful()) return;

        $html = $response->body();
        $crawler = new Crawler($html);

        $title = $crawler->filter('h1')->count() > 0 ? $crawler->filter('h1')->text() : 'Untitled';
        $content = $crawler->filter('body')->html(); 

        Article::create([
            'title' => $title,
            'original_content' => $content,
            'source_url' => $url,
            'status' => 'ORIGINAL'
        ]);
    }
}
