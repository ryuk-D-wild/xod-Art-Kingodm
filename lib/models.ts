import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  clerkId: string
  email: string
  name: string
  avatar?: string
  bio?: string
  isSeller: boolean
  stripeAccountId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Art {
  _id?: ObjectId
  userId: ObjectId
  title: string
  description: string
  price: number
  images: string[] // Cloudinary URLs
  videos?: string[] // Cloudinary URLs
  category: string
  tags: string[]
  sold: number
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: ObjectId
  buyerId: ObjectId
  sellerId: ObjectId
  artId: ObjectId
  amount: number
  stripePaymentId: string
  status: "pending" | "completed" | "failed" | "refunded"
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: ObjectId
  orderId: ObjectId
  buyerId: ObjectId
  sellerId: ObjectId
  rating: number
  comment: string
  createdAt: Date
}

export interface Cart {
  _id?: ObjectId
  userId: ObjectId
  items: {
    artId: ObjectId
    quantity: number
    price: number
  }[]
  createdAt: Date
  updatedAt: Date
}
