export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Pinky's Store",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com'}/pinkys-logo.jpg`,
    description:
      'Tienda en línea de cosméticos, joyería y perfumes premium en Honduras.',
    email: 'hola@pinkysstore.com',
    telephone: '+50495825388',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Pedro Sula',
      addressCountry: 'HN',
    },
    sameAs: [
      'https://www.instagram.com/pinkysstore2/',
      'https://www.facebook.com/people/Pinkyys-Store/61567252978469/',
      'https://www.tiktok.com/@pinkysstore2',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+50495825388',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: "Pinky's Store",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com'}/pinkys-logo.jpg`,
    '@id': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com',
    telephone: '+50495825388',
    email: 'hola@pinkysstore.com',
    description:
      'Tienda de cosméticos, maquillaje, joyería y perfumes premium en San Pedro Sula, Honduras. Envíos a nivel nacional.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Pedro Sula',
      addressRegion: 'Cortés',
      addressCountry: 'HN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 15.5049,
      longitude: -88.0252,
    },
    priceRange: 'L$',
    currenciesAccepted: 'HNL',
    paymentAccepted: 'Efectivo, Transferencia bancaria',
    areaServed: {
      '@type': 'Country',
      name: 'Honduras',
    },
    sameAs: [
      'https://www.instagram.com/pinkysstore2/',
      'https://www.facebook.com/people/Pinkyys-Store/61567252978469/',
      'https://www.tiktok.com/@pinkysstore2',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '10000',
      bestRating: '5',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Pinky's Store",
    url: siteUrl,
    description:
      'Tienda en línea de cosméticos, joyería y perfumes premium en Honduras.',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogo',
        item: `${siteUrl}/#catalog`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ItemListSchema({ products }: { products: Array<{ name: string; image: string; price: number; description?: string | null }> }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pinkysstorehn.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Productos de Pinky\'s Store',
    description: 'Catálogo de cosméticos, joyería y perfumes premium en Honduras',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description || `${product.name} disponible en Pinky's Store Honduras`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'HNL',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: "Pinky's Store",
          },
          url: siteUrl,
        },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
