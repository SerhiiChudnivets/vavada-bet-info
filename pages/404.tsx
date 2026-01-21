import Head from 'next/head';
import { useEffect } from 'react';

interface SiteData {
  name: string;
  redirect_404s_to_homepage?: boolean;
  allow_indexing?: boolean;
}

export default function Custom404() {
  const data: SiteData = require('../data.json');

  useEffect(() => {
    // Client-side redirect для тих хто має JS
    if (data.redirect_404s_to_homepage && typeof window !== 'undefined') {
      window.location.replace('/');
    }
  }, [data.redirect_404s_to_homepage]);

  // Якщо redirect_404s_to_homepage = true - миттєвий редірект
  if (data.redirect_404s_to_homepage) {
    return (
      <>
        <Head>
          <title>Redirecting... | {data.name}</title>
          <meta name="robots" content="noindex,nofollow" />
          {/* Meta refresh для автоматичного редіректу */}
          <meta httpEquiv="refresh" content="0;url=/" />
        </Head>
        {/* Порожня сторінка - redirect відбувається через meta refresh та useEffect */}
      </>
    );
  }

  // Якщо redirect вимкнено - показуємо 404 сторінку
  return (
    <>
      <Head>
        <title>404 - Page Not Found | {data.name}</title>
        <meta name="robots" content={data.allow_indexing ? 'noindex,follow' : 'noindex,nofollow'} />
      </Head>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '72px', marginBottom: '20px', margin: '0 0 20px 0' }}>404</h1>
        <h2 style={{ fontSize: '24px', marginBottom: '30px', fontWeight: 'normal' }}>Page Not Found</h2>
        <p style={{ fontSize: '16px', marginBottom: '40px', maxWidth: '500px', lineHeight: '1.6' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a 
          href="/"
          style={{
            padding: '15px 40px',
            background: '#d4af37',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c49d2f';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#d4af37';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Go to Homepage
        </a>
      </div>
    </>
  );
}
