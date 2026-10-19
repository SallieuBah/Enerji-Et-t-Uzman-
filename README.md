# Mohamed · Enerji Etüt Portföyü

Enerji verimliliği saha etüdü ve teknik raporlama çalışmalarımı (2024–2026) anlatan kişisel portföy sitesi.
Saf HTML, CSS ve JavaScript; derleme adımı yok.

## Dosyalar

| Yol | İçerik |
| --- | --- |
| `index.html` | Sayfa yapısı ve metinler |
| `assets/css/style.css` | Tasarım (renkler en üstteki `:root` bloğunda) |
| `assets/js/main.js` | Grafikler, kartlar, tablo ve filtreler |
| `data/portfoy.js` | Tesis, il ve aylık görev verileri (Excel'den üretilir) |
| `scripts/excel_to_data.py` | Excel → `data/portfoy.js` dönüştürücü |

## Verileri güncellemek

```bash
pip install openpyxl
python scripts/excel_to_data.py Mohamed_Enerji_Etut_Fabrika_Portfoyu.xlsx
```

Excel dosyası depoya eklenmez (`.gitignore`), yalnızca üretilen `data/portfoy.js` eklenir.

## Yerelde açmak

`index.html` dosyasını tarayıcıda açmanız yeterli.

## Yayınlamak (GitHub Pages)

Depo ayarlarında **Settings → Pages → Build and deployment** altında kaynak olarak
`Deploy from a branch`, dal olarak `main` ve klasör olarak `/ (root)` seçin.
Site birkaç dakika içinde `https://sallieubah.github.io/Enerji-Et-t-Uzman-/` adresinde yayına girer.
