import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Participant {
  id: string;
  status: 'active' | 'disabled';
}

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL ?? '') + '/api',
    prepareHeaders: (headers) => {},
  }),
  tagTypes: ['Participants'],
  endpoints: (builder) => ({
    getParticipants: builder.query<Participant[], void>({
      query: () => ({
        url: '/participants/list',
        method: 'GET',
      }),
      providesTags: ['Participants'],
    }),
    addParticipants: builder.mutation<void, { count: number }>({
      query: ({ count }) => ({
        url: '/participants/add',
        method: 'POST',
        body: { count },
      }),
      invalidatesTags: ['Participants'],
    }),
    toggleStatus: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/participants/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Participants'],
    }),
  }),
});

export const useGetParticipants = rtkApi.useGetParticipantsQuery;
export const useAddParticipants = rtkApi.useAddParticipantsMutation;
export const useToggleStatus = rtkApi.useToggleStatusMutation;
