import React from 'react'
import { extractIngredients } from '../utils/formatUtils'
import { addFavorite, removeFavorite, isFavorite } from '../utils/localStorageUtils'
import { motion } from 'framer-motion'


export default function RecipeDetails({ meal }){
if(!meal) return null
const items = extractIngredients(meal)
const fav = isFavorite(meal.idMeal)


const toggleFav = () => {
if(fav) removeFavorite(meal.idMeal)
else addFavorite({ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb })
// force rerender via event or state in parent if needed
window.dispatchEvent(new Event('favorites-changed'))
}


return (
<motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-3">
<div className="row">
<div className="col-md-5">
<img src={meal.strMealThumb} className="img-fluid rounded mb-3" alt={meal.strMeal} />
<div className="d-flex gap-2">
<button className={`btn ${fav? 'btn-danger':'btn-outline-danger'}`} onClick={toggleFav}>{fav? 'Remove Favorite':'Add to Favorites'}</button>
<a className="btn btn-outline-secondary" href={meal.strSource || meal.strYoutube || '#'} target="_blank" rel="noreferrer">Open Source</a>
</div>
</div>
<div className="col-md-7">
<h2>{meal.strMeal}</h2>
<p className="text-muted">{meal.strArea} · {meal.strCategory}</p>
<h5>Ingredients</h5>
<ul>
{items.map((it, idx)=> (
<li key={idx}>{it.ingredient} — <small className="text-muted">{it.measure}</small></li>
))}
</ul>
<h5>Instructions</h5>
<p style={{whiteSpace:'pre-wrap'}}>{meal.strInstructions}</p>
{meal.strYoutube && (
<div>
<h6>Video</h6>
<a href={meal.strYoutube} target="_blank" rel="noreferrer">Watch on YouTube</a>
</div>
)}
</div>
</div>
</motion.div>
)
}