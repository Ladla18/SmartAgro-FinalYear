// Disease database containing comprehensive information about various crop diseases
const diseaseDatabase = {
  // =================== CEREALS & MILLETS ===================
  // Rice Diseases
  Rice_Blast: {
    description:
      "Fungal disease causing diamond-shaped lesions on leaves and stems",
    treatments: [
      "Use resistant rice varieties",
      "Apply systemic fungicides like Tricyclazole",
      "Maintain proper spacing between plants",
      "Avoid excess nitrogen fertilization",
    ],
    severity: "High",
    symptoms: [
      "Diamond-shaped lesions with dark borders",
      "White to gray center in lesions",
      "Broken or dead panicles",
      "Reduced grain quality",
    ],
    crop: "Rice",
    season: ["Kharif", "Rabi"],
    pathogen: "Magnaporthe oryzae (fungus)",
  },
  Rice_Blast: {
    description:
      "Fungal disease causing diamond-shaped lesions on leaves and stems",
    treatments: [
      "Use resistant rice varieties",
      "Apply systemic fungicides like Tricyclazole",
      "Maintain proper spacing between plants",
      "Avoid excess nitrogen fertilization",
    ],
    severity: "High",
    symptoms: [
      "Diamond-shaped lesions with dark borders",
      "White to gray center in lesions",
      "Broken or dead panicles",
      "Reduced grain quality",
    ],
    crop: "Rice",
    season: ["Kharif", "Rabi"],
    pathogen: "Magnaporthe oryzae (fungus)",
  },
  Rice_Brown_Spot: {
    description: "Fungal disease causing oval brown spots on leaves",
    treatments: [
      "Use balanced fertilization",
      "Apply fungicides like Mancozeb",
      "Use disease-free seeds",
      "Proper water management",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Oval brown spots on leaves",
      "Dark brown lesions on grains",
      "Yellowing of leaves",
      "Reduced grain quality",
    ],
    crop: "Rice",
    season: ["Kharif"],
    pathogen: "Cochliobolus miyabeanus (fungus)",
  },
  Rice_Bacterial_Leaf_Blight: {
    description:
      "Bacterial disease causing yellow to white lesions along leaf veins",
    treatments: [
      "Plant resistant varieties",
      "Use copper-based bactericides",
      "Avoid dense planting",
      "Remove infected plant debris",
    ],
    severity: "High",
    symptoms: [
      "Yellow to white lesions along leaf veins",
      "Wilting of seedlings",
      "Greyish margins on leaves",
      "Drying of leaves",
    ],
    crop: "Rice",
    season: ["Kharif", "Rabi"],
    pathogen: "Xanthomonas oryzae pv. oryzae (bacteria)",
  },

  // Wheat Diseases
  Wheat_Stem_Rust: {
    description: "Fungal disease causing reddish-brown pustules on stems",
    treatments: [
      "Plant resistant varieties",
      "Early planting",
      "Fungicide application with Tebuconazole",
      "Remove alternate hosts like barberry",
    ],
    severity: "Very High",
    symptoms: [
      "Reddish-brown pustules on stems",
      "Weakened stems",
      "Lodging",
      "Shriveled grains",
    ],
    crop: "Wheat",
    season: ["Rabi"],
    pathogen: "Puccinia graminis f. sp. tritici (fungus)",
  },
  Wheat_Leaf_Rust: {
    description:
      "Fungal disease causing small round orange-brown pustules on leaves",
    treatments: [
      "Plant resistant varieties",
      "Apply fungicides like Propiconazole",
      "Early sowing",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Small round orange-brown pustules",
      "Pustules primarily on upper leaf surface",
      "Chlorosis around pustules",
      "Reduced photosynthesis",
    ],
    crop: "Wheat",
    season: ["Rabi"],
    pathogen: "Puccinia triticina (fungus)",
  },
  Wheat_Powdery_Mildew: {
    description:
      "Fungal disease causing white powdery growth on leaves and stems",
    treatments: [
      "Apply sulfur-based fungicides",
      "Use resistant varieties",
      "Proper spacing for air circulation",
      "Balanced fertilization",
    ],
    severity: "Moderate to High",
    symptoms: [
      "White powdery coating on leaves",
      "Stunted growth",
      "Yellowing of leaves",
      "Reduced yield",
    ],
    crop: "Wheat",
    season: ["Rabi"],
    pathogen: "Blumeria graminis f. sp. tritici (fungus)",
  },

  // Maize (Corn) Diseases
  Maize_Northern_Leaf_Blight: {
    description: "Fungal disease causing long elliptical gray-green lesions",
    treatments: [
      "Plant resistant hybrids",
      "Apply foliar fungicides like Azoxystrobin",
      "Crop rotation",
      "Tillage to reduce residue",
    ],
    severity: "High",
    symptoms: [
      "Long elliptical lesions",
      "Gray-green to tan color",
      "Lesions parallel to veins",
      "Lower leaves affected first",
    ],
    crop: "Maize",
    season: ["Kharif", "Rabi"],
    pathogen: "Exserohilum turcicum (fungus)",
  },
  Maize_Common_Rust: {
    description: "Fungal disease causing small reddish-brown pustules",
    treatments: [
      "Plant resistant hybrids",
      "Apply fungicides like Mancozeb",
      "Early planting",
      "Maintain field hygiene",
    ],
    severity: "Moderate",
    symptoms: [
      "Small reddish-brown pustules",
      "Pustules on both leaf surfaces",
      "Chlorotic areas around pustules",
      "Severe leaf damage in susceptible hybrids",
    ],
    crop: "Maize",
    season: ["Kharif"],
    pathogen: "Puccinia sorghi (fungus)",
  },
  Maize_Leaf_Spot: {
    description: "Fungal disease causing circular to oval spots on leaves",
    treatments: [
      "Practice crop rotation",
      "Apply fungicides",
      "Plant resistant varieties",
      "Remove infected debris",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular to oval spots",
      "Tan to brown lesions with dark borders",
      "Lesions may coalesce",
      "Premature leaf death",
    ],
    crop: "Maize",
    season: ["Kharif", "Rabi"],
    pathogen: "Bipolaris maydis (fungus)",
  },

  // Sorghum Diseases
  Sorghum_Anthracnose: {
    description: "Fungal disease causing red to tan lesions with dark borders",
    treatments: [
      "Plant resistant varieties",
      "Crop rotation",
      "Apply fungicides",
      "Proper field sanitation",
    ],
    severity: "High",
    symptoms: [
      "Red to tan lesions with dark borders",
      "Small circular spots that enlarge",
      "Black fruiting bodies in center of lesions",
      "Stalk rot and lodging",
    ],
    crop: "Sorghum",
    season: ["Kharif"],
    pathogen: "Colletotrichum sublineolum (fungus)",
  },
  Sorghum_Downy_Mildew: {
    description:
      "Fungal disease causing chlorotic areas on leaves with downy growth",
    treatments: [
      "Use disease-free seeds",
      "Seed treatment with metalaxyl",
      "Plant resistant varieties",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Chlorotic areas on leaves",
      "White downy growth on leaf undersides",
      "Systemic infection",
      "Stunted growth",
    ],
    crop: "Sorghum",
    season: ["Kharif"],
    pathogen: "Peronosclerospora sorghi (fungus)",
  },

  // Pearl Millet (Bajra) Diseases
  Pearl_Millet_Downy_Mildew: {
    description: "Fungal disease causing systemic infection and chlorosis",
    treatments: [
      "Use resistant varieties",
      "Seed treatment with metalaxyl",
      "Destroy infected plants",
      "Follow crop rotation",
    ],
    severity: "Very High",
    symptoms: [
      "Chlorosis on leaves",
      "White downy growth on leaf undersides",
      "Malformed earheads",
      "Green ear symptoms",
    ],
    crop: "Pearl Millet",
    season: ["Kharif"],
    pathogen: "Sclerospora graminicola (fungus)",
  },
  Pearl_Millet_Rust: {
    description: "Fungal disease causing reddish-brown pustules",
    treatments: [
      "Plant resistant varieties",
      "Apply fungicides when necessary",
      "Early sowing",
      "Remove alternate hosts",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Reddish-brown pustules on leaves",
      "Circular to elliptical pustules",
      "Pustules mainly on lower leaf surface",
      "Premature drying of leaves",
    ],
    crop: "Pearl Millet",
    season: ["Kharif"],
    pathogen: "Puccinia substriata (fungus)",
  },

  // Barley Diseases
  Barley_Leaf_Rust: {
    description: "Fungal disease causing orange-brown pustules on leaves",
    treatments: [
      "Plant resistant varieties",
      "Apply fungicides like Tebuconazole",
      "Crop rotation",
      "Early planting",
    ],
    severity: "High",
    symptoms: [
      "Small orange-brown pustules on leaves",
      "Yellowing around pustules",
      "Premature leaf senescence",
      "Reduced grain filling",
    ],
    crop: "Barley",
    season: ["Rabi"],
    pathogen: "Puccinia hordei (fungus)",
  },
  Barley_Powdery_Mildew: {
    description:
      "Fungal disease causing white powdery growth on leaves and stems",
    treatments: [
      "Apply sulfur-based fungicides",
      "Plant resistant varieties",
      "Proper plant spacing",
      "Balanced nitrogen fertilization",
    ],
    severity: "Moderate to High",
    symptoms: [
      "White powdery patches on leaves",
      "Chlorotic spots on infected tissue",
      "Reduced photosynthesis",
      "Stunted growth",
    ],
    crop: "Barley",
    season: ["Rabi"],
    pathogen: "Blumeria graminis f. sp. hordei (fungus)",
  },
  Barley_Net_Blotch: {
    description: "Fungal disease causing net-like brown patterns on leaves",
    treatments: [
      "Use certified disease-free seeds",
      "Apply fungicides like Propiconazole",
      "Crop rotation",
      "Remove crop residue",
    ],
    severity: "High",
    symptoms: [
      "Net-like brown patterns on leaves",
      "Longitudinal and transverse striations",
      "Premature leaf death",
      "Reduced yield",
    ],
    crop: "Barley",
    season: ["Rabi"],
    pathogen: "Pyrenophora teres (fungus)",
  },

  // Finger Millet Diseases
  Finger_Millet_Blast: {
    description: "Fungal disease affecting leaves, neck and fingers",
    treatments: [
      "Use resistant varieties",
      "Seed treatment with Carbendazim",
      "Apply foliar fungicides",
      "Balanced fertilization",
    ],
    severity: "Very High",
    symptoms: [
      "Diamond-shaped lesions on leaves",
      "Neck region turns black",
      "Affected fingers become shriveled",
      "Poor grain development",
    ],
    crop: "Finger Millet",
    season: ["Kharif"],
    pathogen: "Magnaporthe grisea (fungus)",
  },
  Finger_Millet_Leaf_Blight: {
    description: "Fungal disease causing rectangular lesions on leaves",
    treatments: [
      "Crop rotation",
      "Use disease-free seeds",
      "Apply copper oxychloride",
      "Remove infected plants",
    ],
    severity: "Moderate",
    symptoms: [
      "Rectangular brown lesions on leaves",
      "Lesions with yellow halos",
      "Premature drying of leaves",
      "Reduced grain yield",
    ],
    crop: "Finger Millet",
    season: ["Kharif"],
    pathogen: "Exserohilum monoceras (fungus)",
  },

  // Oats Diseases
  Oats_Crown_Rust: {
    description: "Fungal disease causing orange pustules on leaves",
    treatments: [
      "Plant resistant varieties",
      "Apply fungicides",
      "Early planting",
      "Eliminate alternate hosts",
    ],
    severity: "High",
    symptoms: [
      "Orange-yellow pustules mainly on leaves",
      "Pustules arranged in rings or crowns",
      "Extensive chlorosis",
      "Stunted growth",
    ],
    crop: "Oats",
    season: ["Rabi"],
    pathogen: "Puccinia coronata f. sp. avenae (fungus)",
  },
  Oats_Loose_Smut: {
    description: "Fungal disease causing black powder in place of grain",
    treatments: [
      "Use certified disease-free seeds",
      "Seed treatment with fungicides",
      "Plant resistant varieties",
      "Proper field sanitation",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Black sooty mass replacing grain",
      "Entire panicle affected",
      "Dusty spores spread by wind",
      "Reduced yield",
    ],
    crop: "Oats",
    season: ["Rabi"],
    pathogen: "Ustilago avenae (fungus)",
  },

  // Foxtail Millet Diseases
  Foxtail_Millet_Blast: {
    description: "Fungal disease affecting leaves and panicle",
    treatments: [
      "Use resistant varieties",
      "Seed treatment with Thiram",
      "Foliar spray of Tricyclazole",
      "Proper spacing",
    ],
    severity: "High",
    symptoms: [
      "Diamond-shaped lesions on leaves",
      "Dark brown to black neck region",
      "Panicle breaks at infected point",
      "Poor grain setting",
    ],
    crop: "Foxtail Millet",
    season: ["Kharif"],
    pathogen: "Pyricularia setariae (fungus)",
  },
  Foxtail_Millet_Downy_Mildew: {
    description: "Fungal disease causing whitish downy growth",
    treatments: [
      "Seed treatment with metalaxyl",
      "Crop rotation",
      "Remove infected plants",
      "Apply systemic fungicides",
    ],
    severity: "Moderate",
    symptoms: [
      "Chlorotic patches on upper leaf surface",
      "White downy growth on lower surface",
      "Stunted plants",
      "Poor panicle emergence",
    ],
    crop: "Foxtail Millet",
    season: ["Kharif"],
    pathogen: "Sclerospora graminicola (fungus)",
  },

  // Kodo Millet Diseases
  Kodo_Millet_Head_Smut: {
    description: "Fungal disease affecting the inflorescence",
    treatments: [
      "Use disease-free seeds",
      "Seed treatment with fungicides",
      "Crop rotation",
      "Field sanitation",
    ],
    severity: "High",
    symptoms: [
      "Black sooty mass replacing grain",
      "Entire earhead converted to smut",
      "Reduced grain formation",
      "Spread through seed and soil",
    ],
    crop: "Kodo Millet",
    season: ["Kharif"],
    pathogen: "Sorosporium paspali-thunbergii (fungus)",
  },

  // Little Millet Diseases
  Little_Millet_Grain_Smut: {
    description: "Fungal disease affecting individual grains",
    treatments: [
      "Use clean seeds",
      "Seed treatment with Carboxin",
      "Hot water treatment of seeds",
      "Field sanitation",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Individual grains replaced by smut",
      "Black mass of spores",
      "Partial grain development",
      "Spread through contaminated seeds",
    ],
    crop: "Little Millet",
    season: ["Kharif"],
    pathogen: "Ustilago panici-frumentacei (fungus)",
  },
  Chickpea_Ascochyta_Blight: {
    description: "Fungal disease causing necrotic lesions on all aerial parts",
    treatments: [
      "Use disease-free seeds",
      "Apply foliar fungicides like Mancozeb",
      "Crop rotation",
      "Resistant varieties",
    ],
    severity: "High",
    symptoms: [
      "Brown necrotic lesions on leaves, stems and pods",
      "Concentric rings in lesions",
      "Stem breakage",
      "Seed discoloration",
    ],
    crop: "Chickpea",
    season: ["Rabi"],
    pathogen: "Ascochyta rabiei (fungus)",
  },
  Chickpea_Fusarium_Wilt: {
    description: "Fungal disease causing wilting and yellowing",
    treatments: [
      "Plant resistant varieties",
      "Seed treatment with Trichoderma",
      "Soil solarization",
      "Crop rotation",
    ],
    severity: "Very High",
    symptoms: [
      "Drooping of leaves",
      "Progressive yellowing",
      "Vascular discoloration",
      "Plant death",
    ],
    crop: "Chickpea",
    season: ["Rabi"],
    pathogen: "Fusarium oxysporum f. sp. ciceris (fungus)",
  },

  // Pigeon Pea (Tur/Arhar) Diseases
  Pigeon_Pea_Sterility_Mosaic: {
    description: "Viral disease causing mosaic pattern and sterility",
    treatments: [
      "Control mite vector",
      "Plant resistant varieties",
      "Destroy infected plants",
      "Intercropping with sorghum or maize",
    ],
    severity: "High",
    symptoms: [
      "Light and dark green mosaic pattern",
      "Reduced leaf size",
      "Sterility of plants",
      "No flowering or pod formation",
    ],
    crop: "Pigeon Pea",
    season: ["Kharif"],
    pathogen: "Pigeonpea sterility mosaic virus (virus)",
  },
  Pigeon_Pea_Fusarium_Wilt: {
    description: "Fungal disease causing wilting and plant death",
    treatments: [
      "Use resistant varieties",
      "Crop rotation",
      "Soil solarization",
      "Seed treatment with fungicides",
    ],
    severity: "High",
    symptoms: [
      "Sudden wilting",
      "Leaf yellowing and retention",
      "Browning of vascular tissues",
      "Plant death",
    ],
    crop: "Pigeon Pea",
    season: ["Kharif"],
    pathogen: "Fusarium udum (fungus)",
  },

  // Green Gram (Moong) Diseases
  Green_Gram_Yellow_Mosaic: {
    description: "Viral disease causing yellow mosaic pattern",
    treatments: [
      "Control whitefly vector",
      "Plant resistant varieties",
      "Early sowing",
      "Remove infected plants",
    ],
    severity: "Very High",
    symptoms: [
      "Yellow mosaic pattern on leaves",
      "Mottling",
      "Stunted growth",
      "Reduced pod formation",
    ],
    crop: "Green Gram",
    season: ["Kharif", "Rabi"],
    pathogen: "Mungbean yellow mosaic virus (virus)",
  },
  Green_Gram_Cercospora_Leaf_Spot: {
    description: "Fungal disease causing circular spots on leaves",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Crop rotation",
      "Field sanitation",
      "Use disease-free seeds",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular spots with gray centers",
      "Dark brown borders",
      "Yellowing around spots",
      "Premature defoliation",
    ],
    crop: "Green Gram",
    season: ["Kharif", "Rabi"],
    pathogen: "Cercospora canescens (fungus)",
  },

  // Black Gram (Urad) Diseases
  Black_Gram_Yellow_Mosaic: {
    description: "Viral disease causing yellow mosaic pattern on leaves",
    treatments: [
      "Control whitefly vectors with insecticides",
      "Use resistant varieties",
      "Early planting to escape vector population",
      "Rogue out infected plants",
    ],
    severity: "Very High",
    symptoms: [
      "Yellow mosaic pattern on leaves",
      "Mottling and puckering of leaves",
      "Stunted plant growth",
      "Poor pod formation",
    ],
    crop: "Black Gram",
    season: ["Kharif", "Rabi"],
    pathogen: "Mungbean yellow mosaic India virus (virus)",
  },
  Black_Gram_Leaf_Crinkle: {
    description: "Viral disease causing severe crinkling of leaves",
    treatments: [
      "Use virus-free seeds",
      "Control insect vectors",
      "Destroy infected plants",
      "Maintain field sanitation",
    ],
    severity: "High",
    symptoms: [
      "Crinkling and puckering of leaves",
      "Severe leaf distortion",
      "Reduction in leaf size",
      "Poor pod setting",
    ],
    crop: "Black Gram",
    season: ["Kharif"],
    pathogen: "Urdbean leaf crinkle virus (virus)",
  },
  Black_Gram_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Plant resistant varieties",
      "Proper spacing for air circulation",
      "Remove infected plant debris",
    ],
    severity: "Moderate",
    symptoms: [
      "White powdery growth on leaves",
      "Yellowing of affected leaves",
      "Premature defoliation",
      "Reduced pod size",
    ],
    crop: "Black Gram",
    season: ["Kharif", "Rabi"],
    pathogen: "Erysiphe polygoni (fungus)",
  },

  // Lentil (Masoor) Diseases
  Lentil_Rust: {
    description: "Fungal disease causing rust-colored pustules on leaves",
    treatments: [
      "Apply fungicides like Propiconazole",
      "Crop rotation",
      "Early sowing",
      "Plant resistant varieties",
    ],
    severity: "High",
    symptoms: [
      "Brown to rust-colored pustules on leaves",
      "Premature defoliation",
      "Reduced photosynthesis",
      "Poor pod filling",
    ],
    crop: "Lentil",
    season: ["Rabi"],
    pathogen: "Uromyces viciae-fabae (fungus)",
  },
  Lentil_Wilt: {
    description: "Fungal disease causing wilting and yellowing",
    treatments: [
      "Use resistant varieties",
      "Seed treatment with Trichoderma",
      "Crop rotation",
      "Proper field drainage",
    ],
    severity: "Very High",
    symptoms: [
      "Sudden wilting of plants",
      "Yellowing of foliage",
      "Discoloration of vascular tissue",
      "Plant death",
    ],
    crop: "Lentil",
    season: ["Rabi"],
    pathogen: "Fusarium oxysporum f. sp. lentis (fungus)",
  },

  // Cowpea (Lobia) Diseases
  Cowpea_Anthracnose: {
    description: "Fungal disease affecting all above ground parts",
    treatments: [
      "Use disease-free seeds",
      "Apply fungicides like Carbendazim",
      "Crop rotation",
      "Proper spacing",
    ],
    severity: "High",
    symptoms: [
      "Dark brown to black lesions on stems and pods",
      "Sunken lesions with spore masses",
      "Seed discoloration",
      "Reduced yield",
    ],
    crop: "Cowpea",
    season: ["Kharif"],
    pathogen: "Colletotrichum lindemuthianum (fungus)",
  },
  Cowpea_Bacterial_Blight: {
    description: "Bacterial disease causing water-soaked lesions",
    treatments: [
      "Use pathogen-free seeds",
      "Apply copper-based bactericides",
      "Crop rotation",
      "Remove infected debris",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Water-soaked, dark green lesions",
      "Yellow halos around lesions",
      "Leaf blight and defoliation",
      "Pod infection",
    ],
    crop: "Cowpea",
    season: ["Kharif"],
    pathogen: "Xanthomonas axonopodis pv. vignicola (bacteria)",
  },

  // Field Pea Diseases
  Field_Pea_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Plant resistant varieties",
      "Proper crop spacing",
      "Balanced fertilization",
    ],
    severity: "Moderate",
    symptoms: [
      "White powdery patches on leaves and stems",
      "Yellowing of affected tissues",
      "Distortion of young growth",
      "Reduced pod formation",
    ],
    crop: "Field Pea",
    season: ["Rabi"],
    pathogen: "Erysiphe pisi (fungus)",
  },
  Field_Pea_Rust: {
    description: "Fungal disease causing rusty pustules on leaves and stems",
    treatments: [
      "Early sowing",
      "Apply fungicides like Mancozeb",
      "Use resistant varieties",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Reddish-brown pustules on leaves and pods",
      "Circular lesions with yellow halos",
      "Premature defoliation",
      "Reduced yield",
    ],
    crop: "Field Pea",
    season: ["Rabi"],
    pathogen: "Uromyces viciae-fabae (fungus)",
  },

  // Rajma (Kidney Beans) Diseases
  Rajma_Common_Bacterial_Blight: {
    description: "Bacterial disease affecting leaves, stems, and pods",
    treatments: [
      "Use disease-free seeds",
      "Apply copper-based bactericides",
      "Crop rotation for 2-3 years",
      "Remove infected debris",
    ],
    severity: "High",
    symptoms: [
      "Water-soaked spots that become brown",
      "Yellow margins around lesions",
      "Pod lesions with bacterial ooze",
      "Seed discoloration",
    ],
    crop: "Rajma",
    season: ["Kharif"],
    pathogen: "Xanthomonas axonopodis pv. phaseoli (bacteria)",
  },
  Rajma_Anthracnose: {
    description: "Fungal disease affecting all plant parts",
    treatments: [
      "Use disease-free seeds",
      "Seed treatment with fungicides",
      "Apply foliar fungicides",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Sunken circular lesions on pods",
      "Dark brown to black spots on leaves",
      "Stem cankers",
      "Seed infection",
    ],
    crop: "Rajma",
    season: ["Kharif"],
    pathogen: "Colletotrichum lindemuthianum (fungus)",
  },

  // Horse Gram Diseases
  Horse_Gram_Leaf_Spot: {
    description: "Fungal disease causing circular spots on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Crop rotation",
      "Remove infected plant debris",
      "Balanced fertilization",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular brown spots with yellow halos",
      "Spots coalesce to form larger lesions",
      "Premature defoliation",
      "Reduced yield",
    ],
    crop: "Horse Gram",
    season: ["Kharif"],
    pathogen: "Cercospora dolichi (fungus)",
  },

  // Moth Bean Diseases
  Moth_Bean_Yellow_Mosaic: {
    description: "Viral disease causing yellow mosaic pattern",
    treatments: [
      "Control whitefly vectors",
      "Use resistant varieties",
      "Early sowing",
      "Rogue out infected plants",
    ],
    severity: "High",
    symptoms: [
      "Yellow mosaic pattern on leaves",
      "Stunted growth",
      "Reduced flowering",
      "Poor pod setting",
    ],
    crop: "Moth Bean",
    season: ["Kharif"],
    pathogen: "Mungbean yellow mosaic virus (virus)",
  },

  // =================== OILSEEDS ===================

  // Groundnut (Peanut) Diseases
  Groundnut_Leaf_Spot: {
    description: "Fungal disease causing circular black spots",
    treatments: [
      "Apply fungicides like Chlorothalonil",
      "Crop rotation",
      "Remove plant debris",
      "Use resistant varieties",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Circular black spots",
      "Yellowing of leaves",
      "Defoliation",
      "Reduced pod yield",
    ],
    crop: "Groundnut",
    season: ["Kharif", "Rabi"],
    pathogen: "Cercospora arachidicola (fungus)",
  },
  Groundnut_Rust: {
    description: "Fungal disease causing orange pustules on leaves",
    treatments: [
      "Use resistant varieties",
      "Apply fungicides like Hexaconazole",
      "Early sowing",
      "Proper spacing",
    ],
    severity: "High",
    symptoms: [
      "Orange pustules on leaves",
      "Premature defoliation",
      "Reduced pod size",
      "Poor kernel development",
    ],
    crop: "Groundnut",
    season: ["Kharif"],
    pathogen: "Puccinia arachidis (fungus)",
  },

  // Soybean Diseases
  Soybean_Rust: {
    description: "Fungal disease causing brown to reddish-brown lesions",
    treatments: [
      "Apply fungicides like Tebuconazole",
      "Plant resistant varieties",
      "Early planting",
      "Monitor humidity levels",
    ],
    severity: "High",
    symptoms: [
      "Brown to reddish lesions",
      "Pustules on lower leaf surface",
      "Premature defoliation",
      "Reduced pod filling",
    ],
    crop: "Soybean",
    season: ["Kharif"],
    pathogen: "Phakopsora pachyrhizi (fungus)",
  },
  Soybean_Bacterial_Blight: {
    description: "Bacterial disease causing angular leaf spots",
    treatments: [
      "Use disease-free seeds",
      "Crop rotation",
      "Avoid overhead irrigation",
      "Proper field drainage",
    ],
    severity: "Moderate",
    symptoms: [
      "Angular water-soaked spots",
      "Yellow halos around lesions",
      "Brown leaf margins",
      "Defoliation",
    ],
    crop: "Soybean",
    season: ["Kharif"],
    pathogen: "Pseudomonas syringae pv. glycinea (bacteria)",
  },

  // Mustard & Rapeseed Diseases
  Mustard_White_Rust: {
    description: "Fungal disease causing white pustules on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Crop rotation",
      "Resistant varieties",
      "Proper spacing",
    ],
    severity: "Moderate to High",
    symptoms: [
      "White to cream-colored pustules",
      "Distortion of infected parts",
      "Stunted growth",
      "Reduced yield",
    ],
    crop: "Mustard",
    season: ["Rabi"],
    pathogen: "Albugo candida (fungus)",
  },
  Mustard_Alternaria_Blight: {
    description: "Fungal disease causing dark spots with concentric rings",
    treatments: [
      "Apply fungicides like Iprodione",
      "Use disease-free seeds",
      "Crop rotation",
      "Proper spacing",
    ],
    severity: "High",
    symptoms: [
      "Dark spots with concentric rings",
      "Yellowing around spots",
      "Spots on pods and stems",
      "Black point on seeds",
    ],
    crop: "Mustard",
    season: ["Rabi"],
    pathogen: "Alternaria brassicae (fungus)",
  },

  // Sunflower Diseases
  Sunflower_Rust: {
    description: "Fungal disease causing orange to brown pustules on leaves",
    treatments: [
      "Apply fungicides like Tebuconazole",
      "Plant resistant varieties",
      "Proper plant spacing",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Small orange to brown pustules on leaves",
      "Pustules mainly on lower leaf surface",
      "Premature leaf senescence",
      "Reduced head size and yield",
    ],
    crop: "Sunflower",
    season: ["Kharif", "Rabi"],
    pathogen: "Puccinia helianthi (fungus)",
  },
  Sunflower_Downy_Mildew: {
    description: "Fungal disease causing systemic or localized infection",
    treatments: [
      "Use disease-free seeds",
      "Seed treatment with metalaxyl",
      "Crop rotation",
      "Proper drainage",
    ],
    severity: "Very High",
    symptoms: [
      "Chlorotic patches on upper leaf surface",
      "White downy growth on lower surface",
      "Stunting of plants",
      "Malformation of heads",
    ],
    crop: "Sunflower",
    season: ["Kharif", "Rabi"],
    pathogen: "Plasmopara halstedii (fungal-like organism)",
  },
  Sunflower_Alternaria_Leaf_Spot: {
    description:
      "Fungal disease causing dark brown spots with concentric rings",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Crop rotation",
      "Proper plant spacing",
      "Remove infected debris",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Dark brown spots with concentric rings",
      "Lesions with yellow halos",
      "Spots enlarge and coalesce",
      "Premature defoliation",
    ],
    crop: "Sunflower",
    season: ["Kharif", "Rabi"],
    pathogen: "Alternaria helianthi (fungus)",
  },

  // Sesame (Til) Diseases
  Sesame_Phyllody: {
    description: "Phytoplasma disease causing malformation of flowers",
    treatments: [
      "Control leafhopper vectors",
      "Remove infected plants",
      "Early sowing",
      "Avoid growing near infected crops",
    ],
    severity: "Very High",
    symptoms: [
      "Transformation of floral parts into leaf-like structures",
      "Sterility of flowers",
      "Excessive branching",
      "No seed formation",
    ],
    crop: "Sesame",
    season: ["Kharif"],
    pathogen: "Candidatus Phytoplasma asteris (phytoplasma)",
  },
  Sesame_Leaf_Spot: {
    description: "Fungal disease causing circular spots on leaves",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Crop rotation",
      "Remove infected debris",
      "Proper spacing",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular brown spots with gray centers",
      "Spots with dark margins",
      "Premature defoliation",
      "Reduced yield",
    ],
    crop: "Sesame",
    season: ["Kharif"],
    pathogen: "Cercospora sesami (fungus)",
  },

  // Linseed (Flaxseed) Diseases
  Linseed_Wilt: {
    description: "Fungal disease causing wilting and death of plants",
    treatments: [
      "Use resistant varieties",
      "Seed treatment with Trichoderma",
      "Crop rotation",
      "Proper field drainage",
    ],
    severity: "Very High",
    symptoms: [
      "Wilting of seedlings or adult plants",
      "Yellowing and drying of leaves",
      "Browning of vascular tissue",
      "Plant death",
    ],
    crop: "Linseed",
    season: ["Rabi"],
    pathogen: "Fusarium oxysporum f. sp. lini (fungus)",
  },
  Linseed_Rust: {
    description: "Fungal disease causing orange pustules on leaves and stems",
    treatments: [
      "Apply fungicides like Propiconazole",
      "Plant resistant varieties",
      "Early sowing",
      "Remove infected debris",
    ],
    severity: "High",
    symptoms: [
      "Orange to brown pustules on leaves and stems",
      "Premature defoliation",
      "Stunted growth",
      "Reduced seed yield",
    ],
    crop: "Linseed",
    season: ["Rabi"],
    pathogen: "Melampsora lini (fungus)",
  },

  // Castor Seed Diseases
  Castor_Gray_Mold: {
    description: "Fungal disease affecting capsules and other plant parts",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper spacing",
      "Avoid high humidity conditions",
      "Remove infected plant parts",
    ],
    severity: "High",
    symptoms: [
      "Gray moldy growth on capsules",
      "Soft rot of infected parts",
      "Withering of inflorescence",
      "Premature capsule splitting",
    ],
    crop: "Castor",
    season: ["Kharif", "Rabi"],
    pathogen: "Botrytis ricini (fungus)",
  },
  Castor_Bacterial_Leaf_Spot: {
    description: "Bacterial disease causing water-soaked spots on leaves",
    treatments: [
      "Apply copper-based bactericides",
      "Proper drainage",
      "Crop rotation",
      "Remove infected debris",
    ],
    severity: "Moderate",
    symptoms: [
      "Water-soaked spots turning dark brown",
      "Spots with yellow halos",
      "Spots coalesce to form irregular lesions",
      "Premature defoliation",
    ],
    crop: "Castor",
    season: ["Kharif"],
    pathogen: "Xanthomonas axonopodis pv. ricini (bacteria)",
  },

  // =================== CASH CROPS ===================

  // Sugarcane Diseases
  Sugarcane_Red_Rot: {
    description: "Fungal disease causing internal stalk reddening",
    treatments: [
      "Use disease-free setts",
      "Hot water treatment of setts",
      "Crop rotation",
      "Remove infected plants",
    ],
    severity: "Very High",
    symptoms: [
      "Internal stalk reddening",
      "White spots in reddened tissue",
      "Drying of leaves",
      "Sour smell from infected stalks",
    ],
    crop: "Sugarcane",
    season: ["Year-round"],
    pathogen: "Colletotrichum falcatum (fungus)",
  },
  Sugarcane_Smut: {
    description:
      "Fungal disease causing whip-like structures at growing points",
    treatments: [
      "Use resistant varieties",
      "Hot water treatment",
      "Rogue out infected plants",
      "Clean farm implements",
    ],
    severity: "High",
    symptoms: [
      "Black whip-like structures",
      "Thin stalks",
      "Grassy shoots",
      "Reduced sugar content",
    ],
    crop: "Sugarcane",
    season: ["Year-round"],
    pathogen: "Sporisorium scitamineum (fungus)",
  },

  // Cotton Diseases
  Cotton_Bacterial_Blight: {
    description: "Bacterial disease causing angular water-soaked lesions",
    treatments: [
      "Use certified disease-free seeds",
      "Apply copper-based bactericides",
      "Crop rotation",
      "Remove crop residues",
    ],
    severity: "High",
    symptoms: [
      "Angular water-soaked lesions",
      "Brown to black lesions",
      "Premature defoliation",
      "Boll rot",
    ],
    crop: "Cotton",
    season: ["Kharif"],
    pathogen: "Xanthomonas axonopodis pv. malvacearum (bacteria)",
  },
  Cotton_Leaf_Curl: {
    description:
      "Viral disease causing upward curling of leaves and stunted growth",
    treatments: [
      "Use resistant varieties",
      "Control whitefly vectors",
      "Remove infected plants",
      "Maintain field hygiene",
    ],
    severity: "Very High",
    symptoms: [
      "Upward curling of leaves",
      "Dark green thickened veins",
      "Stunted plant growth",
      "Reduced boll formation",
    ],
    crop: "Cotton",
    season: ["Kharif"],
    pathogen: "Cotton leaf curl virus (virus)",
  },

  // Jute Diseases
  Jute_Stem_Rot: {
    description: "Fungal disease causing rotting of stem",
    treatments: [
      "Seed treatment with Carbendazim",
      "Proper drainage",
      "Crop rotation",
      "Remove infected plants",
    ],
    severity: "Very High",
    symptoms: [
      "Water-soaked patches on stem",
      "Rotting of stem tissue",
      "Wilting and death of plants",
      "White fungal growth on infected parts",
    ],
    crop: "Jute",
    season: ["Kharif"],
    pathogen: "Macrophomina phaseolina (fungus)",
  },
  Jute_Anthracnose: {
    description: "Fungal disease affecting leaves and stems",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Use disease-free seeds",
      "Proper spacing",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Small circular spots on leaves",
      "Dark brown lesions with yellow halos",
      "Stem lesions with sunken centers",
      "Defoliation",
    ],
    crop: "Jute",
    season: ["Kharif"],
    pathogen: "Colletotrichum corchorum (fungus)",
  },

  // Tobacco Diseases
  Tobacco_Mosaic: {
    description: "Viral disease causing mosaic pattern on leaves",
    treatments: [
      "Use resistant varieties",
      "Practice strict sanitation",
      "Control vectors",
      "Remove infected plants",
    ],
    severity: "High",
    symptoms: [
      "Light and dark green mosaic pattern",
      "Leaf malformation and blistering",
      "Stunted growth",
      "Reduced leaf quality",
    ],
    crop: "Tobacco",
    season: ["Rabi"],
    pathogen: "Tobacco mosaic virus (virus)",
  },
  Tobacco_Black_Shank: {
    description: "Fungal disease causing black lesions on stem and rot",
    treatments: [
      "Plant resistant varieties",
      "Crop rotation for 2-3 years",
      "Soil fumigation",
      "Improve field drainage",
    ],
    severity: "Very High",
    symptoms: [
      "Black lesions on stem base",
      "Wilting of plants",
      "Yellowing of leaves",
      "Root and crown rot",
    ],
    crop: "Tobacco",
    season: ["Rabi"],
    pathogen: "Phytophthora nicotianae (fungal-like organism)",
  },

  // Coffee Diseases
  Coffee_Rust: {
    description:
      "Fungal disease causing orange-yellow powdery patches on leaves",
    treatments: [
      "Apply fungicides like Copper hydroxide",
      "Plant resistant varieties",
      "Proper pruning for air circulation",
      "Shade management",
    ],
    severity: "Very High",
    symptoms: [
      "Orange-yellow powdery patches on leaf undersides",
      "Chlorotic spots on upper leaf surface",
      "Premature leaf fall",
      "Reduced yield over several seasons",
    ],
    crop: "Coffee",
    season: ["Year-round"],
    pathogen: "Hemileia vastatrix (fungus)",
  },
  Coffee_Berry_Disease: {
    description: "Fungal disease affecting green berries",
    treatments: [
      "Apply fungicides like Chlorothalonil",
      "Proper pruning and spacing",
      "Timely harvesting",
      "Remove infected berries",
    ],
    severity: "High",
    symptoms: [
      "Sunken dark lesions on green berries",
      "Black, shrunken berries",
      "Premature berry drop",
      "Mummified berries remaining on trees",
    ],
    crop: "Coffee",
    season: ["Year-round"],
    pathogen: "Colletotrichum kahawae (fungus)",
  },

  // Tea Diseases
  Tea_Blister_Blight: {
    description:
      "Fungal disease causing translucent spots that develop into blisters",
    treatments: [
      "Apply fungicides like Copper oxychloride",
      "Proper pruning for air circulation",
      "Avoid overhead irrigation",
      "Remove infected leaves",
    ],
    severity: "High",
    symptoms: [
      "Translucent spots on young leaves",
      "Spots develop into blisters",
      "White spore mass on lower surface",
      "Leaves become distorted and fall",
    ],
    crop: "Tea",
    season: ["Monsoon"],
    pathogen: "Exobasidium vexans (fungus)",
  },
  Tea_Gray_Blight: {
    description: "Fungal disease causing gray spots on leaves",
    treatments: [
      "Apply fungicides",
      "Proper drainage",
      "Prune and dispose infected branches",
      "Maintain bush hygiene",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Gray circular spots on mature leaves",
      "Spots with concentric rings",
      "Leaf tissue dies and turns gray",
      "Black fruiting bodies appear on dead tissue",
    ],
    crop: "Tea",
    season: ["Year-round"],
    pathogen: "Pestalotiopsis theae (fungus)",
  },

  // Rubber Diseases
  Rubber_Powdery_Mildew: {
    description: "Fungal disease affecting young leaves and shoots",
    treatments: [
      "Apply sulfur-based fungicides",
      "Proper spacing",
      "Avoid high humidity conditions",
      "Remove infected leaves",
    ],
    severity: "Moderate",
    symptoms: [
      "White powdery growth on young leaves",
      "Curling and distortion of leaves",
      "Stunting of new flushes",
      "Premature leaf fall",
    ],
    crop: "Rubber",
    season: ["Year-round"],
    pathogen: "Oidium heveae (fungus)",
  },
  Rubber_Leaf_Fall: {
    description: "Fungal disease causing premature leaf fall",
    treatments: [
      "Apply fungicides like Bordeaux mixture",
      "Avoid irrigation during leaf fall period",
      "Maintain good drainage",
      "Remove fallen leaves",
    ],
    severity: "High",
    symptoms: [
      "Small pin-head spots on leaves",
      "Spots enlarge with grayish centers",
      "Leaf yellowing",
      "Premature leaf fall",
    ],
    crop: "Rubber",
    season: ["Monsoon"],
    pathogen: "Phytophthora palmivora (fungal-like organism)",
  },

  // =================== HORTICULTURAL CROPS ===================

  // Tomato Diseases
  Tomato_Late_Blight: {
    description: "Fungal disease causing rapid tissue death",
    treatments: [
      "Apply protective fungicides with Chlorothalonil",
      "Improve air circulation",
      "Remove infected plants",
      "Use resistant varieties",
    ],
    severity: "Very High",
    symptoms: [
      "Dark brown spots on leaves",
      "White fuzzy growth underneath",
      "Rapid plant collapse",
      "Fruit rot with greasy appearance",
    ],
    crop: "Tomato",
    season: ["Year-round"],
    pathogen: "Phytophthora infestans (fungal-like organism)",
  },
  Tomato_Early_Blight: {
    description: "Fungal disease causing concentric rings on leaves",
    treatments: [
      "Remove lower infected leaves",
      "Apply fungicides like Mancozeb",
      "Proper spacing",
      "Mulch to prevent soil splash",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Dark concentric rings on leaves",
      "Yellowing around lesions",
      "Stem lesions",
      "Fruit rot at stem end",
    ],
    crop: "Tomato",
    season: ["Year-round"],
    pathogen: "Alternaria solani (fungus)",
  },

  // Potato Diseases
  Potato_Late_Blight: {
    description:
      "Devastating disease causing rapid foliage collapse and tuber rot",
    treatments: [
      "Apply protective fungicides",
      "Plant resistant varieties",
      "Hill soil around plants",
      "Destroy volunteer plants",
    ],
    severity: "Very High",
    symptoms: [
      "Water-soaked black lesions",
      "White fuzzy growth on leaves",
      "Rapid foliage collapse",
      "Brown tuber rot",
    ],
    crop: "Potato",
    season: ["Rabi"],
    pathogen: "Phytophthora infestans (fungal-like organism)",
  },
  Potato_Early_Blight: {
    description: "Fungal disease causing target-like spots on leaves",
    treatments: [
      "Apply fungicide preventively",
      "Maintain proper fertility",
      "Practice crop rotation",
      "Remove infected plant debris",
    ],
    severity: "High",
    symptoms: [
      "Target-like spots on leaves",
      "Stem lesions",
      "Premature defoliation",
      "Surface lesions on tubers",
    ],
    crop: "Potato",
    season: ["Rabi"],
    pathogen: "Alternaria solani (fungus)",
  },

  // Mango Diseases
  Mango_Anthracnose: {
    description: "Fungal disease affecting leaves, flowers, and fruits",
    treatments: [
      "Regular fungicide sprays with Carbendazim",
      "Prune dead branches",
      "Improve air circulation",
      "Post-harvest treatment",
    ],
    severity: "High",
    symptoms: [
      "Black spots on leaves",
      "Flower blight",
      "Fruit rot",
      "Twig dieback",
    ],
    crop: "Mango",
    season: ["Spring", "Summer"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },
  Mango_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Sulfur-based fungicides",
      "Proper pruning",
      "Avoid overhead irrigation",
      "Maintain tree spacing",
    ],
    severity: "Moderate to High",
    symptoms: [
      "White powdery growth",
      "Flower drop",
      "Fruit malformation",
      "Leaf curling",
    ],
    crop: "Mango",
    season: ["Spring"],
    pathogen: "Oidium mangiferae (fungus)",
  },

  // Citrus Diseases
  Citrus_Canker: {
    description: "Bacterial disease causing raised corky lesions",
    treatments: [
      "Copper-based sprays",
      "Windbreaks",
      "Remove infected parts",
      "Sanitation practices",
    ],
    severity: "High",
    symptoms: [
      "Raised corky lesions",
      "Circular spots with yellow halos",
      "Fruit blemishes",
      "Leaf drop",
    ],
    crop: "Citrus",
    season: ["Year-round"],
    pathogen: "Xanthomonas citri (bacteria)",
  },
  Citrus_Greening: {
    description: "Bacterial disease causing yellow shoots and mottled leaves",
    treatments: [
      "Control psyllid vectors",
      "Remove infected trees",
      "Nutritional supplements",
      "Use disease-free nursery plants",
    ],
    severity: "Very High",
    symptoms: [
      "Yellow shoots",
      "Mottled leaves",
      "Lopsided bitter fruits",
      "Premature fruit drop",
    ],
    crop: "Citrus",
    season: ["Year-round"],
    pathogen: "Candidatus Liberibacter asiaticus (bacteria)",
  },

  // Banana Diseases
  Banana_Panama_Wilt: {
    description: "Fungal disease causing wilting and yellowing of leaves",
    treatments: [
      "Use disease-free planting material",
      "Grow resistant varieties",
      "Improve field drainage",
      "Proper crop rotation",
    ],
    severity: "Very High",
    symptoms: [
      "Yellowing of older leaves",
      "Splitting of pseudostem at base",
      "Vascular discoloration (reddish-brown)",
      "Wilting and death of plant",
    ],
    crop: "Banana",
    season: ["Year-round"],
    pathogen: "Fusarium oxysporum f. sp. cubense (fungus)",
  },
  Banana_Sigatoka: {
    description: "Fungal disease causing leaf spots and premature ripening",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Proper spacing for air circulation",
      "Remove infected leaves",
      "Ensure good drainage",
    ],
    severity: "High",
    symptoms: [
      "Small yellow spots on leaves",
      "Spots enlarge and turn brown with yellow halos",
      "Spots coalesce causing leaf death",
      "Premature ripening of fruits",
    ],
    crop: "Banana",
    season: ["Rainy season"],
    pathogen: "Mycosphaerella musicola (fungus)",
  },
  Banana_Bunchy_Top: {
    description: "Viral disease causing stunting and bunchy appearance",
    treatments: [
      "Use virus-free planting material",
      "Control aphid vectors",
      "Destroy infected plants",
      "Maintain field hygiene",
    ],
    severity: "Very High",
    symptoms: [
      "Stunted growth",
      "Bunched appearance at top",
      "Dark green streaks on leaves and pseudostem",
      "Narrow, upright leaves with yellow margins",
    ],
    crop: "Banana",
    season: ["Year-round"],
    pathogen: "Banana bunchy top virus (BBTV)",
  },

  // Grape Diseases
  Grape_Downy_Mildew: {
    description: "Fungal disease affecting leaves, shoots, and fruit",
    treatments: [
      "Apply fungicides like Copper hydroxide",
      "Proper canopy management for air circulation",
      "Reduce humidity in vineyard",
      "Proper spacing of vines",
    ],
    severity: "High",
    symptoms: [
      "Yellow or brown spots on upper leaf surface",
      "White downy growth on lower leaf surface",
      "Young berries turn brown and shrivel",
      "Shoots become distorted and thickened",
    ],
    crop: "Grape",
    season: ["Rainy season"],
    pathogen: "Plasmopara viticola (fungal-like organism)",
  },
  Grape_Powdery_Mildew: {
    description: "Fungal disease affecting all green tissues",
    treatments: [
      "Apply sulfur-based fungicides",
      "Proper pruning for air circulation",
      "Thinning of shoots and clusters",
      "Avoid excess nitrogen fertilization",
    ],
    severity: "High",
    symptoms: [
      "White powdery growth on leaves, shoots, and berries",
      "Stunted growth of affected parts",
      "Cracking of berries",
      "Musty odor in severe infections",
    ],
    crop: "Grape",
    season: ["Dry season"],
    pathogen: "Erysiphe necator (fungus)",
  },

  // Apple Diseases
  Apple_Scab: {
    description: "Fungal disease affecting leaves and fruits",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Prune to improve air circulation",
      "Remove fallen leaves in autumn",
      "Plant resistant varieties",
    ],
    severity: "Very High",
    symptoms: [
      "Olive-green to brown spots on leaves",
      "Dark, scabby lesions on fruits",
      "Deformed fruits",
      "Premature leaf and fruit drop",
    ],
    crop: "Apple",
    season: ["Spring", "Summer"],
    pathogen: "Venturia inaequalis (fungus)",
  },
  Apple_Fire_Blight: {
    description: "Bacterial disease causing wilting and blackening of shoots",
    treatments: [
      "Prune out infected branches",
      "Apply copper-based bactericides during bloom",
      "Avoid overhead irrigation",
      "Use resistant rootstocks",
    ],
    severity: "Very High",
    symptoms: [
      "Wilting and blackening of shoots (shepherd's crook)",
      "Cankers on branches with oozing",
      "Blackened flowers and fruitlets",
      "Bacterial ooze in humid conditions",
    ],
    crop: "Apple",
    season: ["Spring", "Summer"],
    pathogen: "Erwinia amylovora (bacteria)",
  },

  // Guava Diseases
  Guava_Wilt: {
    description: "Fungal disease causing wilting and dieback",
    treatments: [
      "Use resistant varieties",
      "Soil solarization",
      "Treat soil with biocontrol agents",
      "Remove and destroy affected plants",
    ],
    severity: "Very High",
    symptoms: [
      "Yellowing and wilting of leaves",
      "Defoliation",
      "Discoloration of vascular tissue",
      "Death of plant within weeks",
    ],
    crop: "Guava",
    season: ["Year-round"],
    pathogen: "Fusarium oxysporum f. sp. psidii (fungus)",
  },
  Guava_Anthracnose: {
    description: "Fungal disease affecting fruits and leaves",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper pruning for air circulation",
      "Collect and destroy fallen fruits",
      "Avoid overhead irrigation",
    ],
    severity: "High",
    symptoms: [
      "Dark, sunken lesions on fruits",
      "Reddish-brown spots on leaves",
      "Premature fruit drop",
      "Post-harvest fruit rot",
    ],
    crop: "Guava",
    season: ["Rainy season"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },

  // Papaya Diseases
  Papaya_Ring_Spot: {
    description: "Viral disease causing mottling and distortion",
    treatments: [
      "Use virus-free seedlings",
      "Control aphid vectors",
      "Rogue out infected plants",
      "Cover young plants with nets",
    ],
    severity: "Very High",
    symptoms: [
      "Mottling and mosaic patterns on leaves",
      "Distortion of young leaves",
      "Water-soaked streaks on stems and petioles",
      "Ringspot patterns on fruits",
    ],
    crop: "Papaya",
    season: ["Year-round"],
    pathogen: "Papaya ringspot virus (PRSV)",
  },
  Papaya_Anthracnose: {
    description: "Fungal disease affecting fruits, leaves, and stems",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Protect fruits from injuries",
      "Proper spacing for air circulation",
      "Harvest fruits at proper maturity",
    ],
    severity: "High",
    symptoms: [
      "Small, water-soaked spots on fruits",
      "Spots enlarge and become sunken with salmon-colored spores",
      "Dark, irregular spots on leaves",
      "Stem cankers",
    ],
    crop: "Papaya",
    season: ["Rainy season"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },

  // Coconut Diseases
  Coconut_Root_Wilt: {
    description: "Phytoplasma disease causing root and leaf symptoms",
    treatments: [
      "Apply organic manures and balanced fertilizers",
      "Control leafhopper vectors",
      "Improve drainage",
      "Apply potash to improve resistance",
    ],
    severity: "High",
    symptoms: [
      "Yellowing of lower leaves",
      "Flaccidity and necrosis of leaflets",
      "Reduced leaf size",
      "Root decay and yield reduction",
    ],
    crop: "Coconut",
    season: ["Year-round"],
    pathogen: "Phytoplasma (16SrXI)",
  },
  Coconut_Bud_Rot: {
    description: "Fungal disease affecting the bud region",
    treatments: [
      "Prophylactic spraying with fungicides",
      "Avoid injuries to crown region",
      "Improve drainage",
      "Remove and destroy infected palms",
    ],
    severity: "Very High",
    symptoms: [
      "Yellowing of youngest leaf",
      "Rotting of spear leaf",
      "Brown discoloration of bud tissues",
      "Death of palm if bud is affected",
    ],
    crop: "Coconut",
    season: ["Rainy season"],
    pathogen: "Phytophthora palmivora (fungal-like organism)",
  },

  // Strawberry Diseases
  Strawberry_Gray_Mold: {
    description: "Fungal disease affecting fruits and flowers",
    treatments: [
      "Apply fungicides like Captan",
      "Proper spacing for air circulation",
      "Mulch to prevent fruit contact with soil",
      "Remove infected plant debris",
    ],
    severity: "High",
    symptoms: [
      "Brown lesions on fruits",
      "Gray fuzzy mold on infected tissues",
      "Flower blight",
      "Post-harvest fruit rot",
    ],
    crop: "Strawberry",
    season: ["Rainy season", "Spring"],
    pathogen: "Botrytis cinerea (fungus)",
  },
  Strawberry_Leaf_Spot: {
    description: "Fungal disease causing spots on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Remove infected leaves",
      "Plant resistant varieties",
      "Proper spacing for air circulation",
    ],
    severity: "Moderate",
    symptoms: [
      "Small, purplish to reddish spots on leaves",
      "Spots enlarge with grayish centers",
      "Spots may coalesce",
      "Severe infections cause leaf death",
    ],
    crop: "Strawberry",
    season: ["Rainy season", "Spring"],
    pathogen: "Mycosphaerella fragariae (fungus)",
  },

  // =================== MEDICINAL & AROMATIC PLANTS ===================

  // Turmeric Diseases
  Turmeric_Leaf_Spot: {
    description: "Fungal disease causing brown spots with yellow halos",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Remove infected leaves",
      "Proper spacing",
      "Crop rotation",
    ],
    severity: "Moderate",
    symptoms: [
      "Brown spots with yellow halos",
      "Spots coalesce to form patches",
      "Premature leaf fall",
      "Reduced rhizome development",
    ],
    crop: "Turmeric",
    season: ["Kharif"],
    pathogen: "Colletotrichum capsici (fungus)",
  },
  Turmeric_Rhizome_Rot: {
    description: "Fungal disease causing rotting of rhizomes",
    treatments: [
      "Soil solarization",
      "Treat seed rhizomes with fungicides",
      "Improve drainage",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Yellowing of leaves",
      "Wilting of plants",
      "Soft decay of rhizomes",
      "Foul smell from infected rhizomes",
    ],
    crop: "Turmeric",
    season: ["Kharif"],
    pathogen: "Pythium aphanidermatum (fungal-like organism)",
  },

  // Mint Diseases
  Mint_Rust: {
    description: "Fungal disease causing orange-brown pustules on leaves",
    treatments: [
      "Apply fungicides like Propiconazole",
      "Remove and destroy infected plant parts",
      "Improve air circulation",
      "Avoid overhead irrigation",
    ],
    severity: "High",
    symptoms: [
      "Orange to brown pustules on lower leaf surface",
      "Yellowing of leaves",
      "Distortion of young growth",
      "Premature leaf drop",
    ],
    crop: "Mint",
    season: ["Rainy season", "Spring"],
    pathogen: "Puccinia menthae (fungus)",
  },
  Mint_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth on leaves",
    treatments: [
      "Apply sulfur-based fungicides",
      "Improve air circulation",
      "Reduce humidity",
      "Plant resistant varieties",
    ],
    severity: "Moderate",
    symptoms: [
      "White powdery growth on upper leaf surface",
      "Yellowing of affected leaves",
      "Distortion of leaves",
      "Reduced growth",
    ],
    crop: "Mint",
    season: ["Dry season"],
    pathogen: "Erysiphe cichoracearum (fungus)",
  },

  // Aloe Vera Diseases
  Aloe_Vera_Leaf_Spot: {
    description: "Fungal disease causing spots on leaves",
    treatments: [
      "Apply fungicides like Copper oxychloride",
      "Avoid overhead irrigation",
      "Remove infected leaves",
      "Ensure good drainage",
    ],
    severity: "Moderate",
    symptoms: [
      "Dark, sunken spots on leaves",
      "Yellowing around spots",
      "Spots may coalesce",
      "Reduced plant vigor",
    ],
    crop: "Aloe Vera",
    season: ["Rainy season"],
    pathogen: "Alternaria alternata (fungus)",
  },
  Aloe_Vera_Basal_Stem_Rot: {
    description: "Fungal disease causing rot at base of plant",
    treatments: [
      "Improve drainage",
      "Avoid overwatering",
      "Apply fungicides like Thiophanate-methyl",
      "Remove infected plants",
    ],
    severity: "High",
    symptoms: [
      "Rotting at the base of the plant",
      "Yellowing and wilting of leaves",
      "Soft, water-soaked tissues",
      "Plant collapse",
    ],
    crop: "Aloe Vera",
    season: ["Rainy season"],
    pathogen: "Fusarium spp. (fungus)",
  },

  // Ashwagandha Diseases
  Ashwagandha_Leaf_Blight: {
    description: "Fungal disease causing blight on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Crop rotation",
      "Remove infected plant debris",
      "Proper spacing",
    ],
    severity: "High",
    symptoms: [
      "Brown, necrotic patches on leaves",
      "Lesions with concentric rings",
      "Defoliation",
      "Reduced yield",
    ],
    crop: "Ashwagandha",
    season: ["Rainy season"],
    pathogen: "Alternaria alternata (fungus)",
  },
  Ashwagandha_Root_Rot: {
    description: "Fungal disease causing rotting of roots",
    treatments: [
      "Improve soil drainage",
      "Seed treatment with fungicides",
      "Crop rotation",
      "Soil solarization",
    ],
    severity: "Very High",
    symptoms: [
      "Yellowing and wilting of plants",
      "Browning and rotting of roots",
      "Stunted growth",
      "Plant death",
    ],
    crop: "Ashwagandha",
    season: ["Rainy season"],
    pathogen: "Fusarium solani (fungus)",
  },

  // Lemongrass Diseases
  Lemongrass_Rust: {
    description: "Fungal disease causing rust pustules on leaves",
    treatments: [
      "Apply fungicides like Tebuconazole",
      "Remove infected leaves",
      "Ensure proper spacing",
      "Maintain field hygiene",
    ],
    severity: "Moderate",
    symptoms: [
      "Orange to brown pustules on leaves",
      "Yellowing of affected leaves",
      "Reduced oil content",
      "Premature drying of leaves",
    ],
    crop: "Lemongrass",
    season: ["Rainy season"],
    pathogen: "Puccinia nakanishikii (fungus)",
  },
  Lemongrass_Leaf_Blight: {
    description: "Fungal disease causing blight on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Proper spacing",
      "Remove infected plant parts",
      "Avoid overhead irrigation",
    ],
    severity: "High",
    symptoms: [
      "Water-soaked lesions on leaves",
      "Lesions enlarge and turn brown",
      "Leaf dieback",
      "Reduced oil yield",
    ],
    crop: "Lemongrass",
    season: ["Rainy season"],
    pathogen: "Curvularia spp. (fungus)",
  },

  // Tulsi (Holy Basil) Diseases
  Tulsi_Root_Rot: {
    description: "Fungal disease causing rotting of roots",
    treatments: [
      "Improve soil drainage",
      "Avoid overwatering",
      "Apply biocontrol agents like Trichoderma",
      "Remove infected plants",
    ],
    severity: "High",
    symptoms: [
      "Wilting despite adequate soil moisture",
      "Yellowing of leaves",
      "Brown, rotting roots",
      "Plant collapse",
    ],
    crop: "Tulsi (Holy Basil)",
    season: ["Rainy season"],
    pathogen: "Rhizoctonia solani (fungus)",
  },
  Tulsi_Leaf_Spot: {
    description: "Fungal disease causing spots on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Remove infected leaves",
      "Proper spacing",
      "Avoid overhead irrigation",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular brown spots on leaves",
      "Spots with yellow halos",
      "Premature leaf drop",
      "Reduced growth",
    ],
    crop: "Tulsi (Holy Basil)",
    season: ["Rainy season"],
    pathogen: "Cercospora spp. (fungus)",
  },

  // =================== GENERAL CATEGORIES ===================

  // General Categories
  Healthy: {
    description: "Plant appears healthy with no visible signs of disease",
    treatments: [
      "Continue regular maintenance",
      "Monitor for any changes",
      "Maintain good irrigation practices",
      "Follow recommended fertilization schedule",
    ],
    severity: "None",
    symptoms: [
      "Normal green coloration",
      "Healthy growth pattern",
      "No visible lesions or spots",
      "Good vigor",
    ],
    crop: "General",
    season: ["Year-round"],
    pathogen: "None",
  },
  Unknown: {
    description:
      "Symptoms don't match known patterns or multiple diseases present",
    treatments: [
      "Consult local agricultural expert",
      "Send samples for laboratory analysis",
      "Document symptoms carefully",
      "Isolate affected plants",
    ],
    severity: "Unknown",
    symptoms: [
      "Unclear or mixed symptoms",
      "Unusual patterns",
      "Multiple symptom types",
      "Progressive damage",
    ],
    crop: "General",
    season: ["Year-round"],
    pathogen: "Unknown",
  },

  // =================== FODDER & FORAGE CROPS ===================

  // Alfalfa (Lucerne) Diseases
  Alfalfa_Leaf_Spot: {
    description: "Fungal disease causing spots on leaves",
    treatments: [
      "Apply fungicides like Chlorothalonil",
      "Cut early if disease is severe",
      "Plant resistant varieties",
      "Ensure proper drainage",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Small, circular brown spots on leaves",
      "Spots may have yellowish halos",
      "Premature leaf drop",
      "Reduced forage quality",
    ],
    crop: "Alfalfa (Lucerne)",
    season: ["Spring", "Rainy season"],
    pathogen: "Pseudopeziza medicaginis (fungus)",
  },
  Alfalfa_Bacterial_Wilt: {
    description: "Bacterial disease causing wilting and yellowing",
    treatments: [
      "Plant resistant varieties",
      "Ensure proper drainage",
      "Crop rotation with non-host crops",
      "Avoid cutting when wet",
    ],
    severity: "Very High",
    symptoms: [
      "Stunted growth",
      "Yellowing of leaves",
      "Wilting despite adequate soil moisture",
      "Vascular discoloration (yellow-brown)",
    ],
    crop: "Alfalfa (Lucerne)",
    season: ["Summer", "Rainy season"],
    pathogen: "Clavibacter michiganensis subsp. insidiosus (bacteria)",
  },

  // Berseem Clover Diseases
  Berseem_Root_Rot: {
    description: "Fungal disease affecting roots",
    treatments: [
      "Improve drainage",
      "Seed treatment with fungicides",
      "Crop rotation",
      "Maintain proper pH",
    ],
    severity: "High",
    symptoms: [
      "Stunted growth",
      "Yellowing and wilting",
      "Brown, rotting roots",
      "Plant death",
    ],
    crop: "Berseem Clover",
    season: ["Winter", "Spring"],
    pathogen: "Fusarium spp. and Rhizoctonia spp. (fungi)",
  },
  Berseem_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Early cutting",
      "Proper spacing",
      "Avoid excess nitrogen",
    ],
    severity: "Moderate",
    symptoms: [
      "White powdery growth on leaf surfaces",
      "Yellowing of affected leaves",
      "Premature leaf fall",
      "Reduced growth",
    ],
    crop: "Berseem Clover",
    season: ["Winter", "Spring"],
    pathogen: "Erysiphe trifolii (fungus)",
  },

  // Napier Grass (Elephant Grass) Diseases
  Napier_Stunt: {
    description: "Phytoplasma disease causing stunting",
    treatments: [
      "Use disease-free planting material",
      "Control leafhopper vectors",
      "Remove infected plants",
      "Maintain field hygiene",
    ],
    severity: "Very High",
    symptoms: [
      "Severe stunting",
      "Yellowing of leaves",
      "Short internodes",
      "Proliferation of tillers",
    ],
    crop: "Napier Grass",
    season: ["Year-round"],
    pathogen: "Napier grass stunt phytoplasma",
  },
  Napier_Smut: {
    description: "Fungal disease causing whip-like structures",
    treatments: [
      "Use disease-free planting material",
      "Remove and destroy infected plants",
      "Crop rotation",
      "Plant resistant varieties",
    ],
    severity: "High",
    symptoms: [
      "Whip-like structures from growing points",
      "Black, powdery spore masses",
      "Stunted growth",
      "Reduced forage yield",
    ],
    crop: "Napier Grass",
    season: ["Rainy season"],
    pathogen: "Ustilago kamerunensis (fungus)",
  },

  // Stylo (Stylosanthes) Diseases
  Stylo_Anthracnose: {
    description: "Fungal disease affecting stems, leaves, and pods",
    treatments: [
      "Plant resistant varieties",
      "Crop rotation",
      "Apply fungicides",
      "Ensure proper spacing",
    ],
    severity: "Very High",
    symptoms: [
      "Dark, sunken lesions on stems",
      "Necrotic spots on leaves",
      "Dieback of branches",
      "Reduced seed production",
    ],
    crop: "Stylo (Stylosanthes)",
    season: ["Rainy season"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },

  // Rhodes Grass Diseases
  Rhodes_Grass_Rust: {
    description: "Fungal disease causing rust pustules on leaves",
    treatments: [
      "Plant resistant varieties",
      "Early cutting",
      "Proper fertilization",
      "Crop rotation",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Orange to brown pustules on leaves",
      "Yellowing of affected leaves",
      "Reduced growth",
      "Decreased forage quality",
    ],
    crop: "Rhodes Grass",
    season: ["Rainy season"],
    pathogen: "Puccinia spp. (fungus)",
  },

  // =================== VEGETABLE CROPS ===================

  // Cabbage Diseases
  Cabbage_Black_Rot: {
    description: "Bacterial disease causing V-shaped yellow lesions",
    treatments: [
      "Use disease-free seeds",
      "Crop rotation for 2-3 years",
      "Apply copper-based bactericides",
      "Remove infected crop debris",
    ],
    severity: "High",
    symptoms: [
      "V-shaped yellow to brown lesions at leaf margins",
      "Black veins in affected areas",
      "Systemic infection leading to wilting",
      "Blackening of vascular tissues",
    ],
    crop: "Cabbage",
    season: ["Rabi"],
    pathogen: "Xanthomonas campestris pv. campestris (bacteria)",
  },
  Cabbage_Downy_Mildew: {
    description: "Fungal disease causing yellow patches on upper leaf surface",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Proper spacing for air circulation",
      "Avoid overhead irrigation",
      "Crop rotation",
    ],
    severity: "Moderate to High",
    symptoms: [
      "Yellow patches on upper leaf surface",
      "Grayish-white growth on lower leaf surface",
      "Leaves turn brown and dry",
      "Systemic infection in young plants",
    ],
    crop: "Cabbage",
    season: ["Rabi", "Rainy season"],
    pathogen: "Peronospora parasitica (fungal-like organism)",
  },

  // Cauliflower Diseases
  Cauliflower_Black_Rot: {
    description: "Bacterial disease causing V-shaped yellow lesions",
    treatments: [
      "Use disease-free seeds",
      "Crop rotation for 2-3 years",
      "Apply copper-based bactericides",
      "Remove infected crop debris",
    ],
    severity: "High",
    symptoms: [
      "V-shaped yellow to brown lesions at leaf margins",
      "Black veins in affected areas",
      "Systemic infection leading to wilting",
      "Blackening of vascular tissues",
    ],
    crop: "Cauliflower",
    season: ["Rabi"],
    pathogen: "Xanthomonas campestris pv. campestris (bacteria)",
  },
  Cauliflower_Head_Rot: {
    description: "Bacterial disease causing rot of curd",
    treatments: [
      "Apply copper-based bactericides",
      "Proper spacing",
      "Avoid overhead irrigation",
      "Harvest heads promptly when mature",
    ],
    severity: "Very High",
    symptoms: [
      "Water-soaked lesions on curd",
      "Brown to black discoloration",
      "Soft rot with foul odor",
      "Curd becomes slimy",
    ],
    crop: "Cauliflower",
    season: ["Rabi"],
    pathogen: "Erwinia carotovora (bacteria)",
  },

  // Brinjal (Eggplant) Diseases
  Brinjal_Little_Leaf: {
    description: "Phytoplasma disease causing reduction in leaf size",
    treatments: [
      "Control leafhopper vectors",
      "Remove infected plants",
      "Apply systemic insecticides",
      "Maintain field hygiene",
    ],
    severity: "Very High",
    symptoms: [
      "Severe reduction in leaf size",
      "Yellowing of foliage",
      "Excessive branching",
      "Reduced fruit set",
    ],
    crop: "Brinjal (Eggplant)",
    season: ["Year-round"],
    pathogen: "Candidatus Phytoplasma asteris (phytoplasma)",
  },
  Brinjal_Fruit_Rot: {
    description: "Fungal disease causing rot of fruits",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper staking of plants",
      "Avoid fruit injuries",
      "Remove infected fruits",
    ],
    severity: "High",
    symptoms: [
      "Water-soaked lesions on fruits",
      "White to gray fuzzy growth",
      "Fruits become soft and rot",
      "Concentric rings on infected areas",
    ],
    crop: "Brinjal (Eggplant)",
    season: ["Rainy season"],
    pathogen: "Phomopsis vexans (fungus)",
  },

  // Okra (Bhindi) Diseases
  Okra_Yellow_Vein_Mosaic: {
    description: "Viral disease causing yellow network of veins",
    treatments: [
      "Use resistant varieties",
      "Control whitefly vectors",
      "Remove infected plants",
      "Apply yellow sticky traps",
    ],
    severity: "Very High",
    symptoms: [
      "Yellow network of veins",
      "Interveinal areas remain green initially",
      "Complete yellowing in advanced stages",
      "Stunted growth and reduced yield",
    ],
    crop: "Okra (Bhindi)",
    season: ["Kharif"],
    pathogen: "Bhendi yellow vein mosaic virus (BYVMV)",
  },
  Okra_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Proper spacing for air circulation",
      "Avoid excessive nitrogen",
      "Remove infected plant debris",
    ],
    severity: "Moderate",
    symptoms: [
      "White powdery growth on upper leaf surface",
      "Yellowing of affected leaves",
      "Premature leaf drop",
      "Reduced fruit quality",
    ],
    crop: "Okra (Bhindi)",
    season: ["Kharif"],
    pathogen: "Erysiphe cichoracearum (fungus)",
  },

  // Cucurbits (Cucumber, Pumpkin, Bottle Gourd) Diseases
  Cucurbits_Downy_Mildew: {
    description: "Fungal disease causing angular yellow spots",
    treatments: [
      "Apply fungicides like Metalaxyl + Mancozeb",
      "Proper spacing and trellising",
      "Avoid overhead irrigation",
      "Crop rotation",
    ],
    severity: "High",
    symptoms: [
      "Angular yellow spots on upper leaf surface",
      "Grayish-purple fuzzy growth on lower surface",
      "Spots limited by leaf veins",
      "Leaves become brown and crisp",
    ],
    crop: "Cucurbits",
    season: ["Kharif", "Rainy season"],
    pathogen: "Pseudoperonospora cubensis (fungal-like organism)",
  },
  Cucurbits_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Proper spacing for air circulation",
      "Plant resistant varieties",
      "Remove infected plant parts",
    ],
    severity: "Moderate to High",
    symptoms: [
      "White powdery growth on both leaf surfaces",
      "Yellowing and drying of affected leaves",
      "Reduced fruit size and quality",
      "Premature senescence",
    ],
    crop: "Cucurbits",
    season: ["Kharif", "Summer"],
    pathogen: "Sphaerotheca fuliginea (fungus)",
  },

  // Chilli (Hot Pepper) Diseases
  Chilli_Leaf_Curl: {
    description: "Viral disease causing curling and crinkling of leaves",
    treatments: [
      "Control whitefly vectors",
      "Use reflective mulches",
      "Remove and destroy infected plants",
      "Use virus-free seedlings",
    ],
    severity: "Very High",
    symptoms: [
      "Upward or downward curling of leaves",
      "Crinkling and puckering of leaf lamina",
      "Stunted plant growth",
      "Small, deformed fruits",
    ],
    crop: "Chilli (Hot Pepper)",
    season: ["Year-round"],
    pathogen: "Chilli leaf curl virus (ChLCV)",
  },
  Chilli_Anthracnose: {
    description: "Fungal disease affecting fruits",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper spacing for air circulation",
      "Crop rotation",
      "Remove infected fruits and plant debris",
    ],
    severity: "High",
    symptoms: [
      "Circular, sunken lesions on fruits",
      "Dark center with concentric rings",
      "Salmon-colored spore masses",
      "Fruit rot and premature fruit drop",
    ],
    crop: "Chilli (Hot Pepper)",
    season: ["Rainy season"],
    pathogen: "Colletotrichum capsici (fungus)",
  },

  // More Fruit Crops

  // Pomegranate Diseases
  Pomegranate_Bacterial_Blight: {
    description: "Bacterial disease causing spots on leaves, stems, and fruits",
    treatments: [
      "Apply copper-based bactericides",
      "Prune and destroy infected branches",
      "Maintain proper spacing",
      "Avoid overhead irrigation",
    ],
    severity: "Very High",
    symptoms: [
      "Dark brown to black spots on leaves",
      "Spots with water-soaked margins",
      "Cankerous lesions on stems",
      "Brown spots on fruits",
    ],
    crop: "Pomegranate",
    season: ["Rainy season"],
    pathogen: "Xanthomonas axonopodis pv. punicae (bacteria)",
  },
  Pomegranate_Anthracnose: {
    description: "Fungal disease affecting fruits and leaves",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper pruning for air circulation",
      "Remove infected plant parts",
      "Bagging of fruits",
    ],
    severity: "High",
    symptoms: [
      "Dark, sunken lesions on fruits",
      "Circular spots with concentric rings on leaves",
      "Cracking of affected fruits",
      "Fruit rot",
    ],
    crop: "Pomegranate",
    season: ["Rainy season"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },

  // Custard Apple Diseases
  Custard_Apple_Anthracnose: {
    description: "Fungal disease affecting fruits and leaves",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper pruning for air circulation",
      "Remove infected fruits",
      "Maintain orchard hygiene",
    ],
    severity: "High",
    symptoms: [
      "Dark, sunken lesions on fruits",
      "Brown spots on leaves",
      "Premature fruit drop",
      "Fruit rot",
    ],
    crop: "Custard Apple",
    season: ["Rainy season"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },
  Custard_Apple_Rust: {
    description: "Fungal disease causing rust spots on leaves",
    treatments: [
      "Apply fungicides like Propiconazole",
      "Remove infected leaves",
      "Proper spacing",
      "Maintain orchard hygiene",
    ],
    severity: "Moderate",
    symptoms: [
      "Orange to brown pustules on leaves",
      "Premature leaf fall",
      "Reduced photosynthesis",
      "Reduced fruit yield",
    ],
    crop: "Custard Apple",
    season: ["Rainy season"],
    pathogen: "Phakopsora cherimoliae (fungus)",
  },

  // Litchi Diseases
  Litchi_Anthracnose: {
    description: "Fungal disease affecting leaves, twigs, and fruits",
    treatments: [
      "Apply fungicides like Copper oxychloride",
      "Prune infected twigs",
      "Improve air circulation",
      "Maintain orchard hygiene",
    ],
    severity: "High",
    symptoms: [
      "Brown spots on leaves",
      "Dieback of twigs",
      "Dark, sunken lesions on fruits",
      "Fruit cracking and rot",
    ],
    crop: "Litchi",
    season: ["Rainy season"],
    pathogen: "Colletotrichum gloeosporioides (fungus)",
  },
  Litchi_Red_Rust: {
    description: "Algal disease causing reddish-brown felty patches",
    treatments: [
      "Apply Bordeaux mixture",
      "Pruning of affected branches",
      "Improve air circulation",
      "Maintain tree vigor",
    ],
    severity: "Moderate",
    symptoms: [
      "Reddish-brown felty patches on leaves",
      "Velvety growth on leaf undersides",
      "Premature leaf fall",
      "Reduced tree vigor",
    ],
    crop: "Litchi",
    season: ["Rainy season"],
    pathogen: "Cephaleuros virescens (parasitic green alga)",
  },

  // Sapota (Chiku) Diseases
  Sapota_Leaf_Spot: {
    description: "Fungal disease causing spots on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Remove infected leaves",
      "Proper spacing",
      "Maintain orchard hygiene",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular brown spots on leaves",
      "Spots with dark margins",
      "Premature leaf drop",
      "Reduced tree vigor",
    ],
    crop: "Sapota (Chiku)",
    season: ["Rainy season"],
    pathogen: "Pestalotiopsis sapotae (fungus)",
  },
  Sapota_Sooty_Mold: {
    description: "Fungal growth on honeydew secreted by insects",
    treatments: [
      "Control sap-sucking insects",
      "Apply insecticidal soap",
      "Spray fungicides",
      "Maintain tree vigor",
    ],
    severity: "Moderate",
    symptoms: [
      "Black, powdery covering on leaves",
      "Reduced photosynthesis",
      "Honeydew secretion on leaves",
      "Presence of sap-sucking insects",
    ],
    crop: "Sapota (Chiku)",
    season: ["Year-round"],
    pathogen: "Capnodium spp. (fungus)",
  },

  // Aonla (Indian Gooseberry) Diseases
  Aonla_Rust: {
    description: "Fungal disease causing rust pustules on leaves",
    treatments: [
      "Apply fungicides like Propiconazole",
      "Remove infected leaves",
      "Proper spacing",
      "Maintain orchard hygiene",
    ],
    severity: "High",
    symptoms: [
      "Orange to brown pustules on leaf undersides",
      "Yellowing of affected leaves",
      "Premature leaf fall",
      "Reduced fruit yield",
    ],
    crop: "Aonla (Indian Gooseberry)",
    season: ["Rainy season"],
    pathogen: "Ravenelia emblica (fungus)",
  },
  Aonla_Sooty_Mold: {
    description: "Fungal growth on honeydew secreted by insects",
    treatments: [
      "Control sap-sucking insects",
      "Apply insecticidal soap",
      "Spray fungicides",
      "Maintain tree vigor",
    ],
    severity: "Moderate",
    symptoms: [
      "Black, powdery covering on leaves",
      "Reduced photosynthesis",
      "Honeydew secretion on leaves",
      "Presence of sap-sucking insects",
    ],
    crop: "Aonla (Indian Gooseberry)",
    season: ["Year-round"],
    pathogen: "Capnodium spp. (fungus)",
  },

  // Ber (Indian Jujube) Diseases
  Ber_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Pruning for air circulation",
      "Remove infected parts",
      "Maintain tree vigor",
    ],
    severity: "High",
    symptoms: [
      "White powdery growth on leaves and fruits",
      "Distortion of young leaves",
      "Premature leaf fall",
      "Reduced fruit set and quality",
    ],
    crop: "Ber (Indian Jujube)",
    season: ["Winter"],
    pathogen: "Oidium erysiphoides (fungus)",
  },
  Ber_Fruit_Rot: {
    description: "Fungal disease causing rot of fruits",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Proper spacing for air circulation",
      "Remove infected fruits",
      "Timely harvesting",
    ],
    severity: "High",
    symptoms: [
      "Brown, water-soaked spots on fruits",
      "Spots enlarge and cover entire fruit",
      "Fruit softening and rotting",
      "White to gray fungal growth on infected fruits",
    ],
    crop: "Ber (Indian Jujube)",
    season: ["Winter"],
    pathogen: "Alternaria alternata (fungus)",
  },

  // Watermelon Diseases
  Watermelon_Anthracnose: {
    description: "Fungal disease affecting leaves, stems, and fruits",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Crop rotation",
      "Proper spacing",
      "Use disease-free seeds",
    ],
    severity: "High",
    symptoms: [
      "Small, water-soaked spots on leaves",
      "Spots enlarge and turn brown with yellow halos",
      "Sunken, circular lesions on fruits",
      "Pink to salmon-colored spore masses",
    ],
    crop: "Watermelon",
    season: ["Summer", "Rainy season"],
    pathogen: "Colletotrichum lagenarium (fungus)",
  },
  Watermelon_Fusarium_Wilt: {
    description: "Fungal disease causing wilting and yellowing",
    treatments: [
      "Use resistant varieties",
      "Crop rotation for 5-7 years",
      "Soil solarization",
      "Use disease-free seedlings",
    ],
    severity: "Very High",
    symptoms: [
      "Wilting of runners from tip backward",
      "Yellowing of leaves",
      "Brown discoloration of vascular tissue",
      "Plant death",
    ],
    crop: "Watermelon",
    season: ["Summer"],
    pathogen: "Fusarium oxysporum f. sp. niveum (fungus)",
  },

  // =================== SPECIALTY CROPS ===================

  // Mushroom Diseases
  Mushroom_Green_Mold: {
    description: "Fungal disease affecting mushroom beds",
    treatments: [
      "Maintain proper hygiene",
      "Sterilize growing medium properly",
      "Control temperature and humidity",
      "Remove infected portions",
    ],
    severity: "Very High",
    symptoms: [
      "Green mold growth on substrate",
      "Poor mushroom growth",
      "Reduced yield",
      "Contamination spreads rapidly",
    ],
    crop: "Mushroom",
    season: ["Year-round"],
    pathogen: "Trichoderma spp. (fungus)",
  },
  Mushroom_Bacterial_Blotch: {
    description: "Bacterial disease affecting mushroom caps",
    treatments: [
      "Improve air circulation",
      "Avoid overwatering",
      "Maintain proper sanitation",
      "Control relative humidity",
    ],
    severity: "High",
    symptoms: [
      "Brown to yellowish-brown spots on caps",
      "Spots may coalesce",
      "Sticky or slimy surface",
      "Unpleasant odor",
    ],
    crop: "Mushroom",
    season: ["Year-round"],
    pathogen: "Pseudomonas tolaasii (bacteria)",
  },

  // Rose Diseases
  Rose_Black_Spot: {
    description: "Fungal disease causing black spots on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Remove infected leaves",
      "Improve air circulation",
      "Avoid overhead irrigation",
    ],
    severity: "High",
    symptoms: [
      "Circular black spots on leaves",
      "Yellowing around spots",
      "Premature defoliation",
      "Reduced plant vigor",
    ],
    crop: "Rose",
    season: ["Rainy season"],
    pathogen: "Diplocarpon rosae (fungus)",
  },
  Rose_Powdery_Mildew: {
    description: "Fungal disease causing white powdery growth",
    treatments: [
      "Apply sulfur-based fungicides",
      "Improve air circulation",
      "Prune infected parts",
      "Avoid overhead irrigation",
    ],
    severity: "Moderate to High",
    symptoms: [
      "White powdery growth on leaves, stems, and buds",
      "Distortion of young leaves and buds",
      "Reduced flowering",
      "Premature leaf drop",
    ],
    crop: "Rose",
    season: ["Spring", "Summer"],
    pathogen: "Podosphaera pannosa (fungus)",
  },

  // Chrysanthemum Diseases
  Chrysanthemum_White_Rust: {
    description: "Fungal disease causing white pustules on leaves",
    treatments: [
      "Apply fungicides like Propiconazole",
      "Remove infected leaves",
      "Improve air circulation",
      "Avoid overhead irrigation",
    ],
    severity: "High",
    symptoms: [
      "White to cream-colored pustules on leaf undersides",
      "Yellow spots on upper leaf surface",
      "Stunted growth",
      "Reduced flowering",
    ],
    crop: "Chrysanthemum",
    season: ["Summer", "Rainy season"],
    pathogen: "Puccinia horiana (fungus)",
  },
  Chrysanthemum_Leaf_Spot: {
    description: "Fungal disease causing spots on leaves",
    treatments: [
      "Apply fungicides like Mancozeb",
      "Remove infected leaves",
      "Improve air circulation",
      "Avoid overhead irrigation",
    ],
    severity: "Moderate",
    symptoms: [
      "Circular brown spots on leaves",
      "Spots with dark margins",
      "Premature leaf drop",
      "Reduced plant vigor",
    ],
    crop: "Chrysanthemum",
    season: ["Rainy season"],
    pathogen: "Septoria chrysanthemi (fungus)",
  },

  // Gladiolus Diseases
  Gladiolus_Fusarium_Wilt: {
    description: "Fungal disease affecting corms and plants",
    treatments: [
      "Use disease-free corms",
      "Treat corms with fungicides",
      "Crop rotation",
      "Improve soil drainage",
    ],
    severity: "Very High",
    symptoms: [
      "Yellowing and wilting of leaves",
      "Brown lesions at base of plant",
      "Rotting of corms with reddish-brown discoloration",
      "Stunted growth",
    ],
    crop: "Gladiolus",
    season: ["Year-round"],
    pathogen: "Fusarium oxysporum f. sp. gladioli (fungus)",
  },
  Gladiolus_Botrytis_Blight: {
    description: "Fungal disease affecting flowers and leaves",
    treatments: [
      "Apply fungicides like Carbendazim",
      "Improve air circulation",
      "Remove infected plant parts",
      "Avoid overhead irrigation",
    ],
    severity: "High",
    symptoms: [
      "Water-soaked spots on flowers and leaves",
      "Gray mold on infected parts",
      "Flower discoloration",
      "Premature wilting of flowers",
    ],
    crop: "Gladiolus",
    season: ["Rainy season"],
    pathogen: "Botrytis gladiolorum (fungus)",
  },
};

export default diseaseDatabase;
