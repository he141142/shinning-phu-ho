
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardFooter } from "@/components/drake_libs/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

interface RequestCardProps {
  title: string
  category: string
  status: "pending" | "approved" | "rejected"
}

export default function RequestCard({ title, category, status }: RequestCardProps) {
  const statusColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
          <div className="flex items-center">
            <span className="text-sm mr-2">Status:</span>
            <motion.span
              className={`inline-block px-2 py-1 rounded-full text-xs text-white ${statusColors[status]}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {status}
            </motion.span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/requests/1`}>
            <Button variant="outline">View Details</Button>
          </Link>
          <Button variant="destructive">Delete</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

