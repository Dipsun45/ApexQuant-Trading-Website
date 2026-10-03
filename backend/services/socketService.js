let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log(`⚡ Client connected to Socket.IO: ${socket.id}`);

    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  return ioInstance;
};

const notifyUser = (userId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit(event, data);
    ioInstance.emit('global_update', { event, userId });
  }
};

const broadcastMarketUpdate = (stockData) => {
  if (ioInstance) {
    ioInstance.emit('market_update', stockData);
  }
};

module.exports = { initSocket, getIO, notifyUser, broadcastMarketUpdate };
