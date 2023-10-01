import request from '@/utils/request'

export const show = (id, data) => request.get(`/users/${id}`, data)

export const verify = (id, data) => request.put(`/users/${id}/verify`, data)

export const credits = (id, data) => request.put(`/users/${id}/credits`, data)

export const game = (id, data) => request.put(`/users/${id}/game`, data)
