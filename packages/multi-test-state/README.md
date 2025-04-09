# multi-test-state

State management library for psychological tests in the Multi-Test platform.

## Overview

This library provides efficient state management for psychological tests, allowing test data to be:

- Stored efficiently in binary format
- Represented as Datagrams or QR codes
- Encoded/decoded for transmission and storage
- Used across different platforms (web, mobile, etc.)

## Features

- **Compact Binary Representation**: Efficiently encodes test answers and state using bit-buffer
- **Base64 Encoding**: Converts binary data to base64 strings for easy transmission
- **QR Code Support**: Generate and parse QR codes containing test state data
- **CRC16 Validation**: Ensures data integrity with checksums
- **Character Encoding Support**: Handles character encoding (KOI8-U) for proper text representation
- **TypeScript Support**: Full type safety with TypeScript interfaces

## Installation

```bash
yarn add @multi-test/state
```

## Usage

```typescript
import { CattellState } from '@multi-test/state';

// Create a new state for a test
const state = new CattellState();

// Record an answer
state.setAnswer(1, 'A');

// Convert to a compact string representation
const encoded = state.toBase64();

// Recreate state from encoded data
const decodedState = CattellState.fromBase64(encoded);
```

## Related Packages

- `@multi-test/core`: Core implementations of psychological tests
- `@multi-test/legacy-web`: Web interface for the multi-test platform

## License

GPL-3.0
