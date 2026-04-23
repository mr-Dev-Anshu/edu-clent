"use client"

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Pencil, Settings, Trash2 } from 'lucide-react'
import { ClassRow } from '../types'

interface ClassActionsMenuProps {
  classData: ClassRow
  onEdit: (classData: ClassRow) => void
  onManage: (classData: ClassRow) => void
  onDelete: (classData: ClassRow) => void
}

export function ClassActionsMenu({
  classData,
  onEdit,
  onManage,
  onDelete,
}: ClassActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className='p-1.5 rounded hover:bg-slate-100 text-slate-500'
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className='absolute right-0 top-8 z-20 bg-white shadow-lg rounded-lg py-1 w-44 border border-slate-100'>
          <button
            onClick={() => { onEdit(classData); setOpen(false) }}
            className='flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-50 text-slate-700'
          >
            <Pencil size={14} /> Edit Class
          </button>
          <button
            onClick={() => { onManage(classData); setOpen(false) }}
            className='flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-50 text-slate-700'
          >
            <Settings size={14} /> Manage Sections
          </button>
          <hr className='my-1 border-slate-100' />
          <button
            onClick={() => { onDelete(classData); setOpen(false) }}
            className='flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600'
          >
            <Trash2 size={14} /> Delete Class
          </button>
        </div>
      )}
    </div>
  )
}