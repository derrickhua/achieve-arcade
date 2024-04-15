import { completeHabit } from "@/lib/habit";
import { motion } from "framer-motion"
import { useState } from "react";
interface Habit {
    id: string;
    name: string;
    streak: number;
}

interface HabitCardProps {
    habit: Habit;
    onStreakUpdate: (updatedHabit: Habit) => void;
}

export default function HabitCard({ habit, onStreakUpdate }: HabitCardProps) {
    const [isHover, setHover] = useState(false);
    const handleIncrementStreak = async () => {
        try {
            const updatedHabit = {...habit, streak: habit.streak + 1};  // Increment locally for immediate feedback
            await completeHabit(habit.id);  
            onStreakUpdate(updatedHabit); 
        } catch (error) {
            console.error('Failed to increment streak:', error);
        }
    };

    return (
        <motion.div
            className="border rounded aspect-square max-w-[400px] max-h-[400px] min-w-[150px] min-h-[150px] w-[15vw] h-[15vw] cursor-pointer"
            whileHover={{
                scale: 1.2,
                rotate: 90
            }}
            whileTap={{
                scale: 0.8,
                rotate: -90,
                borderRadius: "100%"
            }}
            onClick={handleIncrementStreak}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="flex max-w-[400px] max-h-[400px] min-w-[150px] min-h-[150px] w-[15vw] h-[15vw] flex-col items-center justify-center"
                whileHover={{
                    rotate: -90  // Rotate in the opposite direction of the parent on hover
                }}
                whileTap={{
                    rotate: 90  // Rotate in the opposite direction of the parent on tap
                }}
                transition={{ duration: 0.2 }}  // Ensures that the rotation duration matches the parent's
            >
                <h2 className="font-semibold">{habit.name}</h2>
                <p>Streak: {habit.streak}</p>
            </motion.div>
        </motion.div>
    );
}
