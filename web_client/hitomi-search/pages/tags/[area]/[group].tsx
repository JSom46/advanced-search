import React from "react";
import { useRouter } from "next/router";
import TagsList from "@/components/elements/tagsList";
import TagsGroupsList from "@/components/elements/tagsGroupsList";

export default function Tag({
  tags,
  groups,
}: {
  tags: string[];
  groups: string[];
}) {
  const router = useRouter();
  const { area } = router.query;

  return (
    <>
      <TagsGroupsList groups={groups} area={area as string}></TagsGroupsList>
      <h1>{area}</h1>
      <TagsList tags={tags} area={area as string} />
    </>
  );
}

export function getStaticPaths() {
  const paths = (process.env.TAGS_AREAS as string)
    .split(" ")
    .map((a) =>
      (process.env.TAGS_AREAS_GROUPS as string).split(" ").map((g) => {
        return {
          params: {
            area: a,
            group: g,
          },
        };
      })
    )
    .reduce((prv, cur) => {
      return prv.concat(cur);
    }, []);

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { area: string; group: string };
}) {
  const res = await fetch(
    `${process.env.API_URL}/tags/${params.area}/${params.group}`
  );

  const tags = await res.json();

  return {
    props: {
      groups: (process.env.TAGS_AREAS_GROUPS as string).split(" "),
      tags: tags.tags,
    },
    revalidate: 60 * 60,
  };
}
