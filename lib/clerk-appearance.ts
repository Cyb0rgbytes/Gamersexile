/* Clerk's prebuilt UI (sign-in, sign-up, user menu) themed to the night
 * palette, so auth screens read as part of the site rather than a vendor
 * widget. Values mirror the tokens in app/globals.css. */

export const clerkAppearance = {
  variables: {
    colorPrimary: "#e11d48",
    colorBackground: "#13111b",
    colorInputBackground: "#07060b",
    colorInputText: "#f4f2f7",
    colorText: "#f4f2f7",
    colorTextSecondary: "#b0abbd",
    colorNeutral: "#f4f2f7",
    colorDanger: "#ff4d6d",
    borderRadius: "2px",
    fontFamily: "var(--font-inter), var(--font-arabic), var(--font-sc), system-ui, sans-serif",
  },
  elements: {
    card: { border: "1px solid #24202f", boxShadow: "0 0 40px rgb(139 92 246 / 0.12)" },
    formButtonPrimary: { color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.14em" },
  },
} as const;
