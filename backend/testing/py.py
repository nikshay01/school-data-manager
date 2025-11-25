from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

# Data from the user's provided list
data = [
    ["Rank", "Name", "Marks"],
    ["1", "Deepika", "580"],
    ["2", "Deepshika", "577"],
    ["3", "Bulbul", "576"],
    ["4", "Ankita", "575"],
    ["5", "Mahipal", "567"],
    ["6", "Mokshika Jain", "566"],
    ["7", "Nidhi", "566"],
    ["8", "Hariom Prajapat", "563"],
    ["9", "Nikita", "560"],
    ["10", "Abhishek Mali", "557"],
    ["11", "Girish", "554"],
    ["12", "Divya", "553"],
    ["13", "Anil", "551"],
    ["14", "Muskaan", "550"],
    ["15", "Devendra", "545"],
    ["16", "Kuldeep", "545"],
    ["17", "Ankit", "543"],
    ["18", "Krinjal", "534"],
    ["19", "Mustafa", "533"],
    ["20", "Savita", "530"],
    ["21", "Ajay", "525"],
    ["22", "Varshabh", "521"],
    ["23", "Avni", "520"],
    ["24", "Ankit Joshi", "520"],
    ["25", "Nikshay", "517"],
    ["26", "Dilip", "514"],
    ["27", "Rishabh", "513"],
    ["28", "Sanjay", "505"],
    ["29", "Ajay Patidar", "503"],
    ["30", "Priyanshi", "502"],
    ["31", "Jay Singh", "499"],
    ["32", "Suraj", "499"],
    ["33", "Tulsi", "499"],
    ["34", "Ashutosh", "495"],
    ["35", "Mukesh Meena", "495"],
    ["36", "Ritesh Meena", "494"],
    ["37", "Dharamveer", "492"],
    ["38", "Shashank", "490"],
    ["39", "Yashkirti", "489"],
    ["40", "Harsh", "485"],
    ["41", "Hemant", "473"],
    ["42", "Ramkishan", "466"],
    ["43", "Alfez", "350"]
]

# Create the PDF
filename = "CORRECT.pdf"
pdf = SimpleDocTemplate(filename, pagesize=letter)
elements = []

# Styles
styles = getSampleStyleSheet()
title_style = styles['Title']
title = Paragraph("Class Marks Ranking (Full Correct List)", title_style)
elements.append(title)
elements.append(Spacer(1, 20))

# Create Table
table = Table(data)

# Add Style to Table
style = TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 12),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
])
table.setStyle(style)

elements.append(table)

# Build PDF
pdf.build(elements)

filename