#!/usr/bin/env python3
"""Audit review patch against its declared Git base; run from repository root."""
import collections, datetime, hashlib, json, pathlib, re, subprocess, sys
import yaml
ROOT=pathlib.Path('.'); BASE='387e72887d6bcfccaa0bfdee2ddf1aa7dada776b'; AS_OF=datetime.date(2026,10,15)
def parse(s): return yaml.safe_load(s.split('---',2)[1])
def norm(x): return str(x) if x is not None else None
errors=[];posts=[];before=[]
for p in sorted(ROOT.glob('src/content/posts/*.md')):
 oldtext=subprocess.check_output(['git','show',f'{BASE}:{p}'],text=True);old=parse(oldtext);new=parse(p.read_text());before.append(old)
 for k in ['publishDate','slug','oldUrl','draft']:
  if norm(old.get(k))!=norm(new.get(k)):errors.append(f'{p.name}: protected {k} changed')
 for k in ['title','description','seoTitle']:
  if not new.get(k):errors.append(f'{p.name}: missing {k}')
 if len(new.get('faq',[]))<2:errors.append(f'{p.name}: fewer than 2 FAQs')
 if oldtext==p.read_text():errors.append(f'{p.name}: not revised')
 cover=new.get('cover');asset=ROOT/'public'/str(cover).lstrip('/')
 if not cover or not asset.is_file():errors.append(f'{p.name}: missing cover')
 if cover and '/editorial/' in cover and not new.get('coverCredit'):errors.append(f'{p.name}: external photo missing attribution')
 if str(new['publishDate'])<=str(AS_OF) and str(new.get('updated'))!='2026-10-15':errors.append(f'{p.name}: published revision lacks updated date')
 posts.append({'file':p.name,**new})
def covers(rows):
 paths=collections.defaultdict(list);hashes=collections.defaultdict(list);missing=[]
 for x in rows:
  cover=x.get('cover');asset=ROOT/'public'/str(cover).lstrip('/')
  if not cover or not asset.is_file():missing.append(x.get('file',x['title']));continue
  paths[str(asset)].append(x.get('file',x['title']));hashes[hashlib.sha256(asset.read_bytes()).hexdigest()].append(x.get('file',x['title']))
 return {'missing':missing,'repeated_paths':[v for v in paths.values() if len(v)>1],'identical_bytes':[v for v in hashes.values() if len(v)>1]}
result={'base':BASE,'as_of':str(AS_OF),'total':len(posts),'scheduled':[{'file':x['file'],'publishDate':str(x['publishDate'])} for x in posts if str(x['publishDate'])>str(AS_OF)], 'before':covers(before),'after':covers(posts),'errors':errors}
path=ROOT/'docs/editorial-review/validation.json';path.write_text(json.dumps(result,ensure_ascii=False,indent=2,default=str)+'\n')
print(json.dumps({'total':len(posts),'scheduled':len(result['scheduled']),'errors':errors,'before':{k:len(v) for k,v in result['before'].items()},'after':{k:len(v) for k,v in result['after'].items()}},ensure_ascii=False,indent=2));sys.exit(bool(errors))
