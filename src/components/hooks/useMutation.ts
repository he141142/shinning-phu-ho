import { delay } from "@/lib/utils";
import { HOST } from "@/static/env";
import { useState } from "react";

export const useGraphQLMutation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeMutation = async <T>(
        mutation: string,
        variables?: Record<string, any>
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${HOST}/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

           await delay(1000); // Simulate a delay of 1 second

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            return result.data as T;
        } catch (err: any) {
            setError(err.message || "An error occurred while processing the request.");
            console.error("GraphQL Error:", err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { executeMutation, loading, error };
};
