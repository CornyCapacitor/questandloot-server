import mongoose, { Schema } from 'mongoose'
import { ActivePotion, Armor, ArmorProficiency, ArmorSlot, Attributes, CharacterShop, Damage, Dungeon, DungeonProgress, Equipment, Jewelery, JewelerySlot, Journey, Material, Materials, Player, PlayerModel, Potion, Profession, Quality, Shield, SingleShop, Weapon, WeaponFamily, Zone } from '../types/player'
mongoose.set('strictQuery', true)

// profession
const professionEnum: Profession[] = ['warrior', 'mage', 'hunter']

// attributes
const attributesEnum: (keyof Attributes)[] = ['strength', 'agility', 'intellect', 'stamina', 'luck']
const attributesSchema = new Schema<Attributes>({
  strength: { type: Number, required: true },
  agility: { type: Number, required: true },
  intellect: { type: Number, required: true },
  stamina: { type: Number, required: true },
  luck: { type: Number, required: true },
}, { _id: false });

// quality
const qualityEnum: Quality[] = ['common', 'uncommon', 'rare', 'epic']

// activeJourney
const zoneSchema = new Schema<Zone>({
  name: { type: String, required: true },
  image: { type: String, required: true }
})
const activeJourneySchema = new Schema<Journey>({
  zone: { type: zoneSchema, required: true },
  valueMultiplier: { type: Number, required: true },
  startDate: { type: Date, required: true },
  returnDate: { type: Date, required: true }
}, { _id: false })

// dungeon)
const dungeonProgressSchema = new Schema<DungeonProgress>({
  dungeon1: { type: Number, min: 0, max: 10, default: null },
  dungeon2: { type: Number, min: 0, max: 10, default: null },
  dungeon3: { type: Number, min: 0, max: 10, default: null },
  dungeon4: { type: Number, min: 0, max: 10, default: null },
  dungeon5: { type: Number, min: 0, max: 10, default: null },
  dungeon6: { type: Number, min: 0, max: 10, default: null },
  dungeon7: { type: Number, min: 0, max: 10, default: null },
  dungeon8: { type: Number, min: 0, max: 10, default: null },
  dungeon9: { type: Number, min: 0, max: 10, default: null },
  dungeon10: { type: Number, min: 0, max: 10, default: null },
}, { _id: false });
const dungeonSchema = new Schema<Dungeon>({
  refreshDate: { type: Date, default: null },
  dungeonProgress: { type: dungeonProgressSchema, required: true }
}, { _id: false })

// activePotion
const potionSchema = new Schema<Potion>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  enchancing: {
    attribute: { type: String, enum: attributesEnum, required: true },
    value: { type: Number, required: true }
  },
  image: { type: String, required: true },
  type: { type: String, enum: ['potion'], required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  sellPrice: { type: Number, required: true }
}, { _id: false })
const activePotionSchema = new Schema<ActivePotion>({
  potion: { type: potionSchema, required: true },
  expiringDate: { type: Date, required: true }
}, { _id: false })

// weapon
const weaponFamilyEnum: WeaponFamily[] = ['sword', 'axe', 'mace', 'fire', 'frost', 'lightning', 'arcane', 'earth', 'air', 'dark', 'mystic', 'death', 'holy', 'water', 'bow', 'crossbow']
const damageSchema = new Schema<Damage>({
  min: { type: Number, required: true },
  max: { type: Number, required: true }
}, { _id: false })
const weaponSchema = new Schema<Weapon>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: Number, required: true },
  slot: { type: String, enum: ['weapon'], required: true },
  damage: { type: damageSchema, required: true },
  attributes: { type: attributesSchema, required: true },
  image: { type: String, required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  type: { type: String, enum: ['weapon'], required: true },
  family: { type: String, enum: weaponFamilyEnum, required: true },
  sellPrice: { type: Number, required: true }
}, { _id: false })

// armor
const armorProficiencyEnum: ArmorProficiency[] = ['heavy', 'medium', 'light']
const armorSlotEnum: ArmorSlot[] = ['head', 'chest', 'hands', 'legs', 'feet', 'belt']
const armorSchema = new Schema<Armor>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: Number, required: true },
  slot: { type: String, enum: armorSlotEnum, required: true },
  armor: { type: Number, required: true },
  attributes: { type: attributesSchema, required: true },
  image: { type: String, required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  proficiency: { type: String, enum: armorProficiencyEnum, required: true },
  type: { type: String, enum: ['armor'], required: true },
  sellPrice: { type: Number, required: true }
}, { _id: false })

// shield
const shieldSchema = new Schema<Shield>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: Number, required: true },
  slot: { type: String, enum: ['shield'], required: true },
  armor: { type: Number, required: true },
  attributes: { type: attributesSchema, required: true },
  image: { type: String, required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  type: { type: String, enum: ['shield'], required: true },
  sellPrice: { type: Number, required: true }
}, { _id: false })

// jewelery
const jewelerySlotEnum: JewelerySlot[] = ['neck', 'ring']
const jewelerySchema = new Schema<Jewelery>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: Number, required: true },
  slot: { type: String, enum: jewelerySlotEnum, required: true },
  attributes: { type: attributesSchema, required: true },
  image: { type: String, required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  type: { type: String, enum: ['jewelery'], required: true },
  sellPrice: { type: Number, required: true }
}, { _id: false })

// equipment
const equipmentSchema = new Schema<Equipment>({
  weapon: { type: weaponSchema, default: null },
  shield: { type: shieldSchema, default: null },
  head: { type: armorSchema, default: null },
  chest: { type: armorSchema, default: null },
  hands: { type: armorSchema, default: null },
  belt: { type: armorSchema, default: null },
  legs: { type: armorSchema, default: null },
  feet: { type: armorSchema, default: null },
  neck: { type: jewelerySchema, default: null },
  ring: { type: jewelerySchema, default: null },
}, { _id: false })

// materials
const materialSchema = new Schema<Material>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  sellPrice: { type: Number, required: true }
}, { _id: false });
const materialsSchema = new Schema<Materials>({
  material: { type: materialSchema, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

// shop
const singleShopSchema = new Schema<SingleShop>({
  lastRefresh: { type: String, default: null },
  items: [{ type: Schema.Types.Mixed, required: true, default: null }]
}, { _id: false })
const characterShopSchema = new Schema<CharacterShop>({
  blacksmith: { type: singleShopSchema, required: true },
  alchemist: { type: singleShopSchema, required: true }
}, { _id: false })

// player
const characterSchema = new Schema<Player>({
  user_id: { type: String, ref: 'User', required: [true, 'User ID is required'] },
  name: { type: String, required: [true, 'Player name is required'], unique: true },
  title: { type: String, default: null },
  description: { type: String, default: null },
  profession: { type: String, enum: professionEnum, required: true },
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
  attributes: { type: attributesSchema, required: true },
  activeJourney: { type: activeJourneySchema, default: null },
  dungeon: { type: dungeonSchema, required: true },
  activePotion: { type: activePotionSchema, default: null },
  equipment: { type: equipmentSchema, required: true },
  image: { type: String, required: true },
  inventory: [{ type: Schema.Types.Mixed, required: true }],
  materials: [{ type: materialsSchema, required: true }],
  gold: { type: Number, required: true },
  shop: { type: characterShopSchema, required: true }
})

characterSchema.statics.createCharacter = async function (userId: string, name: string, profession: Profession) {
  if (!userId || !name || !profession) {
    throw Error('All fields are required')
  }

  const duplicate = await this.findOne({ name: name })

  if (duplicate) {
    throw Error('Character with this name already exists')
  }

  const character: Player = await this.create({
    user_id: userId,
    name,
    title: null,
    description: null,
    profession,
    level: 1,
    experience: 0,
    attributes: {
      strength: 10,
      agility: 10,
      intellect: 10,
      stamina: 10,
      luck: 10
    },
    equipment: {
      weapon: null,
      shield: null,
      head: null,
      chest: null,
      hands: null,
      belt: null,
      legs: null,
      feet: null,
      neck: null,
      ring: null
    },
    image: 'human/human34.png',
    inventory: [],
    materials: [],
    gold: 100,
    dungeon: {
      refreshDate: null,
      dungeonProgress: {
        dungeon1: null,
        dungeon2: null,
        dungeon3: null,
        dungeon4: null,
        dungeon5: null,
        dungeon6: null,
        dungeon7: null,
        dungeon8: null,
        dungeon9: null,
        dungeon10: null,
      }
    },
    shop: {
      alchemist: {
        lastRefresh: null,
        items: []
      },
      blacksmith: {
        lastRefresh: null,
        items: []
      }
    }
  })

  return character
}

const characterModel = mongoose.model<Player, PlayerModel>('Character', characterSchema)

export default characterModel