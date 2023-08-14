import fs from "fs";

const lines = fs.readFileSync("input.csv", "utf8").split(/\r?\n/);

const ids: string[] = [];
const prices: string[] = [];
for (const line of lines) {
  const [id, price] = line.split(";");

  if (id !== "") ids.push(id);
  prices.push(price);
}

const parsedResult: string[] = [];
for (const price of prices) {
  if (price === "999") {
    parsedResult.push("\n");
    continue;
  }

  const id = ids.shift();

  parsedResult.push(`${id};${price}`);
}

const result = parsedResult.reduce(
  (acc: string, line) => (line !== "\n" ? acc + line + "\n" : acc + line),
  ""
);

fs.writeFileSync("output.csv", result, "utf8");
