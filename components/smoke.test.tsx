import { render } from '@testing-library/react'
import Home from '@/app/page'

it('renders the main layout without crashing', () => {
  render(<Home />)
  expect(document.querySelector('main')).toBeInTheDocument()
})

