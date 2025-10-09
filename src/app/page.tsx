'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LuPlay, LuImage, LuDownload, LuFilm } from 'react-icons/lu';
import { FaYoutube } from 'react-icons/fa';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');

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
