// // NotebookEditor.jsx
// import React, { useState } from 'react';
// import { Rnd } from 'react-rnd';
// import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';
// import './NotebookEditor.css'

// export default function NotebookEditor({ note, onSave, onClose }) {
//   const [boxes, setBoxes] = useState(note.content.textBoxes);

//   const updateBox = (id, data) => {
//     setBoxes(bs => bs.map(b => b.id===id ? { ...b, ...data } : b));
//   };

//   const addBox = () => {
//     setBoxes(bs => [
//       ...bs,
//       {
//         id: `box-${Date.now()}`,
//         text: '',
//         x: 50, y: 50, width: 200, height: 80
//       }
//     ]);
//   };

//   return (
//     <div className="notebook-editor-backdrop">
//       <div className="notebook-editor">
//         <div className="editor-header">
//           <button onClick={onClose}><FaTimes/></button>
//           <button onClick={() => onSave({ ...note, content: { textBoxes: boxes } })}>
//             <FaSave/> Save
//           </button>
//         </div>
//         <div className="editor-canvas">
//           {boxes.map(box => (
//             <Rnd
//               key={box.id}
//               size={{ width: box.width, height: box.height }}
//               position={{ x: box.x, y: box.y }}
//               onDragStop={(e, d) => updateBox(box.id, { x: d.x, y: d.y })}
//               onResizeStop={(e, dir, ref, delta, pos) => {
//                 updateBox(box.id, {
//                   width: parseInt(ref.style.width, 10),
//                   height: parseInt(ref.style.height, 10),
//                   ...pos
//                 });
//               }}
//             >
//               <textarea
//                 value={box.text}
//                 onChange={e => updateBox(box.id, { text: e.target.value })}
//                 style={{ width: '100%', height: '100%' }}
//               />
//             </Rnd>
//           ))}
//         </div>
//         <button className="add-box-btn" onClick={addBox}><FaPlus/> Add Box</button>
//       </div>
//     </div>
//   );
// }
