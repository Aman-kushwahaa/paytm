"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnrampTransaction(
  amount: number,
  provider: string
) {
  const token = (Math.random() * 1000).toString();
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "User not authorized",
    };
  }

  const userId = session.user.id;
  console.log("user found");

  await prisma.onRampTransaction.create({
    data: {
      userId: Number(session?.user?.id),
      amount: Number(amount),
      provider,
      status: "Processing",
      startTime: new Date(),
      token,
    },
  });

  console.log(amount + " created");
  return {
    message: "On ramp transaction added",
  };
}
