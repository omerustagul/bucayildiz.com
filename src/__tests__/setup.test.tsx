import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { POST_TEMPLATES, POST_TEMPLATE_IDS } from "@/lib/enums";

function Greeting({ name }: { name: string }) {
  return <h1>Merhaba {name}</h1>;
}

describe("vitest kurulumu", () => {
  describe("modül çözümleme (@/ alias)", () => {
    it("should resolve src modules when using the @/ alias", () => {
      expect(POST_TEMPLATE_IDS).toHaveLength(POST_TEMPLATES.length);
    });
  });

  describe("react + jsdom + testing-library", () => {
    it("should render a component when mounted in jsdom", () => {
      render(<Greeting name="Buca Yıldız" />);
      expect(
        screen.getByRole("heading", { level: 1, name: "Merhaba Buca Yıldız" })
      ).toBeInTheDocument();
    });
  });
});
