import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, rating, text } = await request.json();

    const { data, error } = await supabase
      .from("Reviews")
      .insert([{ email, rating, text }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
