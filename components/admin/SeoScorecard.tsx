import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { SeoAnalysisResult } from '@/lib/seo-logic'

interface SeoScorecardProps {
    score: number
    results: SeoAnalysisResult[]
}

export function SeoScorecard({ score, results }: SeoScorecardProps) {
    if (results.length === 0) return null

    // Determine color based on score
    const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"
    const scoreBg = score >= 80 ? "bg-green-100" : score >= 50 ? "bg-yellow-100" : "bg-red-100"

    return (
        <div className="bg-white rounded-lg border p-4 space-y-4 h-full">
            {/* Header Score */}
            <div className="flex items-center justify-between pb-2 border-b">
                <h4 className="font-semibold text-gray-700">SEO Score</h4>
                <div className={cn("flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg", scoreBg, scoreColor)}>
                    {score}
                </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
                {results.map((res, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                {res.status === 'good' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {res.status === 'ok' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                {res.status === 'bad' && <XCircle className="h-4 w-4 text-red-500" />}
                                <span className={cn(
                                    "font-medium",
                                    res.status === 'good' ? "text-gray-700" : "text-gray-500"
                                )}>
                                    {res.text}
                                </span>
                            </div>
                            
                            {/* Length Indicator if applicable */}
                            {res.current !== undefined && (
                                <span className="text-xs text-gray-400 font-mono">
                                    {res.current}
                                    {res.max ? `/${res.max}` : res.min ? `/>${res.min}` : ''}
                                </span>
                            )}
                        </div>

                        {/* Visual Progress Bar (Custom Implementation) */}
                        {res.unit === 'chars' && res.max && (
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full transition-all duration-500", 
                                        (res.current || 0) > res.max ? "bg-red-500" : "bg-green-500"
                                    )}
                                    style={{ 
                                        width: `${Math.min(((res.current || 0) / res.max) * 100, 100)}%` 
                                    }} 
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}