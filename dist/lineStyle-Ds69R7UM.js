import { LineStyle } from "lightweight-charts";
const validateLineStyle = (lineStyle) => {
  if (lineStyle === null || lineStyle === void 0 || lineStyle === "") return void 0;
  if (typeof lineStyle === "number" && LineStyle && Object.values(LineStyle).includes(lineStyle)) {
    return lineStyle;
  }
  if (typeof lineStyle === "string" && LineStyle) {
    const styleMap = {
      solid: LineStyle.Solid,
      dotted: LineStyle.Dotted,
      dashed: LineStyle.Dashed,
      "large-dashed": LineStyle.LargeDashed,
      "sparse-dotted": LineStyle.SparseDotted
    };
    return styleMap[lineStyle.toLowerCase()];
  }
  if (Array.isArray(lineStyle)) {
    if (lineStyle.length > 0 && lineStyle.every((val) => typeof val === "number" && val >= 0) && LineStyle) {
      return LineStyle.Solid;
    }
  }
  return void 0;
};
const cleanLineStyleOptions = (options) => {
  if (!options) return options;
  const cleaned = { ...options };
  if (cleaned.debug !== void 0) {
    delete cleaned.debug;
  }
  if (cleaned.lineStyle !== void 0) {
    const validLineStyle = validateLineStyle(cleaned.lineStyle);
    if (validLineStyle !== void 0) {
      cleaned.lineStyle = validLineStyle;
    } else {
      delete cleaned.lineStyle;
    }
  }
  if (cleaned.style && typeof cleaned.style === "object") {
    cleaned.style = cleanLineStyleOptions(cleaned.style);
  }
  if (cleaned.upperLine && typeof cleaned.upperLine === "object") {
    cleaned.upperLine = cleanLineStyleOptions(cleaned.upperLine);
  }
  if (cleaned.middleLine && typeof cleaned.middleLine === "object") {
    cleaned.middleLine = cleanLineStyleOptions(cleaned.middleLine);
  }
  if (cleaned.lowerLine && typeof cleaned.lowerLine === "object") {
    cleaned.lowerLine = cleanLineStyleOptions(cleaned.lowerLine);
  }
  for (const key in cleaned) {
    if (cleaned[key] && typeof cleaned[key] === "object" && !Array.isArray(cleaned[key])) {
      cleaned[key] = cleanLineStyleOptions(cleaned[key]);
    }
  }
  return cleaned;
};
export {
  cleanLineStyleOptions as c,
  validateLineStyle as v
};
//# sourceMappingURL=lineStyle-Ds69R7UM.js.map
