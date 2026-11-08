#!/usr/bin/env python3
"""Confronto HR-DTM-5m v1.1 (dati/palermo_dtm5m.tif) vs v1.3 (dati/dtm_v1.3/...).
Produce: tile TMS z8-15 (diff quota, diff pendenza, rilievo v1.3), stats.json, fonti.geojson.
Eseguire nell'env qgis:  micromamba run -n qgis python -I genera_confronto.py
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from osgeo import gdal, ogr, osr
gdal.UseExceptions(); ogr.UseExceptions()

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
APP  = os.path.join(ROOT, 'dtm_v13_app')
OLD  = os.path.join(ROOT, 'dati', 'palermo_dtm5m.tif')
NEW  = os.path.join(ROOT, 'dati', 'dtm_v1.3', 'palermo_dtm5m_v1.3.tif')
MASK = os.path.join(ROOT, 'dati', 'dtm_v1.3', 'HRDTM5m_Mask_20mres.gpkg')
UPL  = os.path.join(ROOT, 'docs', 'geojson', 'upl.geojson')
TMP  = tempfile.mkdtemp(prefix='dtm13_')
def sh(*a): subprocess.run([str(x) for x in a], check=True)
def read(p): return gdal.Open(p).ReadAsArray().astype('f8')

# ── griglia di riferimento = v1.1 (nodata fuori dal confine comunale) ──
o = gdal.Open(OLD); gt = o.GetGeoTransform(); W, H = o.RasterXSize, o.RasterYSize
xmin, ymax = gt[0], gt[3]; xmax, ymin = xmin + gt[1]*W, ymax + gt[5]*H
A = read(OLD); va = A > -9000                       # comune
nd = o.GetRasterBand(1).GetNoDataValue()

# v1.3 sulla griglia v1.1 (bilineare)
NEWr = f'{TMP}/new_on_old.tif'
sh('gdalwarp','-q','-overwrite','-te',xmin,ymin,xmax,ymax,'-ts',W,H,'-r','bilinear','-dstnodata',-9999,NEW,NEWr)
B = read(NEWr)
vb = va & (B > -9000)
dz = np.where(vb, B - A, np.nan)

# pendenza v1.1 e v1.3 (v1.3 calcolata sul DEM nativo, poi portata sulla griglia v1.1)
sh('gdaldem','slope','-compute_edges',OLD,f'{TMP}/slope_old.tif')
sh('gdaldem','slope','-compute_edges',NEW,f'{TMP}/slope_new_native.tif')
sh('gdalwarp','-q','-overwrite','-te',xmin,ymin,xmax,ymax,'-ts',W,H,'-r','bilinear','-dstnodata',-9999,f'{TMP}/slope_new_native.tif',f'{TMP}/slope_new.tif')
S1, S2 = read(f'{TMP}/slope_old.tif'), read(f'{TMP}/slope_new.tif')
ds = np.where(va & (S1 > -9000) & (S2 > -9000), S2 - S1, np.nan)

# ── RGBA classificati ──
def rgba(arr, breaks, cols, tol):
    """breaks crescenti (negativi e positivi), tol = soglia di trasparenza centrale."""
    out = np.zeros(arr.shape + (4,), np.uint8)
    ok = np.isfinite(arr)
    idx = np.digitize(np.nan_to_num(arr), breaks)       # 0..len(breaks)
    for i, c in enumerate(cols):
        m = ok & (idx == i)
        out[m, :3] = c; out[m, 3] = 235
    out[ok & (np.abs(arr) < tol)] = 0                   # differenze trascurabili: trasparente
    return out
DZ_BREAKS = [-5, -2, -0.5, 0.5, 2, 5]
DZ_COLS = [(5,48,97),(33,102,172),(146,197,222),(0,0,0),(244,165,130),(214,96,77),(103,0,31)]
DS_BREAKS = [-8, -3, -1, 1, 3, 8]
DS_COLS = [(0,68,27),(27,120,55),(127,191,123),(0,0,0),(175,141,195),(118,42,131),(64,0,75)]
def write_rgba(path, data):
    d = gdal.GetDriverByName('GTiff').Create(path, W, H, 4, gdal.GDT_Byte, ['COMPRESS=DEFLATE'])
    d.SetGeoTransform(gt); d.SetProjection(o.GetProjection())
    for b in range(4):
        d.GetRasterBand(b+1).WriteArray(data[..., b])
        d.GetRasterBand(b+1).SetColorInterpretation([gdal.GCI_RedBand,gdal.GCI_GreenBand,gdal.GCI_BlueBand,gdal.GCI_AlphaBand][b])
    d = None
write_rgba(f'{TMP}/dz_rgba.tif', rgba(dz, DZ_BREAKS, DZ_COLS, 0.5))
write_rgba(f'{TMP}/ds_rgba.tif', rgba(ds, DS_BREAKS, DS_COLS, 1.0))

# ── rilievo v1.3: stessa ricetta di genera_rilievo.sh, DEM v1.3 nativo mascherato dal comune ──
n = gdal.Open(NEW); ng = n.GetGeoTransform()
# maschera comune sulla griglia nativa v1.3 (vecchio DEM ricampionato 'near')
sh('gdalwarp','-q','-overwrite','-te',ng[0],ng[3]+ng[5]*n.RasterYSize,ng[0]+ng[1]*n.RasterXSize,ng[3],'-ts',n.RasterXSize,n.RasterYSize,'-r','near','-dstnodata',-9999,OLD,f'{TMP}/old_native.tif')
N = n.ReadAsArray().astype('f8'); ON = gdal.Open(f'{TMP}/old_native.tif').ReadAsArray().astype('f8')
Nm = np.where(ON > -9000, N, -9999)
d = gdal.GetDriverByName('GTiff').Create(f'{TMP}/new_masked.tif', n.RasterXSize, n.RasterYSize, 1, gdal.GDT_Float32)
d.SetGeoTransform(ng); d.SetProjection(n.GetProjection()); d.GetRasterBand(1).SetNoDataValue(-9999); d.GetRasterBand(1).WriteArray(Nm); d = None
sh('gdalwarp','-q','-overwrite','-t_srs','EPSG:3857','-r','bilinear','-dstnodata',-9999,f'{TMP}/new_masked.tif',f'{TMP}/dem_3857.tif')
sh('gdaldem','hillshade','-multidirectional','-z',1.5,'-compute_edges',f'{TMP}/dem_3857.tif',f'{TMP}/hs.tif')
sh('gdal_calc.py','--quiet','-A',f'{TMP}/dem_3857.tif','--calc=255*(A>-9000)','--NoDataValue=0','--type=Byte','--outfile',f'{TMP}/alpha.tif')
sh('gdalbuildvrt','-q','-separate',f'{TMP}/rgba.vrt',f'{TMP}/hs.tif',f'{TMP}/hs.tif',f'{TMP}/hs.tif',f'{TMP}/alpha.tif')
v = gdal.Open(f'{TMP}/rgba.vrt', gdal.GA_Update)
for i, c in enumerate([gdal.GCI_RedBand,gdal.GCI_GreenBand,gdal.GCI_BlueBand,gdal.GCI_AlphaBand], 1): v.GetRasterBand(i).SetColorInterpretation(c)
v = None

# ── tile ──
def tiles(src, name, warp=True):
    out = f'{APP}/tiles/{name}'
    sh('rm','-rf',out); os.makedirs(out)
    s = src
    if warp:
        s = f'{TMP}/{name}_3857.tif'
        sh('gdalwarp','-q','-overwrite','-t_srs','EPSG:3857','-r','average','-wo','NUM_THREADS=4',src,s)
    sh('gdal2tiles.py','--profile=mercator','-z','8-15','-r','bilinear','--processes=4','-w','none',s,out)
tiles(f'{TMP}/dz_rgba.tif','diff_quota')
tiles(f'{TMP}/ds_rgba.tif','diff_pendenza')
tiles(f'{TMP}/rgba.vrt','rilievo_v13', warp=False)

# ── statistiche ──
def pct(m, tot): return round(100.0 * m / tot, 2)
tot = int(vb.sum())
cell_km2 = abs(gt[1]*gt[5]) / 1e6
def classes(arr, breaks):
    idx = np.digitize(arr[np.isfinite(arr)], breaks)
    return [pct((idx == i).sum(), tot) for i in range(len(breaks)+1)]
stats = {
  'celle_comune': tot, 'area_km2': round(tot*cell_km2, 2),
  'dz': {'media': round(float(np.nanmean(dz)),3), 'std': round(float(np.nanstd(dz)),3),
         'min': round(float(np.nanmin(dz)),1), 'max': round(float(np.nanmax(dz)),1),
         'breaks': DZ_BREAKS, 'classi_pct': classes(dz, DZ_BREAKS),
         'oltre': {str(t): pct((np.abs(dz[np.isfinite(dz)]) > t).sum(), tot) for t in (0.5,1,2,5)}},
  'ds': {'media': round(float(np.nanmean(ds)),3), 'std': round(float(np.nanstd(ds)),3),
         'pendenza_media_v11': round(float(np.nanmean(np.where(va & (S1>-9000), S1, np.nan))),2),
         'pendenza_media_v13': round(float(np.nanmean(np.where(va & (S2>-9000), S2, np.nan))),2),
         'breaks': DS_BREAKS, 'classi_pct': classes(ds, DS_BREAKS)},
  'fuori_comune': {'celle_v13_valide': int(((~va) & (B > -9000)).sum()),
                   'quota_media': round(float(B[(~va)&(B>-9000)].mean()),1),
                   'quota_<=1m_pct': pct(((~va)&(B>-9000)&(B<=1)).sum(), int(((~va)&(B>-9000)).sum()))},
}
# per fascia di quota
fasce = []
for lo, hi in [(-50,5),(5,50),(50,200),(200,500),(500,1100)]:
    k = vb & (A >= lo) & (A < hi); x = dz[k]
    fasce.append({'da':lo,'a':hi,'celle':int(k.sum()),'media':round(float(x.mean()),2),'p95_abs':round(float(np.percentile(np.abs(x),95)),2)})
stats['fasce_quota'] = fasce

# per UPL
src = ogr.Open(UPL); lyr = src.GetLayer(0)
sr_t = osr.SpatialReference(); sr_t.ImportFromWkt(o.GetProjection()); sr_t.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
sr_s = osr.SpatialReference(); sr_s.ImportFromEPSG(4326); sr_s.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
ct = osr.CoordinateTransformation(sr_s, sr_t)
mem = ogr.GetDriverByName('Memory').CreateDataSource('m'); ml = mem.CreateLayer('u', sr_t, ogr.wkbMultiPolygon)
ml.CreateField(ogr.FieldDefn('id', ogr.OFTInteger)); names = {}
for i, f in enumerate(lyr, 1):
    g = f.GetGeometryRef().Clone(); g.Transform(ct)
    nf = ogr.Feature(ml.GetLayerDefn()); nf.SetField('id', i); nf.SetGeometry(g); ml.CreateFeature(nf)
    names[i] = (f['UPL'], f['circoscrizione'])
rd = gdal.GetDriverByName('MEM').Create('', W, H, 1, gdal.GDT_Int16); rd.SetGeoTransform(gt); rd.SetProjection(o.GetProjection())
gdal.RasterizeLayer(rd, [1], ml, options=['ATTRIBUTE=id']); R = rd.ReadAsArray()
upl = []
for i, (nm, circ) in names.items():
    k = (R == i) & vb
    if k.sum() < 200: continue
    x, y = dz[k], ds[k]
    upl.append({'upl': nm, 'circ': circ, 'area_km2': round(float(k.sum()*cell_km2),2),
                'dz_media': round(float(np.nanmean(x)),2), 'dz_abs_media': round(float(np.nanmean(np.abs(x))),2),
                'pct_oltre2m': round(100*float((np.abs(x)>2).mean()),2), 'ds_media': round(float(np.nanmean(y)),2)})
upl.sort(key=lambda r: -r['pct_oltre2m'])
stats['upl'] = upl
json.dump(stats, open(f'{APP}/data/stats.json','w'), ensure_ascii=False, indent=1)

# ── fonti (maschera GPKG) ritagliata su Palermo, WGS84 ──
sh('rm','-f',f'{APP}/data/fonti_dtm.geojson')
sh('ogr2ogr','-f','GeoJSON','-t_srs','EPSG:4326','-clipsrc',xmin,ymin,xmax,ymax,'-lco','COORDINATE_PRECISION=5',f'{APP}/data/fonti_dtm.geojson',MASK,'simplified')
print('OK', json.dumps({k: stats[k] for k in ('celle_comune','area_km2','fuori_comune')}, ensure_ascii=False))
