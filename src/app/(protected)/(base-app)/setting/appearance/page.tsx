import ModeSelctor from "./components/mode-selector";
import ThemeColorSelctor from "./components/theme-color-selector";
import SelectFont from "./components/select-font";
import SaveThemeButton from "./components/save-theme-button";
import RadiusToggle from "./components/radius-toggle";
import { Label } from "@/shadcn/ui/label";
import {
  getCurrentUserAccountGroups,
  getUserGroups,
} from "@/ikon/utils/actions/users";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";

export default async function Appearance() {
  const userId = await getCurrentUserId();
  const userGroups = await getCurrentUserAccountGroups();
  return (
    <>
      <div className="h-full overflow-auto">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <h4>Appearance</h4>
            <p>
              Customize the appearance of the app. Automatically switch between
              day and night themes
            </p>
          </div>
          <div className="flex gap-3 flex-col lg:flex-row">
            <div className="flex flex-col gap-2">
              <Label>Font</Label>
              <SelectFont />
              <p>Select the font you want to see in the application</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Radius</Label>
              <div className="flex">
                <RadiusToggle />
              </div>
              <p>Select the radius you want to see in the application</p>
            </div>
          </div>
          <div>
            <h5>Mode</h5>
            <p>Select the theme mode for the application</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <ModeSelctor mode="light" />
            <ModeSelctor mode="dark" />
          </div>
          {userGroups.includes("CLIENTADMIN") && (
            <div className="flex flex-col lg:flex-row gap-2">
              <div>
                <div className="mb-3">
                  <h5>Theme</h5>
                  <p>Select the color theme for the application</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <ThemeColorSelctor mode="light" type="theme" />
                  <ThemeColorSelctor mode="dark" type="theme" />
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <h5>Chart Theme</h5>
                  <p>Select the color theme for the Charts</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <ThemeColorSelctor mode="light" type="chart" />
                  <ThemeColorSelctor mode="dark" type="chart" />
                </div>
              </div>
            </div>
          )}
          <div>
            <SaveThemeButton userGroups={userGroups} />
          </div>
        </div>
      </div>
    </>
  );
}
