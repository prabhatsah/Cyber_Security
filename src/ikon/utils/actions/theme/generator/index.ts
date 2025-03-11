import Color from "color";
import { ColorVariables } from "./type";
import { convertAllHexToCssVar, convertCssVarToHex } from "./theme-convert";
import { AccountThemeProps, ThemeColorProps, UserThemeProps } from "../type";

function isWOBG(color: Color) {
    // White Or Black Or Gray
    return (
        color.lightness() === 100 ||
        color.lightness() === 0 ||
        color.saturationl() === 0
    )
}

class ThemePalette {
    primary: Color;
    secondary: Color;
    tertiary: Color;
    isDarkTheme: boolean;

    constructor(options: ThemeColorProps, isDarkTheme: boolean) {
        this.primary = Color(options.primary);
        this.secondary = Color(options.secondary);
        this.tertiary = Color(options.tertiary);
        this.isDarkTheme = isDarkTheme;
    }

    private getSaturation(color: Color) {
        return this.isDarkTheme ? 0 : (isWOBG(color) ? 0 : 6)
    }

    private getLightness(color: Color) {
        return this.isDarkTheme ? 5 : 100
    }

    getPrimaryForeground() {
        return this.primary
            .saturationl(this.getSaturation(this.primary))
            .lightness(this.primary.isDark() ? 98 : 2)
    }

    getSecondaryForeground() {
        return this.secondary
            .saturationl(this.getSaturation(this.secondary))
            .lightness(this.secondary.isDark() ? 98 : 2)
    }

    getBackground() {
        return this.isDarkTheme ?
            this.primary.saturationl(this.getSaturation(this.primary))
                .lightness(this.getLightness(this.primary)) : this.getPrimaryForeground().lightness(this.getLightness(this.primary))
    }

    getForeground() {
        const background = this.getBackground();
        return this.isDarkTheme ? background.lightness(98) : background.lightness(5); // Contrast foreground
    }

    getCard() {
        const background = this.getBackground();
        return background
    }

    getCardForeground() {
        return this.getForeground();
    }

    getMuted() {
        const card = this.getCard();
        return this.isDarkTheme ? card.lighten(2) : card.darken(0.04);
    }

    getMutedForeground() {
        const foreground = this.getForeground();
        return this.isDarkTheme ? foreground.lighten(8) : foreground.darken(0.5);
    }

    getAccent() {
        return this.tertiary;
    }

    getAccentForeground() {
        return this.tertiary
            .saturationl(this.getSaturation(this.tertiary))
            .lightness(this.tertiary.isDark() ? 98 : 2)
    }

    getBorder() {
        const card = this.getCard();
        return this.isDarkTheme ?
            card.lightness(Math.min(12, this.getCard().lightness() + 8)) : card.darken(0.08)
    }

    getInput() {
        const border = this.getBorder();
        return this.isDarkTheme ? border.lighten(0.5) : border.darken(0.08)
    }

    getRing() {
        const input = this.getInput();
        return this.isDarkTheme ? this.primary.lightness(40) : input.saturate(3).darken(0.1)
    }
}

function generateThemeVariables(options: ThemeColorProps, isDarkTheme: boolean): ColorVariables {
    const palette = new ThemePalette(options, isDarkTheme);

    const background = palette.getBackground();
    const foreground = palette.getForeground();

    const card = palette.getCard();
    const cardForeground = palette.getCardForeground();

    const popover = palette.getCard();
    const popoverForeground = palette.getCardForeground();

    const primary = palette.primary;
    const primaryForeground = palette.getPrimaryForeground();

    const secondary = palette.secondary;
    const secondaryForeground = palette.getSecondaryForeground();

    const accent = palette.getAccent();
    const accentForeground = palette.getAccentForeground();

    const muted = palette.getMuted();
    const mutedForeground = palette.getMutedForeground();

    const border = palette.getBorder();
    const input = palette.getInput();
    const ring = palette.getRing();

    return {
        "--background": background.hex(),
        "--foreground": foreground.hex(),

        "--card": card.hex(),
        "--card-foreground": cardForeground.hex(),

        "--popover": popover.hex(),
        "--popover-foreground": popoverForeground.hex(),

        "--primary": primary.hex(),
        "--primary-foreground": primaryForeground.hex(),

        "--secondary": secondary.hex(),
        "--secondary-foreground": secondaryForeground.hex(),

        "--muted": muted.hex(),
        "--muted-foreground": mutedForeground.hex(),

        "--accent": accent.hex(),
        "--accent-foreground": accentForeground.hex(),

        "--destructive": convertCssVarToHex("0 84.2% 60.2%"),
        "--destructive-foreground": convertCssVarToHex("0 0% 98%"),

        "--border": border.hex(),
        "--input": input.hex(),
        "--ring": ring.hex(),

        "--sidebar-background": primary.hex(),
        "--sidebar-foreground": primaryForeground.hex(),

        "--sidebar-ring": ring.hex(),

        "--sidebar-accent": accent.hex(),
        "--sidebar-accent-foreground": accentForeground.hex(),
        "--radius": "0.5"
    };
}

export function generateTheme(themeOptions: AccountThemeProps & UserThemeProps): string {
    const lightTheme = convertAllHexToCssVar(
        generateThemeVariables(
            themeOptions.light,
            false // Light theme
        )
    );

    lightTheme["--radius"] = themeOptions.radius + "rem";

    const darkTheme = convertAllHexToCssVar(
        generateThemeVariables(
            themeOptions.dark,
            true // Dark theme
        )
    );
    darkTheme["--radius"] = themeOptions.radius + "rem";

    const lightCssVariables = Object.entries(lightTheme)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");
    const darkCssVariables = Object.entries(darkTheme)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");

    return `:root { ${lightCssVariables} }
    .dark { ${darkCssVariables} }`
}
