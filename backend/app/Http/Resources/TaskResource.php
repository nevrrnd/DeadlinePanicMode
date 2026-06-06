<?php

namespace App\Http\Resources;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Task
 */
class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge([
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'course' => $this->course,
            'description' => $this->description,
            'deadline' => optional($this->deadline)->toIso8601String(),
            'priority' => $this->priority,
            'progress' => (int) $this->progress,
            'is_done' => (bool) $this->is_done,
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
            'deleted_at' => optional($this->deleted_at)->toIso8601String(),
            'undo_expires_at' => optional($this->undoExpiresAt())->toIso8601String(),
            'can_undo' => $this->canUndo(),
            'undo_remaining_text' => $this->undoRemainingText(),
        ], $this->statusPayload());
    }
}
