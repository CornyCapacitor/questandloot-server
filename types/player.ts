import { Document, Model } from 'mongoose'

export type PlayerDocument = Document & Player

export type PlayerModel = Model<PlayerDocument> & {
  createCharacter(userId: string, name: string, profession: string): Promise<PlayerDocument>
}

export type Player = Document & {
  _id?: string,
  user_id: string,
  name: string,
  title: string | null,
  description: string | null,
  profession: Profession,
  level: number,
  experience: number,
  attributes: Attributes,
  activeJourney: Journey,
  dungeon: Dungeon,
  activePotion: ActivePotion,
  equipment: Equipment,
  image: string,
  inventory: Inventory,
  materials: Materials[],
  gold: number,
  shop: CharacterShop
}

// 
// General types
// 

export type Profession = "warrior" | "mage" | "hunter"

export type Attributes = {
  strength: number,
  agility: number,
  intellect: number,
  stamina: number,
  luck: number,
}

export type Zone = {
  name: string,
  image: string
}

export type ActivePotion = {
  potion: Potion,
  expiringDate: Date
} | null

// 
// Dungeon & Journey types
// 

export type Journey = {
  zone: Zone,
  valueMultiplier: number,
  startDate: Date,
  returnDate: Date
} | null

export type CompletedBossesKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type DungeonKey = "dungeon1" | "dungeon2" | "dungeon3" | "dungeon4" | "dungeon5" | "dungeon6" | "dungeon7" | "dungeon8" | "dungeon9" | "dungeon10"

export type DungeonProgress = Record<DungeonKey, CompletedBossesKey>

export type Dungeon = {
  refreshDate: Date | null,
  dungeonProgress: DungeonProgress
}

// 
// Equipment & equipment general types
//

export type Quality = "common" | "uncommon" | "rare" | "epic"

export type Equipment = {
  weapon: Weapon | null,
  shield: Shield | null,
  head: Armor | null,
  chest: Armor | null,
  hands: Armor | null,
  belt: Armor | null,
  legs: Armor | null,
  feet: Armor | null,
  neck: Jewelery | null,
  ring: Jewelery | null
}

// 
// Weapon
// 

export type WeaponFamily = "sword" | "axe" | "mace" | "fire" | "frost" | "lightning" | "arcane" | "earth" | "air" | "dark" | "mystic" | "death" | "holy" | "water" | "bow" | "crossbow"

export type Damage = {
  min: number,
  max: number
}

export type Weapon = {
  id: string,
  name: string,
  description: string,
  level: number,
  profession: Profession,
  slot: "weapon",
  damage: Damage,
  attributes: Attributes,
  image: string,
  quality: Quality,
  type: "weapon",
  family: WeaponFamily,
  sellPrice: number
}

// Armor

export type ArmorProficiency = "heavy" | "medium" | "light"

export type ArmorSlot = "head" | "chest" | "hands" | "legs" | "feet" | "belt"

export type Armor = {
  id: string,
  name: string,
  description: string,
  level: number,
  profession: Profession,
  slot: ArmorSlot,
  armor: number,
  attributes: Attributes,
  image: string,
  quality: Quality,
  proficiency: ArmorProficiency,
  type: "armor",
  sellPrice: number
}

// Shield

export type Shield = {
  id: string,
  name: string,
  description: string,
  level: number,
  profession: "warrior",
  slot: "shield",
  armor: number,
  attributes: Attributes,
  image: string,
  quality: Quality,
  type: "shield",
  sellPrice: number
}

// Jewelery 

export type JewelerySlot = "neck" | "ring"

export type Jewelery = {
  id: string,
  name: string,
  description: string,
  level: number,
  slot: JewelerySlot,
  attributes: Attributes,
  image: string,
  quality: Quality,
  type: "jewelery",
  sellPrice: number
}

// 
// Other
// 

export type Items = Weapon | Shield | Jewelery | Armor | Potion | Material

export type Potion = {
  id: string,
  name: string,
  description: string,
  enchancing: {
    attribute: keyof Attributes,
    value: number
  }
  image: string,
  type: "potion",
  quality: Quality,
  sellPrice: number
}

export type Inventory = Items[]

export type Materials = {
  material: Material,
  quantity: number
}

export type Material = {
  id: number,
  name: string,
  description: string,
  quality: Quality,
  image: string,
  type: "material"
  sellPrice: number,
}

// 
// Shops
// 

export type CharacterShop = {
  blacksmith: SingleShop,
  alchemist: SingleShop
}

export type SingleShop = {
  lastRefresh: string | null,
  items: (Items | null)[]
}