import request from '@/utils/request'

export const login = data => request.post('/auth/login', data)

export const bind = data => request.post('/auth/bind', data)
