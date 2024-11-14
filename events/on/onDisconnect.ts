import { Socket } from "socket.io";

export const onDisconnect = (socket: Socket) => {
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    return
  })
}