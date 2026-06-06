import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import CreateTaskModal from './CreateTaskModal'
import { TaskModalProvider } from '../context/TaskModalContext'

// Wraps all authenticated pages with the top navigation + page container.
export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <TaskModalProvider>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <Outlet />
        </main>
        <CreateTaskModal />
      </TaskModalProvider>
    </div>
  )
}
