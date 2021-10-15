import request from '@/utils/request';

export function login(username, password) {
  return request({
    url: '/uaa/oauth/token',
    method: 'post',
    data: {
      username,
      password,
      grant_type: 'password'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic YW5kcm9pZDphZG1pbg=='
    }
  });
}

export function getInfo(login_id) {
  return request({
    url: '/profile-service/1.0.0/queryUserProfileById/' + login_id,
    method: 'post'
  });
}

export function logout() {
  return request({
    url: '/uaa/oauth/token',
    method: 'delete',
    headers: {
      Authorization: 'Basic YW5kcm9pZDphZG1pbg=='
    }
  });
}
