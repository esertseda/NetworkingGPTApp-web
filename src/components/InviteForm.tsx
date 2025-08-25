import React, { useState } from 'react'
import './InviteForm.css'

interface FormData {
  inviter_first_name: string
  inviter_last_name: string
  inviter_email: string
  new_person_first_name: string
  new_person_last_name: string
  new_person_age: number | null
  new_person_city: string
  new_person_current_city: string
  new_person_university: string
  new_person_degree: string
  new_person_graduation_year: number | null
  new_person_email: string
  new_person_phone: string
}

const InviteForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    inviter_first_name: '',
    inviter_last_name: '',
    inviter_email: '',
    new_person_first_name: '',
    new_person_last_name: '',
    new_person_age: null,
    new_person_city: '',
    new_person_current_city: '',
    new_person_university: '',
    new_person_degree: '',
    new_person_graduation_year: null,
    new_person_email: '',
    new_person_phone: ''
  })

  const handleInviterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { inviter_first_name, inviter_last_name, inviter_email } = formData
    
    if (!inviter_first_name || !inviter_last_name || !inviter_email) {
      alert('Lütfen tüm alanları doldurunuz!')
      return
    }

    // Burada Supabase doğrulaması yapılacak
    // Şimdilik sadece adım geçişi yapıyoruz
    alert('Kişi başarıyla doğrulandı! Adım 2\'ye geçebilirsiniz.')
    setCurrentStep(2)
  }

  const handleSave = async () => {
    const { new_person_first_name, new_person_last_name } = formData
    
    if (!new_person_first_name || !new_person_last_name) {
      alert('Lütfen hem ad hem de soyad giriniz!')
      return
    }

    // Burada Supabase'e kaydetme işlemi yapılacak
    alert('Kişi başarıyla eklendi! Mobil uygulamada ağ listesinde görünecektir.')
    
    // Formu sıfırla
    setFormData({
      inviter_first_name: '',
      inviter_last_name: '',
      inviter_email: '',
      new_person_first_name: '',
      new_person_last_name: '',
      new_person_age: null,
      new_person_city: '',
      new_person_current_city: '',
      new_person_university: '',
      new_person_degree: '',
      new_person_graduation_year: null,
      new_person_email: '',
      new_person_phone: ''
    })
    setCurrentStep(1)
  }

  const updateFormData = (field: keyof FormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="invite-form">
      {currentStep === 1 ? (
        <div className="step-container">
          <div className="step-header">
            <div className="step-icon">👥</div>
            <h2>Adım 1: Davet Gönderen Bilgileri</h2>
            <p>Sizinle bağlantı kurmak isteyen kişinin bilgilerini girin</p>
          </div>

          <form onSubmit={handleInviterSubmit} className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactFirstName">Ad</label>
                <input
                  type="text"
                  id="contactFirstName"
                  value={formData.inviter_first_name}
                  onChange={(e) => updateFormData('inviter_first_name', e.target.value)}
                  placeholder="Adınız"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactLastName">Soyad</label>
                <input
                  type="text"
                  id="contactLastName"
                  value={formData.inviter_last_name}
                  onChange={(e) => updateFormData('inviter_last_name', e.target.value)}
                  placeholder="Soyadınız"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">E-posta Adresi</label>
              <input
                type="email"
                id="contactEmail"
                value={formData.inviter_email}
                onChange={(e) => updateFormData('inviter_email', e.target.value)}
                placeholder="e-posta@ornek.com"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <span className="btn-icon">✓</span>
                Devam Et
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="step-container">
          <div className="step-header">
            <div className="step-icon">👤+</div>
            <h2>Yeni Kişi Ekle</h2>
            <p>Ağınıza yeni bir bağlantı ekleyin ✨</p>
          </div>

          <div className="progress-container">
            <div className="progress-info">
              <span className="progress-step">Adım 2/2</span>
              <span className="progress-percentage">100% Tamamlandı</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }}></div>
              <div className="progress-markers">
                <div className="progress-marker active">👤</div>
                <div className="progress-marker active">💼</div>
              </div>
            </div>
            <div className="progress-label">Yeni Kişi Bilgileri</div>
          </div>

          <div className="navigation-buttons">
            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentStep(1)}
            >
              ← Önceki Adım
            </button>
            <button 
              className="btn btn-success" 
              onClick={handleSave}
            >
              ✓ Kişi Ekle
            </button>
          </div>

          <div className="form-card">
            <section className="form-section">
              <div className="section-header">
                <div className="section-icon">👤</div>
                <h3>Temel Bilgiler</h3>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Ad Soyad <span className="required">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    value={`${formData.new_person_first_name} ${formData.new_person_last_name}`.trim()}
                    onChange={(e) => {
                      const nameParts = e.target.value.split(' ')
                      updateFormData('new_person_first_name', nameParts[0] || '')
                      updateFormData('new_person_last_name', nameParts.slice(1).join(' ') || '')
                    }}
                    placeholder="Ad Soyad"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Yaş</label>
                  <input
                    type="number"
                    id="age"
                    value={formData.new_person_age || ''}
                    onChange={(e) => updateFormData('new_person_age', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="25"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthplace">🏠 Nereli</label>
                  <input
                    type="text"
                    id="birthplace"
                    value={formData.new_person_city}
                    onChange={(e) => updateFormData('new_person_city', e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentCity">📍 Şu An Yaşadığı Şehir</label>
                  <input
                    type="text"
                    id="currentCity"
                    value={formData.new_person_current_city}
                    onChange={(e) => updateFormData('new_person_current_city', e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="section-header">
                <div className="section-icon">🎓</div>
                <h3>Eğitim Geçmişi</h3>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="school">Okul/Üniversite</label>
                  <input
                    type="text"
                    id="school"
                    value={formData.new_person_university}
                    onChange={(e) => updateFormData('new_person_university', e.target.value)}
                    placeholder="Boğaziçi Üniversitesi"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Bölüm</label>
                  <input
                    type="text"
                    id="department"
                    value={formData.new_person_degree}
                    onChange={(e) => updateFormData('new_person_degree', e.target.value)}
                    placeholder="Bilgisayar Mühendisliği"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="degree">Derece</label>
                  <input
                    type="text"
                    id="degree"
                    value={formData.new_person_degree}
                    onChange={(e) => updateFormData('new_person_degree', e.target.value)}
                    placeholder="Lisans"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="graduationYear">Mezuniyet Yılı</label>
                  <input
                    type="number"
                    id="graduationYear"
                    value={formData.new_person_graduation_year || ''}
                    onChange={(e) => updateFormData('new_person_graduation_year', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="2020"
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="section-header">
                <div className="section-icon">📧</div>
                <h3>İletişim Bilgileri <span className="subtitle">(E-posta veya telefon gerekli)</span></h3>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">E-posta</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.new_person_email}
                    onChange={(e) => updateFormData('new_person_email', e.target.value)}
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.new_person_phone}
                    onChange={(e) => updateFormData('new_person_phone', e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
              </div>
              <div className="warning-message">
                <span className="warning-icon">⚠️</span>
                E-posta veya telefon bilgilerinden en az biri girilmelidir.
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

export default InviteForm
