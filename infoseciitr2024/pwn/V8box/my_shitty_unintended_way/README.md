# TL;DR
1 - use the single read to read an offset in the isolate that contains:
- the 4 MSB bytes of the EPT, and assume the state of three LSB bytes (0xXX010000), and we guess the one byte left of the complete address.
- the 4 LSB bytes of an address in the d8 binary, and we can utilize the `Sandbox.getPIELeak` vuln.patch function to get the upper 4 MSB bytes, and now we have the d8 base!
2 - overwrite EPT entry of Math.max to point to a jop+rop chain, cf. [KITCTFCTF 2022 V8 Heap Sandbox Escape](https://ju256.de/posts/kitctfctf22-date/).
