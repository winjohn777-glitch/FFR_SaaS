/**
 * Miami-Dade NOA (Notice of Acceptance) Roof Systems Catalog
 * Comprehensive database of approved roof systems by manufacturer
 * For Florida First Roofing LLC operations in HVHZ areas
 */

const miamDadeNOACatalog = {
  // GAF Systems
  gaf: {
    manufacturer: "GAF",
    company: "GAF Materials Corporation",
    website: "gaf.com",
    systems: {
      "timberline-hdz": {
        productName: "Timberline HDZ®",
        noaNumber: "21-1209.01",
        expirationDate: "2026-12-09",
        windRating: "150 mph (Vasd) / 194 mph (Vult)",
        category: "Architectural Shingles",
        description: "High Definition shingles with LayerLock Technology",

        specifications: {
          nailRequirement: "Minimum 4 nails per shingle (6 nails for HVHZ)",
          nailType: "11-gauge steel roofing nails, minimum 1.25\" long",
          nailPattern: "1\" from edges, 12\" spacing",
          fastenerCount: "221 nails per pound (11-gauge)",
          staplePennitted: false,
          deckRequirement: "Solid wood deck minimum 15/32\" OSB or plywood",

          hvhzRequirements: {
            nailCount: 6,
            windSpeed: "150 mph design speed",
            specialInstallation: true,
            noaRequired: true
          }
        },

        installationSteps: {
          preparation: [
            "Verify NOA documentation is available on-site",
            "Inspect deck for solid wood construction (min 15/32\")",
            "Ensure proper ventilation system design",
            "Install approved underlayment per manufacturer specs"
          ],
          installation: [
            "Begin installation at lower edge with starter strip",
            "Use 6-nail pattern for HVHZ: 2 nails 1\" from each end, 4 nails in field",
            "Maintain minimum 2\" head lap and 3\" side lap",
            "Drive nails flush with shingle surface (do not overdrive)",
            "Install in straight horizontal lines with proper exposure"
          ],
          finishing: [
            "Install hip and ridge shingles with approved fasteners",
            "Verify all penetrations are properly sealed",
            "Apply manufacturer-required labeling",
            "Complete final inspection checklist"
          ]
        }
      },

      "timberline-uhdz": {
        productName: "Timberline UHDZ®",
        noaNumber: "21-1209.01",
        expirationDate: "2026-12-09",
        windRating: "150 mph (Vasd) / 194 mph (Vult)",
        category: "Ultra High Definition Shingles",
        description: "Ultra High Definition shingles with enhanced LayerLock Technology"
      },

      "fortitude": {
        productName: "Fortitude®",
        noaNumber: "21-1209.01",
        expirationDate: "2026-12-09",
        windRating: "150 mph (Vasd) / 194 mph (Vult)",
        category: "Impact Resistant Shingles",
        description: "Class 4 impact resistant shingles for severe weather protection"
      }
    }
  },

  // Owens Corning Systems
  owensCorning: {
    manufacturer: "Owens Corning",
    company: "Owens Corning Roofing and Asphalt LLC",
    website: "owenscorning.com",
    systems: {
      "duration": {
        productName: "TruDefinition® Duration®",
        noaNumber: "21-0518.04",
        expirationDate: "2026-07-19",
        windRating: "130 mph (with SureNail Technology)",
        category: "Architectural Shingles",
        description: "Shingles with patented SureNail Technology strip",

        specifications: {
          nailRequirement: "4 nails standard (6 nails for HVHZ)",
          nailType: "11-gauge galvanized steel roofing nails",
          nailPattern: "SureNail Technology guides placement",
          specialFeature: "SureNail fabric strip for enhanced grip",
          fastenerCount: "Standard roofing nails",
          deckRequirement: "Solid wood deck per building code",

          hvhzRequirements: {
            nailCount: 6,
            windSpeed: "130 mph standard / enhanced for HVHZ",
            sureNailTechnology: true,
            noaRequired: true
          }
        },

        installationSteps: {
          preparation: [
            "Verify NOA compliance documentation",
            "Install on solid wood deck only",
            "Apply proper underlayment system",
            "Set up SureNail alignment guides"
          ],
          installation: [
            "Align nails with SureNail Technology fabric strip",
            "Use 6-nail pattern for HVHZ installations",
            "Drive nails through designated nailing zones",
            "Maintain manufacturer-specified exposure rates",
            "Follow stepped installation pattern"
          ],
          finishing: [
            "Install hip and ridge with SureNail guidelines",
            "Verify SureNail strip integrity throughout",
            "Apply required Miami-Dade labeling",
            "Document SureNail compliance"
          ]
        }
      },

      "duration-designer": {
        productName: "TruDefinition® Duration® Designer Colors",
        noaNumber: "21-0518.04",
        expirationDate: "2026-07-19",
        windRating: "130 mph (with SureNail Technology)",
        category: "Premium Architectural Shingles",
        description: "Designer color collection with SureNail Technology"
      }
    }
  },

  // CertainTeed Systems
  certainTeed: {
    manufacturer: "CertainTeed",
    company: "CertainTeed Corporation",
    website: "certainteed.com",
    systems: {
      "landmark": {
        productName: "Landmark®",
        noaNumber: "22-1109.02",
        expirationDate: "2028-01-02",
        windRating: "110 mph standard / 130 mph with upgrades",
        category: "Architectural Shingles",
        description: "Architectural shingles with NailTrak Technology",

        specifications: {
          nailRequirement: "4 nails standard (6 nails for HVHZ)",
          nailType: "11-gauge galvanized steel roofing nails",
          nailPattern: "NailTrak guides for proper placement",
          specialFeature: "NailTrak alignment system",
          fastenerCount: "Standard roofing nail specifications",
          deckRequirement: "Solid wood sheathing minimum thickness",

          hvhzRequirements: {
            nailCount: 6,
            windSpeed: "Enhanced for HVHZ applications",
            nailTrakTechnology: true,
            noaRequired: true
          }
        },

        installationSteps: {
          preparation: [
            "Confirm NOA approval documentation",
            "Verify solid deck construction",
            "Install appropriate underlayment",
            "Set NailTrak alignment system"
          ],
          installation: [
            "Follow NailTrak guidelines for nail placement",
            "Install 6 nails per shingle in HVHZ areas",
            "Use three defined nailing lines for guidance",
            "Maintain proper overlap and exposure",
            "Apply steep-slope guidelines as needed"
          ],
          finishing: [
            "Complete hip and ridge installation",
            "Verify NailTrak compliance throughout",
            "Install Miami-Dade required labeling",
            "Perform final NailTrak verification"
          ]
        }
      },

      "landmark-pro": {
        productName: "Landmark PRO®",
        noaNumber: "22-1109.02",
        expirationDate: "2028-01-02",
        windRating: "130 mph with proper installation",
        category: "Premium Architectural Shingles",
        description: "Enhanced Landmark with superior wind resistance"
      },

      "modified-bitumen": {
        productName: "Modified Bitumen Roof Systems",
        noaNumber: "22-1109.02",
        expirationDate: "2028-01-02",
        windRating: "Per system specifications",
        category: "Commercial Roofing",
        description: "Modified Bitumen systems over steel decks"
      }
    }
  },

  // Additional Major Manufacturers
  atlasRoofing: {
    manufacturer: "Atlas Roofing",
    company: "Atlas Roofing Corporation",
    website: "atlasroofing.com",
    systems: {
      "pinnacle-pristine": {
        productName: "Pinnacle® Pristine",
        noaNumber: "Various",
        windRating: "130 mph",
        category: "Designer Shingles",
        description: "Algae-resistant architectural shingles"
      }
    }
  },

  malarkeyRoofing: {
    manufacturer: "Malarkey",
    company: "Malarkey Roofing Products",
    website: "malarkeyroofing.com",
    systems: {
      "highlander": {
        productName: "Highlander®",
        noaNumber: "Various",
        windRating: "110-130 mph",
        category: "Architectural Shingles",
        description: "NEX polymer modified shingles"
      }
    }
  },

  // Metal Roofing Systems
  gulfCoastSupply: {
    manufacturer: "Gulf Coast Supply",
    company: "Gulf Coast Supply & Manufacturing Inc.",
    website: "gulfcoastsupply.com",
    systems: {
      "standing-seam-aluminum": {
        productName: "Standing Seam Aluminum Roof System",
        noaNumber: "23-0915.01",
        expirationDate: "2028-09-15",
        windRating: "175 mph (Vasd) / 220 mph (Vult)",
        category: "Metal Roofing - Standing Seam",
        description: "Structural standing seam aluminum roofing system for HVHZ applications",

        specifications: {
          materialGauge: "0.032\" (.8mm) aluminum",
          panelWidth: "16\" coverage",
          seamHeight: "1.5\" minimum",
          fastenerType: "Concealed clip fastening system",
          thermalMovement: "Accommodates thermal expansion/contraction",
          deckRequirement: "Structural deck minimum 15/32\" plywood/OSB",
          underlyment: "Self-adhering ice/water shield required",

          hvhzRequirements: {
            windSpeed: "175 mph design speed",
            clipSpacing: "12\" maximum on centers",
            edgeDetails: "HVHZ approved edge securement",
            noaRequired: true,
            structuralAnalysis: "Required for each application"
          }
        }
      },

      "corrugated-steel": {
        productName: "Corrugated Steel Panel System",
        noaNumber: "23-0915.02",
        expirationDate: "2028-09-15",
        windRating: "150 mph with proper fastening",
        category: "Metal Roofing - Corrugated",
        description: "Galvanized corrugated steel roofing panels"
      }
    }
  },

  triCountyMetals: {
    manufacturer: "Tri County Metals",
    company: "Tri County Metals Inc.",
    website: "tricountymetals.com",
    systems: {
      "snap-lock-steel": {
        productName: "Snap-Lock Steel Standing Seam",
        noaNumber: "22-1201.03",
        expirationDate: "2027-12-01",
        windRating: "160 mph (Vasd) / 200 mph (Vult)",
        category: "Metal Roofing - Snap Lock",
        description: "Mechanical lock standing seam steel system",

        specifications: {
          materialGauge: "24-gauge galvanized steel with coating",
          panelWidth: "12\" or 16\" coverage options",
          seamHeight: "1.25\" snap-lock profile",
          fastenerType: "Fixed and sliding clip system",
          coating: "Kynar 500/Hylar 5000 PVDF finish",
          deckRequirement: "Solid structural deck",

          hvhzRequirements: {
            windSpeed: "160 mph design speed",
            clipSpacing: "16\" maximum on centers",
            seamEngagement: "Full mechanical lock required",
            noaRequired: true
          }
        }
      },

      "metal-tile": {
        productName: "Metal Tile Profile System",
        noaNumber: "22-1201.04",
        windRating: "140 mph",
        category: "Metal Roofing - Tile Profile",
        description: "Steel panels with tile appearance profile"
      }
    }
  },

  // TPO Single-Ply Systems
  carlisleTPO: {
    manufacturer: "Carlisle",
    company: "Carlisle Construction Materials LLC",
    website: "carlisleccm.com",
    systems: {
      "sure-weld-tpo": {
        productName: "Sure-Weld TPO Membrane System",
        noaNumber: "21-0806.05",
        expirationDate: "2026-08-06",
        windRating: "Per system design - up to 180 mph",
        category: "TPO Single-Ply Membrane",
        description: "Thermoplastic polyolefin roofing membrane system",

        specifications: {
          membraneThickness: "45, 60, 80 mil options",
          reinforcement: "Polyester scrim reinforced",
          attachment: "Mechanically attached or fully adhered",
          seamWelding: "Hot-air welded seams",
          insulation: "Polyiso or XPS compatible",
          deckRequirement: "Steel, concrete, or wood deck",

          hvhzRequirements: {
            windSpeed: "Design specific up to 180 mph",
            fastenerPattern: "Enhanced fastening for HVHZ",
            edgeDetails: "HVHZ approved terminations",
            noaRequired: true,
            fieldTesting: "Seam strength testing required"
          }
        }
      }
    }
  },

  versicoPO: {
    manufacturer: "Versico",
    company: "Versico Roofing Systems",
    website: "versico.com",
    systems: {
      "versiweld-tpo": {
        productName: "VersiWeld TPO System",
        noaNumber: "20-1115.02",
        windRating: "Design specific",
        category: "TPO Single-Ply Membrane",
        description: "TPO membrane with VersiFlex technology"
      }
    }
  },

  // EPDM Single-Ply Systems
  firestone: {
    manufacturer: "Firestone",
    company: "Firestone Building Products",
    website: "firestonebpco.com",
    systems: {
      "rubbergard-epdm": {
        productName: "RubberGard EPDM System",
        noaNumber: "19-0425.01",
        windRating: "Per system design",
        category: "EPDM Single-Ply Membrane",
        description: "Ethylene propylene diene monomer roofing system"
      }
    }
  },

  // Tile Roofing Systems
  eagleRoofingTile: {
    manufacturer: "Eagle Roofing Tile",
    company: "Eagle Roofing Products",
    website: "eagleroofingproducts.com",
    systems: {
      "capistrano-concrete-tile": {
        productName: "Capistrano Concrete Roof Tiles",
        noaNumber: "22-0718.01",
        expirationDate: "2027-07-18",
        windRating: "150 mph with proper installation",
        category: "Concrete Roof Tiles",
        description: "High-profile concrete roof tiles for HVHZ applications",

        specifications: {
          materialType: "Concrete with integral color",
          tileProfile: "High-profile mission style",
          weight: "Approximately 950 lbs per square",
          fastenerType: "Corrosion-resistant fasteners required",
          underlayment: "Two layers minimum for HVHZ",
          headlap: "3\" minimum",

          hvhzRequirements: {
            windSpeed: "150 mph design speed",
            fastenerCount: "2 fasteners per tile minimum",
            noseFixing: "Nose fixing required for perimeter tiles",
            noaRequired: true,
            structuralAnalysis: "Load calculations required"
          }
        }
      }
    }
  },

  bermudaRoofTile: {
    manufacturer: "Bermuda Roof Tile",
    company: "Bermuda Roof Tile Company",
    website: "bermudarooftile.com",
    systems: {
      "hurricane-clay-tile": {
        productName: "Hurricane Clay Roof Tiles",
        noaNumber: "21-0920.02",
        windRating: "160 mph",
        category: "Clay Roof Tiles",
        description: "Clay roof tiles engineered for hurricane resistance"
      }
    }
  },

  // Modified Bitumen Systems (expanded)
  soprema: {
    manufacturer: "Soprema",
    company: "Soprema Inc.",
    website: "soprema.us",
    systems: {
      "sopralene-flam": {
        productName: "Sopralene Flam Modified Bitumen",
        noaNumber: "20-0312.01",
        windRating: "Per system design",
        category: "Modified Bitumen - Torch Applied",
        description: "SBS modified bitumen membrane system"
      },

      "colphene-self-adhered": {
        productName: "Colphene Self-Adhered Modified Bitumen",
        noaNumber: "20-0312.02",
        windRating: "Per system design",
        category: "Modified Bitumen - Self-Adhered",
        description: "Self-adhering SBS modified bitumen system"
      }
    }
  }
};

// HVHZ Installation Requirements (Common to All Systems)
const hvhzCommonRequirements = {
  windLoadRequirements: {
    designSpeed: "150 mph minimum",
    ultimateSpeed: "194 mph equivalent",
    pressureRating: "ASTM D3161 Class F or ASTM D7158 Class H"
  },

  installationStandards: {
    minimumNails: 6,
    nailType: "11-gauge steel minimum",
    nailLength: "1.25 inches minimum",
    deckRequirement: "Solid wood sheathing",
    staplesPermitted: false
  },

  documentationRequirements: {
    noaOnSite: "Complete NOA documentation required on job site",
    labeling: "Miami-Dade County Product Control Approved label required",
    inspectionAccess: "NOA available for Building Official inspection",
    manufacturerInstructions: "Complete manufacturer installation instructions required"
  },

  qualityControl: {
    nailPlacement: "Per manufacturer specifications with HVHZ modifications",
    exposure: "Manufacturer-specified exposure rates",
    overlap: "Minimum overlap requirements per NOA",
    flashing: "Enhanced flashing requirements for HVHZ"
  }
};

// Export for use in SOP generation
module.exports = {
  miamDadeNOACatalog,
  hvhzCommonRequirements,

  // Helper functions
  getSystemByManufacturer: (manufacturer) => {
    return miamDadeNOACatalog[manufacturer] || null;
  },

  getSystemByProduct: (productName) => {
    for (const manufacturer of Object.values(miamDadeNOACatalog)) {
      for (const [key, system] of Object.entries(manufacturer.systems || {})) {
        if (system.productName.toLowerCase().includes(productName.toLowerCase())) {
          return { manufacturer: manufacturer.manufacturer, system };
        }
      }
    }
    return null;
  },

  getAllSystems: () => {
    const allSystems = [];
    for (const [mfgKey, manufacturer] of Object.entries(miamDadeNOACatalog)) {
      for (const [sysKey, system] of Object.entries(manufacturer.systems || {})) {
        allSystems.push({
          manufacturerKey: mfgKey,
          systemKey: sysKey,
          manufacturer: manufacturer.manufacturer,
          ...system
        });
      }
    }
    return allSystems;
  }
};