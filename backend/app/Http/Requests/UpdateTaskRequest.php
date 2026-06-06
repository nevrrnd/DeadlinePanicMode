<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'course' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'deadline' => ['sometimes', 'required', 'date'],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high'])],
            'progress' => ['sometimes', 'required', 'integer', 'min:0', 'max:100'],
            'is_done' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'priority.in' => 'Prioritas harus low, medium, atau high.',
            'progress.min' => 'Progress minimal 0.',
            'progress.max' => 'Progress maksimal 100.',
        ];
    }
}
