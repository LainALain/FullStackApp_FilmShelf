import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3333',
  headers: { 'Content-Type': 'application/json' }
});

export const getComments = id => axios.get(`/comments/${id}`).then(r => r.data);
export const postComment = (id, content, token) =>
  axios.post(`/comments/${id}`, { content }, { headers: { Authorization: `Bearer ${token}` } });

export const toggleFavorite = (omdbId, token) =>
  api.post(
    '/user/favorites/toggle',
    { omdbId },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data);

export const followUser = (targetId, token) =>
  axios.post(`/social/${targetId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const unfollowUser = (targetId, token) =>
  axios.delete(`/social/${targetId}/unfollow`, { headers: { Authorization: `Bearer ${token}` } });
export const getFollowers = userId => axios.get(`/social/${userId}/followers`).then(r => r.data);
export const getFollowing = userId => axios.get(`/social/${userId}/following`).then(r => r.data);
export const getProfile = username => axios.get(`/user/${username}`).then(r => r.data);
export const getMySettings = token =>
  axios.get('/user/settings', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
export const updateMySettings = (body, token) =>
  axios.put('/user/settings', body, { headers: { Authorization: `Bearer ${token}` } });
export const deleteAccount = token =>
  axios.delete('/user/settings', { headers: { Authorization: `Bearer ${token}` } });
