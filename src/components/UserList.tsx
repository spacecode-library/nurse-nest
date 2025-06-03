import React, { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client.js'
import { MessageCircle } from 'lucide-react'

const UserList = ({ currentUserId, onNewConversation, userType }) => {
  const [nurses, setNurses] = useState([])
  const [jobPostings, setJobPostings] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNurses()
    fetchJobPostings()
  }, [])

  const fetchNurses = async () => {
    try {
      const { data, error } = await supabase
        .from('nurse_profiles')
        .select('*')

      if (error) throw error
      setNurses(data)
    } catch (error) {
      console.error('Error fetching nurses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('id, job_code')
        .eq('client_id', currentUserId)
      console.log(currentUserId)
      if (error) throw error
      setJobPostings(data)
    } catch (error) {
      console.error('Error fetching job postings:', error)
    }
  }

  const startConversation = async (nurseId) => {
    if (!selectedJob) {
      alert('Please select a job posting first')
      return
    }

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .eq('client_id', currentUserId)
        .eq('nurse_id', nurseId)
        .eq('job_id', selectedJob)
        .single()

      if (existingConv) {
        // Use existing conversation
        const nurse = nurses.find(n => n.id === nurseId)
        const job = jobPostings.find(j => j.id === selectedJob)
        
        onNewConversation({
          ...existingConv,
          otherParticipant: nurse,
          job_postings: job
        })
        return
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          client_id: currentUserId,
          nurse_id: nurseId,
          job_id: selectedJob
        })
        .select()
        .single()

      if (error) throw error

      const nurse = nurses.find(n => n.id === nurseId)
      const job = jobPostings.find(j => j.id === selectedJob)

      onNewConversation({
        ...newConv,
        otherParticipant: nurse,
        job_postings: job
      })
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  if (loading) return <div className="loading">Loading nurses...</div>

  return (
    <div className="user-list">
      <div className="job-selector">
        <select 
          value={selectedJob} 
          onChange={(e) => setSelectedJob(e.target.value)}
          className="job-select"
        >
          <option value="">Select a job posting</option>
          {jobPostings.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {nurses.map((nurse) => (
        <div key={nurse.id} className="user-item">
          <div className="user-info">
            <div className="user-avatar">
              {nurse.avatar_url ? (
                <img src={nurse.avatar_url} alt="" />
              ) : (
                <div className="avatar-placeholder">
                  {nurse.name?.charAt(0)?.toUpperCase() || 'N'}
                </div>
              )}
            </div>
            <div className="user-details">
              <span className="username">{nurse.name}</span>
              <span className="user-specialty">{nurse.specialty}</span>
            </div>
          </div>
          <button 
            onClick={() => startConversation(nurse.id)}
            className="start-chat-btn"
            disabled={!selectedJob}
          >
            <MessageCircle size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default UserList