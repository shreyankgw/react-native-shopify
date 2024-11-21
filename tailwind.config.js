/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#82bc00",
        darkPrimary: "#046a38",
        brandText: "#24272a",
        brandLight: "#e8e5de"
      },
      fontFamily: {
        mBold: ["Montserrat-Bold", "serif"],
        mRegular: ["Montserrat-Regular", "serif"],
        mLight: ["Montserrat-Light", "serif"],
        mMedium: ["Montserrat-Medium", "serif"],
        mSemiBold: ["Montserrat-SemiBold", "serif"],
        mBlack: ["Montserrat-Black", "serif"]
      }
    },
  },
  plugins: [],
}

