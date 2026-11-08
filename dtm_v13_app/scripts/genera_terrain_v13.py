#!/usr/bin/env python3
"""Tile di terreno Terrarium (RGB, XYZ, z8-15) dal DEM v1.3 di Palermo, stesso formato di docs/tiles/terrain.
Eseguire: micromamba run -n qgis python -I genera_terrain_v13.py"""
import os, subprocess, tempfile, glob
import numpy as np
from osgeo import gdal
from PIL import Image
gdal.UseExceptions()
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
NEW = os.path.join(ROOT, 'dati', 'dtm_v1.3', 'palermo_dtm5m_v1.3.tif')
OUT = os.path.join(ROOT, 'dtm_v13_app', 'tiles', 'terrain_v13')
TMP = tempfile.mkdtemp(prefix='terr13_')
def sh(*a): subprocess.run([str(x) for x in a], check=True)

sh('gdalwarp','-q','-overwrite','-t_srs','EPSG:3857','-r','bilinear','-dstnodata',-9999,NEW,f'{TMP}/dem3857.tif')
d = gdal.Open(f'{TMP}/dem3857.tif'); z = d.ReadAsArray().astype('f8')
z = np.where(z < -9000, 0, z) + 32768.0           # fuori dato = 0 m
R = np.floor(z/256); G = np.floor(z % 256); B = np.floor((z - np.floor(z))*256)
rgb = gdal.GetDriverByName('GTiff').Create(f'{TMP}/terr.tif', d.RasterXSize, d.RasterYSize, 3, gdal.GDT_Byte)
rgb.SetGeoTransform(d.GetGeoTransform()); rgb.SetProjection(d.GetProjection())
for i, a in enumerate((R, G, B), 1): rgb.GetRasterBand(i).WriteArray(a.astype('u1'))
rgb = None
sh('rm','-rf',OUT); os.makedirs(OUT)
# 'near': niente interpolazione tra canali (romperebbe la codifica)
sh('gdal2tiles.py','--xyz','--profile=mercator','-z','8-15','-r','near','--processes=4','-w','none',f'{TMP}/terr.tif',OUT)
n = 0
for p in glob.glob(f'{OUT}/*/*/*.png'):
    im = np.array(Image.open(p).convert('RGBA'))
    m = im[..., 3] == 0
    im[m] = (128, 0, 0, 255)                       # bordo vuoto = 0 m, come i tile originali
    Image.fromarray(im[..., :3], 'RGB').save(p, optimize=True); n += 1
print('tile', n)
