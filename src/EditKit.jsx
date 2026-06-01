import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from './services/supabaseClient'

function EditKit() {
  const { kit_id } = useParams()
  const navigate = useNavigate()

  // Form state
  const [kitRevision, setKitRevision] = useState('')
  const [cleanState, setCleanState] = useState('')
  const [deliveredAt, setDeliveredAt] = useState('')
  const [cleanedAt, setCleanedAt] = useState('')

  // Load kit data
  useEffect(() => {
    async function loadKit() {
      const { data, error } = await supabase
        .from('kits')
        .select('*')
        .eq('kit_id', kit_id)
        .single()

      if (error) {
        console.error(error)
        alert('Error loading kit')
      } else {
        setKitRevision(data.kit_revision)
        setCleanState(data.clean_state)
        setDeliveredAt(data.delivered_at?.slice(0, 16)) // format for datetime-local
        setCleanedAt(data.cleaned_at ? data.cleaned_at.slice(0, 16) : '')
      }
    }

    loadKit()
  }, [kit_id])

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('kits')
      .update({
        kit_revision: kitRevision,
        clean_state: cleanState,
        delivered_at: deliveredAt,
        cleaned_at: cleanedAt || null
      })
      .eq('kit_id', kit_id)

    if (error) {
      alert('Error updating kit: ' + error.message)
    } else {
      alert('Kit updated successfully!')
      navigate('/')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit Kit #{kit_id}</h1>

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
          Save Changes
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

export default EditKit
