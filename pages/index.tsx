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
  html_head?: string  // Замість description
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

export default function LuxuryCasino() {
  const data: CasinoData = require('../data.json')
  const accentColor = data.accent_color || '#d4af37'
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)


  // Отримуємо кольори з data або використовуємо дефолтні
  const mainBackground = data.main_background || '#0f0f1e' // default dark blue
  const secondaryBackground = data.secondary_background || '#1a1a2e' // default darker blue
  const buttonBackground = data.button_background || '#d4af37' // default amber
  const buttonText = data.button_text || '#0f0f1e' // default dark
  const textColor = data.text_color || '#f0f0f0' // default light
  const colorHighlightText = data.color_highlight_text || '#d4af37' // default amber


  // Функція для заміни змінних у content
  const replaceVariables = (content: string): string => {
    if (!content) return content
    
    let result = content
    
    // Замінюємо всі змінні типу {{variable_name}}
    const variableRegex = /\{\{([^}]+)\}\}/g
    
    result = result.replace(variableRegex, (match, variableName) => {
      const trimmedName = variableName.trim()
      
      // Спробуємо знайти значення в data
      if (data[trimmedName] !== undefined && data[trimmedName] !== null) {
        return String(data[trimmedName])
      }
      
      // Якщо змінна не знайдена, повертаємо оригінальний текст
      return match
    })
    
    return result
  }

  // Обробляємо content якщо він є
  
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
          border-bottom: 2px solid ${accentColor};
        }

        .logo {
          font-size: 28px;
          font-weight: bold;
          color: ${accentColor};
          text-decoration: none;
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
          color: #e0e0e0;
          text-decoration: none;
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
          background: #16213e;
          border: 1px solid ${accentColor};
          border-radius: 8px;
          padding: 10px 0;
          min-width: 200px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .menu-item:hover .submenu,
        .submenu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .submenu a {
          display: block;
          color: #e0e0e0;
          text-decoration: none;
          padding: 10px 20px;
          transition: all 0.3s;
        }

        .submenu a:hover {
          background: rgba(212, 175, 55, 0.1);
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
          color: #e0e0e0;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        footer nav a:hover {
          color: ${accentColor};
        }


        .hero {
          text-align: center;
          padding: 100px 0;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%);
        }

        .hero-badge {
          display: inline-block;
          background: rgba(212, 175, 55, 0.2);
          color: ${accentColor};
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .hero h1 {
          font-size: 64px;
          color: ${accentColor};
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .hero p {
          font-size: 20px;
          color: #e0e0e0;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          background: linear-gradient(135deg, ${accentColor} 0%, #f4d03f 100%);
          color: #1a1a2e;
          padding: 15px 40px;
          font-size: 18px;
          font-weight: bold;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 80px 0;
        }

        .feature {
          background: rgba(255, 255, 255, 0.05);
          padding: 30px;
          border-radius: 10px;
          border: 1px solid ${accentColor};
          text-align: center;
        }

        .feature h3 {
          color: ${accentColor};
          margin-bottom: 15px;
          font-size: 24px;
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
          font-size: 42px;
          color: ${accentColor};
          margin-bottom: 50px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .slot-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
          padding: 0;
          border-radius: 20px;
          border: 2px solid ${accentColor};
          overflow: hidden;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .slot-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.4);
          border-color: #f4d03f;
        }

        .slot-logo-container {
          position: relative;
          width: 100%;
          height: 220px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0.3) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
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
          border-radius: 12px;
          transition: transform 0.4s;
          filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.3));
        }

        .slot-card:hover .slot-logo img {
          transform: scale(1.1);
        }

        .slot-logo-placeholder {
          font-size: 80px;
          opacity: 0.3;
        }

        .slot-content {
          padding: 25px 20px;
        }

        .slot-card h3 {
          color: ${accentColor};
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 15px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slot-link {
          display: inline-block;
          background: linear-gradient(135deg, ${accentColor} 0%, #f4d03f 100%);
          color: #1a1a2e;
          padding: 14px 35px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .slot-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #f4d03f 0%, ${accentColor} 100%);
        }

        footer {
          text-align: center;
          padding: 40px 0;
          border-top: 2px solid ${accentColor};
          color: #888;
          margin-top: 80px;
        }

        .content-section {
          padding: 60px 0;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 15px;
          margin: 40px 0;
        }

        .content-wrapper {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
          color: #e0e0e0;
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
          color: #f4d03f;
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
          border-radius: 10px;
          margin: 20px 0;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 40px;
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
          <div className="logo">{data.logo_url || '🎰'} {data.site_name || data.name}</div>
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
                <a href="#promotions">Promotions</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </>
            )}
          </nav>
        </header>

        <section className="hero">
          {data.hero_badge && <div className="hero-badge">{data.hero_badge}</div>}
          <h1>{data.hero_title || 'Welcome to Luxury Casino'}</h1>
          <p>{data.hero_subtitle || data.tagline || 'Experience the finest gaming entertainment'}</p>
          <button className="cta-button">{data.cta_text || 'Play Now'}</button>
        </section>

        <section className="features">
          <div className="feature">
            <h3>🎮 Premium Games</h3>
            <p>{data.features_list?.split('\n')[0] || 'Access exclusive casino games with stunning graphics and smooth gameplay'}</p>
          </div>
          <div className="feature">
            <h3>💎 VIP Rewards</h3>
            <p>{data.features_list?.split('\n')[1] || 'Earn loyalty points and unlock exclusive VIP benefits'}</p>
          </div>
          <div className="feature">
            <h3>🔒 Secure & Fair</h3>
            <p>{data.features_list?.split('\n')[2] || 'Licensed and regulated with advanced security measures'}</p>
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
                              e.currentTarget.parentElement!.innerHTML = '<div class="slot-logo-placeholder">🎰</div>';
                            }}
                          />
                        ) : (
                          <div className="slot-logo-placeholder">🎰</div>
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
