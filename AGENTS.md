# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube 썸네일 & 자막 다운로더 - A Next.js web application that allows users to download YouTube video thumbnails and transcripts.

## Development Commands

```bash
# Development (uses Turbopack)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

**Note**: This project uses `pnpm` as the package manager, not npm or yarn.

## Technology Stack

- **Framework**: Next.js 15.5 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4
- **Theme Management**: next-themes (class-based dark mode)
- **Icons**: react-icons (`react-icons/lu` for general icons, `react-icons/fa` for brand logos)
- **YouTube API**: youtubei.js 15.1.1 (for transcript extraction)
- **TypeScript**: Version 5

## Architecture

### Application Structure

Single-page application with two main features:

1. **Thumbnail Download** (`src/app/page.tsx`):
   - Client component handling YouTube URL input
   - Video ID extraction: `/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/`
   - Displays 9 thumbnail variants (120x90 to 1280x720+)
   - Client-side downloads using Blob API

2. **Transcript Extraction**:
   - API Route: `src/app/api/transcript/route.ts`
   - Uses `youtubei.js` InnerTube API for reliable transcript fetching
   - Returns transcript segments with timestamps
   - Supports multiple download formats (TXT, SRT)

### State Management

When searching for a new video, all previous state is reset:
- `handleSubmit` clears transcript data, errors, and selected language
- Ensures clean state transitions between different videos

### API Routes

**GET /api/transcript?videoId={VIDEO_ID}**
- Fetches transcript using `Innertube.create()` and `getInfo()`
- Returns transcript segments with `start_ms`, `end_ms`, and `text`
- Error handling for videos without transcripts

### Theme System

- `src/components/theme-provider.tsx`: next-themes wrapper
- `src/components/theme-toggle.tsx`: Fixed position (top-right)
- Class-based dark mode (`.dark` on `<html>`)
- All UI components include `dark:` variants

## Styling Guidelines

- **Dark Mode**: All components require `dark:` variants
- **Responsive Design**: Mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Icons**: Use `react-icons/lu` (Lucide) for UI, `react-icons/fa` for brands

## Key Implementation Details

1. **Transcript Fetching**: Uses `youtubei.js` (Trust Score 9.5) - most reliable YouTube API library as of 2025
2. **Client-Side Downloads**: `fetch()` + `Blob` + `URL.createObjectURL()` for both thumbnails and transcripts
3. **Next.js Config**: Image optimization enabled for `img.youtube.com` domain
4. **Turbopack**: Enabled for faster dev/build performance
