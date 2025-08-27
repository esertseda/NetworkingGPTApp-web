import React, { useState, useEffect } from 'react';
import './InviteForm.css';

// Supabase URL'ini environment variable'dan al
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kprqdwwjywxtkariwjyd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcnFkd3dqeXd4dGthcml3anlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDYxMjYsImV4cCI6MjA3MTM4MjEyNn0.fuxy0dHa0D-DqyCopteghMn_HMrFagPm1NDMQF-29Uk';

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
  new_person_expertise: string[];
  new_person_services: string[];
  new_person_investments: string;
  
  // Kişisel özellikler
  new_person_personal_traits: string[];
  new_person_values: string[];
  new_person_goals: string;
  new_person_vision: string;
  
  // Sosyal
  new_person_hobbies: string[];
  new_person_languages: string[];
  new_person_mentor: boolean;
  new_person_volunteer_experience: string;
  
  // Deneyim
  new_person_turning_points: string;
  new_person_challenges: string;
  new_person_achievements: string;
  new_person_lessons_learned: string;
  
  // Bağlantı
  new_person_connection_strength: number;
  new_person_meeting_frequency: string;
  new_person_communication_preference: string;
  new_person_collaboration_areas: string;
}

interface DropdownOption {
  id: string;
  name: string;
  emoji: string;
}

const InviteForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  // inviteId artık kullanılmıyor, kaldırıldı
  const [stepAnimations, setStepAnimations] = useState<{[key: number]: boolean}>({});



  const totalSteps = 7;
  const stepTitles = [
    'Davet Gönderen Bilgileri',
    'Temel Bilgiler',
    'İş Bilgileri',
    'Kişisel Özellikler',
    'Sosyal Bilgiler',
    'Deneyim',
    'Bağlantı'
  ];

  // Step animasyonları için useEffect
  useEffect(() => {
    setStepAnimations(prev => ({
      ...prev,
      [currentStep]: true
    }));

    // Animasyon süresi sonrası state'i temizle
    const timer = setTimeout(() => {
      setStepAnimations(prev => ({
        ...prev,
        [currentStep]: false
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    // URL'den inviteId'yi çıkar
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('t');
    if (id) {
      // inviteId artık kullanılmıyor
    }
  }, []);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    switch (currentStep) {
      case 0: // Davet gönderen bilgileri
        if (!formData.inviter_first_name.trim() || !formData.inviter_last_name.trim() || !formData.inviter_email.trim()) {
          alert('Lütfen tüm alanları doldurun!');
          return false;
        }
        // Email format kontrolü
        if (!emailRegex.test(formData.inviter_email)) {
          alert('Lütfen geçerli bir e-posta adresi girin!');
          return false;
        }
        return true;
      
      case 1: // Temel Bilgiler
        if (!formData.new_person_first_name.trim() || !formData.new_person_last_name.trim()) {
          alert('Ad ve soyad alanları zorunludur!');
          return false;
        }
        if (!formData.new_person_email.trim()) {
          alert('E-posta adresi zorunludur!');
          return false;
        }
        // Email format kontrolü
        if (!emailRegex.test(formData.new_person_email)) {
          alert('Lütfen geçerli bir e-posta adresi girin!');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = async () => {
    console.log('🚀 handleNext çağrıldı, currentStep:', currentStep);
    
    if (validateCurrentStep()) {
      console.log('✅ Validasyon başarılı');
      
      // Adım 1'de (Temel Bilgiler) kişi kontrolü yap
      if (currentStep === 1) {
        console.log('🔍 Adım 1 - Kişi kontrolü başlıyor');
        const personExists = await checkNewPersonExists();
        console.log('📊 Kişi kontrolü sonucu:', personExists);
        if (!personExists) {
          console.log('❌ Kişi zaten var, adım 2\'ye geçilemiyor');
          return; // Kişi zaten varsa diğer adıma geçme
        }
        console.log('✅ Kişi kontrolü başarılı, adım 2\'ye geçiliyor');
      }
      
      // Kişi kontrolü başarılıysa veya adım 1 değilse devam et
      if (currentStep < totalSteps - 1) {
        console.log('🔄 Adım değiştiriliyor:', currentStep, '->', currentStep + 1);
        setCurrentStep(prev => prev + 1);
      }
    } else {
      console.log('❌ Validasyon başarısız');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const checkPersonExists = async () => {
    setLoading(true);
    try {
      // Adım 0'da sadece validasyon yap, davet doğrulama yapma
      console.log('Adım 0 - Davet gönderen bilgileri validasyonu başarılı');
      handleNext();
    } catch (error) {
      console.error('Error in step 0:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const checkNewPersonExists = async () => {
    setLoading(true);
    try {
      // Güncellenmiş invite-verify fonksiyonunu kullan
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-verify`;
      
      const requestBody = {
        first_name: formData.new_person_first_name.trim(),
        last_name: formData.new_person_last_name.trim(),
        email: formData.new_person_email.trim()
      };
      
      console.log('Kişi kontrolü için gönderilen parametreler:', requestBody);
      
      const response = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.exists) {
        alert('Bu kişi (ad, soyad, e-posta) zaten contacts tablosunda mevcut!');
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error checking new person:', error);
      alert('Kişi kontrolü sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Supabase Edge Function URL'i
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-submit`;
      
      const response = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          inviter: {
            first_name: formData.inviter_first_name,
            last_name: formData.inviter_last_name,
            email: formData.inviter_email
          },
          new_person: {
            first_name: formData.new_person_first_name,
            last_name: formData.new_person_last_name,
            age: parseInt(formData.new_person_age) || null,
            city: formData.new_person_birthplace,
            current_city: formData.new_person_current_city,
            university: formData.new_person_university,
            degree: formData.new_person_degree,
            graduation_year: parseInt(formData.new_person_graduation_year) || null,
            position: formData.new_person_position,
            company: formData.new_person_company,
            sectors: formData.new_person_expertise,
            expertise: formData.new_person_expertise.join(', '),
            services: formData.new_person_services.join(', '),
            email: formData.new_person_email,
            phone: formData.new_person_phone,
            languages: formData.new_person_languages.join(', '),
            mentor_service: formData.new_person_mentor,
            social_volunteer: formData.new_person_volunteer_experience,
            life_experience: formData.new_person_turning_points,
            challenges: formData.new_person_challenges,
            lessons: formData.new_person_lessons_learned,
            future_goals: formData.new_person_goals,
            investment_interest: formData.new_person_investments ? true : false,
            collaboration_areas: formData.new_person_collaboration_areas
          },
          send_email_notification: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert('Kişi başarıyla eklendi!');
        // Form'u sıfırla veya başka bir sayfaya yönlendir
      } else {
        alert('Bir hata oluştu: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving person:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

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
    new_person_expertise: [],
    new_person_services: [],
    new_person_investments: '',
    
    // Kişisel özellikler
    new_person_personal_traits: [],
    new_person_values: [],
    new_person_goals: '',
    new_person_vision: '',
    
    // Sosyal
    new_person_hobbies: [],
    new_person_languages: [],
    new_person_mentor: false,
    new_person_volunteer_experience: '',
    
    // Deneyim
    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_achievements: '',
    new_person_lessons_learned: '',
    
    // Bağlantı
    new_person_connection_strength: 5,
    new_person_meeting_frequency: '',
    new_person_communication_preference: '',
    new_person_collaboration_areas: ''
  });

  // Dropdown options
  const expertiseOptions: DropdownOption[] = [
    { id: 'software_development', name: 'Yazılım Geliştirme', emoji: '💻' },
    { id: 'data_science', name: 'Veri Bilimi', emoji: '📊' },
    { id: 'ai_ml', name: 'Yapay Zeka/Makine Öğrenmesi', emoji: '🤖' },
    { id: 'cybersecurity', name: 'Siber Güvenlik', emoji: '🔒' },
    { id: 'cloud_computing', name: 'Bulut Bilişim', emoji: '☁️' },
    { id: 'devops', name: 'DevOps', emoji: '⚙️' },
    { id: 'mobile_development', name: 'Mobil Geliştirme', emoji: '📱' },
    { id: 'web_development', name: 'Web Geliştirme', emoji: '🌐' },
    { id: 'ui_ux_design', name: 'UI/UX Tasarım', emoji: '🎨' },
    { id: 'product_management', name: 'Ürün Yönetimi', emoji: '📋' },
    { id: 'project_management', name: 'Proje Yönetimi', emoji: '📈' },
    { id: 'business_analysis', name: 'İş Analizi', emoji: '📊' },
    { id: 'marketing', name: 'Pazarlama', emoji: '📢' },
    { id: 'sales', name: 'Satış', emoji: '💰' },
    { id: 'finance', name: 'Finans', emoji: '💳' },
    { id: 'hr', name: 'İnsan Kaynakları', emoji: '👥' },
    { id: 'legal', name: 'Hukuk', emoji: '⚖️' },
    { id: 'consulting', name: 'Danışmanlık', emoji: '💡' },
    { id: 'mentoring', name: 'Mentorluk', emoji: '🎓' },
    { id: 'training', name: 'Eğitim/Kurs', emoji: '📚' },
    { id: 'freelance_dev', name: 'Freelance Geliştirme', emoji: '💻' },
    { id: 'web_design', name: 'Web Tasarım', emoji: '🌐' },
    { id: 'mobile_dev', name: 'Mobil Uygulama Geliştirme', emoji: '📱' },
    { id: 'ui_ux_service', name: 'UI/UX Tasarım Hizmeti', emoji: '🎨' },
    { id: 'graphic_design_service', name: 'Grafik Tasarım Hizmeti', emoji: '🖼️' },
    { id: 'content_creation', name: 'İçerik Üretimi', emoji: '✍️' },
    { id: 'copywriting', name: 'Metin Yazarlığı', emoji: '📝' },
    { id: 'translation_service', name: 'Çeviri Hizmeti', emoji: '🌍' },
    { id: 'seo_service', name: 'SEO Optimizasyonu', emoji: '🔍' },
    { id: 'social_media', name: 'Sosyal Medya Yönetimi', emoji: '📱' },
    { id: 'digital_marketing_service', name: 'Dijital Pazarlama', emoji: '📊' },
    { id: 'photography_service', name: 'Fotoğrafçılık', emoji: '📸' },
    { id: 'video_production', name: 'Video Prodüksiyon', emoji: '🎬' },
    { id: 'event_planning', name: 'Etkinlik Organizasyonu', emoji: '🎉' },
    { id: 'project_management_service', name: 'Proje Yönetimi', emoji: '📋' },
    { id: 'business_consulting', name: 'İş Danışmanlığı', emoji: '💼' },
    { id: 'financial_consulting', name: 'Finansal Danışmanlık', emoji: '💰' },
    { id: 'legal_service', name: 'Hukuki Danışmanlık', emoji: '⚖️' },
    { id: 'accounting_service', name: 'Muhasebe Hizmeti', emoji: '📊' },
    { id: 'hr_consulting', name: 'İK Danışmanlığı', emoji: '👥' },
    { id: 'market_research', name: 'Pazar Araştırması', emoji: '🔬' },
    { id: 'data_analysis', name: 'Veri Analizi', emoji: '📈' },
    { id: 'investment_advice', name: 'Yatırım Danışmanlığı', emoji: '📈' },
    { id: 'partnership', name: 'İş Ortaklığı', emoji: '🤝' },
    { id: 'networking', name: 'Network Kurma', emoji: '🌐' },
    { id: 'career_coaching', name: 'Kariyer Koçluğu', emoji: '🚀' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  const languageOptions: DropdownOption[] = [
    { id: 'turkish', name: 'Türkçe', emoji: '🇹🇷' },
    { id: 'english', name: 'İngilizce', emoji: '🇺🇸' },
    { id: 'german', name: 'Almanca', emoji: '🇩🇪' },
    { id: 'french', name: 'Fransızca', emoji: '🇫🇷' },
    { id: 'spanish', name: 'İspanyolca', emoji: '🇪🇸' },
    { id: 'italian', name: 'İtalyanca', emoji: '🇮🇹' },
    { id: 'russian', name: 'Rusça', emoji: '🇷🇺' },
    { id: 'arabic', name: 'Arapça', emoji: '🇸🇦' },
    { id: 'chinese', name: 'Çince', emoji: '🇨🇳' },
    { id: 'japanese', name: 'Japonca', emoji: '🇯🇵' },
    { id: 'korean', name: 'Korece', emoji: '🇰🇷' },
    { id: 'portuguese', name: 'Portekizce', emoji: '🇵🇹' },
    { id: 'dutch', name: 'Hollandaca', emoji: '🇳🇱' },
    { id: 'swedish', name: 'İsveççe', emoji: '🇸🇪' },
    { id: 'norwegian', name: 'Norveççe', emoji: '🇳🇴' },
    { id: 'danish', name: 'Danca', emoji: '🇩🇰' },
    { id: 'finnish', name: 'Fince', emoji: '🇫🇮' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  // Dropdown state'leri
  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [languagesDropdownOpen, setLanguagesDropdownOpen] = useState(false);

  // Dropdown toggle fonksiyonları
  const toggleExpertiseDropdown = () => setExpertiseDropdownOpen(!expertiseDropdownOpen);
  const toggleServicesDropdown = () => setServicesDropdownOpen(!servicesDropdownOpen);
  const toggleLanguagesDropdown = () => setLanguagesDropdownOpen(!languagesDropdownOpen);

  // Dropdown seçim fonksiyonları
  const handleExpertiseSelect = (option: DropdownOption) => {
    const newExpertise = formData.new_person_expertise.includes(option.id)
      ? formData.new_person_expertise.filter(id => id !== option.id)
      : [...formData.new_person_expertise, option.id];
    updateFormData('new_person_expertise', newExpertise);
  };

  const handleServicesSelect = (option: DropdownOption) => {
    const newServices = formData.new_person_services.includes(option.id)
      ? formData.new_person_services.filter(id => id !== option.id)
      : [...formData.new_person_services, option.id];
    updateFormData('new_person_services', newServices);
  };

  const handleLanguagesSelect = (option: DropdownOption) => {
    const newLanguages = formData.new_person_languages.includes(option.id)
      ? formData.new_person_languages.filter(id => id !== option.id)
      : [...formData.new_person_languages, option.id];
    updateFormData('new_person_languages', newLanguages);
  };

  // Seçili öğeleri kaldırma fonksiyonları
  const removeExpertise = (id: string) => {
    updateFormData('new_person_expertise', formData.new_person_expertise.filter(item => item !== id));
  };

  const removeService = (id: string) => {
    updateFormData('new_person_services', formData.new_person_services.filter(item => item !== id));
  };

  const removeLanguage = (id: string) => {
    updateFormData('new_person_languages', formData.new_person_languages.filter(item => item !== id));
  };

  // Seçili öğelerin isimlerini bulma
  const getSelectedExpertiseNames = () => {
    return formData.new_person_expertise.map(id => 
      expertiseOptions.find(option => option.id === id)?.name || id
    );
  };

  const getSelectedServicesNames = () => {
    return formData.new_person_services.map(id => 
      expertiseOptions.find(option => option.id === id)?.name || id
    );
  };

  const getSelectedLanguagesNames = () => {
    return formData.new_person_languages.map(id => 
      languageOptions.find(option => option.id === id)?.name || id
    );
  };

  const renderStepContent = () => {
    const stepClass = stepAnimations[currentStep] ? 'step-content animated' : 'step-content';
    
    switch (currentStep) {
      case 0: // Davet gönderen bilgileri
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>👤 Davet Gönderen Bilgileri</h3>
              
              <div className="form-group">
                <label>Ad</label>
                <input
                  type="text"
                  value={formData.inviter_first_name}
                  onChange={(e) => updateFormData('inviter_first_name', e.target.value)}
                  placeholder="Adınız"
                />
              </div>
              
              <div className="form-group">
                <label>Soyad</label>
                <input
                  type="text"
                  value={formData.inviter_last_name}
                  onChange={(e) => updateFormData('inviter_last_name', e.target.value)}
                  placeholder="Soyadınız"
                />
              </div>
            
              <div className="form-group">
                <label>E-posta Adresi</label>
                <input
                  type="email"
                  value={formData.inviter_email}
                  onChange={(e) => updateFormData('inviter_email', e.target.value)}
                  placeholder="e-posta@ornek.com"
                />
              </div>
            
              <button 
                className="nav-btn save-btn"
                onClick={checkPersonExists}
                disabled={loading}
                style={{ marginTop: '20px', width: '100%' }}
              >
                {loading ? 'Kontrol Ediliyor...' : 'Devam Et'}
              </button>
            </div>
          </div>
        );

      case 1: // Temel Bilgiler
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>👤 Temel Bilgiler</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Ad</label>
                  <input
                    type="text"
                    value={formData.new_person_first_name}
                    onChange={(e) => updateFormData('new_person_first_name', e.target.value)}
                    placeholder="Ad"
                  />
                </div>
                <div className="form-group">
                  <label>Soyad</label>
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
                <label>Şu anki Şehir</label>
                <input
                  type="text"
                  value={formData.new_person_current_city}
                  onChange={(e) => updateFormData('new_person_current_city', e.target.value)}
                  placeholder="İstanbul"
                />
              </div>

              <div className="form-group">
                <label>Yakınlık Seviyesi</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.new_person_proximity_level}
                  onChange={(e) => updateFormData('new_person_proximity_level', parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>Uzak</span>
                  <span>Yakın</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>E-posta</label>
                  <input
                    type="email"
                    value={formData.new_person_email}
                    onChange={(e) => updateFormData('new_person_email', e.target.value)}
                    placeholder="e-posta@ornek.com"
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

              <div className="form-row">
                <div className="form-group">
                  <label>Üniversite</label>
                  <input
                    type="text"
                    value={formData.new_person_university}
                    onChange={(e) => updateFormData('new_person_university', e.target.value)}
                    placeholder="Boğaziçi Üniversitesi"
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
                    placeholder="Lisans"
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

              <div className="form-group">
                <label>Kısa Açıklama</label>
                <textarea
                  value={formData.new_person_description}
                  onChange={(e) => updateFormData('new_person_description', e.target.value)}
                  placeholder="Kişi hakkında kısa bir açıklama..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2: // İş Bilgileri
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>💼 İş Bilgileri</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Pozisyon</label>
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
                    placeholder="Tech Company"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>İş Deneyimi</label>
                <textarea
                  value={formData.new_person_work_experience}
                  onChange={(e) => updateFormData('new_person_work_experience', e.target.value)}
                  placeholder="İş deneyimi hakkında bilgiler..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Uzmanlık Alanları</label>
                <div className="dropdown-container">
                  <button
                    className={`dropdown-button ${expertiseDropdownOpen ? 'open' : ''}`}
                    onClick={toggleExpertiseDropdown}
                  >
                    <span>Uzmanlık alanları seçin</span>
                    <span>▼</span>
                  </button>
                  {expertiseDropdownOpen && (
                    <div className="dropdown-list">
                      {expertiseOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`dropdown-item ${formData.new_person_expertise.includes(option.id) ? 'selected' : ''}`}
                          onClick={() => handleExpertiseSelect(option)}
                        >
                          <span className="dropdown-item-emoji">{option.emoji}</span>
                          <span className="dropdown-item-text">{option.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_expertise.length > 0 && (
                  <div className="selected-items">
                    {getSelectedExpertiseNames().map((name, index) => (
                      <div key={index} className="selected-item">
                        <span>{name}</span>
                        <span
                          className="remove-item"
                          onClick={() => removeExpertise(formData.new_person_expertise[index])}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Sunabileceği Hizmetler</label>
                <div className="dropdown-container">
                  <button
                    className={`dropdown-button ${servicesDropdownOpen ? 'open' : ''}`}
                    onClick={toggleServicesDropdown}
                  >
                    <span>Hizmetler seçin</span>
                    <span>▼</span>
                  </button>
                  {servicesDropdownOpen && (
                    <div className="dropdown-list">
                      {expertiseOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`dropdown-item ${formData.new_person_services.includes(option.id) ? 'selected' : ''}`}
                          onClick={() => handleServicesSelect(option)}
                        >
                          <span className="dropdown-item-emoji">{option.emoji}</span>
                          <span className="dropdown-item-text">{option.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_services.length > 0 && (
                  <div className="selected-items">
                    {getSelectedServicesNames().map((name, index) => (
                      <div key={index} className="selected-item">
                        <span>{name}</span>
                        <span
                          className="remove-item"
                          onClick={() => removeService(formData.new_person_services[index])}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Yatırım Alanları</label>
                <textarea
                  value={formData.new_person_investments}
                  onChange={(e) => updateFormData('new_person_investments', e.target.value)}
                  placeholder="İlgilendiği yatırım alanları..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Kişisel Özellikler
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>🎭 Kişisel Özellikler</h3>
              
              <div className="form-group">
                <label>Kişisel Hedefler</label>
                <textarea
                  value={formData.new_person_goals}
                  onChange={(e) => updateFormData('new_person_goals', e.target.value)}
                  placeholder="Kişisel ve profesyonel hedefleri..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Vizyon</label>
                <textarea
                  value={formData.new_person_vision}
                  onChange={(e) => updateFormData('new_person_vision', e.target.value)}
                  placeholder="Gelecek vizyonu..."
                  rows={3}
                />
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.new_person_mentor}
                    onChange={(e) => updateFormData('new_person_mentor', e.target.checked)}
                  />
                  <span>Mentor olmak istiyor</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4: // Sosyal Bilgiler
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>🌍 Sosyal Bilgiler</h3>
              
              <div className="form-group">
                <label>Konuştuğu Diller</label>
                <div className="dropdown-container">
                  <button
                    className={`dropdown-button ${languagesDropdownOpen ? 'open' : ''}`}
                    onClick={toggleLanguagesDropdown}
                  >
                    <span>Diller seçin</span>
                    <span>▼</span>
                  </button>
                  {languagesDropdownOpen && (
                    <div className="dropdown-list">
                      {languageOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`dropdown-item ${formData.new_person_languages.includes(option.id) ? 'selected' : ''}`}
                          onClick={() => handleLanguagesSelect(option)}
                        >
                          <span className="dropdown-item-emoji">{option.emoji}</span>
                          <span className="dropdown-item-text">{option.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_languages.length > 0 && (
                  <div className="selected-items">
                    {getSelectedLanguagesNames().map((name, index) => (
                      <div key={index} className="selected-item">
                        <span>{name}</span>
                        <span
                          className="remove-item"
                          onClick={() => removeLanguage(formData.new_person_languages[index])}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Gönüllülük Deneyimi</label>
                <textarea
                  value={formData.new_person_volunteer_experience}
                  onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)}
                  placeholder="Gönüllülük deneyimleri..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 5: // Deneyim
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>📈 Deneyim</h3>
              
              <div className="form-group">
                <label>Dönüm Noktaları</label>
                <textarea
                  value={formData.new_person_turning_points}
                  onChange={(e) => updateFormData('new_person_turning_points', e.target.value)}
                  placeholder="Hayatındaki önemli dönüm noktaları..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Karşılaştığı Zorluklar</label>
                <textarea
                  value={formData.new_person_challenges}
                  onChange={(e) => updateFormData('new_person_challenges', e.target.value)}
                  placeholder="Karşılaştığı zorluklar ve nasıl üstesinden geldiği..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Başarıları</label>
                <textarea
                  value={formData.new_person_achievements}
                  onChange={(e) => updateFormData('new_person_achievements', e.target.value)}
                  placeholder="Önemli başarıları..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Öğrendiği Dersler</label>
                <textarea
                  value={formData.new_person_lessons_learned}
                  onChange={(e) => updateFormData('new_person_lessons_learned', e.target.value)}
                  placeholder="Hayatından öğrendiği önemli dersler..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 6: // Bağlantı
        return (
          <div className={stepClass}>
            <div className="form-section">
              <h3>🤝 Bağlantı</h3>
              
              <div className="form-group">
                <label>Bağlantı Gücü</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.new_person_connection_strength}
                  onChange={(e) => updateFormData('new_person_connection_strength', parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>Zayıf</span>
                  <span>Güçlü</span>
                </div>
              </div>

              <div className="form-group">
                <label>Görüşme Sıklığı</label>
                <input
                  type="text"
                  value={formData.new_person_meeting_frequency}
                  onChange={(e) => updateFormData('new_person_meeting_frequency', e.target.value)}
                  placeholder="Haftada bir, ayda bir..."
                />
              </div>

              <div className="form-group">
                <label>İletişim Tercihi</label>
                <input
                  type="text"
                  value={formData.new_person_communication_preference}
                  onChange={(e) => updateFormData('new_person_communication_preference', e.target.value)}
                  placeholder="E-posta, telefon, LinkedIn..."
                />
              </div>

              <div className="form-group">
                <label>İş Birliği Yapma İsteği Alanlar</label>
                <textarea
                  value={formData.new_person_collaboration_areas}
                  onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)}
                  placeholder="Hangi alanlarda işbirliği yapmak istediği..."
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
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src="/networkinggptlogo.jpeg" alt="NetworkingGPT Logo" className="logo-image" />
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* Step Header */}
        <div className="step-header">
          <div className="step-title">
            <div className="step-icon">👥</div>
            <div>
              <h2>Adım {currentStep + 1}: {stepTitles[currentStep]}</h2>
            </div>
          </div>
        </div>



        {/* Navigation */}
        <div className="navigation-section">
          {currentStep > 0 && (
            <button className="nav-btn prev-btn" onClick={handlePrevious}>
              ← Önceki Adım
            </button>
          )}
          {currentStep < totalSteps - 1 && currentStep > 0 && (
            <button 
              className="nav-btn next-btn" 
              onClick={() => {
                console.log('🚀 Buton tıklandı! currentStep:', currentStep);
                handleNext();
              }}
              disabled={loading}
            >
              {loading ? 'Kontrol Ediliyor...' : 'Sonraki Adım →'}
            </button>
          )}
          {currentStep === totalSteps - 1 && (
            <button 
              className="nav-btn save-btn" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kişi Ekle'}
            </button>
          )}
        </div>

        {/* Form Content */}
        <div className="form-content">
          {renderStepContent()}
        </div>


      </div>
    </div>
  );
};

export default InviteForm;

