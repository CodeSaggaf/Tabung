import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useLang, t } from '@/lib/langStore'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function Savings({ user }) {
  const { lang } = useLang()
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState({ goal_name: '', target_amount: '', current_amount: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const { data, error } = await supabase
      .from('savings')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setGoals(data || [])
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.goal_name || !form.target_amount) return
    setLoading(true)
    const { error } = await supabase.from('savings').insert([{
      user_id: user.id,
      goal_name: form.goal_name,
      target_amount: Number(form.target_amount),
      current_amount: Number(form.current_amount || 0)
    }])
    setLoading(false)
    if (!error) {
      setForm({ goal_name: '', target_amount: '', current_amount: '' })
      load()
    }
  }

  const update = async (g) => {
    const { error } = await supabase.from('savings').update({
      goal_name: g.goal_name,
      target_amount: Number(g.target_amount),
      current_amount: Number(g.current_amount)
    }).eq('id', g.id)
    if (!error) load()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('savings').delete().eq('id', id)
    if (!error) load()
  }

  const toCSV = () => {
    const rows = [['Goal Name','Target Amount','Current Amount','Created At']]
    goals.forEach(g => rows.push([g.goal_name, g.target_amount, g.current_amount, g.created_at]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'tabung-savings.csv'
    link.click()
  }

  const totals = useMemo(() => {
    const totalTarget = goals.reduce((s,g)=>s+Number(g.target_amount||0),0)
    const totalCurrent = goals.reduce((s,g)=>s+Number(g.current_amount||0),0)
    return { totalTarget, totalCurrent }
  }, [goals])

  const pieData = [
    { name: 'Saved', value: totals.totalCurrent },
    { name: 'Remaining', value: Math.max(totals.totalTarget - totals.totalCurrent, 0) }
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="bg-gray-800 border border-white/10 rounded px-3 py-2"
          placeholder={t(lang,'savings')}
          value={form.goal_name}
          onChange={e=>setForm(f=>({...f, goal_name:e.target.value}))}
        />
        <input
          type="number"
          className="bg-gray-800 border border-white/10 rounded px-3 py-2"
          placeholder={t(lang,'target')}
          value={form.target_amount}
          onChange={e=>setForm(f=>({...f, target_amount:e.target.value}))}
        />
        <div className="flex gap-2">
          <input
            type="number"
            className="bg-gray-800 border border-white/10 rounded px-3 py-2 w-full"
            placeholder={t(lang,'current')}
            value={form.current_amount}
            onChange={e=>setForm(f=>({...f, current_amount:e.target.value}))}
          />
          <button
            onClick={add}
            disabled={loading}
            className="px-4 rounded bg-green-600 hover:bg-green-500 disabled:opacity-50"
          >
            {t(lang,'add')}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 p-4">
        <h3 className="text-sm opacity-80 mb-2">{t(lang,'summary')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold">RM {totals.totalCurrent.toFixed(2)}</div>
            <div className="text-xs opacity-70">Total Saved</div>
            <div className="text-2xl font-semibold mt-3">RM {totals.totalTarget.toFixed(2)}</div>
            <div className="text-xs opacity-70">Total Target</div>
            <button onClick={toCSV} className="mt-3 text-sm underline decoration-dotted">
              {t(lang,'export')}
            </button>
          </div>
          <div style={{width:'100%', height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((e,i)=>(
                    <Cell key={i} fill={i===0? '#22c55e' : '#f97316'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">{t(lang,'goals')}</h3>
        {goals.length === 0 && <p className="opacity-70">{t(lang,'noGoals')}</p>}
        {goals.map(g => {
          const progress = Math.min(100, (Number(g.current_amount||0) / Math.max(1, Number(g.target_amount||0))) * 100)
          return (
            <div key={g.id} className="p-3 rounded border border-white/10">
              <div className="grid gap-2 sm:grid-cols-4">
                <input
                  className="bg-gray-800 border border-white/10 rounded px-3 py-2"
                  value={g.goal_name}
                  onChange={e=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x, goal_name:e.target.value}:x))}
                />
                <input
                  type="number"
                  className="bg-gray-800 border border-white/10 rounded px-3 py-2"
                  value={g.target_amount}
                  onChange={e=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x, target_amount:e.target.value}:x))}
                />
                <input
                  type="number"
                  className="bg-gray-800 border border-white/10 rounded px-3 py-2"
                  value={g.current_amount}
                  onChange={e=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x, current_amount:e.target.value}:x))}
                />
                <div className="flex gap-2">
                  <button onClick={()=>update(g)} className="px-3 rounded bg-blue-600 hover:bg-blue-500">{t(lang,'update')}</button>
                  <button onClick={()=>remove(g.id)} className="px-3 rounded bg-red-600 hover:bg-red-500">{t(lang,'delete')}</button>
                </div>
              </div>
              <div className="mt-2 w-full h-2 bg-gray-800 rounded overflow-hidden">
                <div className="h-2 bg-green-500" style={{width: progress + '%'}}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
