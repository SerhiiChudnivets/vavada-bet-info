import React, { useState, useEffect } from 'react'
import Head from 'next/head'

interface MediaFile {
  id?: number
  name?: string
  url?: string
  formats?: any
}

interface Slot {
  id?: number
  Name?: string
  logo?: MediaFile | MediaFile[] | string
  link?: string
}

interface SubmenuItem {
  id?: number
  label: string
  url: string
  open_in_new_tab?: boolean
}

interface MenuItem {
  id?: number
  label: string
  url: string
  open_in_new_tab?: boolean
  submenu?: SubmenuItem[]
}

interface CasinoData {
  // Базові поля
  name: string
  html_head?: string
  url: string
  template?: string
  language_code: string
  allow_indexing: boolean
  redirect_404s_to_homepage: boolean
  use_www_version: boolean
  
  // Уніфіковані поля шаблонів
  site_name?: string
  hero_title?: string
  hero_subtitle?: string
  hero_badge?: string
  cta_text?: string
  logo_url?: string
  accent_color?: string
  tagline?: string
  features_list?: string
  footer_text?: string
  popup_text?: string
  
  // Колірні теми
  main_background?: string
  secondary_background?: string
  button_background?: string
  button_text?: string
  text_color?: string
  color_highlight_text?: string
  
  // Rich text content
  content?: string
  
  // Repeatable components
  Slots?: Slot[]
  header_menu?: MenuItem[]
  footer_menu?: MenuItem[]
  
  // Metadata
  _generated_at?: string
  _version?: string
  
  // Allow any other fields
  [key: string]: any
}

export default function ModernCasino() {
  const data: CasinoData = require('../data.json')
  const accentColor = data.accent_color || '#00d4ff'
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)


  // Отримуємо кольори з data або використовуємо дефолтні
  const mainBackground = data.main_background || '#0a0a14' // default dark blue
  const secondaryBackground = data.secondary_background || '#1a1a2e' // default darker blue
  const buttonBackground = data.button_background || '#00d4ff' // default amber
  const buttonText = data.button_text || '#ffffff' // default dark
  const textColor = data.text_color || '#e0e0e0' // default light
  const colorHighlightText = data.color_highlight_text || '#00d4ff' // default amber


  // Функція для заміни змінних у content
  const replaceVariables = (content: string): string => {
    if (!content) return content
    
    let result = content
    const variableRegex = /\{\{([^}]+)\}\}/g
    
    result = result.replace(variableRegex, (match, variableName) => {
      const trimmedName = variableName.trim()
      if (data[trimmedName] !== undefined && data[trimmedName] !== null) {
        return String(data[trimmedName])
      }
      return match
    })
    
    return result
  }

  
  // Генеруємо динамічні стилі з кольорами
  const dynamicStyles = `
    :root {
      --background: ${mainBackground};
      --foreground: ${textColor};
      --card: ${secondaryBackground};
      --primary: ${colorHighlightText};
      --primary-foreground: ${buttonText};
      --secondary: ${secondaryBackground};
      --muted: ${mainBackground};
      --muted-foreground: ${textColor}cc; /* with opacity */
      --border: ${secondaryBackground}33; /* with opacity */
      --radius: 0.5rem;
      --button-bg: ${buttonBackground};
      --button-text: ${buttonText};
    }
  `;

const processedContent = data.content ? replaceVariables(data.content) : ''

  // Parse html_head and inject into document head (client-side only)
  useEffect(() => {
    if (data.html_head && typeof document !== 'undefined') {
      // Create a temporary div to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = data.html_head;
      
      // Move all elements to document.head
      Array.from(temp.children).forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        // Add identifier to track our injected elements
        clone.setAttribute('data-injected-from-strapi', 'true');
        document.head.appendChild(clone);
      });
      
      // Cleanup on unmount
      return () => {
        document.querySelectorAll('[data-injected-from-strapi="true"]').forEach((el) => {
          el.remove();
        });
      };
    }
  }, [data.html_head]);

  return (
    <>
      <Head>
        <title>{data.site_name || data.name}</title>
        <meta name="robots" content={data.allow_indexing ? 'index,follow' : 'noindex,nofollow'} />
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
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0a0e27;
          color: #ffffff;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        header {
          padding: 25px 0;
          background: rgba(10, 14, 39, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid ${accentColor}33;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, ${accentColor}, #ff00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        nav {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .menu-item {
          position: relative;
        }

        .menu-item > a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .menu-item > a:hover {
          color: ${accentColor};
        }

        .submenu {
          position: absolute;
          top: 100%;
          left: 0;
          background: #0a0a1a;
          border: 1px solid ${accentColor};
          border-radius: 12px;
          padding: 10px 0;
          min-width: 200px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        }

        .menu-item:hover .submenu,
        .submenu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .submenu a {
          display: block;
          color: #ffffff;
          text-decoration: none;
          padding: 10px 20px;
          transition: all 0.3s;
        }

        .submenu a:hover {
          background: rgba(0, 212, 255, 0.1);
          color: ${accentColor};
          padding-left: 25px;
        }

        .menu-arrow {
          font-size: 10px;
          transition: transform 0.3s;
        }

        .menu-item:hover .menu-arrow {
          transform: rotate(180deg);
        }

        footer nav {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 15px;
        }

        footer nav a {
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        footer nav a:hover {
          color: ${accentColor};
        }


        .hero {
          text-align: center;
          padding: 120px 20px;
          background: radial-gradient(circle at center, ${accentColor}22 0%, transparent 70%);
        }

        .hero-badge {
          display: inline-block;
          background: ${accentColor}22;
          color: ${accentColor};
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          margin-bottom: 20px;
          border: 1px solid ${accentColor}44;
        }

        .hero h1 {
          font-size: 72px;
          font-weight: 900;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff, ${accentColor});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          font-size: 24px;
          color: #b0b0b0;
          margin-bottom: 40px;
        }

        .cta-button {
          background: linear-gradient(135deg, ${accentColor}, #ff00ff);
          color: #ffffff;
          padding: 18px 50px;
          font-size: 18px;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 10px 40px ${accentColor}44;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px ${accentColor}66;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 80px 0;
        }

        .feature {
          background: linear-gradient(135deg, #1a1f3a 0%, #0f1329 100%);
          padding: 40px;
          border-radius: 20px;
          border: 1px solid ${accentColor}33;
          text-align: center;
          transition: all 0.3s;
        }

        .feature:hover {
          border-color: ${accentColor};
          transform: translateY(-5px);
        }

        .feature h3 {
          color: ${accentColor};
          margin-bottom: 15px;
          font-size: 24px;
          font-weight: 700;
        }

        .feature p {
          color: #b0b0b0;
          line-height: 1.6;
        }

        .slots-section {
          padding: 80px 0;
        }

        .section-title {
          text-align: center;
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 60px;
          background: linear-gradient(135deg, #ffffff, ${accentColor});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .slot-card {
          background: linear-gradient(135deg, #1a1f3a 0%, #0f1329 100%);
          padding: 0;
          border-radius: 25px;
          border: 2px solid ${accentColor}44;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .slot-card:hover {
          border-color: ${accentColor};
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 60px ${accentColor}55;
        }

        .slot-logo-container {
          position: relative;
          width: 100%;
          height: 220px;
          background: linear-gradient(180deg, ${accentColor}22 0%, #0a0e27 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 2px solid ${accentColor}44;
        }

        .slot-logo {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .slot-logo img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 15px;
          transition: transform 0.4s;
          filter: drop-shadow(0 4px 15px ${accentColor}66);
        }

        .slot-card:hover .slot-logo img {
          transform: scale(1.12) rotate(2deg);
        }

        .slot-logo-placeholder {
          font-size: 80px;
          opacity: 0.3;
        }

        .slot-content {
          padding: 25px 20px;
        }

        .slot-card h3 {
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 15px;
          text-shadow: 0 2px 10px ${accentColor}88;
        }

        .slot-link {
          display: inline-block;
          background: linear-gradient(135deg, ${accentColor}, #ff00ff);
          color: #ffffff;
          padding: 14px 35px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s;
          box-shadow: 0 4px 20px ${accentColor}66;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .slot-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px ${accentColor}88;
          background: linear-gradient(135deg, #ff00ff, ${accentColor});
        }

        footer {
          text-align: center;
          padding: 50px 0;
          border-top: 1px solid ${accentColor}33;
          color: #666;
          margin-top: 80px;
        }

        .content-section {
          padding: 60px 0;
          background: linear-gradient(135deg, #1a1f3a22 0%, #0f132922 100%);
          border-radius: 20px;
          margin: 40px 0;
          border: 1px solid ${accentColor}22;
        }

        .content-wrapper {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
          color: #ffffff;
          line-height: 1.8;
          font-size: 18px;
        }

        .content-wrapper h1, .content-wrapper h2, .content-wrapper h3, .content-wrapper h4 {
          color: ${accentColor};
          margin: 30px 0 15px;
        }

        .content-wrapper h1 { font-size: 36px; }
        .content-wrapper h2 { font-size: 28px; }
        .content-wrapper h3 { font-size: 22px; }

        .content-wrapper p {
          margin-bottom: 20px;
        }

        .content-wrapper a {
          color: ${accentColor};
          text-decoration: underline;
        }

        .content-wrapper a:hover {
          color: #ff00ff;
        }

        .content-wrapper ul, .content-wrapper ol {
          margin: 20px 0;
          padding-left: 30px;
        }

        .content-wrapper li {
          margin-bottom: 10px;
        }

        .content-wrapper blockquote {
          border-left: 4px solid ${accentColor};
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #b0b0b0;
        }

        .content-wrapper img {
          max-width: 100%;
          height: auto;
          border-radius: 15px;
          margin: 20px 0;
          border: 2px solid ${accentColor}44;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 42px;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .slots-grid {
            grid-template-columns: 1fr;
          }

          nav a {
            margin-left: 15px;
            font-size: 14px;
          }

          .content-wrapper {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="container">
        <header>
          <div className="header-content">
            <div className="logo">⚡ {data.site_name || data.name}</div>
            <nav>
              {data.header_menu && data.header_menu.length > 0 ? (
                data.header_menu.map((item, index) => (
                  <div key={item.id || index} className="menu-item">
                    <a 
                      href={item.url} 
                      target={item.open_in_new_tab ? '_blank' : '_self'}
                      rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                    >
                      {item.label}
                      {item.submenu && item.submenu.length > 0 && (
                        <span className="menu-arrow">▼</span>
                      )}
                    </a>
                    {item.submenu && item.submenu.length > 0 && (
                      <div className="submenu">
                        {item.submenu.map((subitem, subindex) => (
                          <a
                            key={subitem.id || subindex}
                            href={subitem.url}
                            target={subitem.open_in_new_tab ? '_blank' : '_self'}
                            rel={subitem.open_in_new_tab ? 'noopener noreferrer' : undefined}
                          >
                            {subitem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <a href="#games">Games</a>
                  <a href="#features">Features</a>
                  <a href="#about">About</a>
                </>
              )}
            </nav>
          </div>
        </header>

        <section className="hero">
          {data.hero_badge && <div className="hero-badge">{data.hero_badge}</div>}
          <h1>{data.hero_title || data.site_name || data.name}</h1>
          <p>{data.hero_subtitle || data.tagline || 'Next Generation Casino Experience'}</p>
          <button className="cta-button">{data.cta_text || 'Play Now'}</button>
        </section>

        <section className="features">
          <div className="feature">
            <h3>⚡ Lightning Fast</h3>
            <p>{data.features_list?.split('\n')[0] || 'Instant gameplay with cutting-edge technology'}</p>
          </div>
          <div className="feature">
            <h3>🎮 Modern Games</h3>
            <p>{data.features_list?.split('\n')[1] || 'Latest slots and casino games'}</p>
          </div>
          <div className="feature">
            <h3>🔐 Secure</h3>
            <p>{data.features_list?.split('\n')[2] || 'Bank-level security and encryption'}</p>
          </div>
        </section>

        {processedContent && (
          <section className="content-section">
            <div className="content-wrapper" dangerouslySetInnerHTML={{ __html: processedContent }} />
          </section>
        )}

        {data.Slots && data.Slots.length > 0 && (
          <section className="slots-section">
            <h2 className="section-title">Featured Slots</h2>
            <div className="slots-grid">
              {data.Slots.map((slot, index) => {
                let logoUrl = '';
                if (slot.logo) {
                  if (typeof slot.logo === 'string') {
                    logoUrl = slot.logo;
                  } else if (Array.isArray(slot.logo) && slot.logo.length > 0) {
                    logoUrl = slot.logo[0].url || '';
                  } else if (typeof slot.logo === 'object' && 'url' in slot.logo) {
                    logoUrl = slot.logo.url || '';
                  }
                }

                return (
                  <div key={slot.id || index} className="slot-card">
                    <div className="slot-logo-container">
                      <div className="slot-logo">
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={slot.Name || `Slot ${index + 1}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="slot-logo-placeholder">⚡</div>';
                            }}
                          />
                        ) : (
                          <div className="slot-logo-placeholder">⚡</div>
                        )}
                      </div>
                    </div>
                    <div className="slot-content">
                      <h3>{slot.Name || `Slot ${index + 1}`}</h3>
                      {slot.link && (
                        <a href={slot.link} className="slot-link" target="_blank" rel="noopener noreferrer">
                          {data.cta_text || 'Play Now'}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <footer>
          <p>{data.footer_text || `© 2024 ${data.site_name || data.name}. All rights reserved.`}</p>
          <p>{data.url}</p>
          {data.footer_menu && data.footer_menu.length > 0 && (
            <nav>
              {data.footer_menu.map((item, index) => (
                <a
                  key={item.id || index}
                  href={item.url}
                  target={item.open_in_new_tab ? '_blank' : '_self'}
                  rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </footer>
      </div>
    </>
  )
}
