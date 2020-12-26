from PIL import Image
import os
image = Image.open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'qrcode.jpg'))
fn = lambda x: 255 if x > 220 else 0

qrcode_coords = (438, 152, 701, 415)
if os.name == 'nt':
    qrcode_coords = (440, 152, 703, 415)

qrcode = image.crop(qrcode_coords).convert('L').point(fn, mode = '1').resize((270, 270), Image.BILINEAR)
list_output = []
text_output = ''

for fy in range(int(qrcode.size[1] / 6)):
    y = fy * 6
    list_output.append([])
    for fx in range(int(qrcode.size[0] / 6)):
        x = fx * 6
        
        pixel_total = 0
        for dy in range(5):
            for dx in range(5):
                pixel_total += qrcode.getpixel((x + dx, y + dy))

        if pixel_total < 1800:
            list_output[fy].append(0)
        else:
            list_output[fy].append(1)

text_output += '▄' * (len(list_output[0]) + 2) + '\n'
for double_column in range(int(len(list_output) / 2 + len(list_output) % 2)):
    try:
        first_column = list_output[2 * double_column]
    except: pass
    
    try:
        second_column = list_output[2 * double_column + 1]
    except: second_column = [1 for x in range(len(list_output[0]))]

    text_output += '█'
    for i in range(len(first_column)):
        if first_column[i] == 0 and second_column[i] == 0: text_output += ' '
        if first_column[i] == 1 and second_column[i] == 0: text_output += '▀'
        if first_column[i] == 0 and second_column[i] == 1: text_output += '▄'
        if first_column[i] == 1 and second_column[i] == 1: text_output += '█'
    text_output += '█\n'

with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'qrcode.txt'), 'w', encoding = 'utf-8') as file:
    file.write(text_output)
