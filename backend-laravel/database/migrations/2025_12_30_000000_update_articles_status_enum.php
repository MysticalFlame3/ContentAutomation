<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Alter the check constraint to include 'PROCESSING'
        // We catch exception in case the constraint name is different, but the error log confirmed 'articles_status_check'
        DB::statement("ALTER TABLE articles DROP CONSTRAINT articles_status_check");
        DB::statement("ALTER TABLE articles ADD CONSTRAINT articles_status_check CHECK (status IN ('ORIGINAL', 'UPDATED', 'PROCESSING'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE articles DROP CONSTRAINT articles_status_check");
        DB::statement("ALTER TABLE articles ADD CONSTRAINT articles_status_check CHECK (status IN ('ORIGINAL', 'UPDATED'))");
    }
};
