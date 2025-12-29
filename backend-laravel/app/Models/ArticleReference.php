<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleReference extends Model
{
    protected $fillable = ['article_id', 'reference_url'];
}
