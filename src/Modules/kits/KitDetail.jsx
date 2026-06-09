import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

function KitDetail() {
  const { kit_id } = useParams()
  const navigate = useNavigate()

  const [kit, setKit] = useState(null)

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    async function loadKit() {
      const { data, error } = await supabase
        .from('kits')
        .select('*')
        .eq('kit_id', kit_id)
        .single()

      if (error) console.error(error)
      else setKit(data)
    }
    loadKit()
  }, [kit_id])

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('kits')
      .delete()
      .eq('kit_id', kit_id)

    if (error) alert('Error deleting kit: ' + error.message)
    else alert('Kit deleted successfully!')

    navigate('/')
  }

  if (!kit) return <h2>Loading kit details...</h2>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Kit Details</h1>

      <p><strong>Kit ID:</strong> {kit.kit_id}</p>
      <p><strong>Revision:</strong> {kit.kit_revision}</p>
      <p><strong>Clean State:</strong> {kit.clean_state}</p>
      <p><strong>Delivered At:</strong> {new Date(kit.delivered_at).toLocaleString()}</p>
      <p><strong>Cleaned At:</strong> 
        {kit.cleaned_at ? new Date(kit.cleaned_at).toLocaleString() : '—'}
      </p>

      <button onClick={() => navigate('/')}>
        Back to List
      </button>

      <button
        className="delete-btn"
        style={{ marginLeft: '12px' }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Kit
      </button>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete Kit {kit_id}?</p>

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>

              <button className="modal-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default KitDetail
