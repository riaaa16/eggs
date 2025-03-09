import React, { useEffect, useRef } from "react";
import { Markmap } from "markmap-view";
import { Transformer } from "markmap-lib";

const Mindmap = () => {
  const svgRef = useRef(null); // Set SVG reference
  const initialized = useRef(false); // Set initialization
  const transformer = new Transformer(); // To transform markdown to map

  useEffect(() => {
    // Only initialize once
    if (!svgRef.current || initialized.current) return;
    
    initialized.current = true;
    
    // Clear SVG first to prevent duplicates
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    const mm = Markmap.create(svgRef.current, { // Create markmap
      maxWidth: 928,
      colorFreezeLevel: 2, // How many different colors you want per node
      spacingHorizontal: 100,
      spacingVertical: 20,
      autofit: true
    });

    const markdown = `
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

    const { root } = transformer.transform(markdown); // Transform markdown
    mm.setData(root); // Set data
    mm.fit();
    mm.rescale(0.6); // Set initial zoom

  }, []);

  // Return markmap
  return <svg ref={svgRef} style={{ width: "100%", height: "400px" }} />;
};

export default Mindmap;