import { render, screen } from '@testing-library/react'
import { Header } from './header'

it('renders header without crashing', () => {
  render(<Header />)
  expect(screen.getByText(/Nano Banana/i)).toBeInTheDocument()
})
