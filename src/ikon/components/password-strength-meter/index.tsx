import { Progress } from "@/shadcn/ui/progress";
import React, { useState } from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ value }: { value: string }) => {
  const testResult = zxcvbn(value);
  const num = (testResult.score * 100) / 4;

  const createPassLabel = () => {
    switch (testResult.score) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const funcProgressColor = () => {
    switch (testResult.score) {
      case 0:
        return "#828282";
      case 1:
        return "#EA1111";
      case 2:
        return "#FFAD00";
      case 3:
        return "#9bc158";
      case 4:
        return "#00b500";
      default:
        return "";
    }
  };


  return (
    <>
      <Progress value={num} indicatorColor={funcProgressColor()} />
    </>
  );
};

export default PasswordStrengthMeter;