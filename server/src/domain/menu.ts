export type MenuCategory = 'Pizza' | 'Burgers' | 'Sides'

export type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  category: MenuCategory
  image: string
}

export const menu: MenuItem[] = [
  { id: 1, name: 'Truffle Mushroom', description: 'Roasted mushrooms, garlic cream, thyme & pecorino', price: 18, category: 'Pizza', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Crispy Chicken', description: 'Buttermilk chicken, pickles, slaw & hot honey', price: 15, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Spicy Diavola', description: 'Nduja, pepperoni, fermented chilli & mozzarella', price: 19, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Smoky Double', description: 'Two smashed patties, smoked cheddar & house sauce', price: 17, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Rosemary Fries', description: 'Sea salt, rosemary and aged parmesan', price: 7, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Burrata Verde', description: 'Creamy burrata, basil oil, peas & sourdough', price: 13, category: 'Sides', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=900&q=85' },
]
