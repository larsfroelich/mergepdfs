# mergepdfs
Merge multiple pdf files into a single file.

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

Example:

```bash
mergepdfs --even
```
