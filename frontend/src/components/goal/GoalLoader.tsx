import { motion } from "framer-motion";
import { Hammer } from 'lucide-react';
import TypewriterEffect from "./TypeWriterEffect";

export default function Loader() {
    return (
        <div className="flex flex-col items-center p-4">
            <motion.div
                className="border w-[70px] h-[70px] p-4 flex items-center justify-center"
                animate={{
                    scale: [1, 1, 1, 1, 1],
                    rotate: [0, 0, 360, 360, 0],
                    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1,
                }}
            >
                <div className="w-[70px] h-[70px] flex items-center justify-center">
                    <Hammer size={50} />
                </div>
            </motion.div>
            <TypewriterEffect />
        </div>
    );
}
