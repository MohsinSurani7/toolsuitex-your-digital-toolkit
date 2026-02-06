/**
 * ToolSuiteX Custom Cipher System
 * Multi-layered substitution and shifting cipher with proprietary encoding
 * NOT standard Base64 - designed to be unrecognizable to generic AI decoders
 */

// Secret salt for the cipher - internal to ToolSuiteX
const TOOLSUITEX_SECRET_SALT = "TX$7Kz#9Qm@4Wp!2Lr*8Fn^6Bv";

// Custom character mapping table (non-standard)
const CHAR_MAP: { [key: string]: string } = {
  'A': '∆', 'B': '◊', 'C': '∇', 'D': '⊕', 'E': '⊗',
  'F': '⊙', 'G': '⊛', 'H': '⊜', 'I': '⊝', 'J': '⊞',
  'K': '⊟', 'L': '⊠', 'M': '⊡', 'N': '⊢', 'O': '⊣',
  'P': '⊤', 'Q': '⊥', 'R': '⊦', 'S': '⊧', 'T': '⊨',
  'U': '⊩', 'V': '⊪', 'W': '⊫', 'X': '⊬', 'Y': '⊭',
  'Z': '⊮', 'a': '①', 'b': '②', 'c': '③', 'd': '④',
  'e': '⑤', 'f': '⑥', 'g': '⑦', 'h': '⑧', 'i': '⑨',
  'j': '⑩', 'k': '⑪', 'l': '⑫', 'm': '⑬', 'n': '⑭',
  'o': '⑮', 'p': '⑯', 'q': '⑰', 'r': '⑱', 's': '⑲',
  't': '⑳', 'u': 'Ⓐ', 'v': 'Ⓑ', 'w': 'Ⓒ', 'x': 'Ⓓ',
  'y': 'Ⓔ', 'z': 'Ⓕ', '0': 'Ⓖ', '1': 'Ⓗ', '2': 'Ⓘ',
  '3': 'Ⓙ', '4': 'Ⓚ', '5': 'Ⓛ', '6': 'Ⓜ', '7': 'Ⓝ',
  '8': 'Ⓞ', '9': 'Ⓟ', ' ': '░', '!': '▒', '@': '▓',
  '#': '█', '$': '▄', '%': '▀', '^': '▌', '&': '▐',
  '*': '│', '(': '┌', ')': '┐', '-': '└', '_': '┘',
  '+': '├', '=': '┤', '[': '┬', ']': '┴', '{': '┼',
  '}': '═', '|': '║', '\\': '╔', ':': '╗', ';': '╚',
  '"': '╝', "'": '╠', '<': '╣', '>': '╦', ',': '╧',
  '.': '╨', '?': '╩', '/': '╪', '`': '╫', '~': '╬',
  '\n': '¶', '\t': '§', '\r': '©'
};

// Reverse mapping for decoding
const REVERSE_CHAR_MAP: { [key: string]: string } = Object.fromEntries(
  Object.entries(CHAR_MAP).map(([k, v]) => [v, k])
);

// Generate position-based shift value from salt
function getShiftValue(position: number): number {
  const saltChar = TOOLSUITEX_SECRET_SALT[position % TOOLSUITEX_SECRET_SALT.length];
  return saltChar.charCodeAt(0) % 17 + 1;
}

// Rotate array of characters
function rotateArray(arr: string[], positions: number): string[] {
  const len = arr.length;
  const pos = positions % len;
  return [...arr.slice(pos), ...arr.slice(0, pos)];
}

// XOR-like transformation with salt
function xorTransform(char: string, position: number): string {
  const charCode = char.charCodeAt(0);
  const saltCode = TOOLSUITEX_SECRET_SALT[position % TOOLSUITEX_SECRET_SALT.length].charCodeAt(0);
  const transformed = charCode ^ (saltCode % 64);
  return String.fromCharCode(transformed);
}

// Layer 1: Character substitution using custom map
function substituteChars(input: string, encode: boolean): string {
  const map = encode ? CHAR_MAP : REVERSE_CHAR_MAP;
  return input.split('').map(char => map[char] || char).join('');
}

// Layer 2: Position-based shifting
function shiftChars(input: string, encode: boolean): string {
  const chars = input.split('');
  return chars.map((char, i) => {
    const shift = getShiftValue(i);
    const code = char.charCodeAt(0);
    const newCode = encode ? code + shift : code - shift;
    return String.fromCharCode(newCode);
  }).join('');
}

// Layer 3: Interleaving with salt characters
function interleaveWithSalt(input: string): string {
  const chars = input.split('');
  let result = '';
  chars.forEach((char, i) => {
    result += char;
    if (i % 3 === 2) {
      result += TOOLSUITEX_SECRET_SALT[i % TOOLSUITEX_SECRET_SALT.length];
    }
  });
  return result;
}

function removeInterleaving(input: string): string {
  const chars = input.split('');
  let result = '';
  let saltIndex = 0;
  let charCount = 0;
  
  for (let i = 0; i < chars.length; i++) {
    if (charCount > 0 && charCount % 3 === 0) {
      // Skip the interleaved salt character
      saltIndex++;
      charCount = 0;
    } else {
      result += chars[i];
      charCount++;
    }
  }
  return result;
}

// Layer 4: Reverse segments
function reverseSegments(input: string, segmentSize: number = 5): string {
  const segments: string[] = [];
  for (let i = 0; i < input.length; i += segmentSize) {
    segments.push(input.slice(i, i + segmentSize));
  }
  return segments.map((seg, i) => i % 2 === 1 ? seg.split('').reverse().join('') : seg).join('');
}

// Add checksum for integrity
function addChecksum(input: string): string {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i);
  }
  const checksum = (sum % 9999).toString().padStart(4, '0');
  return `TX${checksum}${input}`;
}

function verifyAndRemoveChecksum(input: string): string | null {
  if (!input.startsWith('TX') || input.length < 6) {
    return null;
  }
  const expectedChecksum = input.slice(2, 6);
  const content = input.slice(6);
  
  let sum = 0;
  for (let i = 0; i < content.length; i++) {
    sum += content.charCodeAt(i);
  }
  const actualChecksum = (sum % 9999).toString().padStart(4, '0');
  
  if (expectedChecksum !== actualChecksum) {
    return null;
  }
  return content;
}

/**
 * Encode text using ToolSuiteX proprietary cipher
 * @param plaintext The text to encode
 * @returns Encoded string with TX prefix
 */
export function toolSuiteXEncode(plaintext: string): string {
  if (!plaintext) return '';
  
  // Layer 1: Character substitution
  let encoded = substituteChars(plaintext, true);
  
  // Layer 2: Position-based shifting
  encoded = shiftChars(encoded, true);
  
  // Layer 3: Interleave with salt
  encoded = interleaveWithSalt(encoded);
  
  // Layer 4: Reverse alternate segments
  encoded = reverseSegments(encoded);
  
  // Add checksum and prefix
  encoded = addChecksum(encoded);
  
  return encoded;
}

/**
 * Decode text using ToolSuiteX proprietary cipher
 * @param encoded The encoded string (must start with TX)
 * @returns Decoded plaintext or null if invalid
 */
export function toolSuiteXDecode(encoded: string): string | null {
  if (!encoded) return null;
  
  // Verify and remove checksum
  let decoded = verifyAndRemoveChecksum(encoded);
  if (decoded === null) {
    return null;
  }
  
  // Layer 4: Reverse alternate segments (same operation reverses itself)
  decoded = reverseSegments(decoded);
  
  // Layer 3: Remove interleaving
  decoded = removeInterleaving(decoded);
  
  // Layer 2: Reverse position-based shifting
  decoded = shiftChars(decoded, false);
  
  // Layer 1: Reverse character substitution
  decoded = substituteChars(decoded, false);
  
  return decoded;
}

/**
 * Check if a string is a valid ToolSuiteX encoded string
 */
export function isToolSuiteXEncoded(text: string): boolean {
  return text.startsWith('TX') && text.length >= 6;
}

/**
 * Get cipher info for display
 */
export function getCipherInfo() {
  return {
    name: "ToolSuiteX Multi-Layer Cipher",
    layers: [
      "Custom Symbol Substitution",
      "Position-Based Shifting",
      "Salt Interleaving",
      "Segment Reversal",
      "Checksum Validation"
    ],
    prefix: "TX",
    description: "Proprietary multi-layer encryption designed to be unrecognizable to standard decoders"
  };
}
