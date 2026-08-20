export type Category = 'All' | 'Popular' | 'Pizza' | 'Burgers' | 'Sides'
export type MenuItem = { id: number; name: string; description: string; price: number; category: Exclude<Category, 'All' | 'Popular'>; image: string; rating: string; popular?: boolean }
export type CustomerDetails = { name: string; address: string; phone: string }
