import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { ShareButtons } from "@/components/blog/share-buttons";
import { JsonLd } from "@/components/ui/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { sentIssues, getIssue } from "@/lib/newsletter-archive";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return sentIssues.map((issue) => ({ issue: issue.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ issue: string }>;
}): Promise<Metadata> {
  const { issue: slug } = await params;
  const issue = getIssue(slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.preheader,
    alternates: { canonical: issue.permalink },
    openGraph: {
      type: "article",
      title: issue.title,
      description: issue.preheader,
      url: issue.permalink,
      publishedTime: issue.date,
    },
    twitter: {
      card: "summary_large_image",
      title: issue.title,
      description: issue.preheader,
    },
  };
}

/**
 * One sent edition, on the open web.
 *
 * The HTML is the compiled markdown the subscribers received — same source,
 * one file, no second version to keep in sync. Two consequences worth knowing:
 *
 * - Links inside carry the email's UTM tags and the production domain. The
 *   domain part is the known "dominio a fuego" debt (see ESTADO.md); the UTMs
 *   are left as-is on purpose, so web reads of an edition are distinguishable
 *   from actual email clicks in whatever reads those tags.
 * - The body renders through `Prose` with dangerouslySetInnerHTML. That is the
 *   same trust level as an MDX post — the content is versioned in this repo —
 *   and the same mechanism the email send itself uses.
 */
export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ issue: string }>;
}) {
  const { issue: slug } = await params;
  const issue = getIssue(slug);
  if (!issue) notFound();

  const fullUrl = `${siteConfig.url}${issue.permalink}`;

  return (
    <Container className="py-12">
      <JsonLd
        data={[
          // "nota" → plain Article: honest for an emailed edition on the web.
          articleJsonLd({
            title: issue.title,
            description: issue.preheader,
            date: issue.date,
            formato: "nota",
            tags: [],
            permalink: issue.permalink,
            metadata: {},
          }),
          breadcrumbJsonLd([
            { name: "Newsletter", path: "/newsletter" },
            { name: issue.title, path: issue.permalink },
          ]),
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="Migas" className="font-mono text-xs text-faint">
          <Link
            href="/newsletter"
            className="text-accent-ink hover:underline"
          >
            Newsletter
          </Link>
          <span aria-hidden> / </span>
          <span>{formatDate(issue.date)}</span>
        </nav>

        <header className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
            Edición de la newsletter
          </p>
          <h1 className="headline mt-3 text-4xl text-fg text-balance sm:text-5xl">
            {issue.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {issue.preheader}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5">
            <span className="font-mono text-xs text-fg">
              {siteConfig.author.name}
            </span>
            <span aria-hidden className="hidden text-faint sm:inline">
              ·
            </span>
            <time
              dateTime={issue.date}
              className="font-mono text-xs text-faint"
            >
              {formatDate(issue.date)}
            </time>
          </div>
        </header>

        <div className="mt-10">
          <Prose>
            {/* The edition as subscribers read it — see the comment above for
                why this HTML is trusted and why its links look the way they do. */}
            <div dangerouslySetInnerHTML={{ __html: issue.html }} />
          </Prose>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
            Lo próximo, en tu buzón
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            Esta edición ya se envió. La siguiente llega primero a los
            suscriptores —{" "}
            <Link
              href="/newsletter#suscribirse"
              className="text-accent-ink hover:underline"
            >
              apúntate en el archivo
            </Link>
            .
          </p>
          <div className="mt-6">
            <ShareButtons url={fullUrl} title={issue.title} />
          </div>
        </div>
      </div>
    </Container>
  );
}
