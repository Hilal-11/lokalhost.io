import { getPageImage2, backgroundsource } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx.components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: PageProps<'/backgrounds/[[...slug]]'>) {
  const params = await props.params;
  const page = backgroundsource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <DocsPage toc={page.data.toc} full={page.data.full} 
        container={{
          className: "max-w-none lg:px-20",
        }}
        tableOfContent={{ enabled: false }}
        tableOfContentPopover={{ enabled: false }}
        >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody
          style={{ maxWidth: "none" }}
          className="max-w-none lg:pr-20"
        >
          <MDX
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(backgroundsource, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </div>
  );
}


export async function generateStaticParams() {
  return backgroundsource.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/backgrounds/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = backgroundsource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage2(page).url,
    },
  };
}
