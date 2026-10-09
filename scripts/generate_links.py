#!/usr/bin/env python3
import json
import os
import shutil
import zipfile
import xml.etree.ElementTree as ET

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_PATH = os.path.join(ROOT_DIR, 'guests.xlsx')
JSON_PATH_1 = os.path.join(ROOT_DIR, 'guests.json')
JSON_PATH_2 = os.path.join(ROOT_DIR, 'src', 'data', 'guests.json')
LINKS_TXT_PATH = os.path.join(ROOT_DIR, 'guests_links.txt')
BASE_URL = 'https://panteahossein.ir/'

NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
ET.register_namespace('', NS)

def parse_guests_from_excel():
    with zipfile.ZipFile(EXCEL_PATH, 'r') as z:
        files = {name: z.read(name) for name in z.namelist()}

    shared_strings = []
    if 'xl/sharedStrings.xml' in files:
        sst_tree = ET.fromstring(files['xl/sharedStrings.xml'])
        for si in sst_tree.findall(f'{{{NS}}}si'):
            text = ''.join(t.text for t in si.findall(f'.//{{{NS}}}t') if t.text)
            shared_strings.append(text)

    sheet_tree = ET.fromstring(files['xl/worksheets/sheet1.xml'])
    rows = sheet_tree.findall(f'.//{{{NS}}}row')

    guests = []
    for r in rows[1:]:  # skip header
        row_dict = {}
        row_num = int(r.attrib.get('r'))
        for c in r.findall(f'{{{NS}}}c'):
            ref = c.attrib.get('r')
            col = ''.join(filter(str.isalpha, ref))
            cell_type = c.attrib.get('t')
            val = c.find(f'{{{NS}}}v')
            val_text = val.text if val is not None and val.text is not None else ''
            if cell_type == 's' and val_text.isdigit():
                val_text = shared_strings[int(val_text)]
            row_dict[col] = val_text.strip()

        radif = row_dict.get('A', '')
        gid = row_dict.get('B', '')
        name = row_dict.get('C', '')
        companions = row_dict.get('D', '')
        side = row_dict.get('E', '')

        if gid and name:
            guests.append({
                'row_num': row_num,
                'radif': radif,
                'id': gid,
                'name': name,
                'companions': companions,
                'side': side
            })

    return guests, files, shared_strings

def update_excel_with_links(guests, files, shared_strings):
    sst_tree = ET.fromstring(files['xl/sharedStrings.xml'])
    str_to_idx = {s: i for i, s in enumerate(shared_strings)}

    sheet_tree = ET.fromstring(files['xl/worksheets/sheet1.xml'])
    rows = {int(r.attrib.get('r')): r for r in sheet_tree.findall(f'.//{{{NS}}}row')}

    added_strings = 0
    for g in guests:
        row_num = g['row_num']
        gid = g['id']
        url = f"{BASE_URL}?to={gid}"

        if url not in str_to_idx:
            str_to_idx[url] = len(shared_strings)
            shared_strings.append(url)
            si_el = ET.SubElement(sst_tree, f'{{{NS}}}si')
            t_el = ET.SubElement(si_el, f'{{{NS}}}t')
            t_el.text = url
            added_strings += 1

        s_idx = str(str_to_idx[url])

        if row_num in rows:
            r_el = rows[row_num]
            f_cell = None
            for c in r_el.findall(f'{{{NS}}}c'):
                if c.attrib.get('r') == f'F{row_num}':
                    f_cell = c
                    break

            if f_cell is None:
                f_cell = ET.SubElement(r_el, f'{{{NS}}}c', {'r': f'F{row_num}', 't': 's'})
                v_el = ET.SubElement(f_cell, f'{{{NS}}}v')
                v_el.text = s_idx
            else:
                f_cell.attrib['t'] = 's'
                for child in list(f_cell):
                    f_cell.remove(child)
                v_el = ET.SubElement(f_cell, f'{{{NS}}}v')
                v_el.text = s_idx

            r_el.attrib['spans'] = '1:6'

    sst_tree.attrib['uniqueCount'] = str(len(shared_strings))
    old_count = int(sst_tree.attrib.get('count', len(shared_strings)))
    sst_tree.attrib['count'] = str(old_count + len(guests))

    files['xl/sharedStrings.xml'] = ET.tostring(sst_tree, encoding='utf-8', xml_declaration=True)
    files['xl/worksheets/sheet1.xml'] = ET.tostring(sheet_tree, encoding='utf-8', xml_declaration=True)

    # Save to temp file first then replace
    temp_excel = EXCEL_PATH + '.tmp'
    with zipfile.ZipFile(temp_excel, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for name, content in files.items():
            zout.writestr(name, content)

    shutil.move(temp_excel, EXCEL_PATH)
    print(f"✓ فایل اکسل {EXCEL_PATH} با ستون لینک اختصاصی به‌روزرسانی شد.")

def main():
    guests, files, shared_strings = parse_guests_from_excel()
    print(f"تعداد مهمانان خوانده شده از اکسل: {len(guests)}")

    # ۱. تولید guests.json و src/data/guests.json با پشتیبانی از نام‌های مستعار (Aliases)
    ALIASES = {
        'anvari': ['mohandes-anvari', 'anvari-family'],
        'behzadi': ['aliakbar-behzadi', 'aliakbarbehzadi'],
        'chobin': ['choobin', 'ghazanfar-chobin', 'ghazanfarchobin'],
        'aliakbar': ['ali-akbar'],
        'hojjat-farahbakhsh': ['hojjat', 'farahbakhsh', 'hojat-farahbakhsh']
    }

    json_data = []
    for g in guests:
        entry = {
            "id": g['id'],
            "name": g['name'],
            "companions": g['companions'],
            "side": g['side']
        }
        if g['id'] in ALIASES:
            entry["aliases"] = ALIASES[g['id']]
        json_data.append(entry)

    json_str = json.dumps(json_data, ensure_ascii=False, indent=2) + '\n'
    with open(JSON_PATH_1, 'w', encoding='utf-8') as f:
        f.write(json_str)
    with open(JSON_PATH_2, 'w', encoding='utf-8') as f:
        f.write(json_str)
    print(f"✓ فایل‌های JSON در {JSON_PATH_1} و {JSON_PATH_2} به‌روزرسانی شدند.")

    # ۲. به‌روزرسانی guests_links.txt
    lines = [
        "=================================================================================",
        "✨ لیست لینک‌های اختصاصی کارت دعوت عروسی پانته‌آ و حسین ✨",
        f"آدرس پایه سایت: {BASE_URL}",
        f"تعداد کل مهمانان: {len(guests)} نفر / خانواده",
        "=================================================================================\n"
    ]

    for i, g in enumerate(guests, 1):
        comp_str = f" ({g['companions']})" if g['companions'] else ""
        side_str = f" [{g['side']}]" if g['side'] else ""
        lines.append(f"{i}. {g['name']}{comp_str}{side_str}")
        lines.append(f"   🔗 لینک اختصاصی: {BASE_URL}?to={g['id']}\n")

    lines.append("=================================================================================")
    lines.append("نکته: جهت ویرایش مهمانان، فایل guests.xlsx را ویرایش نموده و این اسکریپت را اجرا نمایید.")
    lines.append("=================================================================\n")

    with open(LINKS_TXT_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"✓ فایل {LINKS_TXT_PATH} ذخیره شد.")

    # ۳. به‌روزرسانی مستقیم guests.xlsx
    update_excel_with_links(guests, files, shared_strings)
    print("✓ کلیه مراحل با موفقیت به پایان رسید.")

if __name__ == '__main__':
    main()
