import React, { useState } from "react";

const EditableBoundingBox = ({ word, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(word.text);

  const handleEdit = () => setEditMode(true);
  const handleSave = () => {
    setEditMode(false);
    onSave(editedText);
  };

  return (
    <div
      style={{
        position: "absolute",
        border: "1px solid red",
        left: `${word.bbox.x0}px`,
        top: `${word.bbox.y0}px`,
        width: `${word.bbox.x1 - word.bbox.x0}px`,
        height: `${word.bbox.y1 - word.bbox.y0}px`,
        backgroundColor: editMode ? "rgba(255, 255, 255, 0.8)" : "transparent",
      }}
    >
      {editMode ? (
        <input
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <span>{word.text}</span>
      )}
      <button onClick={editMode ? handleSave : handleEdit}>
        {editMode ? "Save" : "Edit"}
      </button>
    </div>
  );
};

export default EditableBoundingBox;
