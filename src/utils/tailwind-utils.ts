import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CalculateThemeProps = {
  clientTheme: {
    dark: {
      accentColor: string;
      backgroundColor: string;
    };
    light: {
      accentColor: string;
      backgroundColor: string;
    };
  };
};

type CalculateThemeReturnType = {
  dark: {
    "--primary-color": string;
    // "--accent"?: string;
    // "--accent-foreground"?: string;

    // "--primary"?: string;
    // "--primary-foreground"?: string;

    // "--secondary"?: string;
    // "--secondary-foreground"?: string;

    "--background"?: string;
    "--foreground"?: string;

    "--card"?: string;
    "--card-foreground"?: string;

    "--popover"?: string;
    "--popover-foreground"?: string;
  };
  light: {
    "--primary-color": string;
    // "--accent"?: string;
    // "--accent-foreground"?: string;

    // "--primary"?: string;
    // "--primary-foreground"?: string;

    // "--secondary"?: string;
    // "--secondary-foreground"?: string;

    "--background"?: string;
    "--foreground"?: string;

    "--card"?: string;
    "--card-foreground"?: string;

    "--popover"?: string;
    "--popover-foreground"?: string;
  };
};

function hexToHsl(hex: string): string {
  // Remove '#' if present
  hex = hex.replace("#", "");

  // Parse the hex color into RGB values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Normalize the RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  // Calculate min, max, and delta for the HSL conversion
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  const delta = max - min;
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
  }

  // Convert h, s, l to percentage and round
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

export const calculateTheme = (props: CalculateThemeProps) => {
  const newTheme: CalculateThemeReturnType = {
    light: {
      "--primary-color": hexToHsl(props.clientTheme.light.accentColor),

      "--background": hexToHsl(props.clientTheme.light.backgroundColor),
      "--foreground": calculateOppositeHSL(hexToHsl(props.clientTheme.light.backgroundColor)),
    },
    dark: {
      "--primary-color": hexToHsl(props.clientTheme.dark.accentColor),

      "--background": calculateOppositeHSL(hexToHsl(props.clientTheme.dark.backgroundColor)),
      // "--foreground": darkForegroundHslValues,
    },
  };

  return newTheme;
};

// function extractHSLValues(hslString) {
//   // Use regex to match numeric values and convert them to numbers
//   const values = hslString.match(/[\d.]+/g).map(Number);
//   return values;
// }

function calculateOppositeHSL(hsl) {
  const hslArray = hsl.split(" ").map(Number); // Convert the HSL string to an array of numbers
  const [hue, saturation, lightness] = hslArray; // Destructure the array

  // Calculate opposite values
  const oppositeHue = (hue + 180) % 360; // Add 180 to hue and wrap around using modulo
  const oppositeSaturation = 100 - saturation; // Subtract saturation from 100
  const oppositeLightness = 100 - lightness; // Subtract lightness from 100

  // Return the opposite HSL color as a string
  return `${oppositeHue} ${oppositeSaturation}% ${oppositeLightness}%`;
}
