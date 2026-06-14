// Color science: pure, dependency-free color math shared by the theme build
// (Display-P3 vibrant variants) and the previews. Each concern is a discrete
// module; this barrel re-exports the public surface.

export { hexToRgb01, srgbToLinear, linearToSrgb } from "./srgb";
export { srgbHexToP3Color, convertRolesToP3 } from "./p3";
