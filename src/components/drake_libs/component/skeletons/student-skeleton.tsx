import { motion } from "framer-motion";

export function StudentSkeleton() {
  const shimmer = {
    initial: { backgroundPosition: "-1000px 0" },
    animate: { backgroundPosition: "1000px 0" },
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Avatar Skeleton */}
      <motion.div
        variants={shimmer}
        initial="initial"
        animate="animate"
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 flex-shrink-0"
        style={{
          backgroundSize: "1000px 100%",
        }}
      />

      {/* Text Content Skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Name Skeleton */}
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"
          style={{
            backgroundSize: "1000px 100%",
          }}
        />

        {/* ID Skeleton */}
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 0.1,
          }}
          className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2"
          style={{
            backgroundSize: "1000px 100%",
          }}
        />
      </div>
    </div>
  );
}
