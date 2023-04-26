import { useRouter } from "next/router";
import TagsGroupsList from "@/components/elements/tagsGroupsList";

export default function Index({ groups }: { groups: string[] }) {
  const router = useRouter();
  const { area } = router.query;

  return (
    <>
      <h1>{area}</h1>
      <TagsGroupsList groups={groups} area={area as string}></TagsGroupsList>
    </>
  );
}

export function getStaticPaths() {
  const paths = (process.env.TAGS_AREAS as string).split(" ").map((a) => {
    return {
      params: {
        area: a,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {
      groups: (process.env.TAGS_AREAS_GROUPS as string).split(" "),
    },
    revalidate: 60 * 60,
  };
}
