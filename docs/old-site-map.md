# Old Site — Recovered Structure

The old site was a **WordPress** install on Turkish shared hosting
(`94.73.146.147` / `cpls59.srvpanel.com`). It is gone. The domain now serves the
static holding page from Vercel.

**Updated 2026-08-19.** The 2026-08-03 version of this doc said Archive.org was not
accessible and listed 6 recovered URLs. Archive.org *is* accessible — a CDX query
returned **309 unique archived URLs** across two generations of the site. Full dump:
[`old-urls.txt`](old-urls.txt).

## Confirmed still in Google's index

Verified live on 2026-08-19 via Firecrawl. All six return **404**.

| Old URL | Indexed title |
|---|---|
| `/galeri` | GALERİ - Kapaklı Kuyumculuk \| 0282 717 21 31 |
| `/urunler/pirlanta` | Pırlanta Archives |
| `/urunler/ozel-tasarim-takilar` | Özel Tasarım Takılar Archives |
| `/urun/altin-seti` | Altın Seti *(body was lorem ipsum)* |
| `/urun/kupe-modelleri` | Küpe Modelleri — "Just another WordPress site" |
| `/urun/tek-tas-modelleri` | Tek Taş Modelleri |

The homepage `/` is indexed correctly with the new holding-page title.

## Full structure, by generation

**WordPress generation 2 (2016–2022)** — the one still in the index:

```
/                          /galeri                    /kurumsal
/urunler                   /urunler/altin             /urunler/pirlanta
/urunler/ozel-tasarim-takilar
/urun/altin-seti           /urun/kupe-modelleri       /urun/ozel-tasarim-takilar
/urun/pirlanta-yuzukler    /urun/tek-tas-modelleri    /urun/yuzuk-modelleri
```

**Note:** `/urunler/altin` and `/urun/pirlanta-yuzukler` and `/urun/yuzuk-modelleri`
were *not* found in the earlier search-index recovery. They are new — which means the
category list was **Altın · Pırlanta · Özel Tasarım Takılar**, and the products under
them included yüzük, küpe, tek taş, pırlanta yüzük, altın seti.

**Generation 1 (2013–2016)** — long dead, may still hold stray index entries:

```
/hakkimizda/     /iletisim/       /misyonvizyon/     /markalar-2/
/urunlerimiz/  + 7 supplier subpages (cici-gold, cilek-gold, haskale-tum-cesitler,
                 kahraman-atay, ozer-bilezik, 310-2, 412-2)
/calistigimiz-firmalar/ + 10 subpages (altin-firmalari, saat-firmalari,
                 kilic-alyans, gizil-inci, tekbir-gumus, enox-saat,
                 essence-saat, romanson-saat)
/fotograf-galerisi/ + kapakli-kuyumculuk-merkez, kapakli-kuyumculuk-sube
/altin-fiyatlari    /doviz-kurlari/
```

`/fotograf-galerisi/kapakli-kuyumculuk-sube` confirms the "iki şube" claim in the
recovered Kurumsal copy — there really were two branches.

**WordPress internals** — no successor, deliberately left to 404:

```
/anasayfa2   /uncategorized/hello-world   /category/uncategorized
/author/adminkapakli/   /author/kapaklikuyumculuk   /author/multifikiradmin
/slide-types/referanslar
/gallery_plus/haskale/  /gallery_plus/kilic-alyans/  /gallery_plus/kahraman-atay
/?p=23  /?p=82  /?p=138  /?p=148
/wp-admin  /wp-admin/admin-ajax.php  /wp-login.php
```

**Images** — 111 JPGs under `/wp-content/uploads/2015/12/` (filenames `IMG_03xx`,
served at 1024px), plus ~128 theme assets under
`/wp-content/themes/dt-chocolate/`. These may still appear in Google Images.

> ⚠️ **The uploads are worth a rescue attempt.** The archive holds the *URLs*; whether
> Archive.org also holds the *image bytes* is untested. If it does, that's the product
> photography everyone assumed was lost. Worth an hour before booking a photo session.

## Recovered copy

**Homepage:**
> ...sunduğu hediyeler sevdiklerinize her zaman değerli kalacak ve değeri sürekli
> hatırlanacak niteliktedir... yıllardır devam eden tecrübesi ve müşteri
> memnuniyetine dayalı hizmet anlayışı, güven ve dürüstlüğe dayalı satış politikası

**Kurumsal (the most valuable recovery):**
> Kapaklı Kuyumculuk 2000 yılında Kapaklı ilçesinin merkezinde kurulmuş olup
> ilçenin ilk kuyumcusudur. Geniş ürün yelpazesiyle, güler yüzlü ve dürüst
> personeliyle hizmet vermektedir. Firma altın, pırlanta ve çok çeşitli saat
> markaları ile kaliteli ve güvenli hizmeti Kapaklı ilçesinde iki şube ile
> sunmaktadır.

The title template was `%page% - Kapaklı Kuyumculuk | 0282 717 21 31 | Kapaklı`.
Worth keeping the pattern on the real site — the phone number in the title is unusual
but it was indexed that way for years.

**Nav menu was:** ANASAYFA · KURUMSAL · ÜRÜNLER · GALERİ · İLETİŞİM

## What could NOT be recovered

- **Product photos** — see the note above; may be partly recoverable from Archive.org.
- The contact page's exact address block.
- Whether category slugs beyond the three confirmed ones ever existed.

## Redirects — where they actually live

> **Correction.** An earlier version of this doc said redirects were wired into
> `content/redirects.ts` and `next.config.ts`. **Those files never existed.** There is
> no Next.js app — the live site is one static `index.html` deployed from a private
> GitHub repo.

Redirects live in **`holding-page/vercel.json`**, added 2026-08-19. Every generation-1
and generation-2 content path 301s to `/`. WordPress internals are left at 404 and
now render the branded `404.html` instead of Vercel's English error screen.

When the real site launches, change the `destination` values — `/urunler/pirlanta` →
`/koleksiyon/pirlanta` and so on. **Do not delete the file.** These 301s are the only
thing preserving whatever index history the domain still holds.
