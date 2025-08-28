import React, { useState, useEffect } from 'react';
import './InviteForm.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kprqdwwjywxtkariwjyd.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcnFkd3dqeXd4dGthcml3anlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDYxMjYsImV4cCI6MjA3MTM4MjEyNn0.fuxy0dHa0D-DqyCopteghMn_HMrFagPm1NDMQF-29Uk';

interface FormData {
  inviter_first_name: string;
  inviter_last_name: string;
  inviter_email: string;

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

  new_person_position: string;
  new_person_company: string;
  new_person_work_experience: string;
  new_person_expertise: string[];
  new_person_services: string[];
  new_person_investments: string;

  new_person_personal_traits: string[];
  new_person_values: string[];
  new_person_goals: string;
  new_person_vision: string;

  new_person_hobbies: string[];
  new_person_languages: string[];
  new_person_mentor: boolean;
  new_person_volunteer_experience: string;

  new_person_turning_points: string;
  new_person_challenges: string;
  new_person_achievements: string;
  new_person_lessons_learned: string;

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

const stepIcons = ['👤', '🧩', '💼', '🎭', '🌍', '📈', '🤝'];
const stepTitles = [
  'Davet Gönderen Bilgileri',
  'Temel Bilgiler',
  'İş Bilgileri',
  'Kişisel Özellikler',
  'Sosyal Bilgiler',
  'Deneyim',
  'Bağlantı',
];

const totalSteps = stepTitles.length;

const InviteForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stepAnimations, setStepAnimations] = useState<{ [key: number]: boolean }>({});

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  useEffect(() => {
    setStepAnimations((prev) => ({ ...prev, [currentStep]: true }));
    const t = setTimeout(() => setStepAnimations((p) => ({ ...p, [currentStep]: false })), 800);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.get('t'); // invite token (şimdilik görselde kullanılmıyor)
  }, []);

  const [formData, setFormData] = useState<FormData>({
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
    new_person_expertise: [],
    new_person_services: [],
    new_person_investments: '',

    new_person_personal_traits: [],
    new_person_values: [],
    new_person_goals: '',
    new_person_vision: '',

    new_person_hobbies: [],
    new_person_languages: [],
    new_person_mentor: false,
    new_person_volunteer_experience: '',

    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_achievements: '',
    new_person_lessons_learned: '',

    new_person_connection_strength: 5,
    new_person_meeting_frequency: '',
    new_person_communication_preference: '',
    new_person_collaboration_areas: '',
  });

  const updateFormData = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateCurrentStep = () => {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentStep === 0) {
      if (!formData.inviter_first_name.trim() || !formData.inviter_last_name.trim() || !formData.inviter_email.trim()) {
        alert('Lütfen tüm alanları doldurun!');
        return false;
      }
      if (!emailRx.test(formData.inviter_email)) {
        alert('Lütfen geçerli bir e-posta adresi girin!');
        return false;
      }
    }
    if (currentStep === 1) {
      if (!formData.new_person_first_name.trim() || !formData.new_person_last_name.trim()) {
        alert('Ad ve soyad alanları zorunludur!');
        return false;
      }
      if (!formData.new_person_email.trim() || !emailRx.test(formData.new_person_email)) {
        alert('Lütfen geçerli bir e-posta adresi girin!');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === 1) {
      console.log('🔍 Adım 1 - Kişi kontrolü başlıyor');
      const ok = await checkNewPersonExists();
      console.log('📊 Kişi kontrolü sonucu:', ok);
      if (!ok) {
        console.log('❌ Kişi zaten var, adım 2\'ye geçilemiyor');
        return; // Kişi zaten varsa diğer adıma geçme
      }
      console.log('✅ Kişi kontrolü başarılı, adım 2\'ye geçiliyor');
    }
    
    if (currentStep < totalSteps - 1) {
      console.log('🔄 Adım değiştiriliyor:', currentStep, '->', currentStep + 1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const checkPersonExists = async () => {
    setLoading(true);
    try {
      handleNext();
    } catch (e) {
      console.error(e);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const checkNewPersonExists = async () => {
    setLoading(true);
    try {
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-verify`;
      const body = {
        first_name: formData.new_person_first_name.trim(),
        last_name: formData.new_person_last_name.trim(),
        email: formData.new_person_email.trim(),
      };
      
      console.log('Kişi kontrolü için gönderilen parametreler:', body);
      
      const res = await fetch(supabaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        console.error('HTTP Error:', res.status, res.statusText);
        throw new Error(`HTTP ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Kişi kontrolü API sonucu:', result);
      
      if (result.exists) {
        console.log('❌ Kişi zaten var!');
        alert('Bu kişi (ad, soyad, e-posta) zaten contacts tablosunda mevcut!');
        return false;
      }
      
      console.log('✅ Kişi yeni, devam edilebilir');
      return true;
    } catch (e) {
      console.error('Kişi kontrolü hatası:', e);
      alert('Kişi kontrolü sırasında bir hata oluştu.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-submit`;
      const res = await fetch(supabaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          inviter: {
            first_name: formData.inviter_first_name.trim(),
            last_name: formData.inviter_last_name.trim(),
            email: formData.inviter_email.trim(),
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
            investment_interest: !!formData.new_person_investments,
            collaboration_areas: formData.new_person_collaboration_areas,
          },
          send_email_notification: false,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) {
        alert('Kişi başarıyla eklendi!');
      } else {
        alert('Bir hata oluştu: ' + result.error);
      }
    } catch (e) {
      console.error(e);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Dropdown verileri (özgün dosyandan aynen) ---------- */
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
    { id: 'other', name: 'Diğer', emoji: '➕' },
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
    { id: 'other', name: 'Diğer', emoji: '➕' },
  ];

  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [languagesDropdownOpen, setLanguagesDropdownOpen] = useState(false);

  const toggleExpertiseDropdown = () => setExpertiseDropdownOpen((s) => !s);
  const toggleServicesDropdown = () => setServicesDropdownOpen((s) => !s);
  const toggleLanguagesDropdown = () => setLanguagesDropdownOpen((s) => !s);

  const handleExpertiseSelect = (option: DropdownOption) => {
    const arr = formData.new_person_expertise.includes(option.id)
      ? formData.new_person_expertise.filter((id) => id !== option.id)
      : [...formData.new_person_expertise, option.id];
    updateFormData('new_person_expertise', arr);
  };
  const handleServicesSelect = (option: DropdownOption) => {
    const arr = formData.new_person_services.includes(option.id)
      ? formData.new_person_services.filter((id) => id !== option.id)
      : [...formData.new_person_services, option.id];
    updateFormData('new_person_services', arr);
  };
  const handleLanguagesSelect = (option: DropdownOption) => {
    const arr = formData.new_person_languages.includes(option.id)
      ? formData.new_person_languages.filter((id) => id !== option.id)
      : [...formData.new_person_languages, option.id];
    updateFormData('new_person_languages', arr);
  };

  const removeExpertise = (id: string) =>
    updateFormData('new_person_expertise', formData.new_person_expertise.filter((x) => x !== id));
  const removeService = (id: string) =>
    updateFormData('new_person_services', formData.new_person_services.filter((x) => x !== id));
  const removeLanguage = (id: string) =>
    updateFormData('new_person_languages', formData.new_person_languages.filter((x) => x !== id));

  const getSelectedExpertiseNames = () =>
    formData.new_person_expertise.map((id) => expertiseOptions.find((o) => o.id === id)?.name || id);
  const getSelectedServicesNames = () =>
    formData.new_person_services.map((id) => expertiseOptions.find((o) => o.id === id)?.name || id);
  const getSelectedLanguagesNames = () =>
    formData.new_person_languages.map((id) => languageOptions.find((o) => o.id === id)?.name || id);

  /** ---------- Step içerikleri (veri tarafına dokunmadan) ---------- */
  const stepClass = (i: number) => (stepAnimations[i] ? 'step-content animated' : 'step-content');

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={stepClass(0)}>
            <div className="form-section">
              <h3>👤 Davet Gönderen Bilgileri</h3>
              <div className="form-group">
                <label>Ad</label>
                <input value={formData.inviter_first_name} onChange={(e) => updateFormData('inviter_first_name', e.target.value)} placeholder="Adınız" />
              </div>
              <div className="form-group">
                <label>Soyad</label>
                <input value={formData.inviter_last_name} onChange={(e) => updateFormData('inviter_last_name', e.target.value)} placeholder="Soyadınız" />
              </div>
              <div className="form-group">
                <label>E-posta Adresi</label>
                <input type="email" value={formData.inviter_email} onChange={(e) => updateFormData('inviter_email', e.target.value)} placeholder="e-posta@ornek.com" />
              </div>
              <button className="nav-btn save-btn full" onClick={checkPersonExists} disabled={loading}>
                {loading ? 'Kontrol Ediliyor…' : 'Devam Et'}
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={stepClass(1)}>
            <div className="form-section">
              <h3>🧩 Temel Bilgiler</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Ad</label>
                  <input value={formData.new_person_first_name} onChange={(e) => updateFormData('new_person_first_name', e.target.value)} placeholder="Ad" />
                </div>
                <div className="form-group">
                  <label>Soyad</label>
                  <input value={formData.new_person_last_name} onChange={(e) => updateFormData('new_person_last_name', e.target.value)} placeholder="Soyad" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Yaş</label>
                  <input type="number" value={formData.new_person_age} onChange={(e) => updateFormData('new_person_age', e.target.value)} placeholder="25" />
                </div>
                <div className="form-group">
                  <label>Nereli</label>
                  <input value={formData.new_person_birthplace} onChange={(e) => updateFormData('new_person_birthplace', e.target.value)} placeholder="İstanbul" />
                </div>
              </div>

              <div className="form-group">
                <label>Şu anki Şehir</label>
                <input value={formData.new_person_current_city} onChange={(e) => updateFormData('new_person_current_city', e.target.value)} placeholder="İstanbul" />
              </div>

              <div className="form-group">
                <label>Yakınlık Seviyesi</label>
                <input
                  type="range"
                  min={1}
                  max={10}
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
                  <input type="email" value={formData.new_person_email} onChange={(e) => updateFormData('new_person_email', e.target.value)} placeholder="e-posta@ornek.com" />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input type="tel" value={formData.new_person_phone} onChange={(e) => updateFormData('new_person_phone', e.target.value)} placeholder="+90 555 123 45 67" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Üniversite</label>
                  <input value={formData.new_person_university} onChange={(e) => updateFormData('new_person_university', e.target.value)} placeholder="Boğaziçi Üniversitesi" />
                </div>
                <div className="form-group">
                  <label>Bölüm</label>
                  <input value={formData.new_person_department} onChange={(e) => updateFormData('new_person_department', e.target.value)} placeholder="Bilgisayar Mühendisliği" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Derece</label>
                  <input value={formData.new_person_degree} onChange={(e) => updateFormData('new_person_degree', e.target.value)} placeholder="Lisans" />
                </div>
                <div className="form-group">
                  <label>Mezuniyet Yılı</label>
                  <input type="number" value={formData.new_person_graduation_year} onChange={(e) => updateFormData('new_person_graduation_year', e.target.value)} placeholder="2020" />
                </div>
              </div>

              <div className="form-group">
                <label>Kısa Açıklama</label>
                <textarea value={formData.new_person_description} onChange={(e) => updateFormData('new_person_description', e.target.value)} placeholder="Kişi hakkında kısa bir açıklama..." rows={3} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={stepClass(2)}>
            <div className="form-section">
              <h3>💼 İş Bilgileri</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Pozisyon</label>
                  <input value={formData.new_person_position} onChange={(e) => updateFormData('new_person_position', e.target.value)} placeholder="Yazılım Geliştirici" />
                </div>
                <div className="form-group">
                  <label>Şirket</label>
                  <input value={formData.new_person_company} onChange={(e) => updateFormData('new_person_company', e.target.value)} placeholder="Tech Company" />
                </div>
              </div>

              <div className="form-group">
                <label>İş Deneyimi</label>
                <textarea value={formData.new_person_work_experience} onChange={(e) => updateFormData('new_person_work_experience', e.target.value)} placeholder="İş deneyimi hakkında bilgiler..." rows={3} />
              </div>

              <div className="form-group">
                <label>Uzmanlık Alanları</label>
                <div className="dropdown-container">
                  <button className={`dropdown-button ${expertiseDropdownOpen ? 'open' : ''}`} onClick={toggleExpertiseDropdown}>
                    <span>Uzmanlık alanları seçin</span>
                    <span>▼</span>
                  </button>
                  {expertiseDropdownOpen && (
                    <div className="dropdown-list">
                      {expertiseOptions.map((o) => (
                        <div key={o.id} className={`dropdown-item ${formData.new_person_expertise.includes(o.id) ? 'selected' : ''}`} onClick={() => handleExpertiseSelect(o)}>
                          <span className="dropdown-item-emoji">{o.emoji}</span>
                          <span className="dropdown-item-text">{o.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_expertise.length > 0 && (
                  <div className="selected-items">
                    {getSelectedExpertiseNames().map((name, i) => (
                      <div key={i} className="selected-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => removeExpertise(formData.new_person_expertise[i])}>
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
                  <button className={`dropdown-button ${servicesDropdownOpen ? 'open' : ''}`} onClick={toggleServicesDropdown}>
                    <span>Hizmetler seçin</span>
                    <span>▼</span>
                  </button>
                  {servicesDropdownOpen && (
                    <div className="dropdown-list">
                      {expertiseOptions.map((o) => (
                        <div key={o.id} className={`dropdown-item ${formData.new_person_services.includes(o.id) ? 'selected' : ''}`} onClick={() => handleServicesSelect(o)}>
                          <span className="dropdown-item-emoji">{o.emoji}</span>
                          <span className="dropdown-item-text">{o.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_services.length > 0 && (
                  <div className="selected-items">
                    {getSelectedServicesNames().map((name, i) => (
                      <div key={i} className="selected-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => removeService(formData.new_person_services[i])}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Yatırım Alanları</label>
                <textarea value={formData.new_person_investments} onChange={(e) => updateFormData('new_person_investments', e.target.value)} placeholder="İlgilendiği yatırım alanları..." rows={3} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={stepClass(3)}>
            <div className="form-section">
              <h3>🎭 Kişisel Özellikler</h3>
              <div className="form-group">
                <label>Kişisel Hedefler</label>
                <textarea value={formData.new_person_goals} onChange={(e) => updateFormData('new_person_goals', e.target.value)} placeholder="Kişisel ve profesyonel hedefleri..." rows={3} />
              </div>
              <div className="form-group">
                <label>Vizyon</label>
                <textarea value={formData.new_person_vision} onChange={(e) => updateFormData('new_person_vision', e.target.value)} placeholder="Gelecek vizyonu..." rows={3} />
              </div>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" checked={formData.new_person_mentor} onChange={(e) => updateFormData('new_person_mentor', e.target.checked)} />
                  <span>Mentor olmak istiyor</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={stepClass(4)}>
            <div className="form-section">
              <h3>🌍 Sosyal Bilgiler</h3>
              <div className="form-group">
                <label>Konuştuğu Diller</label>
                <div className="dropdown-container">
                  <button className={`dropdown-button ${languagesDropdownOpen ? 'open' : ''}`} onClick={toggleLanguagesDropdown}>
                    <span>Diller seçin</span>
                    <span>▼</span>
                  </button>
                  {languagesDropdownOpen && (
                    <div className="dropdown-list">
                      {languageOptions.map((o) => (
                        <div key={o.id} className={`dropdown-item ${formData.new_person_languages.includes(o.id) ? 'selected' : ''}`} onClick={() => handleLanguagesSelect(o)}>
                          <span className="dropdown-item-emoji">{o.emoji}</span>
                          <span className="dropdown-item-text">{o.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_languages.length > 0 && (
                  <div className="selected-items">
                    {getSelectedLanguagesNames().map((name, i) => (
                      <div key={i} className="selected-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => removeLanguage(formData.new_person_languages[i])}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Gönüllülük Deneyimi</label>
                <textarea value={formData.new_person_volunteer_experience} onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)} placeholder="Gönüllülük deneyimleri..." rows={3} />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className={stepClass(5)}>
            <div className="form-section">
              <h3>📈 Deneyim</h3>
              <div className="form-group">
                <label>Dönüm Noktaları</label>
                <textarea value={formData.new_person_turning_points} onChange={(e) => updateFormData('new_person_turning_points', e.target.value)} placeholder="Hayatındaki önemli dönüm noktaları..." rows={3} />
              </div>
              <div className="form-group">
                <label>Karşılaştığı Zorluklar</label>
                <textarea value={formData.new_person_challenges} onChange={(e) => updateFormData('new_person_challenges', e.target.value)} placeholder="Zorluklar ve nasıl aşıldığı..." rows={3} />
              </div>
              <div className="form-group">
                <label>Başarıları</label>
                <textarea value={formData.new_person_achievements} onChange={(e) => updateFormData('new_person_achievements', e.target.value)} placeholder="Önemli başarıları..." rows={3} />
              </div>
              <div className="form-group">
                <label>Öğrendiği Dersler</label>
                <textarea value={formData.new_person_lessons_learned} onChange={(e) => updateFormData('new_person_lessons_learned', e.target.value)} placeholder="Önemli dersler..." rows={3} />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className={stepClass(6)}>
            <div className="form-section">
              <h3>🤝 Bağlantı</h3>
              <div className="form-group">
                <label>Bağlantı Gücü</label>
                <input
                  type="range"
                  min={1}
                  max={10}
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
                <input value={formData.new_person_meeting_frequency} onChange={(e) => updateFormData('new_person_meeting_frequency', e.target.value)} placeholder="Haftada bir, ayda bir..." />
              </div>

              <div className="form-group">
                <label>İletişim Tercihi</label>
                <input value={formData.new_person_communication_preference} onChange={(e) => updateFormData('new_person_communication_preference', e.target.value)} placeholder="E-posta, telefon, LinkedIn..." />
              </div>

              <div className="form-group">
                <label>İş Birliği Yapma İsteği Alanlar</label>
                <textarea value={formData.new_person_collaboration_areas} onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)} placeholder="Hangi alanlarda işbirliği yapmak istediği..." rows={3} />
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
      {/* HERO */}
      <header className="hero">
        <img src="/networkinggptlogo.jpeg" alt="NetworkingGPT" className="hero-logo" />
        <h1 className="brand">NETWORKING <span>GPT</span></h1>
        <p className="subtitle">Davete özel kişi ekleme platformu</p>
        <p className="motto">✨ Mitolojik güçle ağınızı genişletin</p>
      </header>

      {/* CARD */}
      <div className="main-container card-glass">
        {/* Step head */}
        <div className="step-header">
          <div className="step-title">
            <div className="step-icon">👥</div>
            <div>
              <div className="step-eyebrow">Adım {currentStep + 1} / {totalSteps}</div>
              <h2>Adım {currentStep + 1}: Ağımıza Katılın</h2>
            </div>
          </div>

          {/* Progress */}
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-meta">
              <span className="progress-label">{stepTitles[currentStep]}</span>
              <span className="progress-percent">{progressPercent}% Tamamlandı</span>
            </div>
          </div>

          {/* Step dots */}
          <div className="step-dots">
            {stepTitles.map((t, i) => (
              <div key={t} className={`dot ${i === currentStep ? 'active' : ''}`} title={`${i + 1}. ${t}`}>
                <span className="dot-icon">{stepIcons[i]}</span>
                <span className="dot-index">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation (üstte) */}
        <div className="navigation-section">
          {currentStep > 0 && (
            <button className="nav-btn prev-btn" onClick={handlePrevious}>← Önceki Adım</button>
          )}
          {currentStep < totalSteps - 1 && currentStep > 0 && (
            <button className="nav-btn next-btn" onClick={handleNext} disabled={loading}>
              {loading ? 'Kontrol Ediliyor…' : 'Sonraki Adım →'}
            </button>
          )}
          {currentStep === totalSteps - 1 && (
            <button className="nav-btn save-btn" onClick={handleSave} disabled={loading}>
              {loading ? 'Kaydediliyor…' : 'Kişi Ekle'}
            </button>
          )}
        </div>

        {/* İçerik */}
        <div className="form-content">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default InviteForm;
