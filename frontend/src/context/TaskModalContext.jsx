import { createContext, useCallback, useContext, useState } from 'react'

const TaskModalContext = createContext(null)

export function TaskModalProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openCreateTask = useCallback(() => setOpen(true), [])
  const closeCreateTask = useCallback(() => setOpen(false), [])

  return (
    <TaskModalContext.Provider value={{ createOpen: open, openCreateTask, closeCreateTask }}>
      {children}
    </TaskModalContext.Provider>
  )
}

export function useTaskModal() {
  const ctx = useContext(TaskModalContext)
  if (!ctx) throw new Error('useTaskModal must be used within TaskModalProvider')
  return ctx
}
