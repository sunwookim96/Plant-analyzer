const COMMON_FIELDS = {
  chlorophyll_a_b: ["665.2", "652.4", "470"],
  carotenoid: ["470", "665.2", "652.4"],
  total_phenol: ["765"],
  total_flavonoid: ["415"],
  glucosinolate: ["425"],
  dpph_scavenging: ["517"],
  anthocyanin: ["530", "600"],
  h2o2: ["390"]
};

const LABELS = {
  ko: {
    sampleSlope240: "Sample slope (ΔA240/min)",
    sampleSlope470: "Sample slope (ΔA470/min)",
    sampleA560: "Sample A560 (광조건)",
    sampleDarkBlank: "Sample dark blank A560 (선택)",
    optionalSuffix: "선택",
    examplePrefix: "예",
    emptyHint: "없으면 빈칸"
  },
  en: {
    sampleSlope240: "Sample slope (ΔA240/min)",
    sampleSlope470: "Sample slope (ΔA470/min)",
    sampleA560: "Sample A560 (light)",
    sampleDarkBlank: "Sample dark blank A560 (optional)",
    optionalSuffix: "optional",
    examplePrefix: "e.g.",
    emptyHint: "Leave blank if none"
  }
};

const labelForWavelength = (key) => `${key} nm`;

const baseField = (key) => ({
  key,
  label: labelForWavelength(key),
  shortLabel: key,
  placeholder: "0.000",
  optional: false,
  aliases: []
});

export const getMeasurementFields = (analysisType, lang = "ko") => {
  const text = LABELS[lang] || LABELS.ko;

  if (analysisType === "cat") {
    return [
      {
        key: "sample_slope",
        label: text.sampleSlope240,
        shortLabel: "ΔA240/min",
        placeholder: `${text.examplePrefix}: -0.050`,
        optional: false,
        aliases: ["240", "dA_min", "delta_A", "slope", "cat_sample_slope"]
      }
    ];
  }

  if (analysisType === "pod") {
    return [
      {
        key: "sample_slope",
        label: text.sampleSlope470,
        shortLabel: "ΔA470/min",
        placeholder: `${text.examplePrefix}: 0.050`,
        optional: false,
        aliases: ["470", "dA_min", "delta_A", "slope", "pod_sample_slope"]
      }
    ];
  }

  if (analysisType === "sod") {
    return [
      {
        key: "560",
        label: text.sampleA560,
        shortLabel: "A560",
        placeholder: `${text.examplePrefix}: 0.450`,
        optional: false,
        aliases: ["sample_abs", "sample_a560", "A560"]
      },
      {
        key: "sample_dark_blank",
        label: text.sampleDarkBlank,
        shortLabel: "Sample dark blank",
        placeholder: text.emptyHint,
        optional: true,
        aliases: ["560_dark_blank", "sample_dark", "sample_dark_abs", "sample_dark_a560"]
      }
    ];
  }

  const commonFields = (COMMON_FIELDS[analysisType] || []).map(baseField);
  if (["total_phenol", "total_flavonoid"].includes(analysisType) && commonFields[0]) {
    commonFields[0].aliases = ["Absorbance", "absorbance"];
  }
  return commonFields;
};

export const getMeasurementKeys = (analysisType) => getMeasurementFields(analysisType).map(field => field.key);

export const getMeasurementLabel = (analysisType, key, lang = "ko") => {
  const fields = getMeasurementFields(analysisType, lang);
  const field = fields.find(item => item.key === key || item.aliases?.includes(key));
  return field?.shortLabel || field?.label || labelForWavelength(key);
};

export const getFieldValueFromRow = (row, field) => {
  const keys = [field.key, ...(field.aliases || [])];
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== "") {
      return row[key];
    }
  }
  return field.optional ? "" : "0";
};
