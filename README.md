# mergepdfs
Merge multiple pdf files into a single file.

Requires Node.js 18 or later.

## Installation

```bash
npm install -g mergepdfs
```

This installs the `mergepdfs` command globally so it can be run from any directory.

## Usage

Navigate to the folder that contains your PDFs and run:

```bash
mergepdfs
```

All PDF files found in the current directory and its subdirectories will be merged into a new file called `merged.pdf`.

### Options

- `-e, --even`  Add a blank page to PDFs that end on an odd number of pages. Useful for manual duplex printing.
- `-o, --output <file>`  Specify the output PDF name. Defaults to `merged.pdf`.

Example:

```bash
mergepdfs --even
mergepdfs --output combined.pdf
```

## Testing

Run the following command to execute the test suite:

```bash
npm test
```
