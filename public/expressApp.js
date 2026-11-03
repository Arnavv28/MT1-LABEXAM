import express from 'express';
const app = express();
app.use(express.json());

let tasks = [
  { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul Sharma', status: 'Pending', priority: 'High' },
  { id: 2, taskName: 'Design Database', assignedTo: 'Priya Singh', status: 'In Progress', priority: 'Medium' },
  { id: 3, taskName: 'Write Documentation', assignedTo: 'Neha Verma', status: 'Pending', priority: 'Low' }
];

app.get('/tasks', (req, res) => res.json(tasks));

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;
  if (!id || !taskName || !assignedTo || !status || !priority)
    return res.status(400).json({ message: 'All fields are required' });
  if (tasks.some(t => t.id === id))
    return res.status(400).json({ message: 'Task ID already exists' });
  const task = { id, taskName, assignedTo, status, priority };
  tasks.push(task);
  res.status(201).json({ message: 'Task added successfully', task });
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const { taskName, assignedTo, status, priority } = req.body;
  Object.assign(task, { taskName, assignedTo, status, priority });
  res.json({ message: 'Task updated successfully', task });
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks.splice(index, 1);
  res.json({ message: 'Task deleted successfully' });
});

app.listen(4000, () => console.log('Express Server running at http://localhost:4000'));