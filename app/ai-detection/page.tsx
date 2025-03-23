"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, Leaf, Loader2, ShoppingCart, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AIDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)

      // Reset states
      setAnalysisComplete(false)
      setProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)

      // Reset states
      setAnalysisComplete(false)
      setProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const analyzeImage = () => {
    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

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
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Leaf className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">AI Plant Disease Detection</h1>
          </div>

          <Card className="w-full shadow-lg border-opacity-50">
            <CardHeader>
              <CardTitle>Upload Plant Image</CardTitle>
              <CardDescription>
                Upload a clear image of your plant to detect diseases and get treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 ${preview ? "border-primary" : "border-muted-foreground/25"}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    {!preview ? (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-center">Drag & drop your image here</h3>
                        <p className="text-sm text-muted-foreground text-center mt-2">or click to browse files</p>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="mt-4"
                        >
                          Select Image
                        </Button>
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={preview || "/placeholder.svg"}
                          alt="Plant preview"
                          fill
                          className="object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => {
                            setFile(null)
                            setPreview(null)
                            setAnalysisComplete(false)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    )}
                  </div>

                  {preview && !analysisComplete && (
                    <Button className="w-full" onClick={analyzeImage} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Image"
                      )}
                    </Button>
                  )}

                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analysis in progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </div>

                {analysisComplete && (
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">Analysis Results</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Detected Issue:</p>
                          <p className="text-lg font-bold text-destructive">Powdery Mildew</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Confidence:</p>
                          <p className="text-lg font-bold">92%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Affected Area:</p>
                          <p className="text-lg font-bold">Leaves</p>
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="treatment">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="treatment">Treatment</TabsTrigger>
                        <TabsTrigger value="prevention">Prevention</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                      </TabsList>
                      <TabsContent value="treatment" className="space-y-4 mt-4">
                        <Alert>
                          <Leaf className="h-4 w-4" />
                          <AlertTitle>Recommended Treatment</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                              <li>Remove and destroy affected leaves</li>
                              <li>Apply fungicide specifically designed for powdery mildew</li>
                              <li>Ensure proper air circulation around plants</li>
                              <li>Avoid overhead watering to keep foliage dry</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Full Report
                        </Button>
                      </TabsContent>
                      <TabsContent value="prevention" className="space-y-4 mt-4">
                        <Alert>
                          <Leaf className="h-4 w-4" />
                          <AlertTitle>Prevention Tips</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                              <li>Plant resistant varieties when possible</li>
                              <li>Ensure proper spacing between plants for good air circulation</li>
                              <li>Water at the base of plants, not on foliage</li>
                              <li>Apply preventative fungicides during humid weather</li>
                              <li>Maintain proper soil nutrition</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </TabsContent>
                      <TabsContent value="products" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-base">Organic Fungicide</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground">Natural solution for powdery mildew</p>
                              <p className="font-bold mt-2">$14.99</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Button size="sm" className="w-full">
                                View Product
                              </Button>
                            </CardFooter>
                          </Card>
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-base">Plant Nutrient Booster</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground">Strengthens plant immune system</p>
                              <p className="font-bold mt-2">$19.99</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Button size="sm" className="w-full">
                                View Product
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 items-start">
              <h3 className="font-medium">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  <Upload className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-medium">Upload</h4>
                  <p className="text-sm text-muted-foreground">Take a clear photo of your plant and upload it</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  <Loader2 className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-medium">Analyze</h4>
                  <p className="text-sm text-muted-foreground">Our AI analyzes the image to identify diseases</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  <Leaf className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-medium">Treatment</h4>
                  <p className="text-sm text-muted-foreground">Get personalized treatment recommendations</p>
                </div>
              </div>
            </CardFooter>
          </Card>
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

