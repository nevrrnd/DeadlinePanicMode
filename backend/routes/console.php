<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Task;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('tasks:purge-deleted', function () {
    $count = Task::onlyTrashed()
        ->where('deleted_at', '<', Carbon::now()->subDays(7))
        ->forceDelete();

    $this->info("{$count} task terhapus permanen.");
})->purpose('Permanently delete soft-deleted tasks older than 7 days');
