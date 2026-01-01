'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { skills } from '@/lib/autism/skills-data'
import { SkillCard } from './skill-card'
import { Search } from 'lucide-react'

export function SkillsLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Extract all unique tags from skills
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    skills.forEach(skill => {
      skill.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filtered = skills.filter(skill => {
    const matchesSearch = searchTerm === '' ||
      skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.whyItHelps.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => skill.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  return (
    <section id="skills" className="scroll-mt-24 py-16 md:py-20 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Strategies</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Skills library</h2>
              <p className="text-gray-600">Evidence-based supports with steps, pitfalls, and age adaptations.</p>
            </div>
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{skills.length}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm mb-6 space-y-4 border">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tags - Always Visible */}
          <div>
            <p className="text-sm font-semibold mb-3">Filter by type:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedTags([])}
                className="mt-3"
              >
                Clear filters ({selectedTags.length})
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No skills found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  )
}

