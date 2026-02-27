import { Helmet } from 'react-helmet-async';

export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": "https://yoursparkpoint.org/#organization",
        "name": "SparkPoint",
        "url": "https://yoursparkpoint.org",
        "logo": "https://yoursparkpoint.org/logo.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "159 W. Main St Unit 2452",
          "addressLocality": "Brevard",
          "addressRegion": "NC",
          "postalCode": "28712",
          "addressCountry": "US"
        },
        "email": "info@yoursparkpoint.org",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "info@yoursparkpoint.org",
          "contactType": "general inquiry"
        },
        "sameAs": [
          "https://www.facebook.com/yoursparkpoint",
          "https://www.instagram.com/yoursparkpoint",
          "https://www.youtube.com/@sparkpoint2023",
          "https://www.tiktok.com/@sparkysparkpoint?_r=1&_t=ZP-93dyebP3yYR"
        ],
        "parentOrganization": {
          "@type": "Organization",
          "name": "Sustainable Health For All"
        },
        "slogan": "SparkPoint fosters community well-being rooted in connection."
      },
      {
        "@type": "WebSite",
        "@id": "https://yoursparkpoint.org/#website",
        "url": "https://yoursparkpoint.org",
        "name": "SparkPoint",
        "publisher": {
          "@id": "https://yoursparkpoint.org/#organization"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
