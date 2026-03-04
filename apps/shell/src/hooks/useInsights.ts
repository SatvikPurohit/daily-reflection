"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "@/lib/graphql-client";
import { DEMO_USER_ID } from "@/lib/constants";
import type { Insight } from "@repo/shared-types";

const INSIGHTS_QUERY = `
  query GetInsights($userId: ID!) {
    insights(userId: $userId) {
      id userId type title description actionable generatedAt
    }
  }
`;

const GENERATE_INSIGHTS_MUTATION = `
  mutation GenerateInsights($userId: ID!) {
    generateInsights(userId: $userId) {
      id userId type title description actionable generatedAt
    }
  }
`;

export function useInsights() {
  return useQuery<{ insights: Insight[] }>({
    queryKey: ["insights", DEMO_USER_ID],
    queryFn: () =>
      gqlClient.request(INSIGHTS_QUERY, { userId: DEMO_USER_ID }),
  });
}

export function useGenerateInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      gqlClient.request<{ generateInsights: Insight[] }>(
        GENERATE_INSIGHTS_MUTATION,
        { userId: DEMO_USER_ID }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
