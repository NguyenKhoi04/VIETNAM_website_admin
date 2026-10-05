// ========================
// Shared Types – Tập đọc
// ========================
export type CachDocType = 'chu' | 'danh-van'
export type KieuCach = 1 | 2 | 3 | 4

export interface DanhVanTag {
  id: number
  text: string
}

export interface AudioEntry {
  id: number
  label: string
  file: File | null
  url: string
}

export interface KieuBonDoan {
  id: number
  text: string
  audioEntries: AudioEntry[]
}

export interface ChuEntry {
  id: number
  chu: string
  cachDoc: CachDocType
  docChu: string[]
  danhVanTags: DanhVanTag[][]
  danhVanInput: string
  kieuCach: KieuCach
  audioEntries: AudioEntry[]
  kieuBonDoanList: KieuBonDoan[]
}

export interface TuKhoEntry {
  id: number
  tu: string
  giaithich: string
  audioFile: File | null
  audioUrl: string
}

export interface DoanVanEntry {
  id: number
  noidung: string
  audioFile: File | null
  audioUrl: string
}

// ========================
// Helpers
// ========================
let nextId = 1
export const uid = () => nextId++

export const tuanMenu = Array.from({ length: 35 }, (_, i) => `Tuần ${i + 1}`)
export const chuDeMenu = Array.from({ length: 10 }, (_, i) => `Chủ đề ${i + 1}`)
