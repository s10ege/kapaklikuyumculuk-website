# DNS ve Hosting Kararı + A Kaydı Ekleme

## Karar

| Soru | Cevap |
|---|---|
| **Profesyonel DNS alayım mı?** | ✅ **Evet.** Yıllık ~$1. DNS kaydı düzenlemek için bir yola ihtiyacınız var — hem şimdiki kurtarma testi hem de yeni siteyi yayına almak için. |
| **Hosting alayım mı?** | ❌ **Hayır.** Fiyattan bağımsız olarak: yeni paket **boş** gelir, eski dosyaları geri getirmez. Yeni site zaten Vercel/Cloudflare Pages'te ücretsiz barınacak. |
| **Domain transferi?** | 2027'de. Bu yıl Natro'da kalıyor, ödemesi yapılmış. |

$1 seviyesinde Cloudflare'e geçmenin (aşağıda anlatılıyor) pratik bir avantajı yok —
tek panelde kalmak daha basit. Cloudflare seçeneği yine de burada duruyor, ilerde
işinize yarayabilir.

---

## ⚠️ Önce şunu bilin: hosting almak eski dosyaları GERİ GETİRMEZ

Bu en kritik nokta. Yeni bir hosting paketi satın almak size **boş** bir hesap verir.
Eski sitenin dosyaları o pakete gelmez.

Dosyaların geri gelmesinin tek yolu, **eskiden var olan hesabın** hâlâ sunucuda durup
yeniden aktifleştirilmesidir. Panelinizde hiç hosting paketi görünmediğine göre o
hesap ya silinmiş ya da başka birinin (siteyi yapan kişinin) hesabı altındaydı.

Yani: **fotoğrafları kurtarmak için hosting satın almayın.** Bu para sadece boş bir
sunucu alanı satın alır.

## Doğru sıra

### 1. Önce Natro'ya sorun — ücretsiz ve kesin cevap

`natro-destek-talebi.md` dosyasındaki talebi gönderin. Sorduğunuz şey şu:
*"cpls59.srvpanel.com sunucusunda bu alan adına ait bir hesap hâlâ var mı, yedeği
var mı?"*

Destek bunu bakıp size söyleyebilir. **Hiçbir şey satın almanıza gerek yok.**

- **"Hesap duruyor, askıda"** derlerse → o hesabı yeniden aktifleştirmek mantıklı.
  Bu, yeni paket almak değil; mevcut hesabı geri açmak.
- **"Silinmiş / kayıt yok"** derlerse → satın alınacak hiçbir şey yok. Fotoğraflar
  gitti, yeniden çekeceğiz.

Bu cevabı almadan para harcamayın.

### 2. Profesyonel DNS'i alın (~$1/yıl) veya Cloudflare'e geçin (ücretsiz)

**Basit yol:** Natro Profesyonel DNS'i alın. Tek panel, uğraş yok, $1.

**Alternatif — Cloudflare:** ücretsiz, ama name server değiştirmeniz gerekiyor.
Not: NS değiştirmek **transfer değildir** — alan adı Natro'da kayıtlı kalır, ödemeniz
etkilenmez, istediğiniz an geri alırsınız. $1 seviyesinde zahmete değmez, ama
seçenek olarak burada:

- **Ücretsiz.** Süresiz, kredi kartı istemiyor.
- Natro'da **name server değiştirmek ücretsiz** — sadece NS alanlarını değiştiriyorsunuz.
- Yeni site için zaten DNS kontrolüne ihtiyacınız olacak.
- Daha hızlı, arayüzü daha net, DNSSEC tek tıkla.
- **E-posta olmadığı için tamamen risksiz.** Alan adında MX kaydı yok, yani
  bozulacak bir mail akışı yok.

**Nasıl:**

1. `cloudflare.com` → ücretsiz hesap açın
2. "Add a site" → `kapaklikuyumculuk.com`
3. Free planı seçin
4. Cloudflare size iki name server verir (örn. `xxx.ns.cloudflare.com`)
5. **Natro paneli** → Alan Adı Yönetimi → Yönet → Name Server / NS Yönetimi
   → mevcut `ns1.natrohost.com` / `ns2.natrohost.com` yerine Cloudflare'inkileri yazın
6. NS değişikliği 2–24 saat içinde yayılır

> NS değiştirmek ICANN'in 60 günlük kilidini tetiklemez — o kilit sadece kayıt,
> transfer ve **kayıt sahibi bilgisi** değişikliklerinde devreye giriyor. NS değişimi
> güvenli.

### 3. Hosting almayın

Yeni site Natro'da barınmayacak. **Vercel** veya **Cloudflare Pages** bu iş için
ücretsiz, daha hızlı ve Next.js gibi modern site yapıları için tasarlanmış. Küçük bir
kurumsal site için Natro shared hosting'e ödeme yapmanın bir gerekçesi yok.

---

## A kaydını ekleme (test için)

Natro destek "hesap duruyor" derse veya yine de denemek isterseniz:

### Cloudflare'de

DNS → Records → Add record

| Type | Name | IPv4 address | Proxy status |
|---|---|---|---|
| A | `@` | `94.73.146.147` | **DNS only** (gri bulut) |
| A | `www` | `94.73.146.147` | **DNS only** (gri bulut) |

> ⚠️ Test sırasında proxy'yi (turuncu bulut) **kapalı** tutun. Açık olursa Cloudflare
> araya girer ve sunucudan gerçekte ne döndüğünü göremezsiniz.

### Natro'da kalırsanız (Profesyonel DNS gerekir)

```
Hesabım → Alan Adı Yönetimi → Aktif Alan Adlarınız
  → kapaklikuyumculuk.com → Yönet → Profesyonel DNS
    → Gelişmiş Bölge Düzenleyicisi → Yönet
      → Diğer İşlemler → Yeni Kayıt (A)
```

| Ad | Tür | Değer | TTL |
|---|---|---|---|
| `@` | A | `94.73.146.147` | 3600 |
| `www` | A | `94.73.146.147` | 3600 |

`www` kaydı şu anda hiç yok — ikisini birden ekleyin.

### Sonuçlar

| Gördüğünüz | Anlamı |
|---|---|
| 🎉 Eski site açıldı | Hosting canlı. Hemen `public_html` + veritabanı + `wp-content/uploads/` indirin, iki kopya saklayın |
| ⚠️ "Hesabınız durduruldu" sayfası | Hesap var, askıda. Yeniden aktifleştirip indirin |
| ❌ Boş / hata sayfası | Hesap sunucudan silinmiş. Fotoğrafları yeniden çekeceğiz |

---

## Özet

| Soru | Cevap |
|---|---|
| Natro Profesyonel DNS alayım mı? | **Evet**, ~$1/yıl. DNS düzenleyebilmek için gerekli |
| Hosting alayım mı? | **Hayır** — eski dosyaları geri getirmez, yeni site zaten başka yerde barınacak |
| Sıra ne olsun? | Profesyonel DNS'i alın → A kaydını ekleyin → sonucu görün. Paralelde destek talebini de gönderin (ücretsiz) |
| Eski hesap askıdaysa? | O zaman **o hesabı** yeniden aktifleştirmek mantıklı — ama yeni paket almak değil |

## İleride (opsiyonel)

Alan adında e-posta olmadığı için, kimsenin sizin adınıza sahte mail atmasını
engellemek adına Cloudflare'de şunları ekleyebilirsiniz:

```
TXT   @        v=spf1 -all
TXT   _dmarc   v=DMARC1; p=reject;
```

Mevcut SPF kaydı Natro'nun mail sunucularını işaret ediyor ama MX olmadığı için
işlevsiz — temizlenebilir.

## Kaynaklar

- [Profesyonel DNS nedir? — Natro](https://www.natro.com/blog/profesyonel-dns-nedir-hangi-durumlarda-profesyonel-dns-alinmali/)
- [Alan adına ait DNS kayıtlarını nasıl düzenleyebilirim? — Natro](https://www.natro.com/hemendestek/bilgibankasi/alan-adina-ait-dns-kayitlarini-nasil-duzenleyebilirim)
- [Cloudflare Free Plan](https://www.cloudflare.com/plans/free/)
- [Cloudflare Nameservers — docs](https://developers.cloudflare.com/dns/nameservers/)
