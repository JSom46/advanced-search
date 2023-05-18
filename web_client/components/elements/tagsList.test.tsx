import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TagsList from "@/components/elements/tagsList";

jest.mock("next/router", () => require("next-router-mock"));

describe("TagsList", () => {
  it("renders the input field and tag columns", () => {
    const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4"];
    const area = "example";

    const { getByPlaceholderText, getAllByRole } = render(
      <TagsList tags={tags} area={area} />
    );

    const inputElement = getByPlaceholderText("Filter...");
    const columnElements = getAllByRole("list");

    expect(inputElement).toBeInTheDocument();
    expect(columnElements).toHaveLength(3);
  });

  it("filters tags based on input value", () => {
    const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Apple", "Orange"];
    const area = "example";

    const { getByPlaceholderText, getAllByRole } = render(
      <TagsList tags={tags} area={area} />
    );

    const inputElement = getByPlaceholderText("Filter...");

    fireEvent.input(inputElement, { target: { value: "tag" } });

    const tagElements = getAllByRole("link");

    expect(tagElements).toHaveLength(4);
    expect(tagElements[0]).toHaveTextContent("Tag 1");
    expect(tagElements[1]).toHaveTextContent("Tag 2");
    expect(tagElements[2]).toHaveTextContent("Tag 3");
    expect(tagElements[3]).toHaveTextContent("Tag 4");
  });
});
