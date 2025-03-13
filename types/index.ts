export interface PrintifyImage {
  src: string
  position?: 'front' | 'back' | 'preview'
  is_selected?: boolean
}

export interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: PrintifyImage[]
  variants: Array<{
    id: number
    title: string
    price: number
    is_enabled: boolean
    options: Record<string, string>
  }>
  options: Array<{
    name: string
    type: string
    values: string[]
  }>
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  blueprint_id: number
  user_id: number
  shop_id: number
  print_provider_id: number
  print_areas: Record<string, unknown>
  print_details: Array<{
    type: string
    value: string
  }>
  sales_channel_properties: Array<{
    channel: string
    state: string
  }>
  tags: string[]
}

export interface Product {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: Array<{
    id: string
    title: string
    price: number
    is_enabled: boolean
    options: Record<string, string>
  }>
  options: Array<{
    name: string
    values: string[]
  }>
} 