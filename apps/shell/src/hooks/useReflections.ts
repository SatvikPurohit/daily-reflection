"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "@/lib/graphql-client";
import { DEMO_USER_ID } from "@/lib/constants";
import type { ReflectionEntry } from "@repo/shared-types";

const REFLECTIONS_QUERY = `
  query GetReflections($userId: ID!, $limit: Int, $offset: Int) {
    reflections(userId: $userId, limit: $limit, offset: $offset) {
      id userId mood urge context triggers emotions
      dayOfWeek weekNumber monthNumber createdAt updatedAt
    }
  }
`;

const CREATE_REFLECTION_MUTATION = `
  mutation CreateReflection($input: CreateReflectionInput!) {
    createReflection(input: $input) {
      id userId mood urge context triggers emotions
      dayOfWeek weekNumber monthNumber createdAt updatedAt
    }
  }
`;

const DELETE_REFLECTION_MUTATION = `
  mutation DeleteReflection($id: ID!) {
    deleteReflection(id: $id)
  }
`;

export function useReflections(limit = 10, offset = 0) {
  return useQuery<{ reflections: ReflectionEntry[] }>({
    queryKey: ["reflections", DEMO_USER_ID, limit, offset],
    queryFn: () =>
      gqlClient.request(REFLECTIONS_QUERY, {
        userId: DEMO_USER_ID,
        limit,
        offset,
      }),
  });
}

export function useCreateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      mood: number;
      urge: number;
      context?: string;
      triggers?: string[];
      emotions?: string[];
    }) =>
      gqlClient.request<{ createReflection: ReflectionEntry }>(
        CREATE_REFLECTION_MUTATION,
        { input: { ...input, userId: DEMO_USER_ID } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reflections"] });
      queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    },
  });
}

export function useDeleteReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      gqlClient.request<{ deleteReflection: boolean }>(
        DELETE_REFLECTION_MUTATION,
        { id }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reflections"] });
      queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    },
  });
}
