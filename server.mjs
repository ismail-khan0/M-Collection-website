// server.mjs (fully updated and merged)
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    path: "/api/socket.io",
    cors: {
      origin: `http://${hostname}:${port}`,
      methods: ["GET", "POST"],
    },
  });

  // Track admin status
  let adminOnline = false;
  const adminSockets = new Set();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle admin connection
    socket.on("join-admin-room", () => {
      adminSockets.add(socket.id);
      adminOnline = true;
      io.emit("admin-status", true);
      socket.join("admin_room");
      console.log(`Admin joined: ${socket.id}`);
    });

    // Handle user joining private room
    socket.on("join-private-room", ({ userId, username }) => {
      socket.join(`user_${userId}`);
      socket.userId = userId;
      socket.username = username;
      console.log(`User ${username} (${userId}) joined private room`);
      socket.emit("admin-status", adminOnline);
    });

    // Handle private messages
    socket.on("private-message", (data) => {
      console.log("Private message received:", data);

      // Message from user to admin
      if (data.recipient === "admin") {
        io.to("admin_room").emit("private-message", {
          ...data,
          sender: "user",
          senderName: data.senderName || "User",
          timestamp: data.timestamp || new Date().toISOString(),
        });

        // Update conversation list for admin
        io.to("admin_room").emit("conversation-update", {
          userId: data.senderId,
          lastMessage: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
          unread: true,
        });
      }

      // Message from admin to user
      else if (data.recipientId) {
        io.to(`user_${data.recipientId}`).emit("private-message", {
          ...data,
          sender: "admin",
          senderName: data.senderName || "Support Agent",
          timestamp: data.timestamp || new Date().toISOString(),
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      if (adminSockets.has(socket.id)) {
        adminSockets.delete(socket.id);
        adminOnline = adminSockets.size > 0;
        io.emit("admin-status", adminOnline);
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
