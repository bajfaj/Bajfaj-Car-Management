import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddCarPage() {
  const navigate = useNavigate()
  
  useEffect(() => {
    navigate('/cars', { state: { openAddModal: true }, replace: true })
  }, [navigate])

  return null
}