# Natro Destek Talebi

## Önce şunu deneyin

Bu talebi göndermeden önce **DNS'te A kaydını geri ekleyin**:

```
@    A    94.73.146.147
www  A    94.73.146.147
```

Site 27 Temmuz'daki transfer denemesi sırasında A kaydı silindiği için kapandı —
ödeme sorunundan değil. Dosyalar hâlâ eski sunucuda duruyor olabilir; sadece
oraya işaret eden bir şey kalmamış. **Bu işlem 5 dakika sürer ve geri alınabilir.**

30–60 dakika sonra siteyi açın:

- **Site açılıyorsa** → hosting canlı. Hemen her şeyi indirin, aşağıdaki talebe gerek yok.
- **"Hesabınız durduruldu" sayfası** → hesap var ama askıda. Yenileyin, sonra indirin.
- **Hiçbir şey çıkmıyorsa** → aşağıdaki talebi gönderin.

---

## Talep neden gerekli

Panelde hiç hosting paketi görünmüyor. Muhtemel sebepler:

1. Hosting süresi doldu ve paket silindi, **veya**
2. Hosting hiçbir zaman bu hesapta değildi — eskiden siteyi yapan firma/kişi kendi
   Natro bayi hesabı altında tutuyordu.

**Amaç:** eski sitenin dosyalarına — özellikle `wp-content/uploads/` klasöründeki
ürün fotoğraflarına — ulaşmak. Bu fotoğraflar başka hiçbir yerde yok.

**Not:** Natro sözleşmesi §5.5'e göre ödemesi yapılmayan hizmetler 15 iş günü sonra
durduruluyor, 15 iş günü daha sonra siliniyor. §4.6'da sunucuların arşiv olmadığı
açıkça belirtiliyor. Yedek olmama ihtimaline hazırlıklı olun.

**Destek:** 0212 213 1 213 (7/24) · panel üzerinden destek talebi

---

## Talep metni — kopyalayıp yapıştırın

> **Konu:** kapaklikuyumculuk.com — eski hosting hesabı ve yedek durumu hakkında bilgi talebi
>
> Merhaba,
>
> **kapaklikuyumculuk.com** alan adının sahibiyim ve alan adı şu anda hesabımda kayıtlı
> görünüyor. Ancak hesabımda bu alan adına ait herhangi bir hosting paketi görünmüyor.
>
> Aşağıdaki konularda bilgi almak istiyorum:
>
> **1.** Bu alan adına ait daha önce bir hosting paketi var mıydı? Varsa hangi hesap
> altındaydı ve hangi tarihte sona erdi?
>
> **2.** Profesyonel DNS hizmetini aldım ve alan adının A kaydını, sitenin eskiden
> barındığı `94.73.146.147` (`cpls59.srvpanel.com`) IP adresine yönlendirdim. Şu anda
> bu adres **cPanel "Default Web Site Page"** sayfasını döndürüyor — yani sunucu
> ayakta, ancak bu alan adına tanımlı bir hesap/vhost bulunmuyor.
>
> Buna göre:
>
> **a)** Bu alan adına ait hosting hesabı **başka bir sunucuya taşındı mı**? Taşındıysa
> güncel sunucu/IP bilgisini paylaşabilir misiniz?
>
> **b)** Taşınmadıysa, hesap silinmiş demektir. Bu durumda sistemlerinizde bu hesaba
> ait herhangi bir **yedek (backup)** kaldı mı?
>
> **c)** Hesap benim müşteri hesabımda görünmüyor. Başka bir müşteri veya **bayi
> hesabı** altında kayıtlı olma ihtimali var mı? (Siteyi geçmişte başka biri
> yapmıştı; hosting onun bayi hesabında olabilir.)
>
> Özellikle `wp-content/uploads/` klasöründeki görseller ve MySQL veritabanı bizim
> için kritik önemde — bu içerikler başka hiçbir yerde bulunmuyor.
>
> **3.** 27 Temmuz 2026 tarihinde başka bir kayıt firmasına transfer denemesi yaptım
> ancak yenileme tarihine yakın olduğu için gerçekleşmedi. Şu an transfer yapmayı
> düşünmüyorum. Ancak ileride yapmak istersem, yenilemeyi kaybetmeden transfer
> yapabileceğim en uygun tarih aralığı nedir?
>
> **4.** Alan adı kaydı **Nics Telekomünikasyon A.Ş.** üzerinde görünüyor ve
> `clientTransferProhibited` durumu aktif. Alan adı güvenliğini artırmak için
> **`clientDeleteProhibited`** ve **`clientUpdateProhibited`** durum kodlarının da
> eklenmesini talep ediyorum.
>
> **5.** Hesabımda iki adımlı doğrulama (Şifrematik) ve otomatik yenileme talimatının
> aktif olup olmadığını teyit edebilir misiniz?
>
> Yedek konusu zaman açısından kritik olduğu için 2. maddeye öncelik verebilirseniz
> çok memnun olurum.
>
> Teşekkürler,
> Soner Eroğlu

---

## Talebi gönderdikten sonra

- **Yedek varsa:** hemen indirin. FTP ile tüm `public_html` klasörü + veritabanı
  export'u. İki kopya saklayın (bilgisayar + bulut).
- **Yedek yoksa:** ürün fotoğrafları kalıcı olarak kaybedilmiş demektir. Bu durumda
  Plan B: mağazadaki mevcut ürünleri yeniden fotoğraflamak. Aslında bu daha iyi bir
  sonuç verir — 2022 öncesi fotoğraflar muhtemelen düşük çözünürlüklü ve güncel
  olmayan ürünlerdi.
- **4. ve 5. maddeler** yedek durumundan bağımsız olarak yapılmalı. Bunlar alan adı
  güvenliği için ve beklemeye gerek yok.

## Ayrıca kontrol edilecek

**Eski siteyi yapan kişi/firma kimdi?** Hosting muhtemelen onların Natro bayi
hesabındaydı. Ailenizde bunu bilen biri varsa, doğrudan onlara ulaşmak Natro destek
sürecinden çok daha hızlı sonuç verir — hem dosyalar hem de varsa yedekler için.
