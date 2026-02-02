'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, Loader2, ImageIcon, Clock, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import { toast } from "sonner"

// Import your existing Modals
import { BlogFormDialog, BlogPostData } from "@/components/admin/BlogFormDialog"
import { DeletePostDialog } from "@/components/admin/DeletePostDialog"

export default function BlogPage() {
  // Initialize as empty array to prevent immediate .map() crash
  const [posts, setPosts] = useState<BlogPostData[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination State
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 })

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/blog?page=${page}`)

      if (res.ok) {
        const data = await res.json()

        // FIX: Extract the posts array specifically
        // If your API returns { posts: [...], pagination: {...} }
        const postsArray = data.posts || (Array.isArray(data) ? data : [])
        setPosts(postsArray)

        setPagination({
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0
        })
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("Failed to load posts")
      setPosts([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Refetch when page changes
  useEffect(() => { fetchPosts() }, [page])

  const handleCreate = () => {
    setEditingPost(null)
    setIsFormOpen(true)
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 bg-white min-h-screen text-slate-900">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Blog Management</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Manage SEO articles and news library.</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 shadow-sm font-semibold h-11">
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      {/* Article Table */}
      <Card className="border border-gray-100 shadow-none rounded-xl overflow-hidden bg-white">
        <CardHeader className="border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Article Library</CardTitle>
              <CardDescription className="text-xs font-medium text-gray-400 uppercase tracking-tight">
                {pagination.totalCount} Total Articles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 backdrop-blur-md">
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase pl-6">Preview</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Title</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></TableCell></TableRow>
                ) : Array.isArray(posts) && posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow key={post.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        {post.image ? (
                          <div className="relative h-10 w-16 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={post.image} alt="Thumbnail" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col max-w-[250px] lg:max-w-none"> {/* Expand max-width on large screens */}
                          <span className="text-sm font-bold text-gray-900 truncate lg:whitespace-normal lg:overflow-visible">
                            {post.title}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${post.isPublished ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${post.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(post)} className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteId(post.id!)} className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-gray-400 text-sm font-medium italic">
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination bar */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Page {page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="h-8 text-[10px] font-bold uppercase border-gray-200"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-8 text-[10px] font-bold uppercase border-gray-200 text-blue-600"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODALS */}
      <BlogFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        postToEdit={editingPost}
        onSuccess={fetchPosts}
      />
      <DeletePostDialog
        postId={deleteId}
        onClose={() => setDeleteId(null)}
        onSuccess={fetchPosts}
      />
    </div>
  )
}