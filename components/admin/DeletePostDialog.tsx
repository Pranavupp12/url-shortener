'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface DeletePostDialogProps {
  postId: string | null
  onClose: () => void
  onSuccess: () => void
}

export function DeletePostDialog({ postId, onClose, onSuccess }: DeletePostDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!postId) return
    
    setLoading(true)
    const toastId = toast.loading("Deleting post...")

    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success("Post deleted", { id: toastId })
        onSuccess()
        onClose()
      } else {
        toast.error("Failed to delete", { id: toastId })
      }
    } catch (error) {
      toast.error("Error deleting post", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!postId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the blog post.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}