import { GraphQLClient } from "graphql-request";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const gqlClient = new GraphQLClient(`${API_URL}/graphql`);
