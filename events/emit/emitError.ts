import { Socket } from "socket.io";

export const emitError = (socket: Socket, error: string) => {
  socket.emit('error', { error: error })
  return
}