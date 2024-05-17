const opsSecFormatter = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 4
});

const halfScreen = process.stdout.columns ? process.stdout.columns / 2 : 44; // arbitrary number

module.exports = {
  info(str) {
    console.log(str);
  },
  start() {
    console.log('-'.repeat(halfScreen));
  },
  end() {
    console.log('-'.repeat(halfScreen));
  },
  step(result) {
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

      console.log(
        `${opName}${spaces}${opsSecFormatter.format(operation.opsSec)} (${
          operation.samples
        } samples)`
      );
    }
  },
  printResults() {}
};
