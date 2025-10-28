"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Clock,
  Download,
  Expand,
  Heart,
  MessageSquare,
  Pause,
  Play,
  Share2,
  Star,
  ThumbsUp,
  User,
  Volume2,
  VolumeX,
  FileText,
} from "lucide-react"
import { Button } from "@/components/drake_libs/ui/button"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Slider } from "@/components/drake_libs/ui/slider"
import { Tabs, TabsContent, TabsList } from "@/components/drake_libs/ui/tabs"
import { TabsTrigger } from "@radix-ui/react-tabs"
import { Card, CardContent } from "@/components/drake_libs/ui/card"
import { Avatar } from "@/components/user_profile/avatar"
import { AvatarFallback, AvatarImage } from "@/components/drake_libs/ui/avatar"
import { Separator } from "@/components/drake_libs/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/drake_libs/ui/collapsible"


export default function VideoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = 2

  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const videoRef = useRef(null)

  // Format time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle seeking
  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.7
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Simulate fetching video data
  useEffect(() => {
    const fetchVideo = async () => {
      // In a real app, you would fetch from an API
      // For demo purposes, we'll use the mock data
      const vid = studyMaterials.find((m) => m.id === id)

      // Simulate network delay
      setTimeout(() => {
        setVideo(vid)
        setLoading(false)
      }, 800)
    }

    fetchVideo()
  }, [id])

  // Set up video event listeners
  useEffect(() => {
    const videoElement = videoRef.current

    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime)
      }

      const handleDurationChange = () => {
        setDuration(videoElement.duration)
      }

      const handleEnded = () => {
        setIsPlaying(false)
      }

      videoElement.addEventListener("timeupdate", handleTimeUpdate)
      videoElement.addEventListener("durationchange", handleDurationChange)
      videoElement.addEventListener("ended", handleEnded)

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate)
        videoElement.removeEventListener("durationchange", handleDurationChange)
        videoElement.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 text-muted-foreground">Video not found</div>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center overflow-hidden">
            <h1 className="text-lg font-semibold truncate">{video.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(!liked)}
              className={liked ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBookmarked(!bookmarked)}
              className={bookmarked ? "text-primary" : ""}
            >
              <BookOpen className={`h-5 w-5 ${bookmarked ? "fill-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
            {/* Video player */}
            <video ref={videoRef} className="w-full h-full" poster={video.image} onClick={togglePlay}>
              {/* In a real app, you would have actual video sources */}
              <source src="/placeholder-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video controls overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" className="text-white">
                  <Expand className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>

                    <div className="flex items-center gap-2 w-32">
                      <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge>{video.subject}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {video.duration}
            </Badge>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">{video.rating}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          <p className="text-muted-foreground mb-6">{video.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download Video
            </Button>
            <Button variant="outline" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              Helpful
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comment
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <Tabs defaultValue="chapters" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="chapters" className="pt-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <h2 className="text-2xl font-bold mb-4">Video Chapters</h2>
                  <div className="space-y-4">
                    {videoChapters.map((chapter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Card
                          className={`hover:bg-muted/50 transition-colors cursor-pointer ${index === 0 ? "border-primary" : ""}`}
                        >
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="relative h-16 w-28 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src="/placeholder.svg?height=90&width=160"
                                alt={chapter.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <span className="text-white text-sm font-medium">{chapter.time}</span>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium">{chapter.title}</h3>
                              <p className="text-sm text-muted-foreground">{chapter.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="transcript" className="pt-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Video Transcript</h2>
                    <Button variant="outline" size="sm">
                      Download Transcript
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {transcript.map((entry, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{entry.time}</Badge>
                              {entry.speaker && <span className="text-sm font-medium">{entry.speaker}</span>}
                            </div>
                            <p className="text-sm">{entry.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="comments" className="pt-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Comments (12)</h2>
                    <Button>Add Comment</Button>
                  </div>

                  <div className="space-y-6">
                    {comments.map((comment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{comment.name}</h4>
                              <span className="text-xs text-muted-foreground">{comment.time}</span>
                            </div>
                            <p className="text-sm mb-2">{comment.text}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{comment.likes}</span>
                              </button>
                              <button className="text-muted-foreground hover:text-foreground transition-colors">
                                Reply
                              </button>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                              <Collapsible className="mt-4">
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="gap-1 h-auto p-0">
                                    <ChevronDown className="h-3 w-3" />
                                    <span className="text-xs">{comment.replies.length} replies</span>
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 space-y-4">
                                  {comment.replies.map((reply, replyIndex) => (
                                    <div key={replyIndex} className="flex gap-3 pl-6">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={reply.avatar} />
                                        <AvatarFallback>{reply.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-semibold text-sm">{reply.name}</h4>
                                          <span className="text-xs text-muted-foreground">{reply.time}</span>
                                        </div>
                                        <p className="text-sm">{reply.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        </div>
                        {index < comments.length - 1 && <Separator className="my-4" />}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Related Videos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {studyMaterials
                  .filter((m) => m.type === "video" && m.id !== video.id)
                  .slice(0, 4)
                  .map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Link href={`/video/${material.id}`}>
                        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="relative h-40">
                              <Image
                                src={material.image || "/placeholder.svg"}
                                alt={material.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 rounded-full p-2">
                                  <Play className="h-6 w-6 text-white" />
                                </div>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                                {material.duration}
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-1 line-clamp-1">{material.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="ml-1 text-sm">{material.rating}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">{material.downloads} views</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-20"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Instructor</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Dr. Sarah Miller</p>
                      <p className="text-sm text-muted-foreground">Professor of {video.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Dr. Miller specializes in {video.subject} and has been teaching for over 10 years. She has published
                    numerous papers and is a recognized expert in her field.
                  </p>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Video Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{video.duration}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quality:</span>
                      <span>1080p HD</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published:</span>
                      <span>Mar 10, 2023</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span>English</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views:</span>
                      <span>{video.downloads}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-sm text-primary hover:underline flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Lecture Slides (PDF)
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-sm text-primary hover:underline flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Practice Problems
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-sm text-primary hover:underline flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Additional Reading
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Mock data
const studyMaterials: {
    id: number
    title: string
    subject: string
    description: string
    type: string
    image: string
    rating: number
    duration: string
    downloads: number
}[] = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    description:
      "A comprehensive guide to calculus basics including limits, derivatives, and integrals with practice problems.",
    type: "document",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    duration: "2 hours",
    downloads: 1245,
  },
  {
    id: 2,
    title: "Introduction to Quantum Physics",
    subject: "Physics",
    description: "Learn the fundamental concepts of quantum mechanics and how they apply to the physical world.",
    type: "video",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    duration: "45 minutes",
    downloads: 876,
  },
  {
    id: 3,
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    description:
      "Master the essential data structures and algorithms used in software development and competitive programming.",
    type: "document",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    duration: "3 hours",
    downloads: 2341,
  },
  {
    id: 4,
    title: "Advanced English Grammar",
    subject: "Languages",
    description: "Improve your English writing and speaking skills with this comprehensive grammar guide.",
    type: "document",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    duration: "1.5 hours",
    downloads: 987,
  },
  {
    id: 5,
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    description: "A visual guide to common organic chemistry reactions with mechanisms and examples.",
    type: "video",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    duration: "1 hour",
    downloads: 1532,
  },
]

const videoChapters = [
  {
    time: "0:00",
    title: "Introduction",
    description: "Overview of the course and what to expect",
  },
  {
    time: "5:30",
    title: "Basic Concepts",
    description: "Fundamental principles and terminology",
  },
  {
    time: "12:45",
    title: "Advanced Techniques",
    description: "Detailed explanation of complex methods",
  },
  {
    time: "22:10",
    title: "Practical Examples",
    description: "Real-world applications and demonstrations",
  },
  {
    time: "35:20",
    title: "Summary and Conclusion",
    description: "Recap of key points and next steps",
  },
]

const transcript = [
  {
    time: "0:00",
    speaker: "Dr. Sarah Miller",
    text: "Welcome to this lecture on Introduction to Quantum Physics. Today, we'll be exploring the fundamental concepts that form the basis of quantum mechanics.",
  },
  {
    time: "0:30",
    speaker: "Dr. Sarah Miller",
    text: "Before we dive into the specifics, let's take a moment to understand why quantum physics is so important and how it differs from classical physics.",
  },
  {
    time: "1:15",
    speaker: "Dr. Sarah Miller",
    text: "Classical physics, developed by scientists like Newton, works extremely well for describing the motion of objects we can see with our naked eye. However, when we start looking at very small scales, like atoms and subatomic particles, classical physics breaks down.",
  },
  {
    time: "2:00",
    speaker: "Dr. Sarah Miller",
    text: "This is where quantum mechanics comes in. It provides a framework for understanding the behavior of matter and energy at the atomic and subatomic levels.",
  },
  {
    time: "2:45",
    speaker: "Dr. Sarah Miller",
    text: "One of the most fascinating aspects of quantum physics is the concept of wave-particle duality. This principle suggests that all particles exhibit both wave-like and particle-like properties.",
  },
  {
    time: "3:30",
    speaker: "Dr. Sarah Miller",
    text: "Let's consider the famous double-slit experiment, which demonstrates this duality in a clear and profound way.",
  },
  {
    time: "5:45",
    speaker: "Dr. Sarah Miller",
    text: "Another key concept in quantum physics is Heisenberg's Uncertainty Principle, which states that there is a fundamental limit to the precision with which complementary properties of a particle can be known.",
  },
  {
    time: "7:20",
    speaker: "Dr. Sarah Miller",
    text: "For example, the more precisely we know a particle's position, the less precisely we can know its momentum, and vice versa.",
  },
]

const comments = [
  {
    name: "David Wilson",
    avatar: "/placeholder.svg",
    time: "2 days ago",
    text: "This video was incredibly helpful! The explanation of wave-particle duality finally made sense to me. Looking forward to more content like this.",
    likes: 24,
    replies: [
      {
        name: "Dr. Sarah Miller",
        avatar: "/placeholder.svg",
        time: "1 day ago",
        text: "Thank you, David! I'm glad you found it helpful. We'll be covering more quantum concepts in upcoming videos.",
      },
      {
        name: "Alex Thompson",
        avatar: "/placeholder.svg",
        time: "1 day ago",
        text: "I agree with David. The visual explanations really helped me understand these complex concepts.",
      },
    ],
  },
  {
    name: "Jennifer Lee",
    avatar: "/placeholder.svg",
    time: "1 week ago",
    text: "Could you please explain the Schrödinger equation in more detail in a future video? I'm still struggling with that concept.",
    likes: 15,
    replies: [
      {
        name: "Dr. Sarah Miller",
        avatar: "/placeholder.svg",
        time: "6 days ago",
        text: "Great suggestion, Jennifer! I'm planning a dedicated video on the Schrödinger equation next month. Stay tuned!",
      },
    ],
  },
  {
    name: "Michael Brown",
    avatar: "/placeholder.svg",
    time: "2 weeks ago",
    text: "The quality of these educational videos is outstanding. I'm using them to supplement my university physics course and they've been invaluable.",
    likes: 32,
    replies: [],
  },
]

