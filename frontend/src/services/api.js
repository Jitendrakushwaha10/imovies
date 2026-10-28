const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('imovies_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      // If unauthorized, clean stale token
      // Avoid infinite redirect loop if already on login page
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Movies
  getMovies: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params.sort) query.append('sort', params.sort);
    if (params.featured) query.append('featured', params.featured);

    const res = await fetch(`${API_BASE}/movies?${query.toString()}`);
    return handleResponse(res);
  },

  getMovieById: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return handleResponse(res);
  },

  createMovie: async (movieData) => {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData)
    });
    return handleResponse(res);
  },

  updateMovie: async (id, movieData) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData)
    });
    return handleResponse(res);
  },

  deleteMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Theatres
  getTheatres: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/theatres${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  createTheatre: async (data) => {
    const res = await fetch(`${API_BASE}/theatres`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteTheatre: async (id) => {
    const res = await fetch(`${API_BASE}/theatres/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Shows
  getShows: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/shows${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  getShowById: async (id) => {
    const res = await fetch(`${API_BASE}/shows/${id}`);
    return handleResponse(res);
  },

  getShowSeats: async (id) => {
    const res = await fetch(`${API_BASE}/shows/${id}/seats`);
    return handleResponse(res);
  },

  createShow: async (showData) => {
    const res = await fetch(`${API_BASE}/shows`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(showData)
    });
    return handleResponse(res);
  },

  deleteShow: async (id) => {
    const res = await fetch(`${API_BASE}/shows/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Bookings
  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return handleResponse(res);
  },

  getMyBookings: async () => {
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getBookingById: async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  cancelBooking: async (id, reason) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getAdminBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/bookings${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
