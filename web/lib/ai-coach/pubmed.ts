import type { PubMedArticle } from '@/types/ai-coach'
import type { ParsedIntent } from './intent'

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const RATE_LIMIT_DELAY = 350 // ~3 requests/second

let lastRequestTime = 0

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest))
  }
  
  lastRequestTime = Date.now()
  return fetch(url)
}

export async function searchPubMed(query: string, maxResults: number = 6): Promise<PubMedArticle[]> {
  try {
    // Step 1: Search for PMIDs
    const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=20&retmode=json&sort=relevance`
    
    const searchResponse = await rateLimitedFetch(searchUrl)
    const searchData = await searchResponse.json()
    
    const idList: string[] = searchData.esearchresult?.idlist || []
    
    if (idList.length === 0) {
      return []
    }
    
    // Step 2: Fetch article summaries + abstracts
    const summaryUrl = `${PUBMED_BASE_URL}/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`
    
    const summaryResponse = await rateLimitedFetch(summaryUrl)
    const summaryData = await summaryResponse.json()
    
    // Step 3: Fetch abstracts using efetch
    const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi?db=pubmed&id=${idList.join(',')}&retmode=xml`
    
    let abstractMap: Record<string, string> = {}
    try {
      const fetchResponse = await rateLimitedFetch(fetchUrl)
      const xmlText = await fetchResponse.text()
      abstractMap = parseAbstractsFromXML(xmlText)
    } catch (e) {
      console.warn('Could not fetch abstracts:', e)
    }
    
    const articles: PubMedArticle[] = []
    
    for (const id of idList) {
      const article = summaryData.result?.[id]
      if (!article) continue
      
      // Extract year from pubdate
      const pubDate = article.pubdate || article.epubdate || ''
      const yearMatch = pubDate.match(/\d{4}/)
      const year = yearMatch ? yearMatch[0] : ''
      
      // Extract journal
      const journal = article.source || article.fulljournalname || ''
      
      // Build title
      const title = article.title || 'Untitled'
      
      // Get abstract if available
      const abstract = abstractMap[id] || ''
      
      articles.push({
        id,
        pmid: id,
        title: cleanTitle(title),
        journal: journal.substring(0, 50),
        year,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        authors: article.authors?.slice(0, 3).map((a: any) => a.name) || [],
        abstract: abstract.substring(0, 500) // Truncate long abstracts
      })
    }
    
    // Score and rank by relevance to management/intervention
    const scoredArticles = articles.map(article => ({
      article,
      score: scoreRelevance(article)
    }))
    
    // Sort by score descending
    scoredArticles.sort((a, b) => b.score - a.score)
    
    // Return top N
    return scoredArticles.slice(0, maxResults).map(s => s.article)
  } catch (error) {
    console.error('PubMed search error:', error)
    return []
  }
}

function parseAbstractsFromXML(xml: string): Record<string, string> {
  const abstracts: Record<string, string> = {}
  
  // Simple regex parsing (production would use proper XML parser)
  const articleMatches = xml.matchAll(/<PubmedArticle>(.*?)<\/PubmedArticle>/gs)
  
  for (const match of articleMatches) {
    const articleXml = match[1]
    
    // Extract PMID
    const pmidMatch = articleXml.match(/<PMID[^>]*>(\d+)<\/PMID>/)
    const pmid = pmidMatch ? pmidMatch[1] : null
    
    if (!pmid) continue
    
    // Extract Abstract
    const abstractMatch = articleXml.match(/<AbstractText[^>]*>(.*?)<\/AbstractText>/s)
    if (abstractMatch) {
      // Clean HTML tags
      const abstractText = abstractMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      abstracts[pmid] = abstractText
    }
  }
  
  return abstracts
}

function scoreRelevance(article: PubMedArticle): number {
  let score = 0
  const searchText = `${article.title} ${article.abstract || ''}`.toLowerCase()
  
  // BOOST: Intervention/management keywords
  const interventionKeywords = [
    'intervention', 'treatment', 'therapy', 'support', 'accommodation',
    'education', 'classroom', 'parent-mediated', 'cbt', 'cognitive behavioral',
    'occupational therapy', 'sensory integration', 'social skills', 'training',
    'workplace adjustment', 'randomized', 'trial', 'rct', 'systematic review',
    'meta-analysis', 'evidence-based', 'practice', 'program', 'approach'
  ]
  
  for (const keyword of interventionKeywords) {
    if (searchText.includes(keyword)) {
      score += 2
    }
  }
  
  // PENALIZE: Non-management keywords
  const nonManagementKeywords = [
    'prevalence', 'incidence', 'genetics', 'genome', 'heritability',
    'neurobiology', 'pathophysiology', 'mechanism', 'etiology', 'gene'
  ]
  
  for (const keyword of nonManagementKeywords) {
    if (searchText.includes(keyword)) {
      score -= 1
    }
  }
  
  // BOOST: Recent systematic reviews/meta-analyses
  if (searchText.includes('systematic review') || searchText.includes('meta-analysis')) {
    score += 3
  }
  
  return score
}

function cleanTitle(title: string): string {
  return title.replace(/\.$/, '').trim()
}

export function buildPubMedQuery(question: string, intent: ParsedIntent, topic?: string): string {
  const keywords: string[] = []
  const questionLower = question.toLowerCase()
  
  // Determine if this is a management/support question
  const isManagementQuery = 
    intent.primary === 'management' ||
    intent.primary === 'school' ||
    intent.primary === 'workplace' ||
    questionLower.includes('manage') ||
    questionLower.includes('support') ||
    questionLower.includes('help') ||
    questionLower.includes('treatment') ||
    questionLower.includes('intervention')
  
  // Add core topic
  const termMap: Record<string, { condition: string[]; management: string[] }> = {
    autism: {
      condition: ['autism spectrum disorder', 'ASD'],
      management: [
        'parent-mediated intervention',
        'social communication intervention',
        'classroom support autism',
        'occupational therapy autism',
        'sensory integration',
        'workplace accommodation autism'
      ]
    },
    adhd: {
      condition: ['ADHD', 'attention deficit hyperactivity disorder'],
      management: [
        'behavioral intervention ADHD',
        'classroom management ADHD',
        'executive function training',
        'parent training ADHD',
        'workplace adjustment ADHD'
      ]
    },
    anxiety: {
      condition: ['anxiety disorder', 'GAD'],
      management: [
        'cognitive behavioral therapy anxiety',
        'exposure therapy',
        'anxiety management',
        'relaxation training'
      ]
    },
    depression: {
      condition: ['major depressive disorder', 'depression'],
      management: [
        'cognitive behavioral therapy depression',
        'behavioral activation',
        'psychotherapy depression'
      ]
    },
    breathing: {
      condition: ['breathing exercises', 'respiratory'],
      management: ['breathing technique', 'respiratory training', 'vagal tone']
    },
    sleep: {
      condition: ['insomnia', 'sleep disorder'],
      management: ['CBT-I', 'sleep hygiene', 'sleep intervention']
    },
    dyslexia: {
      condition: ['dyslexia', 'reading disorder'],
      management: [
        'reading intervention',
        'phonics instruction',
        'assistive technology dyslexia'
      ]
    }
  }
  
  // Match condition
  for (const [key, terms] of Object.entries(termMap)) {
    if (questionLower.includes(key) || topic?.toLowerCase() === key) {
      if (isManagementQuery && terms.management.length > 0) {
        // Use management-specific terms
        keywords.push(`(${terms.condition[0]})`)
        keywords.push(`(${terms.management.slice(0, 2).join(' OR ')})`)
      } else {
        // Use condition terms
        keywords.push(...terms.condition.slice(0, 2))
      }
      break
    }
  }
  
  // Add context-specific terms
  if (intent.primary === 'school' || questionLower.includes('school') || questionLower.includes('classroom')) {
    keywords.push('(classroom OR education OR school OR teacher)')
  }
  
  if (intent.primary === 'workplace' || questionLower.includes('work') || questionLower.includes('job')) {
    keywords.push('(workplace OR employment OR work OR job OR accommodation)')
  }
  
  if (questionLower.includes('parent') || questionLower.includes('family')) {
    keywords.push('(parent OR family OR caregiver)')
  }
  
  // Add age context
  if (questionLower.includes('child') || questionLower.includes('kid')) {
    keywords.push('(child OR pediatric OR adolescent)')
  }
  if (questionLower.includes('adult')) {
    keywords.push('adult')
  }
  
  // Build base query
  let query = keywords.slice(0, 5).join(' AND ')
  
  // Add publication type filters
  if (isManagementQuery) {
    // Prioritize intervention studies
    query += ' AND (intervention OR treatment OR therapy OR support OR management OR "randomized controlled trial" OR "systematic review" OR "meta-analysis" OR "clinical trial")'
  }
  
  // Add recency and quality filters
  query += ' AND (Review[PT] OR Meta-Analysis[PT] OR "Randomized Controlled Trial"[PT] OR "Systematic Review"[PT])'
  query += ' AND ("last 10 years"[PDat])'
  
  return query
}
