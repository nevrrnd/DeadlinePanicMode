<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'course',
        'description',
        'deadline',
        'priority',
        'progress',
        'is_done',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'deleted_at' => 'datetime',
            'progress' => 'integer',
            'is_done' => 'boolean',
        ];
    }

    public function undoExpiresAt(): ?Carbon
    {
        return $this->deleted_at ? $this->deleted_at->copy()->addDays(7) : null;
    }

    public function canUndo(): bool
    {
        return $this->deleted_at !== null && Carbon::now()->lessThanOrEqualTo($this->undoExpiresAt());
    }

    public function undoRemainingText(): ?string
    {
        if (! $this->deleted_at) {
            return null;
        }

        if (! $this->canUndo()) {
            return 'Undo kedaluwarsa';
        }

        $days = max(1, (int) ceil(Carbon::now()->diffInHours($this->undoExpiresAt(), false) / 24));

        return "Sisa undo: {$days} hari";
    }

    /**
     * @return BelongsTo<User, Task>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Compute the deadline status (NOT stored in DB).
     * Returns a stable key used everywhere: selesai | tamat | darurat | panik | bahaya | santai
     */
    public function statusKey(): string
    {
        if ($this->is_done || (int) $this->progress >= 100) {
            return 'selesai';
        }

        $now = Carbon::now();
        $deadline = $this->deadline instanceof Carbon ? $this->deadline : Carbon::parse($this->deadline);

        if ($deadline->isPast()) {
            return 'tamat';
        }

        $hours = $now->diffInHours($deadline, false);
        $days = $now->diffInDays($deadline, false);

        if ($hours <= 24) {
            return 'darurat';
        }
        if ($days <= 3) {
            return 'panik';
        }
        if ($days <= 7) {
            return 'bahaya';
        }

        return 'santai';
    }

    /**
     * Full computed status payload appended to API responses.
     */
    public function statusPayload(): array
    {
        $key = $this->statusKey();
        $now = Carbon::now();
        $deadline = $this->deadline instanceof Carbon ? $this->deadline : Carbon::parse($this->deadline);

        // remaining: positive = time left, negative = overdue
        $remainingHours = (int) round($now->diffInHours($deadline, false));
        $remainingDays = (int) floor($now->diffInDays($deadline, false));

        return [
            'status_key' => $key,
            'status_label' => self::STATUS_LABELS[$key],
            'status_color' => self::STATUS_COLORS[$key],
            'remaining_hours' => $remainingHours,
            'remaining_days' => $remainingDays,
            'remaining_time_text' => $this->remainingTimeText($key, $remainingHours, $remainingDays, $deadline),
        ];
    }

    private function remainingTimeText(string $key, int $hours, int $days, Carbon $deadline): string
    {
        if ($key === 'selesai') {
            return 'Selesai';
        }

        $now = Carbon::now();

        // Overdue
        if ($deadline->isPast()) {
            $lateDays = (int) floor($deadline->diffInDays($now, false));
            $lateHours = (int) round($deadline->diffInHours($now, false));
            if ($lateDays >= 1) {
                return "Lewat {$lateDays} hari";
            }
            $lateHours = max($lateHours, 1);
            return "Lewat {$lateHours} jam";
        }

        // Same calendar day
        if ($deadline->isSameDay($now)) {
            if ($hours <= 1) {
                return 'Deadline hari ini';
            }
            return "{$hours} jam lagi";
        }

        if ($days >= 1) {
            return "{$days} hari lagi";
        }

        $hours = max($hours, 1);
        return "{$hours} jam lagi";
    }

    public const STATUS_LABELS = [
        'selesai' => 'Selesai',
        'santai' => 'Santai',
        'bahaya' => 'Mulai Bahaya',
        'panik' => 'Panik',
        'darurat' => 'Darurat',
        'tamat' => 'Tamat',
    ];

    // Tailwind-friendly color tokens consumed by the frontend StatusBadge.
    public const STATUS_COLORS = [
        'selesai' => 'green',
        'santai' => 'blue',
        'bahaya' => 'yellow',
        'panik' => 'orange',
        'darurat' => 'red',
        'tamat' => 'gray',
    ];
}
