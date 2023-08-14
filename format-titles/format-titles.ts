import fs from "fs";

import {
  MAX_LENGTH,
  FIXED,
  DATE_REGEX,
  DETACHABLE,
  SHORTENED_DETACHABLE,
  VAUXHALL,
  OPEL_VAUXHALL,
  TOWBAR,
  CAR_BODY_TYPES,
  THIRTEEN_PIN,
  SEVEN_PIN,
  THIRTEEN_PIN_SHORTENED,
  SEVEN_PIN_SHORTENED,
  DOORS,
  MERCEDES_BENZ,
  MERCEDES,
  VOLKSWAGEN,
  VOLKSWAGEN_SHORT,
  PICKUP,
  MUSSO_GRAND,
  PEUGOT_LS,
  PEUGOT_LS_SHORT,
  LAND_ROVER,
  LAND_ROVER_SHORT,
  ESTATE,
  ESTATE_SHORT,
} from "./constants";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const lines = fs.readFileSync("format-titles/input.txt", "utf8").split(/\r?\n/);

const output = lines.map((line) => {
  let formattedLine = line.split(" ");

  // Remove "New"
  if (formattedLine.join(" ").length > MAX_LENGTH) formattedLine.splice(0, 1);

  // Remove "Complete"
  if (formattedLine.join(" ").length > MAX_LENGTH) formattedLine.splice(0, 1);

  // Remove "horizontal" or "vertical"
  const isFirstWordNotFixed = formattedLine[0] !== FIXED;
  if (formattedLine.join(" ").length > MAX_LENGTH && isFirstWordNotFixed)
    formattedLine.splice(0, 1);

  // Remove doors info from model
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const indexOfDoorsWord = formattedLine.indexOf(DOORS);

    if (indexOfDoorsWord !== -1) formattedLine.splice(indexOfDoorsWord - 1, 2);
  }

  // Delete months from the car manufacturing date
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const date = formattedLine.filter((word) => DATE_REGEX.test(word))[0] ?? "";
    const indexOfDate = formattedLine.indexOf(date);

    const iterations = date.includes("-") ? 2 : 1;
    let newDate = date;
    for (let i = 0; i < iterations; i++) {
      newDate = newDate.replace(/[0-9]{2}\./g, "");
    }

    formattedLine[indexOfDate] = newDate;
  }

  // shorten "detachable"
  const isFirstWordDetachable = formattedLine[0] == DETACHABLE;
  if (formattedLine.join(" ").length > MAX_LENGTH && isFirstWordDetachable)
    formattedLine[0] = SHORTENED_DETACHABLE;

  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newFormattedLine = formattedLine
      .join(" ")
      .replace(OPEL_VAUXHALL, VAUXHALL);

    formattedLine = newFormattedLine.split(" ");
  }

  // shorten car body car body types
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    formattedLine.forEach((word, index) => {
      if (!!CAR_BODY_TYPES[word]) formattedLine[index] = CAR_BODY_TYPES[word];
    });
  }

  // delete "Det."
  if (formattedLine.join(" ").length > MAX_LENGTH)
    formattedLine = formattedLine.slice(1);

  // replace " / " with "/"
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine
      .join(" ")
      .replace(/\ \/\ /g, "/")
      .split(" ");

    formattedLine = newLine;
  }

  // replace "-pin" with "-p"
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const indexOfPins = (() => {
      if (formattedLine.indexOf(SEVEN_PIN) !== -1)
        return formattedLine.indexOf(SEVEN_PIN);
      if (formattedLine.indexOf(THIRTEEN_PIN) !== -1)
        return formattedLine.indexOf(THIRTEEN_PIN);

      return -1;
    })();

    switch (formattedLine[indexOfPins]) {
      case SEVEN_PIN:
        formattedLine[indexOfPins] = SEVEN_PIN_SHORTENED;
        break;

      case THIRTEEN_PIN:
        formattedLine[indexOfPins] = THIRTEEN_PIN_SHORTENED;
        break;
    }
  }

  // shorten "Mercedes-Benz" to "Mercedes"
  // shorten "Volkswagen" to "VW"
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine
      .join(" ")
      .replace(MERCEDES_BENZ, MERCEDES)
      .replace(VOLKSWAGEN, VOLKSWAGEN_SHORT)
      .replace(LAND_ROVER, LAND_ROVER_SHORT)
      .split(" ");

    formattedLine = newLine;
  }

  // Delete "Pick Up"
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine.join(" ").replace(PICKUP, "").split(" ");

    formattedLine = newLine;
  }

  // Delete "(Musso Grand)" from Ssangyong cars
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine.join(" ").replace(MUSSO_GRAND, "").split(" ");

    formattedLine = newLine;
  }

  // shorten "L1 L2 ... LX" to "L1-LX" for Peugots
  if (
    formattedLine.join(" ").length > MAX_LENGTH &&
    formattedLine.some((word) => word === "L1")
  ) {
    const newLine = formattedLine
      .join(" ")
      .replace(PEUGOT_LS[0], PEUGOT_LS_SHORT[0])
      .replace(PEUGOT_LS[1], PEUGOT_LS_SHORT[1])
      .split(" ");

    formattedLine = newLine;
  }

  // shorten dates even more
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine
      .join(" ")
      .replace(/\b(\d{2})(\d{2})\b/g, "$2")
      .split(" ");

    formattedLine = newLine;
  }

  // shorten "Estate" to "Es."
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine
      .join(" ")
      .replace(ESTATE, ESTATE_SHORT)
      .split(" ");

    formattedLine = newLine;
  }

  // delete "Es."
  if (formattedLine.join(" ").length > MAX_LENGTH) {
    const newLine = formattedLine
      .join(" ")
      .replace(ESTATE_SHORT, "")
      .split(" ");
    formattedLine = newLine;
  }

  // throw out additional spaces
  formattedLine = formattedLine.filter((word) => word !== "");

  // capitalize first word
  formattedLine[0] = capitalize(formattedLine[0]);
  // return joined line and capitalize "towbar"
  return formattedLine.join(" ").replace(TOWBAR, capitalize(TOWBAR));
});

// For debugging
// output.sort((a, b) => b.length - a.length);
// console.log(
//   output.slice(0, 10).map((line) => {
//     return [line, line.length];
//   })
// );

// For writing
fs.writeFileSync("format-titles/output.txt", output.join("\n"));
