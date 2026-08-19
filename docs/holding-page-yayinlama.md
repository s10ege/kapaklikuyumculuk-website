# Holding Page — Nereye, Nasıl Yayınlanır

## Kısa cevap: Natro'ya değil

Natro'da bir sayfa yayınlamak için **hosting paketi** almanız gerekir. Tek sayfalık
bir "yakında" sitesi için buna gerek yok — ve her yıl yenilemeniz gerekirdi.

Az önce aldığınız **Profesyonel DNS** tam olarak bunu çözüyor: alan adını istediğiniz
sunucuya yönlendirebilirsiniz. Site nerede barınırsa barınsın, adres
`kapaklikuyumculuk.com` olarak görünür.

| Seçenek | Ücret | Not |
|---|---|---|
| **Vercel** | Ücretsiz | Önerilen. Apex domain için A kaydı veriyor — Natro paneliyle uyumlu |
| **Cloudflare Pages** | Ücretsiz | İyi, ama apex domain için DNS'in de Cloudflare'de olmasını ister |
| **Netlify** | Ücretsiz | Vercel'e benzer |
| **Natro hosting** | Ücretli | Gereksiz. Tek sayfa için yıllık ödeme |

SSL sertifikası üçünde de otomatik ve ücretsiz geliyor — Natro'da SSL ayrıca
satılıyor.

---

## Adımlar (Vercel)

### 1. Sayfayı hazırlayın

Tek bir `index.html` dosyası yeterli. İçinde olması gerekenler:

- Mağaza adı ve logosu
- **Adres:** Cumhuriyet Mah., Pınar Bulvarı No: 56/A, 59510 Kapaklı / Tekirdağ
- **Telefon:** 0282 717 21 31 (tıklanabilir `tel:` linki)
- Çalışma saatleri
- Google Maps yol tarifi linki
- Instagram linki
- "Yeni sitemiz yakında" notu

### 2. Vercel'e yükleyin

1. `vercel.com` → GitHub/Google ile ücretsiz hesap açın
2. **Add New → Project**
3. Klasörü sürükleyip bırakın, veya GitHub deposu bağlayın
4. Deploy — birkaç saniye sürer
5. Size `xxx.vercel.app` adresi verir, önce oradan kontrol edin

### 3. Alan adını bağlayın

1. Vercel'de proje → **Settings → Domains**
2. `kapaklikuyumculuk.com` ekleyin, `www.kapaklikuyumculuk.com` de ekleyin
3. Vercel size **tam olarak hangi DNS kayıtlarını** eklemeniz gerektiğini gösterir

> ⚠️ Vercel artık projeye özel değerler veriyor (`xyz.vercel-dns-016.com` gibi).
> Eski `76.76.21.21` ve `cname.vercel-dns.com` hâlâ çalışıyor ama **ekranda size
> ne gösteriyorsa onu kullanın**, buradaki örnekleri değil.

### 4. Natro DNS panelinde kayıtları güncelleyin

```
Hesabım → Alan Adı Yönetimi → kapaklikuyumculuk.com → Yönet
  → Profesyonel DNS → Tüm Kayıtlar
```

**Önce silin** — şu anda cPanel "SORRY!" sayfasına gidiyorlar:

| Sil | Tipi | İçerik |
|---|---|---|
| ❌ | A | `94.73.146.147` (apex) |
| ❌ | A | `94.73.146.147` (www) |

**Sonra ekleyin** — Vercel'in size gösterdiği değerlerle:

| Ekle | Tipi | Adı | İçerik |
|---|---|---|---|
| ✅ | A | `kapaklikuyumculuk.com` | *(Vercel'in verdiği IP)* |
| ✅ | CNAME | `www` | *(Vercel'in verdiği adres)* |

`ns1`, `ns2` ve TXT kayıtlarına dokunmayın.

### 5. Bekleyin ve kontrol edin

1–4 saat sonra Vercel'deki Domains ekranı yeşile döner ve SSL otomatik kurulur.
Siteyi `https://kapaklikuyumculuk.com` olarak açabilmeniz gerekir.

---

## Neden acele etmeye değer

Şu anda alan adı cPanel'in **"SORRY!"** sayfasını gösteriyor. Bu, hiçbir şey
göstermemekten biraz daha kötü: gerçek ve **indekslenebilir** bir sayfa. Google
tarayıp bunu sitenizin içeriği sanabilir.

Ayrıca temizleyeceğimiz onlarca rehber kaydı sitenize link veriyor. O linklerin
çalışır hale gelmesi, Google kaydını düzeltmeye başlamadan önce olmalı.

**Alternatif:** holding page'i hemen yapmayacaksanız, iki A kaydını **silin**. Boş
bırakmak, bozuk sayfa göstermekten iyidir.

## Sonraki adım

Holding page geçici. Asıl site hazır olduğunda aynı Vercel projesini güncelleyeceğiz
— DNS kayıtları aynı kalır, tekrar uğraşmanıza gerek kalmaz.

## Kaynaklar

- [Setting up a custom domain — Vercel](https://vercel.com/docs/domains/set-up-custom-domain)
- [Using A records with Vercel](https://vercel.com/kb/guide/a-record-and-caa-with-vercel)
