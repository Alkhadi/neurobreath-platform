'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EVIDENCE_LINKS, MYTHS_FACTS } from '@/lib/autism/evidence-base'
import { ExternalLink } from 'lucide-react'

export function ReferencesSection() {
  return (
    <section id="references" className="scroll-mt-24 py-16 md:py-20 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Safety & sources</p>
          <h2 className="text-3xl font-bold text-gray-900">References &amp; myths vs. facts</h2>
          <p className="text-gray-600">
            UK-first public guidance (NICE/NHS/GOV.UK), plus US/EU support links and clarity on common misconceptions.
          </p>
        </div>

        <Tabs defaultValue="references" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="references">References</TabsTrigger>
            <TabsTrigger value="myths">Myths vs. Facts</TabsTrigger>
          </TabsList>

          <TabsContent value="references">
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Curated Evidence Pack</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">UK (NHS / NICE / GOV.UK / Education)</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    {[
                      EVIDENCE_LINKS.NICE_CG170,
                      EVIDENCE_LINKS.NICE_CG128,
                      EVIDENCE_LINKS.NICE_CG142,
                      EVIDENCE_LINKS.GOV_PINS,
                      EVIDENCE_LINKS.SEND_CODE,
                      EVIDENCE_LINKS.EEF_SEND,
                      EVIDENCE_LINKS.AET,
                      EVIDENCE_LINKS.NHS_AUTISM
                    ].map((link, i) => (
                      <li key={i} className="pl-2">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                          {link.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {link.citation && <p className="text-xs text-gray-500 mt-1 ml-4">{link.citation}</p>}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">US (CDC & National Support)</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700" start={9}>
                    {[
                      EVIDENCE_LINKS.CDC_DATA,
                      EVIDENCE_LINKS.CDC_PREVALENCE,
                      EVIDENCE_LINKS.AUTISM_SOCIETY
                    ].map((link, i) => (
                      <li key={i} className="pl-2">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                          {link.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {link.citation && <p className="text-xs text-gray-500 mt-1 ml-4">{link.citation}</p>}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">EU</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700" start={12}>
                    {[
                      EVIDENCE_LINKS.AUTISM_EUROPE,
                      EVIDENCE_LINKS.EASNIE
                    ].map((link, i) => (
                      <li key={i} className="pl-2">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                          {link.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {link.citation && <p className="text-xs text-gray-500 mt-1 ml-4">{link.citation}</p>}
                      </li>
                    ))}
                  </ol>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                  All URLs verified December 2024 / January 2025. For PubMed peer-reviewed studies, see the "Latest Evidence" section above.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="myths">
            <div className="space-y-4">
              {MYTHS_FACTS.map((item, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                      MYTH
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-3">"{item.myth}"</p>
                      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                        <div className="flex items-start gap-2">
                          <div className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">
                            FACT
                          </div>
                          <p className="text-gray-900 text-sm">{item.fact}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.sources.map((source, j) => (
                          <a
                            key={j}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          >
                            Source: {source.type}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

