'use client'

import { Phone, MessageSquare, ExternalLink } from 'lucide-react'

export default function UrgentHelpPanel() {
  return (
    <details className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
      <summary className="cursor-pointer font-semibold text-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
        <Phone className="w-4 h-4" />
        Urgent help &amp; crisis support (UK-first)
      </summary>
      <div className="mt-4 space-y-3 text-sm">
        <div className="space-y-2">
          <p className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400 font-semibold shrink-0">999</span>
            <span>If you or someone else is in immediate danger: call 999.</span>
          </p>
          
          <p className="flex items-start gap-2">
            <Phone className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span>
              If you need urgent mental health help: use the{' '}
              <a
                href="https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                NHS urgent help guidance
                <ExternalLink className="w-3 h-3" />
              </a>
              {' '}and call NHS 111.
            </span>
          </p>
          
          <p className="flex items-start gap-2">
            <Phone className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span>
              To talk to someone now (UK &amp; ROI):{' '}
              <a
                href="https://www.samaritans.org/how-we-can-help/contact-samaritan/talk-us-phone/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Samaritans 116 123
              </a>
              .
            </span>
          </p>
          
          <p className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span>
              If you prefer text (UK):{' '}
              <a
                href="https://giveusashout.org/get-help/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                text SHOUT to 85258
              </a>
              .
            </span>
          </p>
          
          <p className="flex items-start gap-2 text-muted-foreground">
            <span className="font-semibold shrink-0">US:</span>
            <span>call/text 988; emergency 911.</span>
          </p>
        </div>
      </div>
    </details>
  )
}




