// utils/socket.ts
import { io, Socket } from "socket.io-client";

// Simple logger for socket events
const socketLogger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.warn(message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.warn(message, ...args);
  },
};

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API;

let socket: Socket | null = null;
let initializationCallbacks: (() => void)[] = [];
let isInitializing = false;
let lastAuthToken: string | null = null;

export const initSocket = async (authToken?: string) => {
  // Prevent multiple simultaneous initializations

  if (isInitializing) {
    socketLogger.log("🔄 Socket initialization already in progress...");

    return;
  }

  // If socket exists and token hasn't changed, do nothing

  if (socket && socket.connected && lastAuthToken === authToken) {
    socketLogger.log(
      "🔌 Socket already connected with same token, skipping initialization",
    );

    return;
  }

  if (!socket || socket.disconnected) {
    isInitializing = true;
    socketLogger.log("🔌 Initializing socket with URL:", SOCKET_SERVER_URL);
    socketLogger.log("🔑 Auth token:", authToken ? "Present" : "Missing");

    // Clean up existing socket if disconnected
    if (socket && socket.disconnected) {
      socket.removeAllListeners();
      socket = null;
    }

    const ip = await fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => data.ip)
      .catch(() => null);

    socket = io(SOCKET_SERVER_URL, {
      auth: { token: authToken || "", ip },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 20000,
      // Prevent duplicate connections
      forceNew: false,
    });

    lastAuthToken = authToken || null;

    socket.on("connect", () => {
      socketLogger.log("✅ Socket connected successfully!", socket?.id);
      socketLogger.log("🔗 Socket auth:", socket?.auth);
      isInitializing = false;

      // Call all pending callbacks once socket is connected
      initializationCallbacks.forEach((callback) => callback());
      initializationCallbacks = [];
    });

    socket.on("disconnect", (reason) => {
      socketLogger.log("❌ Socket disconnected:", reason);
      // Only set isInitializing to false if it's not a network issue
      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
        isInitializing = false;
      }
    });

    socket.on("connect_error", (error) => {
      socketLogger.warn("🔥 Socket connection error:", error);
      isInitializing = false;
    });

    socket.on("reconnect", (attemptNumber) => {
      socketLogger.log(
        "🔄 Socket reconnected after",
        attemptNumber,
        "attempts",
      );
      isInitializing = false;
    });

    socket.on("reconnect_error", (error) => {
      socketLogger.warn("🔥 Socket reconnection error:", error);
    });
  } else if (socket && socket.connected) {
    socketLogger.log("🔌 Socket already connected, checking auth token...");
    // Update auth token if socket already exists and token changed
    if (authToken && lastAuthToken !== authToken) {
      socketLogger.log("🔑 Updating auth token...");
      socket.auth = { token: authToken };
      lastAuthToken = authToken;
      // Re-authenticate without disconnecting
      socket.emit("authenticate", { token: authToken });
    }
  }
};

// Get the initialized socket instance
export const getSocket = (): Socket | null => socket;

// Subscribe to socket initialization
export const onSocketInitialized = (callback: () => void) => {
  if (socket && socket.connected) {
    // Socket is already initialized and connected, call immediately
    callback();
  } else {
    // Socket not ready yet, add to callbacks
    initializationCallbacks.push(callback);
  }
};

// Check if socket is connected
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

// Get socket connection status
export const getSocketStatus = () => {
  if (!socket) return "not_initialized";

  if (socket.connected) return "connected";

  if (socket.disconnected) return "disconnected";

  return "connecting";
};

// Disconnect and cleanup socket (only call on app unmount/browser close)
export const disconnectSocket = () => {
  if (socket) {
    socketLogger.log("🔌 Disconnecting socket");
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    lastAuthToken = null;
    isInitializing = false;
    initializationCallbacks = [];
  }
};

// Add browser unload cleanup
if (typeof window !== "undefined") {
  const cleanup = () => {
    if (socket && socket.connected) {
      // Only disconnect on actual page unload, not route changes
      socket.disconnect();
    }
  };

  // Listen for browser close/refresh
  window.addEventListener("beforeunload", cleanup);
  window.addEventListener("unload", cleanup);
}

// Cleanup function for manual removal
export const removeUnloadListeners = () => {
  if (typeof window !== "undefined") {
    const cleanup = () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };

    window.removeEventListener("beforeunload", cleanup);
    window.removeEventListener("unload", cleanup);
  }
};
