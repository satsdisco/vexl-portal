export const vexlBrand = {
  colors: {
    primary: '#FFE500', // Vexl Yellow
    secondary: '#000000', // Black
    accent: '#1A1A1A', // Dark Gray
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
      dark: '#000000',
    },
    background: {
      primary: '#000000',
      secondary: '#0A0A0A',
      card: '#1A1A1A',
      hover: '#2A2A2A',
    },
    gradient: {
      yellow: 'linear-gradient(135deg, #FFE500 0%, #FFC700 100%)',
      dark: 'linear-gradient(135deg, #1A1A1A 0%, #000000 100%)',
    }
  },
  typography: {
    fonts: {
      heading: 'Inter, system-ui, -apple-system, sans-serif',
      body: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Consolas, Monaco, monospace',
    },
    sizes: {
      hero: 'clamp(3rem, 8vw, 6rem)',
      h1: 'clamp(2.5rem, 6vw, 4.5rem)',
      h2: 'clamp(2rem, 5vw, 3.5rem)',
      h3: 'clamp(1.5rem, 4vw, 2.5rem)',
      body: 'clamp(1rem, 2vw, 1.25rem)',
      small: '0.875rem',
    }
  },
  logos: {
    main: '/vexl-logo.svg',
    icon: '/vexl-icon.svg',
    wordmark: '/vexl-wordmark.svg',
  },
  patterns: {
    dots: 'radial-gradient(circle, #FFE500 1px, transparent 1px)',
    grid: 'linear-gradient(#FFE500 1px, transparent 1px), linear-gradient(90deg, #FFE500 1px, transparent 1px)',
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.5s ease-out',
    pulse: 'pulse 2s infinite',
  }
};

export const slideTemplates = {
  title: {
    name: 'Title Slide',
    icon: '🎯',
    layout: 'center',
    defaultContent: {
      title: 'Your Title Here',
      subtitle: 'Subtitle or tagline',
      showLogo: true,
      background: 'gradient-dark',
    }
  },
  agenda: {
    name: 'Agenda',
    icon: '📋',
    layout: 'left',
    defaultContent: {
      title: 'Agenda',
      items: [
        'Introduction to Vexl',
        'Key Features',
        'How It Works',
        'Use Cases',
        'Q&A Session'
      ]
    }
  },
  feature: {
    name: 'Feature Highlight',
    icon: '✨',
    layout: 'split',
    defaultContent: {
      title: 'Feature Name',
      description: 'Feature description',
      icon: '🔒',
      benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3']
    }
  },
  comparison: {
    name: 'Comparison',
    icon: '⚖️',
    layout: 'columns',
    defaultContent: {
      title: 'Vexl vs Traditional',
      columns: [
        { header: 'Vexl', items: ['No KYC', 'P2P', 'Private'] },
        { header: 'Traditional', items: ['KYC Required', 'Centralized', 'Tracked'] }
      ]
    }
  },
  quote: {
    name: 'Quote',
    icon: '💬',
    layout: 'center',
    defaultContent: {
      title: 'Quote',
      quote: '"Bitcoin is freedom money"',
      author: 'Satoshi Nakamoto',
      showPattern: true
    }
  },
  stats: {
    name: 'Statistics',
    icon: '📊',
    layout: 'grid',
    defaultContent: {
      title: 'By The Numbers',
      stats: [
        { value: '100K+', label: 'Users' },
        { value: '50+', label: 'Countries' },
        { value: '0', label: 'KYC Required' },
        { value: '100%', label: 'Private' }
      ]
    }
  },
  cta: {
    name: 'Call to Action',
    icon: '🚀',
    layout: 'center',
    defaultContent: {
      title: 'Ready to Get Started?',
      description: 'Join the Vexl community today',
      buttonText: 'Download Vexl',
      qrCode: true
    }
  }
};

export const brandAssets = {
  images: [
    { id: 'logo-main', url: '/assets/vexl-logo.svg', name: 'Vexl Logo' },
    { id: 'logo-icon', url: '/assets/vexl-icon.svg', name: 'Vexl Icon' },
    { id: 'pattern-dots', url: '/assets/pattern-dots.svg', name: 'Dot Pattern' },
    { id: 'bitcoin-icon', url: '/assets/bitcoin.svg', name: 'Bitcoin Icon' },
  ],
  icons: [
    '🔒', '💸', '🤝', '⚡', '🛡️', '🔑', '📱', '🌍', '✨', '🚀'
  ],
  backgrounds: [
    { id: 'solid-black', style: { background: '#000000' }, name: 'Solid Black' },
    { id: 'gradient-yellow', style: { background: 'linear-gradient(135deg, #FFE500 0%, #FFC700 100%)' }, name: 'Yellow Gradient' },
    { id: 'gradient-dark', style: { background: 'linear-gradient(135deg, #1A1A1A 0%, #000000 100%)' }, name: 'Dark Gradient' },
    { id: 'pattern-dots', style: { background: '#000000', backgroundImage: 'radial-gradient(circle, #FFE50020 1px, transparent 1px)', backgroundSize: '20px 20px' }, name: 'Dot Pattern' },
  ]
};