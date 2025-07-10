"use client";
import React, { useEffect } from "react";
import "../css/style.css";
import { useThemeOptions } from "@/ikon/components/theme-provider";
import { generateTheme } from "@/ikon/utils/actions/theme/generator";

function ThemeColorSelctor({
  mode,
  type,
}: {
  mode: "dark" | "light";
  type: "theme" | "chart";
}) {
  const { state, dispatch } = useThemeOptions();
  const [primary, setPrimary] = React.useState(
    type == "chart" ? state[mode]["chart"].primary : state[mode].primary
  );
  const [secondary, setSecondary] = React.useState(
    type == "chart" ? state[mode]["chart"].secondary : state[mode].secondary
  );
  const [tertiary, setTertiary] = React.useState(
    type == "chart" ? state[mode]["chart"].tertiary : state[mode].tertiary
  );

  useEffect(() => {
    const ikonThemeCSS = document.querySelector("#ikonThemeCSS") as HTMLElement;
    if (!ikonThemeCSS) return;

    let newState = state;
    let modeState;
    if (type == "theme") {
      modeState = {
        primary: primary,
        secondary: secondary,
        tertiary: tertiary,
        chart: state[mode].chart,
      };
      newState[mode] = modeState;
    } else {
      newState[mode].chart = {
        primary: primary,
        secondary: secondary,
        tertiary: tertiary,
      };
      modeState = newState[mode];
    }

    dispatch({
      type: mode,
      payload: modeState,
    });
    ikonThemeCSS.innerHTML = generateTheme(newState);
  }, [primary, secondary, tertiary]);

  return (
    <div className="flex flex-col gap-3 w-[250px]">
      <div
        className={
          "flex justify-between w-full p-2 cursor-pointer" +
          (state.mode == mode ? " border rounded-md" : "")
        }
      >
        <div
          className={
            "flex flex-col items-center gap-3 rounded-md p-3 w-full" +
            (mode === "dark" ? " bg-gray-900" : " bg-slate-300")
          }
        >
          {["Primary", "Secondary", "Tertiary"].map((v) => (
            <div
              className="flex items-center gap-3 bg-white text-black w-full p-2 rounded-md"
              key={v}
            >
              <input
                className="w-8 h-8 rounded-full theme-color-selctor-input"
                name={`${mode}.${v}`}
                type="color"
                value={
                  v == "Primary"
                    ? primary
                    : v == "Secondary"
                    ? secondary
                    : tertiary
                }
                onChange={(ele) => {
                  console.log(ele.target.name, ele.target.value, mode);
                  dispatch({
                    type: `mode`,
                    payload: mode,
                  });
                  // dispatch({
                  //     type: ele.target.name, payload: ele.target.value
                  // })
                  v == "Primary"
                    ? setPrimary(ele.target.value)
                    : v == "Secondary"
                    ? setSecondary(ele.target.value)
                    : setTertiary(ele.target.value);
                }}
              />
              <div className="flex-grow">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        {mode == "light" ? "Light" : "Dark"}
      </div>
    </div>
  );
}

export default ThemeColorSelctor;
