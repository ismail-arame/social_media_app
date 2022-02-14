//TODO: add to tailwind config
//text-blue-medium
//bg-blue-medium
//text-red-primary
//text-gray-base
//border-gray-primary

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    content: ["./src/**/*.js", "./src/**/**/*.js"],
  },
  theme: {
    fill: (theme) => ({
      red: theme("colors.red.primary"),
    }),
    container: {
      mdd: "900px",
    },
    colors: {
      white: "#ffffff",
      blue: {
        light: "#0095f6",
        medium: "#005c98",
      },
      black: {
        light: "#262626",
        faded: "#00000059",
      },
      gray: {
        base: "#616161",
        background: "#fafafa",
        primary: "#dbdbdb",
        light: "#868e96",
        transparent: "#b4b4b471",
      },
      red: {
        primary: "#ed4956",
      },
    },
  },
  plugins: [],
};
