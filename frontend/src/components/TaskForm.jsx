import { useState } from 'react'
import { Save } from 'lucide-react'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import Select from './ui/Select'
import Button from './ui/Button'

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const EMPTY = {
  title: '',
  course: '',
  description: '',
  deadline: '',
  priority: 'medium',
  progress: 0,
  is_done: false,
}

export default function TaskForm({ initial = EMPTY, submitting = false, submitLabel = 'Simpan', onSubmit, compact = false }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Judul wajib diisi.'
    else if (form.title.length > 255) e.title = 'Judul maksimal 255 karakter.'
    if (!form.course.trim()) e.course = 'Mata kuliah wajib diisi.'
    if (!form.deadline) e.deadline = 'Deadline wajib diisi.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      title: form.title.trim(),
      course: form.course.trim(),
      description: form.description?.trim() || null,
      deadline: form.deadline,
      priority: form.priority,
      progress: form.is_done ? 100 : Number(form.progress) || 0,
      is_done: !!form.is_done,
    })
  }

  return (
    <form onSubmit={submit} className={`${compact ? 'space-y-5' : 'glass space-y-5 rounded-3xl p-6'}`}>
      <Input
        label="Judul Tugas"
        id="title"
        placeholder="cth: Laporan Praktikum Jaringan"
        value={form.title}
        error={errors.title}
        onChange={(e) => set('title', e.target.value)}
      />

      <Input
        label="Mata Kuliah"
        id="course"
        placeholder="cth: Jaringan Komputer"
        value={form.course}
        error={errors.course}
        onChange={(e) => set('course', e.target.value)}
      />

      <Textarea
        label="Deskripsi (opsional)"
        id="description"
        placeholder="Detail tugas, instruksi dosen, dll."
        value={form.description || ''}
        onChange={(e) => set('description', e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Deadline"
          id="deadline"
          type="datetime-local"
          value={form.deadline}
          error={errors.deadline}
          onChange={(e) => set('deadline', e.target.value)}
        />
        <Select
          label="Prioritas"
          id="priority"
          options={PRIORITY_OPTIONS}
          value={form.priority}
          onChange={(e) => set('priority', e.target.value)}
        />
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <input
          type="checkbox"
          checked={!!form.is_done}
          onChange={(e) => set('is_done', e.target.checked)}
          className="h-4 w-4 accent-emerald-500"
        />
        <span className="text-sm text-slate-300">Tandai tugas ini sudah selesai</span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting} size="lg">
          <Save size={18} /> {submitLabel}
        </Button>
      </div>
    </form>
  )
}
