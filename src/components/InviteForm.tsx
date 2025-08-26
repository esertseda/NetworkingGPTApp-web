import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './InviteForm.css';

interface FormData {
  // Davet gönderen kişi bilgileri
  inviter_first_name: string;
  inviter_last_name: string;
  inviter_email: string;
  
  // Yeni kişi bilgileri - Temel
  new_person_first_name: string;
  new_person_last_name: string;
  new_person_age: string;
  new_person_birthplace: string;
  new_person_current_city: string;
  new_person_proximity_level: number;
  new_person_email: string;
  new_person_phone: string;
  new_person_university: string;
  new_person_department: string;
  new_person_degree: string;
  new_person_graduation_year: string;
  new_person_description: string;
  
  // İş bilgileri
  new_person_position: string;
  new_person_company: string;
  new_person_work_experience: string;
  new_person_expertise: string;
  new_person_services: string;
  new_person_investments: string;
  
  // Kişisel özellikler
  new_person_personal_traits: string;
  new_person_values: string;
  new_person_goals: string;
  new_person_vision: string;
  
  // Sosyal
  new_person_hobbies: string;
  new_person_languages: string;
  new_person_mentor: string;
  new_person_volunteer_experience: string;
  
  // Deneyim
  new_person_turning_points: string;
  new_person_challenges: string;
  new_person_lessons: string;
  
  // Gelecek
  new_person_future_goals: string;
  new_person_investment_interest: string;
  new_person_collaboration_areas: string;
  
  // E-posta bildirimi
  send_email_notification: boolean;
}

export default function InviteForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Davet gönderen kişi bilgileri
    inviter_first_name: '',
    inviter_last_name: '',
    inviter_email: '',
    
    // Yeni kişi bilgileri - Temel
    new_person_first_name: '',
    new_person_last_name: '',
    new_person_age: '',
    new_person_birthplace: '',
    new_person_current_city: '',
    new_person_proximity_level: 5,
    new_person_email: '',
    new_person_phone: '',
    new_person_university: '',
    new_person_department: '',
    new_person_degree: '',
    new_person_graduation_year: '',
    new_person_description: '',
    
    // İş bilgileri
    new_person_position: '',
    new_person_company: '',
    new_person_work_experience: '',
    new_person_expertise: '',
    new_person_services: '',
    new_person_investments: '',
    
    // Kişisel özellikler
    new_person_personal_traits: '',
    new_person_values: '',
    new_person_goals: '',
    new_person_vision: '',
    
    // Sosyal
    new_person_hobbies: '',
    new_person_languages: '',
    new_person_mentor: '',
    new_person_volunteer_experience: '',
    
    // Deneyim
    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_lessons: '',
    
    // Gelecek
    new_person_future_goals: '',
    new_person_investment_interest: '',
    new_person_collaboration_areas: '',
    
    // E-posta bildirimi
    send_email_notification: false
  });

  const totalSteps = 7; // 1 adım davet gönderen + 6 adım yeni kişi
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const stepTitles = [
    'Davet Gönderen Bilgileri',
    'Temel Bilgiler',
    'İş Bilgileri',
    'Kişisel Özellikler',
    'Sosyal',
    'Deneyim',
    'Gelecek'
  ];

  const stepIcons = [
    '👤',
    '📋',
    '💼',
    '⭐',
    '👥',
    '🏆',
    '🚀'
  ];

  const updateFormData = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const checkPersonExists = async () => {
    const { inviter_first_name, inviter_last_name, inviter_email } = formData;
    
    if (!inviter_first_name || !inviter_last_name || !inviter_email) {
      alert('Lütfen tüm alanları doldurunuz!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id')
        .eq('first_name', inviter_first_name)
        .eq('last_name', inviter_last_name)
        .eq('email', inviter_email)
        .single();

      if (error) {
        console.error('Kişi bulunamadı:', error);
        alert('Bu bilgilerle kayıtlı kişi bulunamadı. Lütfen bilgilerinizi kontrol ediniz.');
        return;
      }

      if (data) {
        console.log('Ağ listesinde kişi bulundu:', data);
        setCurrentStep(1); // Yeni kişi bilgilerine geç
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  const sendEmailNotification = async (newPersonEmail: string, inviterName: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          to: newPersonEmail,
          inviter_name: inviterName,
          invite_link: window.location.href
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

    setLoading(true);

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
        relationship_level: formData.new_person_proximity_level,
        user_id: 'web-invite' // Web davetleri için özel user_id
      };

      // Yeni kişiyi ekle
      const { data: newContact, error: insertError } = await supabase
        .from('contacts')
        .insert([newContactData])
        .select()
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
      const newDegree = parentRelationship ? parentRelationship.degree + 1 : 1;

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
        alert('İlişki oluşturulurken bir hata oluştu.');
        return;
      }

      // E-posta bildirimi gönder
      if (formData.send_email_notification && formData.new_person_email) {
        try {
          await sendEmailNotification(
            formData.new_person_email,
            `${formData.inviter_first_name} ${formData.inviter_last_name}`
          );
        } catch (error) {
          console.error('E-posta gönderme hatası:', error);
          // E-posta hatası olsa bile işlem devam etsin
        }
      }

      alert('Kişi başarıyla eklendi!');
      
      // Formu sıfırla
      setFormData({
        inviter_first_name: '',
        inviter_last_name: '',
        inviter_email: '',
        new_person_first_name: '',
        new_person_last_name: '',
        new_person_age: '',
        new_person_birthplace: '',
        new_person_current_city: '',
        new_person_proximity_level: 5,
        new_person_email: '',
        new_person_phone: '',
        new_person_university: '',
        new_person_department: '',
        new_person_degree: '',
        new_person_graduation_year: '',
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
        send_email_notification: false
      });
      
      setCurrentStep(0);

    } catch (error) {
      console.error('Genel hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Davet gönderen bilgileri
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>Davet Gönderen Bilgileri</h3>
              <p>Lütfen ağ listesinde kayıtlı olan bilgilerinizi giriniz.</p>
              
              <div className="form-group">
                <label>Ad *</label>
                <input
                  type="text"
                  value={formData.inviter_first_name}
                  onChange={(e) => updateFormData('inviter_first_name', e.target.value)}
                  placeholder="Adınız"
                />
              </div>
              
              <div className="form-group">
                <label>Soyad *</label>
                <input
                  type="text"
                  value={formData.inviter_last_name}
                  onChange={(e) => updateFormData('inviter_last_name', e.target.value)}
                  placeholder="Soyadınız"
                />
              </div>
              
              <div className="form-group">
                <label>E-posta *</label>
                <input
                  type="email"
                  value={formData.inviter_email}
                  onChange={(e) => updateFormData('inviter_email', e.target.value)}
                  placeholder="ornek@email.com"
                />
              </div>
              
              <button 
                className="btn-primary"
                onClick={checkPersonExists}
                disabled={loading}
              >
                {loading ? 'Kontrol Ediliyor...' : 'Devam Et'}
              </button>
            </div>
          </div>
        );

      case 1: // Temel Bilgiler
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>Temel Bilgiler</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Ad *</label>
                  <input
                    type="text"
                    value={formData.new_person_first_name}
                    onChange={(e) => updateFormData('new_person_first_name', e.target.value)}
                    placeholder="Ad"
                  />
                </div>
                <div className="form-group">
                  <label>Soyad *</label>
                  <input
                    type="text"
                    value={formData.new_person_last_name}
                    onChange={(e) => updateFormData('new_person_last_name', e.target.value)}
                    placeholder="Soyad"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Yaş</label>
                  <input
                    type="number"
                    value={formData.new_person_age}
                    onChange={(e) => updateFormData('new_person_age', e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="form-group">
                  <label>Nereli</label>
                  <input
                    type="text"
                    value={formData.new_person_birthplace}
                    onChange={(e) => updateFormData('new_person_birthplace', e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Şu An Yaşadığı Şehir</label>
                <input
                  type="text"
                  value={formData.new_person_current_city}
                  onChange={(e) => updateFormData('new_person_current_city', e.target.value)}
                  placeholder="İstanbul"
                />
              </div>

              <div className="form-group">
                <label>Yakınlık Seviyesi: {formData.new_person_proximity_level}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.new_person_proximity_level}
                  onChange={(e) => updateFormData('new_person_proximity_level', parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>Uzak (1)</span>
                  <span>Yakın (10)</span>
                </div>
              </div>

              <div className="form-section">
                <h4>İletişim Bilgileri</h4>
                <p className="form-note">* E-posta veya telefon alanlarından en az biri zorunludur</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>E-posta</label>
                    <input
                      type="email"
                      value={formData.new_person_email}
                      onChange={(e) => updateFormData('new_person_email', e.target.value)}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      value={formData.new_person_phone}
                      onChange={(e) => updateFormData('new_person_phone', e.target.value)}
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Eğitim Geçmişi</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Üniversite</label>
                    <input
                      type="text"
                      value={formData.new_person_university}
                      onChange={(e) => updateFormData('new_person_university', e.target.value)}
                      placeholder="İstanbul Teknik Üniversitesi"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bölüm</label>
                    <input
                      type="text"
                      value={formData.new_person_department}
                      onChange={(e) => updateFormData('new_person_department', e.target.value)}
                      placeholder="Bilgisayar Mühendisliği"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Derece</label>
                    <input
                      type="text"
                      value={formData.new_person_degree}
                      onChange={(e) => updateFormData('new_person_degree', e.target.value)}
                      placeholder="Lisans, Yüksek Lisans, Doktora"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mezuniyet Yılı</label>
                    <input
                      type="number"
                      value={formData.new_person_graduation_year}
                      onChange={(e) => updateFormData('new_person_graduation_year', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Kişi Hakkında Genel Açıklama</label>
                <textarea
                  value={formData.new_person_description}
                  onChange={(e) => updateFormData('new_person_description', e.target.value)}
                  placeholder="Kişi hakkında kısa bir açıklama..."
                  rows={3}
                />
              </div>

              <div className="form-group checkbox-group">
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
        );

      case 2: // İş Bilgileri
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>İş Bilgileri</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Şu Anki Pozisyonu</label>
                  <input
                    type="text"
                    value={formData.new_person_position}
                    onChange={(e) => updateFormData('new_person_position', e.target.value)}
                    placeholder="Yazılım Geliştirici"
                  />
                </div>
                <div className="form-group">
                  <label>Şirket</label>
                  <input
                    type="text"
                    value={formData.new_person_company}
                    onChange={(e) => updateFormData('new_person_company', e.target.value)}
                    placeholder="ABC Teknoloji"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Daha Önceki İş Tecrübeleri</label>
                <textarea
                  value={formData.new_person_work_experience}
                  onChange={(e) => updateFormData('new_person_work_experience', e.target.value)}
                  placeholder="Önceki iş deneyimlerinizi kısaca açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Uzmanlık Alanları</label>
                <input
                  type="text"
                  value={formData.new_person_expertise}
                  onChange={(e) => updateFormData('new_person_expertise', e.target.value)}
                  placeholder="Yazılım, Finans, Pazarlama..."
                />
              </div>

              <div className="form-group">
                <label>Verebileceği Hizmetler</label>
                <input
                  type="text"
                  value={formData.new_person_services}
                  onChange={(e) => updateFormData('new_person_services', e.target.value)}
                  placeholder="Tasarım, Yazılım, Pazarlama..."
                />
              </div>

              <div className="form-group">
                <label>Yatırım Yaptığı veya Destek Verdiği Projeler</label>
                <textarea
                  value={formData.new_person_investments}
                  onChange={(e) => updateFormData('new_person_investments', e.target.value)}
                  placeholder="Destek verdiği projeleri açıklayın..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Kişisel Özellikler
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>Kişisel Özellikler</h3>
              
              <div className="form-group">
                <label>Kişisel Özellikler</label>
                <textarea
                  value={formData.new_person_personal_traits}
                  onChange={(e) => updateFormData('new_person_personal_traits', e.target.value)}
                  placeholder="Dürüstlük, güvenilirlik, disiplin, çalışkanlık, sabırlı olmak, liderlik, takım çalışması, iletişim becerisi..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Değer Verdiği Prensipler</label>
                <textarea
                  value={formData.new_person_values}
                  onChange={(e) => updateFormData('new_person_values', e.target.value)}
                  placeholder="Etik, sürdürülebilirlik, topluma fayda..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Hedefleri</label>
                <textarea
                  value={formData.new_person_goals}
                  onChange={(e) => updateFormData('new_person_goals', e.target.value)}
                  placeholder="Kısa ve uzun vadeli hedeflerini açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Vizyonu</label>
                <textarea
                  value={formData.new_person_vision}
                  onChange={(e) => updateFormData('new_person_vision', e.target.value)}
                  placeholder="Gelecek vizyonunu açıklayın..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4: // Sosyal
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>Sosyal</h3>
              
              <div className="form-group">
                <label>Hobiler ve İlgi Alanları</label>
                <textarea
                  value={formData.new_person_hobbies}
                  onChange={(e) => updateFormData('new_person_hobbies', e.target.value)}
                  placeholder="Hobilerini ve ilgi alanlarını açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Konuştuğu Diller</label>
                <input
                  type="text"
                  value={formData.new_person_languages}
                  onChange={(e) => updateFormData('new_person_languages', e.target.value)}
                  placeholder="Türkçe, İngilizce, Almanca..."
                />
              </div>

              <div className="form-group">
                <label>Mentor Olup Olmadığı</label>
                <textarea
                  value={formData.new_person_mentor}
                  onChange={(e) => updateFormData('new_person_mentor', e.target.value)}
                  placeholder="Mentorluk deneyimlerini açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Gönüllü İşler/Topluluk Deneyimleri</label>
                <textarea
                  value={formData.new_person_volunteer_experience}
                  onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)}
                  placeholder="Gönüllü çalışmalarını ve topluluk deneyimlerini açıklayın..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 5: // Deneyim
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>Deneyim</h3>
              
              <div className="form-group">
                <label>Hayatındaki Dönüm Noktaları</label>
                <textarea
                  value={formData.new_person_turning_points}
                  onChange={(e) => updateFormData('new_person_turning_points', e.target.value)}
                  placeholder="Hayatındaki önemli dönüm noktalarını açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Karşılaştığı Büyük Zorluklar</label>
                <textarea
                  value={formData.new_person_challenges}
                  onChange={(e) => updateFormData('new_person_challenges', e.target.value)}
                  placeholder="Karşılaştığı zorlukları ve nasıl üstesinden geldiğini açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Öğrendiği Büyük Dersler</label>
                <textarea
                  value={formData.new_person_lessons}
                  onChange={(e) => updateFormData('new_person_lessons', e.target.value)}
                  placeholder="Hayatından öğrendiği önemli dersleri açıklayın..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 6: // Gelecek
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>Gelecek</h3>
              
              <div className="form-group">
                <label>5/10 Yıllık Hedefleri</label>
                <textarea
                  value={formData.new_person_future_goals}
                  onChange={(e) => updateFormData('new_person_future_goals', e.target.value)}
                  placeholder="5-10 yıl içindeki hedeflerini açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Yeni İş Fikirlerine Yaklaşımı</label>
                <textarea
                  value={formData.new_person_investment_interest}
                  onChange={(e) => updateFormData('new_person_investment_interest', e.target.value)}
                  placeholder="Yeni iş fikirlerine nasıl yaklaştığını açıklayın..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>İş Birliği Yapmak İstediği Alanlar</label>
                <textarea
                  value={formData.new_person_collaboration_areas}
                  onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)}
                  placeholder="Hangi alanlarda iş birliği yapmak istediğini açıklayın..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="invite-form">
      <div className="header">
        <img src="/networkinggptlogo.jpeg" alt="NetworkingGPT Logo" className="logo" />
        <div className="header-text">
          <h1>NetworkingGPT</h1>
          <p>Profesyonel Ağınızı Genişletin</p>
          <p className="motto">Bağlantılarınızı Güçlendirin, Fırsatları Keşfedin</p>
        </div>
      </div>

      <div className="step-container">
        <div className="step-header">
          <div className="step-info">
            <span className="step-icon">{stepIcons[currentStep]}</span>
            <div>
              <h2>{stepTitles[currentStep]}</h2>
              <p>Adım {currentStep + 1} / {totalSteps}</p>
            </div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>

        {renderStepContent()}

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button className="btn-secondary" onClick={handlePrevious}>
              Geri
            </button>
          )}
          
          {currentStep < totalSteps - 1 && currentStep > 0 && (
            <button className="btn-primary" onClick={handleNext}>
              İleri
            </button>
          )}
          
          {currentStep === totalSteps - 1 && (
            <button 
              className="btn-primary" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

