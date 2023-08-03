import fs from "fs";

const MAX_LENGTH = 80;
const FIXED = "fixed";
const DATE_REGEX = /(0?[1-9]|1[0-2])\.(19|20)\d{2}/;
const DETACHABLE = "detachable";
const SHORTENED_DETACHABLE = "det.";
const VAUXHALL = "Vauxhall";
const OPEL_VAUXHALL = "Opel / " + VAUXHALL;
const TOWBAR = "towbar";
const CAR_BODY_TYPES = {
  "Touring Sports": "TS",
  "Station Wagon": "SW",
  Liftback: "LB",
  Sedan: "Sedan",
  Hatchback: "HB",
  SUV: "SUV",
  Coupe: "Coupe",
  Convertible: "CV",
  Wagon: "Wagon",
  "Pickup Truck": "Pickup",
  Minivan: "Minivan",
  Crossover: "CO",
  Roadster: "RS",
  MPV: "MPV",
  "Coupe-SUV": "C-SUV",
  Saloon: "SL",
  Furgon: "FG",
  Minibus: "MB",
} as const;
const THIRTEEN_PIN = "13-pin";
const SEVEN_PIN = "7-pin";
const THIRTEEN_PIN_SHORTENED = "13-p";
const SEVEN_PIN_SHORTENED = "7-p";
const DOORS = "doors";
const MERCEDES_BENZ = "Mercedes-Benz";
const MERCEDES = "Mercedes";
const VOLKSWAGEN = "Volkswagen";
const VOLKSWAGEN_SHORT = "VW";
const PICKUP = "Pick Up";
const MUSSO_GRAND = "(Musso Grand)";
const PEUGOT_LS = ["L1 L2 L3 L4", "L1 L2 L3"] as const;
const PEUGOT_LS_SHORT = ["L1-L4", "L1-L3"] as const;
const LAND_ROVER = "Land Rover Range Rover";
const LAND_ROVER_SHORT = "Land Rover Range";
const ESTATE = "Estate";
const ESTATE_SHORT = "Es.";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const lines = fs.readFileSync("input.txt", "utf8").split(/\r?\n/);

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
fs.writeFileSync("./output.txt", output.join("\n"));

// =CONCAT("New Complete ";AN2;" towbar for ";O2;" ";P2;" ";Q2;IF(AV2<>"";CONCAT(" + ";"univ. ";AV2;" el. kit");""))
