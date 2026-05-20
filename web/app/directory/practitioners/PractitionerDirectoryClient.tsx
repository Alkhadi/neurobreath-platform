'use client';

import * as React from 'react';

import { EducationalDisclaimer } from '@/components/shared/EducationalDisclaimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PRACTITIONER_LISTINGS,
  SUPPORT_AREAS,
  DELIVERY_MODES,
  FUNDING_OPTIONS,
  AGE_GROUPS,
  COUNTRIES,
  SUPPORT_TYPES,
} from '@/data/phase2/practitioner-directory';

type FilterState = {
  country: string;
  supportType: string;
  supportArea: string;
  deliveryMode: string;
  fundingOption: string;
  ageGroup: string;
  query: string;
};

const INITIAL: FilterState = {
  country: '',
  supportType: '',
  supportArea: '',
  deliveryMode: '',
  fundingOption: '',
  ageGroup: '',
  query: '',
};

export default function PractitionerDirectoryClient() {
  const [filters, setFilters] = React.useState<FilterState>(INITIAL);

  const filtered = React.useMemo(() => {
    return PRACTITIONER_LISTINGS.filter((p) => {
      if (p.verificationStatus !== 'verified') return false;
      if (filters.country && p.country !== filters.country) return false;
      if (filters.supportType && p.role.toLowerCase() !== filters.supportType.toLowerCase()) return false;
      if (filters.supportArea && !p.supportAreas.includes(filters.supportArea)) return false;
      if (filters.deliveryMode && !p.deliveryModes.includes(filters.deliveryMode)) return false;
      if (filters.fundingOption && !p.fundingOptions.includes(filters.fundingOption)) return false;
      if (filters.ageGroup && !p.ageGroups.includes(filters.ageGroup)) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const hay = [p.name, p.organisation, p.role, p.notes].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const update = (k: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-14 space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-wide text-slate-500">Signposting</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Practitioner Directory
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          A read-only directory of neurodiversity-aware practitioners. Listings
          must be independently checked before publication.
        </p>
      </header>

      <EducationalDisclaimer variant="directory" title="About this directory" />

      <section aria-labelledby="filters" className="space-y-3">
        <h2 id="filters" className="text-2xl font-semibold">
          Filters
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Search">
            <input
              type="search"
              value={filters.query}
              onChange={update('query')}
              placeholder="Name, organisation, role"
              className="nb-input"
            />
          </Field>
          <SelectField label="Country" value={filters.country} onChange={update('country')} options={COUNTRIES} />
          <SelectField label="Support type" value={filters.supportType} onChange={update('supportType')} options={SUPPORT_TYPES} />
          <SelectField label="Support area" value={filters.supportArea} onChange={update('supportArea')} options={SUPPORT_AREAS} />
          <SelectField label="Delivery" value={filters.deliveryMode} onChange={update('deliveryMode')} options={DELIVERY_MODES} />
          <SelectField label="Funding" value={filters.fundingOption} onChange={update('fundingOption')} options={FUNDING_OPTIONS} />
          <SelectField label="Age group" value={filters.ageGroup} onChange={update('ageGroup')} options={AGE_GROUPS} />
        </div>
      </section>

      <section aria-labelledby="listings" className="space-y-4">
        <h2 id="listings" className="text-2xl font-semibold">
          Listings
        </h2>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center space-y-3">
              <p className="font-medium">
                No verified listings are available yet for your filters.
              </p>
              <p className="text-sm text-muted-foreground">
                NeuroBreath does not list practitioners until credentials and
                registration with the relevant professional body have been
                checked. If you are a practitioner who would like to be
                considered, please contact us through the existing site
                channels.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p) => (
              <li key={p.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                    <CardDescription>
                      {p.role}
                      {p.organisation ? ` · ${p.organisation}` : ''}
                      {' · '}
                      {p.country}
                      {p.region ? ` (${p.region})` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Support areas:</span>{' '}
                      {p.supportAreas.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium">Delivery:</span>{' '}
                      {p.deliveryModes.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium">Funding:</span>{' '}
                      {p.fundingOptions.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium">Ages:</span>{' '}
                      {p.ageGroups.join(', ')}
                    </p>
                    {p.notes && <p className="text-muted-foreground">{p.notes}</p>}
                    <p className="text-xs text-muted-foreground">
                      Verification status: {p.verificationStatus}
                      {p.lastVerifiedAt ? ` · last checked ${p.lastVerifiedAt}` : ''}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {p.emergencyNotice}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <style>{`
        .nb-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        :is(.dark) .nb-input {
          background: rgb(15 23 42);
          border-color: rgb(30 41 59);
          color: white;
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm space-y-1">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={onChange} className="nb-input">
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}
