import { Innertube } from 'youtubei.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return Response.json(
      { error: 'videoId parameter is required' },
      { status: 400 },
    );
  }

  try {
    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    if (!transcriptData) {
      return Response.json(
        { error: 'Transcript not available' },
        { status: 404 },
      );
    }

    const segments = transcriptData.transcript?.content?.body?.initial_segments;

    if (!segments || segments.length === 0) {
      return Response.json(
        { error: 'No transcript segments found' },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: {
        id: videoId,
        tracks: [
          {
            language: 'auto',
            transcript: segments.map((segment: any) => ({
              start: (segment.start_ms / 1000).toString(),
              dur: (segment.end_ms - segment.start_ms) / 1000,
              text: segment.snippet.text,
            })),
          },
        ],
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to fetch transcript',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
