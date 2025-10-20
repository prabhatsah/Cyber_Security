
import { ProgressBar } from "@tremor/react";
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
        return "gray";
      case 1:
        return "red";
      case 2:
        return "amber";
      case 3:
        return "lime";
      case 4:
        return "green";
      default:
        return "gray";
    }
  };


  return (
    <>
      <ProgressBar value={num} color={funcProgressColor()} />
    </>
  );
};

export default PasswordStrengthMeter;