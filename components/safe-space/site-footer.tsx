import { Wordmark } from '@/components/safe-space/logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-5xl px-5 py-10">
        <Wordmark showOrg />
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">
          NeuroPathway Safe Space is designed to help children express their voice and
          identify support needs earlier. It does not diagnose, provide emergency
          assistance or replace safeguarding, medical, mental-health or professional
          services.
        </p>
        <div className="mt-6 rounded-2xl border-2 border-accent/50 bg-accent/20 p-4 text-sm leading-relaxed text-accent-foreground">
          If you or someone else is in immediate danger, call 999 or ask a trusted adult
          for help. Safe Space is not an emergency service.
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Safe Space is the child-facing part of the NeuroPathway ecosystem, developed
          under Social Innovation CIC. This is a demonstration prototype using fictional
          information only.
        </p>
      </div>
    </footer>
  )
}
