# NetworkingGPT - Statik Web

Bu klasör, NetworkingGPT davet sistemi için statik web dosyalarını içerir.

## 📁 Dosya Yapısı

```
web/
├── index.html          # Ana sayfa
├── invite.html         # Davet sayfası
├── assets/
│   ├── style.css      # CSS stilleri
│   └── app.js         # JavaScript kodu
└── README.md           # Bu dosya
```

## 🚀 Kullanım

### Yerel Test
1. Web klasörünü bir web server ile açın
2. Ana sayfa: `index.html`
3. Davet sayfası: `invite.html?t=<token>`

### Statik Hosting
Bu dosyaları Netlify, Cloudflare Pages, GitHub Pages gibi statik hosting servislerinde yayınlayabilirsiniz.

## 🔗 Davet Sistemi

### Mobil Uygulama
- Kullanıcı "Davet Bağlantısı Oluştur" butonuna tıklar
- `create-invite-link` Edge Function çağrılır
- URL formatı: `https://<domain>/invite.html?t=<token>`
- Tarayıcı otomatik olarak açılır

### Web Tarafında
1. **Token Doğrulama**: Sayfa yüklenirken token otomatik doğrulanır
2. **Step 1**: Davet eden kişi bilgileri girilir
3. **Step 2**: Yeni kişi bilgileri girilir (6 tab)
4. **Başarı**: Kişi ağa eklenir

## 🌐 Edge Functions

### create-invite-link
- **JWT Gerekli**: Evet
- **Amaç**: Davet linki oluşturur
- **URL Format**: `https://<domain>/invite.html?t=<token>`

### invite-verify
- **JWT Gerekli**: Hayır
- **Amaç**: Token ve davet eden kişi doğrular
- **Response**: `{ ok: true, inviter_contact_id, next_degree, org_id }`

### invite-submit
- **JWT Gerekli**: Hayır
- **Amaç**: Yeni kişi bilgilerini kaydeder
- **Response**: `{ ok: true, contact_id }`

## 📱 Mobil Entegrasyon

Mobil uygulamada `expo-web-browser` ile:
```typescript
await WebBrowser.openBrowserAsync(url);
```

## 🔧 Geliştirme

### CSS
- Responsive design
- Modern gradient arka plan
- Tab-based navigation
- Form validation styles

### JavaScript
- Tab navigation
- Form data collection
- Edge Function API calls
- Error handling
- Loading states

## 📋 Gereksinimler

- Modern web tarayıcısı
- Supabase Edge Functions
- Statik hosting servisi

## 🚀 Deployment

1. Web klasörünü statik hosting servisine yükleyin
2. `WEB_BASE_URL` environment variable'ını ayarlayın
3. Edge Functions'ları deploy edin:
   ```bash
   supabase functions deploy create-invite-link
   supabase functions deploy invite-verify
   supabase functions deploy invite-submit
   ```

## ✅ Test

1. Mobil uygulamada davet linki oluşturun
2. Web tarayıcısında açıldığını kontrol edin
3. Form doldurup kişi eklemeyi test edin
4. Hata durumlarını test edin
