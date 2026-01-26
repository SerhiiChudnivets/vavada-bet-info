import React, { useEffect } from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'

interface MediaFile {
  id?: number
  name?: string
  url?: string
}

interface ContentSection {
  id?: number
  heading?: string
  text?: string
  image?: MediaFile
  cta_text?: string
  cta_link?: string
  layout?: string
}

interface PageData {
  title: string
  slug: string
  content?: string
  seo_title?: string
  seo_description?: string
  html_head?: string
  hero_title?: string
  hero_subtitle?: string
  hero_badge?: string
  hero_image?: MediaFile
  cta_text?: string
  cta_link?: string
  accent_color?: string
  tagline?: string
  features_list?: string
  footer_text?: string
  popup_text?: string
  sections?: ContentSection[]
}

interface SiteData {
  name: string
  url: string
  site_name?: string
  accent_color?: string
  footer_text?: string
  allow_indexing?: boolean
  pages?: PageData[]
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --background: 220 20% 10%;
    --foreground: 45 100% 95%;
    --card: 220 25% 12%;
    --primary: 45 100% 50%;
    --primary-foreground: 220 20% 10%;
    --secondary: 220 25% 18%;
    --muted: 220 20% 15%;
    --muted-foreground: 220 15% 60%;
    --border: 220 20% 20%;
    --radius: 0.5rem;
  }

  body {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: hsla(var(--card), 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid hsl(var(--border));
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .logo-icon {
    width: 2rem;
    height: 2rem;
    color: hsl(var(--primary));
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  nav {
    display: flex;
    gap: 1.5rem;
  }

  nav a {
    color: hsl(var(--muted-foreground));
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  nav a:hover {
    color: hsl(var(--primary));
  }

  .hero-section {
    position: relative;
    padding: 4rem 0;
    background: linear-gradient(180deg, hsla(var(--secondary), 0.5) 0%, hsl(var(--background)) 100%);
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.15;
    background-size: cover;
    background-position: center;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-block;
    background: hsla(var(--primary), 0.2);
    color: hsl(var(--primary));
    padding: 0.25rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: hsl(var(--primary));
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .btn {
    padding: 0.75rem 2rem;
    font-weight: 600;
    border-radius: calc(var(--radius) * 2);
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    font-size: 1rem;
    text-decoration: none;
    display: inline-block;
  }

  .btn-primary {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .content-section {
    padding: 4rem 0;
  }

  .section-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .section-inner.text-center {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .section-inner.text-right {
    direction: rtl;
  }

  .section-inner.text-right > * {
    direction: ltr;
  }

  .section-inner.full-width {
    grid-template-columns: 1fr;
  }

  .section-text h2 {
    font-size: 2rem;
    color: hsl(var(--primary));
    margin-bottom: 1.5rem;
    font-weight: 700;
  }

  .section-text p, .section-text div {
    font-size: 1.125rem;
    line-height: 1.8;
    color: hsl(var(--muted-foreground));
    margin-bottom: 1.5rem;
  }

  .section-image img {
    width: 100%;
    border-radius: var(--radius);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  }

  .page-content {
    padding: 4rem 0;
    max-width: 900px;
    margin: 0 auto;
  }

  .page-content h1, .page-content h2, .page-content h3, .page-content h4 {
    color: hsl(var(--primary));
    margin: 2rem 0 1rem;
    font-weight: 700;
  }

  .page-content h1 { font-size: 2.5rem; }
  .page-content h2 { font-size: 2rem; }
  .page-content h3 { font-size: 1.5rem; }

  .page-content p {
    margin-bottom: 1.5rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.8;
  }

  .page-content a {
    color: hsl(var(--primary));
    text-decoration: underline;
  }

  .page-content ul, .page-content ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
    color: hsl(var(--muted-foreground));
  }

  .page-content li {
    margin-bottom: 0.5rem;
  }

  .page-content blockquote {
    border-left: 4px solid hsl(var(--primary));
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: hsl(var(--muted-foreground));
  }

  footer {
    background: hsl(var(--card));
    border-top: 1px solid hsl(var(--border));
    padding: 2rem 0;
    text-align: center;
    margin-top: 4rem;
  }

  .footer-text {
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .section-inner {
      grid-template-columns: 1fr;
    }

    nav {
      display: none;
    }
  }
`;

export default function DynamicPage({ page, site }: { page: PageData; site: SiteData }) {
  const siteName = site.site_name || site.name

  // Parse html_head and inject into document head (client-side only)
  useEffect(() => {
    if (page.html_head && typeof document !== 'undefined') {
      // Create a temporary div to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = page.html_head;
      
      // Move all elements to document.head
      Array.from(temp.children).forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        // Add identifier to track our injected elements
        clone.setAttribute('data-injected-from-strapi-page', 'true');
        document.head.appendChild(clone);
      });
      
      // Cleanup on unmount
      return () => {
        document.querySelectorAll('[data-injected-from-strapi-page="true"]').forEach((el) => {
          el.remove();
        });
      };
    }
  }, [page.html_head]);

  return (
    <>
      <Head>
        <title>{page.seo_title || page.title} | {siteName}</title>
        <meta name="description" content={page.seo_description || ''} />
        <meta name="robots" content={site.allow_indexing ? 'index,follow' : 'noindex,nofollow'} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div>
        <header>
          <div className="container">
            <div className="header-content">
              <a href="/" className="logo">
                <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                <span className="logo-text">{siteName}</span>
              </a>
              <nav>
                <a href="/">Home</a>
                {site.pages?.map((p, i) => (
                  <a key={i} href={`/${p.slug}`}>{p.title}</a>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <section className="hero-section">
          {page.hero_image?.url && (
            <div className="hero-image" style={{ backgroundImage: `url(${page.hero_image.url})` }} />
          )}
          <div className="container">
            <div className="hero-content">
              {page.hero_badge && <span className="hero-badge">{page.hero_badge}</span>}
              <h1 className="hero-title">{page.hero_title || page.title}</h1>
              {page.hero_subtitle && <p className="hero-subtitle">{page.hero_subtitle}</p>}
              {page.cta_text && page.cta_link && (
                <a href={page.cta_link} className="btn btn-primary">{page.cta_text}</a>
              )}
            </div>
          </div>
        </section>

        {page.content && (
          <div className="container">
            <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        )}

        {page.sections && page.sections.map((section, index) => (
          <section key={section.id || index} className="content-section">
            <div className="container">
              <div className={`section-inner ${section.layout || 'text-left'}`}>
                <div className="section-text">
                  {section.heading && <h2>{section.heading}</h2>}
                  {section.text && <div dangerouslySetInnerHTML={{ __html: section.text }} />}
                  {section.cta_text && section.cta_link && (
                    <a href={section.cta_link} className="btn btn-primary">{section.cta_text}</a>
                  )}
                </div>
                {section.image?.url && (
                  <div className="section-image">
                    <img src={section.image.url} alt={section.heading || 'Section image'} />
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        <footer>
          <div className="container">
            <p className="footer-text">
              {page.footer_text || site.footer_text || `© 2024 ${siteName}. All rights reserved.`}
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), 'data.json')
  const data: SiteData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  
  const paths = data.pages?.map(page => ({
    params: { slug: page.slug }
  })) || []

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const dataPath = path.join(process.cwd(), 'data.json')
  const data: SiteData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  
  const page = data.pages?.find(p => p.slug === params?.slug)

  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      page,
      site: {
        name: data.name,
        url: data.url,
        site_name: data.site_name,
        accent_color: data.accent_color,
        footer_text: data.footer_text,
        pages: data.pages
      }
    }
  }
}

