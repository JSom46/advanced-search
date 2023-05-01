import React, { useEffect, useState } from "react";
import styles from "@/styles/Tags.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export default function TagsList({
  tags,
  area,
}: {
  tags: string[];
  area: string;
}) {
  const [filterText, setFilterText] = useState("");
  const router = useRouter();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      setFilterText("");
    });
  });

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(filterText.toLowerCase())
  );
  const elementsPerColumn = Math.ceil(filteredTags.length / 3);
  const columns = [
    filteredTags.slice(0, elementsPerColumn),
    filteredTags.slice(elementsPerColumn, elementsPerColumn * 2),
    filteredTags.slice(elementsPerColumn * 2),
  ];

  return (
    <>
      <input
        type="text"
        placeholder="Filter..."
        value={filterText}
        onInput={handleFilterChange}
      />
      <div className={styles["flex-container"]}>
        {columns.map((column, idx) => (
          <ul key={idx} className={styles["flex-element"]}>
            {column.map((tag) => (
              <li key={tag}>
                <Link href={encodeURI(`/tags/${area}/${tag}`)}>{tag}</Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </>
  );
}
