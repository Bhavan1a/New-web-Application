import React, { useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import { motion } from 'framer-motion'


export default function SearchBar({ onSearch, placeholder='Search by ingredient (eg: chicken, onion)' }){
const [q, setQ] = useState('')
const debounced = useDebounce(q, 600)


React.useEffect(()=>{
if(debounced !== undefined) onSearch(debounced)
},[debounced])


return (
<motion.div className="search-wrapper" initial={{opacity:0, y:12}} animate={{opacity:1,y:0}}>
<div className="input-group mb-3">
<input value={q} onChange={e=>setQ(e.target.value)} type="text" className="form-control form-control-lg" placeholder={placeholder} />
<button className="btn btn-outline-secondary" onClick={()=>onSearch(q)}>Search</button>
</div>
<div className="d-flex gap-2 justify-content-center small text-muted">
<span>Try: <button className="btn btn-link p-0" onClick={()=>{ setQ('chicken') }}>chicken</button>, <button className="btn btn-link p-0" onClick={()=>{ setQ('egg') }}>egg</button>, <button className="btn btn-link p-0" onClick={()=>{ setQ('rice') }}>rice</button></span>
</div>
</motion.div>
)
}