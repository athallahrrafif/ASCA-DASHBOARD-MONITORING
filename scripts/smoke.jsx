import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})
global.window = dom.window
global.document = dom.window.document
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true })
for (const key of ['HTMLElement', 'SVGElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'CustomEvent', 'DOMRect', 'MutationObserver', 'IntersectionObserver']) {
  if (dom.window[key]) global[key] = dom.window[key]
}
global.HTMLElement = dom.window.HTMLElement
global.Element = dom.window.Element
global.Node = dom.window.Node
global.getComputedStyle = dom.window.getComputedStyle
global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16)
global.cancelAnimationFrame = clearTimeout
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
dom.window.ResizeObserver = global.ResizeObserver
global.matchMedia = dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })

const errors = []
const origError = console.error
console.error = (...args) => { errors.push(args.join(' ')); origError(...args) }

const React = (await import('react')).default
const { createRoot } = await import('react-dom/client')
const { MemoryRouter } = await import('react-router-dom')
const App = (await import('../src/App.jsx')).default
const { ThemeProvider } = await import('../src/context/ThemeContext.jsx')

const routes = ['/', '/dashboard', '/interactions', '/analytics', '/feedback', '/bot-monitoring',
  '/academic-info', '/courses', '/documents', '/knowledge-base', '/profile', '/tidak-ada']

for (const route of routes) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  await new Promise((resolve) => {
    root.render(React.createElement(ThemeProvider, null,
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App))))
    setTimeout(resolve, 2200)
  })
  const text = container.textContent || ''
  console.log(`${route.padEnd(18)} ${text.length.toString().padStart(5)} chars  ${text.slice(-90).replace(/\s+/g, ' ')}`)
  root.unmount()
  container.remove()
}

const real = errors.filter((e) => !/not wrapped in act|Warning: ReactDOM/.test(e))
console.log('\nERRORS:', real.length)
real.slice(0, 8).forEach((e) => console.log('-', e.slice(0, 300)))
process.exit(real.length ? 1 : 0)
