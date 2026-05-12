const rc = [
  0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
  0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
  0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
  0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
  0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n,
];

function rotl64(v: bigint, k: bigint): bigint {
  return BigInt.asUintN(64, (v << k) | (v >> (64n - k)));
}

function keccakF23(s: bigint[]) {
  let a0 = s[0], a1 = s[1], a2 = s[2], a3 = s[3], a4 = s[4];
  let a5 = s[5], a6 = s[6], a7 = s[7], a8 = s[8], a9 = s[9];
  let a10 = s[10], a11 = s[11], a12 = s[12], a13 = s[13], a14 = s[14];
  let a15 = s[15], a16 = s[16], a17 = s[17], a18 = s[18], a19 = s[19];
  let a20 = s[20], a21 = s[21], a22 = s[22], a23 = s[23], a24 = s[24];

  for (let r = 1; r < 24; r++) {
    const c0 = a0 ^ a5 ^ a10 ^ a15 ^ a20;
    const c1 = a1 ^ a6 ^ a11 ^ a16 ^ a21;
    const c2 = a2 ^ a7 ^ a12 ^ a17 ^ a22;
    const c3 = a3 ^ a8 ^ a13 ^ a18 ^ a23;
    const c4 = a4 ^ a9 ^ a14 ^ a19 ^ a24;

    const d0 = c4 ^ rotl64(c1, 1n);
    const d1 = c0 ^ rotl64(c2, 1n);
    const d2 = c1 ^ rotl64(c3, 1n);
    const d3 = c2 ^ rotl64(c4, 1n);
    const d4 = c3 ^ rotl64(c0, 1n);

    a0 ^= d0; a5 ^= d0; a10 ^= d0; a15 ^= d0; a20 ^= d0;
    a1 ^= d1; a6 ^= d1; a11 ^= d1; a16 ^= d1; a21 ^= d1;
    a2 ^= d2; a7 ^= d2; a12 ^= d2; a17 ^= d2; a22 ^= d2;
    a3 ^= d3; a8 ^= d3; a13 ^= d3; a18 ^= d3; a23 ^= d3;
    a4 ^= d4; a9 ^= d4; a14 ^= d4; a19 ^= d4; a24 ^= d4;

    const b0 = a0;
    const b10 = rotl64(a1, 1n);
    const b20 = rotl64(a2, 62n);
    const b5 = rotl64(a3, 28n);
    const b15 = rotl64(a4, 27n);
    const b16 = rotl64(a5, 36n);
    const b1 = rotl64(a6, 44n);
    const b11 = rotl64(a7, 6n);
    const b21 = rotl64(a8, 55n);
    const b6 = rotl64(a9, 20n);
    const b7 = rotl64(a10, 3n);
    const b17 = rotl64(a11, 10n);
    const b2 = rotl64(a12, 43n);
    const b12 = rotl64(a13, 25n);
    const b22 = rotl64(a14, 39n);
    const b23 = rotl64(a15, 41n);
    const b8 = rotl64(a16, 45n);
    const b18 = rotl64(a17, 15n);
    const b3 = rotl64(a18, 21n);
    const b13 = rotl64(a19, 8n);
    const b14 = rotl64(a20, 18n);
    const b24 = rotl64(a21, 2n);
    const b9 = rotl64(a22, 61n);
    const b19 = rotl64(a23, 56n);
    const b4 = rotl64(a24, 14n);

    a0 = b0 ^ (~b1 & b2);
    a1 = b1 ^ (~b2 & b3);
    a2 = b2 ^ (~b3 & b4);
    a3 = b3 ^ (~b4 & b0);
    a4 = b4 ^ (~b0 & b1);
    a5 = b5 ^ (~b6 & b7);
    a6 = b6 ^ (~b7 & b8);
    a7 = b7 ^ (~b8 & b9);
    a8 = b8 ^ (~b9 & b5);
    a9 = b9 ^ (~b5 & b6);
    a10 = b10 ^ (~b11 & b12);
    a11 = b11 ^ (~b12 & b13);
    a12 = b12 ^ (~b13 & b14);
    a13 = b13 ^ (~b14 & b10);
    a14 = b14 ^ (~b10 & b11);
    a15 = b15 ^ (~b16 & b17);
    a16 = b16 ^ (~b17 & b18);
    a17 = b17 ^ (~b18 & b19);
    a18 = b18 ^ (~b19 & b15);
    a19 = b19 ^ (~b15 & b16);
    a20 = b20 ^ (~b21 & b22);
    a21 = b21 ^ (~b22 & b23);
    a22 = b22 ^ (~b23 & b24);
    a23 = b23 ^ (~b24 & b20);
    a24 = b24 ^ (~b20 & b21);

    a0 ^= rc[r];
  }

  s[0] = a0; s[1] = a1; s[2] = a2; s[3] = a3; s[4] = a4;
  s[5] = a5; s[6] = a6; s[7] = a7; s[8] = a8; s[9] = a9;
  s[10] = a10; s[11] = a11; s[12] = a12; s[13] = a13; s[14] = a14;
  s[15] = a15; s[16] = a16; s[17] = a17; s[18] = a18; s[19] = a19;
  s[20] = a20; s[21] = a21; s[22] = a22; s[23] = a23; s[24] = a24;
}

export function solvePow(
  challengeHex: string,
  salt: string,
  expireAt: number,
  difficulty: number
): number {
  if (challengeHex.length !== 64) {
    throw new Error("pow: challenge must be 64 hex chars");
  }

  const target = Buffer.from(challengeHex, "hex");
  const t0 = target.readBigUInt64LE(0);
  const t1 = target.readBigUInt64LE(8);
  const t2 = target.readBigUInt64LE(16);
  const t3 = target.readBigUInt64LE(24);

  const prefixStr = `${salt}_${expireAt}_`;
  const prefix = Buffer.from(prefixStr, "utf-8");
  const rate = 136;

  let baseState = new Array(25).fill(0n);
  let off = 0;
  while (off + rate <= prefix.length) {
    for (let i = 0; i < rate / 8; i++) {
      baseState[i] ^= prefix.readBigUInt64LE(off + i * 8);
    }
    keccakF23(baseState);
    off += rate;
  }

  const tailLen = prefix.length - off;
  const tail = Buffer.alloc(rate);
  prefix.copy(tail, 0, off);

  let numBuf = Buffer.alloc(20);

  for (let n = 0; n < difficulty; n++) {
    let v = n;
    let pos = 20;
    if (v === 0) {
      pos--;
      numBuf[pos] = 48; // '0'
    } else {
      while (v > 0) {
        pos--;
        numBuf[pos] = 48 + (v % 10);
        v = Math.floor(v / 10);
      }
    }

    const numLen = 20 - pos;
    let s = [...baseState];
    const totalTail = tailLen + numLen;

    if (totalTail < rate) {
      let buf = Buffer.alloc(rate);
      tail.copy(buf, 0, 0, tailLen);
      numBuf.copy(buf, tailLen, pos, 20);
      buf[totalTail] = 0x06;
      buf[rate - 1] |= 0x80;

      for (let i = 0; i < rate / 8; i++) {
        s[i] ^= buf.readBigUInt64LE(i * 8);
      }
      keccakF23(s);
    } else {
      let buf = Buffer.alloc(rate);
      tail.copy(buf, 0, 0, tailLen);
      numBuf.copy(buf, tailLen, pos, pos + (rate - tailLen));

      for (let i = 0; i < rate / 8; i++) {
        s[i] ^= buf.readBigUInt64LE(i * 8);
      }
      keccakF23(s);

      let buf2 = Buffer.alloc(rate);
      const rem = totalTail - rate;
      numBuf.copy(buf2, 0, pos + (rate - tailLen), pos + (rate - tailLen) + rem);
      buf2[rem] = 0x06;
      buf2[rate - 1] |= 0x80;

      for (let i = 0; i < rate / 8; i++) {
        s[i] ^= buf2.readBigUInt64LE(i * 8);
      }
      keccakF23(s);
    }

    if (s[0] === t0 && s[1] === t1 && s[2] === t2 && s[3] === t3) {
      return n;
    }
  }

  throw new Error("pow: no solution within difficulty");
}

export function buildPowHeader(
  challenge: {
    algorithm: string;
    challenge: string;
    salt: string;
    signature: string;
    target_path: string;
  },
  answer: number
): string {
  const payload = {
    algorithm: challenge.algorithm,
    challenge: challenge.challenge,
    salt: challenge.salt,
    answer,
    signature: challenge.signature,
    target_path: challenge.target_path,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function solveAndBuildHeader(challenge: any): string {
  if (challenge.algorithm !== "DeepSeekHashV1") {
    throw new Error("pow: unsupported algorithm: " + challenge.algorithm);
  }
  const difficulty = challenge.difficulty || 144000;
  const answer = solvePow(
    challenge.challenge,
    challenge.salt,
    challenge.expire_at,
    difficulty
  );
  return buildPowHeader(challenge, answer);
}
