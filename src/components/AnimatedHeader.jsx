import React from 'react'
import { motion } from 'framer-motion'


export default function AnimatedHeader(){
return (
<div className="header-hero">
<motion.h1 initial={{y:20, opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.1}}>Welcome back, Taylor 👋</motion.h1>
<motion.p initial={{y:10, opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}}>Find recipes fast — search by ingredients you already have.</motion.p>
</div>
)
}