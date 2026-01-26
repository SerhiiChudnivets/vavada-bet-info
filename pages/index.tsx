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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--background);
    color: var(--foreground);
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Header Styles */
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: hsla(var(--card), 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
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
  }

  .logo-icon {
    width: 2rem;
    height: 2rem;
    color: var(--button-bg);
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--button-bg);
  }

  .header-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.5rem 1.5rem;
    font-weight: 600;
    border-radius: calc(var(--radius) * 2);
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    font-size: 0.95rem;
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
  }

  .btn-outline:hover {
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .btn-primary {
    background: var(--button-bg);
    color: var(--primary-foreground);
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  /* Navigation Styles */
  .nav-bar {
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 0.75rem 0;
    overflow-x: auto;
     color: var(--primary);
  }

  .menu-item {
    position: relative;
  }

  .nav-link {
    color: var(--muted-foreground);
    text-decoration: none;
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.3s;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-link:hover {
    color: var(--primary);
  }

  .menu-arrow {
    font-size: 10px;
    transition: transform 0.3s;
  }

  .menu-item:hover .menu-arrow {
    transform: rotate(180deg);
  }

  .submenu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.5rem 0;
    min-width: 200px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .menu-item:hover .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .submenu a {
    display: block;
    color: var(--muted-foreground);
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: all 0.3s;
    white-space: nowrap;
  }

  .submenu a:hover {
    background: var(--accent);
    color: var(--primary);
  }

  footer .nav-content {
    padding: 1rem 0;
    font-size: 0.875rem;
  }

  footer .nav-link {
    font-size: 0.875rem;
  }


  /* Hero Banner Styles */
  .hero-section {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, 
      hsla(var(--background), 0.9) 0%, 
      hsla(var(--background), 0.6) 50%, 
      transparent 100%);
  }

  .hero-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 40rem;
  }

  .hero-badge {
    display: inline-block;
    background: hsla(var(--primary), 0.2);
    color: var(--button-bg);
    padding: 0.25rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
    width: fit-content;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  .hero-accent {
    color: var(--button-bg);
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }

  .hero-description {
    color: var(--muted-foreground);
    margin-bottom: 2rem;
  }

  .btn-hero {
    box-shadow: 0 0 30px hsla(var(--button-bg), 0.4);
  }

  /* Slots Section */
  .slots-section {
    padding: 4rem 0;
    background: var(--background);
  }

  .section-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 2rem;
  }

  .slider-container {
    position: relative;
  }

  .slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 50%;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .slider-btn:hover {
    background: var(--secondary);
  }

  .slider-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .slider-btn-left {
    left: -1rem;
  }

  .slider-btn-right {
    right: -1rem;
  }

  .slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 0 2rem;
  }

  .slot-card {
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .slot-card:hover {
    transform: scale(1.05);
  }

  .slot-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .slot-overlay {
    position: absolute;
    inset: 0;
    background: hsla(var(--background), 0.8);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .slot-card:hover .slot-overlay {
    opacity: 1;
  }

  .slot-name {
    color: var(--primary);
    font-weight: 700;
    font-size: 1.125rem;
  }

  /* Bonuses Section */
  .bonuses-section {
    padding: 4rem 0;
    background: var(--secondary);
  }

  .bonuses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 0 2rem;
  }

  .bonus-card {
    background: var(--card);
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: all 0.3s;
  }

  .bonus-card:hover {
    border-color: var(--primary);
    box-shadow: 0 0 20px hsla(var(--primary), 0.2);
  }

  .bonus-header {
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bonus-icon {
    width: 3rem;
    height: 3rem;
    color: white;
  }

  .bonus-content {
    padding: 1rem;
    text-align: center;
  }

  .bonus-name {
    color: var(--primary);
    font-weight: 700;
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }

  .bonus-text {
    color: var(--button-bg);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Custom Content Section */
  .content-section {
    padding: 4rem 0;
    background: var(--background);
  }

  .content-wrapper {
    max-width: 56rem;
    margin: 0 auto;
    color: var(--foreground);
    line-height: 1.8;
    font-size: 1.125rem;
  }

  .content-wrapper h1, .content-wrapper h2, .content-wrapper h3, .content-wrapper h4 {
    color: var(--button-bg);
    margin: 2rem 0 1rem;
    font-weight: 700;
  }

  .content-wrapper h1 { font-size: 2.5rem; }
  .content-wrapper h2 { font-size: 2rem; }
  .content-wrapper h3 { font-size: 1.5rem; }

  .content-wrapper p {
    margin-bottom: 1.5rem;
    color: var(--muted-foreground);
  }

  .content-wrapper a {
    color: var(--button-bg);
    text-decoration: underline;
  }

  .content-wrapper a:hover {
    opacity: 0.8;
  }

  .content-wrapper ul, .content-wrapper ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
    color: var(--muted-foreground);
  }

  .content-wrapper li {
    margin-bottom: 0.5rem;
  }

  .content-wrapper blockquote {
    border-left: 4px solid var(--primary);
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--muted-foreground);
  }

  /* Footer */
  footer {
    background: var(--card);
    border-top: 1px solid var(--border);
    padding: 2rem 0;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .footer-certifications {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cert-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }

  .age-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(0 84% 60%);
    color: hsl(0 84% 60%);
    font-weight: 700;
    font-size: 0.875rem;
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .footer-link {
    color: var(--muted-foreground);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s;
  }

  .footer-link:hover {
    color: var(--primary);
  }

  .footer-bottom {
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .footer-copyright {
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }

  /* Bonus Popup */
  .bonus-popup {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: var(--card);
    border-top: 1px solid hsla(var(--primary), 0.3);
    box-shadow: 0 -4px 20px hsla(var(--primary), 0.2);
    animation: slideUp 0.3s ease-out;
  }

  .bonus-popup.hidden {
    display: none;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .popup-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    gap: 1rem;
  }

  .popup-text {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary);
    flex: 1;
    text-align: center;
  }

  .popup-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-close {
    padding: 0.25rem;
    color: var(--muted-foreground);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s;
  }

  .btn-close:hover {
    color: var(--foreground);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-section {
      height: 500px;
    }

    .slots-grid,
    .bonuses-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .popup-text {
      font-size: 0.875rem;
    }

    .header-buttons .btn {
      padding: 0.375rem 1rem;
      font-size: 0.875rem;
    }

    .content-wrapper {
      font-size: 1rem;
    }
  }
`;
export default function TupchiyTemplate() {
  const data: CasinoData = require('../data.json')
  const [slotStartIndex, setSlotStartIndex] = useState(0)
  const [bonusStartIndex, setBonusStartIndex] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  // Отримуємо кольори з data або використовуємо дефолтні
  const mainBackground = data.main_background || '#1a202c' // default dark blue
  const secondaryBackground = data.secondary_background || '#2d3748' // default darker blue
  const buttonBackground = data.button_background || '#f59e0b' // default amber
  const buttonText = data.button_text || '#1a202c' // default dark
  const textColor = data.text_color || '#f7fafc' // default light
  const colorHighlightText = data.color_highlight_text || '#f59e0b' // default amber

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

  const processedContent = data.content ? replaceVariables(data.content) : ''

  const siteName = data.site_name || data.name || 'LuckySpin'
  const heroTitle = data.hero_title || 'Get 200% Bonus'
  const heroSubtitle = data.hero_subtitle || 'Up to €1,000 + 100 Free Spins'
  const heroBadge = data.hero_badge || '🎰 Welcome Bonus'
  const ctaText = data.cta_text || 'Play Now'
  const popupText = data.popup_text || '🎁 Welcome Bonus: 100% up to $500 + 200 Free Spins!'

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

  // Mock slots data if not provided
  const slots = data.Slots && data.Slots.length > 0 ? data.Slots : [
    { id: 1, Name: 'Gem Rush', logo: '', link: '#' },
    { id: 2, Name: "Pharaoh's Gold", logo: '', link: '#' },
    { id: 3, Name: 'Lucky 777', logo: '', link: '#' },
    { id: 4, Name: 'Wild West', logo: '', link: '#' },
    { id: 5, Name: "Dragon's Fire", logo: '', link: '#' },
    { id: 6, Name: 'Ocean Treasure', logo: '', link: '#' },
    { id: 7, Name: 'Cosmic Slots', logo: '', link: '#' },
    { id: 8, Name: 'Viking Fortune', logo: '', link: '#' },
  ]

  const bonuses = [
    { id: 1, name: 'LuckySpin', bonus: '200% Welcome Bonus', color: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
    { id: 2, name: 'GoldenBet', bonus: '100 Free Spins', color: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' },
    { id: 3, name: 'RoyalWin', bonus: '500% First Deposit', color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
    { id: 4, name: 'JackpotCity', bonus: 'No Wagering Bonus', color: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)' },
    { id: 5, name: 'SpinPalace', bonus: '50 Free Spins Daily', color: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowPopup(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const visibleSlots = 5
  const visibleBonuses = 5

  const handleSlotPrev = () => {
    setSlotStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleSlotNext = () => {
    setSlotStartIndex((prev) => Math.min(slots.length - visibleSlots, prev + 1))
  }

  const handleBonusPrev = () => {
    setBonusStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleBonusNext = () => {
    setBonusStartIndex((prev) => Math.min(bonuses.length - visibleBonuses, prev + 1))
  }

  const getLogoUrl = (slot: Slot) => {
    if (!slot.logo) return ''
    if (typeof slot.logo === 'string') return slot.logo
    if (Array.isArray(slot.logo) && slot.logo.length > 0) return slot.logo[0].url || ''
    if (typeof slot.logo === 'object' && 'url' in slot.logo) return slot.logo.url || ''
    return ''
  }

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

      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div>
        {/* Header */}
        <header>
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                <span className="logo-text">{siteName}</span>
              </div>
              <div className="header-buttons">
                <button className="btn btn-outline">Login</button>
                <button className="btn btn-primary">Register</button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="nav-bar">
          <div className="container">
            <ul className="nav-content">
              {data.header_menu && data.header_menu.length > 0 ? (
                data.header_menu.map((item, index) => (
                  <li key={item.id || index} className="menu-item">
                    <a 
                      href={item.url} 
                      className="nav-link"
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
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#home" className="nav-link">Home</a></li>
                  <li><a href="#slots" className="nav-link">Slots</a></li>
                  <li><a href="#bonuses" className="nav-link">Bonuses</a></li>
                  <li><a href="#about" className="nav-link">About</a></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Hero Banner */}
        <section id="home" className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <span className="hero-badge">{heroBadge}</span>
              <h1 className="hero-title">
                <span className="hero-accent">{heroTitle}</span>
              </h1>
              <p className="hero-subtitle">{heroSubtitle}</p>
              <p className="hero-description">
                {data.tagline || 'Start your winning journey today with the best welcome offer in online gaming!'}
              </p>
              <button className="btn btn-primary btn-lg btn-hero">{ctaText}</button>
            </div>
          </div>
        </section>

        {/* Slots Section */}
        <section id="slots" className="slots-section">
          <div className="container">
            <h2 className="section-title">
              🎰 Popular <span className="hero-accent">Slots</span>
            </h2>
            <div className="slider-container">
              <button
                onClick={handleSlotPrev}
                disabled={slotStartIndex === 0}
                className="slider-btn slider-btn-left"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="slots-grid">
                {slots.slice(slotStartIndex, slotStartIndex + visibleSlots).map((slot, index) => {
                  const logoUrl = getLogoUrl(slot)
                  return (
                    <div key={slot.id || index} className="slot-card">
                      {logoUrl ? (
                        <img src={logoUrl} alt={slot.Name || `Slot ${index + 1}`} className="slot-image" />
                      ) : (
                        <div className="slot-image" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                          🎰
                        </div>
                      )}
                      <div className="slot-overlay">
                        <span className="slot-name">{slot.Name || `Slot ${index + 1}`}</span>
                        <button className="btn btn-primary" onClick={() => slot.link && window.open(slot.link, '_blank')}>
                          Play
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={handleSlotNext}
                disabled={slotStartIndex >= slots.length - visibleSlots}
                className="slider-btn slider-btn-right"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Bonuses Section */}
        <section id="bonuses" className="bonuses-section">
          <div className="container">
            <h2 className="section-title">
              🎁 Casino <span className="hero-accent">Bonuses</span>
            </h2>
            <div className="slider-container">
              <button
                onClick={handleBonusPrev}
                disabled={bonusStartIndex === 0}
                className="slider-btn slider-btn-left"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="bonuses-grid">
                {bonuses.slice(bonusStartIndex, bonusStartIndex + visibleBonuses).map((bonus) => (
                  <div key={bonus.id} className="bonus-card">
                    <div className="bonus-header" style={{ background: bonus.color }}>
                      <svg className="bonus-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="bonus-content">
                      <h3 className="bonus-name">{bonus.name}</h3>
                      <p className="bonus-text">{bonus.bonus}</p>
                      <button className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>
                        Get Bonus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleBonusNext}
                disabled={bonusStartIndex >= bonuses.length - visibleBonuses}
                className="slider-btn slider-btn-right"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Custom Content Section */}
        {processedContent && (
          <section className="content-section">
            <div className="container">
              <div className="content-wrapper" dangerouslySetInnerHTML={{ __html: processedContent }} />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-top">
                <div className="logo">
                  <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  <span className="logo-text" style={{ fontSize: '1.25rem' }}>{siteName}</span>
                </div>

                <div className="footer-certifications">
                  <div className="cert-item">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>FairPlay</span>
                  </div>
                  <div className="age-badge">18+</div>
                </div>

                <div className="footer-links">
                  {data.footer_menu && data.footer_menu.length > 0 ? (
                    data.footer_menu.map((item, index) => (
                      <a
                        key={item.id || index}
                        href={item.url}
                        className="footer-link"
                        target={item.open_in_new_tab ? '_blank' : '_self'}
                        rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                      >
                        {item.label}
                      </a>
                    ))
                  ) : (
                    <>
                      <a href="#" className="footer-link">About Us</a>
                      <a href="#" className="footer-link">Terms & Conditions</a>
                      <a href="#" className="footer-link">Responsible Gambling</a>
                    </>
                  )}
                </div>
              </div>

              <div className="footer-bottom">
                <p className="footer-copyright">
                  {data.footer_text || `© 2024 ${siteName}. All rights reserved. Gambling can be addictive. Play responsibly.`}
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Bonus Popup */}
        <div className={`bonus-popup ${showPopup ? '' : 'hidden'}`}>
          <div className="container">
            <div className="popup-content">
              <div className="logo">
                <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>

              <div className="popup-text">{popupText}</div>

              <div className="popup-buttons">
                <button className="btn btn-primary">Get Bonu</button>
                <button className="btn-close" onClick={() => setShowPopup(false)}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
