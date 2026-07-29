/**
 * Socket.IO Real-time Integration for Notification Module
 * Manages user-specific socket rooms and real-time event emissions.
 */

let ioInstance = null;

/**
 * Initialize Socket.IO server instance and configure user connection rooms
 * @param {Object} io - Socket.IO server instance
 */
export const initNotificationSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    // Authenticated user ID passed via socket auth object or handshake query
    const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;

    if (userId) {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`[Socket.IO] User ${userId} connected and joined room: ${roomName}`);

      socket.on("disconnect", () => {
        console.log(`[Socket.IO] User ${userId} disconnected from room: ${roomName}`);
      });
    }
  });
};

/**
 * Emit real-time socket event to a target user's dedicated room
 * @param {string} userId - Target User CUID
 * @param {string} event - Event name ('notification:new', 'notification:read', 'notification:all-read')
 * @param {Object} payload - Data payload
 */
export const emitToUser = (userId, event, payload) => {
  if (!ioInstance) {
    console.warn(`[Socket.IO Warning] Socket instance not initialized. Event ${event} skipped for user ${userId}.`);
    return false;
  }

  const roomName = `user_${userId}`;
  ioInstance.to(roomName).emit(event, payload);
  console.log(`[Socket.IO Emission] Event '${event}' sent to room '${roomName}'`);
  return true;
};
