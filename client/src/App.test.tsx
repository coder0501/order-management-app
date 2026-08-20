import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('order experience', () => {
  it('filters the menu by category', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Pizza' }))
    expect(screen.getByRole('heading', { name: 'Truffle Mushroom' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Spicy Diavola' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Crispy Chicken' })).not.toBeInTheDocument()
  })

  it('adds an item and changes its quantity in the cart', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add Truffle Mushroom to cart' }))
    await user.click(screen.getByRole('button', { name: 'Open cart' }))
    expect(screen.getByRole('heading', { name: /Your order/ })).toBeInTheDocument()
    expect(screen.getAllByText('$18.00').length).toBeGreaterThan(0)
    await user.click(screen.getAllByRole('button', { name: 'Increase quantity' }).at(-1)!)
    expect(screen.getAllByText('$36.00').length).toBeGreaterThan(0)
  })

  it('requires delivery details before placing an order', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add Truffle Mushroom to cart' }))
    await user.click(screen.getByRole('button', { name: 'Open cart' }))
    await user.click(screen.getByRole('button', { name: 'Checkout' }))
    await user.click(screen.getByRole('button', { name: 'Place order' }))
    expect(screen.getByLabelText('Name')).toBeInvalid()
  })
})