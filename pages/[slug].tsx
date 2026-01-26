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
  hero_image?: MediaFile
  sections?: ContentSection[]
}

interface SiteData {
  name: string
  url: string
  allow_indexing?: boolean
  pages?: PageData[]
}

export default function DynamicPage({ page, site }: { page: PageData; site: SiteData }) {
  // Parse html_head and inject into document head (client-side only)
  useEffect(() => {
    if (page.html_head && typeof document !== 'undefined') {
      const temp = document.createElement('div');
      temp.innerHTML = page.html_head;
      
      Array.from(temp.children).forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute('data-injected-from-strapi-page', 'true');
        document.head.appendChild(clone);
      });
      
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
        <title>{page.seo_title || page.title}</title>
        <meta name="description" content={page.seo_description || ''} />
        <meta name="robots" content={site.allow_indexing ? 'index,follow' : 'noindex,nofollow'} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Playfair Display', serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0e0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 0;
          border-bottom: 2px solid #d4af37;
        }

        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #d4af37;
          text-decoration: none;
        }

        nav a {
          color: #e0e0e0;
          text-decoration: none;
          margin-left: 30px;
          transition: color 0.3s;
        }

        nav a:hover {
          color: #d4af37;
        }

        .hero {
          text-align: center;
          padding: 100px 20px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%);
          position: relative;
        }

        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.2;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero h1 {
          font-size: 56px;
          color: #d4af37;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .hero p {
          font-size: 20px;
          color: #e0e0e0;
          margin-bottom: 40px;
        }

        .content-section {
          padding: 80px 0;
        }

        .section-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
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
          font-size: 42px;
          color: #d4af37;
          margin-bottom: 30px;
        }

        .section-text p {
          font-size: 18px;
          line-height: 1.8;
          color: #b0b0b0;
          margin-bottom: 30px;
        }

        .section-image img {
          width: 100%;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #1a1a2e;
          padding: 15px 40px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        }

        footer {
          text-align: center;
          padding: 40px 0;
          border-top: 2px solid #d4af37;
          color: #888;
          margin-top: 80px;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px;
          }

          .section-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <header>
          <a href="/" className="logo">🎰 {site.name}</a>
          <nav>
            <a href="/">Home</a>
            {site.pages?.map((p, i) => (
              <a key={i} href={`/${p.slug}`}>{p.title}</a>
            ))}
          </nav>
        </header>

        <section className="hero">
          {page.hero_image?.url && (
            <div className="hero-image" style={{ backgroundImage: `url(${page.hero_image.url})` }} />
          )}
          <div className="hero-content">
            <h1>{page.hero_title || page.title}</h1>
            {page.hero_subtitle && <p>{page.hero_subtitle}</p>}
          </div>
        </section>

        {page.sections && page.sections.map((section, index) => (
          <section key={section.id || index} className="content-section">
            <div className={`section-inner ${section.layout || 'text-left'}`}>
              <div className="section-text">
                {section.heading && <h2>{section.heading}</h2>}
                {section.text && <div dangerouslySetInnerHTML={{ __html: section.text }} />}
                {section.cta_text && section.cta_link && (
                  <a href={section.cta_link} className="cta-button">{section.cta_text}</a>
                )}
              </div>
              {section.image?.url && (
                <div className="section-image">
                  <img src={section.image.url} alt={section.heading || 'Section image'} />
                </div>
              )}
            </div>
          </section>
        ))}

        <footer>
          <p>&copy; 2024 {site.name}. All rights reserved.</p>
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
        pages: data.pages
      }
    }
  }
}

