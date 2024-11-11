import mongoose from 'mongoose'
import { ActivePotion, Armor, ArmorProficiency, ArmorSlot, Attributes, CharacterShop, Damage, Equipment, Jewelery, JewelerySlot, Journey, Material, Materials, Player, Potion, Profession, Quality, Shield, SingleShop, Weapon, WeaponFamily } from '../types/player'
mongoose.set('strictQuery', true)

const Schema = mongoose.Schema

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
});

// quality
const qualityEnum: Quality[] = ['common', 'uncommon', 'rare', 'epic']

// activeJourney
const activeJourneySchema = new Schema<Journey>({
  location: { type: String, required: true },
  valueMultiplier: { type: Number, required: true },
  returnDate: { type: Date, required: true }
})

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
})
const activePotionSchema = new Schema<ActivePotion>({
  potion: { type: potionSchema, required: true },
  expiringDate: { type: Date, required: true }
})

// weapon
const weaponFamilyEnum: WeaponFamily[] = ['sword', 'axe', 'mace', 'fire', 'frost', 'arcane', 'earth', 'air', 'bow', 'crossbow']
const damageSchema = new Schema<Damage>({
  min: { type: Number, required: true },
  max: { type: Number, required: true }
})
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
})

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
})

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
})

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
})

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
})

// materials
const materialSchema = new Schema<Material>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  quality: { type: String, enum: qualityEnum, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  sellPrice: { type: Number, required: true }
});
const materialsSchema = new Schema<Materials>({
  material: { type: materialSchema, required: true },
  quantity: { type: Number, required: true }
});

// shop
const singleShopSchema = new Schema<SingleShop>({
  lastRefresh: { type: String, default: null, required: true },
  items: [{ type: materialsSchema, required: true, default: null }]
})
const characterShopSchema = new Schema<CharacterShop>({
  blacksmith: { types: singleShopSchema, required: true },
  alchemist: { types: singleShopSchema, required: true }
})

// player
const characterSchema = new Schema<Player>({
  user_id: { type: String, ref: 'User', required: [true, 'User ID is required'] },
  name: { type: String, required: [true, 'Player name is required'], unique: true },
  title: { type: String, default: null },
  profession: { type: String, enum: professionEnum, required: true },
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
  attributes: { type: attributesSchema, required: true },
  activeJourney: { type: activeJourneySchema, default: null },
  activePotion: { type: activePotionSchema, default: null },
  equipment: { type: equipmentSchema, required: true },
  image: { type: String, required: true },
  inventory: [{ type: Schema.Types.Mixed, required: true }],
  materials: [{ type: materialsSchema, required: true }],
  gold: { type: Number, required: true },
  shop: { type: characterShopSchema, required: true }
})

const characterModel = mongoose.model('Character', characterSchema)

export default characterModel