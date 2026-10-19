"""Portföy Excel dosyasını sitenin okuduğu data/portfoy.js dosyasına dönüştürür.

Kullanım:
    pip install openpyxl
    python scripts/excel_to_data.py Mohamed_Enerji_Etut_Fabrika_Portfoyu.xlsx
"""
import collections
import json
import sys
from pathlib import Path

import openpyxl

OUT = Path(__file__).resolve().parent.parent / "data" / "portfoy.js"

# Sektör, tesis adındaki anahtar kelimelerden çıkarılır; ilk eşleşen kazanır.
SECTORS = [
    ("Otel, Ticari & Kamu", ["radisson", "movenpick", "mövenpick", "holiday", "cvk", "swiss", "ic hotels", "ıc hotels",
                             "ticaret merkezi", "fuar", "piazza", "ferko", "colins", "medical", "sun express", "kaski",
                             "izaydaş", "otogar", "optimum", "tec"]),
    ("Tekstil", ["tekstil", "mensucat", "denim", "iplik", "sunteks", "barutçu", "derhan", "şık makas", "ekoten", "iskur",
                 "orta anadolu", "sürü"]),
    ("Gıda & İçecek", ["gıda", "süt", "mısır", "pepsico", "ülker", "savola", "şenpiliç", "halavet", "makarna", "nişasta",
                       "kuruyemiş", "çay", "coca", "avrora", "assan foods", "acemoğlu", "kervan", "tadım", "çizmeci",
                       "acarsan", "altınkılıç"]),
    ("Kimya, Plastik & İlaç", ["kimya", "gentaş", "plastik", "perfektüp", "polisan", "evyap", "basf", "poliport",
                               "recordati", "kp films", "bagfaş", "tezkim", "eti soda", "beri cap", "rudolf", "akkim"]),
    ("Kağıt & Ambalaj", ["kağıt", "mondi", "armasan", "etiket"]),
    ("Cam, Seramik, Çimento & Maden", ["seramik", "cam", "yorglass", "şişecam", "çimento", "batıçim", "batısöke",
                                       "çimentaş", "adaçal", "nuh yapı", "maden", "zenit", "dimin", "adkotürk"]),
    ("Metal, Otomotiv & Makine", ["zf sachs", "demirdöküm", "hasçelik", "sarkuysan", "posco", "mmk", "metal", "otokar",
                                  "toyotetsu", "eku", "koluman", "hema", "tristone", "alüminyum", "profil", "döküm",
                                  "bms", "mefa", "aslar", "panelsan", "abb", "istikbal", "çuhadaroğlu", "asbilek",
                                  "kablo"]),
]
# Rapor görev metninde geçen kelimeye göre kapsam etiketi
SCOPES = [("Trafo", ["trafo"]), ("Elektrik Motoru", ["motor"]), ("Pompa", ["pompa"]),
          ("Termal Kamera", ["termal"]), ("Buhar Sistemleri", ["buhar"]), ("Basınçlı Hava", ["hava", "basınçlı"])]


def lower_tr(s):
    return s.replace("İ", "i").replace("I", "ı").lower()


def sector(name):
    low = lower_tr(name)
    for title, keys in SECTORS:
        if any(k in low for k in keys):
            return title
    return "Diğer Sanayi"


def iso(d):
    dd, mm, yy = d.split(".")
    return f"{yy}-{mm}-{dd}"


def rows(wb, sheet, first_header):
    out, header = [], None
    for r in wb[sheet].iter_rows(values_only=True):
        if header is None:
            if r[0] == first_header:
                header = [c for c in r if c is not None]
            continue
        if r[0] is not None:
            out.append(dict(zip(header, r)))
    return out


def main(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    facilities = rows(wb, "Portföy Özeti", "Fabrika / Tesis")
    cities = rows(wb, "Şehir Özeti", "Şehir")
    tasks = rows(wb, "Görev Kayıtları", "Tarih")

    by_facility = collections.defaultdict(list)
    for t in tasks:
        by_facility[t["Fabrika / Tesis"]].append(t)

    F = []
    for f in facilities:
        name = f["Fabrika / Tesis"]
        scope = set()
        for t in by_facility[name]:
            text = lower_tr(t["Takvimdeki Görev Metni"])
            if t["Görev"] == "Rapor":
                scope.update(k for k, keys in SCOPES if any(x in text for x in keys))
        F.append(dict(n=name.strip(), c=f["Konum"], y=f["Liste Yılı"], t=f["Görev Özeti"], s=f["Saha Günü"],
                      r=f["Rapor Günü"], a=iso(f["İlk Görev"]), b=iso(f["Son Görev"]), k=f["Kanıt Kaydı"],
                      sec=sector(name), sc=sorted(scope)))

    # Aylık saha / rapor günleri, boş aylar dahil
    month = collections.defaultdict(lambda: [0, 0])
    for t in tasks:
        month[iso(t["Tarih"])[:7]][0 if t["Görev"] == "Saha Etüdü" else 1] += 1
    keys = sorted(month)
    y, m = map(int, keys[0].split("-"))
    M = []
    while f"{y}-{m:02d}" <= keys[-1]:
        k = f"{y}-{m:02d}"
        M.append([k] + month.get(k, [0, 0]))
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)

    C = [dict(c=c["Şehir"], n=c["Fabrika / Tesis Sayısı"], d=c["Saha Etüdü Günü"],
              f=c["Ziyaret Edilen Fabrikalar / Tesisler"]) for c in cities]

    data = json.dumps(dict(F=F, M=M, C=C), ensure_ascii=False, separators=(",", ":"), default=str)
    OUT.write_text("// Otomatik üretildi: scripts/excel_to_data.py\nwindow.PORTFOY=" + data + ";\n", encoding="utf-8")
    print(f"{OUT} yazıldı: {len(F)} tesis, {len(tasks)} görev günü, {len(C)} il")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
