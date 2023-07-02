const SocketIO = require("socket.io");

const onlineMap = {};
module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: "/socket.io",
  });
  app.set("io", io);
  app.set("onlineMap", onlineMap);
  const dynamicNsp = io.of(/^\/ws-.+$/).on("connect", (socket) => {
    const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
      console.log(`callUser === namespace ${newNamespace} nspname(${socket.nsp.name})`)

      newNamespace.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });
    // broadcast to all clients in the given sub-namespace
    socket.emit("hello", socket.nsp.name);
    socket.on("login", ({ id, channels }) => {
      onlineMap[socket.nsp.name][socket.id] = id;
      newNamespace.emit(
        "onlineList",
        Object.values(onlineMap[socket.nsp.name])
      );
      channels.forEach((channel) => {
        socket.join(`${socket.nsp.name}-${channel}`);
      });
    });

    socket.on("answerCall", (data) => {
      console.log(`data.to(${data.to})`)
      newNamespace.to(data.to).emit("callAccepted", data.signal)
    });

    socket.on("disconnect", () => {
      delete onlineMap[socket.nsp.name][socket.id];
      newNamespace.emit(
        "onlineList",
        Object.values(onlineMap[socket.nsp.name])
      );
    });
  });
};
