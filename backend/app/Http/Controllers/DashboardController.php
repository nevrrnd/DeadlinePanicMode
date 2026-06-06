<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tasks = Task::where('user_id', $request->user()->id)->get();

        $byStatus = $tasks->groupBy(fn (Task $t) => $t->statusKey());

        $done = $tasks->filter(fn (Task $t) => $t->statusKey() === 'selesai');
        $notDone = $tasks->filter(fn (Task $t) => $t->statusKey() !== 'selesai');

        // Nearest upcoming tasks (not finished, not overdue), soonest deadline first.
        $upcoming = $notDone
            ->filter(fn (Task $t) => ! in_array($t->statusKey(), ['tamat'], true))
            ->sortBy('deadline')
            ->take(5)
            ->values();

        return response()->json([
            'summary' => [
                'total' => $tasks->count(),
                'selesai' => $done->count(),
                'belum_selesai' => $notDone->count(),
                'panik' => $byStatus->get('panik', collect())->count(),
                'darurat' => $byStatus->get('darurat', collect())->count(),
                'tamat' => $byStatus->get('tamat', collect())->count(),
                'santai' => $byStatus->get('santai', collect())->count(),
                'bahaya' => $byStatus->get('bahaya', collect())->count(),
                // Average progress = simple productivity indicator.
                'avg_progress' => $tasks->count() > 0
                    ? (int) round($tasks->avg('progress'))
                    : 0,
            ],
            'upcoming' => TaskResource::collection($upcoming),
        ]);
    }
}
