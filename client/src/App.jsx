import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import SignUp from './Pages/SignUp/SignUp'
import Landing from './Pages/Landing/Landing'
import SignIn from './Pages/SignIn/SignIn'
import Products from './Pages/Products/Products'
import Cart from './Pages/Cart/Cart'
import Admin from './Pages/Admin/Admin'

axios.defaults.withCredentials=true

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Landing/>} path="/"></Route>
        <Route element={<SignUp/>} path='/signUp'></Route>
        <Route element={<SignIn/>} path='/signIn'></Route>
        <Route element={<Products/>} path='/allProducts'></Route>
        <Route element={<Cart/>} path='/myCart'></Route>
        <Route element={<Admin/>} path='/adminPage'></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
