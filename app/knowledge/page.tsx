"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// YouTube farming videos - replace with actual YouTube video IDs
const videos = [
  {
    id: 1,
    title: "Organic Farming Techniques",
    author: "Sarah Johnson",
    views: "12.5K",
    duration: "15:24",
    thumbnail: "https://i.ytimg.com/vi/pqJl9dcC6zE/hqdefault.jpg",
    category: "Organic Farming",
    youtubeId: "pqJl9dcC6zE"
  },
  {
    id: 2,
    title: "Natural Pest Control Methods",
    author: "Michael Rodriguez",
    views: "8.2K",
    duration: "1:10",
    thumbnail: "https://img.youtube.com/vi/nv0cBg1rlNA/hqdefault.jpg",
    category: "Pest Control",
    youtubeId: "nv0cBg1rlNA"
  },
  {
    id: 3,
    title: "Maximizing Crop Yield",
    author: "Emily Chen",
    views: "20.1K",
    duration: "3:45",
    thumbnail: "https://img.youtube.com/vi/rJpynKSE86w/hqdefault.jpg",
    category: "Crop Management",
    youtubeId: "rJpynKSE86w"
  },
  {
    id: 4,
    title: "Sustainable Irrigation Systems",
    author: "David Wilson",
    views: "5.7K",
    duration: "4:18",
    thumbnail: "https://img.youtube.com/vi/BeYl0Yy5IMo/maxresdefault.jpg",
    category: "Water Management",
    youtubeId: "BeYl0Yy5IMo"
  },
  {
    id: 5,
    title: "Soil Health and Maintenance",
    author: "Lisa Thompson",
    views: "15.3K",
    duration: "8:15",
    thumbnail: "https://img.youtube.com/vi/L14woJZEJnk/maxresdefault.jpg",
    category: "Soil Management",
    youtubeId: "L14woJZEJnk"
  },
  {
    id: 6,
    title: "Seasonal Planting Guide",
    author: "Robert Garcia",
    views: "9.8K",
    duration: "22:20",
    thumbnail: "https://img.youtube.com/vi/1HtBMfbJ_nY/maxresdefault.jpg",
    category: "Planting",
    youtubeId: "1HtBMfbJ_nY"
  },
  {
    id: 7,
    title: "Harvesting Best Practices",
    author: "Jennifer Lee",
    views: "7.4K",
    duration: "7:55",
    thumbnail: "https://img.youtube.com/vi/uU-y4Ik3JLo/maxresdefault.jpg",
    category: "Harvesting",
    youtubeId: "uU-y4Ik3JLo"
  },
  {
    id: 8,
    title: "Farm Equipment Maintenance",
    author: "Thomas Brown",
    views: "6.2K",
    duration: "2:20",
    thumbnail: "https://img.youtube.com/vi/vzZlSENr7z4/maxresdefault.jpg",
    category: "Equipment",
    youtubeId: "vzZlSENr7z4"
  },
]

export default function KnowledgePage() {
  const openYouTubeVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">FarmMarket</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Knowledge Center</h1>
              <p className="text-muted-foreground mt-1">Educational farming videos from experts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative cursor-pointer" onClick={() => openYouTubeVideo(video.youtubeId)}>
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={350}
                    height={200}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{video.author}</p>
                    </div>
                    <Badge className="bg-green-600 hover:bg-green-700 text-black border-0">{video.category}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{video.views} views</div>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white" 
                    size="sm"
                    onClick={() => openYouTubeVideo(video.youtubeId)}
                  >
                    Watch
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FarmMarket. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}