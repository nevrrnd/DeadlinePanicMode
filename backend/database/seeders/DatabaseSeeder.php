<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::updateOrCreate(
            ['email' => 'demo@panic.test'],
            [
                'name' => 'Mahasiswa Demo',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        // Clean previous demo tasks so re-seeding stays tidy.
        $demo->tasks()->delete();

        $now = Carbon::now();

        $tasks = [
            // Santai (> 7 hari)
            [
                'title' => 'Riset literatur Skripsi',
                'course' => 'Metodologi Penelitian',
                'description' => 'Kumpulkan 10 jurnal pendukung bab 2.',
                'deadline' => $now->copy()->addDays(14),
                'priority' => 'medium',
                'progress' => 20,
                'is_done' => false,
            ],
            // Mulai Bahaya (<= 7 hari)
            [
                'title' => 'Tugas Besar Basis Data',
                'course' => 'Basis Data',
                'description' => 'Rancang ERD dan normalisasi sampai 3NF.',
                'deadline' => $now->copy()->addDays(5),
                'priority' => 'high',
                'progress' => 40,
                'is_done' => false,
            ],
            // Panik (<= 3 hari)
            [
                'title' => 'Laporan Praktikum Jaringan',
                'course' => 'Jaringan Komputer',
                'description' => 'Konfigurasi subnetting + screenshot Cisco Packet Tracer.',
                'deadline' => $now->copy()->addDays(2),
                'priority' => 'high',
                'progress' => 55,
                'is_done' => false,
            ],
            // Darurat (<= 24 jam)
            [
                'title' => 'Quiz Kalkulus Bab Integral',
                'course' => 'Kalkulus',
                'description' => 'Belajar integral parsial dan substitusi.',
                'deadline' => $now->copy()->addHours(8),
                'priority' => 'high',
                'progress' => 10,
                'is_done' => false,
            ],
            // Tamat (lewat deadline, belum selesai)
            [
                'title' => 'Esai Pancasila',
                'course' => 'Kewarganegaraan',
                'description' => 'Esai 1000 kata tentang nilai gotong royong.',
                'deadline' => $now->copy()->subDays(1),
                'priority' => 'medium',
                'progress' => 30,
                'is_done' => false,
            ],
            // Selesai
            [
                'title' => 'Tugas Pertemuan 1 Pemrograman Web',
                'course' => 'Pemrograman Web',
                'description' => 'Buat halaman profil dengan HTML & CSS.',
                'deadline' => $now->copy()->subDays(3),
                'priority' => 'low',
                'progress' => 100,
                'is_done' => true,
            ],
            // Santai prioritas low
            [
                'title' => 'Baca modul UI/UX',
                'course' => 'Interaksi Manusia Komputer',
                'description' => null,
                'deadline' => $now->copy()->addDays(10),
                'priority' => 'low',
                'progress' => 0,
                'is_done' => false,
            ],
        ];

        foreach ($tasks as $task) {
            $demo->tasks()->create($task);
        }

        // A few random tasks for variety.
        Task::factory()->count(3)->create(['user_id' => $demo->id]);
    }
}
