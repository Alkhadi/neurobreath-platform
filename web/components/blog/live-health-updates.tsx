'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LiveHealthUpdates() {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date().toLocaleString('en-GB'))
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString('en-GB'))
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <Card id="health-updates" className="scroll-mt-20">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2">Live Health Updates · NHS UK</Badge>
            <CardTitle className="text-2xl">Current health alerts &amp; public health information</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Stay informed about current health issues, outbreaks, and public health guidance from the NHS 
              and UK Health Security Agency.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <p className="text-xs text-muted-foreground">
              Last updated: {mounted ? lastUpdated : 'Loading...'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Seasonal Guidance Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600">Seasonal</Badge>
                <span className="text-2xl">🦠</span>
              </div>
              <CardTitle className="text-lg mt-2">Flu Season Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Winter 2024/25: Flu vaccination is available on the NHS for eligible groups.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Wash hands regularly</li>
                <li>• Catch coughs and sneezes in tissues</li>
                <li>• Stay home if unwell</li>
              </ul>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href="https://www.nhs.uk/conditions/flu/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  NHS Flu Guidance
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-600">Vaccination</Badge>
                <span className="text-2xl">💉</span>
              </div>
              <CardTitle className="text-lg mt-2">Vaccination Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Stay up to date with recommended vaccinations for you and your family.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Flu vaccine (seasonal)</li>
                <li>• COVID-19 boosters (eligible groups)</li>
                <li>• Childhood immunisations</li>
              </ul>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href="https://www.nhs.uk/conditions/vaccinations/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  NHS Vaccinations
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-600">Respiratory</Badge>
                <span className="text-2xl">🫁</span>
              </div>
              <CardTitle className="text-lg mt-2">Respiratory Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                General guidance on managing respiratory conditions and preventing illness.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Good ventilation indoors</li>
                <li>• Regular exercise</li>
                <li>• Avoid smoking</li>
              </ul>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href="https://www.nhs.uk/conditions/respiratory-tract-infection/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  NHS Respiratory Health
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> This section provides general seasonal guidance and links to official NHS resources. 
            We do not display live case statistics as these can vary by source and may cause unnecessary alarm. 
            For the most up-to-date health information and local guidance, please visit{' '}
            <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              NHS.uk
            </a>{' '}
            or contact{' '}
            <a href="https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-use-111/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              NHS 111
            </a>.
          </AlertDescription>
        </Alert>

        {/* Official Links */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 text-sm">Official Resources</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-2" />
                NHS.uk
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.gov.uk/government/organisations/uk-health-security-agency" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-2" />
                UK Health Security Agency
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-2" />
                Office for National Statistics
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-use-111/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-2" />
                NHS 111 Service
              </a>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          <strong>Source:</strong> Information from NHS.uk, UK Health Security Agency, and Office for National Statistics. 
          For the most up-to-date guidance, visit the official sources linked above.
        </p>
      </CardContent>
    </Card>
  )
}


