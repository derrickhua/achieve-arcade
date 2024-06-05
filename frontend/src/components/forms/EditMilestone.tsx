import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateMilestone, Milestone } from '@/lib/goals';

interface EditMilestoneFormProps {
  milestone: Milestone;
  goalId: string;
  onClose: () => void;
  fetchMilestones: () => Promise<void>;
}

const EditMilestoneForm: React.FC<EditMilestoneFormProps> = ({ milestone, goalId, onClose, fetchMilestones }) => {
  const [title, setTitle] = useState(milestone.title || '');
  const [description, setDescription] = useState(milestone.description || '');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const maxTitleLength = 30;
  const maxDescriptionLength = 90;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxTitleLength) {
      setTitle(e.target.value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxDescriptionLength) {
      setDescription(e.target.value);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!title) {
      setShowAlert(true);
      setAlertMessage('Title is required.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const updateData = {
      title,
      description,
    };

    try {
      await updateMilestone(goalId, milestone._id, updateData);
      await fetchMilestones();
      setShowAlert(true);
      setAlertMessage('Milestone updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update milestone:', error);
      setShowAlert(true);
      setAlertMessage('Error updating milestone. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-[#FEFDF2] rounded-xl p-8 relative w-[600px]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black text-xl" onClick={onClose}>
          X
        </button>
        <h2 className="text-[40px] mr-4">EDIT MILESTONE</h2>
        <p className="text-[#BDBDBD] mb-4 text-[20px]">Update your milestone details here!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="title">Milestone Title</label>
            <input
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter milestone title"
              maxLength={maxTitleLength}
              required
            />
            <div className="text-right text-[14px] text-[#BDBDBD]">
              {title.length}/{maxTitleLength} characters
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-black text-[25px] mb-2" htmlFor="description">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-lg"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your milestone"
              maxLength={maxDescriptionLength}
              rows={4}
            />
            <div className="text-right text-[14px] text-[#BDBDBD]">
              {description.length}/{maxDescriptionLength} characters
            </div>
          </div>
          {showAlert && (
            <Alert variant={alertMessage.includes("successfully") ? 'default' : 'destructive'}>
              <AlertTitle>{alertMessage.includes("successfully") ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white border-[3px] border-black hover:text-black text-[20px]"
            >
              Update Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMilestoneForm;
