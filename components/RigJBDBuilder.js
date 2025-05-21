'use client';

import { useState } from 'react';
import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';

const Input = (props) => <input {...props} className="border rounded p-2 w-full" />;
const Textarea = (props) => <textarea {...props} className="border rounded p-2 w-full" />;
const Button = (props) => <button {...props} className="px-4 py-2 bg-blue-600 text-white rounded" />;
const Select = ({ children, onValueChange }) => (
  <select onChange={(e) => onValueChange(e.target.value)} className="border rounded p-2 w-full">
    <option value="">Select...</option>
    {children}
  </select>
);
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

export default function RigJBDBuilder() {
  const [operation, setOperation] = useState('');
  const [rig, setRig] = useState('');
  const [pic, setPic] = useState('');
  const [lofHazard, setLofHazard] = useState('');
  const [workers, setWorkers] = useState([]);
  const [workerName, setWorkerName] = useState('');
  const [diagram, setDiagram] = useState('');
  const [stepBack, setStepBack] = useState(false);
  const [stepBackArea, setStepBackArea] = useState({ width: 100, height: 100, x: 0, y: 0 });
  const [positions, setPositions] = useState({});
  const [tasks, setTasks] = useState([]);
  const [taskStep, setTaskStep] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');

  const handleAddWorker = () => {
    if (workerName.trim()) {
      setWorkers([...workers, workerName]);
      setWorkerName('');
    }
  };

  const handleAddTask = () => {
    if (taskStep && selectedWorker) {
      setTasks([...tasks, { step: taskStep, person: selectedWorker }]);
      setTaskStep('');
      setSelectedWorker('');
    }
  };

  const updatePosition = (index, data) => {
    setPositions({ ...positions, [index]: { x: data.x, y: data.y } });
  };

  const handleGeneratePDF = async () => {
    console.log("📤 Sending data to /api/generate-jbd", {
      operation, rig, pic, lofHazard, workers, tasks
    });

    try {
      const res = await fetch('/api/generate-jbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, rig, pic, lofHazard, workers, tasks })
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      console.log("✅ PDF Blob URL:", url, typeof url);
      setPdfBlobUrl(url);
    } catch (err) {
      console.error("❌ Error generating PDF:", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Input placeholder="Operation" value={operation} onChange={(e) => setOperation(e.target.value)} />
        <Input placeholder="Rig" value={rig} onChange={(e) => setRig(e.target.value)} />
        <Input placeholder="PIC" value={pic} onChange={(e) => setPic(e.target.value)} />
      </div>
      <Textarea placeholder="Line of Fire Hazard" value={lofHazard} onChange={(e) => setLofHazard(e.target.value)} />
      <div className="flex gap-4 items-end">
        <Input placeholder="Add Personnel" value={workerName} onChange={(e) => setWorkerName(e.target.value)} />
        <Button onClick={handleAddWorker}>Add</Button>
      </div>
      <div className="space-y-2">
        <Select onValueChange={setDiagram}>
          <SelectItem value="Drillfloor">Drillfloor</SelectItem>
          <SelectItem value="Helideck">Helideck</SelectItem>
          <SelectItem value="Deck">Deck</SelectItem>
        </Select>
        {diagram && (
          <div className="relative border w-full max-w-3xl h-[500px] overflow-hidden bg-white">
            <img src={`/${diagram}.png`} alt={diagram} className="absolute w-full h-full object-contain" />
            {stepBack && (
              <Rnd
                size={{ width: stepBackArea.width, height: stepBackArea.height }}
                position={{ x: stepBackArea.x, y: stepBackArea.y }}
                onDragStop={(e, d) => setStepBackArea({ ...stepBackArea, x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setStepBackArea({
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    ...position
                  });
                }}
                style={{ border: '2px dashed green', backgroundColor: 'rgba(0,255,0,0.1)', zIndex: 1 }}
              />
            )}
            {workers.map((w, i) => (
              <Draggable
                key={i}
                position={positions[i] || { x: 10 * i, y: 10 * i }}
                onStop={(e, data) => updatePosition(i, data)}
              >
                <div
                  title={w}
                  className="absolute w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center cursor-move z-10"
                >
                  {i + 1}
                </div>
              </Draggable>
            ))}
          </div>
        )}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={stepBack} onChange={() => setStepBack(!stepBack)} /> Add Step Back Area
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Task Step" value={taskStep} onChange={(e) => setTaskStep(e.target.value)} />
        {console.log("👀 Workers:", workers)}
        <Select onValueChange={setSelectedWorker} value={selectedWorker}>
          {workers.map((w, i) => {
            const label = typeof w === 'string' ? w : JSON.stringify(w);
            return <SelectItem key={i} value={label}>{label}</SelectItem>;
          })}
        </Select>
        <Button onClick={handleAddTask} className="col-span-2">Add Task</Button>
      </div>
      <ul className="space-y-1">
        {tasks.map((t, i) => {
          const step = typeof t.step === 'string' ? t.step : JSON.stringify(t.step);
          const person = typeof t.person === 'string' ? t.person : JSON.stringify(t.person);
          return (
            <li key={i} className="border p-2 rounded">
              Step: {step} | Person: {person}
            </li>
          );
        })}
      </ul>
      <Button onClick={handleGeneratePDF} className="w-full bg-green-600 text-white mt-4">Generate PDF Preview</Button>
      {typeof pdfBlobUrl === 'string' && pdfBlobUrl.startsWith('blob:') && (
        <iframe src={pdfBlobUrl} title="PDF Preview" className="w-full h-[800px] border mt-4" />
      )}
    </div>
  );
}