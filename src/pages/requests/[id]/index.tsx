import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/drake_libs/ui/card"
import { Button } from "@/components/drake_libs/ui/button"
import { TeacherAccountRequest } from "./components/TeacherAccountRequest"
import { UseFetch } from "@/components/hooks/fetch-data"
import { HOST } from "@/static/env"
import { RequestType } from "@/models/requests/ListAllRequests"

export default function RequestDetail() {
//   const { id } = useParams()
  const [requestType, setRequestType] = useState("")
  const [requestData, setRequestData] = useState<any>(null);
 

  useEffect(() => {
    // Simulating data fetching based on the request ID
    // Replace this with actual data fetching logic
    const fetchData = async () => {
      // Placeholder data
      const data = {
        type: "Account Registration",
        status: "pending",
        first_name: "John",
        last_name: "Doe",
        middle_name: "Michael",
        email: "john.doe@example.com",
        user_type: "teacher",
      }
      setRequestType(data.type)
      setRequestData(data)
    }
    fetchData()
  }, [])

  if (!requestData) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Request Details</h1>
      <TeacherAccountRequest requestData={requestData} requestType={requestType} />
    </div>
  )
}

