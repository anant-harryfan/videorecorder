import {  QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Toaster } from 'sonner'
import ControlLayout from './layouts/ControlLayout'
import AuthButton from './components/global/AuthButton'
import Widgit from './components/global/widgit'

function App() {
const client = new QueryClient()

  return (
    <QueryClientProvider client={client}>
      <ControlLayout>
<AuthButton/>
<Widgit/>
      </ControlLayout>
      <Toaster/>
    </QueryClientProvider>
  )
}

export default App
