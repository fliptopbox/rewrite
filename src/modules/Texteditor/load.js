/**
 * import
 *
 * takes one of three formats:
 * 1. plainText string
 * 2. plainText array
 * 3. qualigied schema
 */

function load(value) {
  if (!value) return null;
  return value;
}

const data = require("../startup.json");
// console.log(data)

const output = load(data);

output;

export default load;
