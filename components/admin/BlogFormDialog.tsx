'use client'

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Trash2, X, Sparkles } from 'lucide-react' // Added Sparkles icon
import { toast } from "sonner"
import Image from 'next/image'
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { uploadEditorImage } from '@/lib/cloudinary-helper'
import { analyzeSeo } from '@/lib/seo-logic' 
import { SeoScorecard } from '@/components/admin/SeoScorecard'

// ... (Keep existing Type Definition & Initial State) ...
export type BlogPostData = {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  categories: string[]
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  focusKeyword: string
  isPublished: boolean
  publishedAt?: string | Date; 
  updatedAt?: string | Date;
}

const initialFormState: BlogPostData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  image: '',
  categories: [],
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  focusKeyword: '',
  isPublished: false
}

interface BlogFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postToEdit: BlogPostData | null
  onSuccess: () => void
}

export function BlogFormDialog({ open, onOpenChange, postToEdit, onSuccess }: BlogFormDialogProps) {
  const [formData, setFormData] = useState<BlogPostData>(initialFormState)
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')

  useEffect(() => {
    if (open) {
      if (postToEdit) {
        setFormData({ 
            ...postToEdit, 
            image: postToEdit.image || '',
            categories: postToEdit.categories || [] 
        })
      } else {
        setFormData(initialFormState)
      }
    }
  }, [open, postToEdit])

  // --- NEW: LIVE SEO ANALYSIS ---
  // Memoize the result so it updates whenever dependencies change
  const seoAnalysis = useMemo(() => {
    return analyzeSeo(
        formData.content,
        formData.focusKeyword,
        formData.title,
        formData.metaTitle,
        formData.metaDescription,
        formData.metaKeywords
    )
  }, [
    formData.content, 
    formData.focusKeyword, 
    formData.title, 
    formData.metaTitle, 
    formData.metaDescription, 
    formData.metaKeywords
  ])
  // ------------------------------

  // ... (Keep existing Handlers: handleTitleChange, handleCategoryKeyDown, etc.) ...
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    if (!postToEdit) {
      const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
      setFormData(prev => ({ ...prev, title, slug }))
    } else {
      setFormData(prev => ({ ...prev, title }))
    }
  }

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      
      // FIX: Trim the input immediately
      const newCat = categoryInput.trim() 

      // Check if it exists (case-insensitive check is even better)
      const exists = formData.categories.some(
         c => c.toLowerCase() === newCat.toLowerCase()
      )

      if (newCat && !exists) {
        setFormData(prev => ({ ...prev, categories: [...prev.categories, newCat] }))
      }
      setCategoryInput('')
    }
  }

  const removeCategory = (catToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== catToRemove)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading("Uploading banner...")

    try {
      const formPayload = new FormData()
      formPayload.append('file', file)
      const res = await uploadEditorImage(formPayload)

      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, image: res.url || '' }))
        toast.success("Banner uploaded", { id: toastId })
      } else {
        toast.error("Upload failed", { id: toastId })
      }
    } catch (error) {
      toast.error("Error uploading", { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading(postToEdit ? "Updating..." : "Creating...")

    try {
      const url = postToEdit ? `/api/admin/blog/${postToEdit.id}` : '/api/admin/blog'
      const method = postToEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(postToEdit ? "Post updated" : "Post created", { id: toastId })
        onSuccess()
        onOpenChange(false)
      } else {
        const data = await res.json()
        toast.error(data.error || "Operation failed", { id: toastId })
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden">
        
        <DialogHeader className="px-6 py-4 border-b bg-white z-10">
          <DialogTitle>{postToEdit ? "Edit Blog Post" : "Create New Post"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/50">
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            
            {/* ... (Keep Title/Slug, Categories, Image, Content, Excerpt fields exactly as before) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Post Title</Label>
                <Input value={formData.title} onChange={handleTitleChange} required placeholder="Post title..." className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="bg-white p-3 border rounded-md shadow-sm">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.categories.map((cat, i) => (
                    <Badge key={i} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                      {cat}
                      {/* FIX: Wrapped X in a button to ensure click registers properly */}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.categories.length === 0 && <span className="text-gray-400 text-sm">No categories added yet.</span>}
                </div>
                <Input 
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder="Type category and press Enter..." 
                  className="border-none shadow-none focus-visible:ring-0 px-0 h-auto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-white hover:bg-gray-50 transition-colors">
                {formData.image ? (
                  <div className="relative w-full h-64 rounded-md overflow-hidden group shadow-sm">
                    <Image src={formData.image} alt="Banner" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="sm" onClick={() => setFormData({...formData, image: ''})}>
                        <Trash2 className="h-4 w-4 mr-2" /> Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    {isUploading ? (
                      <div className="flex flex-col items-center text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-sm">Uploading to Cloud...</p>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full">
                        <div className="bg-blue-50 p-4 rounded-full shadow-sm mb-3"><Upload className="h-6 w-6 text-blue-600" /></div>
                        <p className="text-sm font-medium text-gray-700">Click to upload banner</p>
                        <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x630px</p>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <div className="bg-white rounded-md shadow-sm border">
                 <RichTextEditor value={formData.content} onChange={(html) => setFormData({...formData, content: html})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Short summary..." className="bg-white" />
            </div>

            {/* --- UPDATED SEO SECTION --- */}
            <div className="p-6 bg-white rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-gray-800">SEO Intelligence</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-purple-700 font-semibold">Focus Keyword</Label>
                            <Input 
                                value={formData.focusKeyword} 
                                onChange={e => setFormData({...formData, focusKeyword: e.target.value})} 
                                placeholder="e.g. digital marketing"
                                className="border-purple-200 focus-visible:ring-purple-500 bg-purple-50/30"
                            />
                            <p className="text-xs text-gray-500">Pick the main phrase you want this post to rank for.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Keywords (Comma separated)</Label>
                                <Input value={formData.metaKeywords} onChange={e => setFormData({...formData, metaKeywords: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Meta Description</Label>
                            <Textarea 
                                className="h-24" 
                                value={formData.metaDescription} 
                                onChange={e => setFormData({...formData, metaDescription: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* Right Column: Live Scorecard */}
                    <div className="lg:col-span-1">
                        {formData.focusKeyword ? (
                            <SeoScorecard 
                                score={seoAnalysis.score} 
                                results={seoAnalysis.results} 
                            />
                        ) : (
                            <div className="h-full border border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center text-gray-400 bg-gray-50">
                                <Sparkles className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">Enter a Focus Keyword to see your SEO Analysis score.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            
            <div className="h-8"></div>
          </form>
        </div>

        <div className="border-t bg-white px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Switch checked={formData.isPublished} onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})} />
            <Label className="text-sm font-medium text-gray-700">Publish Immediately</Label>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" form="blog-form" className="bg-blue-600 hover:bg-blue-700 min-w-[140px]" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {postToEdit ? "Save Changes" : "Create Post"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}