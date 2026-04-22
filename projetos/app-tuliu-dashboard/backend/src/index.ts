import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Key')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

app.use(cors())
app.use(express.json())

// Middleware de autenticação
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Buscar role do user
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    ;(req as any).user = user
    ;(req as any).role = profile?.role
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// ===== CLIENTS =====
app.get('/api/clients', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, created_at')
      .eq('role', 'client')

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' })
  }
})

app.post('/api/clients', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    // Criar user no Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: name,
        role: 'client',
      },
    })

    if (authError) throw authError

    // Profile é criado automaticamente pelo trigger
    res.status(201).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create client' })
  }
})

app.get('/api/clients/:id/services', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('client_id', id)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client services' })
  }
})

// ===== SERVICES =====
app.get('/api/services', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    console.log('GET /api/services - user role:', (req as any).role)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    res.json(data)
  } catch (error) {
    console.error('Error in GET /api/services:', error)
    res.status(500).json({ error: 'Failed to fetch services' })
  }
})

app.post('/api/services', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { client_id, type, name, description, expires_at, url } = req.body

    const { data, error } = await supabase.from('services').insert({
      client_id,
      type,
      name,
      description,
      expires_at,
      url,
    })

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' })
  }
})

app.patch('/api/services/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { type, name, description, status, expires_at, url } = req.body

    const { data, error } = await supabase
      .from('services')
      .update({ type, name, description, status, expires_at, url })
      .eq('id', id)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' })
  }
})

app.delete('/api/services/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('services').delete().eq('id', id)

    if (error) throw error
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' })
  }
})

// ===== CLIENT ROUTES =====
app.get('/api/my/services', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('client_id', userId)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' })
  }
})

// ===== RENEWALS =====
app.post('/api/renewals', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { service_id } = req.body

    const { data, error } = await supabase.from('renewals').insert({
      service_id,
      client_id: userId,
    })

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create renewal request' })
  }
})

app.get('/api/renewals', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('renewals')
      .select(`
        id,
        service_id,
        client_id,
        status,
        requested_at,
        services(name, type),
        profiles(name, email)
      `)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renewals' })
  }
})

app.patch('/api/renewals/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('renewals')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update renewal' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
