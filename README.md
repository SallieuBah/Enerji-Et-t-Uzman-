# Mohamed · Enerji Etüt Portföyü

Enerji verimliliği saha etüdü ve teknik raporlama çalışmalarımı (2024–2026) anlatan kişisel portföy sitesi.
Saf HTML, CSS ve JavaScript; derleme adımı yok.

## Dosyalar

| Yol | İçerik |
| --- | --- |
| `index.html` | Sayfa yapısı ve metinler |
| `assets/css/style.css` | Tasarım (renkler en üstteki `:root` bloğunda) |
| `assets/js/i18n.js` | Türkçe / İngilizce dil seçimi ve İngilizce metinler |
| `assets/js/main.js` | Grafikler, kartlar, tablo ve filtreler |
| `data/portfoy.js` | Tesis, il ve aylık görev verileri (Excel'den üretilir) |
| `data/vakalar.js` | Vaka çalışmaları: etüt raporlarındaki trafo ve motor önlemleri (EVÖ) |
| `data/turkiye.js` | Türkiye il sınırları (harita) |
| `scripts/excel_to_data.py` | Excel → `data/portfoy.js` dönüştürücü |
| `scripts/build_map.py` | İl sınırları GeoJSON → `data/turkiye.js` dönüştürücü |

## Dil

Site Türkçe ve İngilizce açılır. Türkçe metinler `index.html` içinde, İngilizce karşılıkları `assets/js/i18n.js`
dosyasındadır (`data-i18n` anahtarlarıyla eşleşir). Grafik ve kartlardaki metinler `main.js` içinde `L("Türkçe", "English")`
biçimindedir. Dil sırasıyla `?lang=tr|en` adresi, ziyaretçinin önceki seçimi ve tarayıcı diline göre belirlenir.

## Verileri güncellemek

```bash
pip install openpyxl
python scripts/excel_to_data.py Mohamed_Enerji_Etut_Fabrika_Portfoyu.xlsx
```

Excel dosyası depoya eklenmez (`.gitignore`), yalnızca üretilen `data/portfoy.js` eklenir.

## Yeni vaka çalışması eklemek

`data/vakalar.js` dosyasındaki `window.VAKALAR` listesine yeni bir tesis ekleyin. Her önlem için rapordaki
kWh/yıl, TEP/yıl, TL/yıl, CO₂ ton/yıl, yatırım ve geri ödeme değerlerini girin. Birden fazla vaka olduğunda
bölümün üstünde tesis sekmeleri kendiliğinden belirir.

## Haritayı yeniden üretmek

Harita yalnızca il sınırları değişirse yeniden üretilir; Excel güncellemesi için gerekmez.

```bash
curl -LO https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json
python scripts/build_map.py tr-cities-utf8.json
```

Harita verisi © OpenStreetMap katkıda bulunanlar, [ODbL](https://opendatacommons.org/licenses/odbl/) lisansıyla.

## Yerelde açmak

`index.html` dosyasını tarayıcıda açmanız yeterli.

## Yayınlamak (GitHub Pages)

Depo ayarlarında **Settings → Pages → Build and deployment** altında kaynak olarak
`Deploy from a branch`, dal olarak `main` ve klasör olarak `/ (root)` seçin.
Site birkaç dakika içinde `https://sallieubah.github.io/Enerji-Et-t-Uzman-/` adresinde yayına girer.
