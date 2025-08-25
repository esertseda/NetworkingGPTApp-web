import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import './InviteForm.css'

interface FormData {
  // Adım 1: Davet gönderen kişi
  inviter_first_name: string
  inviter_last_name: string
  inviter_email: string
  
  // Adım 2-7: Yeni kişi bilgileri
  // 1. Temel Bilgiler
  new_person_first_name: string
  new_person_last_name: string
  new_person_relationship_level: number
  new_person_age: number | null
  new_person_birthplace: string
  new_person_current_city: string
  new_person_university: string
  new_person_department: string
  new_person_degree: string
  new_person_graduation_year: number | null
  new_person_email: string
  new_person_phone: string
  new_person_description: string
  
  // 2. İş Bilgileri
  new_person_position: string
  new_person_company: string
  new_person_work_experience: string
  new_person_expertise: string[]
  new_person_services: string[]
  new_person_investments: string
  
  // 3. Kişisel Özellikler
  new_person_personal_traits: string[]
  new_person_values: string[]
  new_person_goals: string
  new_person_vision: string
  
  // 4. Sosyal Bilgiler
  new_person_hobbies: string
  new_person_languages: string
  new_person_mentor: boolean
  new_person_volunteer_experience: string
  
  // 5. Deneyim
  new_person_turning_points: string
  new_person_challenges: string
  new_person_lessons: string
  
  // 6. Gelecek
  new_person_future_goals: string
  new_person_business_approach: string
  new_person_investment_interest: boolean
  new_person_collaboration_areas: string
}

const InviteForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    // Adım 1: Davet gönderen kişi
    inviter_first_name: '',
    inviter_last_name: '',
    inviter_email: '',
    
    // 1. Temel Bilgiler
    new_person_first_name: '',
    new_person_last_name: '',
    new_person_relationship_level: 5,
    new_person_age: null,
    new_person_birthplace: '',
    new_person_current_city: '',
    new_person_university: '',
    new_person_department: '',
    new_person_degree: '',
    new_person_graduation_year: null,
    new_person_email: '',
    new_person_phone: '',
    new_person_description: '',
    
    // 2. İş Bilgileri
    new_person_position: '',
    new_person_company: '',
    new_person_work_experience: '',
    new_person_expertise: [],
    new_person_services: [],
    new_person_investments: '',
    
    // 3. Kişisel Özellikler
    new_person_personal_traits: [],
    new_person_values: [],
    new_person_goals: '',
    new_person_vision: '',
    
    // 4. Sosyal Bilgiler
    new_person_hobbies: '',
    new_person_languages: '',
    new_person_mentor: false,
    new_person_volunteer_experience: '',
    
    // 5. Deneyim
    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_lessons: '',
    
    // 6. Gelecek
    new_person_future_goals: '',
    new_person_business_approach: '',
    new_person_investment_interest: false,
    new_person_collaboration_areas: ''
  })

  const handleInviterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { inviter_first_name, inviter_last_name } = formData
    
    if (!inviter_first_name || !inviter_last_name) {
      alert('Lütfen ad ve soyad alanlarını doldurunuz!')
      return
    }

    try {
      // Supabase'de kişiyi ara (sadece ad ve soyad ile)
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('first_name', inviter_first_name)
        .eq('last_name', inviter_last_name)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Kişi bulunamadı
          alert('Bu ad ve soyad ile ağ listesinde kişi bulunamadı. Lütfen bilgileri kontrol ediniz.')
          return
        } else {
          console.error('Supabase error:', error)
          alert('Kişi aranırken bir hata oluştu: ' + error.message)
          return
        }
      }

      // Kişi bulundu
      console.log('Ağ listesinde kişi bulundu:', data)
      alert('Kişi başarıyla doğrulandı! Adım 1\'e geçebilirsiniz.')
      setCurrentStep(1)
      
    } catch (error) {
      console.error('Kişi doğrulama hatası:', error)
      alert('Beklenmeyen bir hata oluştu!')
    }
  }

  const handleSave = async () => {
    const { new_person_first_name, new_person_last_name } = formData
    
    if (!new_person_first_name || !new_person_last_name) {
      alert('Lütfen hem ad hem de soyad giriniz!')
      return
    }

    try {
      // Önce davet gönderen kişiyi bul (parent contact)
      const { data: parentContact, error: parentError } = await supabase
        .from('contacts')
        .select('id')
        .eq('first_name', formData.inviter_first_name)
        .eq('last_name', formData.inviter_last_name)
        .single()

      if (parentError) {
        console.error('Parent contact bulunamadı:', parentError)
        alert('Davet gönderen kişi bulunamadı. Lütfen tekrar deneyiniz.')
        return
      }

      // Yeni kişi verilerini hazırla
      const newContactData = {
        first_name: new_person_first_name,
        last_name: new_person_last_name,
        age: formData.new_person_age,
        city: formData.new_person_birthplace,
        current_city: formData.new_person_current_city,
        university: formData.new_person_university,
        department: formData.new_person_department,
        degree: formData.new_person_degree,
        graduation_year: formData.new_person_graduation_year,
        email: formData.new_person_email,
        phone: formData.new_person_phone,
        description: formData.new_person_description,
        position: formData.new_person_position,
        company: formData.new_person_company,
        work_experience: formData.new_person_work_experience,
        expertise: formData.new_person_expertise,
        services: formData.new_person_services,
        investments: formData.new_person_investments,
        personal_traits: formData.new_person_personal_traits,
        values: formData.new_person_values,
        goals: formData.new_person_goals,
        vision: formData.new_person_vision,
        hobbies: formData.new_person_hobbies,
        languages: formData.new_person_languages,
        mentor: formData.new_person_mentor,
        volunteer_experience: formData.new_person_volunteer_experience,
        turning_points: formData.new_person_turning_points,
        challenges: formData.new_person_challenges,
        lessons: formData.new_person_lessons,
        future_goals: formData.new_person_future_goals,
        business_approach: formData.new_person_business_approach,
        investment_interest: formData.new_person_investment_interest,
        collaboration_areas: formData.new_person_collaboration_areas,
        relationship_level: formData.new_person_relationship_level,
        user_id: 'web-invite' // Web davetleri için özel user_id
      }

      // Yeni kişiyi ekle
      const { data: newContact, error: insertError } = await supabase
        .from('contacts')
        .insert([newContactData])
        .select()
        .single()

      if (insertError) {
        console.error('Supabase error:', insertError)
        alert('Kişi eklenirken bir hata oluştu: ' + insertError.message)
        return
      }

      // Parent-child ilişkisini kur (relationships tablosu)
      const relationshipData = {
        parent_contact_id: parentContact.id,
        child_contact_id: newContact.id,
        degree: 1, // Direct connection
        relationship_type: 'invite'
      }

      const { error: relationshipError } = await supabase
        .from('relationships')
        .insert([relationshipData])

      if (relationshipError) {
        console.error('Relationship oluşturma hatası:', relationshipError)
        // İlişki kurulamadı ama kişi eklendi, sadece uyarı ver
        console.warn('Kişi eklendi ama ilişki kurulamadı')
      } else {
        console.log('Parent-child ilişkisi başarıyla kuruldu')
      }

      console.log('Yeni kişi eklendi:', newContact)
      alert('Kişi başarıyla eklendi! Mobil uygulamada ağ listesinde görünecektir.')
      
      // Formu sıfırla
      setFormData({
        // Adım 1: Davet gönderen kişi
        inviter_first_name: '',
        inviter_last_name: '',
        inviter_email: '',
        
        // 1. Temel Bilgiler
        new_person_first_name: '',
        new_person_last_name: '',
        new_person_relationship_level: 5,
        new_person_age: null,
        new_person_birthplace: '',
        new_person_current_city: '',
        new_person_university: '',
        new_person_department: '',
        new_person_degree: '',
        new_person_graduation_year: null,
        new_person_email: '',
        new_person_phone: '',
        new_person_description: '',
        
        // 2. İş Bilgileri
        new_person_position: '',
        new_person_company: '',
        new_person_work_experience: '',
        new_person_expertise: [],
        new_person_services: [],
        new_person_investments: '',
        
        // 3. Kişisel Özellikler
        new_person_personal_traits: [],
        new_person_values: [],
        new_person_goals: '',
        new_person_vision: '',
        
        // 4. Sosyal Bilgiler
        new_person_hobbies: '',
        new_person_languages: '',
        new_person_mentor: false,
        new_person_volunteer_experience: '',
        
        // 5. Deneyim
        new_person_turning_points: '',
        new_person_challenges: '',
        new_person_lessons: '',
        
        // 6. Gelecek
        new_person_future_goals: '',
        new_person_business_approach: '',
        new_person_investment_interest: false,
        new_person_collaboration_areas: ''
      })
      setCurrentStep(0)
      
    } catch (error) {
      console.error('Form gönderimi hatası:', error)
      alert('Beklenmeyen bir hata oluştu!')
    }
  }

  const updateFormData = (field: keyof FormData, value: string | number | null | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="invite-form">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src="/networkinggptlogo.jpeg" alt="NetworkingGPT Logo" className="logo-image" />
        </div>
        <div className="tagline">Davete özel kişi ekleme platformu</div>
        <div className="motto">
          <span className="sparkle">✨</span>
          Mitolojik güçle ağınızı genişletin
        </div>
      </div>

      {currentStep === 0 ? (
        <div className="step-container">
          <div className="step-header">
            <div className="step-icon">👥</div>
            <h2>Adım 0: Davet Gönderen Bilgileri</h2>
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
              <label htmlFor="contactEmail">E-posta Adresi (Opsiyonel)</label>
              <input
                type="email"
                id="contactEmail"
                value={formData.inviter_email}
                onChange={(e) => updateFormData('inviter_email', e.target.value)}
                placeholder="e-posta@ornek.com"
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
            <h2>Adım 1: Ağınıza Katılın</h2>
            <p>Hermes'in rehberliğinde yeni bağlantınızı oluşturun</p>
          </div>

          <div className="add-person-section">
            <div className="add-person-icon">👤+</div>
            <div className="add-person-title">Yeni Kişi Ekle</div>
            <div className="add-person-subtitle">Ağınıza yeni bir bağlantı ekleyin ✨</div>
          </div>

          <div className="progress-container">
            <div className="progress-info">
              <span className="progress-step">Adım {currentStep}/6</span>
              <span className="progress-percentage">{Math.round((currentStep / 6) * 100)}% Tamamlandı</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(currentStep / 6) * 100}%` }}></div>
              <div className="progress-markers">
                <div className={`progress-marker ${currentStep >= 1 ? 'active' : ''}`}>👤</div>
                <div className={`progress-marker ${currentStep >= 2 ? 'active' : ''}`}>💼</div>
                <div className={`progress-marker ${currentStep >= 3 ? 'active' : ''}`}>🎯</div>
                <div className={`progress-marker ${currentStep >= 4 ? 'active' : ''}`}>🌐</div>
                <div className={`progress-marker ${currentStep >= 5 ? 'active' : ''}`}>📚</div>
                <div className={`progress-marker ${currentStep >= 6 ? 'active' : ''}`}>🚀</div>
              </div>
            </div>
            <div className="progress-label">
              {currentStep === 1 && '👤 Temel Bilgiler'}
              {currentStep === 2 && '💼 İş Bilgileri'}
              {currentStep === 3 && '🎯 Kişisel Özellikler'}
              {currentStep === 4 && '🌐 Sosyal Bilgiler'}
              {currentStep === 5 && '📚 Deneyim'}
              {currentStep === 6 && '🚀 Gelecek'}
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentStep(currentStep > 1 ? currentStep - 1 : 0)}
              disabled={currentStep === 1}
            >
              ← Önceki Adım
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentStep(currentStep < 6 ? currentStep + 1 : 6)}
              disabled={currentStep === 6}
            >
              Sonraki Adım →
            </button>
            {currentStep === 6 && (
              <button 
                className="btn btn-success" 
                onClick={handleSave}
              >
                ✓ Kişi Ekle
              </button>
            )}
          </div>

          {/* Adım 1: Temel Bilgiler */}
          {currentStep === 1 && (
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
                      value={formData.new_person_birthplace}
                      onChange={(e) => updateFormData('new_person_birthplace', e.target.value)}
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
                      value={formData.new_person_department}
                      onChange={(e) => updateFormData('new_person_department', e.target.value)}
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
                  <h3>İletişim Bilgileri (E-posta veya telefon gerekli)</h3>
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
                <div className="form-group">
                  <label htmlFor="description">Genel Açıklama</label>
                  <textarea
                    id="description"
                    value={formData.new_person_description}
                    onChange={(e) => updateFormData('new_person_description', e.target.value)}
                    placeholder="Kişi hakkında genel notlar..."
                    rows={3}
                  />
                </div>
              </section>
            </div>
          )}

          {/* Adım 2: İş Bilgileri */}
          {currentStep === 2 && (
            <div className="form-card">
              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">💼</div>
                  <h3>İş ve Profesyonel Bilgiler</h3>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="position">Pozisyon <span className="required">*</span></label>
                    <input
                      type="text"
                      id="position"
                      value={formData.new_person_position}
                      onChange={(e) => updateFormData('new_person_position', e.target.value)}
                      placeholder="Senior Frontend Developer"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Şirket</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.new_person_company}
                      onChange={(e) => updateFormData('new_person_company', e.target.value)}
                      placeholder="Google"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="sectors">🏢 Sektörler</label>
                    <select
                      id="sectors"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateFormData('new_person_expertise', [...formData.new_person_expertise, e.target.value])
                          e.target.value = ''
                        }
                      }}
                    >
                      <option value="">Sektör seçin...</option>
                      <option value="Teknoloji">Teknoloji</option>
                      <option value="Finans">Finans</option>
                      <option value="Sağlık">Sağlık</option>
                      <option value="Eğitim">Eğitim</option>
                      <option value="Pazarlama">Pazarlama</option>
                      <option value="Üretim">Üretim</option>
                      <option value="Hizmet">Hizmet</option>
                      <option value="E-ticaret">E-ticaret</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="expertise">🎯 Uzmanlık Alanları</label>
                    <select
                      id="expertise"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateFormData('new_person_expertise', [...formData.new_person_expertise, e.target.value])
                          e.target.value = ''
                        }
                      }}
                    >
                      <option value="">Uzmanlık alanı seçin...</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Mobile">Mobile</option>
                      <option value="DevOps">DevOps</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI/ML">AI/ML</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="services">🛠️ Verebileceği Hizmetler</label>
                    <select
                      id="services"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateFormData('new_person_services', [...formData.new_person_services, e.target.value])
                          e.target.value = ''
                        }
                      }}
                    >
                      <option value="">Hizmet seçin...</option>
                      <option value="Web Geliştirme">Web Geliştirme</option>
                      <option value="Mobil Uygulama">Mobil Uygulama</option>
                      <option value="UI/UX Tasarım">UI/UX Tasarım</option>
                      <option value="Danışmanlık">Danışmanlık</option>
                      <option value="Eğitim">Eğitim</option>
                      <option value="Mentorluk">Mentorluk</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="workExperience">📝 İş Deneyimi (Kısa Notlar)</label>
                  <textarea
                    id="workExperience"
                    value={formData.new_person_work_experience}
                    onChange={(e) => updateFormData('new_person_work_experience', e.target.value)}
                    placeholder="Önceki iş deneyimleri, projeler, başarılar..."
                    rows={3}
                  />
                </div>
              </section>
            </div>
          )}

          {/* Adım 3: Kişisel Özellikler */}
          {currentStep === 3 && (
            <div className="form-card">
              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">🎯</div>
                  <h3>Kişisel Özellikler</h3>
                </div>
                
                <div className="form-group">
                  <label>Kategori</label>
                  <div className="checkbox-group">
                    <div className="checkbox-item">
                      <input type="radio" name="category" id="category-work" />
                      <label htmlFor="category-work">💼 İş</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="radio" name="category" id="category-family" />
                      <label htmlFor="category-family">🏠 Aile</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="radio" name="category" id="category-friend" />
                      <label htmlFor="category-friend">❤️ Arkadaş</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="radio" name="category" id="category-other" />
                      <label htmlFor="category-other">⋯ Diğer</label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="relationshipLevel">❤️ Yakınlık Seviyesi</label>
                  <input
                    type="range"
                    id="relationshipLevel"
                    min="1"
                    max="10"
                    value={formData.new_person_relationship_level}
                    onChange={(e) => updateFormData('new_person_relationship_level', parseInt(e.target.value))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Uzak (1)</span>
                    <span style={{ fontSize: '0.9rem', color: '#8B5CF6', fontWeight: '600' }}>{formData.new_person_relationship_level}/10</span>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Yakın (10)</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Kişisel Özellikler</label>
                  <div className="checkbox-group">
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-honesty" />
                      <label htmlFor="trait-honesty">🛡️ Dürüstlük</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-discipline" />
                      <label htmlFor="trait-discipline">❤️ Disiplin</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-patience" />
                      <label htmlFor="trait-patience">⏳ Sabırlılık</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-teamwork" />
                      <label htmlFor="trait-teamwork">🤝 Takım Çalışması</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-creativity" />
                      <label htmlFor="trait-creativity">💡 Yaratıcılık</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-reliability" />
                      <label htmlFor="trait-reliability">✅ Güvenilirlik</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-hardworking" />
                      <label htmlFor="trait-hardworking">💪 Çalışkanlık</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-leadership" />
                      <label htmlFor="trait-leadership">👑 Liderlik</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-communication" />
                      <label htmlFor="trait-communication">💬 İletişim Becerisi</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="trait-adaptability" />
                      <label htmlFor="trait-adaptability">🌍 Uyum Yeteneği</label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">💎</div>
                  <h3>Değer Verdiği Prensipler</h3>
                </div>
                <div className="form-group">
                  <label>Değerler</label>
                  <div className="checkbox-group">
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-ethics" />
                      <label htmlFor="value-ethics">⚖️ Etik</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-sustainability" />
                      <label htmlFor="value-sustainability">🌱 Sürdürülebilirlik</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-community" />
                      <label htmlFor="value-community">❤️ Topluma Fayda</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-innovation" />
                      <label htmlFor="value-innovation">💡 İnovasyon</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-quality" />
                      <label htmlFor="value-quality">⭐ Kalite</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-customer" />
                      <label htmlFor="value-customer">🎯 Müşteri Odaklılık</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-learning" />
                      <label htmlFor="value-learning">📚 Sürekli Öğrenme</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-transparency" />
                      <label htmlFor="value-transparency">👁️ Şeffaflık</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-justice" />
                      <label htmlFor="value-justice">⚖️ Adalet</label>
                    </div>
                    <div className="checkbox-item">
                      <input type="checkbox" id="value-empathy" />
                      <label htmlFor="value-empathy">❤️ Empati</label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">🎯</div>
                  <h3>Hedefleri</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="goals">Kısa ve uzun vadeli hedefleri...</label>
                  <textarea
                    id="goals"
                    value={formData.new_person_goals}
                    onChange={(e) => updateFormData('new_person_goals', e.target.value)}
                    placeholder="Kısa ve uzun vadeli hedefleri..."
                    rows={3}
                  />
                </div>
              </section>

              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">👁️</div>
                  <h3>Vizyonu</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="vision">Kişisel vizyonu ve misyonu...</label>
                  <textarea
                    id="vision"
                    value={formData.new_person_vision}
                    onChange={(e) => updateFormData('new_person_vision', e.target.value)}
                    placeholder="Kişisel vizyonu ve misyonu..."
                    rows={3}
                  />
                </div>
              </section>
            </div>
          )}

          {/* Adım 4: Sosyal Bilgiler */}
          {currentStep === 4 && (
            <div className="form-card">
              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">🌐</div>
                  <h3>Sosyal ve Networking</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="languages">🌍 Konuştuğu Diller</label>
                  <select
                    id="languages"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        updateFormData('new_person_languages', e.target.value)
                      }
                    }}
                  >
                    <option value="">Dil seçin...</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="İngilizce">İngilizce</option>
                    <option value="Almanca">Almanca</option>
                    <option value="Fransızca">Fransızca</option>
                    <option value="İspanyolca">İspanyolca</option>
                    <option value="İtalyanca">İtalyanca</option>
                    <option value="Rusça">Rusça</option>
                    <option value="Arapça">Arapça</option>
                    <option value="Çince">Çince</option>
                    <option value="Japonca">Japonca</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="mentor"
                      checked={formData.new_person_mentor}
                      onChange={(e) => updateFormData('new_person_mentor', e.target.checked)}
                    />
                    <label htmlFor="mentor">Mentor olarak hizmet veriyor</label>
                  </div>
                </div>
              </section>

              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">👨‍🏫</div>
                  <h3>Gönüllü İşler / Topluluk Deneyimleri</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="volunteerExperience">Gönüllü çalışmaları ve topluluk deneyimleri...</label>
                  <textarea
                    id="volunteerExperience"
                    value={formData.new_person_volunteer_experience}
                    onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)}
                    placeholder="Gönüllü çalışmalar ve topluluk deneyimleri..."
                    rows={3}
                  />
                </div>
              </section>
            </div>
          )}

          {/* Adım 5: Deneyim */}
          {currentStep === 5 && (
            <div className="form-card">
              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">🏆</div>
                  <h3>Kritik Yaşam Deneyimleri</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="turningPoints">📄 Hayatındaki Dönüm Noktaları</label>
                  <textarea
                    id="turningPoints"
                    value={formData.new_person_turning_points}
                    onChange={(e) => updateFormData('new_person_turning_points', e.target.value)}
                    placeholder="Şirket kurma, iş değiştirme, ülke değiştirme gibi dönüm noktaları..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="challenges">💪 Karşılaştığı Büyük Zorluklar</label>
                  <textarea
                    id="challenges"
                    value={formData.new_person_challenges}
                    onChange={(e) => updateFormData('new_person_challenges', e.target.value)}
                    placeholder="Karşılaştığı zorluklar ve nasıl aştığı..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lessons">📚 Öğrendiği En Büyük Dersler</label>
                  <textarea
                    id="lessons"
                    value={formData.new_person_lessons}
                    onChange={(e) => updateFormData('new_person_lessons', e.target.value)}
                    placeholder="Hayattan öğrendiği en önemli dersler..."
                    rows={3}
                  />
                </div>
              </section>
            </div>
          )}

          {/* Adım 6: Gelecek */}
          {currentStep === 6 && (
            <div className="form-card">
              <section className="form-section">
                <div className="section-header">
                  <div className="section-icon">🚀</div>
                  <h3>İleriye Dönük Planlar</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="futureGoals">❤️ 5-10 Yıllık Hedefleri</label>
                  <textarea
                    id="futureGoals"
                    value={formData.new_person_future_goals}
                    onChange={(e) => updateFormData('new_person_future_goals', e.target.value)}
                    placeholder="Gelecek planları ve hedefleri..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="investmentInterest">💰 Yatırım yapma / ortaklık kurma isteği var</label>
                  <textarea
                    id="investmentInterest"
                    value={formData.new_person_business_approach}
                    onChange={(e) => updateFormData('new_person_business_approach', e.target.value)}
                    placeholder=""
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="collaborationAreas">🤝 İş Birliği Yapmak İstediği Alanlar</label>
                  <textarea
                    id="collaborationAreas"
                    value={formData.new_person_collaboration_areas}
                    onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)}
                    placeholder="Hangi alanlarda iş birliği yapmak istediği..."
                    rows={3}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      )}
      
      {/* Debug bilgisi */}
      <div className="debug-info">
        Debug: Current Step: {currentStep}, Total Steps: 6, Progress: {Math.round((currentStep / 6) * 100)}%
      </div>
    </div>
  )
}

export default InviteForm

