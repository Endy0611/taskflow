import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workspaceApi = createApi({
  reducerPath: 'workspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://taskflow-api.istad.co',
    prepareHeaders: (headers) => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.accessToken) {
            headers.set('Authorization', `Bearer ${userObj.accessToken}`);
          }
        } catch {}
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getWorkspaces: builder.query({
      query: () => '/workspaces',
    }),
    getWorkspaceById: builder.query({
      query: (id) => `/workspaces/${id}`,
    }),
    createWorkspace: builder.mutation({
      query: (body) => ({
        url: '/workspaces',
        method: 'POST',
        body,
      }),
    }),
    // Add more endpoints as needed
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
} = workspaceApi;