import { InitialModal } from "@/components/drake_libs/customs/initial-modal"
import { CardHeader, Card, CardTitle, CardContent, CardFooter } from "@/components/drake_libs/ui/card"
import { GetClassByIdResponse } from "@/models/class/class.detail"
import { motion } from "framer-motion"
import { useRouter } from "next/router"

export type ClassesListProps = {
  classes: Exclude<
    GetClassByIdResponse,
    | "students"
    | "class_config"
    | "teacher"
    | "grade"
    | "current_semester"
    | "start_date">[];
}

export default function ClassesList({ classes }: ClassesListProps) {
  const router = useRouter();
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {classes.map((classItem, index) => (
        <motion.div
          key={classItem.class_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-lg">
              <CardTitle className="text-lg font-semibold">{classItem.class_name}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <InfoRow label="Description" value={classItem.description || "N/A"} />
              <InfoRow label="Schedule" value={"N/A"} />
              <InfoRow
                label="Enrollment"
                value={`${classItem?.students?.length || 0} / ${classItem.max_students}`}
              />
              <InfoRow label="Room" value={classItem.room?.room_number || "N/A"} />
            </CardContent>
          </Card>
          <CardFooter className="p-4">
            <motion.button
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300
                  hover:bg-blue-600 hover:scale-105 active:scale-95"
              onClick={() => {
                console.log(`View Details for Class ID: ${classItem.class_id}`);
                // router.push(url);
                const url = `/class_detail/${classItem.class_id}`;
                window.open(url, "_blank"); // 🟢 Open in new tab
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Detail
            </motion.button>
          </CardFooter>
        </motion.div>
      ))}
    </motion.div>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm font-semibold text-gray-900">{value}</dd>
  </div>
);