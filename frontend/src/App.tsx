import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home'

const router = createBrowserRouter([
  {path: "/", element: <Home />}
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
