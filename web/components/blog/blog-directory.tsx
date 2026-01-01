'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  topics: string[]
  audience: string[]
  url: string
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Making Classrooms Autism-Friendly',
    excerpt: 'Lesson scaffolds, sensory zoning, and predictable routines aligned with UK SEND Code of Practice.',
    topics: ['autism'],
    audience: ['teachers', 'parents'],
    url: '/autism',
  },
  {
    id: '2',
    title: 'ADHD Homework Gameplans',
    excerpt: 'Pocket timers, brain breaks, and printable planners referencing NICE NG87.',
    topics: ['adhd'],
    audience: ['parents', 'young-people'],
    url: '/adhd',
  },
  {
    id: '3',
    title: 'Managing Bipolar at Work',
    excerpt: 'Reasonable adjustments, wellness action plans, and disclosure scripts for UK Equality Act compliance.',
    topics: ['mood'],
    audience: ['adults', 'workplace'],
    url: '/conditions/bipolar',
  },
  {
    id: '4',
    title: 'Breathing Exercises for Regulation',
    excerpt: '4-7-8, coherent breathing, and playful visuals for neurodivergent learners.',
    topics: ['breathing'],
    audience: ['parents', 'young-people', 'adults'],
    url: '/breathing/techniques',
  },
  {
    id: '5',
    title: 'Dyslexia-Friendly Classrooms',
    excerpt: 'Chunked reading, overlays, and assistive tech signposting with BDA alignment.',
    topics: ['dyslexia'],
    audience: ['teachers'],
    url: '/dyslexia-reading-training',
  },
  {
    id: '6',
    title: 'Teen Sleep Reset',
    excerpt: 'Chronotype-aware routines, CBT-I micro habits, and low-light cues.',
    topics: ['sleep'],
    audience: ['young-people', 'parents'],
    url: '/sleep',
  },
  {
    id: '7',
    title: 'Mood Boost Micro-Actions',
    excerpt: 'Behavioural activation checklists plus printable mood trackers.',
    topics: ['mood', 'depression'],
    audience: ['young-people', 'adults'],
    url: '/tools/mood-tools',
  },
  {
    id: '8',
    title: 'Stress First Aid Kit',
    excerpt: 'Grounding cues, breath ladders, and workplace conversation starters.',
    topics: ['stress'],
    audience: ['parents', 'workplace'],
    url: '/stress',
  },
  {
    id: '9',
    title: 'Mindfulness Micro-Practices',
    excerpt: '2-minute classroom scripts and sensory walks referencing MindUP and NHS resources.',
    topics: ['mindfulness'],
    audience: ['teachers', 'parents'],
    url: '/breathing/mindfulness',
  },
  {
    id: '10',
    title: 'Anxiety Management Tools',
    excerpt: 'Evidence-based techniques for managing general anxiety and panic symptoms.',
    topics: ['anxiety'],
    audience: ['young-people', 'adults', 'parents'],
    url: '/anxiety',
  },
]

const TOPICS = [
  { id: 'autism', label: 'Autism' },
  { id: 'adhd', label: 'ADHD' },
  { id: 'dyslexia', label: 'Dyslexia' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'depression', label: 'Depression' },
  { id: 'stress', label: 'Stress' },
  { id: 'mindfulness', label: 'Mindfulness' },
  { id: 'mood', label: 'Mood' },
  { id: 'anxiety', label: 'Anxiety' },
]

const AUDIENCES = [
  { id: 'parents', label: 'Parents' },
  { id: 'young-people', label: 'Young people' },
  { id: 'teachers', label: 'Teachers/SENCO' },
  { id: 'adults', label: 'Adults' },
  { id: 'workplace', label: 'Workplace' },
]

export default function BlogDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = `${post.title} ${post.excerpt}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Topic filter
      if (selectedTopics.length > 0) {
        if (!post.topics.some(topic => selectedTopics.includes(topic))) return false
      }

      // Audience filter
      if (selectedAudiences.length > 0) {
        if (!post.audience.some(aud => selectedAudiences.includes(aud))) return false
      }

      return true
    })
  }, [searchQuery, selectedTopics, selectedAudiences])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const toggleAudience = (audienceId: string) => {
    setSelectedAudiences(prev =>
      prev.includes(audienceId)
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTopics([])
    setSelectedAudiences([])
  }

  return (
    <Card id="blog-directory" className="scroll-mt-20">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">AI-assisted blog insights</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Articles combine lived experience, educator input, and AI-assisted literature scans 
              (Google Scholar + PubMed) to stay current without overwhelming readers.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <label htmlFor="blog-search-input" className="sr-only">
              Search blog posts
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="blog-search-input"
              name="search"
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search blog posts"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <Card className="bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filters</CardTitle>
              {(selectedTopics.length > 0 || selectedAudiences.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Topic Filters */}
            <div>
              <p className="text-sm font-semibold mb-2 block">Topics</p>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(topic => (
                  <div key={topic.id} className="flex items-center">
                    <Checkbox
                      id={`topic-${topic.id}`}
                      name={`topic-${topic.id}`}
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() => toggleTopic(topic.id)}
                    />
                    <Label
                      htmlFor={`topic-${topic.id}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {topic.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Filters */}
            <div>
              <p className="text-sm font-semibold mb-2 block">Audience</p>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map(audience => (
                  <div key={audience.id} className="flex items-center">
                    <Checkbox
                      id={`audience-${audience.id}`}
                      name={`audience-${audience.id}`}
                      checked={selectedAudiences.includes(audience.id)}
                      onCheckedChange={() => toggleAudience(audience.id)}
                    />
                    <Label
                      htmlFor={`audience-${audience.id}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {audience.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map(post => (
              <Link key={post.id} href={post.url}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.topics.map(topic => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {TOPICS.find(t => t.id === topic)?.label || topic}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For: {post.audience.map(aud =>
                        AUDIENCES.find(a => a.id === aud)?.label || aud
                      ).join(', ')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts match your filters.</p>
            <button
              onClick={clearFilters}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


