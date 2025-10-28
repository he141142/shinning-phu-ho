"use client"

import { use, useContext, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs"
import RequestCard from "./rcomponents/request-card"
import { RequestType } from "@/models/requests/ListAllRequests"
import { UseFetch } from "@/components/hooks/fetch-data"
import { HOST } from "@/static/env"
import { RequestItem, TabProps, TabState, UseTab, UseTabHook } from "./hooks/tab"
import { StoreApi } from "zustand"
import { TabProvider, useTabContext } from "./context/TabContext"
import { shallow } from "zustand/shallow";


export function RequestsPageContent() {

  const requestTypes: RequestType[] = ["TeacherRegistrationRequest", "StaffRegistrationRequest"];

  const { 
    activeTab, 
    setActiveTab, 
    requestItems, 
    setRequestItems

  } = UseTabHook();
  const requestTypeQueryGen = (items: RequestItem[]): string => {
    const queries = items.map((item) => {
      return `
        {
          category:"${item.category}",
          limit: ${item.limit},
          page: ${item.page}
        }
      `
    })
    return queries.join(",")
  };

  console.log("re-rendered");
  console.log("activeTab", activeTab);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Request Management</h1>
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {requestTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        {requestTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">{type} Requests</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder data, replace with actual data fetching */}
                {[...Array(6)].map((_, i) => (
                  <RequestCard
                    key={i}
                    title={`${type} Request ${i + 1}`}
                    category={type}
                    status={i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "rejected"}
                  />
                ))}
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}




// ✅ Wrap `RequestsPageContent` with `TabProvider`
export default function RequestsPage() {

  return (
    <TabProvider activeTab={"TeacherRegistrationRequest"}>
      <RequestsPageContent />
    </TabProvider>
  );
}