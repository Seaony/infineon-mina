import request from '@/utils/request'

export const profile = data => request.get('/user/profile', data)

export const checkin = data => request.post('/user/checkin', data)

export const vouchers = data => request.get('/user/vouchers', data)
