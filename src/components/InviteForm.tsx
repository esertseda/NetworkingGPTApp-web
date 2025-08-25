import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import './InviteForm.css';

interface FormData {
  // Adım 1: Kendi bilgileri
  inviter_first_name: string;
  inviter_last_name: string;
  inviter_email: string;
  
  // Adım 2-7: Yeni kişi bilgileri
  new_person_first_name: string;
  new_person_last_name: string;
  new_person_age: number | null;
  new_person_birthplace: string;
  new_person_current_city: string;
  new_person_university: string;
  new_person_department: string;
  new_person_degree: string;
  new_person_graduation_year: number | null;
  new_person_email: string;
  new_person_phone: string;
  new_person_description: string;
  new_person_position: string;
  new_person_company: string;
  new_person_work_experience: string;
  new_person_expertise: string;
  new_person_services: string;
  new_person_investments: string;
  new_person_personal_traits: string;
  new_person_values: string;
  new_person_goals: string;
  new_person_vision: string;
  new_person_hobbies: string;
  new_person_languages: string;
  new_person_mentor: string;
  new_person_volunteer_experience: string;
  new_person_turning_points: string;
  new_person_challenges: string;
  new_person_lessons: string;
  new_person_future_goals: string;
  new_person_investment_interest: string;
  new_person_collaboration_areas: string;
  new_person_relationship_level: number;
  send_email_notification: boolean;
}

export default function InviteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Adım 1: Kendi bilgileri
    inviter_first_name: '',
    inviter_last_name: '',
    inviter_email: '',
    
    // Adım 2-7: Yeni kişi bilgileri
    new_person_first_name: '',
    new_person_last_name: '',
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
    new_person_position: '',
    new_person_company: '',
    new_person_work_experience: '',
    new_person_expertise: '',
    new_person_services: '',
    new_person_investments: '',
    new_person_personal_traits: '',
    new_person_values: '',
    new_person_goals: '',
    new_person_vision: '',
    new_person_hobbies: '',
    new_person_languages: '',
    new_person_mentor: '',
    new_person_volunteer_experience: '',
    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_lessons: '',
    new_person_future_goals: '',
    new_person_investment_interest: '',
    new_person_collaboration_areas: '',
    new_person_relationship_level: 5,
    send_email_notification: false,
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Adım 1'de kendi bilgilerini kontrol et
      if (!formData.inviter_first_name || !formData.inviter_last_name || !formData.inviter_email) {
        alert('Lütfen tüm alanları doldurunuz!');
        return;
      }
      // Kişinin ağda olup olmadığını kontrol et
      checkPersonExists();
    } else if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const checkPersonExists = async () => {
    try {
      const { data: existingPerson, error } = await supabase
        .from('contacts')
        .select('id')
        .eq('first_name', formData.inviter_first_name)
        .eq('last_name', formData.inviter_last_name)
        .eq('email', formData.inviter_email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Kişi kontrolü hatası:', error);
        alert('Beklenmeyen bir hata oluştu!');
        return;
      }

      if (existingPerson) {
        console.log('Ağ listesinde kişi bulundu:', existingPerson);
        setCurrentStep(2);
      } else {
        alert('Bu bilgilerle ağ listesinde kişi bulunamadı. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch (error) {
      console.error('Kişi doğrulama hatası:', error);
      alert('Beklenmeyen bir hata oluştu!');
    }
  };

  const sendEmailNotification = async (email: string, inviterFirstName: string, inviterLastName: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          to_email: email,
          inviter_name: `${inviterFirstName} ${inviterLastName}`,
          invite_link: window.location.origin
        }
      });

      if (error) {
        console.error('E-posta gönderme hatası:', error);
        throw error;
      }
    } catch (error) {
      console.error('E-posta gönderme hatası:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    const { new_person_first_name, new_person_last_name } = formData;
    
    if (!new_person_first_name || !new_person_last_name) {
      alert('Lütfen hem ad hem de soyad giriniz!');
      return;
    }

    try {
      // Önce davet gönderen kişiyi bul (parent contact)
      const { data: parentContact, error: parentError } = await supabase
        .from('contacts')
        .select('id')
        .eq('first_name', formData.inviter_first_name)
        .eq('last_name', formData.inviter_last_name)
        .eq('email', formData.inviter_email)
        .single();

      if (parentError) {
        console.error('Parent contact bulunamadı:', parentError);
        alert('Davet gönderen kişi bulunamadı. Lütfen tekrar deneyiniz.');
        return;
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
        investment_interest: formData.new_person_investment_interest,
        collaboration_areas: formData.new_person_collaboration_areas,
        relationship_level: formData.new_person_relationship_level,
        user_id: 'web-invite' // Web davetleri için özel user_id
      };

      // Yeni kişiyi ekle
      const { data: newContact, error: insertError } = await supabase
        .from('contacts')
        .insert([newContactData])
        .select('*')
        .single();

      if (insertError) {
        console.error('Supabase error:', insertError);
        alert('Kişi eklenirken bir hata oluştu: ' + insertError.message);
        return;
      }

      // Parent'ın mevcut degree'ini bul
      const { data: parentRelationship } = await supabase
        .from('relationships')
        .select('degree')
        .eq('child_contact_id', parentContact.id)
        .single();

      // Yeni kişinin degree'ini hesapla
      const newDegree = parentRelationship ? parentRelationship.degree + 1 : 1

      // Parent-child ilişkisini kur (relationships tablosu)
      const relationshipData = {
        parent_contact_id: parentContact.id,
        child_contact_id: newContact.id,
        degree: newDegree,
        relationship_type: 'invite'
      };

      const { error: relationshipError } = await supabase
        .from('relationships')
        .insert([relationshipData]);

      if (relationshipError) {
        console.error('Relationship oluşturma hatası:', relationshipError);
        // İlişki kurulamadı ama kişi eklendi, sadece uyarı ver
        console.warn('Kişi eklendi ama ilişki kurulamadı');
      } else {
        console.log('Parent-child ilişkisi başarıyla kuruldu');
      }

      console.log('Yeni kişi eklendi:', newContact);
      
      // E-posta gönderme işlemi
      if (formData.send_email_notification && formData.new_person_email) {
        try {
          await sendEmailNotification(formData.new_person_email, formData.inviter_first_name, formData.inviter_last_name);
          console.log('Bilgilendirme e-postası gönderildi');
        } catch (error) {
          console.error('E-posta gönderme hatası:', error);
        }
      }
      
      alert('Kişi başarıyla eklendi! Mobil uygulamada ağ listesinde görünecektir.');
      
      // Formu sıfırla
      setFormData({
        // Adım 1: Kendi bilgileri
        inviter_first_name: '',
        inviter_last_name: '',
        inviter_email: '',
        
        // Adım 2-7: Yeni kişi bilgileri
        new_person_first_name: '',
        new_person_last_name: '',
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
        new_person_position: '',
        new_person_company: '',
        new_person_work_experience: '',
        new_person_expertise: '',
        new_person_services: '',
        new_person_investments: '',
        new_person_personal_traits: '',
        new_person_values: '',
        new_person_goals: '',
        new_person_vision: '',
        new_person_hobbies: '',
        new_person_languages: '',
        new_person_mentor: '',
        new_person_volunteer_experience: '',
        new_person_turning_points: '',
        new_person_challenges: '',
        new_person_lessons: '',
        new_person_future_goals: '',
        new_person_investment_interest: '',
        new_person_collaboration_areas: '',
        new_person_relationship_level: 5,
        send_email_notification: false,
      });
      
      setCurrentStep(1);
    } catch (error) {
      console.error('Save error:', error);
      alert('Beklenmeyen bir hata oluştu!');
    }
  };

  const progressStep = currentStep;
  const progressPercentage = (progressStep / 7) * 100;

  return (
    <div className="invite-form">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src="/networkinggptlogo.jpeg" alt="NetworkingGPT" className="logo-image" />
        </div>
        <div className="tagline">Ağınızı Genişletin</div>
        <div className="motto">Yeni bağlantılar, yeni fırsatlar</div>
      </div>

      {/* Step Container */}
      <div className="step-container">
        {/* Step Header */}
        <div className="step-header">
          <h2>
            {currentStep === 1 ? 'Adım 1: Kendi Bilgileriniz' : `Adım ${currentStep}: Yeni Kişi Bilgileri`}
          </h2>
          <p>
            {currentStep === 1 
              ? 'Ağ listesinde kayıtlı bilgilerinizi giriniz' 
              : 'Ağınıza eklemek istediğiniz kişinin bilgilerini giriniz'
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-markers">
            <div className={`progress-marker ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="marker-icon">👤</span>
              <span className="marker-label">Kendi Bilgileri</span>
            </div>
            <div className={`progress-marker ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="marker-icon">📝</span>
              <span className="marker-label">Temel Bilgiler</span>
            </div>
            <div className={`progress-marker ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="marker-icon">💼</span>
              <span className="marker-label">İş Bilgileri</span>
            </div>
            <div className={`progress-marker ${currentStep >= 4 ? 'active' : ''}`}>
              <span className="marker-icon">⭐</span>
              <span className="marker-label">Kişisel Özellikler</span>
            </div>
            <div className={`progress-marker ${currentStep >= 5 ? 'active' : ''}`}>
              <span className="marker-icon">🤝</span>
              <span className="marker-label">Sosyal</span>
            </div>
            <div className={`progress-marker ${currentStep >= 6 ? 'active' : ''}`}>
              <span className="marker-icon">🏆</span>
              <span className="marker-label">Deneyim</span>
            </div>
            <div className={`progress-marker ${currentStep >= 7 ? 'active' : ''}`}>
              <span className="marker-icon">🚀</span>
              <span className="marker-label">Gelecek</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-content">
          {currentStep === 1 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">Kendi Bilgileriniz</h3>
                <div className="form-group">
                  <label htmlFor="inviter_first_name">Ad *</label>
                  <input
                    type="text"
                    id="inviter_first_name"
                    value={formData.inviter_first_name}
                    onChange={(e) => updateFormData('inviter_first_name', e.target.value)}
                    placeholder="Adınız"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inviter_last_name">Soyad *</label>
                  <input
                    type="text"
                    id="inviter_last_name"
                    value={formData.inviter_last_name}
                    onChange={(e) => updateFormData('inviter_last_name', e.target.value)}
                    placeholder="Soyadınız"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inviter_email">E-posta *</label>
                  <input
                    type="email"
                    id="inviter_email"
                    value={formData.inviter_email}
                    onChange={(e) => updateFormData('inviter_email', e.target.value)}
                    placeholder="E-posta adresiniz"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">Temel Bilgiler</h3>
                <div className="form-group">
                  <label htmlFor="new_person_first_name">Ad *</label>
                  <input
                    type="text"
                    id="new_person_first_name"
                    value={formData.new_person_first_name}
                    onChange={(e) => updateFormData('new_person_first_name', e.target.value)}
                    placeholder="Ad"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_last_name">Soyad *</label>
                  <input
                    type="text"
                    id="new_person_last_name"
                    value={formData.new_person_last_name}
                    onChange={(e) => updateFormData('new_person_last_name', e.target.value)}
                    placeholder="Soyad"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_relationship_level">Yakınlık Seviyesi (1-10)</label>
                  <input
                    type="range"
                    id="new_person_relationship_level"
                    min="1"
                    max="10"
                    value={formData.new_person_relationship_level}
                    onChange={(e) => updateFormData('new_person_relationship_level', parseInt(e.target.value))}
                  />
                  <span className="range-value">{formData.new_person_relationship_level}/10</span>
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_age">Yaş</label>
                  <input
                    type="number"
                    id="new_person_age"
                    value={formData.new_person_age || ''}
                    onChange={(e) => updateFormData('new_person_age', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="25"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_birthplace">Nereli</label>
                  <input
                    type="text"
                    id="new_person_birthplace"
                    value={formData.new_person_birthplace}
                    onChange={(e) => updateFormData('new_person_birthplace', e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_current_city">Şu An Yaşadığı Şehir</label>
                  <input
                    type="text"
                    id="new_person_current_city"
                    value={formData.new_person_current_city}
                    onChange={(e) => updateFormData('new_person_current_city', e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_email">E-posta</label>
                  <input
                    type="email"
                    id="new_person_email"
                    value={formData.new_person_email}
                    onChange={(e) => updateFormData('new_person_email', e.target.value)}
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_phone">Telefon</label>
                  <input
                    type="tel"
                    id="new_person_phone"
                    value={formData.new_person_phone}
                    onChange={(e) => updateFormData('new_person_phone', e.target.value)}
                    placeholder="+90 555 123 45 67"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_description">Kişi Hakkında Genel Açıklama</label>
                  <textarea
                    id="new_person_description"
                    value={formData.new_person_description}
                    onChange={(e) => updateFormData('new_person_description', e.target.value)}
                    placeholder="Kişi hakkında genel bilgiler..."
                    rows={3}
                  />
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.send_email_notification}
                      onChange={(e) => updateFormData('send_email_notification', e.target.checked)}
                    />
                    Bilgilendirme E-postası Gönder
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">İş Bilgileri</h3>
                <div className="form-group">
                  <label htmlFor="new_person_position">Şuanki Pozisyonu/Şirketi *</label>
                  <input
                    type="text"
                    id="new_person_position"
                    value={formData.new_person_position}
                    onChange={(e) => updateFormData('new_person_position', e.target.value)}
                    placeholder="Senior Frontend Developer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_company">Şirket</label>
                  <input
                    type="text"
                    id="new_person_company"
                    value={formData.new_person_company}
                    onChange={(e) => updateFormData('new_person_company', e.target.value)}
                    placeholder="Google"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_work_experience">Daha Önceki İş Tecrübeleri</label>
                  <textarea
                    id="new_person_work_experience"
                    value={formData.new_person_work_experience}
                    onChange={(e) => updateFormData('new_person_work_experience', e.target.value)}
                    placeholder="Önceki iş deneyimleri..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_expertise">Uzmanlık Alanları</label>
                  <input
                    type="text"
                    id="new_person_expertise"
                    value={formData.new_person_expertise}
                    onChange={(e) => updateFormData('new_person_expertise', e.target.value)}
                    placeholder="Yazılım, Finans, Pazarlama..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_services">Verebileceği Hizmetler</label>
                  <input
                    type="text"
                    id="new_person_services"
                    value={formData.new_person_services}
                    onChange={(e) => updateFormData('new_person_services', e.target.value)}
                    placeholder="Tasarım, Yazılım, Pazarlama..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_investments">Yatırım Yaptığı veya Destek Verdiği Projeler</label>
                  <textarea
                    id="new_person_investments"
                    value={formData.new_person_investments}
                    onChange={(e) => updateFormData('new_person_investments', e.target.value)}
                    placeholder="Yatırım yaptığı projeler..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">Kişisel Özellikler</h3>
                <div className="form-group">
                  <label htmlFor="new_person_personal_traits">Kişisel Özellikler</label>
                  <textarea
                    id="new_person_personal_traits"
                    value={formData.new_person_personal_traits}
                    onChange={(e) => updateFormData('new_person_personal_traits', e.target.value)}
                    placeholder="Dürüstlük, güvenilirlik, disiplin, çalışkanlık, sabırlı olmak, Liderlik, takım çalışması, iletişim becerisi..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_values">Değer Verdiği Prensipler</label>
                  <textarea
                    id="new_person_values"
                    value={formData.new_person_values}
                    onChange={(e) => updateFormData('new_person_values', e.target.value)}
                    placeholder="Etik, sürdürülebilirlik, topluma fayda..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_goals">Hedefleri</label>
                  <textarea
                    id="new_person_goals"
                    value={formData.new_person_goals}
                    onChange={(e) => updateFormData('new_person_goals', e.target.value)}
                    placeholder="Kısa ve uzun vadeli hedefleri..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_vision">Vizyonu</label>
                  <textarea
                    id="new_person_vision"
                    value={formData.new_person_vision}
                    onChange={(e) => updateFormData('new_person_vision', e.target.value)}
                    placeholder="Kişisel vizyonu ve misyonu..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">Sosyal</h3>
                <div className="form-group">
                  <label htmlFor="new_person_hobbies">Hobiler, İlgi Alanları</label>
                  <textarea
                    id="new_person_hobbies"
                    value={formData.new_person_hobbies}
                    onChange={(e) => updateFormData('new_person_hobbies', e.target.value)}
                    placeholder="Hobiler ve ilgi alanları..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_languages">Konuştuğu Diller</label>
                  <input
                    type="text"
                    id="new_person_languages"
                    value={formData.new_person_languages}
                    onChange={(e) => updateFormData('new_person_languages', e.target.value)}
                    placeholder="Türkçe, İngilizce, Almanca..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_mentor">Mentor Olup Olmadığı</label>
                  <input
                    type="text"
                    id="new_person_mentor"
                    value={formData.new_person_mentor}
                    onChange={(e) => updateFormData('new_person_mentor', e.target.value)}
                    placeholder="Mentorluk deneyimleri..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_volunteer_experience">Gönüllü İşler/Topluluk Deneyimleri</label>
                  <textarea
                    id="new_person_volunteer_experience"
                    value={formData.new_person_volunteer_experience}
                    onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)}
                    placeholder="Gönüllü çalışmaları ve topluluk deneyimleri..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">Deneyim</h3>
                <div className="form-group">
                  <label htmlFor="new_person_turning_points">Hayatındaki Dönüm Noktaları</label>
                  <textarea
                    id="new_person_turning_points"
                    value={formData.new_person_turning_points}
                    onChange={(e) => updateFormData('new_person_turning_points', e.target.value)}
                    placeholder="Şirket kurma, iş değiştirme, ülke değiştirme gibi dönüm noktaları..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_challenges">Karşılaştığı Büyük Zorluklar</label>
                  <textarea
                    id="new_person_challenges"
                    value={formData.new_person_challenges}
                    onChange={(e) => updateFormData('new_person_challenges', e.target.value)}
                    placeholder="Karşılaştığı zorluklar ve nasıl aştığı..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_lessons">Öğrendiği En Büyük Dersler</label>
                  <textarea
                    id="new_person_lessons"
                    value={formData.new_person_lessons}
                    onChange={(e) => updateFormData('new_person_lessons', e.target.value)}
                    placeholder="Hayattan öğrendiği en önemli dersler..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="form-card">
              <div className="form-section">
                <h3 className="section-header">Gelecek</h3>
                <div className="form-group">
                  <label htmlFor="new_person_future_goals">5-10 Yıllık Hedefleri</label>
                  <textarea
                    id="new_person_future_goals"
                    value={formData.new_person_future_goals}
                    onChange={(e) => updateFormData('new_person_future_goals', e.target.value)}
                    placeholder="Gelecek planları ve hedefleri..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_investment_interest">Yeni İş Fikirlerine Yaklaşımı</label>
                  <textarea
                    id="new_person_investment_interest"
                    value={formData.new_person_investment_interest}
                    onChange={(e) => updateFormData('new_person_investment_interest', e.target.value)}
                    placeholder="Yatırım ve ortaklık istekleri..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_person_collaboration_areas">İş Birliği Yapmak İstediği Alanlar</label>
                  <textarea
                    id="new_person_collaboration_areas"
                    value={formData.new_person_collaboration_areas}
                    onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)}
                    placeholder="Hangi alanlarda iş birliği yapmak istediği..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={handlePrevious}
              className="btn btn-secondary"
            >
              Geri
            </button>
          )}
          {currentStep < 7 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="btn btn-primary"
            >
              İleri
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSave}
              className="btn btn-success"
            >
              Kaydet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

