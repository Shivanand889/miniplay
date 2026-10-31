import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'game' | 'article';
  ogImage?: string;
  structuredData?: Record<string, any>;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = window.location.href,
  ogType = 'website',
  ogImage = 'https://miniplay.shivanandgarg1234.workers.dev//og-image.png',
  structuredData,
}) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | MiniPlay`;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('og:title', `${title} | MiniPlay`);
    setMeta('og:description', description);
    setMeta('og:url', canonicalUrl);
    setMeta('og:type', ogType);
    setMeta('og:image', ogImage);

    // Structured Data (JSON-LD)
    let scriptTag = document.getElementById('structured-data-tag') as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'structured-data-tag';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, ogType, ogImage, structuredData]);

  return null;
};
