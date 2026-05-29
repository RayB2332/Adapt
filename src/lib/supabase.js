// Direct Supabase API calls — no library needed, saves 200KB
const URL  = import.meta.env.VITE_SUPABASE_URL  || ''
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const headers = (token) => ({
  'Content-Type': 'application/json',
  'apikey': KEY,
  'Authorization': `Bearer ${token || KEY}`,
})

// ── Session management ────────────────────────────────────────────────────
const SESSION_KEY = 'adapt_session'

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}
function setSession(session) {
  if(session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

// ── Auth state change listeners ───────────────────────────────────────────
const listeners = []
function notifyListeners(event, session) {
  listeners.forEach(cb => { try { cb(event, session) } catch(e) {} })
}

// ── Auth API ──────────────────────────────────────────────────────────────
async function authFetch(path, body) {
  try {
    const r = await fetch(`${URL}/auth/v1/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': KEY },
      body: JSON.stringify(body)
    })
    return await r.json()
  } catch(e) {
    return { error: { message: 'Connection failed — please try again' } }
  }
}

// ── Database API ──────────────────────────────────────────────────────────
function from(table) {
  const session = getSession()
  const token = session?.access_token || KEY
  const hdrs = headers(token)

  return {
    select: (cols='*') => ({
      eq: (col, val) => ({
        single: async () => {
          try {
            const r = await fetch(`${URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&select=${cols}`, {
              headers: { ...hdrs, 'Accept': 'application/vnd.pgrst.object+json' }
            })
            if(r.status === 406 || r.status === 404) return { data: null, error: null }
            const data = await r.json()
            return r.ok ? { data, error: null } : { data: null, error: data }
          } catch(e) { return { data: null, error: { message: e.message } } }
        },
        limit: () => ({})
      })
    }),
    upsert: async (obj) => {
      try {
        const r = await fetch(`${URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: { ...hdrs, 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify(obj)
        })
        return r.ok ? { error: null } : { error: await r.json() }
      } catch(e) { return { error: { message: e.message } } }
    },
    insert: async (obj) => {
      try {
        const r = await fetch(`${URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify(obj)
        })
        return r.ok ? { error: null } : { error: await r.json() }
      } catch(e) { return { error: { message: e.message } } }
    }
  }
}

// ── Auth object ───────────────────────────────────────────────────────────
const auth = {
  onAuthStateChange: (cb) => {
    listeners.push(cb)
    // Check existing session immediately
    const session = getSession()
    if(session?.access_token) {
      setTimeout(() => cb('SIGNED_IN', { user: session.user }), 0)
    } else {
      setTimeout(() => cb('SIGNED_OUT', null), 0)
    }
    return { data: { subscription: { unsubscribe: () => {
      const i = listeners.indexOf(cb)
      if(i > -1) listeners.splice(i, 1)
    }}}}
  },

  signInWithPassword: async ({ email, password }) => {
    const data = await authFetch('token?grant_type=password', { email, password })
    if(data.error || data.error_code) {
      return { error: { message: data.error_description || data.msg || 'Invalid email or password' } }
    }
    const session = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user }
    setSession(session)
    notifyListeners('SIGNED_IN', { user: data.user })
    return { data, error: null }
  },

  signUp: async ({ email, password, options }) => {
    const data = await authFetch('signup', { email, password, data: options?.data || {} })
    if(data.error || data.error_code) {
      return { error: { message: data.error_description || data.msg || 'Sign up failed' } }
    }
    // If email confirmation disabled, session is returned immediately
    if(data.access_token) {
      const session = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user }
      setSession(session)
      notifyListeners('SIGNED_IN', { user: data.user })
    }
    return { data, error: null }
  },

  signOut: async () => {
    const session = getSession()
    if(session?.access_token) {
      try {
        await fetch(`${URL}/auth/v1/logout`, {
          method: 'POST',
          headers: headers(session.access_token)
        })
      } catch(e) {}
    }
    setSession(null)
    notifyListeners('SIGNED_OUT', null)
    return { error: null }
  },

  getUser: async () => {
    const session = getSession()
    if(!session?.access_token) return { data: { user: null } }
    return { data: { user: session.user } }
  },

  updateUser: async (updates) => {
    const session = getSession()
    if(!session?.access_token) return { error: { message: 'Not logged in' } }
    try {
      const r = await fetch(`${URL}/auth/v1/user`, {
        method: 'PUT',
        headers: headers(session.access_token),
        body: JSON.stringify(updates)
      })
      const data = await r.json()
      if(r.ok && data.id) {
        const newSession = { ...session, user: data }
        setSession(newSession)
      }
      return r.ok ? { data, error: null } : { error: data }
    } catch(e) { return { error: { message: e.message } } }
  },

  resetPasswordForEmail: async (email) => {
    const data = await authFetch('recover', { email })
    return data.error ? { error: data } : { error: null }
  }
}

export const supabase = { auth, from }
