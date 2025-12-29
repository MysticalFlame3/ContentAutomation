<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'original_content',
        'updated_content',
        'source_url',
        'status',
    ];

    public function references()
    {
        return $this->hasMany(ArticleReference::class);
    }
}
