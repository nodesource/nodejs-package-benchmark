const opsSecFormatter = Intl.NumberFormat('en-US', { notation: 'compact', maximumSignificantDigits: 4})

module.exports = {
  log (str) {
    console.log(str);
  },
  printResults (results) {
    const halfScreen = process.stdout.columns ?
      process.stdout.columns / 2 : 44; // arbitrary number
    console.log('-'.repeat(halfScreen));
    for (const result of results) {
      console.log(`${result.name}`);
      // TODO(rafaelgss): support non-operation method
      for (const operation of result.operations) {
        const opName = `  ${operation.name}:`;
        let spaces = '';
        if (opName.length > halfScreen) {
          spaces = opName.length + 2;
        } else {
          spaces = ' '.repeat(halfScreen - opName.length);
        }
        console.log(opName +
        `${spaces}${opsSecFormatter.format(operation.opsSec)} (${operation.samples} samples)`);
      }
    }
    console.log('-'.repeat(process.stdout.columns / 2));
  }
}