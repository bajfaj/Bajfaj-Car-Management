import { useState, useEffect } from 'react'

export default function AddCarModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    registration: '', make: '', model: '', colour: '', engine: '', transmission: '', fuel: '', // <-- make
    logbook: '', purchaseYear: '', source: '', winningBid: '', additionalFee: '', delivery: '',
    repairCost: '', mechanic: '', personalUse: '', mileagePurchase: '',
  })

  const [totalSpent, setTotalSpent] = useState(0)
  const [error, setError] = useState('') // NEW

  useEffect(() => {
    const bid = Number(formData.winningBid) || 0
    const fee = Number(formData.additionalFee) || 0
    const del = Number(formData.delivery) || 0
    const repair = Number(formData.repairCost) || 0
    setTotalSpent(bid + fee + del + repair)
  }, [formData.winningBid, formData.additionalFee, formData.delivery, formData.repairCost])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    const newValue = name === 'registration'? value.toUpperCase() : value
    setFormData(prev => ({...prev, [name]: newValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('') // NEW

    // NEW: Validation
    if (!formData.registration ||!formData.make ||!formData.model ||!formData.purchaseYear) { // <-- make
      setError('Registration, Make, Model and Purchase Year are required')
      return
    }

    const newCar = {
    ...formData,
      purchaseYear: Number(formData.purchaseYear),
      winningBid: Number(formData.winningBid),
      additionalFee: Number(formData.additionalFee),
      delivery: Number(formData.delivery),
      repairCost: Number(formData.repairCost),
      mileagePurchase: Number(formData.mileagePurchase),
      totalSpent,
      status: 'Held',
      profit: 0, // <-- FIXED: was -totalSpent
      saleAmount: null, saleYear: null, platformSoldOn: null, // <-- removed id: Date.now()
      advertisedPlatforms: null, advertDuration: null, mileageSale: null,
    }
    onSave(newCar) // PESSIMISTIC: let parent refetch
    onClose()
    setFormData({
      registration: '', make: '', model: '', colour: '', engine: '', transmission: '', fuel: '', // <-- make
      logbook: '', purchaseYear: '', source: '', winningBid: '', additionalFee: '', delivery: '',
      repairCost: '', mechanic: '', personalUse: '', mileagePurchase: '',
    })
  }

  // FORCE STYLES so nothing can override
  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #9ca3af',
    borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  }
  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: 500,
    color: '#374151', marginBottom: '4px'
  }

  return (
    <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50}}>
      <div style={{background: 'white', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '672px', maxHeight: '90vh', display: 'flex', flexDirection: 'column'}}>

        <div style={{padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0}}>
          <h3 style={{fontSize: '18px', fontWeight: 500, color: '#111827'}}>Add New Car</h3>
          <button onClick={onClose} style={{color: '#9ca3af', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer'}}>&times;</button>
        </div>

        <div style={{overflowY: 'auto', padding: '24px', minHeight: 0}}>
          {error && <div style={{marginBottom: '16px', padding: '8px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px'}}>{error}</div>} {/* NEW */}
          <form id="add-car-form" onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div>
              <h4 style={{fontSize: '16px', fontWeight: 500, color: '#111827', marginBottom: '12px'}}>Car Details</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={labelStyle}>Registration *</label> {/* Added * */}
                  <input name="registration" value={formData.registration} onChange={handleChange} placeholder="e.g. AB12 CDE" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Make *</label> {/* <-- Make */}
                  <input name="make" value={formData.make} onChange={handleChange} placeholder="e.g. BMW" required style={inputStyle} /> {/* <-- make */}
                </div>
                <div>
                  <label style={labelStyle}>Model *</label>
                  <input name="model" value={formData.model} onChange={handleChange} placeholder="e.g. 320i" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Colour</label>
                  <input name="colour" value={formData.colour} onChange={handleChange} placeholder="e.g. Black" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Engine</label>
                  <input name="engine" value={formData.engine} onChange={handleChange} placeholder="e.g. 2.0" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} style={inputStyle}>
                    <option value="" disabled>Select transmission</option>
                    <option value="Manual">MANUAL</option>
                    <option value="Automatic">AUTOMATIC</option>
                  </select>
                </div>
                <div style={{gridColumn: 'span 2'}}>
                  <label style={labelStyle}>Fuel</label>
                  <select name="fuel" value={formData.fuel} onChange={handleChange} required style={inputStyle}>
                    <option value="" disabled>Select fuel</option>
                    <option value="PETROL">PETROL</option>
                    <option value="DIESEL">DIESEL</option>
                    <option value="HYBRID">HYBRID</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{fontSize: '16px', fontWeight: 500, color: '#111827', marginBottom: '12px'}}>Purchase Info</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div><label style={labelStyle}>Purchase Year *</label><input name="purchaseYear" type="number" value={formData.purchaseYear} onChange={handleChange} placeholder="e.g. 2023" required style={inputStyle} /></div>
                <div><label style={labelStyle}>Source</label><input name="source" value={formData.source} onChange={handleChange} placeholder="e.g. COPART - YORK" style={inputStyle} /></div>
                <div><label style={labelStyle}>Mechanic</label><input name="mechanic" value={formData.mechanic} onChange={handleChange} placeholder="e.g. John" style={inputStyle} /></div>
                <div><label style={labelStyle}>Winning Bid £</label><input name="winningBid" type="number" value={formData.winningBid} onChange={handleChange} placeholder="e.g. 1500" style={inputStyle} /></div>
                <div><label style={labelStyle}>Additional Fee £</label><input name="additionalFee" type="number" value={formData.additionalFee} onChange={handleChange} placeholder="e.g. 250" style={inputStyle} /></div>
                <div><label style={labelStyle}>Delivery Cost £</label><input name="delivery" type="number" value={formData.delivery} onChange={handleChange} placeholder="e.g. 120" style={inputStyle} /></div>
                <div><label style={labelStyle}>Repair Cost £</label><input name="repairCost" type="number" value={formData.repairCost} onChange={handleChange} placeholder="e.g. 300" style={inputStyle} /></div>
                <div><label style={labelStyle}>Mileage at Purchase</label><input name="mileagePurchase" type="number" value={formData.mileagePurchase} onChange={handleChange} placeholder="e.g. 80000" style={inputStyle} /></div>
                <div><label style={labelStyle}>Logbook Available?</label><select name="logbook" value={formData.logbook} onChange={handleChange} style={inputStyle}><option value="" disabled>Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
                <div><label style={labelStyle}>Personal Use?</label><select name="personalUse" value={formData.personalUse} onChange={handleChange} style={inputStyle}><option value="" disabled>Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
              </div>
            </div>

            <div style={{background: '#f9fafb', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '14px', fontWeight: 500, color: '#374151'}}>Total Amount Spent:</span>
                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#111827'}}>£{totalSpent.toLocaleString()}</span>
              </div>
            </div>
          </form>
        </div>

        <div style={{padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexShrink: 0}}>
          <button type="button" onClick={onClose} style={{padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#374151', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer'}}>Cancel</button>
          <button type="submit" form="add-car-form" style={{padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: 'white', background: '#2563eb', border: '1px solid transparent', borderRadius: '6px', cursor: 'pointer'}}>Save Car</button>
        </div>

      </div>
    </div>
  )
}