import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import RecipeDetailsPage from './pages/RecipeDetailsPage'
import NotFound from './pages/NotFound'


export default function App(){
return (
<div>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/favorites" element={<Favorites />} />
<Route path="/meal/:id" element={<RecipeDetailsPage />} />
<Route path="*" element={<NotFound />} />
</Routes>
</div>
)
}