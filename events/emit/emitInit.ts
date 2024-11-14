import { Socket } from "socket.io";
import Character from "../../models/characterModel";
import { Player } from "../../types/player";
import { emitError } from "./emitError";
import { emitSuccess } from "./emitSuccess";

export const emitInit = (socket: Socket) => {
  socket.on('init', async () => {
    try {
      const characterId = socket.data.character

      if (!characterId) {
        emitError(socket, 'Cannot fetch character id from socket connection')
      }

      const character = await Character.findById(characterId)

      if (!character) {
        emitError(socket, 'Character not found')
      }

      emitSuccess(socket, character as Player)
    } catch (err) {
      if (err instanceof Error) {
        emitError(socket, err.message)
      } else {
        emitError(socket, 'Cannot initialize character')
      }
    }
  })
}