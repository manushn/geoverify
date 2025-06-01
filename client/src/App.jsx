import { useState,lazy} from 'react'
const Login =lazy(()=>import ('./pages/login'))
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Login/>
    </>
  )
}

export default App
