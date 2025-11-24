// src/data/memories.ts

export interface Memory {
  id: number;
  imageUrl: string; // ใส่ Path รูปตรงนี้ (เช่น '/images/photo1.jpg')
}

export const memories: Memory[] = [
  {
    id: 1,
    imageUrl: "/image/photo1.jpg",
  },
  {
    id: 2,
    imageUrl: "/image/photo2.jpg",
  },
  {
    id: 3,
    imageUrl: "/image/photo3.jpg",
  },
  {
    id: 4,
    imageUrl: "/image/photo4.jpg",
  },
  {
    id: 5,
    imageUrl: "/image/photo5.jpg",
  },
  {
    id: 6,
    imageUrl: "/image/photo6.jpg",
  },
  {
    id: 7,
    imageUrl: "/image/photo7.jpg",
  },
  {
    id: 8,
    imageUrl: "/image/photo8.jpg",
  },
  {
    id: 9,
    imageUrl: "/image/photo9.jpg",
  },
  {
    id: 10,
    imageUrl: "/image/photo10.jpg",
  },
  {
    id: 11,
    imageUrl: "/image/photo11.jpg",
  },
  {
    id: 12,
    imageUrl: "/image/photo12.jpg",
  },
];
