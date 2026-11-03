import http from 'http';
import fs from 'fs';
import path from 'path';

let tasks = [
  { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul Sharma', status: 'Pending' }
];

const send = (res, code, type, body) => {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
};

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    send(res, 200, 'text/html', '<h1>Welcome to Employee Task Management</h1>');
  } else if (url === '/tasks' && method === 'GET') {
    send(res, 200, 'application/json', JSON.stringify(tasks));
  } else if (url === '/about' && method === 'GET') {
    send(res, 200, 'text/plain', 'Employee Task Management Application - Node.js HTTP module demo');
  } else if (url === '/home' && method === 'GET') {
    fs.readFile(path.join('public', 'index.html'), (err, data) => {
      if (err) return send(res, 500, 'text/plain', 'Error reading file');
      send(res, 200, 'text/html', data);
    });
  } else if (url === '/add-task' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const t = JSON.parse(body);
        if (!t.id || !t.taskName || !t.assignedTo || !t.status) {
          return send(res, 400, 'application/json',
            JSON.stringify({ error: 'id, taskName, assignedTo and status are required' }));
        }
        tasks.push(t);
        send(res, 201, 'application/json',
          JSON.stringify({ message: 'Task added successfully', task: t }));
      } catch {
        send(res, 400, 'application/json', JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    send(res, 404, 'text/plain', '404 Not Found');
  }
});

server.listen(3000, () => console.log('HTTP Server running at http://localhost:3000'));