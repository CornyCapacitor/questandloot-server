// Types
import { Socket } from "socket.io";
import { Player } from "../../types/player";
// Emits
import { emitError } from "../emit/emitError";
import { emitSuccess } from "../emit/emitSuccess";
// Models
import Character from "../../models/characterModel";

export const onUpdate = (socket: Socket) => {
  socket.on('update', async (data: Player) => {
    if (!data) {
      emitError(socket, 'No data to update')
    }

    try {
      const characterId = data._id
      const _characterId = socket.data.character

      if (characterId !== _characterId) {
        emitError(socket, 'Sent character id does not match connected character id')
      }

      const updatedCharacter = await Character.findByIdAndUpdate(
        characterId,
        { $set: data },
        {
          new: true,
          runValidators: true
        },
      )

      if (!updatedCharacter) {
        emitError(socket, 'Character not found')
      }

      emitSuccess(socket, updatedCharacter as Player)
    } catch (err) {
      if (err instanceof Error) {
        emitError(socket, err.message)
      } else {
        emitError(socket, 'Cannot update character')
      }
    }
  })
}