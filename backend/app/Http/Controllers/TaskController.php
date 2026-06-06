<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * List the authenticated user's tasks with filtering + sorting.
     *
     * Query params:
     *  - status: all|selesai|belum|santai|bahaya|panik|darurat|tamat
     *  - priority: low|medium|high
     *  - course: string (exact match)
     *  - search: string (matches title/course/description)
     *  - sort: deadline_asc|deadline_desc|newest|progress_desc
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::query()->where('user_id', $request->user()->id);

        // Search (case-insensitive, portable across PostgreSQL & SQLite)
        if ($search = trim((string) $request->query('search', ''))) {
            $needle = '%'.mb_strtolower($search).'%';
            $query->where(function ($q) use ($needle) {
                $q->whereRaw('LOWER(title) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(course) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(description, \'\')) LIKE ?', [$needle]);
            });
        }

        // Priority filter
        if (in_array($request->query('priority'), ['low', 'medium', 'high'], true)) {
            $query->where('priority', $request->query('priority'));
        }

        // Course filter
        if ($course = $request->query('course')) {
            $query->where('course', $course);
        }

        // Sorting
        switch ($request->query('sort', 'deadline_asc')) {
            case 'deadline_desc':
                $query->orderBy('deadline', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'progress_desc':
                $query->orderBy('progress', 'desc')->orderBy('deadline', 'asc');
                break;
            case 'deadline_asc':
            default:
                $query->orderBy('deadline', 'asc');
                break;
        }

        $tasks = $query->get();

        // Status filter is computed (not stored), so we filter the collection.
        $status = $request->query('status', 'all');
        if ($status && $status !== 'all') {
            $tasks = $tasks->filter(function (Task $task) use ($status) {
                return match ($status) {
                    'belum' => ! $task->is_done && (int) $task->progress < 100,
                    'selesai' => $task->statusKey() === 'selesai',
                    'santai', 'bahaya', 'panik', 'darurat', 'tamat' => $task->statusKey() === $status,
                    default => true,
                };
            })->values();
        }

        return response()->json([
            'data' => TaskResource::collection($tasks),
            'meta' => [
                'count' => $tasks->count(),
            ],
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create($request->validated());

        return response()->json([
            'message' => 'Tugas berhasil ditambahkan.',
            'data' => new TaskResource($task),
        ], 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorizeOwner($request, $task);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorizeOwner($request, $task);

        $task->update($request->validated());

        return response()->json([
            'message' => 'Tugas berhasil diperbarui.',
            'data' => new TaskResource($task->fresh()),
        ]);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorizeOwner($request, $task);

        $task->delete();

        return response()->json([
            'message' => 'Tugas berhasil dihapus.',
            'data' => new TaskResource($task),
        ]);
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        $task = Task::onlyTrashed()
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        if ($task->deleted_at->lt(Carbon::now()->subDays(7))) {
            return response()->json([
                'message' => 'Masa undo sudah berakhir.',
            ], 422);
        }

        $task->restore();

        return response()->json([
            'message' => 'Tugas berhasil dikembalikan.',
            'data' => new TaskResource($task->fresh()),
        ]);
    }

    /**
     * Toggle the is_done flag. When marked done progress jumps to 100.
     */
    public function toggleDone(Request $request, Task $task): JsonResponse
    {
        $this->authorizeOwner($request, $task);

        $task->is_done = ! $task->is_done;
        if ($task->is_done) {
            $task->progress = 100;
        } elseif ((int) $task->progress >= 100) {
            $task->progress = 0;
        }
        $task->save();

        return response()->json([
            'message' => $task->is_done ? 'Tugas ditandai selesai.' : 'Tugas ditandai belum selesai.',
            'data' => new TaskResource($task),
        ]);
    }

    /**
     * Ensure the task belongs to the requesting user (no cross-user access).
     */
    private function authorizeOwner(Request $request, Task $task): void
    {
        abort_if($task->user_id !== $request->user()->id, 403, 'Tugas ini bukan milik Anda.');
    }
}
