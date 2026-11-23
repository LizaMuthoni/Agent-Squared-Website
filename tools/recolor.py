import re,sys,os
root=sys.argv[1]
HEX={'06110d':'F1F5EC','0b1a14':'F8F9F4','11241b':'FFFFFF','1e3a2d':'D3DEC6','9db5a8':'5E574E','b6c9be':'3D3730',
'e4eee8':'2A2620','6bf0a8':'1D6A43','1fb57a':'1D6A43','f2b35c':'B85C44','eceee8':'1D6A43',
'138a5e':'8CC09C','0b3d2a':'C9D9B8','0e4b4f':'9EC0D6'}
RGB=[(r'11,\s*26,\s*20','248, 249, 244'),(r'6,\s*17,\s*13','241, 245, 236'),(r'157,\s*181,\s*168','94, 87, 78'),(r'11,\s*61,\s*42','201, 217, 184')]
def hx(m):
    v=m.group(1).lower(); a=m.group(2) or ''
    if v in HEX:
        out=HEX[v]; return '#'+(out if m.group(1).isupper() else out.lower())+a
    return m.group(0)
n=0
for d,_,fs in os.walk(root):
    for f in fs:
        if not f.endswith(('.html','.js','.css','.txt','.svg')): continue
        p=os.path.join(d,f); s=open(p,encoding='utf-8').read(); o=s
        s=re.sub(r'#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?\b',hx,s)
        for a,b in RGB: s=re.sub(r'(rgba?\(\s*)'+a,lambda m:m.group(1)+b,s); s=re.sub(r'(--(?:hull|abyss)-rgb:\s*)'+a,lambda m:m.group(1)+b,s)
        if s!=o: open(p,'w',encoding='utf-8').write(s); n+=1
print('files changed',n)
