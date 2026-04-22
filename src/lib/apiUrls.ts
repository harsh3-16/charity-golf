export const apiUrls = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/signup',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  scores: {
    list: '/api/scores',
    create: '/api/scores',
    update: (id: string) => `/api/scores/${id}`,
    delete: (id: string) => `/api/scores/${id}`,
  },
  charities: {
    list: '/api/charities',
    get: (id: string) => `/api/charities/${id}`,
    featured: '/api/charities/featured',
    admin: {
      create: '/api/admin/charities',
      update: (id: string) => `/api/admin/charities/${id}`,
      delete: (id: string) => `/api/admin/charities/${id}`,
    }
  },
  draws: {
    list: '/api/draws',
    upcoming: '/api/draws/upcoming',
    simulate: '/api/draws/simulate',
    publish: '/api/draws/publish',
  },
  winnings: {
    list: '/api/admin/winnings',
    approve: (id: string) => `/api/admin/winnings/${id}/approve`,
    reject: (id: string) => `/api/admin/winnings/${id}/reject`,
  },
  subscriptions: {
    checkout: '/api/subscriptions/checkout',
    portal: '/api/subscriptions/portal',
    status: '/api/subscriptions/status',
  },
  users: {
    updateCharity: '/api/users/charity',
  },
  admin: {
    stats: '/api/admin/stats',
    revenue: '/api/admin/revenue',
    charityStats: '/api/admin/charity-stats',
    usersList: '/api/admin/users',
  },
} as const;
