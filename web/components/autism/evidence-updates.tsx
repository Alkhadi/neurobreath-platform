'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EVIDENCE_LINKS, PUBMED_PRESETS } from '@/lib/autism/evidence-base'
import { ExternalLink, Loader2 } from 'lucide-react'
import type { PubMedArticle } from '@/types/autism'
import { toast } from 'sonner'

export function EvidenceUpdates() {
  const [pubmedResults, setPubmedResults] = useState<PubMedArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('')

  const fetchPubMed = async (query: string) => {
    setLoading(true)
    setSelectedPreset(query)
    try {
      const res = await fetch(`/api/autism/pubmed?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setPubmedResults(data.articles || [])
    } catch (e) {
      console.error('PubMed fetch error:', e)
      toast.error('Could not fetch PubMed', {
        description: 'Please try again in a moment.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="evidence" className="scroll-mt-24 py-16 md:py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Evidence</p>
          <h2 className="text-3xl font-bold text-gray-900">Latest evidence</h2>
          <p className="text-gray-600">
            UK guidance first (NICE/NHS/GOV.UK), plus US/EU links and PubMed research you can fetch on demand.
          </p>
        </div>

        <Tabs defaultValue="uk" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="uk">UK Guidance</TabsTrigger>
            <TabsTrigger value="us-eu">US / EU</TabsTrigger>
            <TabsTrigger value="pubmed">PubMed Research</TabsTrigger>
          </TabsList>

          <TabsContent value="uk" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">NICE Guidelines</h3>
              <div className="space-y-2">
                <a href={EVIDENCE_LINKS.NICE_CG170.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.NICE_CG170.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.NICE_CG128.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.NICE_CG128.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.NICE_CG142.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.NICE_CG142.title}</span>
                </a>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">GOV.UK & Education</h3>
              <div className="space-y-2">
                <a href={EVIDENCE_LINKS.GOV_PINS.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.GOV_PINS.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.SEND_CODE.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.SEND_CODE.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.EEF_SEND.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.EEF_SEND.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.AET.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.AET.title}</span>
                </a>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">NHS Resources</h3>
              <div className="space-y-2">
                <a href={EVIDENCE_LINKS.NHS_AUTISM.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.NHS_AUTISM.title}</span>
                </a>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="us-eu" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">United States (CDC & National)</h3>
              <div className="space-y-2">
                <a href={EVIDENCE_LINKS.CDC_DATA.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.CDC_DATA.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.CDC_PREVALENCE.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.CDC_PREVALENCE.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.AUTISM_SOCIETY.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.AUTISM_SOCIETY.title}</span>
                </a>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">European Union</h3>
              <div className="space-y-2">
                <a href={EVIDENCE_LINKS.AUTISM_EUROPE.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.AUTISM_EUROPE.title}</span>
                </a>
                <a href={EVIDENCE_LINKS.EASNIE.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{EVIDENCE_LINKS.EASNIE.title}</span>
                </a>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pubmed" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Search Peer-Reviewed Research</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a topic to find recent systematic reviews and intervention studies:
              </p>
              <div className="flex flex-wrap gap-2">
                {PUBMED_PRESETS.map(preset => (
                  <Button
                    key={preset.query}
                    size="sm"
                    variant={selectedPreset === preset.query ? 'default' : 'outline'}
                    onClick={() => fetchPubMed(preset.query)}
                    disabled={loading}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </Card>

            {loading && (
              <Card className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Searching PubMed...</p>
              </Card>
            )}

            {!loading && pubmedResults.length > 0 && (
              <div className="space-y-4">
                {pubmedResults.map(article => (
                  <Card key={article.pmid} className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {article.journal} {article.year && `(${article.year})`}
                    </p>
                    {article.authors.length > 0 && (
                      <p className="text-xs text-gray-500 mb-2">
                        {article.authors.join(', ')}
                      </p>
                    )}
                    {article.abstract && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">{article.abstract}</p>
                    )}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on PubMed (PMID: {article.pmid})
                    </a>
                  </Card>
                ))}
              </div>
            )}

            {!loading && pubmedResults.length === 0 && selectedPreset && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No results found. Try a different topic.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

