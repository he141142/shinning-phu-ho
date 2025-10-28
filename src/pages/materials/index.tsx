"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, BookText, Clock, Download, FileText, Search, Star, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs"
import { Input } from "@/components/drake_libs/ui/input"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Badge } from "@/components/drake_libs/ui/badge"

export default function StudyMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-16 md:py-24 relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-center mb-6"
          >
            Your Learning Journey <span className="text-primary">Starts Here</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8"
          >
            Access high-quality study materials to help you excel in your courses and achieve your academic goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-md mx-auto relative"
          >
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for study materials..."
              className="pl-10 h-12 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-60 z-0" />
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="mb-12">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {studyMaterials.map((material) => (
                <StudyMaterialCard key={material.id} material={material} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="documents">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {studyMaterials
                .filter((material) => material.type === "document")
                .map((material) => (
                  <StudyMaterialCard key={material.id} material={material} />
                ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="videos">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {studyMaterials
                .filter((material) => material.type === "video")
                .map((material) => (
                  <StudyMaterialCard key={material.id} material={material} />
                ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="quizzes">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {studyMaterials
                .filter((material) => material.type === "quiz")
                .map((material) => (
                  <StudyMaterialCard key={material.id} material={material} />
                ))}
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="my-16 bg-primary/5 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Premium Study Materials</h2>
              <p className="text-muted-foreground mb-6">
                Unlock access to our premium collection of study materials, practice exams, and personalized learning
                paths.
              </p>
              <Button size="lg" className="rounded-full">
                Upgrade Now
              </Button>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Premium study materials"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="my-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant={
                          material.type === "document" ? "default" : material.type === "video" ? "secondary" : "outline"
                        }
                      >
                        {material.type}
                      </Badge>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm">{material.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="mt-2">{material.title}</CardTitle>
                    <CardDescription>{material.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-40 mb-4 rounded-md overflow-hidden">
                      <Image
                        src={material.image || "/placeholder.svg"}
                        alt={material.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{material.duration}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Material
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" /> StudyHub
              </h3>
              <p className="text-muted-foreground">
                Your one-stop platform for high-quality study materials and academic resources.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Browse Materials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Premium Access
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Mathematics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Science
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Computer Science
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Languages
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-muted-foreground">support@studyhub.com</li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} StudyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StudyMaterialCard({ material } : { material: any }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "quiz":
        return <BookText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={item}>
      <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={material.image || "/placeholder.svg"}
              alt={material.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              variant={material.type === "document" ? "default" : material.type === "video" ? "secondary" : "outline"}
              className="flex items-center gap-1"
            >
              {getIcon(material.type)}
              {material.type}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="line-clamp-1">{material.title}</CardTitle>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">{material.rating}</span>
            </div>
          </div>
          <CardDescription>{material.subject}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-4">{material.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{material.duration}</span>
            </div>
            {material.downloads && (
              <div className="flex items-center text-muted-foreground">
                <Download className="h-4 w-4 mr-1" />
                <span>{material.downloads} downloads</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">View Material</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const studyMaterials = [
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
  {
    id: 6,
    title: "World History: 20th Century",
    subject: "History",
    description: "Explore the major events, figures, and movements that shaped the 20th century.",
    type: "quiz",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    duration: "30 minutes",
    downloads: 654,
  },
  {
    id: 7,
    title: "Introduction to Psychology",
    subject: "Psychology",
    description: "Learn about the fundamental concepts and theories in psychology and human behavior.",
    type: "document",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    duration: "2 hours",
    downloads: 1876,
  },
  {
    id: 8,
    title: "Web Development Bootcamp",
    subject: "Computer Science",
    description: "A complete guide to modern web development including HTML, CSS, JavaScript, and popular frameworks.",
    type: "video",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    duration: "4 hours",
    downloads: 3254,
  },
  {
    id: 9,
    title: "Biology: Cell Structure and Function",
    subject: "Biology",
    description: "Detailed exploration of cell structure, organelles, and cellular processes.",
    type: "quiz",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    duration: "45 minutes",
    downloads: 987,
  },
]

const recentMaterials = [
  {
    id: 10,
    title: "Machine Learning Fundamentals",
    subject: "Computer Science",
    description: "Introduction to machine learning algorithms and their applications.",
    type: "document",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    duration: "2.5 hours",
  },
  {
    id: 11,
    title: "Spanish for Beginners",
    subject: "Languages",
    description: "Learn basic Spanish vocabulary, grammar, and conversation skills.",
    type: "video",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    duration: "1 hour",
  },
  {
    id: 12,
    title: "Economics: Supply and Demand",
    subject: "Economics",
    description: "Understanding the fundamental principles of supply and demand in economics.",
    type: "quiz",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    duration: "30 minutes",
  },
]

