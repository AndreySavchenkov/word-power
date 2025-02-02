import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";

const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Neural2-J", // Один из лучших нейронных голосов
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch: 0,
        speakingRate: 1,
      },
    });

    return new NextResponse(response.audioContent, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to synthesize speech" },
      { status: 500 }
    );
  }
}
