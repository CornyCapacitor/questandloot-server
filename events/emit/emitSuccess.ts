import { Socket } from "socket.io";
import { Player } from "../../types/player";

export const emitSuccess = (socket: Socket, callbackData: Player) => {
  socket.emit('success', callbackData)
  return
}