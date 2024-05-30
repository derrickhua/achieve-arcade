import React from 'react';

interface ProgressBarProps {
  progress: number | string; // Progress percentage (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {

  return (
    <div className='w-full h-full flex justify-center items-center'>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
        ></div>
        </div>
    </div>
  );
};

export default ProgressBar;
