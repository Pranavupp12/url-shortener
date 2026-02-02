'use client'

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce"; 

interface BlogSidebarProps {
  categories: string[];
}

export function BlogSidebar({ categories }: BlogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';

  // Initialize state directly from URL to prevent "flicker" clearing
  const [text, setText] = useState(currentSearch);
  const [query] = useDebounce(text, 500); 

  // --- SYNC 1: Keep Input Box Updated if URL Changes Externally ---
  // (e.g. User clicks Back button, or "Clear All")
  useEffect(() => {
    if (currentSearch !== text) {
       setText(currentSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearch]); 

  // --- SYNC 2: Push Changes to URL ---
  useEffect(() => {
    // Logic: Only update URL if the DEBOUNCED query is different from URL
    if (query === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    
    // Always reset to Page 1 on search change
    params.delete('page');

    router.push(`/blog?${params.toString()}`, { scroll: false });
  }, [query, router, searchParams, currentSearch]);


  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.delete('page'); // Reset page

    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="hidden lg:flex flex-col space-y-8 w-64 shrink-0 sticky top-24 h-fit">
      
      {/* Search Box */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search article..." 
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
          {text && (
            <button 
                onClick={() => setText('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide">Browse Categories</h4>
            {(activeCategory !== 'All' || text) && (
                <button 
                    onClick={() => {
                      setText('');
                      router.push('/blog'); 
                    }}
                    className="text-[10px] text-red-500 hover:underline font-medium"
                >
                    Clear All
                </button>
            )}
        </div>

        <nav className="flex flex-col space-y-1">
          {categories.map((cat) => {
             const isActive = activeCategory === cat || (cat === 'All' && !activeCategory);
             
             return (
                <button 
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize flex justify-between items-center ${
                    isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </button>
             );
          })}
        </nav>
      </div>
    </aside>
  );
}