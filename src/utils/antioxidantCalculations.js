const toNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const firstNumber = (source, keys, fallback = 0) => {
  if (!source) return fallback;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      return toNumber(source[key], fallback);
    }
  }
  return fallback;
};

const firstNumberOrUndefined = (source, keys) => {
  if (!source) return undefined;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== "" && source[key] !== null && source[key] !== undefined) {
      const parsed = parseFloat(source[key]);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
  }
  return undefined;
};

const positiveOrDefault = (value, fallback = 1) => {
  const parsed = toNumber(value, fallback);
  return parsed > 0 ? parsed : fallback;
};

export const calculateCatActivity = (values = {}, params = {}) => {
  const catParams = params.cat || {};
  const sampleSlope = firstNumber(values, ["sample_slope", "cat_sample_slope", "240", "dA_min", "delta_A", "slope"], 0);
  const rowControlSlope = firstNumberOrUndefined(values, ["h2o2_control_slope", "H2O2_control_slope", "control_slope"]);
  const controlSlope = rowControlSlope ?? firstNumber(catParams, ["h2o2_control_slope", "H2O2_control_slope", "control_slope"], 0);
  const pathlength = positiveOrDefault(firstNumber(catParams, ["pathlength", "path_length", "l"], firstNumber(params, ["pathlength", "path_length", "l"], 1)), 1);
  const dilutionFactor = positiveOrDefault(firstNumber(catParams, ["dilutionFactor", "df", "DF"], firstNumber(params, ["dilutionFactor", "df", "DF"], 1)), 1);

  const correctedDeltaA = -(sampleSlope - controlSlope);
  const result = correctedDeltaA * 152.9 / pathlength * dilutionFactor;

  return {
    result,
    correctedDeltaA,
    unit: "μmol/min/mg DW"
  };
};

export const calculatePodActivity = (values = {}, params = {}) => {
  const podParams = params.pod || {};
  const sampleSlope = firstNumber(values, ["sample_slope", "pod_sample_slope", "470", "dA_min", "delta_A", "slope"], 0);
  const rowBlankSlope = firstNumberOrUndefined(values, ["blank_slope", "Blank_slope"]);
  const blankSlope = rowBlankSlope ?? firstNumber(podParams, ["blank_slope", "Blank_slope"], 0);
  const pathlength = positiveOrDefault(firstNumber(podParams, ["pathlength", "path_length", "l"], firstNumber(params, ["pathlength", "path_length", "l"], 1)), 1);
  const dilutionFactor = positiveOrDefault(firstNumber(podParams, ["dilutionFactor", "df", "DF"], firstNumber(params, ["dilutionFactor", "df", "DF"], 1)), 1);

  const correctedDeltaA = sampleSlope - blankSlope;
  const result = correctedDeltaA * 0.0376 / pathlength * dilutionFactor;

  return {
    result,
    correctedDeltaA,
    unit: "μmol/min/mg DW"
  };
};

export const calculateSodActivity = (values = {}, params = {}) => {
  const sodParams = params.sod || {};
  const lightControl = firstNumber(sodParams, ["light_control_abs", "control_abs", "light_control"], 0);
  const darkBlank = firstNumber(sodParams, ["dark_blank_abs", "dark_blank"], 0);
  const sampleAbs = firstNumber(values, ["560", "sample_abs", "sample_a560", "A560"], 0);
  const sampleDarkBlank = firstNumberOrUndefined(values, ["sample_dark_blank", "560_dark_blank", "sample_dark", "sample_dark_abs", "sample_dark_a560"]);
  const dilutionFactor = positiveOrDefault(firstNumber(sodParams, ["dilutionFactor", "df", "DF"], firstNumber(params, ["dilutionFactor", "df", "DF"], 1)), 1);

  const controlCorr = lightControl - darkBlank;
  const sampleCorr = sampleAbs - (sampleDarkBlank ?? darkBlank);
  const inhibition = controlCorr !== 0 ? ((controlCorr - sampleCorr) / controlCorr) * 100 : 0;
  const result = inhibition * 0.02 * dilutionFactor;

  return {
    result,
    inhibition,
    controlCorr,
    sampleCorr,
    unit: "unit/mg DW"
  };
};
