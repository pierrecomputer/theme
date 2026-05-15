// src/palette.ts

const gray = {
  "020":"#fbfbfb",
  "040":"#f9f9f9",
  "060":"#f8f8f8",
  "080":"#f2f2f3",
  "100":"#eeeeef",
  "200":"#dbdbdd",
  "300":"#c6c6c8",
  "400":"#adadb1",
  "500":"#8E8E95",
  "600":"#84848A",
  "700":"#79797F",
  "800":"#6C6C71",
  "900":"#4A4A4E",
  "920":"#424245",
  "940":"#39393c",
  "960":"#2e2e30",
  "980":"#1F1F21",
  "1000":"#141415",
  "1020":"#0B0B0C",
  "1040":"#070707"
};

const neutral = {
  "020":"#fafafa",
  "040":"#f7f7f7",
  "060":"#f5f5f5",
  "080":"#ededed",
  "100":"#e5e5e5",
  "200":"#d4d4d4",
  "300":"#bcbcbc",
  "400":"#a3a3a3",
  "500":"#8a8a8a",
  "600":"#737373",
  "700":"#636363",
  "800":"#525252",
  "900":"#404040",
  "920":"#363636",
  "940":"#2c2c2c",
  "960":"#262626",
  "980":"#1d1d1d",
  "1000":"#171717",
  "1020":"#101010",
  "1040":"#0a0a0a"
};

const red = {
  "050":"#ffedea",
  "100":"#ffdbd6",
  "200":"#ffb7ae",
  "300":"#ff9187",
  "400":"#ff6762",
  "500":"#ff2e3f",
  "600":"#d52c36",
  "700":"#ad292e",
  "800":"#862425",
  "900":"#611e1d",
  "950":"#3e1715"
};

const vermillion = {
  "050":"#fff0ea",
  "100":"#ffe2d6",
  "200":"#ffc4ad",
  "300":"#ffa685",
  "400":"#ff855e",
  "500":"#ff5d36",
  "600":"#d5512f",
  "700":"#ad4529",
  "800":"#863822",
  "900":"#612b1b",
  "950":"#3e1e14"
};

const orange = {
  "050":"#fff3ea",
  "100":"#ffe8d5",
  "200":"#ffd1ab",
  "300":"#ffba82",
  "400":"#ffa359",
  "500":"#fe8c2c",
  "600":"#d47628",
  "700":"#ac6023",
  "800":"#854c1e",
  "900":"#603819",
  "950":"#3d2513"
};

const amber = {
  "050": "#fff6ea",
  "100": "#ffeed5",
  "200": "#ffddab",
  "300": "#ffcc81",
  "400": "#ffbc56",
  "500": "#ffab16",
  "600": "#d5901c",
  "700": "#ac741d",
  "800": "#855b1b",
  "900": "#604218",
  "950": "#3d2b13"
};

const yellow = {
  "050": "#fff9ea",
  "100": "#fff4d5",
  "200": "#ffe9ab",
  "300": "#ffde80",
  "400": "#ffd452",
  "500": "#ffca00",
  "600": "#d5a910",
  "700": "#ac8816",
  "800": "#856a17",
  "900": "#604c16",
  "950": "#3d3112"
};

const lime = {
  "050": "#f6f9ec",
  "100": "#edf4d8",
  "200": "#dae8b1",
  "300": "#c6dc8a",
  "400": "#afd062",
  "500": "#86c427",
  "600": "#77a42a",
  "700": "#658527",
  "800": "#516723",
  "900": "#3e4b1d",
  "950": "#2a3016"
};

const green = {
  "050": "#edf9ed",
  "100": "#daf3db",
  "200": "#b4e7b7",
  "300": "#8cda94",
  "400": "#5ecc71",
  "500": "#0dbe4e",
  "600": "#199f43",
  "700": "#1d8138",
  "800": "#1d642e",
  "900": "#1b4923",
  "950": "#162f19"
};

const jade = {
  "050": "#edfaf2",
  "100": "#dbf4e5",
  "200": "#b6e9cb",
  "300": "#8eddb2",
  "400": "#60d199",
  "500": "#07c480",
  "600": "#18a46c",
  "700": "#1d8558",
  "800": "#1e6746",
  "900": "#1c4b34",
  "950": "#163023"
};

const mint = {
  "050": "#edfaf7",
  "100": "#dbf5ef",
  "200": "#b7ebdf",
  "300": "#8fe0d0",
  "400": "#61d5c0",
  "500": "#00cab1",
  "600": "#16a994",
  "700": "#1d8978",
  "800": "#1e6a5e",
  "900": "#1c4d44",
  "950": "#16312c"
};

const teal = {
  "050": "#eef9fa",
  "100": "#ddf4f6",
  "200": "#b9e8ed",
  "300": "#92dde4",
  "400": "#64d1db",
  "500": "#00c5d2",
  "600": "#17a5af",
  "700": "#1e858e",
  "800": "#1f686e",
  "900": "#1d4b4f",
  "950": "#173033"
};

const cyan = {
  "050": "#eff9fe",
  "100": "#def2fc",
  "200": "#bce6f9",
  "300": "#96d9f6",
  "400": "#68cdf2",
  "500": "#08c0ef",
  "600": "#1ca1c7",
  "700": "#2182a1",
  "800": "#22657c",
  "900": "#1e4959",
  "950": "#182f38"
};

const blue = {
  "050": "#eff5ff",
  "100": "#dfebff",
  "200": "#bdd7ff",
  "300": "#97c4ff",
  "400": "#69b1ff",
  "500": "#009fff",
  "600": "#1a85d4",
  "700": "#216cab",
  "800": "#215584",
  "900": "#1f3e5e",
  "950": "#19283c"
};

const indigo = {
  "050": "#f5ecff",
  "100": "#ead9ff",
  "200": "#d3b4fe",
  "300": "#ba8ffd",
  "400": "#9d6afb",
  "500": "#7b43f8",
  "600": "#693acf",
  "700": "#5731a7",
  "800": "#462981",
  "900": "#35205c",
  "950": "#24173a"
};

const violet = {
  "050": "#f8edfe",
  "100": "#f1dafd",
  "200": "#e1b5fa",
  "300": "#ce90f7",
  "400": "#b969f3",
  "500": "#a13cee",
  "600": "#8836c7",
  "700": "#6f2ea1",
  "800": "#58287c",
  "900": "#412059",
  "950": "#2b1738"
};

const purple = {
  "050": "#fbedfd",
  "100": "#f7dbfb",
  "200": "#eeb6f6",
  "300": "#e290f0",
  "400": "#d568ea",
  "500": "#c635e4",
  "600": "#a631be",
  "700": "#872b9a",
  "800": "#692677",
  "900": "#4d1f56",
  "950": "#321736"
};

const magenta = {
  "050": "#fdedf7",
  "100": "#fbdbee",
  "200": "#f7b7dd",
  "300": "#f191cc",
  "400": "#ea68bc",
  "500": "#e130ac",
  "600": "#bd2e90",
  "700": "#992a75",
  "800": "#77255b",
  "900": "#561f43",
  "950": "#38172b"
};

const pink = {
  "050": "#ffedf0",
  "100": "#ffdbe1",
  "200": "#ffb7c4",
  "300": "#ff91a8",
  "400": "#ff678d",
  "500": "#fc2b73",
  "600": "#d32a61",
  "700": "#aa2850",
  "800": "#84243f",
  "900": "#5f1e2f",
  "950": "#3d1720"
};

const rose = {
  "050": "#ffeded",
  "100": "#ffdbdc",
  "200": "#ffb7b9",
  "300": "#ff9198",
  "400": "#ff6778",
  "500": "#fe2d59",
  "600": "#d42b4c",
  "700": "#ac293f",
  "800": "#852432",
  "900": "#601e26",
  "950": "#3e171b"
};

const brown = {
  "050": "#f8f2ee",
  "100": "#f1e4dd",
  "200": "#e3cabb",
  "300": "#d3b19b",
  "400": "#c3987b",
  "500": "#b27f5c",
  "600": "#956b4f",
  "700": "#7a5841",
  "800": "#5f4534",
  "900": "#453327",
  "950": "#2d221b"
};

export const palettes = {
  gray, neutral,
  red, vermillion, orange, amber, yellow, lime,
  green, jade, mint, teal, cyan, blue,
  indigo, violet, purple, magenta, pink, rose,
  brown
};

export type Roles = {
  bg: {
    editor: string;    // main editor background (brightest in light, darkest in dark)
    window: string;    // sidebar, activity bar, status bar, title bar, inactive tabs
    inset: string;     // inputs, dropdowns
    elevated: string;  // panels, hover backgrounds
  };
  fg: { base: string; fg1: string; fg2: string; fg3: string; fg4: string };
  border: {
    window: string;           // borders for sidebar, activity bar, status bar, title bar
    editor: string;           // general editor borders
    indentGuide: string;      // indent guide lines
    indentGuideActive: string; // active indent guide line
    inset: string;            // borders for inputs, dropdowns
    elevated: string;         // borders for panels
  };
  accent: { primary: string; link: string; subtle: string; contrastOnAccent: string };
  states: { merge: string, success: string; danger: string; warn: string; info: string };
  syntax: {
    comment: string; string: string; number: string; keyword: string;
    regexp: string; func: string; type: string; variable: string;
    // Extended token types
    operator: string; punctuation: string; constant: string;
    parameter: string; namespace: string; decorator: string;
    escape: string; invalid: string; tag: string; attribute: string;
  };
  ansi: {
    black: string; red: string; green: string; yellow: string;
    blue: string; magenta: string; cyan: string; white: string;
    brightBlack: string; brightRed: string; brightGreen: string; brightYellow: string;
    brightBlue: string; brightMagenta: string; brightCyan: string; brightWhite: string;
  };
};

export const light: Roles = {
  bg: {
    editor: "#ffffff",
    window: neutral["060"],
    inset: neutral["080"],
    elevated: neutral["040"]
  },
  fg: {
    base: neutral["1040"],
    fg1: neutral["900"],
    fg2: neutral["800"],
    fg3: neutral["600"],
    fg4: neutral["500"]
  },
  border: {
    window: neutral["100"],
    editor: neutral["200"],
    indentGuide: neutral["100"],
    indentGuideActive: neutral["200"],
    inset: neutral["200"],
    elevated: neutral["100"]
  },
  accent: {
    primary: blue["500"],
    link: blue["500"],
    subtle: blue["100"],
    contrastOnAccent: "#ffffff"
  },
  states: {
    merge: indigo["600"],
    success: jade["600"],
    danger: red["600"],
    warn: yellow["600"],
    info: cyan["600"]
  },
  syntax: {
    comment: neutral["600"],
    string: green["600"],
    number: cyan["600"],
    keyword: pink["600"],
    regexp: teal["600"],
    func: indigo["600"],
    type: purple["600"],
    variable: orange["600"],
    // Extended token types
    operator: cyan["500"],
    punctuation: neutral["700"],
    constant: yellow["600"],
    parameter: neutral["700"],
    namespace: yellow["600"],
    decorator: blue["600"],
    escape: cyan["600"],
    invalid: neutral["1040"],
    tag: red["600"],
    attribute: jade["600"]
  },
  ansi: {
    black: neutral["980"],
    red: red["600"],
    green: jade["600"],
    yellow: yellow["600"],
    blue: blue["600"],
    magenta: purple["600"],
    cyan: cyan["600"],
    white: neutral["300"],
    // make bright colors match the non-bright counterparts
    brightBlack: neutral["980"],
    brightRed: red["600"],
    brightGreen: jade["600"],
    brightYellow: yellow["600"],
    brightBlue: blue["600"],
    brightMagenta: purple["600"],
    brightCyan: cyan["600"],
    brightWhite: neutral["300"]
  }
};

export const lightSoft: Roles = {
  bg: {
    editor: "#ffffff",
    window: neutral["040"],
    inset: neutral["060"],
    elevated: neutral["020"]
  },
  fg: {
    base: neutral["800"],
    fg1: neutral["700"],
    fg2: neutral["600"],
    fg3: neutral["500"],
    fg4: neutral["400"]
  },
  border: {
    window: neutral["080"],
    editor: neutral["100"],
    indentGuide: neutral["080"],
    indentGuideActive: neutral["100"],
    inset: neutral["200"],
    elevated: neutral["100"]
  },
  accent: {
    primary: blue["500"],
    link: blue["500"],
    subtle: blue["100"],
    contrastOnAccent: "#ffffff"
  },
  states: {
    merge: indigo["500"],
    success: jade["500"],
    danger: red["500"],
    warn: yellow["500"],
    info: cyan["500"]
  },
  syntax: {
    comment: neutral["500"],
    string: green["500"],
    number: cyan["500"],
    keyword: pink["400"],
    regexp: teal["500"],
    func: indigo["400"],
    type: purple["400"],
    variable: orange["500"],
    // Extended token types
    operator: cyan["400"],
    punctuation: neutral["600"],
    constant: yellow["500"],
    parameter: neutral["600"],
    namespace: yellow["500"],
    decorator: blue["400"],
    escape: cyan["500"],
    invalid: neutral["1000"],
    tag: red["500"],
    attribute: jade["500"]
  },
  ansi: {
    black: neutral["980"],
    red: red["500"],
    green: green["500"],
    yellow: yellow["500"],
    blue: blue["500"],
    magenta: purple["500"],
    cyan: cyan["500"],
    white: neutral["300"],
    brightBlack: neutral["980"],
    brightRed: red["500"],
    brightGreen: green["500"],
    brightYellow: yellow["500"],
    brightBlue: blue["500"],
    brightMagenta: purple["500"],
    brightCyan: cyan["500"],
    brightWhite: neutral["300"]
  }
};

export const dark: Roles = {
  bg: {
    editor: neutral["1040"],
    window: neutral["1000"],
    inset: neutral["980"],
    elevated: neutral["1020"]
  },
  fg: {
    base: neutral["020"],
    fg1: neutral["200"],
    fg2: neutral["400"],
    fg3: neutral["600"],
    fg4: neutral["700"]
  },
  border: {
    window: neutral["1040"],
    editor: neutral["980"],
    indentGuide: neutral["980"],
    indentGuideActive: neutral["960"],
    inset: neutral["980"],
    elevated: neutral["980"]
  },
  accent: {
    primary: blue["500"],
    link: blue["500"],
    subtle: blue["950"],
    contrastOnAccent: neutral["1040"]
  },
  states: {
    merge: indigo["500"],
    success: jade["500"],
    danger: red["500"],
    warn: yellow["500"],
    info: cyan["500"]
  },
  syntax: {
    comment: neutral["600"],
    string: green["400"],
    number: cyan["400"],
    keyword: pink["400"],
    regexp: teal["400"],
    func: indigo["400"],
    type: purple["400"],
    variable: orange["400"],
    // Extended token types
    operator: cyan["500"],
    punctuation: neutral["700"],
    constant: yellow["400"],
    parameter: neutral["400"],
    namespace: yellow["500"],
    decorator: blue["400"],
    escape: cyan["400"],
    invalid: neutral["020"],
    tag: red["400"],
    attribute: jade["400"]
  },
  ansi: {
    black: neutral["1000"],
    red: red["500"],
    green: green["500"],
    yellow: yellow["500"],
    blue: blue["500"],
    magenta: purple["500"],
    cyan: cyan["500"],
    white: neutral["300"],
    brightBlack: neutral["1000"],
    brightRed: red["500"],
    brightGreen: green["500"],
    brightYellow: yellow["500"],
    brightBlue: blue["500"],
    brightMagenta: purple["500"],
    brightCyan: cyan["500"],
    brightWhite: neutral["300"]
  }
};

export const darkSoft: Roles = {
  bg: {
    editor: neutral["1000"],
    window: neutral["1020"],
    inset: neutral["960"],
    elevated: neutral["980"]
  },
  fg: {
    base: neutral["200"],
    fg1: neutral["300"],
    fg2: neutral["500"],
    fg3: neutral["700"],
    fg4: neutral["800"]
  },
  border: {
    window: neutral["980"],
    editor: neutral["940"],
    indentGuide: neutral["960"],
    indentGuideActive: neutral["940"],
    inset: neutral["940"],
    elevated: neutral["960"]
  },
  accent: {
    primary: blue["400"],
    link: blue["400"],
    subtle: blue["900"],
    contrastOnAccent: neutral["1000"]
  },
  states: {
    merge: indigo["400"],
    success: jade["400"],
    danger: red["400"],
    warn: yellow["400"],
    info: cyan["400"]
  },
  syntax: {
    comment: neutral["700"],
    string: green["300"],
    number: cyan["300"],
    keyword: pink["300"],
    regexp: teal["300"],
    func: indigo["300"],
    type: purple["300"],
    variable: orange["300"],
    // Extended token types
    operator: cyan["400"],
    punctuation: neutral["600"],
    constant: yellow["300"],
    parameter: neutral["500"],
    namespace: yellow["400"],
    decorator: blue["300"],
    escape: cyan["300"],
    invalid: neutral["200"],
    tag: red["300"],
    attribute: jade["300"]
  },
  ansi: {
    black: neutral["1000"],
    red: red["500"],
    green: green["500"],
    yellow: yellow["500"],
    blue: blue["500"],
    magenta: purple["500"],
    cyan: cyan["500"],
    white: neutral["300"],
    brightBlack: neutral["1000"],
    brightRed: red["500"],
    brightGreen: green["500"],
    brightYellow: yellow["500"],
    brightBlue: blue["500"],
    brightMagenta: purple["500"],
    brightCyan: cyan["500"],
    brightWhite: neutral["300"]
  }
};
