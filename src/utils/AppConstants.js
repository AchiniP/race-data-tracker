const {EXTERNAL_API, ADMIN_USER_NAME, ADMIN_PASSWORD, DATABASE_URL} = process.env

export const AUTH_REQ_OBJECT = {
  method: 'POST',
  url: `${EXTERNAL_API}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  data: {
    email: ADMIN_USER_NAME,
    password: ADMIN_PASSWORD
  }
};

export const FETCH_DATA_REQ_OBJ = (token) => {
  return {
    method: 'GET',
    url: `${EXTERNAL_API}/results`,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
};

export const DB_CONNECTION = {
  url: DATABASE_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};

export const STATUS_DB_CONNECT = 'connect';
export const STATUS_DB_SAVE = 'save';
export const STATUS_START_SERVICE = 'start';
export const STATUS_RETRY_SERVICE = 'retry';
