const MODEL_CATALOG = {
  1012: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/1012.png',
  ANI001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI001(GOJO_SARUTO_HALF).stl',
  ANI002: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI002(KAKASHI_HALF).stl',
  ANI003: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI003(NAROTO_ACTION).stl',
  ANI004: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI004(OBITOHALF).stl',
  ANI005: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI005(SASKE_FULL).stl',
  ANI006: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI006(MONKEY%20D%20LUFFI%20HALF).stl',
  ANI007: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI007(PAIN%20HALF%20).stl',
  ANI008: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI008(Madara_Uchiha%20HALF%20).stl',
  ANI009: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI009(ITACHI%20HALF%20).stl',
  ANI0010: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI0010(SASKE%20%20HALF%20).stl',
  ANI0012: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI0012(GOKU%20HALF%20%20).stl',
  ANI013: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI013(TANJIRO%20%20HALF%20)%20.stl',
  ANI014: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI014(Levi%20HALF%20).stl',
  ANI015: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI015(ZINATSU_HALF).stl',
  ANI016: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI016%20(INOSKE%20HALF%20).stl',
  ANI017: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/ANI017(ZORO%20HALF).stl',
  DCM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/DCM001(JOKER_MODEL).stl',
  GH001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/GH001(GOD_HANUMAN).stl',
  FIM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/FIM001(FEMALE%20IAS%20OFFICER%20MODEL%20HALF).stl',
  FLM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/FLM001(FEMALE%20LAWYER%20MODEL%20HALF).stl',
  MAM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MAM001(MALE%20ARMY%20HALF).stl',
  MDR001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MDR001%20(MEN%20DOCTOR%202%20HALF%20).stl',
  'MDR001-2': 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MDR001(man_doctor_longstand).stl',
  MIM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MIM001(MALE%20IAS%20HALF%201%20).stl',
  MLM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MLM001(MALE%20LAWYER%20HALF%201%20).stl',
  MPM001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/MPM001(MALE%20POLICE%20HALF).stl',
  WDR001: 'https://miniaturewala-prod-sgp1-assets.sgp1.cdn.digitaloceanspaces.com/readymademiniature/painting/WDR001(WOMEN%20DOCTOR%201%20HALF%20).stl',
};

export function resolveModelInput(input) {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  return MODEL_CATALOG[value.toUpperCase()] ?? null;
}

export default MODEL_CATALOG;
