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
  new_person_sectors: string[];
  new_person_sectors_other: string;
  new_person_expertise_other: string;
  new_person_services_other: string;
  show_sectors_other: boolean;
  show_expertise_other: boolean;
  show_services_other: boolean;
  custom_sectors: { id: string; name: string }[];
  custom_expertise: { id: string; name: string }[];
  custom_services: { id: string; name: string }[];
  new_person_investments: string;
  new_person_personal_traits: string[];
  new_person_values: string[];
  new_person_goals: string;
  new_person_vision: string;

  new_person_hobbies: string[];
  new_person_languages: string[];
  new_person_languages_other: string;
  show_languages_other: boolean;
  custom_languages: { id: string; name: string }[];
  new_person_mentor: boolean;
  new_person_volunteer_experience: string;

  new_person_turning_points: string;
  new_person_challenges: string;
  new_person_achievements: string;
  new_person_lessons_learned: string;

  new_person_meeting_frequency: string;
  new_person_communication_preference: string;
  new_person_collaboration_areas: string;
  send_email_notification: boolean;
  show_email_checkbox: boolean;
}

interface DropdownOption {
  id: string;
  name: string;
  emoji: string;
}

const stepIcons = ['🧩', '💼', '🎭', '🌍', '📈', '🤝'];
const stepTitles = [
  'Temel Bilgiler',
  'İş Bilgileri',
  'Kişisel Özellikler',
  'Sosyal ve Networking',
  'Deneyim',
  'Bağlantı',
];

const totalSteps = stepTitles.length;

const InviteForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isContactVerified, setIsContactVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepAnimations, setStepAnimations] = useState<{ [key: number]: boolean }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Progress bar için kullanılacak
  // const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  useEffect(() => {
    setStepAnimations((prev) => ({ ...prev, [currentStep]: true }));
    const t = setTimeout(() => setStepAnimations((p) => ({ ...p, [currentStep]: false })), 800);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.get('t'); // invite token (şimdilik görselde kullanılmıyor)
  }, []);

  // Dropdown menüleri sadece dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Eğer tıklanan element dropdown container içindeyse, kapatma
      if (target.closest('.dropdown-container')) {
        return;
      }
      
      // Dropdown dışına tıklandığında tüm dropdown'ları kapat
      setExpertiseDropdownOpen(false);
      setServicesDropdownOpen(false);
      setSectorsDropdownOpen(false);
      setLanguagesDropdownOpen(false);
      // setPersonalTraitsDropdownOpen(false);
      // setValuesDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
    new_person_sectors: [],
    new_person_sectors_other: '',
    new_person_expertise_other: '',
    new_person_services_other: '',
    show_sectors_other: false,
    show_expertise_other: false,
    show_services_other: false,
    custom_sectors: [],
    custom_expertise: [],
    custom_services: [],
    new_person_investments: '',
    new_person_personal_traits: [],
    new_person_values: [],
    new_person_goals: '',
    new_person_vision: '',

    new_person_hobbies: [],
    new_person_languages: [],
    new_person_languages_other: '',
    show_languages_other: false,
    custom_languages: [],
    new_person_mentor: false,
    new_person_volunteer_experience: '',

    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_achievements: '',
    new_person_lessons_learned: '',

    new_person_meeting_frequency: '',
    new_person_communication_preference: '',
    new_person_collaboration_areas: '',
    send_email_notification: false,
    show_email_checkbox: false,
  });

  // Türkçe karakterler için capitalize fonksiyonu
  const capitalizeTurkish = (str: string) => {
    if (!str) return str;
    const firstChar = str.charAt(0);
    const rest = str.slice(1);
    
    // Türkçe karakterler için özel mapping
    const turkishMap: { [key: string]: string } = {
      'i': 'İ', 'ı': 'I', 'ç': 'Ç', 'ğ': 'Ğ', 'ö': 'Ö', 'ş': 'Ş', 'ü': 'Ü'
    };
    
    const upperFirst = turkishMap[firstChar.toLowerCase()] || firstChar.toUpperCase();
    return upperFirst + rest.toLowerCase();
  };

  const updateFormData = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateCurrentStep = () => {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (currentStep === 0) {
      // Davet gönderen kişi bilgileri - sadece ad ve soyad zorunlu
      if (!formData.inviter_first_name.trim() || !formData.inviter_last_name.trim()) {
        alert('Lütfen ad ve soyad alanlarını doldurun!');
        return false;
      }
      
      // E-posta opsiyonel ama girilmişse geçerli olmalı
      if (formData.inviter_email.trim() && !emailRx.test(formData.inviter_email)) {
        alert('Lütfen geçerli bir e-posta adresi girin!');
        return false;
      }
      
      // Yeni kişi bilgileri - sadece ad ve soyad zorunlu
      if (!formData.new_person_first_name.trim() || !formData.new_person_last_name.trim()) {
        alert('Lütfen yeni kişi için ad ve soyad alanlarını doldurun!');
        return false;
      }
      
      // E-posta veya telefon alanlarından en az biri doldurulmalı
      if (!formData.new_person_email.trim() && !formData.new_person_phone.trim()) {
        alert('E-posta veya telefon alanlarından en az biri doldurulmalıdır!');
        return false;
      }
      
      // E-posta girilmişse geçerli olmalı
      if (formData.new_person_email.trim() && !emailRx.test(formData.new_person_email)) {
        alert('Lütfen geçerli bir e-posta adresi girin!');
        return false;
      }
    }
    
    if (currentStep === 1) {
      // Adım 2 - İş bilgileri: pozisyon ve şirket zorunlu
      if (!formData.new_person_position.trim() || !formData.new_person_company.trim()) {
        alert('Pozisyon ve şirket alanları zorunludur!');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === 0) {
      console.log('🔍 Sekme 0 - Kişi kontrolü başlıyor');
      const ok = await checkNewPersonExists();
      console.log('📊 Kişi kontrolü sonucu:', ok);
      if (!ok) {
        console.log('❌ Kişi zaten var, sekme 1\'e geçilemiyor');
        return; // Kişi zaten varsa diğer sekmeye geçme
      }
      console.log('✅ Kişi kontrolü başarılı, sekme 1\'e geçiliyor');
    }
    
    if (currentStep < totalSteps - 1) {
      console.log('🔄 Sekme değiştiriliyor:', currentStep, '->', currentStep + 1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const checkPersonExists = async () => {
    // Sadece ad ve soyad zorunlu
    if (!formData.inviter_first_name.trim() || !formData.inviter_last_name.trim()) {
      alert('Lütfen ad ve soyad alanlarını doldurun!');
      return;
    }
    
    // E-posta varsa geçerliliğini kontrol et
    if (formData.inviter_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.inviter_email.trim())) {
      alert('Lütfen geçerli bir e-posta adresi girin!');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 Adım 0 - Davet gönderen kişi kontrolü başlıyor');
      
      // Davet gönderen kişinin veritabanında olup olmadığını kontrol et
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-verify`;
      
      // E-posta varsa tüm alanları, yoksa sadece ad-soyad gönder
      const body: any = {
        first_name: formData.inviter_first_name.trim().charAt(0).toUpperCase() + formData.inviter_first_name.trim().slice(1).toLowerCase(),
        last_name: formData.inviter_last_name.trim().charAt(0).toUpperCase() + formData.inviter_last_name.trim().slice(1).toLowerCase(),
      };
      
      // E-posta varsa ekle
      if (formData.inviter_email.trim()) {
        body.email = formData.inviter_email.trim();
      }
      
      console.log('Davet gönderen kişi kontrolü için gönderilen parametreler:', body);
      console.log('JSON stringified body:', JSON.stringify(body));
      console.log('API URL:', supabaseUrl);
      
      const res = await fetch(supabaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        console.error('HTTP Error:', res.status, res.statusText);
        
        // Hata detaylarını oku
        try {
          const errorBody = await res.text();
          console.error('Error response body:', errorBody);
        } catch (e) {
          console.error('Could not read error response body');
        }
        
        throw new Error(`HTTP ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Davet gönderen kişi kontrolü API sonucu:', result);
      
      if (result.exists) {
        console.log('✅ Davet gönderen kişi zaten var, devam edilebilir');
        setIsContactVerified(true);
        setCurrentStep(0);
      } else {
        console.log('❌ Davet gönderen kişi veritabanında bulunamadı!');
        alert('Davet gönderen kişi (ad, soyad) contacts tablosunda bulunamadı. Lütfen önce bu kişiyi sisteme ekleyin.');
        return;
      }
    } catch (e) {
      console.error('Davet gönderen kişi kontrolü hatası:', e);
      alert('Kişi kontrolü sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const checkNewPersonExists = async () => {
    setLoading(true);
    try {
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-verify`;
      
      // E-posta boşsa body'den çıkar
      const body: any = {
        first_name: formData.new_person_first_name.trim(),
        last_name: formData.new_person_last_name.trim(),
      };
      
      // E-posta varsa ekle
      if (formData.new_person_email.trim()) {
        body.email = formData.new_person_email.trim();
      }
      
      console.log('Yeni kişi kontrolü için gönderilen parametreler:', body);
      
      const res = await fetch(supabaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        console.error('HTTP Error:', res.status, res.statusText);
        
        // Hata detaylarını oku
        try {
          const errorBody = await res.text();
          console.error('Error response body:', errorBody);
        } catch (e) {
          console.error('Could not read error response body');
        }
        
        throw new Error(`HTTP ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Kişi kontrolü API sonucu (JSON):', JSON.stringify(result, null, 2));
      console.log('Result exists:', result.exists);
      console.log('Result message:', result.message);
      console.log('Result type:', typeof result.exists);
      console.log('Result keys:', Object.keys(result));
      
      if (result.exists === true) {
        console.log('❌ Kişi zaten var!');
        alert('Bu kişi (ad, soyad) zaten contacts tablosunda mevcut!');
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
    console.log('handleSave çağrıldı, currentStep:', currentStep, 'totalSteps:', totalSteps);
    
    // Validation: Ad ve soyad zorunlu
    if (!formData.new_person_first_name.trim() || !formData.new_person_last_name.trim()) {
      alert('Ad ve soyad alanları zorunludur!');
      return;
    }
    
    // Validation: E-posta veya telefon alanlarından en az biri doldurulmalı
    if (!formData.new_person_email.trim() && !formData.new_person_phone.trim()) {
      alert('E-posta veya telefon alanlarından en az biri doldurulmalıdır!');
      return;
    }
    
    // E-posta onayı zaten e-posta girildiğinde alındı
    console.log('E-posta onay durumu:', formData.send_email_notification);
    
    setLoading(true);
    try {
      const supabaseUrl = `${SUPABASE_URL}/functions/v1/invite-submit`;
      
      // Map form data to database schema
      const newPersonData = {
        first_name: formData.new_person_first_name.trim(),
        last_name: formData.new_person_last_name.trim(),
        age: formData.new_person_age ? parseInt(formData.new_person_age) : null,
        city: formData.new_person_birthplace.trim(),
        current_city: formData.new_person_current_city.trim(),
        email: formData.new_person_email.trim(),
        phone: formData.new_person_phone.trim(),
        university: formData.new_person_university.trim(),
        degree: formData.new_person_degree.trim(),
        graduation_year: formData.new_person_graduation_year ? parseInt(formData.new_person_graduation_year) : null,
        position: formData.new_person_position.trim(),
        company: formData.new_person_company.trim(),
        expertise: formData.new_person_expertise.join(', '),
        services: formData.new_person_services.join(', '),
        sectors: formData.new_person_sectors.join(', '),
        languages: formData.new_person_languages.join(', '),
        mentor_service: formData.new_person_mentor,
        social_volunteer: formData.new_person_volunteer_experience.trim(),
        life_experience: formData.new_person_turning_points.trim(),
        challenges: formData.new_person_challenges.trim(),
        lessons: formData.new_person_lessons_learned.trim(),
        future_goals: formData.new_person_goals.trim(),
        investment_interest: !!formData.new_person_investments,
        collaboration_areas: formData.new_person_collaboration_areas.trim(),
        summary: formData.new_person_description.trim(),
        vision: formData.new_person_vision.trim(),
        closeness: formData.new_person_proximity_level,
      };
      
      // E-posta boşsa hiç gönderme
      const inviterData: any = {
        first_name: formData.inviter_first_name.trim(),
        last_name: formData.inviter_last_name.trim(),
      };
      
      // E-posta varsa ekle
      if (formData.inviter_email.trim()) {
        inviterData.email = formData.inviter_email.trim();
      }
      
      console.log('Inviter data:', inviterData)
      console.log('Inviter email field exists:', 'email' in inviterData)
      console.log('Inviter email value:', inviterData.email)
      console.log('Inviter data keys:', Object.keys(inviterData))
      
      console.log('Sending data to API:', {
        inviter: inviterData,
        new_person: newPersonData,
        custom_data: {
          expertise: formData.custom_expertise,
          services: formData.custom_services,
          sectors: formData.custom_sectors,
          languages: formData.custom_languages
        },
        send_email_notification: formData.send_email_notification,
      });
      
      // Debug için custom verileri detaylı logla
      console.log('Custom expertise details:', formData.custom_expertise);
      console.log('Custom services details:', formData.custom_services);
      console.log('Custom sectors details:', formData.custom_sectors);
      console.log('Custom languages details:', formData.custom_languages);
      
      // Custom verilerin son durumunu kontrol et
      console.log('Final new_person_expertise:', formData.new_person_expertise);
      console.log('Final new_person_services:', formData.new_person_services);
      console.log('Final new_person_sectors:', formData.new_person_sectors);
      console.log('Final new_person_languages:', formData.new_person_languages);
      
      const res = await fetch(supabaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          inviter: inviterData,
          new_person: newPersonData,
          custom_data: {
            expertise: formData.custom_expertise,
            services: formData.custom_services,
            sectors: formData.custom_sectors,
            languages: formData.custom_languages
          },
          send_email_notification: formData.send_email_notification,
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      if (result.success) {
        setPopupMessage('Kişi başarıyla eklendi! 🎉');
        setShowSuccessPopup(true);
        
        // 3 saniye sonra popup'ı kapat ve sayfayı yenile
        setTimeout(() => {
          setShowSuccessPopup(false);
          window.location.reload();
        }, 3000);
      } else {
        setPopupMessage('Bir hata oluştu: ' + result.error);
        setShowSuccessPopup(true);
        
        // 3 saniye sonra popup'ı kapat
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } catch (e) {
      console.error('Save error:', e);
      setPopupMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setShowSuccessPopup(true);
      
      // 3 saniye sonra popup'ı kapat
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Dropdown verileri (özgün dosyandan aynen) ---------- */
  const expertiseOptions: DropdownOption[] = [
    { id: 'frontend', name: 'Frontend Development', emoji: '💻' },
    { id: 'backend', name: 'Backend Development', emoji: '⚙️' },
    { id: 'mobile', name: 'Mobile Development', emoji: '📱' },
    { id: 'fullstack', name: 'Full Stack Development', emoji: '��' },
    { id: 'devops', name: 'DevOps', emoji: '🔧' },
    { id: 'data_science', name: 'Data Science', emoji: '📊' },
    { id: 'ai_ml', name: 'AI/Machine Learning', emoji: '🤖' },
    { id: 'ui_ux', name: 'UI/UX Tasarım', emoji: '🎨' },
    { id: 'product_management', name: 'Product Management', emoji: '📋' },
    { id: 'project_management', name: 'Proje Yönetimi', emoji: '📈' },
    { id: 'digital_marketing', name: 'Dijital Pazarlama', emoji: '📱' },
    { id: 'content_marketing', name: 'İçerik Pazarlaması', emoji: '✍️' },
    { id: 'seo', name: 'SEO/SEM', emoji: '🔍' },
    { id: 'sales', name: 'Satış', emoji: '💼' },
    { id: 'business_development', name: 'İş Geliştirme', emoji: '🚀' },
    { id: 'hr', name: 'İnsan Kaynakları', emoji: '👥' },
    { id: 'finance', name: 'Finans', emoji: '💰' },
    { id: 'accounting', name: 'Muhasebe', emoji: '📊' },
    { id: 'legal', name: 'Hukuk', emoji: '⚖️' },
    { id: 'consulting', name: 'Danışmanlık', emoji: '💡' },
    { id: 'research', name: 'Araştırma', emoji: '🔬' },
    { id: 'writing', name: 'Yazım/Editörlük', emoji: '✒️' },
    { id: 'translation', name: 'Çeviri', emoji: '🌍' },
    { id: 'photography', name: 'Fotoğrafçılık', emoji: '📸' },
    { id: 'videography', name: 'Videografi', emoji: '🎬' },
    { id: 'graphic_design', name: 'Grafik Tasarım', emoji: '🎨' },
    { id: 'architecture', name: 'Mimarlık', emoji: '🏗️' },
    { id: 'engineering', name: 'Mühendislik', emoji: '⚙️' },
    { id: 'teaching', name: 'Öğretmenlik/Eğitim', emoji: '👩‍🏫' },
    { id: 'other', name: 'Diğer', emoji: '➕' },
  ];

const sectorsOptions: DropdownOption[] = [
  { id: 'technology', name: 'Teknoloji', emoji: '💻' },
  { id: 'finance', name: 'Finans', emoji: '💰' },
  { id: 'healthcare', name: 'Sağlık', emoji: '🏥' },
  { id: 'education', name: 'Eğitim', emoji: '🎓' },
  { id: 'marketing', name: 'Pazarlama', emoji: '📊' },
  { id: 'design', name: 'Tasarım', emoji: '🎨' },
  { id: 'engineering', name: 'Mühendislik', emoji: '⚙️' },
  { id: 'law', name: 'Hukuk', emoji: '⚖️' },
  { id: 'consulting', name: 'Danışmanlık', emoji: '💡' },
  { id: 'retail', name: 'Perakende', emoji: '🛍️' },
  { id: 'manufacturing', name: 'İmalat', emoji: '🏭' },
  { id: 'construction', name: 'İnşaat', emoji: '🏗️' },
  { id: 'real_estate', name: 'Emlak', emoji: '🏠' },
  { id: 'tourism', name: 'Turizm', emoji: '✈️' },
  { id: 'food', name: 'Gıda', emoji: '🍽️' },
  { id: 'automotive', name: 'Otomotiv', emoji: '🚗' },
  { id: 'energy', name: 'Enerji', emoji: '⚡' },
  { id: 'telecommunications', name: 'Telekomünikasyon', emoji: '📡' },
  { id: 'media', name: 'Medya', emoji: '📺' },
  { id: 'logistics', name: 'Lojistik', emoji: '🚚' },
  { id: 'agriculture', name: 'Tarım', emoji: '🌾' },
  { id: 'sports', name: 'Spor', emoji: '⚽' },
  { id: 'entertainment', name: 'Eğlence', emoji: '🎭' },
  { id: 'other', name: 'Diğer', emoji: '➕' },
];

const servicesOptions: DropdownOption[] = [
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
  { id: 'polish', name: 'Lehçe', emoji: '🇵🇱' },
  { id: 'czech', name: 'Çekçe', emoji: '🇨🇿' },
  { id: 'hungarian', name: 'Macarca', emoji: '🇭🇺' },
  { id: 'greek', name: 'Yunanca', emoji: '🇬🇷' },
  { id: 'hebrew', name: 'İbranice', emoji: '🇮🇱' },
  { id: 'hindi', name: 'Hintçe', emoji: '🇮🇳' },
  { id: 'urdu', name: 'Urduca', emoji: '🇵🇰' },
  { id: 'bengali', name: 'Bengalce', emoji: '🇧🇩' },
  { id: 'thai', name: 'Tayca', emoji: '🇹🇭' },
  { id: 'vietnamese', name: 'Vietnamca', emoji: '🇻🇳' },
  { id: 'indonesian', name: 'Endonezce', emoji: '🇮🇩' },
  { id: 'malay', name: 'Malayca', emoji: '🇲🇾' },
  { id: 'filipino', name: 'Filipince', emoji: '🇵🇭' },
  { id: 'other', name: 'Diğer', emoji: '➕' },
];

  // Kişisel özellikler seçenekleri
  const personalTraitsOptions: DropdownOption[] = [
    { id: 'honesty', name: 'Dürüstlük', emoji: '💙' },
    { id: 'reliability', name: 'Güvenilirlik', emoji: '🟢' },
    { id: 'diligence', name: 'Çalışkanlık', emoji: '💪' },
    { id: 'leadership', name: 'Liderlik', emoji: '🤝' },
    { id: 'creativity', name: 'Yaratıcılık', emoji: '🎨' },
    { id: 'communication', name: 'İletişim Becerisi', emoji: '📞' },
    { id: 'adaptability', name: 'Uyum Yeteneği', emoji: '✨' },
    { id: 'discipline', name: 'Disiplin', emoji: '💼' },
    { id: 'patience', name: 'Sabırlılık', emoji: '🎯' },
    { id: 'teamwork', name: 'Takım Çalışması', emoji: '💛' },
  ];

  // Değer verdiği prensipler seçenekleri
  const valuesOptions: DropdownOption[] = [
    { id: 'ethics', name: 'Etik', emoji: '🤝' },
    { id: 'sustainability', name: 'Sürdürülebilirlik', emoji: '🌟' },
    { id: 'quality', name: 'Kalite', emoji: '⭐' },
    { id: 'innovation', name: 'İnovasyon', emoji: '💡' },
    { id: 'transparency', name: 'Şeffaflık', emoji: '⚖️' },
    { id: 'empathy', name: 'Empati', emoji: '❤️' },
    { id: 'continuous_learning', name: 'Sürekli Öğrenme', emoji: '🔥' },
    { id: 'justice', name: 'Adalet', emoji: '💖' },
  ];

  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [sectorsDropdownOpen, setSectorsDropdownOpen] = useState(false);
  const [languagesDropdownOpen, setLanguagesDropdownOpen] = useState(false);
  // const [personalTraitsDropdownOpen, setPersonalTraitsDropdownOpen] = useState(false);
  // const [valuesDropdownOpen, setValuesDropdownOpen] = useState(false);

  const toggleExpertiseDropdown = () => setExpertiseDropdownOpen((s) => !s);
  const toggleServicesDropdown = () => setServicesDropdownOpen((s) => !s);
  const toggleSectorsDropdown = () => setSectorsDropdownOpen((s) => !s);
  const toggleLanguagesDropdown = () => setLanguagesDropdownOpen((s) => !s);
  // const togglePersonalTraitsDropdown = () => setPersonalTraitsDropdownOpen((s) => !s);
  // const toggleValuesDropdown = () => setValuesDropdownOpen((s) => !s);

  const handleExpertiseSelect = (option: DropdownOption) => {
    if (option.id === 'other') {
      // Diğer seçildiğinde dropdown'ı kapat ve textarea'yı göster
      setExpertiseDropdownOpen(false);
      updateFormData('show_expertise_other', true);
      return;
    }
    
    const arr = formData.new_person_expertise.includes(option.id)
      ? formData.new_person_expertise.filter((id) => id !== option.id)
      : [...formData.new_person_expertise, option.id];
    updateFormData('new_person_expertise', arr);
    
    // Dropdown'ı açık tut - sadece "Diğer" seçildiğinde kapat
  };

  const handleSectorsSelect = (option: DropdownOption) => {
    if (option.id === 'other') {
      // Diğer seçildiğinde dropdown'ı kapat ve textarea'yı göster
      setSectorsDropdownOpen(false);
      updateFormData('show_sectors_other', true);
      return;
    }
    
    const arr = formData.new_person_sectors.includes(option.id)
      ? formData.new_person_sectors.filter((id) => id !== option.id)
      : [...formData.new_person_sectors, option.id];
    updateFormData('new_person_sectors', arr);
    
    // Dropdown'ı açık tut - sadece "Diğer" seçildiğinde kapat
  };
  const handleServicesSelect = (option: DropdownOption) => {
    if (option.id === 'other') {
      // Diğer seçildiğinde dropdown'ı kapat ve textarea'yı göster
      setServicesDropdownOpen(false);
      updateFormData('show_services_other', true);
      return;
    }
    
    const arr = formData.new_person_services.includes(option.id)
      ? formData.new_person_services.filter((id) => id !== option.id)
      : [...formData.new_person_services, option.id];
    updateFormData('new_person_services', arr);
    
    // Dropdown'ı açık tut - sadece "Diğer" seçildiğinde kapat
  };
  const handleLanguagesSelect = (option: DropdownOption) => {
    if (option.id === 'other') {
      // Diğer seçildiğinde dropdown'ı kapat ve textarea'yı göster
      setLanguagesDropdownOpen(false);
      updateFormData('show_languages_other', true);
      return;
    }
    
    const arr = formData.new_person_languages.includes(option.id)
      ? formData.new_person_languages.filter((id) => id !== option.id)
      : [...formData.new_person_languages, option.id];
    updateFormData('new_person_languages', arr);
    
    // Dropdown'ı açık tut - sadece "Diğer" seçildiğinde kapat
  };

  // const handlePersonalTraitsSelect = (option: DropdownOption) => {
  //   const arr = formData.new_person_personal_traits.includes(option.id)
  //     ? formData.new_person_personal_traits.filter((id) => id !== option.id)
  //     : [...formData.new_person_personal_traits, option.id];
  //   updateFormData('new_person_personal_traits', arr);
  // };

  // const handleValuesSelect = (option: DropdownOption) => {
  //   const arr = formData.new_person_values.includes(option.id)
  //     ? formData.new_person_values.filter((id) => id !== option.id)
  //     : [...formData.new_person_values, option.id];
  //   updateFormData('new_person_values', arr);
  // };

  const removeExpertise = (id: string) => {
    // Uzmanlık listesinden kaldır
    updateFormData('new_person_expertise', formData.new_person_expertise.filter((x) => x !== id));
    
    // Eğer custom uzmanlık ise, custom_expertise'dan da kaldır
    if (id.startsWith('custom_')) {
      updateFormData('custom_expertise', formData.custom_expertise.filter((ce) => ce.id !== id));
    }
  };
  const removeSectors = (id: string) => {
    // Sektörler listesinden kaldır
    updateFormData('new_person_sectors', formData.new_person_sectors.filter((x) => x !== id));
    
    // Eğer custom sektör ise, custom_sectors'dan da kaldır
    if (id.startsWith('custom_')) {
      updateFormData('custom_sectors', formData.custom_sectors.filter((cs) => cs.id !== id));
    }
  };
  
  // Diğer seçenekleri ekleme fonksiyonları
  const addSectorsOther = () => {
    if (formData.new_person_sectors_other.trim()) {
      const customId = `custom_${Date.now()}`;
      const customName = formData.new_person_sectors_other.trim();
      
      // Custom sektörü custom_sectors array'ine ekle
      const newCustomSectors = [...formData.custom_sectors, { id: customId, name: customName }];
      updateFormData('custom_sectors', newCustomSectors);
      
      // Sektörler listesine custom ID'yi ekle
      const arr = [...formData.new_person_sectors, customId];
      updateFormData('new_person_sectors', arr);
      
      // Form'u temizle
      updateFormData('new_person_sectors_other', '');
      updateFormData('show_sectors_other', false);
    }
  };

  const addExpertiseOther = () => {
    if (formData.new_person_expertise_other.trim()) {
      const customId = `custom_${Date.now()}`;
      const customName = formData.new_person_expertise_other.trim();
      
      console.log('Adding custom expertise:', { id: customId, name: customName });
      
      // Custom uzmanlığı custom_expertise array'ine ekle
      const newCustomExpertise = [...formData.custom_expertise, { id: customId, name: customName }];
      updateFormData('custom_expertise', newCustomExpertise);
      
      // Uzmanlık listesine custom ID'yi ekle
      const arr = [...formData.new_person_expertise, customId];
      updateFormData('new_person_expertise', arr);
      
      console.log('Updated custom_expertise:', newCustomExpertise);
      console.log('Updated new_person_expertise:', arr);
      
      // Form'u temizle
      updateFormData('new_person_expertise_other', '');
      updateFormData('show_expertise_other', false);
    }
  };

  const addServicesOther = () => {
    if (formData.new_person_services_other.trim()) {
      const customId = `custom_${Date.now()}`;
      const customName = formData.new_person_services_other.trim();
      
      // Custom hizmeti custom_services array'ine ekle
      const newCustomServices = [...formData.custom_services, { id: customId, name: customName }];
      updateFormData('custom_services', newCustomServices);
      
      // Hizmetler listesine custom ID'yi ekle
      const arr = [...formData.new_person_services, customId];
      updateFormData('new_person_services', arr);
      
      // Form'u temizle
      updateFormData('new_person_services_other', '');
      updateFormData('show_services_other', false);
    }
  };

  const addLanguagesOther = () => {
    if (formData.new_person_languages_other.trim()) {
      const customId = `custom_${Date.now()}`;
      const customName = formData.new_person_languages_other.trim();
      
      // Custom dili custom_languages array'ine ekle
      const newCustomLanguages = [...formData.custom_languages, { id: customId, name: customName }];
      updateFormData('custom_languages', newCustomLanguages);
      
      // Diller listesine custom ID'yi ekle
      const arr = [...formData.new_person_languages, customId];
      updateFormData('new_person_languages', arr);
      
      // Form'u temizle
      updateFormData('new_person_languages_other', '');
      updateFormData('show_languages_other', false);
    }
  };

  // const removeService = (id: string) =>
  //   updateFormData('new_person_services', formData.new_person_services.filter((x) => x !== id));
  const removeServices = (id: string) => {
    // Hizmetler listesinden kaldır
    updateFormData('new_person_services', formData.new_person_services.filter((x) => x !== id));
    
    // Eğer custom hizmet ise, custom_services'dan da kaldır
    if (id.startsWith('custom_')) {
      updateFormData('custom_services', formData.custom_services.filter((cs) => cs.id !== id));
    }
  };
  const removeLanguage = (id: string) => {
    // Diller listesinden kaldır
    updateFormData('new_person_languages', formData.new_person_languages.filter((x) => x !== id));
    
    // Eğer custom dil ise, custom_languages'dan da kaldır
    if (id.startsWith('custom_')) {
      updateFormData('custom_languages', formData.custom_languages.filter((cl) => cl.id !== id));
    }
  };

  // const removePersonalTrait = (id: string) =>
  //   updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter((x) => x !== id));

  // const removeValue = (id: string) =>
  //   updateFormData('new_person_values', formData.new_person_values.filter((x) => x !== id));

  const getSelectedExpertiseNames = () =>
    formData.new_person_expertise
      .filter(id => !id.startsWith('custom_')) // Custom ID'leri filtrele
      .map((id) => {
        // Önce normal options'ta ara
        const option = expertiseOptions.find((o) => o.id === id);
        if (option) return option.name;
        return id;
      });
      
  const getSelectedSectorsNames = () =>
    formData.new_person_sectors
      .filter(id => !id.startsWith('custom_')) // Custom ID'leri filtrele
      .map((id) => {
        // Önce normal options'ta ara
        const option = sectorsOptions.find((o) => o.id === id);
        if (option) return option.name;
        return id;
      });
    
  const getSelectedServicesNames = () =>
    formData.new_person_services
      .filter(id => !id.startsWith('custom_')) // Custom ID'leri filtrele
      .map((id) => {
        // Önce normal options'ta ara
        const option = servicesOptions.find((o) => o.id === id);
        if (option) return option.name;
        return id;
      });
      
  const getSelectedLanguagesNames = () =>
    formData.new_person_languages
      .filter(id => !id.startsWith('custom_')) // Custom ID'leri filtrele
      .map((id) => {
        // Önce normal options'ta ara
        const option = languageOptions.find((o) => o.id === id);
        if (option) return option.name;
        return id;
      });

  // const getSelectedPersonalTraitsNames = () =>
  //   formData.new_person_personal_traits.map((id) => personalTraitsOptions.find((o) => o.id === id)?.name || id);

  // const getSelectedValuesNames = () =>
  //   formData.new_person_values.map((id) => valuesOptions.find((o) => o.id === id)?.name || id);

  // Custom verileri ayrı olarak göster
  const getCustomExpertiseNames = () =>
    formData.custom_expertise.map(item => item.name);
    
  const getCustomSectorsNames = () =>
    formData.custom_sectors.map(item => item.name);
    
  const getCustomServicesNames = () =>
    formData.custom_services.map(item => item.name);
    
  const getCustomLanguagesNames = () =>
    formData.custom_languages.map(item => item.name);

  /** ---------- Step içerikleri (veri tarafına dokunmadan) ---------- */
  const stepClass = (i: number) => (stepAnimations[i] ? 'step-content animated' : 'step-content');

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={stepClass(0)}>
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad <span className="required">*</span></label>
                  <input value={formData.new_person_first_name} onChange={(e) => updateFormData('new_person_first_name', capitalizeTurkish(e.target.value))} placeholder="Ad" required />
                </div>
                <div className="form-group">
                  <label>Soyad <span className="required">*</span></label>
                  <input value={formData.new_person_last_name} onChange={(e) => updateFormData('new_person_last_name', capitalizeTurkish(e.target.value))} placeholder="Soyad" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Yaş</label>
                  <input type="number" value={formData.new_person_age} onChange={(e) => updateFormData('new_person_age', e.target.value)} placeholder="25" />
                </div>
                <div className="form-group">
                  <label>Nereli</label>
                  <input value={formData.new_person_birthplace} onChange={(e) => updateFormData('new_person_birthplace', capitalizeTurkish(e.target.value))} placeholder="İstanbul" />
                </div>
              </div>

              <div className="form-group">
                <label>Şu anki Şehir</label>
                <input value={formData.new_person_current_city} onChange={(e) => updateFormData('new_person_current_city', capitalizeTurkish(e.target.value))} placeholder="İstanbul" />
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
                  <span>1 (Uzak)</span>
                  <span>Seviye: {formData.new_person_proximity_level}</span>
                  <span>10 (Yakın)</span>
                </div>
              </div>

              <h4>📞 İletişim Bilgileri</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>E-posta</label>
                  <input 
                    type="email" 
                    value={formData.new_person_email} 
                    onChange={(e) => {
                      const email = e.target.value;
                      updateFormData('new_person_email', email);
                      
                      // E-posta validation
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (email.trim() && emailRegex.test(email)) {
                        // Geçerli e-posta girildiğinde checkbox'ı göster
                        updateFormData('show_email_checkbox', true);
                      } else {
                        // Geçersiz e-posta veya boş ise checkbox'ı gizle
                        updateFormData('show_email_checkbox', false);
                        updateFormData('send_email_notification', false);
                      }
                    }} 
                    placeholder="e-posta@ornek.com" 
                  />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input type="tel" value={formData.new_person_phone} onChange={(e) => updateFormData('new_person_phone', e.target.value)} placeholder="+90 555 123 45 67" />
                </div>
              </div>
              <div className="form-group">
                <label style={{color: '#8c8ca1', fontSize: '0.85rem'}}>📧 E-posta ve telefon alanlarından en az biri doldurulmalıdır (zorunlu)</label>
              </div>
              
              {/* E-posta checkbox'ı - sadece geçerli e-posta girildiğinde göster */}
              {formData.show_email_checkbox && (
                <div className="form-group">
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="send_email_checkbox"
                      checked={formData.send_email_notification}
                      onChange={(e) => updateFormData('send_email_notification', e.target.checked)}
                    />
                    <label htmlFor="send_email_checkbox">
                      Bu kişiye bilgilendirme e-postası göndermek ister misiniz?
                    </label>
                  </div>
                </div>
              )}

              <h4>🎓 Eğitim Geçmişi</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Üniversite</label>
                  <input value={formData.new_person_university} onChange={(e) => updateFormData('new_person_university', capitalizeTurkish(e.target.value))} placeholder="Boğaziçi Üniversitesi" />
                </div>
                <div className="form-group">
                  <label>Bölüm</label>
                  <input value={formData.new_person_department} onChange={(e) => updateFormData('new_person_department', capitalizeTurkish(e.target.value))} placeholder="Bilgisayar Mühendisliği" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Derece</label>
                  <input value={formData.new_person_degree} onChange={(e) => updateFormData('new_person_degree', capitalizeTurkish(e.target.value))} placeholder="Lisans" />
                </div>
                <div className="form-group">
                  <label>Mezuniyet Yılı</label>
                  <input type="number" value={formData.new_person_graduation_year} onChange={(e) => updateFormData('new_person_graduation_year', e.target.value)} placeholder="2020" />
                </div>
              </div>

              {/* Kısa Açıklama alanı kaldırıldı - istenen alanlarda yok */}
            </div>
          </div>
        );

      case 1:
        return (
          <div className={stepClass(1)}>
            <div className="form-section">
              <h3>💼 İş ve Profesyonel Bilgiler</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Pozisyon <span className="required">*</span></label>
                  <input value={formData.new_person_position} onChange={(e) => updateFormData('new_person_position', capitalizeTurkish(e.target.value))} placeholder="Yazılım Geliştirici" required />
                </div>
                <div className="form-group">
                  <label>Şirket <span className="required">*</span></label>
                  <input value={formData.new_person_company} onChange={(e) => updateFormData('new_person_company', capitalizeTurkish(e.target.value))} placeholder="Tech Company" required />
                </div>
              </div>

              <div className="form-group">
                <label>Sektörler</label>
                <div className="dropdown-container">
                  <button className={`dropdown-button ${sectorsDropdownOpen ? 'open' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    toggleSectorsDropdown();
                  }}>
                    <span>Sektörler seçin</span>
                    <span>▼</span>
                  </button>
                  {sectorsDropdownOpen && (
                    <div className="dropdown-list">
                      {sectorsOptions.map((o) => (
                        <div key={o.id} className={`dropdown-item ${formData.new_person_sectors.includes(o.id) ? 'selected' : ''}`} onClick={() => handleSectorsSelect(o)}>
                          <span className="dropdown-item-emoji">{o.emoji}</span>
                          <span className="dropdown-item-text">{o.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.new_person_sectors.length > 0 && (
                  <div className="selected-items">
                    {getSelectedSectorsNames().map((name, i) => (
                      <div key={i} className="selected-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => removeSectors(formData.new_person_sectors[i])}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Custom verileri ayrı olarak göster */}
                {formData.custom_sectors.length > 0 && (
                  <div className="selected-items custom-items">
                    <div className="custom-label">Özel Sektör:</div>
                    {getCustomSectorsNames().map((name, i) => (
                      <div key={i} className="selected-item custom-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => {
                          const customId = formData.custom_sectors[i].id;
                          removeSectors(customId);
                        }}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Diğer seçeneği için textarea */}
                {formData.show_sectors_other && (
                  <div className="other-input-container">
                    <textarea
                      value={formData.new_person_sectors_other}
                      onChange={(e) => updateFormData('new_person_sectors_other', e.target.value)}
                      placeholder="Sektör adını yazın..."
                      className="other-textarea"
                    />
                    <button 
                      type="button" 
                      onClick={addSectorsOther}
                      className="add-other-btn"
                      disabled={!formData.new_person_sectors_other.trim()}
                    >
                      Ekle
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Uzmanlık Alanları</label>
                <div className="dropdown-container">
                  <button className={`dropdown-button ${expertiseDropdownOpen ? 'open' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    toggleExpertiseDropdown();
                  }}>
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
                
                {/* Custom verileri ayrı olarak göster */}
                {formData.custom_expertise.length > 0 && (
                  <div className="selected-items custom-items">
                    <div className="custom-label">Özel Uzmanlık:</div>
                    {getCustomExpertiseNames().map((name, i) => (
                      <div key={i} className="selected-item custom-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => {
                          const customId = formData.custom_expertise[i].id;
                          removeExpertise(customId);
                        }}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Diğer seçeneği için textarea */}
                {formData.show_expertise_other && (
                  <div className="other-input-container">
                    <textarea
                      value={formData.new_person_expertise_other}
                      onChange={(e) => updateFormData('new_person_expertise_other', e.target.value)}
                      placeholder="Uzmanlık alanını yazın..."
                      className="other-textarea"
                    />
                    <button 
                      type="button" 
                      onClick={addExpertiseOther}
                      className="add-other-btn"
                      disabled={!formData.new_person_expertise_other.trim()}
                    >
                      Ekle
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Verebileceği Hizmetler</label>
                <div className="dropdown-container">
                  <button className={`dropdown-button ${servicesDropdownOpen ? 'open' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    toggleServicesDropdown();
                  }}>
                    <span>Hizmetler seçin</span>
                    <span>▼</span>
                  </button>
                  {servicesDropdownOpen && (
                    <div className="dropdown-list">
                      {servicesOptions.map((o) => (
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
                        <span className="remove-item" onClick={() => removeServices(formData.new_person_services[i])}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Custom verileri ayrı olarak göster */}
                {formData.custom_services.length > 0 && (
                  <div className="selected-items custom-items">
                    <div className="custom-label">Özel Hizmet:</div>
                    {getCustomServicesNames().map((name, i) => (
                      <div key={i} className="selected-item custom-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => {
                          const customId = formData.custom_services[i].id;
                          removeServices(customId);
                        }}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Diğer seçeneği için textarea */}
                {formData.show_services_other && (
                  <div className="other-input-container">
                    <textarea
                      value={formData.new_person_services_other}
                      onChange={(e) => updateFormData('new_person_services_other', e.target.value)}
                      placeholder="Hizmet adını yazın..."
                      className="other-textarea"
                    />
                    <button 
                      type="button" 
                      onClick={addServicesOther}
                      className="add-other-btn"
                      disabled={!formData.new_person_services_other.trim()}
                    >
                      Ekle
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>İş Deneyimi (Kısa Notlar)</label>
                <textarea value={formData.new_person_work_experience} onChange={(e) => updateFormData('new_person_work_experience', e.target.value)} placeholder="İş deneyimi hakkında kısa notlar..." rows={3} />
              </div>

              {/* Sunabileceği Hizmetler ve Yatırım Alanları kısımları kaldırıldı */}
            </div>
          </div>
        );

      case 2: // Adım 3: Kişisel Özellikler
        return (
          <div className={stepClass(2)}>
            <div className="form-section">
              <div className="form-group">
                <label>⭐ Kişisel Özellikler</label>
                <div className="trait-buttons-grid">
                  {personalTraitsOptions.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`trait-button ${formData.new_person_personal_traits.includes(o.id) ? 'selected' : ''}`}
                      onClick={() => {
                        if (formData.new_person_personal_traits.includes(o.id)) {
                          updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(id => id !== o.id));
                        } else {
                          updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, o.id]);
                        }
                      }}
                    >
                      <span className="trait-emoji">{o.emoji}</span>
                      <span className="trait-text">{o.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>💎 Değer Verdiği Prensipler</label>
                <div className="values-buttons-grid">
                  {valuesOptions.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`trait-button ${formData.new_person_values.includes(o.id) ? 'selected' : ''}`}
                      onClick={() => {
                        if (formData.new_person_values.includes(o.id)) {
                          updateFormData('new_person_values', formData.new_person_values.filter(id => id !== o.id));
                        } else {
                          updateFormData('new_person_values', [...formData.new_person_values, o.id]);
                        }
                      }}
                    >
                      <span className="trait-emoji">{o.emoji}</span>
                      <span className="trait-text">{o.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>🎯 Hedefleri</label>
                <textarea value={formData.new_person_goals} onChange={(e) => updateFormData('new_person_goals', e.target.value)} placeholder="Kişisel hedefleri..." rows={3} />
              </div>

              <div className="form-group">
                <label>💎 Vizyonu</label>
                <textarea value={formData.new_person_vision} onChange={(e) => updateFormData('new_person_vision', e.target.value)} placeholder="Kişisel vizyonu ve misyonu..." rows={3} />
              </div>
            </div>
          </div>
        );

      case 3: // Adım 4: Sosyal ve Networking
        return (
          <div className={stepClass(3)}>
            <div className="form-section">
              <div className="form-group">
                <label>🌍 Konuştuğu Diller</label>
                <div className="dropdown-container">
                  <button className={`dropdown-button ${languagesDropdownOpen ? 'open' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    toggleLanguagesDropdown();
                  }}>
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
                
                {/* Custom verileri ayrı olarak göster */}
                {formData.custom_languages.length > 0 && (
                  <div className="selected-items custom-items">
                    <div className="custom-label">Özel Dil:</div>
                    {getCustomLanguagesNames().map((name, i) => (
                      <div key={i} className="selected-item custom-item">
                        <span>{name}</span>
                        <span className="remove-item" onClick={() => {
                          const customId = formData.custom_languages[i].id;
                          removeLanguage(customId);
                        }}>
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Diğer seçeneği için textarea */}
                {formData.show_languages_other && (
                  <div className="other-input-container">
                    <textarea
                      value={formData.new_person_languages_other}
                      onChange={(e) => updateFormData('new_person_languages_other', e.target.value)}
                      placeholder="Dil adını yazın..."
                      className="other-textarea"
                    />
                    <button 
                      type="button" 
                      onClick={addLanguagesOther}
                      className="add-other-btn"
                      disabled={!formData.new_person_languages_other.trim()}
                    >
                      Ekle
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>🤝 Gönüllülük Deneyimi</label>
                <textarea value={formData.new_person_volunteer_experience} onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)} placeholder="Gönüllülük deneyimleri..." rows={3} />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.new_person_mentor}
                    onChange={(e) => updateFormData('new_person_mentor', e.target.checked)}
                  />
                  <span className="checkbox-text">🎓 Mentor olarak hizmet veriyor</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={stepClass(4)}>
            <div className="form-section">
              <h3>🏆 Kritik Yaşam Deneyimleri</h3>
              
              <div className="form-group">
                <label>🌍 Hayatındaki Dönüm Noktaları</label>
                <textarea 
                  value={formData.new_person_turning_points} 
                  onChange={(e) => updateFormData('new_person_turning_points', e.target.value)} 
                  placeholder="Şirket kurma, iş değiştirme, ülke değiştirme gibi dönüm noktaları..." 
                  rows={3} 
                />
              </div>
              
              <div className="form-group">
                <label>⚠️ Karşılaştığı Büyük Zorluklar</label>
                <textarea 
                  value={formData.new_person_challenges} 
                  onChange={(e) => updateFormData('new_person_challenges', e.target.value)} 
                  placeholder="Karşılaştığı zorluklar ve nasıl aştığı..." 
                  rows={3} 
                />
              </div>
              
              <div className="form-group">
                <label>📚 Öğrendiği En Büyük Dersler</label>
                <textarea 
                  value={formData.new_person_lessons_learned} 
                  onChange={(e) => updateFormData('new_person_lessons_learned', e.target.value)} 
                  placeholder="Hayattan öğrendiği en önemli dersler..." 
                  rows={3} 
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className={stepClass(5)}>
            <div className="form-section">
              <h3>🚀 İleriye Dönük Planlar</h3>
              
              <div className="form-group">
                <label>🎯 5-10 Yıllık Hedefleri</label>
                <textarea 
                  value={formData.new_person_goals} 
                  onChange={(e) => updateFormData('new_person_goals', e.target.value)} 
                  placeholder="Gelecek planları ve hedefleri..." 
                  rows={3} 
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!formData.new_person_investments}
                    onChange={(e) => updateFormData('new_person_investments', e.target.checked ? 'Yatırım yapma / ortaklık kurma isteği var' : '')}
                  />
                  <span className="checkbox-text">💰 Yatırım yapma / ortaklık kurma isteği var</span>
                </label>
              </div>

              <div className="form-group">
                <label>🤝 İş Birliği Yapmak İstediği Alanlar</label>
                <textarea 
                  value={formData.new_person_collaboration_areas} 
                  onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)} 
                  placeholder="Hangi alanlarda iş birliği yapmak istediği..." 
                  rows={3} 
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={stepClass(6)}>
            <div className="form-section">
              <h3>🚀 Gelecek</h3>
              <div className="form-group">
                <label>Görüşme Sıklığı</label>
                <input value={formData.new_person_meeting_frequency} onChange={(e) => updateFormData('new_person_meeting_frequency', e.target.value)} placeholder="Haftada bir, ayda bir..." />
              </div>

              <div className="form-group">
                <label>İletişim Tercihi</label>
                <input value={formData.new_person_communication_preference} onChange={(e) => updateFormData('new_person_communication_preference', e.target.value)} placeholder="E-posta, telefon, LinkedIn..." />
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
        <p className="subtitle">Davete özel kişi ekleme platformu</p>
      </header>

      {/* CARD */}
      <div className="main-container card-glass">
        {!isContactVerified ? (
          // İlk sayfa - Contact doğrulama
          <div className="form-content">
            <div className="step-header">
              <div className="step-title">
                <div className="step-icon">👤</div>
                <div>
                  <div className="step-eyebrow">Kişi Doğrulama</div>
                  <h2>Kişi Bilgilerinizi Girin</h2>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-group">
                <label>Ad</label>
                <input value={formData.inviter_first_name} onChange={(e) => updateFormData('inviter_first_name', e.target.value)} placeholder="Adınız" />
              </div>
              <div className="form-group">
                <label>Soyad</label>
                <input value={formData.inviter_last_name} onChange={(e) => updateFormData('inviter_last_name', e.target.value)} placeholder="Soyadınız" />
              </div>
              <div className="form-group">
                <label className="optional">E-posta Adresi (Opsiyonel)</label>
                <input type="email" value={formData.inviter_email} onChange={(e) => updateFormData('inviter_email', e.target.value)} placeholder="e-posta@ornek.com (opsiyonel)" />
                <small style={{color: '#b9b9c2', fontSize: '12px', marginTop: '5px', display: 'block'}}>
                  E-posta adresi opsiyonel. Boş bırakırsanız sadece ad-soyad ile doğrulama yapılır.
                </small>
              </div>
              <button className="nav-btn save-btn full" onClick={checkPersonExists} disabled={loading}>
                {loading ? 'Kontrol Ediliyor…' : 'Devam Et'}
              </button>
            </div>
            
            {/* Bilgilendirme Kutucukları */}
            <div className="info-boxes-section">
              <h2 className="info-boxes-title">Platform Hakkında</h2>
              <p className="info-boxes-subtitle">NetworkingGPT ile tanışın</p>
              
              <div className="info-boxes-grid">
                <div className="info-box">
                  <div className="info-box-icon">🚀</div>
                  <h3 className="info-box-title">Hızlı ve Güvenli</h3>
                  <p className="info-box-description">
                    Kişi bilgileriniz güvenli bir şekilde saklanır ve sadece gerekli durumlarda kullanılır.
                  </p>
                </div>
                
                <div className="info-box">
                  <div className="info-box-icon">🔗</div>
                  <h3 className="info-box-title">Akıllı Bağlantılar</h3>
                  <p className="info-box-description">
                    AI destekli algoritma ile en uygun kişilerle tanışın ve ağınızı genişletin.
                  </p>
                </div>
                
                <div className="info-box">
                  <div className="info-box-icon">💡</div>
                  <h3 className="info-box-title">Vizyoner Yaklaşım</h3>
                  <p className="info-box-description">
                    Modern teknoloji ile geleneksel networking'i birleştiren yenilikçi platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Ana form - 6 sekme
          <>
            {/* İçerik */}
            <div className="form-content">
              {/* Step header - content form'un üzerinde */}
              <div className="step-header">
                <div className="step-title">
                  <div className="step-icon">{stepIcons[currentStep]}</div>
                  <div>
                    <div className="step-eyebrow">Adım {currentStep + 1} / {totalSteps}</div>
                    <h2>Adım {currentStep + 1}: {stepTitles[currentStep]}</h2>
                  </div>
                </div>
              </div>

              {renderStepContent()}
            </div>

            {/* Navigation (altta) */}
            <div className="navigation-section">
              {currentStep > 0 && (
                <button className="nav-btn prev-btn" onClick={handlePrevious}>← Önceki Adım</button>
              )}
              {currentStep < totalSteps - 1 && (
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
          </>
        )}
      </div>

      {/* Success/Error Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className={`popup-content ${popupMessage.includes('başarıyla') ? 'success' : 'error'}`}>
            <div className="popup-icon">
              {popupMessage.includes('başarıyla') ? '✅' : '❌'}
            </div>
            <div className="popup-message">{popupMessage}</div>
            <button 
              className="popup-close-btn" 
              onClick={() => setShowSuccessPopup(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteForm;
