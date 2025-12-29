<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('original_content');
            $table->text('updated_content')->nullable();
            $table->string('source_url')->unique();
            $table->enum('status', ['ORIGINAL', 'UPDATED'])->default('ORIGINAL');
            $table->timestamps();
        });

        Schema::create('article_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->string('reference_url');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('article_references');
        Schema::dropIfExists('articles');
    }
};
