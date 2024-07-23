import React, { useState } from 'react';
import { submitSuggestion } from '@/lib/suggestion';

const SuggestionForm: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject) {
      setMessage('Subject is required');
      setIsError(true);
      return;
    }

    if (!description) {
        setMessage('Description is required');
        setIsError(true);
        return;
      }

    const suggestionData = { subject, description };
    try {
      const response = await submitSuggestion(suggestionData);
      setMessage(response.message);
      setIsError(false);
    } catch (error) {
      setMessage('Error submitting suggestion');
      setIsError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[90vw] md:w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[30px] md:text-[40px] leading-none">EXPERIENCING ISSUES?</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px] md:text-[25px]">Tell me about it :D</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-[20px] md:text-[25px] mb-2" htmlFor="subject">Subject</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-[20px] md:text-[25px] mb-2" htmlFor="description">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg bg-white"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your situation"
              rows={4}
            />
          </div>
          {message && (
            <div className={`mb-4 text-[20px] ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestionForm;
