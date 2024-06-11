import React from 'react';

const EmojiPicker = ({ emojis, onSelect }) => {
  const rows = [];
  const emojisPerRow = 10;

  for (let i = 0; i < emojis.length; i += emojisPerRow) {
    const rowEmojis = emojis.slice(i, i + emojisPerRow);
    rows.push(rowEmojis);
  }

  return (
    <div className="emoji-picker">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="emoji-row">
          {row.map((emoji, emojiIndex) => (
            <button
              key={emojiIndex}
              className="emoji-button"
              onClick={() => onSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      ))}
      <style jsx>{`
        .emoji-picker {
          display: flex;
          flex-direction: column;
        }
        .emoji-row {
          display: flex;
          justify-content: space-between;
        }
        .emoji-button {
          font-size: 24px;
          padding: 5px;
          border: none;
          background: none;
          cursor: pointer;
        }
        .emoji-button:hover {
          background-color: #f0f0f0;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default EmojiPicker;
