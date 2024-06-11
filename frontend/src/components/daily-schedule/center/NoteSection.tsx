import React, { useState, useEffect } from 'react';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onNotesChange }) => {
  const [currentNotes, setCurrentNotes] = useState(notes);

  useEffect(() => {
    const handler = setTimeout(() => {
      onNotesChange(currentNotes);
    }, 500); // Debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [currentNotes, onNotesChange]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNotes(e.target.value);
  };

  const textareaStyle = {
    width: '100%',
    border: '2px dashed black',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: '',
    color: 'black',
    resize: 'none',
    backgroundImage: `
      linear-gradient(
        transparent, 
        transparent calc(1.5em - 1px), 
        black calc(1.5em - 1px)
      )
    `,
    backgroundSize: '100% 1.5em', // Adjust the size to match line height
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Notes</h2>
      <textarea
      className='h-48 p-1 px-4'
        style={textareaStyle}
        value={currentNotes}
        onChange={handleNotesChange}
        placeholder="Type your notes here..."
      />
    </div>
  );
};

export default NotesSection;
