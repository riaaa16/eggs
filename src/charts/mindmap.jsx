import React, { useRef, useEffect } from "react";
import { Markmap } from "markmap-view";
import { Transformer } from "markmap-lib";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";

const transformer = new Transformer();

function renderToolbar(mm, wrapper) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    toolbar.setItems([...Toolbar.defaultItems]);
    wrapper.append(toolbar.render());
  }
}

export default function Mindmap() {
  const refSvg = useRef();
  const refMm = useRef();
  const refToolbar = useRef();

  // Static mindmap content
  const value = `
# **Why is food so expensive today?**
## Groceries
### Price of goods have been increasing
### How does this compare to our minimum wage?
### We can actually afford more nowadays

## Food-spending distribution
### COVID-19 → Eat at home
### **Rise in Food-Delivery**
#### Grocery shoppers
#### Restaurants switch to food-delivery to maintain business
#### Delivery fees → net losses
#### Continued reliance on food-delivery post-pandemic
`;

  useEffect(() => {
    if (refMm.current) return;
    const mm = Markmap.create(refSvg.current, { maxWidth: 928, autofit: true });
    refMm.current = mm;
    renderToolbar(mm, refToolbar.current);
    const { root } = transformer.transform(value);
    mm.setData(root).then(() => {
      mm.fit();
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        ref={refSvg}
        style={{ width: "100%", height: 400, background: "#fff" }}
        viewBox="0 0 928 400"
        preserveAspectRatio="xMidYMid meet"
      />
      <div
        style={{ position: "absolute", bottom: 8, right: 8, zIndex: 2 }}
        ref={refToolbar}
      />
    </div>
  );
}