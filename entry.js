import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import cors from 'cors';
import databaseRouter from './routers/database.js';
import userController from './routers/user.js';



const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(cors());

// Pass io instance to the router
app.use((req, res, next) => {
  req.io = io;
  req.app.set('view engine', 'ejs');
  next();
});

app.use('/database', databaseRouter);
app.use('/user', userController);

app.use(express.static('public'))

// Start the server
server.listen(25565, '192.168.2.56', () => {
  console.log('Server is running on port 3000');
});



