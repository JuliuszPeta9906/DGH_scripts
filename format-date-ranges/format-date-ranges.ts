import fs from "fs";

const lines: string[] = fs.readFileSync("input.txt", "utf8").split(/\r?\n/);
const expression = "-$";
const regex = new RegExp(expression, "ig");

const newLines = lines.map((line) => {
  if (regex.test(line)) {
    const newLine = line.replace(regex, "").trim();

    return newLine + " onwards";
  }

  return line;
});

fs.writeFileSync("output.txt", newLines.join("\n"), "utf8");
