"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Plus, Search, ShoppingCart, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const videos = [
  {
    id: 1,
    title: "Organic Farming Techniques",
    author: "Sarah Johnson",
    views: "12.5K",
    duration: "15:24",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Organic Farming",
  },
  {
    id: 2,
    title: "Natural Pest Control Methods",
    author: "Michael Rodriguez",
    views: "8.2K",
    duration: "12:10",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Pest Control",
  },
  {
    id: 3,
    title: "Maximizing Crop Yield",
    author: "Emily Chen",
    views: "20.1K",
    duration: "18:45",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Crop Management",
  },
  {
    id: 4,
    title: "Sustainable Irrigation Systems",
    author: "David Wilson",
    views: "5.7K",
    duration: "10:30",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Water Management",
  },
  {
    id: 5,
    title: "Soil Health and Maintenance",
    author: "Lisa Thompson",
    views: "15.3K",
    duration: "22:15",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Soil Management",
  },
  {
    id: 6,
    title: "Seasonal Planting Guide",
    author: "Robert Garcia",
    views: "9.8K",
    duration: "14:20",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Planting",
  },
  {
    id: 7,
    title: "Harvesting Best Practices",
    author: "Jennifer Lee",
    views: "7.4K",
    duration: "16:55",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Harvesting",
  },
  {
    id: 8,
    title: "Farm Equipment Maintenance",
    author: "Thomas Brown",
    views: "6.2K",
    duration: "20:05",
    thumbnail: "/placeholder.svg?height=200&width=350",
    category: "Equipment",
  },
]

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              <p className="text-muted-foreground mt-1">Learn and share farming techniques with the community</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search videos..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload a Video</DialogTitle>
                    <DialogDescription>Share your farming knowledge with the community</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter video title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" placeholder="E.g., Organic Farming, Pest Control" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your video" />
                    </div>
                    <div className="space-y-2">
                      <Label>Video File</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">MP4, MOV, or AVI (MAX. 500MB)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Upload Video</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Videos</TabsTrigger>
              <TabsTrigger value="organic">Organic Farming</TabsTrigger>
              <TabsTrigger value="pest">Pest Control</TabsTrigger>
              <TabsTrigger value="soil">Soil Management</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
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
                    <Badge variant="outline">{video.category}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{video.views} views</div>
                  <Button variant="ghost" size="sm">
                    Save
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No videos found</h3>
              <p className="text-muted-foreground text-center mt-1 max-w-md">
                We couldn't find any videos matching "{searchQuery}". Try a different search term or upload your own
                video.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload a Video
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload a Video</DialogTitle>
                    <DialogDescription>Share your farming knowledge with the community</DialogDescription>
                  </DialogHeader>
                  {/* Dialog content same as above */}
                </DialogContent>
              </Dialog>
            </div>
          )}
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

