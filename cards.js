function criaCarta(atributos) { // cria um objeto carta de acordo com os atributos
    const carta = {
      id: atributos[0],
      nome: atributos[1],
      anoLancamento: atributos[2],
      altitudeKm: atributos[3],
      nomeSensor: atributos[4],
      larguraDeFaixaKm: atributos[5],
      n_bandas: atributos[6],
      intervaloEspectral: atributos[7],
      resolucaoEspacial_m: atributos[8],
      quantizacao_bits: atributos[9],
      revisita_dias: atributos[10],
      distribuicao: atributos[11]
    }
    return carta;
  }
  
  function setAtributos(carta) { //contém todos atributos de carta
  
    carta.push(criaCarta([0, 'ADEOS 1', '1996', '797', 'AVNIR', 80, 1, 'PAN', 8, 12, 3, 'comercial']));
    carta.push(criaCarta([1, 'ALOS 3', '2006', '618', 'PRISM-2', 50, 7, 'VIS-NIR', 0.8, 11, 3, 'comercial']));
    carta.push(criaCarta([2, 'ALOS', '2006', '691', 'AVNIR-2', 70, 4, 'VIS-NIR', 10, 8, 2, 'comercial']));
    carta.push(criaCarta([3, 'CARTOSAT 2A', '2008', '637', 'PAN', 9.6, 1, 'PAN', 1, 10, 5, 'comercial']));
    carta.push(criaCarta([4, 'CARTOSAT 2B', '2008', '644', 'PAN', 9.6, 1, 'PAN', 0.8, 10, 5, 'comercial']));
    carta.push(criaCarta([5, 'KOMPSAT 2', '2006', '685', 'MSC', 15, 1, 'PAN', 1, 10, 4, 'comercial']));
    carta.push(criaCarta([6, 'NOAA 20', '2017', '834', 'VIIRS', 3000, 22, 'VIS-NIR-SWIR-MIR-TIR', 750, 14, 4, 'aberta']));
    carta.push(criaCarta([7, 'ADEOS 1', '1996', '797', 'AVNIR', 80, 1, 'PAN', 8, 12, 3, 'comercial']));
    carta.push(criaCarta([8, 'ALOS', '2006', '691', 'PRISM', 70, 1, 'PAN', 2.5, 8, 2, 'comercial']));
    carta.push(criaCarta([9, 'AMAZONIA 1', '2021', '752', 'WFI', 850, 4, 'VIS-NIR', 60, 10, 5, 'aberta']));
    carta.push(criaCarta([10, 'CARTOSAT 1', '2005', '622', 'PAN', 30, 1, 'PAN', 2.5, 10, 5, 'comercial']));
    carta.push(criaCarta([11, 'CARTOSAT 2', '2007', '641', 'PAN', 9.6, 1, 'PAN', 1, 10, 5, 'comercial']));
    carta.push(criaCarta([12, 'CBERS 1 2 2B', '1999, 2003, 2007', '778', 'WFI', 890, 2, 'VIS-NIR', 260, 8, 5, 'aberta']));
    carta.push(criaCarta([13, 'CBERS 1 2', '1999, 2003', '778', 'IRMSS', 120, 1, 'TIR', 160, 8, 26, 'aberta']));
    carta.push(criaCarta([14, 'CBERS 1 2', '1999, 2003', '778', 'IRMSS', 120, 3, 'PAN-MIR', 80, 8, 26, 'aberta']));
    carta.push(criaCarta([15, 'CBERS 1 2', '1999, 2003', '778', 'IRMSS', 120, 1, 'TIR', 160, 8, 26, 'aberta']));
    carta.push(criaCarta([16, 'CBERS 4', '2014', '778', 'IRS', 120, 3, 'PAN-SWIR', 80, 8, 26, 'aberta']));
    carta.push(criaCarta([17, 'CBERS 4', '2014', '778', 'IRS', 120, 1, 'TIR', 160, 8, 26, 'aberta']));
    carta.push(criaCarta([18, 'CBERS 1 2 2B', '1999, 2003 e 2007', '778', 'CCD', 113, 5, 'VIS-NIR', 20, 8, 26, 'aberta']));
    carta.push(criaCarta([19, 'CBERS 2B', '2007', '778', 'HRC', 27, 1, 'PAN', 2.7, 8, 26, 'aberta']));
    carta.push(criaCarta([20, 'CBERS 4', '2014', '778', 'MUXCAN', 120, 4, 'VIS-NIR', 20, 8, 26, 'aberta']));
    carta.push(criaCarta([21, 'CBERS 4', '2014', '778', 'PANMUX', 60, 1, 'PAN', 5, 8, 52, 'aberta']));
    carta.push(criaCarta([22, 'CBERS 4', '2014', '778', 'PANMUX', 60, 3, 'VIS-NIR', 10, 8, 52, 'aberta']));
    carta.push(criaCarta([23, 'CBERS 4', '2014', '778', 'WFI', 866, 4, 'VIS-NIR', 64, 10, 5, 'aberta']));
    carta.push(criaCarta([24, 'CBERS 4A', '2019', '628.6', 'MUX', 95, 4, 'VIS-NIR', 16.5, 8, 31, 'aberta']));
    carta.push(criaCarta([25, 'CBERS 4A', '2019', '628.6', 'WFI', 684, 4, 'VIS-NIR', 55, 10, 5, 'aberta']));
    carta.push(criaCarta([26, 'CBERS 4A', '2019', '628.6', 'WPM', 92, 4, 'VIS-NIR', 8, 10, 31, 'aberta']));
    carta.push(criaCarta([27, 'DUBAISAT 3', '2018', '613', 'KHCS', 12, 4, 'VIS-NIR', 2.98, 10, 8, 'comercial']));
    carta.push(criaCarta([28, 'GEOSAT 2', '2014', '620', 'HIRAIS', 12, 1, 'PAN', 0.75, 10, 2, 'comercial']));
    carta.push(criaCarta([29, 'CBERS 4A', '2019', '628.6', 'WPM', 92, 1, 'PAN', 2, 10, 31, 'aberta']));
    carta.push(criaCarta([30, 'DUBAISAT 1', '2009', '682', 'DMAC', 20, 1, 'PAN', 2.5, 8, 4, 'comercial']));
    carta.push(criaCarta([31, 'DUBAISAT 1', '2009', '682', 'DMAC', 20, 4, 'VIS-NIR', 5, 8, 4, 'comercial']));
    carta.push(criaCarta([32, 'DUBAISAT 2', '2013', '600', 'HIRAIS', 12, 4, 'VIS-NIR', 4, 10, 8, 'comercial']));
    carta.push(criaCarta([33, 'DUBAISAT 3', '2018', '613', 'KHCS', 12, 1, 'PAN', 0.75, 10, 8, 'comercial']));
    carta.push(criaCarta([34, 'ENVISAT', '2002', '780', 'MERIS', 1150, 15, 'VIS-NIR', 260, 12, 3, 'aberta']));
    carta.push(criaCarta([35, 'EO 1', '2000', '705', 'ALI', 37, 1, 'PAN', 10, 12, 16, 'aberta']));
    carta.push(criaCarta([36, 'EO 1', '2000', '705', 'ALI', 37, 9, 'VIS-NIR-MIR-SWIR', 30, 12, 16, 'aberta']));
    carta.push(criaCarta([37, 'EROS B', '2006', '500', 'PIC-2', 7, 1, 'PAN', 0.7, 10, 4, 'comercial']));
    carta.push(criaCarta([38, 'GEOEYE 1', '2008', '770', 'PAN', 15.2, 1, 'PAN', 0.41, 11, 3, 'comercial']));
    carta.push(criaCarta([39, 'GEOSAT 2', '2014', '620', 'HIRAIS', 12, 4, 'VIS-NIR', 4, 10, 2, 'comercial']));
    carta.push(criaCarta([40, 'KOMPSAT 3A', '2015', '685', 'AEISS-A', 15, 5, 'VIS-NIR-SWIR', 2.2, 14, 3, 'comercial']));
    carta.push(criaCarta([41, 'DOVE/PLANET', '2014 a 2022', '450 a 850', 'PS-2, PS-2-SD', 24, 4, 'VIS-NIR', 3, 12, 1, 'comercial']));
    carta.push(criaCarta([42, 'DUBAISAT 2', '2013', '600', 'HIRAIS', 12, 1, 'PAN', 1, 10, 8, 'comercial']));
    carta.push(criaCarta([43, 'EO 1', '2000', '705', 'HYPERION', 7.5, 220, 'VIS-NIR-SWIR-MIR-TIR', 30, 12, 16, 'aberta']));
    carta.push(criaCarta([44, 'FORMOSAT 2', '2004', '891', 'PAN', 24, 1, 'PAN', 2, 8, 1, 'comercial']));
    carta.push(criaCarta([45, 'FORMOSAT 2', '2004', '891', 'XS', 24, 4, 'VIS-NIR', 8, 8, 1, 'comercial']));
    carta.push(criaCarta([46, 'GEOEYE 1', '2008', '770', 'XS', 15.2, 4, 'VIS-NIR', 1.65, 11, 3, 'comercial']));
    carta.push(criaCarta([47, 'GEOSAT 1', '2009', '663', 'SLIM-6', 600, 3, 'VIS-NIR', 22, 10, 1, 'comercial']));
    carta.push(criaCarta([48, 'IKONOS 2', '1999', '681', 'XS', 11.3, 4, 'VIS-NIR', 3.28, 11, 5, 'comercial']));
    carta.push(criaCarta([49, 'IMS 1', '2008', '632', 'HYSI', 125, 64, 'VIS-NIR', 505, 10, 22, 'comercial']));
    carta.push(criaCarta([50, 'KOMPSAT 3A', '2015', '685', 'AEISS-A', 15, 1, 'PAN', 0.55, 14, 3, 'comercial']));
    carta.push(criaCarta([51, 'KOMPSAT 3A', '2015', '628', 'AEISS-A', 15, 1, 'PAN', 0.55, 14, 3, 'comercial']));
    carta.push(criaCarta([52, 'QUICKBIRD 2', '2001', '450', 'BGIS-2000', 16.5, 4, 'VIS-NIR', 2.44, 11, 3.5, 'comercial']));
    carta.push(criaCarta([53, 'IKONOS 2', '1999', '681', 'PAN', 11.3, 1, 'PAN', 0.82, 11, 5, 'comercial']));
    carta.push(criaCarta([54, 'IMS 1', '2008', '632', 'MXT', 151, 4, 'VIS-NIR', 37, 10, 22, 'comercial']));
    carta.push(criaCarta([55, 'KAZEOSAT 1', '2014', '750', 'NAOMI', 20, 1, 'PAN', 1, 12, 3, 'comercial']));
    carta.push(criaCarta([56, 'KAZEOSAT 1', '2014', '750', 'NAOMI', 20, 4, 'VIS-NIR', 4, 12, 3, 'comercial']));
    carta.push(criaCarta([57, 'KAZEOSAT 2', '2014', '630', 'KEIS', 77, 5, 'VIS-NIR', 6.5, 12, 3, 'comercial']));
    carta.push(criaCarta([58, 'KOMPSAT 2', '2006', '685', 'MSC', 15, 4, 'VIS-NIR', 4, 10, 4, 'comercial']));
    carta.push(criaCarta([59, 'KOMPSAT 3', '2012', '685', 'AEISS-A', 15, 4, 'VIS-NIR', 2.8, 14, 4, 'comercial']));
    carta.push(criaCarta([60, 'NOAA 15 16 17 18 19', '1998 a 2009', '807 a 870', 'AVHRR-3', 2700, 6, 'VIS-NIR-SWIR-MIR-TIR', 1090, 10, 1, 'comercial']));
    carta.push(criaCarta([61, 'OCEANSAT 2', '2009', '720', 'OCM-2', 1420, 8, 'VIS-NIR', 250, 12, 2, 'aberta']));
    carta.push(criaCarta([62, 'OCEANSAT', '1999', '720', 'OCM', 1420, 8, 'VIS-NIR', 250, 10, 2, 'aberta']));
    carta.push(criaCarta([63, 'QUICKBIRD 2', '2001', '450', 'BGIS-2000', 16.5, 1, 'PAN', 0.61, 11, 3.5, 'comercial']));
    carta.push(criaCarta([64, 'ZY 3A', '2012', '505', 'MSC', 51, 4, 'VIS-NIR', 5.8, 10, 5, 'comercial']));
    carta.push(criaCarta([65, 'LANDSAT 3', '1978', '917', 'MSS', 185, 5, 'VIS-NIR-TIR', 79, 8, 18, 'aberta']));
    carta.push(criaCarta([66, 'LANDSAT 9', '2021', '705', 'OLI-2', 185, 1, 'PAN', 15, 14, 8, 'aberta']));
    carta.push(criaCarta([67, 'LANDSAT 9', '2021', '705', 'TIRS', 185, 2, 'TIR', 100, 14, 8, 'aberta']));
    carta.push(criaCarta([68, 'PERÚSAT 1', '2016', '695', 'NAOMI', 60, 4, 'VIS-NIR', 10, 12, 3, 'aberta']));
    carta.push(criaCarta([69, 'PLÉIADES 1A 1B', '2011 e 2012', '694', 'HIRI', 20, 1, 'PAN', 0.5, 12, 1, 'comercial']));
    carta.push(criaCarta([70, 'PLÉIADES 1A 1B', '2011 e 2012', '694', 'HIRI', 20, 4, 'VIS-NIR', 2, 12, 1, 'comercial']));
    carta.push(criaCarta([71, 'PRISMA', '2019', '614', 'PRISMA', 30, 237, 'VIS-NIR-SWIR', 30, 12, 7, 'comercial']));
    carta.push(criaCarta([72, 'PRISMA', '2019', '614', 'PRISMA', 30, 1, 'PAN', 5, 12, 7, 'comercial']));
    carta.push(criaCarta([73, 'RAPIDEYE', '2008', '630', 'REIS', 77.25, 5, 'VIS-NIR', 5, 12, 1, 'comercial']));
    carta.push(criaCarta([74, 'SUPERVIEW 1', '2016 e 2018', '530', 'SV', 12, 4, 'VIS-NIR', 2, 11, 2, 'comercial']));
    carta.push(criaCarta([75, 'TERRA', '1999', '705', 'ASTER', 60, 4, 'VIS-NIR', 15, 8, 16, 'aberta']));
    carta.push(criaCarta([76, 'LANDSAT 1 2', '1972 e 1975', '917', 'MSS', 185, 4, 'VIS-NIR', 79, 6, 18, 'aberta']));
    carta.push(criaCarta([77, 'PERÚSAT 1', '2016', '695', 'NAOMI', 60, 1, 'PAN', 2.5, 12, 3, 'aberta']));
    carta.push(criaCarta([78, 'RESOURCESAT 2', '2011', '822', 'LISS-3', 141, 4, 'VIS-NIR-SWIR', 23.5, 10, 24, 'aberta']));
    carta.push(criaCarta([79, 'SKYSAT-C/PLANET', '2016 a 2020', '400 a 600', 'CMOS', 8, 4, 'VIS-NIR', 0.72, 8, 5, 'comercial']));
    carta.push(criaCarta([80, 'SSOT/FASAT-C', '2011', '630', 'NAOMI', 10.15, 1, 'PAN', 1.45, 12, 5, 'comercial']));
    carta.push(criaCarta([81, 'SSOT/FASAT-C', '2011', '630', 'NAOMI', 10.15, 4, 'VIS-NIR', 5.80, 12, 5, 'comercial']));
    carta.push(criaCarta([82, 'SUPERDOVE/PLANET', '2020 a 2023', '475 a 525', 'PS-B-SD', 32.5, 8, 'VIS-NIR', 3.7, 12, 1, 'comercial']));
    carta.push(criaCarta([83, 'SUPERVIEW 1', '2016 a 2018', '530', 'SV', 12, 1, 'PAN', 0.5, 11, 2, 'comercial']));
    carta.push(criaCarta([84, 'TERRA', '1999', '705', 'ASTER', 60, 6, 'SWIR', 30, 8, 16, 'aberta']));
    carta.push(criaCarta([85, 'TERRA', '1999', '705', 'MISR', 360, 4, 'VIS-NIR', 250, 12, 9, 'aberta']));
    carta.push(criaCarta([86, 'TERRA/AQUA', '1999 e 2002', '705', 'MODIS', 2330, 2, 'VIS-NIR', 250, 12, 2, 'aberta']));
    carta.push(criaCarta([87, 'TERRA/AQUA', '1999 e 2002', '705', 'MODIS', 2330, 29, 'VIS-NIR-SWIR-MIR-TIR', 1000, 12, 2, 'aberta']));
    carta.push(criaCarta([88, 'LANDSAT 1 2', '1972 e 1975', '917', 'RBV', 185, 3, 'VIS-NIR', 40, 6, 18, 'aberta']));
    carta.push(criaCarta([89, 'LANDSAT 3', '1978', '917', 'RBV', 185, 1, 'PAN', 30, 6, 18, 'aberta']));
    carta.push(criaCarta([90, 'LANDSAT 4 5', '1982 e 1984', '705', 'MSS', 185, 4, 'VIS-NIR', 79, 8, 16, 'aberta']));
    carta.push(criaCarta([91, 'LANDSAT 4 5', '1982 e 1984', '705', 'TM', 185, 7, 'VIS-NIR-SWIR-MIR-TIR', 30, 8, 16, 'aberta']));
    carta.push(criaCarta([92, 'LANDSAT 7', '1999', '705', 'ETM+', 183, 7, 'PAN-VIS-NIR-SWIR-MIR-TIR', 30, 8, 16, 'aberta']));
    carta.push(criaCarta([93, 'LANDSAT 8', '2013', '705', 'OLI', 185, 1, 'PAN', 15, 12, 16, 'aberta']));
    carta.push(criaCarta([94, 'LANDSAT 8', '2013', '705', 'TIRS', 185, 2, 'TIR', 100, 12, 16, 'aberta']));
    carta.push(criaCarta([95, 'LANDSAT 9', '2021', '705', 'OLI-2', 185, 8, 'VIS-NIR-SWIR', 30, 14, 8, 'aberta']));
    carta.push(criaCarta([96, 'SKYSAT-C/PLANET', '2016 a 2020', '400 a 600', 'CMOS', 8, 1, 'PAN', 0.58, 8, 5, 'comercial']));
    carta.push(criaCarta([97, 'TERRA', '1999', '705', 'ASTER', 60, 5, 'TIR', 90, 12, 16, 'aberta']));
    carta.push(criaCarta([98, 'TERRA/AQUA', '1999 e 2002', '705', 'MODIS', 2330, 5, 'VIS-NIR-SWIR', 500, 12, 2, 'aberta']));
    carta.push(criaCarta([99, 'WORLDVIEW 2', '2009', '770', 'SPACEVIEW_WV110', 16.4, 1, 'PAN', 0.46, 11, 1, 'comercial']));
    carta.push(criaCarta([100, 'LANDSAT 7', '1999', '705', 'ETM+', 183, 1, 'PAN', 15, 8, 16, 'aberta']));
    carta.push(criaCarta([101, 'LANDSAT 7', '1999', '705', 'ETM+', 183, 7, 'VIS-NIR-SWIR-MIR-TIR', 30, 8, 16, 'aberta']));
    carta.push(criaCarta([102, 'LANDSAT 8', '2013', '705', 'OLI', 185, 8, 'VIS-NIR-SWIR', 30, 12, 16, 'aberta']));
    carta.push(criaCarta([103, 'RESOURCESAT 1', '2003', '817', 'LISS-3', 141, 4, 'VIS-NIR-SWIR', 23.5, 7, 24, 'aberta']));
    carta.push(criaCarta([104, 'SENTINEL 3A 3B', '2016 e 2018', '815', 'OLCI', 1270, 21, 'VIS-NIR', 300, 12, 27, 'comercial']));
    carta.push(criaCarta([105, 'SENTINEL 3A 3B', '2016 e 2018', '815', 'SLSTR', 1420, 6, 'VIS-NIR-SWIR', 500, 10, 1, 'comercial']));
    carta.push(criaCarta([106, 'SPOT 1 2 3', '1986, 1990 e 1993', '832', 'HRV', 117, 4, 'VIS-NIR', 20, 8, 26, 'comercial']));
    carta.push(criaCarta([107, 'SPOT 4', '1998', '835', 'HRVIR', 117, 4, 'VIS-NIR-SWIR', 20, 8, 26, 'comercial']));
    carta.push(criaCarta([108, 'SPOT 5', '2002', '835', 'HRG', 117, 1, 'PAN', 2.5, 8, 3, 'comercial']));
    carta.push(criaCarta([109, 'SPOT 5', '2002', '835', 'HRG', 117, 5, 'VIS-NIR-SWIR', 10, 8, 3, 'comercial']));
    carta.push(criaCarta([110, 'WORLDVIEW 2', '2009', '770', 'SPACEVIEW_WV110', 16.4, 8, 'VIS-NIR', 1.84, 11, 1, 'comercial']));
    carta.push(criaCarta([111, 'RESOURCESAT 2', '2011', '822', 'AWIFS', 740, 4, 'VIS-NIR-SWIR', 56, 12, 5, 'aberta']));
    carta.push(criaCarta([112, 'RESOURCESAT 2', '2011', '822', 'LISS-4', 70.3, 1, 'PAN', 5.8, 10, 5, 'aberta']));
    carta.push(criaCarta([113, 'SENTINEL 2A 2B', '2015 e 2017', '786', 'MSI', 290, 6, 'VIS-NIR-SWIR', 20, 12, 5, 'aberta']));
    carta.push(criaCarta([114, 'SENTINEL 2A 2B', '2015 e 2017', '786', 'MSI', 290, 3, 'VIS-NIR-SWIR', 60, 12, 5, 'aberta']));
    carta.push(criaCarta([115, 'SPOT 4 5', '1998 e 2002', '835', 'VEGETATION', 2250, 4, 'VIS-NIR-SWIR', 1150, 8, 1, 'comercial']));
    carta.push(criaCarta([116, 'SPOT 5', '2002', '835', 'HRS', 120, 1, 'PAN', 5, 8, 26, 'comercial']));
    carta.push(criaCarta([117, 'SPOT 6 7', '2012 e 2014', '694', 'NAOMI', 117, 4, 'VIS-NIR', 6, 12, 3, 'comercial']));
    carta.push(criaCarta([118, 'WORLDVIEW 3', '2014', '617', 'CAVIS', 13.1, 12, 'VIS-NIR-SWIR', 30, 11, 1, 'comercial']));
    carta.push(criaCarta([119, 'WORLDVIEW 3', '2014', '617', 'SPACEVIEW_WV110', 13.1, 1, 'PAN', 0.31, 11, 1, 'comercial']));
    carta.push(criaCarta([120, 'WORLDVIEW 4', '2014', '617', 'SPACEVIEW_WV110', 13.1, 8, 'VIS-NIR', 1.24, 11, 1, 'comercial']));
    carta.push(criaCarta([121, 'WORLDVIEW 4', '2016', '617', 'SPACEVIEW_WV110', 13.1, 1, 'PAN', 0.31, 11, 1, 'comercial']));
    carta.push(criaCarta([122, 'WORLDVIEW 4', '2016', '617', 'SPACEVIEW_WV110', 13.1, 4, 'VIS-NIR', 1.24, 11, 1, 'comercial']));
    carta.push(criaCarta([123, 'RESOURCESAT 1', '2003', '817', 'AWIFS', 740, 4, 'VIS-NIR-SWIR', 56, 10, 5, 'aberta']));
    carta.push(criaCarta([124, 'RESOURCESAT 1', '2003', '817', 'LISS-4', 70.3, 1, 'PAN', 5.8, 7, 5, 'aberta']));
    carta.push(criaCarta([125, 'RESOURCESAT 1', '2003', '817', 'LISS-4', 70.3, 3, 'VIS-NIR', 5.8, 7, 5, 'aberta']));
    carta.push(criaCarta([126, 'RESOURCESAT 2', '2011', '822', 'LISS-4', 70.3, 3, 'VIS-NIR', 5.8, 10, 5, 'aberta']));
    carta.push(criaCarta([127, 'SENTINEL 2A 2B', '2015 e 2017', '786', 'MSI', 290, 4, 'VIS-NIR', 10, 12, 5, 'aberta']));
    carta.push(criaCarta([128, 'SENTINEL 3A 3B', '2016 e 2018', '815', 'SLSTR', 1420, 5, 'TIR', 1000, 10, 1, 'comercial']));
    carta.push(criaCarta([129, 'SPOT 1 2 3', '1986, 1990 e 1993', '832', 'HRV', 117, 1, 'PAN', 10, 6, 26, 'comercial']));
    carta.push(criaCarta([130, 'SPOT 4', '1998', '835', 'HRVIR', 117, 1, 'PAN', 10, 8, 26, 'comercial']));
    carta.push(criaCarta([131, 'SPOT 6 7', '2012 e 2014', '694', 'NAOMI', 117, 1, 'PAN', 1.5, 12, 3, 'comercial']));
    carta.push(criaCarta([132, 'WORLDVIEW 1', '2007', '496', 'WV60', 17.6, 1, 'PAN', 0.50, 11, 2, 'comercial']));
    carta.push(criaCarta([133, 'WORLDVIEW 3', '2014', '617', 'SWIR', 13.1, 8, 'SWIR', 3.7, 14, 1, 'comercial']));
  }