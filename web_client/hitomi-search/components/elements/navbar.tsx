import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li key="1">
          <Link href="/">Home</Link>
        </li>
        <li key="2">
          <Link href="/tags/tags">Tags</Link>
        </li>
        <li key="3">
          <Link href="/tags/series">Series</Link>
        </li>
        <li key="4">
          <Link href="/tags/characters">Characters</Link>
        </li>
        <li key="5">
          <Link href="/tags/artists">Artists</Link>
        </li>
        <li key="6">
          <Link href="/tags/languages">Languages</Link>
        </li>
        <li key="7">
          <Link href="/query">Query</Link>
        </li>
      </ul>
    </nav>
  );
}
