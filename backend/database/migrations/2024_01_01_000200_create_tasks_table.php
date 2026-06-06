<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('course');
            $table->text('description')->nullable();
            $table->timestamp('deadline');
            $table->string('priority')->default('medium'); // low | medium | high
            $table->unsignedTinyInteger('progress')->default(0); // 0 - 100
            $table->boolean('is_done')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_done']);
            $table->index(['user_id', 'deadline']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
