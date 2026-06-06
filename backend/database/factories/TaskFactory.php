<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        static $index = 0;

        $samples = [
            ['Review materi UTS', 'Sistem Operasi', 'medium', 25, 6],
            ['Latihan soal struktur data', 'Struktur Data', 'high', 45, 3],
            ['Buat wireframe aplikasi', 'UI/UX', 'low', 10, 12],
            ['Ringkasan paper AI', 'Kecerdasan Buatan', 'medium', 0, 9],
        ];

        [$title, $course, $priority, $progress, $days] = $samples[$index % count($samples)];
        $index++;

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'course' => $course,
            'description' => 'Data contoh dari factory tanpa dependency Faker.',
            'deadline' => Carbon::now()->addDays($days),
            'priority' => $priority,
            'progress' => $progress,
            'is_done' => false,
        ];
    }
}
