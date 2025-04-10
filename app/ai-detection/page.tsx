"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, Leaf, Loader2, ShoppingCart, Upload, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  inventory: number;
  imageUrl?: string;
  farmer_id: string;
}

export default function AIDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isMockResponse, setIsMockResponse] = useState(false)
  const [analysisStructured, setAnalysisStructured] = useState<{
    plantIdentification: string | null;
    healthAssessment: string | null;
    specificCondition: string | null;
    severityLevel: string | null;
    treatments: string | null;
    preventionTips: string | null;
    nutritionalRecommendations: string | null;
    recoveryTime: string | null;
  }>({
    plantIdentification: null,
    healthAssessment: null,
    specificCondition: null,
    severityLevel: null,
    treatments: null,
    preventionTips: null,
    nutritionalRecommendations: null,
    recoveryTime: null
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/1`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        
        const data = await response.json();
        console.log("Product data:", data);
        console.log(`Product price: ${data.price}, type: ${typeof data.price}`);
        
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

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
      setAnalysisResult(null)
      setAnalysisStructured({
        plantIdentification: null,
        healthAssessment: null,
        specificCondition: null,
        severityLevel: null,
        treatments: null,
        preventionTips: null,
        nutritionalRecommendations: null,
        recoveryTime: null
      })
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
      setAnalysisResult(null)
      setAnalysisStructured({
        plantIdentification: null,
        healthAssessment: null,
        specificCondition: null,
        severityLevel: null,
        treatments: null,
        preventionTips: null,
        nutritionalRecommendations: null,
        recoveryTime: null
      })
      setProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const analyzeImage = async () => {
    if (!preview) return;

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    setIsMockResponse(false);

    try {
      // Extract base64 data from the data URL
      const base64Data = preview.split(',')[1];
      
      // Start progress animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return 95; // Stay at 95% until we get response
          }
          return prev + 5;
        });
      }, 300);

      // Call our API endpoint
      const response = await fetch('/api/ai-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      const data = await response.json();
      
      if (!response.ok && !data.analysis) {
        const errorMessage = data.error || 'Failed to analyze image';
        throw new Error(errorMessage);
      }

      // Set mock response flag if the server indicated it's a mock response
      setIsMockResponse(data.isMockResponse || false);
      
      // Set analysis result
      setAnalysisResult(data.analysis);
      
      // Process structured data
      processAnalysisResult(data.analysis);
      
      setProgress(100);
      setAnalysisComplete(true);
      clearInterval(interval);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setProgress(0);
      setAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const processAnalysisResult = (analysisText: string) => {
    if (!analysisText) return;
    
    const structured = {
      plantIdentification: extractSection(analysisText, "Plant Identification"),
      healthAssessment: extractSection(analysisText, "Health Assessment"),
      specificCondition: extractSection(analysisText, "Specific Condition"),
      severityLevel: extractSection(analysisText, "Severity Level"),
      treatments: extractSection(analysisText, "Recommended Treatments"),
      preventionTips: extractSection(analysisText, "Prevention Tips"),
      nutritionalRecommendations: extractSection(analysisText, "Nutritional Recommendations"),
      recoveryTime: extractSection(analysisText, "Expected Recovery Time")
    };
    
    setAnalysisStructured(structured);
  };
  
  const extractSection = (text: string, sectionName: string): string | null => {
    const regex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\d+\\.\\s+[A-Z]|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    );
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
                  <div className="mt-6">
                    {isMockResponse && (
                      <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                        <div className="flex items-center">
                          <Info className="h-5 w-5 mr-2" />
                          <p className="text-sm font-medium">
                            Note: Due to API rate limits, you're seeing a sample analysis. This is example data for testing purposes.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-4 bg-muted/30 rounded-md mt-2">
                      <h3 className="font-medium mb-4">Plant Analysis Results</h3>
                      
                      {analysisStructured.plantIdentification && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Plant Identification</h4>
                          <p className="mt-1 text-sm">{analysisStructured.plantIdentification}</p>
                        </div>
                      )}
                      
                      {analysisStructured.healthAssessment && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Health Assessment</h4>
                          <p className="mt-1 text-sm">{analysisStructured.healthAssessment}</p>
                        </div>
                      )}
                      
                      {analysisStructured.specificCondition && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Specific Condition</h4>
                          <p className="mt-1 text-sm">{analysisStructured.specificCondition}</p>
                        </div>
                      )}
                      
                      {analysisStructured.severityLevel && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Severity Level</h4>
                          <p className="mt-1 text-sm">{analysisStructured.severityLevel}</p>
                        </div>
                      )}
                      
                      {analysisStructured.treatments && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Recommended Treatments</h4>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{analysisStructured.treatments}</p>
                        </div>
                      )}
                      
                      {analysisStructured.preventionTips && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Prevention Tips</h4>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{analysisStructured.preventionTips}</p>
                        </div>
                      )}
                      
                      {analysisStructured.nutritionalRecommendations && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Nutritional Recommendations</h4>
                          <p className="mt-1 text-sm">{analysisStructured.nutritionalRecommendations}</p>
                        </div>
                      )}
                      
                      {analysisStructured.recoveryTime && (
                        <div className="mb-4 p-3 bg-background rounded-md border">
                          <h4 className="text-sm font-semibold text-primary">Expected Recovery Time</h4>
                          <p className="mt-1 text-sm">{analysisStructured.recoveryTime}</p>
                        </div>
                      )}
                      
                      {!analysisStructured.plantIdentification && analysisResult && (
                        <div className="text-sm whitespace-pre-wrap">
                          <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} />
                        </div>
                      )}
                      
                      {!analysisResult && (
                        <div className="text-muted-foreground">
                          <p>No analysis results available.</p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={() => window.print()}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Analysis Report
                        </Button>
                      </div>
                    </div>
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