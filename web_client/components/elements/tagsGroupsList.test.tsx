import React from "react";
import { render } from "@testing-library/react";
import TagsGroupsList from "@/components/elements/tagsGroupsList";

describe("TagsGroupsList", () => {
  it("renders a list of tags groups", () => {
    const groups = ["Group 1", "Group 2", "Group 3"];
    const area = "example";

    const { getAllByRole } = render(
      <TagsGroupsList groups={groups} area={area} />
    );

    const listItems = getAllByRole("listitem");

    expect(listItems).toHaveLength(groups.length);

    groups.forEach((group, index) => {
      expect(listItems[index]).toHaveTextContent(group);
    });
  });

  it("encodes the link href correctly", () => {
    const groups = ["Group 1", "Group-2", "Group 3", "Group 4.0"];
    const area = "example area";

    const { getByText } = render(
      <TagsGroupsList groups={groups} area={area} />
    );

    groups.forEach((group) => {
      const linkElement = getByText(group);
      const encodedHref = encodeURI(`/tags/${area}/${group}`);

      expect(linkElement).toHaveAttribute("href", encodedHref);
    });
  });

  it("renders an empty list when groups is an empty array", () => {
    const groups: string[] = [];
    const area = "example";

    const { queryByRole } = render(
      <TagsGroupsList groups={groups} area={area} />
    );

    const list = queryByRole("list");

    expect(list?.children.length).toEqual(0);
  });
});
