'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  LuPlay,
  LuImage,
  LuDownload,
  LuFilm,
  LuCaptions,
  LuCopy,
  LuFileText,
  LuLoader,
} from 'react-icons/lu';
import { FaYoutube } from 'react-icons/fa';
import { ThemeToggle } from '@/components/theme-toggle';

interface TranscriptSegment {
  start: string;
  dur: string;
  text: string;
}

interface TranscriptTrack {
  language: string;
  transcript: TranscriptSegment[];
}

interface TranscriptData {
  id: string;
  title: string;
  languages: Array<{ label: string; languageCode: string }>;
  tracks: TranscriptTrack[];
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
      // 새로운 영상 검색 시 자막 초기화
      setTranscript(null);
      setTranscriptError(null);
      setSelectedLanguage('');
    }
  };

  const thumbnails = videoId
    ? [
        {
          name: '기본',
          url: `https://img.youtube.com/vi/${videoId}/0.jpg`,
          resolution: '480x360',
          badge: 'default',
        },
        {
          name: '영상 시작',
          url: `https://img.youtube.com/vi/${videoId}/1.jpg`,
          resolution: '120x90',
          badge: 'preview',
        },
        {
          name: '영상 중간',
          url: `https://img.youtube.com/vi/${videoId}/2.jpg`,
          resolution: '120x90',
          badge: 'preview',
        },
        {
          name: '영상 끝',
          url: `https://img.youtube.com/vi/${videoId}/3.jpg`,
          resolution: '120x90',
          badge: 'preview',
        },
        {
          name: 'Default',
          url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
          resolution: '120x90',
          badge: 'low',
        },
        {
          name: 'Medium Quality',
          url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          resolution: '320x180',
          badge: 'medium',
        },
        {
          name: 'High Quality',
          url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          resolution: '480x360',
          badge: 'high',
        },
        {
          name: 'Standard Definition',
          url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          resolution: '640x480',
          badge: 'hd',
        },
        {
          name: 'Maximum Resolution',
          url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          resolution: '1280x720+',
          badge: 'max',
        },
      ]
    : [];

  const downloadImage = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(blobUrl);
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
      preview: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      medium:
        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
      high: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      hd: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
      max: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    };
    return colors[badge as keyof typeof colors] || colors.default;
  };

  const fetchTranscript = async () => {
    if (!videoId) return;

    setTranscriptLoading(true);
    setTranscriptError(null);
    setTranscript(null);

    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.data);
      // 첫 번째 언어를 기본으로 선택
      if (data.data.tracks && data.data.tracks.length > 0) {
        setSelectedLanguage(data.data.tracks[0].language);
      }
    } catch (error) {
      setTranscriptError(
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setTranscriptLoading(false);
    }
  };

  const getSelectedTranscript = () => {
    if (!transcript || !selectedLanguage) return null;
    return transcript.tracks.find((t) => t.language === selectedLanguage);
  };

  const formatTime = (seconds: string) => {
    const totalSeconds = Math.floor(parseFloat(seconds));
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async () => {
    const selectedTrack = getSelectedTranscript();
    if (!selectedTrack) return;

    const text = selectedTrack.transcript.map((seg) => seg.text).join(' ');

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadTranscript = (format: 'txt' | 'srt') => {
    const selectedTrack = getSelectedTranscript();
    if (!selectedTrack) return;

    let content = '';
    const filename = `${videoId}_${selectedLanguage}_transcript.${format}`;

    if (format === 'txt') {
      content = selectedTrack.transcript.map((seg) => seg.text).join('\n');
    } else {
      // SRT 포맷
      content = selectedTrack.transcript
        .map((seg, index) => {
          const startTime = parseFloat(seg.start);
          const duration = parseFloat(seg.dur);
          const endTime = startTime + duration;

          const formatSrtTime = (seconds: number) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 1000);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
          };

          return `${index + 1}\n${formatSrtTime(startTime)} --> ${formatSrtTime(endTime)}\n${seg.text}\n`;
        })
        .join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FaYoutube className="w-14 h-14 text-red-600" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              썸네일 다운로더
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            YouTube 영상의 모든 썸네일을 한 번에 다운로드하세요
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL을 입력하세요 (예: https://youtube.com/watch?v=...)"
                className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900 transition-all shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {videoId && (
          <div className="space-y-8">
            {/* Video Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <LuPlay className="w-6 h-6 text-red-600" />
                영상 미리보기
              </h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <LuImage className="w-6 h-6 text-red-600" />
                썸네일 목록
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {thumbnail.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {thumbnail.resolution}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                          thumbnail.badge,
                        )}`}
                      >
                        {thumbnail.badge.toUpperCase()}
                      </span>
                    </div>
                    <div className="relative aspect-video mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                      <Image
                        src={thumbnail.url}
                        alt={thumbnail.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button
                      onClick={() =>
                        downloadImage(
                          thumbnail.url,
                          `${videoId}_${thumbnail.resolution}.jpg`,
                        )
                      }
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <LuDownload className="w-5 h-5" />
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Transcript Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <LuCaptions className="w-6 h-6 text-red-600" />
                  자막
                </h2>
                {!transcript && !transcriptLoading && (
                  <button
                    onClick={fetchTranscript}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <LuCaptions className="w-5 h-5" />
                    자막 불러오기
                  </button>
                )}
              </div>

              {transcriptLoading && (
                <div className="flex items-center justify-center py-12">
                  <LuLoader className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600 dark:text-gray-300">
                    자막을 불러오는 중...
                  </span>
                </div>
              )}

              {transcriptError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <p className="text-red-700 dark:text-red-400">
                    {transcriptError}
                  </p>
                </div>
              )}

              {transcript && !transcriptLoading && (
                <div className="space-y-6">
                  {/* Language Selector & Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        언어:
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {transcript.tracks.map((track) => (
                          <option key={track.language} value={track.language}>
                            {track.language}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                      >
                        <LuCopy className="w-4 h-4" />
                        {copySuccess ? '복사됨!' : '복사'}
                      </button>
                      <button
                        onClick={() => downloadTranscript('txt')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                      >
                        <LuFileText className="w-4 h-4" />
                        TXT
                      </button>
                      <button
                        onClick={() => downloadTranscript('srt')}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all flex items-center gap-2"
                      >
                        <LuDownload className="w-4 h-4" />
                        SRT
                      </button>
                    </div>
                  </div>

                  {/* Transcript Display */}
                  <div className="max-h-96 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 space-y-3">
                    {getSelectedTranscript()?.transcript.map((seg, index) => (
                      <div
                        key={index}
                        className="flex gap-4 hover:bg-white dark:hover:bg-gray-600 p-3 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-mono text-blue-600 dark:text-blue-400 min-w-[60px]">
                          {formatTime(seg.start)}
                        </span>
                        <p className="text-gray-800 dark:text-gray-200 flex-1">
                          {seg.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!transcript && !transcriptLoading && !transcriptError && (
                <div className="text-center py-12">
                  <LuCaptions className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-400 dark:text-gray-500">
                    자막 불러오기 버튼을 클릭하세요
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!videoId && (
          <div className="text-center py-20">
            <LuFilm className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              YouTube URL을 입력하면 썸네일 목록이 표시됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
