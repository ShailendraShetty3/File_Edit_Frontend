import {useState} from 'react';

const BoundingBoxDisplay = ({ pages }) => {
    const [editedData, setEditedData] = useState([]);
  
    const handleTextChange = (index, newText) => {
      const newData = [...editedData];
      newData[index].text = newText;
      setEditedData(newData);
    };
  
    return (
      <div>
        {pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            <canvas
              ref={(canvas) => {
                if (canvas) {
                  const context = canvas.getContext('2d');
                  canvas.width = page.canvas.width;
                  canvas.height = page.canvas.height;
                  context.drawImage(page.canvas, 0, 0);
                }
              }}
            />
            {page.textContent.items.map((item, textIndex) => (
              <input
                key={textIndex}
                type="text"
                value={editedData[textIndex]?.text || item.str}
                onChange={(e) => handleTextChange(textIndex, e.target.value)}
                style={{
                  position: 'absolute',
                  left: item.transform[4], // X position from text transform matrix
                  top: item.transform[5],  // Y position from text transform matrix
                  border: '1px solid red',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };
  

  export default BoundingBoxDisplay;