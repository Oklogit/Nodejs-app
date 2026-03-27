/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primaryBlue: "rgb(27, 30, 131)",
                coral: "#D44D5C",
                skyBlue: "#A6E1FA",
            },
        },
    },
    plugins: [require("flowbite/plugin")],
};
