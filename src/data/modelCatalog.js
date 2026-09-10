const MODEL_CATALOG = {
  1012: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1012.png',
  DMM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/DMM001.png',
  DWM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/DWM001.png',
  1013: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1013.png',
  1014: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1014.png',
  WDr001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/GirlDoctor.glb',
  2004: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/boyDoctor.glb',
  SU001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/saska.glb',
  2003: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/hanuman.glb',
  2003: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/hanuman.glb',
  1001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1001.png',
  ANI001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI001.glb',
  ANI002: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI002.glb',
  ANI004: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI004.glb',
  ANI006: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI006.glb',
  ANI008: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI008.glb',
  ANI009: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI009.glb',
  ANI0012: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI012.glb',
  ANI0015: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI015.glb',
  DMM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/DMM001.glb',
  DWM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/DWM001.glb',
  FIM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/FIM001.glb',
  FLM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/FLM001.glb',
  MDR002: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MDR002.glb',
  MPM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MPM001.glb',
  WDR002: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/WDR002.glb',
  AD003: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/AD003.jpeg', 
  AD001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/AD001.png',
  AD002: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/AD002.png',
  1015: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/1015.png',
  1018: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1018.png',
  1019: 'https://miniaturewala-prod-sgp1-assets.sgp1.digitaloceanspaces.com/readymademiniature/1019.png',
  1016: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/1016.png'
};

export function resolveModelInput(input) {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  return MODEL_CATALOG[value.toUpperCase()] ?? null;
}

export default MODEL_CATALOG;
