import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Try to create user with Prisma
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
      }, { status: 201 });
    } catch (prismaError) {
      console.error("Error creating user with Prisma:", prismaError);
      
      // Fallback to MongoDB directly if Prisma fails
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return NextResponse.json({
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
} 