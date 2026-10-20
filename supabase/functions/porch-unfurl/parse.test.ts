// Run with: deno test supabase/functions/porch-unfurl/parse.test.ts
import { assertEquals } from "jsr:@std/assert@1";
import { acceptableUrl, isPrivateAddress, parseV6 } from "./parse.ts";

Deno.test("private and reserved IPv4", () => {
  for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1", "255.255.255.255", "192.0.2.5"]) {
    assertEquals(isPrivateAddress(ip), true, ip);
  }
  for (const ip of ["8.8.8.8", "1.1.1.1", "172.32.0.1"]) assertEquals(isPrivateAddress(ip), false, ip);
});

Deno.test("IPv4 hidden inside IPv6", () => {
  for (const ip of [
    "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:a9fe:a9fe", // mapped, dotted and hex
    "::127.0.0.1", "::7f00:1", "::a00:1", "::1", "::", // ::/96
    "64:ff9b::7f00:1", "64:ff9b::10.0.0.1", "64:ff9b:1::1", // NAT64
    "2002:7f00:1::", "2002:a9fe:a9fe::1", // 6to4
    "2001::1", "2001:db8::1", // Teredo, documentation
  ]) {
    assertEquals(isPrivateAddress(ip), true, ip);
  }
  for (const ip of ["::ffff:8.8.8.8", "::ffff:808:808", "64:ff9b::808:808", "2002:808:808::1", "2606:4700::1111"]) {
    assertEquals(isPrivateAddress(ip), false, ip);
  }
});

Deno.test("IPv6 local ranges, and unparseable input fails closed", () => {
  for (const ip of ["fc00::1", "fd12::1", "fe80::1%en0", "fec0::1", "ff02::1", "not-an-ip", "1:2:3:4:5:6:7:8:9", "::1::2"]) {
    assertEquals(isPrivateAddress(ip), true, ip);
  }
  assertEquals(parseV6("::ffff:7f00:1")?.slice(10), [0xff, 0xff, 127, 0, 0, 1]);
});

Deno.test("URL hostnames as the URL parser normalises them", () => {
  for (const raw of ["https://[::ffff:127.0.0.1]/", "https://[::127.0.0.1]/", "https://[64:ff9b::a9fe:a9fe]/", "https://[2002:7f00:1::]/", "https://127.1/", "https://0x7f000001/", "https://localhost/"]) {
    assertEquals(acceptableUrl(raw), null, raw);
  }
  assertEquals(acceptableUrl("https://example.org/a")?.hostname, "example.org");
});
