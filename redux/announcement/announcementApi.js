import { api } from "../service"; // Import the api from service

export const announcementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addAnnouncement: builder.mutation({
      query: (data) => ({
        url: `/api/announcement/addAnnouncement`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getAllAnnouncements"],
    }),
    getAnnouncementbyDpt: builder.query({
        query: (name) => `/api/announcement/announcements?departmentName=${name}`,
        providesTags: ["getAllAnnouncements"],
    }),
    getAnnouncementById: builder.mutation({
      query: (data) => ({
        url: `/api/announcement/announcements/${data.id}`,
        method: "GET",
      }),
    }),
    updateAnnouncementById: builder.mutation({
      query: (data) => {
        console.log("inside apiiiii",data)
        return ({
          url: `/api/announcement/announcements/${data.id}`,
          method: "PUT",
          body: data?.formData,
        })
      },
      invalidatesTags: ["getAllAnnouncements"],
  }),
  deleteAnnouncementById: builder.mutation({
    query: (data) => ({
      url: `/api/announcement/announcements/${data.id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["getAllAnnouncements"],
}),
getSingleAnnouncementById: builder.query({
  query: (data) => ({
    url: `/api/announcement/announcements/${data}`,
    method: "GET",
  }),
  providesTags: ["getAllAnnouncements"],
}),

  }),
});

export const {
useAddAnnouncementMutation,
useGetAnnouncementbyDptQuery,
useGetAnnouncementByIdMutation,
useUpdateAnnouncementByIdMutation,
useDeleteAnnouncementByIdMutation,
useGetSingleAnnouncementByIdQuery,

} = announcementApi;
