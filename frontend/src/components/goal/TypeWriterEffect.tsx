import { motion } from 'framer-motion';
import React from 'react';
import './typewriter.css';

const TypewriterEffect = () => {
    const typewriterVariants = {
        hidden: { width: 0 },
        visible: { 
            width: '24em', // Same as your CSS animation
            transition: { 
                type: 'tween', // This type mimics the steps function in CSS
                duration: 4,
                delay: 1,
                repeat: Infinity 
            }
        },
        cursorBlink: {
            borderRightColor: ['rgba(255,255,255,0.75)', 'transparent'],
            transition: { 
                duration: 0.5,
                ease: 'steps(44)',
                repeat: Infinity,
                repeatType: 'reverse'
            }
        }
    };

    return (
        <motion.div
            className="line-1 anim-typewriter mt-[50px] garamond "
            variants={typewriterVariants}
            initial="hidden"
            animate="visible"
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} // Ensure no horizontal overflow
        >
            goal construction in progress...
        </motion.div>
    );
};

export default TypewriterEffect;
