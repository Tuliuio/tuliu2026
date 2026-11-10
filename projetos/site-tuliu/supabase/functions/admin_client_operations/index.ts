// Operações do admin da Tuliu sobre a conta de um cliente: trocar senha e entrar
// como o cliente (magic link). Só um usuário com clients.role = 'admin' pode chamar.
// Antes (até a v6) bastava estar logado, então qualquer cliente conseguia trocar a
// senha ou gerar link de entrada de qualquer conta, inclusive a do admin.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Quem chama precisa ser admin da Tuliu
    const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
    const { data: auth } = await supabaseAdmin.auth.getUser(jwt)
    if (!auth?.user) return reply({ error: 'Não autenticado' }, 401)
    const { data: caller } = await supabaseAdmin
      .from('clients')
      .select('role')
      .eq('user_id', auth.user.id)
      .maybeSingle()
    if (caller?.role !== 'admin') return reply({ error: 'Acesso restrito ao admin' }, 403)

    const { action, newPassword, clientEmail } = await req.json()

    // Nunca sobre outra conta de admin
    const target = clientEmail
      ? (await supabaseAdmin.from('clients').select('user_id, role').eq('email', clientEmail).maybeSingle()).data
      : null

    if (action === 'change_password') {
      if (!clientEmail || !newPassword) return reply({ error: 'Missing required fields' }, 400)
      if (String(newPassword).length < 6) return reply({ error: 'A senha precisa ter pelo menos 6 caracteres' }, 400)
      if (!target?.user_id) return reply({ error: 'Usuário não encontrado' }, 404)
      if (target.role === 'admin') return reply({ error: 'Não é possível alterar a senha de um admin por aqui' }, 403)

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(target.user_id, { password: newPassword })
      if (updateError) throw updateError
      return reply({ success: true })
    }

    if (action === 'login_as_client') {
      if (!clientEmail) return reply({ error: 'Missing clientEmail' }, 400)
      if (!target?.user_id) return reply({ error: 'Usuário não encontrado' }, 404)
      if (target.role === 'admin') return reply({ error: 'Não é possível entrar como outro admin' }, 403)

      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: clientEmail,
        options: { redirectTo: 'https://tuliu.io/dashboard' },
      })
      if (error) throw error
      return reply({ success: true, action_link: data.properties.action_link })
    }

    return reply({ error: 'Invalid action' }, 400)
  } catch (error: any) {
    console.error('Error:', error)
    return reply({ error: error.message || 'Internal server error' }, 500)
  }
})
