"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(_prev: any, formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword,
    },
  });

  redirect("/login?registered=true");
}

export async function loginUser(_prev: any, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_REDIRECT")) throw error;
    return { error: "Invalid email or password" };
  }
}
