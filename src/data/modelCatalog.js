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
  1001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1001.png'
};

export function resolveModelInput(input) {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  return MODEL_CATALOG[value.toUpperCase()] ?? null;
}

export default MODEL_CATALOG;
