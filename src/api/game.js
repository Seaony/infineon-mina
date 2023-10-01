import request from '@/utils/request'

export const index = data => request.get('/game', data)
