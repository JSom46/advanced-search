import React from "react";
import Link from "next/link";
import styles from "@/styles/Tags.module.css";

export default function TagsGroupsList({
  groups,
  area,
}: {
  groups: string[];
  area: string;
}) {
  return (
    <ul className={styles["tags-groups-list"]}>
      {groups.map((g) => (
        <li key={g}>
          <Link href={encodeURI(`/tags/${area}/${g}`)}>{g}</Link>
        </li>
      ))}
    </ul>
  );
}
