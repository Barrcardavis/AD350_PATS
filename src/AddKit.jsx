import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './services/supabaseClient'

function AddKit() {
  const navigate = useNavigate()

  // Form state
  const [kitRevision, setKitRevision] = useState('')
  const [cleanState, setCleanState] = useState('pre_clean')
  const [deliveredAt, setDeliveredAt] = useState('')
  const [cleanedAt, setCleanedAt] = useState('')

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault()

    const { error } = await supabase.from('kits').insert([
      {
        kit_revision: kitRevision,
        clean_state: cleanState,
        delivered_at: deliveredAt,
        cleaned_at: cleanedAt || null
      }
    ])

    if (error) {
      alert('Error adding kit: ' + error.message)
    } else {
      alert('Kit added successfully!')
      navigate('/')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add New Kit</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        
        <label>Kit Revision</label>
        <input
          type="text"
          value={kitRevision}
          onChange={(e) => setKitRevision(e.target.value)}
          required
        />

        <label>Clean State</label>
        <select
          value={cleanState}
          onChange={(e) => setCleanState(e.target.value)}
        >
          <option value="pre_clean">Pre Clean</option>
          <option value="post_clean">Post Clean</option>
        </select>

        <label>Delivered At</label>
        <input
          type="datetime-local"
          value={deliveredAt}
          onChange={(e) => setDeliveredAt(e.target.value)}
          required
        />

        <label>Cleaned At (optional)</label>
        <input
          type="datetime-local"
          value={cleanedAt}
          onChange={(e) => setCleanedAt(e.target.value)}
        />

        <button type="submit" style={{ marginTop: '20px' }}>
          Add Kit
        </button>
      </form>

      <button
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/')}
      >
        Back to List
      </button>
    </div>
  )
}

export default AddKit
