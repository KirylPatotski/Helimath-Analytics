const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000; 
const EVENTS_DIR = path.join(__dirname, 'events');  
 
if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR);
}
 
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => { 
      const eventData = JSON.parse(data);
 
      if (eventData.eventId) {
        const eventFileName = path.join(EVENTS_DIR, `${eventData.eventId}.txt`);
 
        const timestamp = new Date().toISOString();
        fs.appendFileSync(eventFileName, `${timestamp}\n`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Event timestamp recorded.' }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid event ID.' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found.' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
