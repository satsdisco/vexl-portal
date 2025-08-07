export const vexlWorkshopTemplate = {
  title: "Vexl: The Future of P2P Bitcoin Trading",
  description: "Your network is your net worth - Learn how Vexl revolutionizes peer-to-peer Bitcoin trading",
  duration: 30,
  difficulty: "beginner",
  tags: ["bitcoin", "p2p", "privacy", "decentralized", "trading"],
  sections: [
    {
      id: "hook",
      type: "interactive",
      template: "hook",
      title: "Your Network is Your Net Worth",
      subtitle: "Welcome to the future of P2P Bitcoin trading",
      duration: 2,
      content: {
        mainMessage: "What if you could trade Bitcoin with people you trust, without KYC, without centralized exchanges?",
        subMessage: "Today, we'll show you how Vexl makes this possible.",
        background: "gradient-dark",
        showLogo: true,
        animation: "fadeIn"
      },
      notes: "Start with a powerful hook. Let this sink in for a moment before proceeding."
    },
    {
      id: "privacy-problem",
      type: "interactive",
      template: "comparison",
      title: "The Privacy Problem",
      duration: 3,
      content: {
        leftTitle: "Traditional Exchanges",
        rightTitle: "Vexl",
        leftItems: [
          "KYC Required ❌",
          "Data stored forever 📊",
          "Government tracking 👁️",
          "Hacks expose your info 🚨",
          "Your trades are public record 📝"
        ],
        rightItems: [
          "No KYC ✅",
          "No data collection 🔒",
          "Complete privacy 🛡️",
          "Nothing to hack 💪",
          "Your business stays yours 🤫"
        ],
        interactive: true,
        revealAnimation: "slideUp"
      },
      notes: "Click on each item to reveal. Emphasize the privacy violations of traditional exchanges."
    },
    {
      id: "trust-network",
      type: "interactive",
      template: "network-visualization",
      title: "Your Web of Trust",
      duration: 4,
      content: {
        component: "WebOfTrust",
        nodes: [
          { id: "you", label: "You", x: 50, y: 50, type: "primary" },
          { id: "friend1", label: "Close Friend", x: 30, y: 30, type: "trusted" },
          { id: "friend2", label: "Family", x: 70, y: 30, type: "trusted" },
          { id: "friend3", label: "Colleague", x: 30, y: 70, type: "trusted" },
          { id: "extended1", label: "Friend of Friend", x: 15, y: 15, type: "extended" }
        ],
        connections: [
          { from: "you", to: "friend1", strength: 1 },
          { from: "you", to: "friend2", strength: 1 },
          { from: "you", to: "friend3", strength: 1 },
          { from: "friend1", to: "extended1", strength: 0.5 }
        ],
        interactive: true,
        expandable: true,
        showCalculation: true
      },
      notes: "Click to expand the network. Show how 50 contacts can reach 12,500 people through 2 degrees of separation."
    },
    {
      id: "contact-import",
      type: "interactive",
      template: "contact-demo",
      title: "Build Your Network",
      duration: 3,
      content: {
        component: "ContactImportDemo",
        contacts: [
          { name: "Alice", trusted: true, trades: 5 },
          { name: "Bob", trusted: true, trades: 3 },
          { name: "Charlie", trusted: false, trades: 0 },
          { name: "David", trusted: true, trades: 8 }
        ],
        showMultiplier: true,
        interactive: true,
        gamified: true
      },
      notes: "Let audience select contacts to see network effect multiply. Show the power of selective trust."
    },
    {
      id: "demo-flow",
      type: "interactive",
      template: "phone-demo",
      title: "How It Works",
      duration: 5,
      content: {
        component: "PhoneMockup",
        steps: [
          {
            id: 1,
            title: "Import Contacts",
            description: "Select trusted contacts from your phone",
            screenshot: "/screenshots/import.png",
            action: "tap"
          },
          {
            id: 2,
            title: "Create Offer",
            description: "Set your terms - amount, price, location",
            screenshot: "/screenshots/create-offer.png",
            action: "swipe"
          },
          {
            id: 3,
            title: "Match & Chat",
            description: "Connect with trusted traders",
            screenshot: "/screenshots/chat.png",
            action: "tap"
          },
          {
            id: 4,
            title: "Trade Safely",
            description: "Meet in person or use escrow",
            screenshot: "/screenshots/trade.png",
            action: "complete"
          }
        ],
        interactive: true,
        autoPlay: false
      },
      notes: "Click through each step. Pause on chat to explain encrypted messaging."
    },
    {
      id: "marketplace",
      type: "interactive",
      template: "marketplace-demo",
      title: "Find Perfect Offers",
      duration: 3,
      content: {
        component: "MarketplaceView",
        offers: [
          {
            type: "buy",
            amount: "0.01 BTC",
            price: "$650",
            location: "Prague",
            rating: 4.8,
            trades: 47,
            distance: "2 km"
          },
          {
            type: "sell",
            amount: "0.05 BTC",
            price: "$3,200",
            location: "Prague",
            rating: 5.0,
            trades: 123,
            distance: "5 km"
          }
        ],
        filters: ["location", "amount", "price", "rating"],
        interactive: true
      },
      notes: "Show how filtering works. Emphasize no personal data visible."
    },
    {
      id: "clubs",
      type: "interactive",
      template: "community",
      title: "Join Trading Clubs",
      duration: 3,
      content: {
        component: "ClubsShowcase",
        clubs: [
          {
            name: "Prague Bitcoiners",
            members: 156,
            description: "Local meetup group",
            verified: true
          },
          {
            name: "Digital Nomads BTC",
            members: 892,
            description: "Worldwide travelers",
            verified: true
          },
          {
            name: "Lightning Network",
            members: 2341,
            description: "Fast transactions",
            verified: false
          }
        ],
        benefits: [
          "Verified communities",
          "Reputation systems",
          "Group discounts",
          "Event coordination"
        ],
        interactive: true
      },
      notes: "Explain how clubs add extra layer of trust and community."
    },
    {
      id: "security",
      type: "interactive",
      template: "security-demo",
      title: "Your Security, Your Control",
      duration: 3,
      content: {
        component: "SecurityFeatures",
        features: [
          {
            icon: "🔐",
            title: "End-to-End Encryption",
            description: "Messages only you can read",
            demo: true
          },
          {
            icon: "📱",
            title: "Local Data",
            description: "Everything stays on your phone",
            demo: true
          },
          {
            icon: "🎭",
            title: "No Personal Data",
            description: "Trade without revealing identity",
            demo: true
          },
          {
            icon: "🔄",
            title: "Tor Support",
            description: "Extra privacy layer available",
            demo: false
          }
        ],
        interactive: true
      },
      notes: "Click each feature to see visual demonstration of how it works."
    },
    {
      id: "economics",
      type: "interactive",
      template: "calculator",
      title: "The Economics of P2P",
      duration: 2,
      content: {
        component: "EconomicsCalculator",
        inputs: [
          { label: "Trade Amount", value: 1000, unit: "USD" },
          { label: "Exchange Fee", value: 2.5, unit: "%" },
          { label: "Withdrawal Fee", value: 25, unit: "USD" },
          { label: "Vexl Premium", value: 2, unit: "%" }
        ],
        comparison: true,
        interactive: true
      },
      notes: "Let audience adjust values to see savings. Show how P2P can actually be cheaper."
    },
    {
      id: "vision",
      type: "interactive",
      template: "vision",
      title: "The Vexl Vision",
      duration: 2,
      content: {
        component: "VisionMap",
        milestones: [
          { year: 2024, achievement: "50,000 users", status: "completed" },
          { year: 2025, achievement: "Global clubs network", status: "in-progress" },
          { year: 2026, achievement: "1M trades", status: "future" }
        ],
        worldMap: true,
        animated: true
      },
      notes: "Show the growth trajectory and global adoption vision."
    },
    {
      id: "get-started",
      type: "interactive",
      template: "cta",
      title: "Start Trading Today",
      duration: 2,
      content: {
        component: "GetStartedCTA",
        qrCode: true,
        downloadLinks: {
          ios: "https://apps.apple.com/app/vexl",
          android: "https://play.google.com/store/apps/vexl"
        },
        socialProof: {
          users: "50,000+",
          rating: 4.8,
          trades: "100,000+"
        },
        finalMessage: "Your network is waiting.",
        interactive: true
      },
      notes: "End with clear CTA. QR code on screen for easy download."
    }
  ]
};

export const interactiveComponents = {
  WebOfTrust: {
    type: "network",
    requires: ["d3", "framer-motion"],
    interactive: true
  },
  ContactImportDemo: {
    type: "selection",
    requires: ["framer-motion"],
    interactive: true
  },
  PhoneMockup: {
    type: "device",
    requires: ["framer-motion"],
    interactive: true
  },
  MarketplaceView: {
    type: "list",
    requires: ["framer-motion"],
    interactive: true
  },
  ClubsShowcase: {
    type: "cards",
    requires: ["framer-motion"],
    interactive: true
  },
  SecurityFeatures: {
    type: "showcase",
    requires: ["framer-motion"],
    interactive: true
  },
  EconomicsCalculator: {
    type: "calculator",
    requires: ["recharts"],
    interactive: true
  },
  VisionMap: {
    type: "map",
    requires: ["mapbox-gl"],
    interactive: true
  },
  GetStartedCTA: {
    type: "cta",
    requires: ["qrcode.js"],
    interactive: true
  }
};