import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  private static instance: PrismaSingleton;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }
    return PrismaSingleton.instance.prisma;
  }
}

export const prisma = PrismaSingleton.getInstance();
