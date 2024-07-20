import { Card, CardContent, Grid, Typography, styled } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/services/products/productListModels";

// Define the props type for SortableProductItem
interface SortableProductItemProps {
  product: Product;
  onClick: (id: number) => void;
  style: { [key: string]: string };
}

const ProductImageContainer = styled("div")({
  position: "relative",
  width: "100%",
  height: "180px",
});

const Overlay = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.9 )", // Semi-transparent black
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  opacity: 1,
  transition: "opacity 0.3s",
  zIndex: 1, // Ensure it appears above other content
  pointerEvents: "none", // Allow clicks to pass through
}));

const CardContainer = styled(Card)(({ theme }) => ({
  position: "relative",
  transition: "opacity 0.3s", // Smooth transition for opacity
}));

function SortableProductItem({
  product,
  onClick,
  style,
}: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const handleClick = () => {
    // Toggle the active state of the product
    onClick(product.id);
  };

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      xl={2.4}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 999 : 1, // Apply higher z-index when dragging
        position: "relative",
      }}
      {...listeners}
      {...attributes}
    >
      <CardContainer
        style={{
          padding: 0,
          opacity: product.active ? 1 : 0.5, // Hide card if not active
          // pointerEvents: product.active ? "auto" : "none", // Enable/disable interactions
          ...style,
        }}
        onClick={handleClick}
        ref={setNodeRef}
      >
        <ProductImageContainer>
          <Image
            src={product.image}
            alt={product.title}
            layout="fill"
            objectFit="cover"
          />
          {!product.active && (
            <div onClick={handleClick}>
              <Overlay>Click to Activate</Overlay>
            </div>
          )}
        </ProductImageContainer>
        <CardContent sx={{ backgroundColor: "whitesmoke" }}>
          <Typography
            variant="h6"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              height: "40px",
            }}
          >
            {product.active && product.title}
          </Typography>
        </CardContent>
      </CardContainer>
    </Grid>
  );
}

export default SortableProductItem;
